'use client';

// ─────────────────────────────────────────────────────────────
// components/coins/CoinTable.tsx
// Main table component for displaying market data.
//
// Architecture: This is a "presentational" component —
// it receives data via props and renders it. It doesn't
// fetch data itself. This follows the Container/Presentational
// pattern where the page is the container.
//
// Performance: React.memo prevents re-renders when parent
// state changes but coins data hasn't. useMemo prevents
// re-computing formatted rows on every render.
// ─────────────────────────────────────────────────────────────

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { PriceChange } from '@/components/coins/PriceChange';
import {
  formatCurrency,
  formatCompactCurrency,
} from '@/lib/utils/formatters';
import type { CoinListItem } from '@/lib/types/coin';

interface CoinTableProps {
  coins: CoinListItem[];
  isLoading: boolean;
}

/** Loading skeleton rows. */
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-6" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

export const CoinTable = React.memo(function CoinTable({
  coins,
  isLoading,
}: CoinTableProps) {
  const router = useRouter();

  /**
   * useMemo for the formatted coin rows.
   * Trade-off: We memoize because formatting 20+ coins
   * involves string manipulation on every render.
   * For 5 items we wouldn't bother, but at 20-250 items
   * it's a worthwhile optimization.
   */
  const formattedCoins = useMemo(
    () =>
      coins.map((coin) => ({
        ...coin,
        formattedPrice: formatCurrency(coin.current_price),
        formattedHigh24h: formatCurrency(coin.high_24h),
        formattedLow24h: formatCurrency(coin.low_24h),
        formattedMarketCap: formatCompactCurrency(coin.market_cap),
      })),
    [coins],
  );

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h %</TableHead>
            <TableHead className="text-right hidden sm:table-cell">High (24h)</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Low (24h)</TableHead>
            <TableHead className="text-right hidden lg:table-cell">Market Cap</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : formattedCoins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                No coins found.
              </TableCell>
            </TableRow>
          ) : (
            formattedCoins.map((coin) => (
              <TableRow
                key={coin.id}
                id={`coin-row-${coin.id}`}
                className="cursor-pointer border-border/30 transition-colors hover:bg-accent/50"
                onClick={() => router.push(`/coins/${coin.id}`)}
              >
                <TableCell className="text-center text-muted-foreground font-mono text-sm">
                  {coin.market_cap_rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{coin.name}</p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {coin.formattedPrice}
                </TableCell>
                <TableCell className="text-right">
                  <PriceChange value={coin.price_change_percentage_24h} />
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell text-muted-foreground font-mono text-sm">
                  {coin.formattedHigh24h}
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell text-muted-foreground font-mono text-sm">
                  {coin.formattedLow24h}
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell text-muted-foreground font-mono text-sm">
                  {coin.formattedMarketCap}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});
