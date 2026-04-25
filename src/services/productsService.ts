import api from "../lib/api";
import type {
  ApiProduct,
  ApiReview,
  ApiProductShareResponse,
  ApiProductReviewsResponse,
} from "../types/api";

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

interface ReviewsCacheEntry {
  data: ApiProductReviewsResponse;
  ts: number;
}

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<ApiProduct[]>>();
const reviewsCache = new Map<string, ReviewsCacheEntry>();
const reviewsInflight = new Map<string, Promise<ApiProductReviewsResponse>>();

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

function getCachedReviews(key: string): ApiProductReviewsResponse | null {
  const entry = reviewsCache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  if (entry) reviewsCache.delete(key);
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

  getProductReviews: (id: string): Promise<ApiProductReviewsResponse> => {
    const key = `reviews:${id}`;

    const cached = getCachedReviews(key);
    if (cached) return Promise.resolve(cached);

    const pending = reviewsInflight.get(key);
    if (pending) return pending;

    const request = api
      .get<ApiProductReviewsResponse>(`/products/${id}/reviews`)
      .then((r) => {
        reviewsCache.set(key, { data: r.data, ts: Date.now() });
        reviewsInflight.delete(key);
        return r.data;
      })
      .catch((err) => {
        reviewsInflight.delete(key);
        throw err;
      });

    reviewsInflight.set(key, request);
    return request;
  },

  getShareLink: (id: string) =>
    api.get<ApiProductShareResponse>(`/products/${id}/share`).then((r) => r.data),

  invalidateCache: () => {
    cache.clear();
    reviewsCache.clear();
  },
};
