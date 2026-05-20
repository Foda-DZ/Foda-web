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
  TrafficOverview,
  TrafficSourceRow,
  TrafficRangeParams,
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

// ─── TikTok Ads ───────────────────────────────────────────────────────────────
export type TikTokDatePreset = "today" | "yesterday" | "last_7d" | "last_30d";

export interface TikTokRangeFilter {
  datePreset?: TikTokDatePreset;
  startDate?: string;
  endDate?: string;
}

export interface TikTokKpis {
  datePreset?: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversionRate: number;
  currency: string;
}

export interface TikTokCampaign {
  campaignId: string;
  name: string;
  status: string;
  operationStatus?: string;
  objectiveType?: string;
  budget?: number;
  budgetMode?: string;
  productId?: string | null;
  metrics?: { impressions: number; clicks: number; spend: number; conversions: number } | null;
}

export interface TikTokAdsSafeInfo {
  isConnected: boolean;
  advertiserId: string | null;
  advertiserName: string | null;
  businessCenterId: string | null;
  currency: string | null;
  connectedAt: string | null;
  lastSyncedAt: string | null;
  tokenExpiresAt: string | null;
  connectionError: string | null;
  monthlyBudgetCap: number | null;
  trackingKey: string | null;
  scope: string[] | null;
  insights: TikTokKpis | null;
  campaigns: TikTokCampaign[];
}

export interface TikTokAdvertiser {
  id: string;
  name: string;
  currency: string | null;
}

export interface TikTokDashboardResponse {
  sellerId: string;
  shopName: string;
  email: string;
  dateRange: { datePreset?: string; startDate?: string; endDate?: string };
  kpis: TikTokKpis | null;
  campaigns: TikTokCampaign[];
  tracking: { trackingKey: string | null };
  tiktokAds: TikTokAdsSafeInfo;
  stale?: boolean;
}

export interface TikTokOAuthStartResponse {
  authUrl: string;
  state: string;
  expiresInSeconds: number;
}

export interface TikTokOAuthCompleteResponse {
  sellerId: string;
  shopName: string;
  selectedAdvertiser: TikTokAdvertiser | null;
  availableAdvertisers: TikTokAdvertiser[];
  tiktokAds: TikTokAdsSafeInfo;
}

export interface TikTokAuditLogItem {
  _id: string;
  sellerId: string;
  action: string;
  targetId?: string | null;
  actor: "seller" | "system" | "tiktok";
  outcome: "success" | "failure";
  errorMessage?: string | null;
  meta?: Record<string, unknown> | null;
  createdAt: string;
}

export interface TikTokEventItem {
  _id: string;
  sellerId: string;
  eventName: string;
  eventId?: string | null;
  eventTime: string;
  forwardStatus: "stored" | "forwarded" | "failed";
  forwardError?: string | null;
  createdAt: string;
}

export interface TikTokStatusResponse {
  sellerId: string;
  isConnected: boolean;
  advertiserId: string | null;
  advertiserName: string | null;
  hasAccessToken: boolean;
  tokenExpiresAt: string | null;
  connectionError: string | null;
  monthlyBudgetCap: number | null;
  lastSyncedAt: string | null;
  issues: string[];
  isFullyConfigured: boolean;
  health: { apiSuccessRate: number; avgResponseMs: number; lastError: string | null; lastErrorAt: string | null; totalCalls: number };
}

export interface AddProductPayload {
  name: string;
  price: number;
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
  mainCategory: string;
  subCategory: string;
  description?: string;
  sizes: string[];
  colors: string[];
}

/** Single variant cell update sent to the Inventory bulk-save endpoint. */
export interface InventoryVariantUpdate {
  variantId?: string;
  size: string;
  color: string;
  stock: number;
  sku?: string;
}

