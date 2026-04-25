import api from "../lib/api";
import type { ApiProduct, ApiReview } from "../types/api";

export interface GetProductsParams {
  search?: string;
  mainCategory?: string;
  subCategory?: string;
  category?: string; // legacy support
}

export interface ReviewProductPayload {
  rating: number;
  comment: string;
}

// ── Simple in-memory cache with deduplication ────────────────────────────────
const CACHE_TTL = 60_000; // 1 minute

interface CacheEntry {
  data: ApiProduct[];
  ts: number;
}

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<ApiProduct[]>>();

function cacheKey(params?: GetProductsParams): string {
  if (!params) return "__all__";
  return JSON.stringify(params);
}

function getCached(key: string): ApiProduct[] | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  if (entry) cache.delete(key);
  return null;
}

export const productsService = {
  getAll: (params?: GetProductsParams): Promise<ApiProduct[]> => {
    const key = cacheKey(params);

    // Return cached data if fresh
    const cached = getCached(key);
    if (cached) return Promise.resolve(cached);

    // Deduplicate concurrent requests for the same key
    const pending = inflight.get(key);
    if (pending) return pending;

    const request = api
      .get<{ message: string; products: ApiProduct[] }>("/products", { params })
      .then((r) => {
        const data = r.data.products;
        cache.set(key, { data, ts: Date.now() });
        inflight.delete(key);
        return data;
      })
      .catch((err) => {
        inflight.delete(key);
        throw err;
      });

    inflight.set(key, request);
    return request;
  },

  getById: (id: string) =>
    api
      .get<{ message: string; product: ApiProduct }>(`/products/${id}`)
      .then((r) => r.data.product),

  reviewProduct: (id: string, payload: ReviewProductPayload) =>
    api
      .post<{ message: string; review: ApiReview }>(`/products/${id}/review`, payload)
      .then((r) => r.data),

  invalidateCache: () => {
    cache.clear();
  },
};
