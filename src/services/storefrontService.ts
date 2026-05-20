import api from "../lib/api";
import type { ApiSellerProfile, ApiProduct } from "../types/api";

export const storefrontService = {
  getSellerProfile: (sellerId: string): Promise<ApiSellerProfile> =>
    api
      .get<{ seller: ApiSellerProfile }>(`/storefront/${sellerId}`)
      .then((r) => r.data.seller),

  getSellerProducts: (sellerId: string): Promise<ApiProduct[]> =>
    api
      .get<{ products: ApiProduct[] }>(`/storefront/${sellerId}/products`)
      .then((r) => r.data.products),

  followSeller: (sellerId: string): Promise<{ followers: number }> =>
    api
      .post<{ followers: number }>(`/storefront/${sellerId}/follow`)
      .then((r) => r.data),

  unfollowSeller: (sellerId: string): Promise<{ followers: number }> =>
    api
      .delete<{ followers: number }>(`/storefront/${sellerId}/follow`)
      .then((r) => r.data),
};
