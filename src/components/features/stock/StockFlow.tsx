'use client';

import {
  confirmStockLog,
  parseAndSaveStockDraft,
  type ConfirmStockInput,
} from '@/app/actions/stock';
import { VoiceInputButton } from '@/components/features/stock/VoiceInputButton';
import { AppLayout } from '@/components/layout/AppLayout';
import { Banner, InlineAlert } from '@/components/ui-kit/notifications';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkInput } from '@/components/ui-kit/primitives/sk-input';
import { SkPill } from '@/components/ui-kit/primitives/sk-pill';
import { SkSkeleton } from '@/components/ui-kit/primitives/sk-skeleton';
import { SkTextarea } from '@/components/ui-kit/primitives/sk-textarea';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { THRESHOLDS } from '@/lib/config/thresholds';
import { common } from '@/lib/copy/common';
import { stock as t } from '@/lib/copy/stock';
import { listDrafts, pushDraft, removeDraft, type OfflineDraft } from '@/lib/offline/draft-queue';
import type { ParsedStockPayload } from '@/types/domain';
import { useRouter } from 'next/navigation';
import * as React from 'react';

type Phase = 'input' | 'parsing' | 'confirm' | 'saving' | 'error' | 'offline-queued';

type EditableItem = {
  menuItemId: string | null;
  candidateName: string;
  sold: number | null;
  leftover: number | null;
  unit: string;
  confidence: 'high' | 'medium' | 'low';
};

