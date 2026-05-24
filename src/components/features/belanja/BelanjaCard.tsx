'use client';

import type { BelanjaCardData } from '@/app/actions/recommendation';
import { glyphFor } from '@/components/ui-kit/glyphs';
import { IconClose, IconPlus, IconShop, IconTrash, IconWhatsapp } from '@/components/ui-kit/icons';
import { Toast } from '@/components/ui-kit/notifications';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkPill } from '@/components/ui-kit/primitives/sk-pill';
import { belanja } from '@/lib/copy/belanja';
import { weekdayFromServiceDate } from '@/lib/utils';
import * as React from 'react';

type BelanjaItem = BelanjaCardData['items'][number];
type ModalState =
  | { mode: 'create'; draft: ItemDraft }
  | { mode: 'edit'; itemId: string; draft: ItemDraft }
  | null;

type ItemDraft = {
  menuName: string;
  unit: string;
  suggested: string;
  delta: string;
  reasoning: string;
};

export function BelanjaCard({ data }: { data: BelanjaCardData }) {
  const [copied, setCopied] = React.useState(false);
  const [items, setItems] = React.useState<BelanjaItem[]>(data.items);
  const [modal, setModal] = React.useState<ModalState>(null);

  React.useEffect(() => {
    setItems(data.items);
  }, [data.items]);

  const weekdayLabel = React.useMemo(() => {
    const idx = weekdayFromServiceDate(data.serviceDate);
    return belanja.weekday[idx] ?? '';
  }, [data.serviceDate]);

  const confidenceTone =
    data.confidenceLabel === 'Pola jelas'
      ? 'success'
      : data.confidenceLabel === 'Data baru, hati-hati'
        ? 'warn'
        : ('danger' as const);

  async function handleCopy() {
    const text = buildShareText({ ...data, items }, weekdayLabel);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Salin manual:', text);
    }
  }

  function openCreate() {
    setModal({
      mode: 'create',
      draft: {
        menuName: '',
        unit: 'porsi',
        suggested: '',
        delta: '0',
        reasoning: '',
      },
    });
  }

  function openEdit(item: BelanjaItem) {
    setModal({ mode: 'edit', itemId: item.menuItemId, draft: toDraft(item) });
  }

  function updateDraft(patch: Partial<ItemDraft>) {
    setModal((current) =>
      current ? { ...current, draft: { ...current.draft, ...patch } } : current,
    );
  }

  function saveDraft() {
    if (!modal) return;
    const next = draftToItem(modal.draft, data.confidenceLabel);
    if (!next) return;

    if (modal.mode === 'create') {
      setItems((current) => [...current, { ...next, menuItemId: `local-${Date.now()}` }]);
    } else {
      setItems((current) =>
        current.map((item) =>
          item.menuItemId === modal.itemId
            ? { ...item, ...next, menuItemId: item.menuItemId }
            : item,
        ),
      );
    }
    setModal(null);
  }

  function deleteActiveItem() {
    if (!modal || modal.mode !== 'edit') return;
    setItems((current) => current.filter((item) => item.menuItemId !== modal.itemId));
    setModal(null);
  }

  return (
    <SkCard
      signature
      className="belanja-card-reveal belanja-card-surface sk-grain border-brand-100"
      style={{
        display: 'flex',
        maxHeight: 'calc(100dvh - 148px)',
        minHeight: 0,
        overflow: 'hidden',
        boxShadow: 'var(--sk-shadow-card), 0 4px 16px rgba(26,22,17,0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          minHeight: 0,
          width: '100%',
          flexDirection: 'column',
          padding: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            paddingBottom: 10,
            borderBottom: '1px solid var(--sk-line)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              className="sk-display"
              style={{
                color: 'var(--sk-text-2)',
                fontSize: 12,
                lineHeight: 1,
              }}
            >
              {belanja.heading}
            </div>
            <h2
              style={{
                marginTop: 4,
                color: 'var(--sk-text)',
                fontSize: 16,
                fontWeight: 750,
                lineHeight: 1.08,
              }}
            >
              {weekdayLabel}, {formatLongDate(data.serviceDate)}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <SkPill tone={confidenceTone} dot>
              {items.length} item
            </SkPill>
            <SkButton
              variant="brand"
              size="sm"
              leading={<IconPlus size={15} />}
              onClick={openCreate}
              aria-label="Tambah item"
              style={{ minHeight: 34 }}
            >
              Tambah
            </SkButton>
          </div>
        </div>

        <ul
          aria-label="Daftar belanja"
          className="belanja-item-scroll"
          style={{
            display: 'flex',
            minHeight: 0,
            flex: 1,
            flexDirection: 'column',
            gap: 8,
            marginTop: 10,
            overflowY: 'auto',
            paddingRight: 2,
          }}
        >
          {items.map((item, idx) => (
            <li key={item.menuItemId} className="belanja-item-reveal">
              <ItemButton item={item} index={idx} onClick={() => openEdit(item)} />
            </li>
          ))}
        </ul>

        <div
          style={{
            display: 'grid',
            gap: 8,
            paddingTop: 10,
            borderTop: '1px solid var(--sk-line)',
          }}
        >
          <p
            style={{
              minWidth: 0,
              margin: 0,
              overflow: 'hidden',
              color: 'var(--sk-text-3)',
              fontSize: 12,
              lineHeight: 1.35,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.summary}
          </p>
          <SkButton
            variant="brand"
            size="md"
            full
            leading={<IconWhatsapp size={15} />}
            onClick={handleCopy}
            aria-label={belanja.share.copy}
            style={{ minHeight: 40 }}
          >
            {copied ? belanja.share.copied : belanja.share.copy}
          </SkButton>
        </div>

        {copied ? (
          <div className="mt-3">
            <Toast
              kind="success"
              title={belanja.share.copied}
              message="Tinggal paste ke WhatsApp langganan."
              onClose={() => setCopied(false)}
            />
          </div>
        ) : null}
      </div>

      {modal ? (
        <ItemModal
          mode={modal.mode}
          draft={modal.draft}
          canSave={canSave(modal.draft)}
          onChange={updateDraft}
          onClose={() => setModal(null)}
          onDelete={modal.mode === 'edit' ? deleteActiveItem : undefined}
          onSave={saveDraft}
        />
      ) : null}
    </SkCard>
  );
}

function ItemButton({
  item,
  index,
  onClick,
}: {
  item: BelanjaItem;
  index: number;
  onClick: () => void;
}) {
  const delta = Math.round(item.suggested - item.base);
  return (
    <button
      type="button"
      aria-label={`Ubah ${item.menuName}`}
      className="belanja-item-reveal"
      onClick={onClick}
      style={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: '32px minmax(0, 1fr) auto',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        border: '1px solid var(--sk-line)',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.68)',
        color: 'inherit',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        animationDelay: `${100 + index * 45}ms`,
      }}
    >
      <ItemGlyph name={item.menuName} />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: 'var(--sk-text)',
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.menuName}
        </div>
        <p
          style={{
            color: 'var(--sk-text-3)',
            fontSize: 12,
            lineHeight: 1.35,
            margin: 0,
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {formatItemNote(item)}
        </p>
      </div>
      <div style={{ minWidth: 64, textAlign: 'right' }}>
        {delta !== 0 ? (
          <div
            className="sk-mono"
            style={{ color: trendColor(delta), fontSize: 12, lineHeight: 1 }}
          >
            {formatDelta(delta)}
          </div>
        ) : null}
        <div
          className="sk-mono"
          style={{
            marginTop: delta !== 0 ? 3 : 0,
            color: 'var(--sk-text)',
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          {Math.round(item.suggested)}
          <span
            style={{
              marginLeft: 4,
              color: 'var(--sk-text-3)',
              fontFamily: 'var(--sk-font)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: 0,
            }}
          >
            {item.unit}
          </span>
        </div>
      </div>
    </button>
  );
}

function ItemModal({
  mode,
  draft,
  canSave: saveEnabled,
  onChange,
  onClose,
  onDelete,
  onSave,
}: {
  mode: 'create' | 'edit';
  draft: ItemDraft;
  canSave: boolean;
  onChange: (patch: Partial<ItemDraft>) => void;
  onClose: () => void;
  onDelete?: () => void;
  onSave: () => void;
}) {
  const title = mode === 'create' ? 'Tambah item' : 'Edit item';
  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(26,22,17,0.34)',
        padding: 12,
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="sk-card sk-grain"
        style={{
          width: 'min(100%, 460px)',
          borderRadius: 12,
          padding: 16,
          boxShadow: 'var(--sk-shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: 0, color: 'var(--sk-text)', fontSize: 17, fontWeight: 750 }}>
              {title}
            </h3>
            <p style={{ margin: '3px 0 0', color: 'var(--sk-text-3)', fontSize: 12 }}>
              Kelola item langsung dari kartu belanja.
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            style={{
              display: 'grid',
              width: 34,
              height: 34,
              placeItems: 'center',
              border: '1px solid var(--sk-line)',
              borderRadius: 8,
              background: 'var(--sk-surface)',
              color: 'var(--sk-text-2)',
            }}
          >
            <IconClose size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          <Field label="Item" htmlFor="belanja-item-name">
            <input
              className="sk-input"
              id="belanja-item-name"
              value={draft.menuName}
              onChange={(event) => onChange({ menuName: event.target.value })}
              autoFocus
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.9fr', gap: 8 }}>
            <Field label="Fluktuasi" htmlFor="belanja-item-delta">
              <input
                className="sk-input"
                id="belanja-item-delta"
                value={draft.delta}
                onChange={(event) => onChange({ delta: event.target.value })}
                inputMode="numeric"
                placeholder="+2"
              />
            </Field>
            <Field label="Jumlah" htmlFor="belanja-item-amount">
              <input
                className="sk-input"
                id="belanja-item-amount"
                value={draft.suggested}
                onChange={(event) => onChange({ suggested: event.target.value })}
                inputMode="numeric"
              />
            </Field>
            <Field label="Unit" htmlFor="belanja-item-unit">
              <input
                className="sk-input"
                id="belanja-item-unit"
                value={draft.unit}
                onChange={(event) => onChange({ unit: event.target.value })}
              />
            </Field>
          </div>

          <Field label="Info" htmlFor="belanja-item-info">
            <textarea
              className="sk-input sk-textarea"
              id="belanja-item-info"
              rows={3}
              value={draft.reasoning}
              onChange={(event) => onChange({ reasoning: event.target.value })}
            />
          </Field>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: onDelete ? 'auto 1fr 1fr' : '1fr 1fr',
            gap: 8,
            marginTop: 16,
          }}
        >
          {onDelete ? (
            <SkButton
              variant="ghost"
              size="md"
              leading={<IconTrash size={15} />}
              onClick={onDelete}
              aria-label="Hapus"
            >
              Hapus
            </SkButton>
          ) : null}
          <SkButton variant="secondary" size="md" full onClick={onClose}>
            Batal
          </SkButton>
          <SkButton variant="brand" size="md" full type="submit" disabled={!saveEnabled}>
            Simpan
          </SkButton>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={htmlFor} style={{ color: 'var(--sk-text-2)', fontSize: 13, fontWeight: 650 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function ItemGlyph({ name }: { name: string }) {
  const Glyph = glyphFor(name);
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'var(--sk-surface-2)',
        color: 'var(--sk-text-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Glyph ? <Glyph size={22} /> : <IconShop size={16} />}
    </div>
  );
}

function toDraft(item: BelanjaItem): ItemDraft {
  return {
    menuName: item.menuName,
    unit: item.unit,
    suggested: String(Math.round(item.suggested)),
    delta: formatDelta(Math.round(item.suggested - item.base)),
    reasoning: item.reasoning,
  };
}

function canSave(draft: ItemDraft): boolean {
  return draft.menuName.trim().length > 0 && Number.isFinite(toNumber(draft.suggested));
}

function draftToItem(
  draft: ItemDraft,
  confidenceLabel: BelanjaCardData['confidenceLabel'],
): Omit<BelanjaItem, 'menuItemId'> | null {
  const suggested = Math.round(toNumber(draft.suggested));
  if (!Number.isFinite(suggested)) return null;
  const parsedDelta = toNumber(draft.delta);
  const delta = Number.isFinite(parsedDelta) ? Math.round(parsedDelta) : 0;

  return {
    menuName: draft.menuName.trim(),
    unit: draft.unit.trim() || 'porsi',
    base: Math.max(0, suggested - delta),
    suggested,
    leftoverYesterday: null,
    confidenceLabel,
    reasoning: draft.reasoning.trim() || 'Info belum diisi.',
  };
}

function toNumber(value: string): number {
  const normalized = value.trim().replace(',', '.');
  if (normalized.length === 0) return Number.NaN;
  return Number(normalized);
}

function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const day = d.getDate();
  const month = d.toLocaleString('id-ID', { month: 'short' });
  return `${day} ${month}`;
}

function formatLongDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const day = d.getDate();
  const month = d.toLocaleString('id-ID', { month: 'long' });
  return `${day} ${month}`;
}

function formatItemNote(item: BelanjaItem): string {
  if (item.leftoverYesterday !== null && item.leftoverYesterday > 0) {
    return `Sisa kemarin ${Math.round(item.leftoverYesterday)} ${item.unit}`;
  }
  return compactInfo(item.reasoning);
}

function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

function trendColor(delta: number): string {
  if (delta < 0) return 'var(--sk-danger)';
  if (delta > 0) return 'var(--sk-success)';
  return 'var(--sk-text-3)';
}

function compactInfo(value: string): string {
  const cleaned = value
    .replace(/-?\d+\.\d+/g, (match) => String(Math.round(Number(match))))
    .replace(/\s*base\s+\d+\.?\d*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const firstClause = cleaned.split(/[.!?]/)[0]?.trim() || 'Info belum diisi';
  return firstClause.length > 52 ? `${firstClause.slice(0, 49).trim()}...` : firstClause;
}

function buildShareText(data: BelanjaCardData, weekdayLabel: string): string {
  const dateLabel = `${weekdayLabel}, ${formatShortDate(data.serviceDate)}`;
  const lines: string[] = [`Belanja besok - ${dateLabel}`, ''];
  for (const item of data.items) {
    lines.push(`- ${item.menuName}: ${Math.round(item.suggested)} ${item.unit}`);
  }
  if (data.summary) {
    lines.push('', data.summary);
  }
  return lines.join('\n');
}
