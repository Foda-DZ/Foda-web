import api from "../lib/api";
import type {
  ApiCart,
  ApiCheckoutResponse,
  ApiCheckoutShippingFeesResponse,
  ApiShippingDetails,
} from "../types/api";

export const cartService = {
  /** GET /cart — returns the cart, creating a new one if none exists (201). */
  getCart: () =>
    api
      .get<{ message: string; cart: ApiCart }>("/cart")
      .then((r) => r.data.cart),

  /** Alias that makes the intent explicit when called right after registration. */
  createCart: () =>
    api
      .get<{ message: string; cart: ApiCart }>("/cart")
      .then((r) => r.data.cart),

  /**
   * Add a (size, color) variant to the cart. One request per click — `quantity`
   * is sent in the body so the server applies the per-variant stock guard atomically.
   */
  addItem: (productId: string, size: string, color: string, quantity: number = 1) =>
    api
      .post<{ message: string; cart: ApiCart }>(`/cart/items/${productId}`, {
        size,
        color,
        quantity,
      })
      .then((r) => r.data.cart),

  /** Remove a specific cart line. Caller identifies the exact variant. */
  removeItem: (productId: string, identifier: { variantId?: string; size?: string; color?: string }) =>
    api
      .delete<{ message: string; cart: ApiCart }>(`/cart/items/${productId}`, {
        data: identifier,
      })
      .then((r) => r.data.cart),

  checkout: (shippingDetails: ApiShippingDetails, shippingFees?: { sellerId: string; shippingFee: number }[]) =>
    api
      .post<ApiCheckoutResponse>("/cart/checkout", { shippingDetails, shippingFees })
      .then((r) => r.data),

  /** GET /cart/checkout/shipping-fees — returns available delivery fees for a product and wilaya. */
  getShippingFees: (productId: string, to_wilaya: string) =>
    api
      .get<ApiCheckoutShippingFeesResponse>("/cart/checkout/shipping-fees", {
        params: { productId, to_wilaya },
      })
      .then((r) => r.data.shippingFees),

  clearCart: () =>
    api
      .delete<{ message: string }>("/cart/clear")
      .then((r) => r.data),
};
