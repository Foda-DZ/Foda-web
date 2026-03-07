import api from "../lib/api";
import type { ApiProduct, ApiOrder, ApiOrderStatus } from "../types/api";

export interface AddProductPayload {
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  size?: string[];
  images?: File[];
}

export interface UpdateProductPayload {
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  size?: string;
}

export const sellerService = {
  getProducts: () =>
    api
      .get<{ message: string; products: ApiProduct[] }>("/seller/products")
      .then((r) => r.data.products),

  addProduct: (payload: AddProductPayload) => {
    const form = new FormData();
    form.append("name", payload.name);
    form.append("price", String(payload.price));
    form.append("stock", String(payload.stock));
    form.append("category", payload.category);
    if (payload.description) form.append("description", payload.description);
    if (payload.size?.length) form.append("size", payload.size.join(","));
    payload.images?.forEach((img) => form.append("images", img));
    return api
      .post<{ message: string; product: ApiProduct }>("/seller/products", form, {
        headers: { "Content-Type": undefined },
      })
      .then((r) => r.data.product);
  },

  // PUT /seller/products/:id — update product metadata (JSON, no images)
  updateProduct: (id: string, payload: UpdateProductPayload) =>
    api
      .put<{ message: string; product: ApiProduct }>(`/seller/products/${id}`, payload)
      .then((r) => r.data.product),

  deleteProduct: (id: string) =>
    api
      .delete<{ message: string }>(`/seller/products/${id}`)
      .then((r) => r.data),

  getOrders: () =>
    api
      .get<{ message: string; orders: ApiOrder[] }>("/seller/orders")
      .then((r) => r.data.orders),

  updateOrderStatus: (id: string, status: ApiOrderStatus) =>
    api
      .put<{ message: string }>(`/seller/orders/${id}`, { status })
      .then((r) => r.data),
};
