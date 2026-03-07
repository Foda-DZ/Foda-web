import api from "../lib/api";
import type { ApiProduct } from "../types/api";

export interface GetProductsParams {
  search?: string;
  category?: string;
}

export const productsService = {
  getAll: (params?: GetProductsParams) =>
    api
      .get<{ message: string; products: ApiProduct[] }>("/products", { params })
      .then((r) => r.data.products),

  getById: (id: string) =>
    api
      .get<{ message: string; product: ApiProduct }>(`/products/${id}`)
      .then((r) => r.data.product),
};
