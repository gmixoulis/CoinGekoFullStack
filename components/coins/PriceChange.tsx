'use client';

// ─────────────────────────────────────────────────────────────
// components/coins/PriceChange.tsx
// Reusable price-change badge with color and arrow.
//
// Design: Extracted as its own component because it's used
// in both the table and the detail page (DRY principle).
// ─────────────────────────────────────────────────────────────

import { formatPercentage } from '@/lib/utils/formatters';

interface PriceChangeProps {
  value: number | null | undefined;
  className?: string;
}

export function PriceChange({ value, className = '' }: PriceChangeProps) {
  const { text, isPositive } = formatPercentage(value);
  const isNeutral = value === null || value === undefined || value === 0;

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium tabular-nums ${
        isNeutral
          ? 'text-muted-foreground'
          : isPositive
            ? 'text-emerald-500'
            : 'text-rose-500'
      } ${className}`}
    >
      {!isNeutral && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="currentColor"
          className={`shrink-0 ${isPositive ? '' : 'rotate-180'}`}
        >
          <path d="M5 0L10 7H0L5 0Z" />
        </svg>
      )}
      {text}
    </span>
  );
}
