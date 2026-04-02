'use client';

// ─────────────────────────────────────────────────────────────
// components/coins/CoinDetailCard.tsx
// Detailed view for a single cryptocurrency.
// ─────────────────────────────────────────────────────────────

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { PriceChange } from '@/components/coins/PriceChange';
import {
  formatCurrency,
  formatCompactCurrency,
  formatCompactNumber,
} from '@/lib/utils/formatters';
import type { CoinDetail } from '@/lib/types/coin';

interface CoinDetailCardProps {
  coin: CoinDetail | null;
  isLoading: boolean;
}

/** Stat row for the market data grid. */
function StatRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium font-mono text-right">{value}</span>
    </div>
  );
}

/** Price change period row. */
function PriceChangePeriod({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <PriceChange value={value} className="text-sm" />
    </div>
  );
}

export function CoinDetailCard({ coin, isLoading }: CoinDetailCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!coin) return null;

  const md = coin.market_data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Image
          src={coin.image.large}
          alt={coin.name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold font-heading">{coin.name}</h1>
            <span className="text-lg text-muted-foreground uppercase font-mono">
              {coin.symbol}
            </span>
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
              Rank #{coin.market_cap_rank}
            </span>
          </div>
          <div className="flex items-baseline gap-4 mt-2">
            <span className="text-4xl font-bold font-mono">
              {formatCurrency(md.current_price.usd)}
            </span>
            <PriceChange value={md.price_change_percentage_24h} className="text-lg" />
          </div>
        </div>
      </div>

      {/* Categories */}
      {coin.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {coin.categories.filter(Boolean).slice(0, 5).map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Market Data */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Market Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            <StatRow
              label="Market Cap"
              value={formatCompactCurrency(md.market_cap.usd)}
            />
            <Separator className="opacity-30" />
            <StatRow
              label="24h Volume"
              value={formatCompactCurrency(md.total_volume.usd)}
            />
            <Separator className="opacity-30" />
            <StatRow
              label="24h High"
              value={formatCurrency(md.high_24h.usd)}
            />
            <Separator className="opacity-30" />
            <StatRow
              label="24h Low"
              value={formatCurrency(md.low_24h.usd)}
            />
            <Separator className="opacity-30" />
            <StatRow
              label="Circulating Supply"
              value={formatCompactNumber(md.circulating_supply)}
            />
            <Separator className="opacity-30" />
            <StatRow
              label="Total Supply"
              value={formatCompactNumber(md.total_supply)}
            />
            <Separator className="opacity-30" />
            <StatRow
              label="Max Supply"
              value={formatCompactNumber(md.max_supply)}
            />
          </CardContent>
        </Card>

        {/* Price Changes */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Price Change</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            <PriceChangePeriod label="24 Hours" value={md.price_change_percentage_24h} />
            <Separator className="opacity-30" />
            <PriceChangePeriod label="7 Days" value={md.price_change_percentage_7d} />
            <Separator className="opacity-30" />
            <PriceChangePeriod label="14 Days" value={md.price_change_percentage_14d} />
            <Separator className="opacity-30" />
            <PriceChangePeriod label="30 Days" value={md.price_change_percentage_30d} />
            <Separator className="opacity-30" />
            <PriceChangePeriod label="60 Days" value={md.price_change_percentage_60d} />
            <Separator className="opacity-30" />
            <PriceChangePeriod label="200 Days" value={md.price_change_percentage_200d} />
            <Separator className="opacity-30" />
            <PriceChangePeriod label="1 Year" value={md.price_change_percentage_1y} />
          </CardContent>
        </Card>
      </div>

      {/* ATH / ATL */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">All-Time Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">All-Time High</p>
              <p className="text-lg font-bold font-mono">
                {formatCurrency(md.ath.usd)}
              </p>
              <PriceChange value={md.ath_change_percentage.usd} className="text-sm" />
              <p className="text-xs text-muted-foreground">
                {new Date(md.ath_date.usd).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">All-Time Low</p>
              <p className="text-lg font-bold font-mono">
                {formatCurrency(md.atl.usd)}
              </p>
              <PriceChange value={md.atl_change_percentage.usd} className="text-sm" />
              <p className="text-xs text-muted-foreground">
                {new Date(md.atl_date.usd).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {coin.description.en && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">About {coin.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline"
              dangerouslySetInnerHTML={{
                __html: coin.description.en.slice(0, 1500),
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Attribution */}
      <p className="text-xs text-muted-foreground text-center pt-4">
        Powered by{' '}
        <a
          href="https://www.coingecko.com/en/api"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          CoinGecko API
        </a>
      </p>
    </div>
  );
}
