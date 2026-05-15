import * as React from 'react';

/**
 * Simple hand-drawn-feel SVG illustrations.
 * DESIGN_SYSTEM.md §9 — empty states need a friendly mark, not "No data available".
 */

export function SproutMark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        d="M32 56V36"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M32 36C32 28 24 24 18 26C20 34 26 38 32 36Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 36C32 28 40 24 46 26C44 34 38 38 32 36Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 56h36"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
    </svg>
  );
}

export function NotebookMark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect
        x="14"
        y="10"
        width="36"
        height="44"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M22 22h20M22 30h20M22 38h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="48" r="6" fill="var(--color-warning)" />
    </svg>
  );
}

export function CloudMark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        d="M22 44h22a8 8 0 0 0 1-15.9A12 12 0 0 0 22 30a8 8 0 0 0 0 14z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M28 52l-3 6M36 52l-3 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="text-brand-500">{icon}</div>
      <h3 className="text-base font-bold text-neutral-900">{title}</h3>
      <p className="max-w-[280px] text-sm leading-relaxed text-neutral-600">
        {description}
      </p>
      {action ? <div className="mt-2 w-full">{action}</div> : null}
    </div>
  );
}
