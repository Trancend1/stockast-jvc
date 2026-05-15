import type { ParsedStockPayloadFromAI } from '@/lib/ai/schemas';
import type { ParsedStockPayload } from '@/types/domain';

/**
 * Pure mapping helpers — no I/O, no DB, no Node-only imports.
 * Lives outside StockService so unit tests can import without pulling in
 * `server-only`, Gemini SDK, or Supabase clients.
 */

type MenuRef = {
  id: string;
  name: string;
  normalized_name: string;
  unit: string;
};

export function mapToDomainPayload(
  ai: ParsedStockPayloadFromAI,
  menuItems: ReadonlyArray<MenuRef>,
): ParsedStockPayload {
  return {
    items: ai.items.map((it) => {
      const matched = matchMenuItem(it.candidateName, menuItems);
      return {
        menuItemId: matched?.id ?? null,
        candidateName: it.candidateName,
        sold: it.sold,
        leftover: it.leftover,
        unit: it.unit ?? matched?.unit ?? 'porsi',
        confidence: it.confidence,
      };
    }),
    weatherMention: ai.weatherMention,
    notes: ai.notes,
  };
}

export function matchMenuItem(
  candidate: string,
  menuItems: ReadonlyArray<MenuRef>,
): { id: string; unit: string } | null {
  const norm = candidate.trim().toLowerCase();
  if (norm.length === 0) return null;
  const exact = menuItems.find((m) => m.normalized_name === norm);
  if (exact) return { id: exact.id, unit: exact.unit };
  const partial = menuItems.find(
    (m) => m.normalized_name.includes(norm) || norm.includes(m.normalized_name),
  );
  return partial ? { id: partial.id, unit: partial.unit } : null;
}
