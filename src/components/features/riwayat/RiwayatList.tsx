'use client';

import {
  deleteRiwayatDay,
  getRiwayat7d,
  getRiwayatEditorData,
  updateRiwayatDay,
  type RiwayatDay,
  type RiwayatEditorMenuItem,
} from '@/app/actions/riwayat';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  EmptyPanel,
  IllustError,
  IllustNoData,
  IllustNoHistory,
} from '@/components/ui-kit/illustrations/empty-states';
import { Toast } from '@/components/ui-kit/notifications';
import { SkButton } from '@/components/ui-kit/primitives/sk-button';
import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkInput } from '@/components/ui-kit/primitives/sk-input';
import { SkPill } from '@/components/ui-kit/primitives/sk-pill';
import { SkSelect } from '@/components/ui-kit/primitives/sk-select';
import { SkSheet } from '@/components/ui-kit/primitives/sk-sheet';
import { common } from '@/lib/copy/common';
import { riwayat } from '@/lib/copy/riwayat';
import { useRouter } from 'next/navigation';
import * as React from 'react';

type Phase = 'loading' | 'ready' | 'empty' | 'error';

type FlashState = {
  kind: 'success' | 'danger';
  title: string;
  message?: string;
} | null;

type EditorRow = {
  id: string;
  menuItemId: string | null;
  sold: string;
  leftover: string;
};

type EditorState = {
  stockLogId: string;
  title: string;
  menuItems: RiwayatEditorMenuItem[];
  rows: EditorRow[];
  saving: boolean;
  deleting: boolean;
  loading: boolean;
  error: string | null;
};

export function RiwayatList() {
  const router = useRouter();
  const [phase, setPhase] = React.useState<Phase>('loading');
  const [days, setDays] = React.useState<RiwayatDay[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [flash, setFlash] = React.useState<FlashState>(null);
  const [editor, setEditor] = React.useState<EditorState | null>(null);
  const [busyDeleteId, setBusyDeleteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    void load();
  }, []);

  async function load() {
    const result = await getRiwayat7d();
    if (result.error) {
      setErrorMsg(result.error.message);
      setPhase('error');
      return;
    }
    if (result.data.days.length === 0) {
      setDays([]);
      setPhase('empty');
      return;
    }
    setDays(result.data.days);
    setPhase('ready');
  }

  async function openEditor(stockLogId: string) {
    setEditor({
      stockLogId,
      title: 'Memuat...',
      menuItems: [],
      rows: [],
      saving: false,
      deleting: false,
      loading: true,
      error: null,
    });

    const result = await getRiwayatEditorData(stockLogId);
    if (result.error) {
      setEditor(null);
      setFlash({
        kind: 'danger',
        title: 'Gagal buka editor',
        message: result.error.message,
      });
      return;
    }

    setEditor({
      stockLogId,
      title: formatDate(result.data.day.serviceDate),
      menuItems: result.data.menuItems,
      rows: toEditorRows(result.data.day),
      saving: false,
      deleting: false,
      loading: false,
      error: null,
    });
  }

  function closeEditor() {
    setEditor(null);
  }

  function updateEditorRow(id: string, patch: Partial<EditorRow>) {
    setEditor((current) =>
      current
        ? {
            ...current,
            error: null,
            rows: current.rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
          }
        : current,
    );
  }

  function addEditorRow() {
    setEditor((current) => {
      if (!current) return current;
      const nextIndex = current.rows.length;
      const fallbackMenuId = firstAvailableMenuId(current.menuItems, current.rows);
      return {
        ...current,
        error: null,
        rows: [
          ...current.rows,
          {
            id: `row-${nextIndex}`,
            menuItemId: fallbackMenuId,
            sold: '0',
            leftover: '0',
          },
        ],
      };
    });
  }

  function removeEditorRow(id: string) {
    setEditor((current) =>
      current
        ? {
            ...current,
            error: null,
            rows: current.rows.filter((row) => row.id !== id),
          }
        : current,
    );
  }

  async function saveEditor() {
    if (!editor) return;
    const parsed = parseEditorRows(editor.rows);
    if (!parsed.ok) {
      setEditor((current) => (current ? { ...current, error: parsed.message } : current));
      return;
    }

    setEditor((current) => (current ? { ...current, saving: true, error: null } : current));
    const result = await updateRiwayatDay({
      stockLogId: editor.stockLogId,
      items: parsed.items,
    });

    if (result.error) {
      setEditor((current) =>
        current ? { ...current, saving: false, error: result.error.message } : current,
      );
      return;
    }

    setDays((current) =>
      current.map((day) => (day.stockLogId === editor.stockLogId ? result.data.day : day)),
    );
    setEditor(null);
    setFlash({
      kind: 'success',
      title: 'Riwayat disimpan',
      message: 'Perubahan hari ini sudah masuk.',
    });
  }

  async function removeDay(stockLogId: string) {
    if (
      busyDeleteId ||
      (typeof window !== 'undefined' && !window.confirm('Hapus catatan hari ini?'))
    ) {
      return;
    }

    setBusyDeleteId(stockLogId);
    if (editor?.stockLogId === stockLogId) {
      setEditor((current) => (current ? { ...current, deleting: true } : current));
    }

    const result = await deleteRiwayatDay(stockLogId);

    if (result.error) {
      setBusyDeleteId(null);
      setEditor((current) => (current ? { ...current, deleting: false } : current));
      setFlash({
        kind: 'danger',
        title: 'Gagal hapus riwayat',
        message: result.error.message,
      });
      return;
    }

    setDays((current) => {
      const next = current.filter((day) => day.stockLogId !== stockLogId);
      setPhase(next.length === 0 ? 'empty' : 'ready');
      return next;
    });
    setBusyDeleteId(null);
    setEditor(null);
    setFlash({
      kind: 'success',
      title: 'Riwayat dihapus',
      message: 'Catatan hari itu sudah dibuang.',
    });
  }

  return (
    <AppLayout title="Riwayat 7 Hari" contentWidth="wide">
      <div className="page-shell riwayat-shell" data-testid="riwayat-shell">
        {flash ? (
          <div style={{ marginBottom: 12 }}>
            <Toast
              kind={flash.kind}
              title={flash.title}
              message={flash.message}
              density="compact"
              onClose={() => setFlash(null)}
              maxWidth={420}
            />
          </div>
        ) : null}

        {phase === 'loading' ? (
          <EmptyPanel
            illust={IllustNoHistory}
            title={common.state.loading}
            body="Lagi ambil 7 hari terakhir."
          />
        ) : null}

        {phase === 'empty' ? (
          <EmptyPanel
            illust={IllustNoData}
            title="Belum ada catatan"
            body={riwayat.empty}
            cta={
              <SkButton variant="brand" size="md" full onClick={() => router.push('/catat')}>
                Catat hari ini
              </SkButton>
            }
          />
        ) : null}

        {phase === 'error' ? (
          <EmptyPanel
            illust={IllustError}
            title="Gagal ambil riwayat"
            body={errorMsg ?? common.state.error_generic}
          />
        ) : null}

        {phase === 'ready'
          ? days.map((day) => (
              <DayCard
                key={day.stockLogId}
                day={day}
                busyDelete={busyDeleteId === day.stockLogId}
                onDelete={() => void removeDay(day.stockLogId)}
                onEdit={() => void openEditor(day.stockLogId)}
              />
            ))
          : null}
      </div>

      {editor ? (
        <EditorSheet
          editor={editor}
          onAddRow={addEditorRow}
          onClose={closeEditor}
          onDelete={() => void removeDay(editor.stockLogId)}
          onRemoveRow={removeEditorRow}
          onSave={() => void saveEditor()}
          onUpdateRow={updateEditorRow}
        />
      ) : null}
    </AppLayout>
  );
}

