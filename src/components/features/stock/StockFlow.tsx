'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { SubuhToggle } from '@/components/features/subuh/SubuhToggle';
import { VoiceInputButton } from '@/components/features/stock/VoiceInputButton';
import { stock as t } from '@/lib/copy/stock';
import { common } from '@/lib/copy/common';
import { THRESHOLDS } from '@/lib/config/thresholds';
import {
  parseAndSaveStockDraft,
  confirmStockLog,
  type ConfirmStockInput,
} from '@/app/actions/stock';
import type { ParsedStockPayload } from '@/types/domain';
import { useOnlineStatus } from '@/hooks/use-online-status';
import {
  listDrafts,
  pushDraft,
  removeDraft,
  type OfflineDraft,
} from '@/lib/offline/draft-queue';

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

  if (phase === 'confirm') {
    return (
      <ConfirmCard
        items={items}
        weather={weather}
        onChange={setItems}
        onConfirm={handleConfirm}
        onEdit={handleBackToInput}
      />
    );
  }

  if (phase === 'parsing') {
    return <ParseLoadingCard />;
  }

  if (phase === 'saving') {
    return <StatusBlock title={common.state.saving} />;
  }

  if (phase === 'offline-queued') {
    return <OfflineQueuedCard onAgain={() => setPhase('input')} />;
  }

  return (
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
  );
}

function ParseLoadingCard() {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          {t.parsing.heading}
        </h1>
        <p className="text-base text-neutral-600">{t.parsing.subheading}</p>
      </header>
      <Card aria-busy aria-live="polite">
        <CardContent>
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-button border border-neutral-200 bg-neutral-100 p-3"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{t.input.heading}</h1>
          <p className="text-base text-neutral-600">{t.input.subheading}</p>
        </div>
        <div className="flex items-center gap-2">
          <CancelCatatLink />
          <SubuhToggle />
        </div>
      </header>
      {!props.online ? (
        <p className="rounded-button border border-warning/40 bg-warning/10 px-3 py-2 text-xs font-semibold text-warning">
          {t.offline.offline_indicator}
        </p>
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
      <Textarea
        rows={6}
        autoFocus
        placeholder={t.input.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
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
        <p role="alert" className="text-danger text-sm">
          {props.errorMessage}
        </p>
      ) : null}
      <Button
        type="button"
        size="lg"
        loading={props.loading}
        disabled={props.loading || props.value.trim().length === 0}
        onClick={props.onSubmit}
      >
        {props.loading ? t.input.parsing : submitLabel}
      </Button>
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
    <Card className="border-brand-200 bg-brand-50">
      <CardContent>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
          {t.offline.banner_draft_available} · {props.drafts.length}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-700">{latest.rawInput}</p>
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" onClick={() => props.onRestore(latest)}>
            {t.offline.banner_restore}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => props.onDiscard(latest)}>
            {t.offline.banner_discard}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OfflineQueuedCard({ onAgain }: { onAgain: () => void }) {
  return (
    <Card aria-live="polite">
      <CardHeader>
        <CardTitle>{t.offline.queued_title}</CardTitle>
        <CardDescription>{t.offline.queued_description}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-between">
        <CancelCatatLink />
        <Button onClick={onAgain}>{t.offline.queued_again}</Button>
      </CardFooter>
    </Card>
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
    <Card>
      <CardHeader>
        <CardTitle>{t.confirm.heading}</CardTitle>
        <CardDescription>{t.confirm.subheading}</CardDescription>
      </CardHeader>
      <CardContent>
        {props.items.map((it, idx) => (
          <ItemRow key={idx} item={it} onChange={(patch) => update(idx, patch)} />
        ))}
        {props.weather ? (
          <p className="mt-2 text-sm text-neutral-600">🌤 {t.confirm.weather[props.weather]}</p>
        ) : null}
      </CardContent>
      <CardFooter className="justify-between">
        <CancelCatatLink />
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={props.onEdit}>
            {t.confirm.edit}
          </Button>
          <Button onClick={props.onConfirm}>{t.confirm.save}</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function CancelCatatLink() {
  return (
    <Link href="/dashboard">
      <Button variant="ghost" size="sm">
        {t.cancel}
      </Button>
    </Link>
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
  const confidenceTone =
    item.confidence === 'high'
      ? 'text-success'
      : item.confidence === 'medium'
        ? 'text-warning'
        : 'text-danger';

  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-neutral-200 bg-neutral-100 p-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-neutral-900">{item.candidateName}</span>
        <span className={`text-xs font-semibold ${confidenceTone}`}>{confidenceLabel}</span>
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
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        max={10000}
        value={props.value ?? ''}
        onChange={(e) => {
          const next = e.target.value;
          props.onChange(next === '' ? null : Math.max(0, Number(next)));
        }}
      />
    </label>
  );
}

function StatusBlock(props: { title: string }) {
  return (
    <Card>
      <CardContent>
        <p className="text-base text-neutral-700">{props.title}</p>
      </CardContent>
    </Card>
  );
}
