// ─────────────────────────────────────────────────────────────
// lib/api/client.ts
// Type-safe HTTP client using native Fetch API.
//
// Trade-off: Fetch over axios.
// - Fetch is built-in (0KB bundle), no supply-chain risk.
// - Axios was compromised in 2023 (CVE supply chain attack).
// - We add our own error class + deduplication on top.
// ─────────────────────────────────────────────────────────────

/** Custom error class with HTTP status for structured error handling. */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * In-flight request tracker for deduplication.
 * If the same URL is requested while a previous request is
 * still pending, we return the same Promise instead of firing
 * a duplicate network call.
 *
 * Trade-off: Simple Map vs. a full caching library.
 * For a project this size, a Map is sufficient. If we needed
 * TTL-based caching, we'd use a proper cache layer.
 */
const inFlightRequests = new Map<string, Promise<unknown>>();

interface FetchOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Type-safe GET request with error handling and deduplication.
 * @param url Full URL to fetch
 * @param options Optional headers and timeout
 * @returns Parsed JSON response typed as T
 */
export async function apiGet<T>(url: string, options: FetchOptions = {}): Promise<T> {
  // Check for in-flight duplicate
  const existing = inFlightRequests.get(url);
  if (existing) {
    return existing as Promise<T>;
  }

  const { headers = {}, timeout = 10_000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const request = (async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ApiClientError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          url,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiClientError) throw error;

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiClientError('Request timed out', 408, url);
      }

      throw new ApiClientError(
        error instanceof Error ? error.message : 'Unknown fetch error',
        500,
        url,
      );
    } finally {
      clearTimeout(timeoutId);
      inFlightRequests.delete(url);
    }
  })();

  inFlightRequests.set(url, request);
  return request;
}
