import { SkCard } from '@/components/ui-kit/primitives/sk-card';
import { SkSkeleton } from '@/components/ui-kit/primitives/sk-skeleton';

/**
 * Visual mirror of BelanjaCard while data loads. Shapes + spacing match the
 * real card so the loaded state lands in the same footprint — no layout shift.
 */
export function BelanjaCardSkeleton() {
  return (
    <SkCard
      signature
      className="belanja-card-surface border-brand-100"
      aria-busy
      aria-live="polite"
    >
      <div style={{ padding: '1rem' }}>
        <div className="flex items-baseline justify-between">
          <SkSkeleton style={{ height: 12, width: 96 }} />
          <SkSkeleton style={{ height: 20, width: 96, borderRadius: 'var(--sk-r-pill)' }} />
        </div>
        <SkSkeleton style={{ height: 28, width: 160, marginTop: 12 }} />
        <ul className="mt-4 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="rounded-button flex flex-col gap-2 border border-neutral-200 bg-neutral-50 p-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <SkSkeleton style={{ height: 16, width: 112 }} />
                <SkSkeleton style={{ height: 28, width: 64 }} />
              </div>
              <SkSkeleton style={{ height: 12, width: '100%' }} />
              <SkSkeleton style={{ height: 12, width: '60%' }} />
            </li>
          ))}
        </ul>
        <SkSkeleton style={{ height: 16, width: '100%', marginTop: 16 }} />
        <SkSkeleton style={{ height: 16, width: '80%', marginTop: 8 }} />
        <SkSkeleton
          style={{ height: 48, width: '100%', borderRadius: 'var(--sk-r-btn)', marginTop: 16 }}
        />
      </div>
    </SkCard>
  );
}
