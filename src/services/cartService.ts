import api from "../lib/api";
import type {
  ApiCart,
  ApiCheckoutResponse,
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

  addItem: (productId: string, size: string, color: string) =>
    api
      .post<{ message: string }>(`/cart/items/${productId}`, { size, color })
      .then((r) => r.data),

  removeItem: (productId: string) =>
    api
      .delete<{ message: string }>(`/cart/items/${productId}`)
      .then((r) => r.data),

  checkout: (shippingDetails: ApiShippingDetails) =>
    api
      .post<ApiCheckoutResponse>("/cart/checkout", { shippingDetails })
      .then((r) => r.data),

  clearCart: () =>
    api
      .delete<{ message: string }>("/cart/clear")
      .then((r) => r.data),
};