export function StockFlow({ voiceEnabled = false }: { voiceEnabled?: boolean }) {
  const router = useRouter();
  const online = useOnlineStatus();
  const [phase, setPhase] = React.useState<Phase>('input');
  const [rawInput, setRawInput] = React.useState('');
  const [draftId, setDraftId] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<EditableItem[]>([]);
  const [weather, setWeather] = React.useState<ParsedStockPayload['weatherMention']>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [drafts, setDrafts] = React.useState<OfflineDraft[]>([]);

  const todayIso = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  const refreshDrafts = React.useCallback(() => {
    void listDrafts()
      .then(setDrafts)
      .catch(() => undefined);
  }, []);

  React.useEffect(() => {
    refreshDrafts();
  }, [refreshDrafts, online]);

  async function handleParse() {
    const value = rawInput.trim();
    if (value.length === 0) {
      setErrorMessage(t.errors.empty);
      setPhase('error');
      return;
    }
    if (value.length > THRESHOLDS.STOCK_NOTE_MAX_CHARS) {
      setErrorMessage(t.errors.too_long);
      setPhase('error');
      return;
    }

    // Offline path: persist raw input to IndexedDB. Parse + confirm need
    // network (AI + DB); user is shown a queued-state card instead of error.
    if (!online) {
      try {
        await pushDraft({ rawInput: value, serviceDate: todayIso });
        setRawInput('');
        setErrorMessage(null);
        setPhase('offline-queued');
        refreshDrafts();
      } catch {
        setErrorMessage(t.errors.save_failed);
        setPhase('error');
      }
      return;
    }

    setPhase('parsing');
    setErrorMessage(null);
    await runParseWithRetry(value, 0);
  }

  async function handleRestoreDraft(draft: OfflineDraft) {
    setRawInput(draft.rawInput);
    setPhase('input');
    setErrorMessage(null);
    await removeDraft(draft.id).catch(() => undefined);
    refreshDrafts();
  }

  async function handleDiscardDraft(draft: OfflineDraft) {
    await removeDraft(draft.id).catch(() => undefined);
    refreshDrafts();
  }

  // Auto-retry once on AI_PARSE_FAILED — Gemini is occasionally flaky on
  // first call; a single silent retry recovers without surfacing churn to
  // the user. Other error codes surface immediately.
  async function runParseWithRetry(value: string, attempt: number) {
    const result = await parseAndSaveStockDraft({
      rawInput: value,
      serviceDate: todayIso,
    });

    if (result.error) {
      if (result.error.code === 'AI_PARSE_FAILED' && attempt < 1) {
        await runParseWithRetry(value, attempt + 1);
        return;
      }
      setErrorMessage(result.error.message || t.errors.parse_failed);
      setPhase('error');
      return;
    }

    setDraftId(result.data.draftId);
    setItems(
      result.data.parsed.items.map((it) => ({
        menuItemId: it.menuItemId,
        candidateName: it.candidateName,
        sold: it.sold,
        leftover: it.leftover,
        unit: it.unit ?? 'porsi',
        confidence: it.confidence,
      })),
    );
    setWeather(result.data.parsed.weatherMention);
    setPhase('confirm');
  }

  async function handleConfirm() {
    if (!draftId) return;
    const validItems: ConfirmStockInput['items'] = items
      .filter((it) => it.menuItemId !== null)
      .map((it) => ({
        menu_item_id: it.menuItemId!,
        sold: it.sold ?? 0,
        leftover: it.leftover ?? 0,
        unit: it.unit,
      }));

    if (validItems.length === 0) {
      setErrorMessage('Belum ada item yang cocok ke menu kamu.');
      setPhase('error');
      return;
    }

    setPhase('saving');
    const result = await confirmStockLog({ draftId, items: validItems });
    if (result.error) {
      setErrorMessage(result.error.message || t.errors.save_failed);
      setPhase('error');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  function handleBackToInput() {
    setPhase('input');
    setErrorMessage(null);
  }

  function appendVoiceTranscript(text: string) {
    setRawInput((prev) => {
      const sep = prev.trim().length === 0 ? '' : ' ';
      return prev + sep + text;
    });
  }

  return (
    <AppLayout title="Catat Stok">
      <div className="flex flex-col gap-4 px-4 pt-4">
        {phase === 'confirm' ? (
          <ConfirmCard
            items={items}
            weather={weather}
            onChange={setItems}
            onConfirm={handleConfirm}
            onEdit={handleBackToInput}
          />
        ) : phase === 'parsing' ? (
          <ParseLoadingCard />
        ) : phase === 'saving' ? (
          <StatusBlock title={common.state.saving} />
        ) : phase === 'offline-queued' ? (
          <OfflineQueuedCard onAgain={() => setPhase('input')} />
        ) : (
          <InputBlock
            value={rawInput}
            online={online}
            drafts={drafts}
            onChange={setRawInput}
            onSubmit={handleParse}
            onRestoreDraft={handleRestoreDraft}
            onDiscardDraft={handleDiscardDraft}
            loading={false}
            errorMessage={phase === 'error' ? errorMessage : null}
            voiceEnabled={voiceEnabled}
            onVoiceTranscript={appendVoiceTranscript}
          />
        )}
      </div>
    </AppLayout>
  );
}

function ParseLoadingCard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{t.parsing.heading}</h1>
        <p className="text-base text-neutral-600">{t.parsing.subheading}</p>
      </div>
      <SkCard>
        <div style={{ padding: '1rem' }} aria-busy aria-live="polite">
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-button flex flex-col gap-2 border border-neutral-200 bg-neutral-100 p-3"
              >
                <div className="flex items-center justify-between">
                  <SkSkeleton style={{ height: 16, width: 128 }} />
                  <SkSkeleton style={{ height: 12, width: 64 }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <SkSkeleton style={{ height: 40 }} />
                  <SkSkeleton style={{ height: 40 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SkCard>
    </div>
  );
}

function InputBlock(props: {
  value: string;
  online: boolean;
  drafts: OfflineDraft[];
  onChange: (v: string) => void;
  onSubmit: () => void;
  onRestoreDraft: (draft: OfflineDraft) => void;
  onDiscardDraft: (draft: OfflineDraft) => void;
  loading: boolean;
  errorMessage: string | null;
  voiceEnabled: boolean;
  onVoiceTranscript: (text: string) => void;
}) {
  const len = props.value.length;
  const submitLabel = props.online ? t.input.submit : t.input.offline_submit;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{t.input.heading}</h1>
        <p className="text-base text-neutral-600">{t.input.subheading}</p>
      </div>
      {!props.online ? (
        <Banner kind="warn" title="Mode offline" message={t.offline.offline_indicator} />
      ) : null}
      {props.drafts.length > 0 ? (
        <OfflineDraftsBanner
          drafts={props.drafts}
          onRestore={props.onRestoreDraft}
          onDiscard={props.onDiscardDraft}
        />
      ) : null}
      {props.voiceEnabled ? (
        <div className="flex items-center justify-end">
          <VoiceInputButton onTranscript={props.onVoiceTranscript} />
        </div>
      ) : null}
      <SkTextarea
        rows={6}
        autoFocus
        placeholder={t.input.placeholder}
        value={props.value}
        onChange={props.onChange}
        maxLength={THRESHOLDS.STOCK_NOTE_MAX_CHARS}
        invalid={Boolean(props.errorMessage)}
      />
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>{t.input.char_limit_label}</span>
        <span>
          {len} / {THRESHOLDS.STOCK_NOTE_MAX_CHARS}
        </span>
      </div>
      {props.errorMessage ? (
        <InlineAlert kind="danger" title="Belum bisa diproses">
          <span role="alert">{props.errorMessage}</span>
        </InlineAlert>
      ) : null}
      <SkButton
        variant="brand"
        size="lg"
        full
        disabled={props.loading || props.value.trim().length === 0}
        onClick={props.onSubmit}
      >
        {props.loading ? t.input.parsing : submitLabel}
      </SkButton>
    </div>
  );
}

function OfflineDraftsBanner(props: {
  drafts: OfflineDraft[];
  onRestore: (draft: OfflineDraft) => void;
  onDiscard: (draft: OfflineDraft) => void;
}) {
  const latest = props.drafts[props.drafts.length - 1];
  if (!latest) return null;
  return (
    <SkCard style={{ borderColor: 'var(--sk-brand)', background: 'var(--sk-brand-soft)' }}>
      <div style={{ padding: '0.75rem' }}>
        <p className="text-brand-700 text-xs font-semibold tracking-wider uppercase">
          {t.offline.banner_draft_available} · {props.drafts.length}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-700">{latest.rawInput}</p>
        <div className="mt-3 flex items-center gap-2">
          <SkButton size="sm" onClick={() => props.onRestore(latest)}>
            {t.offline.banner_restore}
          </SkButton>
          <SkButton size="sm" variant="ghost" onClick={() => props.onDiscard(latest)}>
            {t.offline.banner_discard}
          </SkButton>
        </div>
      </div>
    </SkCard>
  );
}

function OfflineQueuedCard({ onAgain }: { onAgain: () => void }) {
  return (
    <SkCard>
      <div style={{ padding: '1rem' }} aria-live="polite">
        <p className="text-base font-semibold text-neutral-900">{t.offline.queued_title}</p>
        <p className="mt-1 text-sm text-neutral-600">{t.offline.queued_description}</p>
        <div className="mt-4">
          <SkButton onClick={onAgain}>{t.offline.queued_again}</SkButton>
        </div>
      </div>
    </SkCard>
  );
}

function ConfirmCard(props: {
  items: EditableItem[];
  weather: ParsedStockPayload['weatherMention'];
  onChange: (items: EditableItem[]) => void;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  function update(idx: number, patch: Partial<EditableItem>) {
    props.onChange(props.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  return (
    <SkCard>
      <div style={{ padding: '1rem' }}>
        <p className="text-base font-semibold text-neutral-900">{t.confirm.heading}</p>
        <p className="mt-0.5 text-sm text-neutral-600">{t.confirm.subheading}</p>
        <div className="mt-3 flex flex-col gap-3">
          {props.items.map((it, idx) => (
            <ItemRow key={idx} item={it} onChange={(patch) => update(idx, patch)} />
          ))}
        </div>
        {props.weather ? (
          <p className="mt-2 text-sm text-neutral-600">🌤 {t.confirm.weather[props.weather]}</p>
        ) : null}
        <div className="mt-4 flex items-center justify-between gap-2">
          <SkButton variant="ghost" size="sm" onClick={props.onEdit}>
            {t.confirm.edit}
          </SkButton>
          <SkButton variant="brand" onClick={props.onConfirm}>
            {t.confirm.save}
          </SkButton>
        </div>
      </div>
    </SkCard>
  );
}

function ItemRow(props: { item: EditableItem; onChange: (patch: Partial<EditableItem>) => void }) {
  const { item } = props;
  const confidenceLabel =
    item.confidence === 'high'
      ? t.confirm.item.high_confidence
      : item.confidence === 'medium'
        ? t.confirm.item.medium_confidence
        : t.confirm.item.low_confidence;
  const pillTone =
    item.confidence === 'high' ? 'success' : item.confidence === 'medium' ? 'warn' : 'danger';

  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-neutral-200 bg-neutral-100 p-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-neutral-900">{item.candidateName}</span>
        <SkPill tone={pillTone}>{confidenceLabel}</SkPill>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label={t.confirm.item.sold_label}
          value={item.sold}
          onChange={(v) => props.onChange({ sold: v })}
        />
        <NumberField
          label={t.confirm.item.leftover_label}
          value={item.leftover}
          onChange={(v) => props.onChange({ leftover: v })}
        />
      </div>
      {item.menuItemId === null ? (
        <p className="text-warning text-xs">
          Belum cocok ke menu kamu — bakal di-skip pas disimpan.
        </p>
      ) : null}
    </div>
  );
}

function NumberField(props: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-neutral-600">{props.label}</span>
      <SkInput
        type="number"
        inputMode="numeric"
        min={0}
        max={10000}
        value={String(props.value ?? '')}
        onChange={(v) => {
          props.onChange(v === '' ? null : Math.max(0, Number(v)));
        }}
      />
    </label>
  );
}

function StatusBlock(props: { title: string }) {
  return (
    <SkCard>
      <div style={{ padding: '1rem' }}>
        <p className="text-base text-neutral-700">{props.title}</p>
      </div>
    </SkCard>
  );
}
