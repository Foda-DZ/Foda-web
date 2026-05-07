import api from "../lib/api";
import type {
  ApiProduct,
  ApiOrder,
  ApiOrderStatus,
  ApiManageOrderResponse,
  ApiSellerSettingsResponse,
  ApiDeliveryCompaniesResponse,
  ApiCompleteSellerSetupPayload,
  ApiCompleteSellerSetupResponse,
} from "../types/api";

export interface AddProductPayload {
  name: string;
  price: number;
  stock: number;
  mainCategory: string;
  subCategory: string;
  description?: string;
  sizes: string[];
  colors: string[];
  images?: File[];
}

export interface UpdateProductPayload {
  name: string;
  price: number;
  stock: number;
  mainCategory: string;
  subCategory: string;
  description?: string;
  sizes: string[];
  colors: string[];
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
    form.append("mainCategory", payload.mainCategory);
    form.append("subCategory", payload.subCategory);
    if (payload.description) form.append("description", payload.description);
    payload.sizes.forEach((s) => form.append("sizes", s));
    payload.colors.forEach((c) => form.append("colors", c));
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
      .put<ApiManageOrderResponse>(`/seller/orders/${id}`, { status })
      .then((r) => r.data),

  updateSettings: (payload: {
    shopName?: string;
    phone?: number;
    wilaya?: string;
    commune?: string;
    logo?: File;
  }) => {
    const form = new FormData();
    if (payload.shopName !== undefined) form.append("shopName", payload.shopName);
    if (payload.phone !== undefined) form.append("phone", String(payload.phone));
    if (payload.wilaya !== undefined) form.append("wilaya", payload.wilaya);
    if (payload.commune !== undefined) form.append("commune", payload.commune);
    if (payload.logo) form.append("logo", payload.logo);
    return api
      .put<ApiSellerSettingsResponse>("/seller/settings", form, {
        headers: { "Content-Type": undefined },
      })
      .then((r) => r.data);
  },

  getDeliveryCompanies: () =>
    api
      .get<ApiDeliveryCompaniesResponse>("/delivery-companies")
      .then((r) => r.data.companies),

  completeSellerSetup: (payload: ApiCompleteSellerSetupPayload) =>
    api
      .post<ApiCompleteSellerSetupResponse>("/seller/complete-setup", payload)
      .then((r) => r.data),
};
