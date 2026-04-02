// ─────────────────────────────────────────────────────────────
// hooks/useCoinsReducer.ts
// Custom hook that wraps useReducer + data fetching.
//
// Trade-off: Custom hook over inline fetch in component.
// This separates data-fetching logic from presentation logic,
// making both independently testable and reusable.
// The hook can be used in any page that needs coin data.
// ─────────────────────────────────────────────────────────────

'use client';

import { useReducer, useCallback } from 'react';
import { coinsReducer, initialCoinsState } from '@/lib/reducers/coinsReducer';
import { CoinActionType } from '@/lib/types/coin';

/**
 * Custom hook for coin state management.
 *
 * Returns the current state + action dispatchers.
 * Components call fetchCoins() / fetchCoinDetail() — they don't
 * know about the reducer internals (encapsulation).
 */
export function useCoinsReducer() {
  const [state, dispatch] = useReducer(coinsReducer, initialCoinsState);

  /**
   * Fetch paginated coin list from our API proxy.
   * The proxy forwards to CoinGecko, keeping API keys server-side.
   */
  const fetchCoins = useCallback(async (page = 1, perPage = 20) => {
    dispatch({ type: CoinActionType.SET_LOADING, payload: true });
    dispatch({ type: CoinActionType.SET_PAGE, payload: page });

    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
      });

      const response = await fetch(`/api/coins/markets?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { error?: string }).error || `HTTP ${response.status}`,
        );
      }

      const data = await response.json();
      dispatch({ type: CoinActionType.SET_COINS, payload: data });
    } catch (error) {
      dispatch({
        type: CoinActionType.SET_ERROR,
        payload: error instanceof Error ? error.message : 'Failed to fetch coins',
      });
    }
  }, []);

  /**
   * Fetch detail data for a single coin by ID.
   * Called when navigating to the detail page.
   */
  const fetchCoinDetail = useCallback(async (id: string) => {
    dispatch({ type: CoinActionType.SET_LOADING, payload: true });

    try {
      const response = await fetch(`/api/coins/${encodeURIComponent(id)}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { error?: string }).error || `HTTP ${response.status}`,
        );
      }

      const data = await response.json();
      dispatch({ type: CoinActionType.SET_SELECTED_COIN, payload: data });
    } catch (error) {
      dispatch({
        type: CoinActionType.SET_ERROR,
        payload: error instanceof Error ? error.message : 'Failed to fetch coin details',
      });
    }
  }, []);

  /** Change current page (triggers refetch from component). */
  const setPage = useCallback((page: number) => {
    dispatch({ type: CoinActionType.SET_PAGE, payload: page });
  }, []);

  /** Clear error state. */
  const resetError = useCallback(() => {
    dispatch({ type: CoinActionType.RESET_ERROR });
  }, []);

  return {
    state,
    fetchCoins,
    fetchCoinDetail,
    setPage,
    resetError,
  };
}
