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

export type MetaDatePreset = "today" | "yesterday" | "last_7d" | "last_30d";

export interface MetaRangeFilter {
  datePreset?: MetaDatePreset;
  startDate?: string;
  endDate?: string;
}

export interface MetaKpis {
  datePreset?: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: number;
  cpc: number;
  purchases: number;
  conversions: number;
  roas: number;
  currency: string;
}

export interface MetaCampaign {
  campaignId: string;
  name: string;
  status: string;
  objective?: string;
  effectiveStatus?: string;
}

export interface MetaAdsSafeInfo {
  isConnected: boolean;
  adAccountId: string | null;
  adAccountName: string | null;
  pixelId: string | null;
  pageId: string | null;
  businessId: string | null;
  currency: string | null;
  connectedAt: string | null;
  lastSyncedAt: string | null;
  trackingKey: string | null;
  insights: MetaKpis | null;
  campaigns: MetaCampaign[];
}

export interface MetaDashboardResponse {
  sellerId: string;
  shopName: string;
  email: string;
  dateRange: {
    datePreset?: string;
    startDate?: string;
    endDate?: string;
  };
  kpis: MetaKpis;
  campaigns: MetaCampaign[];
  tracking: {
    trackingKey: string | null;
    recentEvents: Array<{ _id: string; count: number; lastEventAt: string }>;
  };
  metaAds: MetaAdsSafeInfo;
}

export interface MetaEventItem {
  _id: string;
  sellerId: string;
  eventName: string;
  eventId?: string | null;
  eventTime: string;
  eventSourceUrl?: string | null;
  actionSource?: string | null;
  forwardStatus: "stored" | "forwarded" | "failed";
  forwardError?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MetaEventsResponse {
  sellerId: string;
  count: number;
  events: MetaEventItem[];
}

export interface MetaOAuthStartResponse {
  authUrl: string;
  state: string;
  expiresInSeconds: number;
}

export interface MetaOAuthCompleteResponse {
  sellerId: string;
  shopName: string;
  selectedAccount: {
    id?: string;
    name?: string;
    accountId?: string;
    currency?: string;
  };
  availableAccounts: Array<{
    id?: string;
    name?: string;
    accountId?: string;
    currency?: string;
  }>;
  metaAds: MetaAdsSafeInfo;
}

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

  startMetaAdsOAuth: () =>
    api
      .get<{ message: string } & MetaOAuthStartResponse>("/seller/meta-ads/oauth/start")
      .then((r) => ({
        authUrl: r.data.authUrl,
        state: r.data.state,
        expiresInSeconds: r.data.expiresInSeconds,
      })),

  completeMetaAdsOAuth: (params: {
    code: string;
    state: string;
    adAccountId?: string;
  }) =>
    api
      .get<{ message: string } & MetaOAuthCompleteResponse>("/seller/meta-ads/oauth/callback", {
        params,
      })
      .then((r) => ({
        sellerId: r.data.sellerId,
        shopName: r.data.shopName,
        selectedAccount: r.data.selectedAccount,
        availableAccounts: r.data.availableAccounts,
        metaAds: r.data.metaAds,
      })),

  disconnectMetaAds: () =>
    api
      .delete<{ message: string; seller: { metaAds: MetaAdsSafeInfo } }>("/seller/meta-ads")
      .then((r) => r.data.seller.metaAds),

  getMetaAdsDashboard: (params?: MetaRangeFilter) =>
    api
      .get<{ dashboard: MetaDashboardResponse }>("/seller/meta-ads", { params })
      .then((r) => r.data.dashboard),

  syncMetaAds: (payload?: MetaRangeFilter) =>
    api
      .post<{ message: string; seller: MetaDashboardResponse }>("/seller/meta-ads/sync", payload ?? {})
      .then((r) => r.data.seller),

  getMetaAdsEvents: (params?: MetaRangeFilter) =>
    api
      .get<{ events: MetaEventsResponse }>("/seller/meta-ads/events", { params })
      .then((r) => r.data.events),

  sendTestMetaAdsEvent: () =>
    api
      .post<{ message: string; success: boolean; eventId: string }>("/seller/meta-ads/test-event")
      .then((r) => r.data),

  getMetaPixelsAndPages: () =>
    api
      .get<{
        sellerId: string;
        adAccountId: string;
        adAccountName: string;
        pixels: Array<{ id: string; name: string; lastFireTime?: string; creationTime?: string }>;
        pages: Array<{ id: string; name: string; picture?: string }>;
        currentPixelId: string | null;
        currentPageId: string | null;
      }>("/seller/meta-ads/pixels-and-pages")
      .then((r) => r.data),

  configureMetaPixelAndPage: (pixelId: string | null, pageId: string | null) =>
    api
      .post<{ sellerId: string; pixelId: string | null; pageId: string | null; metaAds: MetaAdsSafeInfo }>("/seller/meta-ads/configure-pixel-and-page", {
        pixelId,
        pageId,
      })
      .then((r) => r.data),

  // Traffic Analytics endpoints
  getTrafficAnalytics: (params?: { datePreset?: string; startDate?: string; endDate?: string }) =>
    api
      .get<any>("/seller/traffic-analytics", { params })
      .then((r) => r.data),

  getTrafficSummary: (params?: { datePreset?: string; startDate?: string; endDate?: string }) =>
    api
      .get<any>("/seller/traffic-analytics/summary", { params })
      .then((r) => r.data),

  getDeviceDistribution: (params?: { datePreset?: string; startDate?: string; endDate?: string }) =>
    api
      .get<any>("/seller/traffic-analytics/devices", { params })
      .then((r) => r.data),

  getTopSources: (params?: { datePreset?: string; startDate?: string; endDate?: string; limit?: number }) =>
    api
      .get<any>("/seller/traffic-analytics/top-sources", { params })
      .then((r) => r.data),

  trackTrafficSource: (data: {
    source: string;
    deviceType: string;
    pageViews?: number;
    bounceRate?: number;
    avgSessionDuration?: number;
    conversions?: number;
    revenue?: number;
    referrer?: string;
    campaign?: string;
  }) =>
    api
      .post<any>("/seller/traffic-analytics/track", data)
      .then((r) => r.data),
  // Inventory & Promotions
  getInventory: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<{ inventory: { items: any[]; total: number; page: number; limit: number; totalPages: number } }>(`/seller/inventory`, { params }).then((r) => r.data.inventory),
  updateInventory: (productId: string, payload: { stock?: number; sizeVariants?: { size: string; stock: number }[] }) => api.put(`/seller/inventory/${productId}`, payload).then((r) => r.data),

  upsertPromotion: (productId: string, promo: any) => api.post(`/seller/promotions/${productId}`, promo).then((r) => r.data),
  listPromotions: () => api.get(`/seller/promotions`).then((r) => r.data.promotions),
  removePromotion: (productId: string) => api.delete(`/seller/promotions/${productId}`).then((r) => r.data),

  getProductAnalytics: (productId: string, params?: { startDate?: string; endDate?: string }) => api.get(`/seller/analytics/product/${productId}`, { params }).then((r) => r.data.analytics),
  getRevenueAnalytics: (params?: { startDate?: string; endDate?: string }) => api.get(`/seller/analytics/revenue`, { params }).then((r) => r.data.analytics),
};