export const sellerService = {
  getProducts: () =>
    api
      .get<{ message: string; products: ApiProduct[] }>("/seller/products")
      .then((r) => r.data.products),

  addProduct: (payload: AddProductPayload) => {
    const form = new FormData();
    form.append("name", payload.name);
    form.append("price", Number(payload.price));
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

  // ─── TikTok Ads ─────────────────────────────────────────────────────────────
  startTikTokAdsOAuth: () =>
    api
      .get<{ message: string } & TikTokOAuthStartResponse>("/seller/tiktok-ads/oauth/start")
      .then((r) => ({ authUrl: r.data.authUrl, state: r.data.state, expiresInSeconds: r.data.expiresInSeconds })),

  completeTikTokAdsOAuth: (params: { auth_code: string; state: string }) =>
    api
      .get<{ message: string } & TikTokOAuthCompleteResponse>("/seller/tiktok-ads/oauth/callback", { params })
      .then((r) => ({
        sellerId: r.data.sellerId,
        shopName: r.data.shopName,
        selectedAdvertiser: r.data.selectedAdvertiser,
        availableAdvertisers: r.data.availableAdvertisers,
        tiktokAds: r.data.tiktokAds,
      })),

  getTikTokAdvertisers: () =>
    api
      .get<{ advertisers: TikTokAdvertiser[]; currentAdvertiserId: string | null }>("/seller/tiktok-ads/advertisers")
      .then((r) => r.data),

  configureTikTokAdvertiser: (advertiserId: string) =>
    api
      .post<{ message: string; tiktokAds: TikTokAdsSafeInfo }>("/seller/tiktok-ads/configure-advertiser", { advertiserId })
      .then((r) => r.data.tiktokAds),

  disconnectTikTokAds: () =>
    api
      .delete<{ message: string; tiktokAds: TikTokAdsSafeInfo }>("/seller/tiktok-ads")
      .then((r) => r.data.tiktokAds),

  getTikTokAdsDashboard: (params?: TikTokRangeFilter) =>
    api
      .get<{ dashboard: TikTokDashboardResponse }>("/seller/tiktok-ads", { params })
      .then((r) => r.data.dashboard),

  syncTikTokAds: (payload?: TikTokRangeFilter) =>
    api
      .post<{ message: string; dashboard: TikTokDashboardResponse }>("/seller/tiktok-ads/sync", payload ?? {})
      .then((r) => r.data.dashboard),

  setTikTokCampaignStatus: (campaignId: string, action: "pause" | "resume") =>
    api
      .post<{ message: string; campaign: TikTokCampaign | null }>(`/seller/tiktok-ads/campaigns/${campaignId}/status`, { action })
      .then((r) => r.data.campaign),

  deleteTikTokCampaign: (campaignId: string) =>
    api
      .delete<{ message: string; deleted: boolean }>(`/seller/tiktok-ads/campaigns/${campaignId}`)
      .then((r) => r.data),

  setTikTokBudgetCap: (monthlyBudgetCap: number | null) =>
    api
      .put<{ message: string; tiktokAds: TikTokAdsSafeInfo }>("/seller/tiktok-ads/budget", { monthlyBudgetCap })
      .then((r) => r.data.tiktokAds),

  getTikTokAuditLogs: (params?: { limit?: number; action?: string }) =>
    api
      .get<{ count: number; logs: TikTokAuditLogItem[] }>("/seller/tiktok-ads/audit", { params })
      .then((r) => r.data.logs),

  getTikTokAdsStatus: () =>
    api.get<TikTokStatusResponse>("/seller/tiktok-ads/status").then((r) => r.data),

  getTikTokAdsEvents: (params?: TikTokRangeFilter) =>
    api
      .get<{ sellerId: string; count: number; events: TikTokEventItem[] }>("/seller/tiktok-ads/events", { params })
      .then((r) => r.data.events),

  // Traffic Analytics
  getTrafficOverview: (params?: TrafficRangeParams) =>
    api
      .get<{ overview: TrafficOverview }>("/seller/traffic/overview", { params })
      .then((r) => r.data.overview),

  getTrafficSources: (params?: TrafficRangeParams) =>
    api
      .get<{ sources: TrafficSourceRow[] }>("/seller/traffic/sources", { params })
      .then((r) => r.data.sources),

  exportTrafficReport: (params?: TrafficRangeParams) =>
    api
      .get("/seller/traffic/export", { params, responseType: "blob" })
      .then((r) => r.data as Blob),

  // Public beacon — records an anonymous product page visit from a tracked link
  trackProductVisit: (
    productId: string,
    body: { source?: string; visitorId?: string; deviceType?: string; referrer?: string },
  ) => api.post(`/products/${productId}/visit`, body).then((r) => r.data),
  // ─── Inventory ────────────────────────────────────────────────────────────
  getInventoryStats: (): Promise<{
    totalActive: number;
    lowStock: number;
    outOfStock: number;
    outOfStockVariants: number;
    totalUnits: number;
    lowStockItems: {
      _id: string;
      name: string;
      totalStock: number;
      minVariantStock?: number;
      images: { url: string }[];
      worstVariant?: { size: string; color: string; stock: number };
    }[];
    outOfStockItems: {
      _id: string;
      name: string;
      totalStock: number;
      images: { url: string }[];
    }[];
  }> =>
    api.get(`/seller/inventory/stats`).then((r) => r.data.stats),

  getInventory: (params?: { page?: number; limit?: number; search?: string }) =>
    api
      .get<{
        inventory: {
          items: Array<{
            _id: string;
            name: string;
            sizes: string[];
            colors: string[];
            variants: Array<{ _id: string; size: string; color: string; stock: number; sku?: string }>;
            totalStock: number;
            inStock: boolean;
            lowestVariantStock: number;
            images: { url: string }[];
          }>;
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(`/seller/inventory`, { params })
      .then((r) => r.data.inventory),

  /** Bulk-update variant cells. Send only the cells the seller actually changed. */
  updateInventory: (productId: string, payload: { variants: InventoryVariantUpdate[] }) =>
    api
      .put<{ message: string; product: ApiProduct }>(`/seller/inventory/${productId}`, payload)
      .then((r) => r.data.product),

  getProductPromotion: (productId: string) =>
    api
      .get<{ product: { _id: string; name: string; price: number; images?: { url: string }[]; promotion?: { active?: boolean; type?: "percentage" | "amount"; value?: number; startDate?: string | null; endDate?: string | null } } }>(`/seller/promotions/${productId}`)
      .then((r) => r.data.product),

  upsertPromotion: (productId: string, promo: { active: boolean; type: "percentage" | "amount"; value: number; startDate?: string; endDate?: string }) =>
    api.post(`/seller/promotions/${productId}`, promo).then((r) => r.data),

  listPromotions: () => api.get(`/seller/promotions`).then((r) => r.data.promotions),

  removePromotion: (productId: string) => api.delete(`/seller/promotions/${productId}`).then((r) => r.data),

  getProductAnalytics: (productId: string, params?: { startDate?: string; endDate?: string }) => api.get(`/seller/analytics/product/${productId}`, { params }).then((r) => r.data.analytics),

  getRevenueAnalytics: (): Promise<{
    totalRevenue: { value: number; count: number };
    pendingRevenue: { value: number; count: number };
    available: { value: number; count: number };
    thisMonth: { value: number; count: number };
    daily: { _id: string; revenue: number; orders: number }[];
    recentOrders: { _id: string; status: string; totalAmount: number; createdAt: string; shippingDetails: { wilaya: string } }[];
  }> => api.get(`/seller/analytics/revenue`).then((r) => r.data.analytics),

  // ── Confirmators ────────────────────────────────────────────────────────────
  getConfirmators: () =>
    api
      .get<{ confirmators: import("../types/api").ApiConfirmator[] }>("/seller/confirmators")
      .then((r) => r.data.confirmators),

  inviteConfirmator: (email: string, fullName: string) =>
    api
      .post<{ confirmator: import("../types/api").ApiConfirmator; message: string }>(
        "/seller/confirmators",
        { email, fullName },
      )
      .then((r) => r.data),

  removeConfirmator: (id: string) =>
    api.delete<{ message: string }>(`/seller/confirmators/${id}`).then((r) => r.data),

  // ── Order label ─────────────────────────────────────────────────────────────
  downloadOrderLabel: async (orderId: string): Promise<void> => {
    const response = await api.get(`/seller/orders/${orderId}/label`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `label-${orderId.slice(-8).toUpperCase()}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};
