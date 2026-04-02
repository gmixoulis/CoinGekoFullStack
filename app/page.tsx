'use client';

// ─────────────────────────────────────────────────────────────
// app/page.tsx
// Home page — the "container" component.
//
// Architecture: This page is the "container" in the
// Container/Presentational pattern. It manages the data
// lifecycle (fetch, paginate) and passes data down to
// CoinTable (the presentational component).
// ─────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { useCoinsReducer } from '@/hooks/useCoinsReducer';
import { CoinTable } from '@/components/coins/CoinTable';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { state, fetchCoins } = useCoinsReducer();

  // Fetch on mount and when page changes
  useEffect(() => {
    fetchCoins(state.page, state.perPage);
  }, [state.page, state.perPage, fetchCoins]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                CryptoTracker
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Real-time cryptocurrency market data
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground hidden sm:block">
              <p>Top coins by market cap</p>
              <p className="text-xs">
                Updated every 60s · Page {state.page}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Error State */}
        {state.error && (
          <div className="mb-6 rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
            <p className="font-semibold">Error loading data</p>
            <p className="mt-1 text-destructive/80">{state.error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => fetchCoins(state.page, state.perPage)}
            >
              Try again
            </Button>
          </div>
        )}

        {/* Table */}
        <CoinTable coins={state.coins} isLoading={state.isLoading} />

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={state.page <= 1 || state.isLoading}
            onClick={() => fetchCoins(state.page - 1, state.perPage)}
            className="min-w-[100px]"
          >
            ← Previous
          </Button>
          <span className="text-sm font-medium text-muted-foreground tabular-nums px-4 py-2 rounded-lg bg-muted/50">
            Page {state.page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={state.coins.length < state.perPage || state.isLoading}
            onClick={() => fetchCoins(state.page + 1, state.perPage)}
            className="min-w-[100px]"
          >
            Next →
          </Button>
        </div>

        {/* Footer Attribution */}
        <footer className="text-center py-8 mt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Powered by{' '}
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CoinGecko API
            </a>
            {' · '}
            Built with Next.js, TypeScript &amp; shadcn/ui
          </p>
        </footer>
      </div>
    </main>
  );
}
