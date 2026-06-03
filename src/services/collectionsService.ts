import api from "../lib/api";
import type { ApiCollection } from "../types/api";
import { apiCollectionToCollection } from "../lib/mappers";
import type { Collection } from "../types";

const CACHE_TTL = 120_000; // 2 minutes

let cached: { data: Collection[]; ts: number } | null = null;
let inflight: Promise<Collection[]> | null = null;

export const collectionsService = {
  getById: (id: string): Promise<Collection> =>
    api
      .get<{ collection: ApiCollection }>(`/collections/${id}`)
      .then((r) => apiCollectionToCollection(r.data.collection)),

  getFeatured: (): Promise<Collection[]> => {
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return Promise.resolve(cached.data);
    }

    if (inflight) return inflight;

    const request = api
      .get<{ collections: ApiCollection[] }>("/collections")
      .then((r) => {
        const data = r.data.collections.map(apiCollectionToCollection);
        cached = { data, ts: Date.now() };
        inflight = null;
        return data;
      })
      .catch((err) => {
        inflight = null;
        throw err;
      });

    inflight = request;
    return request;
  },

  invalidateCache: () => {
    cached = null;
  },
};
