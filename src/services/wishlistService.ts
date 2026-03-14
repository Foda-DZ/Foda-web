import api from "../lib/api";
import type { ApiProduct } from "../types/api";

export const wishlistService = {
  /** GET /customer/wishlist — returns full product objects */
  getWishlist: () =>
    api
      .get<{ message: string; wishlist: ApiProduct[] }>("/customer/wishlist")
      .then((r) => r.data.wishlist),

  /** POST /customer/wishlist/:id — add product to wishlist */
  addToWishlist: (productId: string) =>
    api
      .post<{ message: string }>(`/customer/wishlist/${productId}`)
      .then((r) => r.data),

  /** DELETE /customer/wishlist/:id — remove product from wishlist */
  removeFromWishlist: (productId: string) =>
    api
      .delete<{ message: string }>(`/customer/wishlist/${productId}`)
      .then((r) => r.data),
};
