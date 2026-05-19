import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Visual mirror of BelanjaCard while data loads. Shapes + spacing match the
 * real card so the loaded state lands in the same footprint — no layout shift.
 */
export function BelanjaCardSkeleton() {
  return (
    <Card
      className="belanja-card-surface border-brand-100"
      aria-busy
      aria-live="polite"
    >
      <CardContent>
        <div className="flex items-baseline justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="mt-3 h-7 w-40" />
        <ul className="mt-4 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="flex flex-col gap-2 rounded-button border border-neutral-200 bg-neutral-50 p-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-7 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/5" />
            </li>
          ))}
        </ul>
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
      </CardContent>
      <CardFooter className="justify-stretch">
        <Skeleton className="h-12 w-full rounded-button" />
      </CardFooter>
    </Card>
  );
}