function DayCard({
  day,
  busyDelete,
  onDelete,
  onEdit,
}: {
  day: RiwayatDay;
  busyDelete: boolean;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <SkCard>
      <div className="riwayat-card">
        <div className="riwayat-card-header">
          <span className="min-w-0 flex-1 font-semibold text-neutral-900">
            {formatDate(day.serviceDate)}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <SkPill tone="success">
              {riwayat.total_sold} {day.totalSold}
            </SkPill>
            {day.totalLeftover > 0 ? (
              <SkPill tone="warn">
                {riwayat.total_leftover} {day.totalLeftover}
              </SkPill>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <SkButton size="sm" variant="secondary" onClick={onEdit}>
            Edit
          </SkButton>
          <SkButton size="sm" variant="ghost" onClick={onDelete} disabled={busyDelete}>
            Hapus
          </SkButton>
        </div>

        <div className="riwayat-columns" aria-hidden="true">
          <span>Item</span>
          <span className="riwayat-columns-metric">Laku</span>
          <span className="riwayat-columns-metric">Sisa</span>
        </div>
        <ul className="riwayat-items">
          {day.items.map((it) => (
            <li key={it.menuItemId} className="riwayat-item-row">
              <span className="riwayat-item-name">{it.menuName}</span>
              <span
                data-testid={`riwayat-sold-${it.menuItemId}`}
                className="riwayat-metric riwayat-metric--sold"
              >
                <strong>{it.sold}</strong>
                <small>{riwayat.total_sold}</small>
              </span>
              <span
                data-testid={`riwayat-leftover-${it.menuItemId}`}
                className="riwayat-metric riwayat-metric--leftover"
              >
                {it.leftover > 0 ? (
                  <>
                    <strong>{it.leftover}</strong>
                    <small>{riwayat.total_leftover}</small>
                  </>
                ) : (
                  <em>-</em>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SkCard>
  );
}

function EditorSheet({
  editor,
  onAddRow,
  onClose,
  onDelete,
  onRemoveRow,
  onSave,
  onUpdateRow,
}: {
  editor: EditorState;
  onAddRow: () => void;
  onClose: () => void;
  onDelete: () => void;
  onRemoveRow: (id: string) => void;
  onSave: () => void;
  onUpdateRow: (id: string, patch: Partial<EditorRow>) => void;
}) {
  return (
    <SkSheet title={editor.loading ? 'Memuat riwayat...' : editor.title} onClose={onClose}>
      {editor.loading ? (
        <p style={{ margin: 0, color: 'var(--sk-text-2)' }}>Lagi ambil detail hari ini.</p>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {editor.error ? (
            <div
              style={{
                borderRadius: 12,
                border: '1px solid var(--sk-danger-soft)',
                background: 'var(--sk-danger-soft)',
                color: 'var(--sk-danger)',
                padding: '10px 12px',
                fontSize: 13,
              }}
            >
              {editor.error}
            </div>
          ) : null}

          {editor.rows.map((row, index) => (
            <div
              key={row.id}
              style={{
                border: '1px solid var(--sk-line)',
                borderRadius: 14,
                padding: 12,
                display: 'grid',
                gap: 10,
              }}
            >
              <div style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--sk-text-2)' }}>Menu</span>
                <SkSelect
                  aria-label={`Menu item ${index + 1}`}
                  data-testid={`riwayat-item-menu-${row.id}`}
                  value={row.menuItemId ?? undefined}
                  onChange={(value) => onUpdateRow(row.id, { menuItemId: value })}
                >
                  <option value="">Pilih item</option>
                  {editor.menuItems.map((item) => (
                    <option key={item.menuItemId} value={item.menuItemId}>
                      {item.menuName}
                    </option>
                  ))}
                </SkSelect>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: 10,
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                }}
              >
                <div style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--sk-text-2)' }}>Laku</span>
                  <SkInput
                    aria-label={`Laku item ${index + 1}`}
                    data-testid={`riwayat-item-sold-${row.id}`}
                    inputMode="numeric"
                    value={row.sold}
                    onChange={(value) => onUpdateRow(row.id, { sold: value })}
                  />
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--sk-text-2)' }}>Sisa</span>
                  <SkInput
                    aria-label={`Sisa item ${index + 1}`}
                    data-testid={`riwayat-item-leftover-${row.id}`}
                    inputMode="numeric"
                    value={row.leftover}
                    onChange={(value) => onUpdateRow(row.id, { leftover: value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SkButton size="sm" variant="ghost" onClick={() => onRemoveRow(row.id)}>
                  Hapus item
                </SkButton>
              </div>
            </div>
          ))}

          <SkButton variant="secondary" onClick={onAddRow}>
            Tambah item
          </SkButton>

          <div style={{ display: 'grid', gap: 8 }}>
            <SkButton variant="brand" onClick={onSave} disabled={editor.saving || editor.deleting}>
              Simpan perubahan
            </SkButton>
            <SkButton
              variant="ghost"
              onClick={onDelete}
              disabled={editor.saving || editor.deleting}
            >
              Hapus catatan hari ini
            </SkButton>
          </div>
        </div>
      )}
    </SkSheet>
  );
}

function toEditorRows(day: RiwayatDay): EditorRow[] {
  return day.items.map((item, index) => ({
    id: `row-${index}`,
    menuItemId: item.menuItemId,
    sold: String(item.sold),
    leftover: String(item.leftover),
  }));
}

function firstAvailableMenuId(menuItems: RiwayatEditorMenuItem[], rows: EditorRow[]): string {
  const used = new Set(rows.map((row) => row.menuItemId).filter(Boolean));
  return (
    menuItems.find((item) => !used.has(item.menuItemId))?.menuItemId ??
    menuItems[0]?.menuItemId ??
    ''
  );
}

function parseEditorRows(
  rows: EditorRow[],
):
  | { ok: true; items: Array<{ menuItemId: string; sold: number; leftover: number }> }
  | { ok: false; message: string } {
  if (!rows.length) {
    return { ok: false, message: 'Minimal ada satu item.' };
  }

  const items: Array<{ menuItemId: string; sold: number; leftover: number }> = [];
  const seen = new Set<string>();

  for (const row of rows) {
    if (!row.menuItemId) {
      return { ok: false, message: 'Pilih menu untuk semua baris.' };
    }
    if (seen.has(row.menuItemId)) {
      return { ok: false, message: 'Item menu tidak boleh dobel dalam satu hari.' };
    }

    const sold = parseCount(row.sold);
    const leftover = parseCount(row.leftover);
    if (sold == null || leftover == null) {
      return { ok: false, message: 'Laku dan sisa harus angka bulat nol atau lebih.' };
    }

    seen.add(row.menuItemId);
    items.push({
      menuItemId: row.menuItemId,
      sold,
      leftover,
    });
  }

  return { ok: true, items };
}

function parseCount(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return null;
  return parsed;
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const weekday = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][d.getDay()];
  const day = d.getDate();
  const month = d.toLocaleString('id-ID', { month: 'short' });
  return `${weekday}, ${day} ${month}`;
}
