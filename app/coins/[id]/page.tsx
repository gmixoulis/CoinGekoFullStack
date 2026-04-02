'use client';

// ─────────────────────────────────────────────────────────────
// app/coins/[id]/page.tsx
// Dynamic coin detail page.
// Uses the same useCoinsReducer hook — demonstrates reusability.
// ─────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCoinsReducer } from '@/hooks/useCoinsReducer';
import { CoinDetailCard } from '@/components/coins/CoinDetailCard';
import { Button } from '@/components/ui/button';

export default function CoinDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, fetchCoinDetail } = useCoinsReducer();

  useEffect(() => {
    if (params.id) {
      fetchCoinDetail(params.id);
    }
  }, [params.id, fetchCoinDetail]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 1L4 8L11 15" />
              </svg>
              Back
            </Button>
            <h1 className="text-lg font-semibold font-heading bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              CryptoTracker
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Error State */}
        {state.error && (
          <div className="mb-6 rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
            <p className="font-semibold">Error loading coin data</p>
            <p className="mt-1 text-destructive/80">{state.error}</p>
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
              >
                Go back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => params.id && fetchCoinDetail(params.id)}
              >
                Try again
              </Button>
            </div>
          </div>
        )}

        <CoinDetailCard coin={state.selectedCoin} isLoading={state.isLoading} />
      </div>
    </main>
  );
}
