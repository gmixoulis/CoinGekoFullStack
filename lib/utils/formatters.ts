// ─────────────────────────────────────────────────────────────
// lib/utils/formatters.ts
// Pure formatting functions for currency, percentages, etc.
// No side effects, easily testable.
// ─────────────────────────────────────────────────────────────

/**
 * Format a number as USD currency.
 * Uses Intl.NumberFormat for proper locale-aware formatting.
 */
export function formatCurrency(value: number): string {
  if (value >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // For small values (e.g., SHIB at $0.00001234), show more decimals
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value);
}

/**
 * Format a percentage with + or - sign and color hint.
 * Returns { text, isPositive } for the component to colorize.
 */
export function formatPercentage(value: number | null | undefined): {
  text: string;
  isPositive: boolean;
} {
  if (value === null || value === undefined) {
    return { text: 'N/A', isPositive: false };
  }

  const isPositive = value >= 0;
  const formatted = `${isPositive ? '+' : ''}${value.toFixed(2)}%`;

  return { text: formatted, isPositive };
}

/**
 * Format large numbers with T/B/M/K suffixes.
 * $1,380,000,000,000 → $1.38T
 */
export function formatCompactCurrency(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return formatCurrency(value);
}

/**
 * Format a compact number without currency symbol.
 * 19,675,987 → 19.68M
 */
export function formatCompactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '∞';

  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;

  return value.toLocaleString('en-US');
}
