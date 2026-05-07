// ─── Shared ───────────────────────────────────────────────────────────────────
export interface ApiImageObject {
  url: string;
  publicId: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface ApiCustomer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  imageUrl: ApiImageObject | null;
}

export interface ApiSeller {
  id: string;
  shopName: string;
  email: string;
  phone: number | null;
  logoUrl: string | null;
  isActive: boolean;
}

export interface ApiAuthResponse {
  message: string;
  customer: ApiCustomer | null;
  seller: ApiSeller | null;
  accessToken: string;
}

// ─── Products ─────────────────────────────────────────────────────────────────
export type ApiCategory =
  | "Men"
  | "Women"
  | "Kids"
  | "Accessories"
  | "Other";

export type ApiSubCategory =
  | "Shirts"
  | "Pants"
  | "Dresses"
  | "Shoes"
  | "Jackets"
  | "Hoodies"
  | "Jeans"
  | "Shorts"
  | "T-Shirts"
  | "Sweaters"
  | "Coats"
  | "Bags"
  | "Hats"
  | "Other";

export interface ApiProduct {
  _id: string;
  sellerId: string;
  name: string;
  images: ApiImageObject[];
  price: number;
  inStock: boolean;
  description: string;
  stock: number;
  sizes: string[];
  colors: string[];
  mainCategory: ApiCategory;
  subCategory: ApiSubCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ApiReview {
  _id: string;
  customerId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProductReviewCustomer {
  _id: string;
  fullName: string;
}

export interface ApiProductReview {
  _id: string;
  customerId: ApiProductReviewCustomer;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProductReviewsResponse {
  reviews: ApiProductReview[];
}

export interface ApiProductSharePlatforms {
  whatsapp: string;
  facebook: string;
  telegram: string;
  instagram: string;
}

export interface ApiProductShare {
  productUrl: string;
  platforms: ApiProductSharePlatforms;
}

export interface ApiProductShareResponse {
  message: string;
  share: ApiProductShare;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface ApiCartItem {
  productId: string;
  sellerId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  selectedChoices: { size: string; color: string };
}

export interface ApiCart {
  _id: string;
  customerId: string;
  items: ApiCartItem[];
  totalPrice: number;
}

// ─── Shipping & Orders ────────────────────────────────────────────────────────
export interface ApiShippingDetails {
  phone: string;
  wilaya: string;
  commune: string;
  postalCode?: string;
  shippingType: "home_delivery" | "desk_pickup";
  shippingFee?: number;
}

export type ApiOrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

/** Populated customer reference returned by seller orders endpoint */
export interface ApiOrderCustomer {
  _id: string;
  fullName: string;
  email: string;
}

export interface ApiOrder {
  _id: string;
  customerId: string | ApiOrderCustomer;
  sellerId: string;
  items: ApiCartItem[];
  shippingDetails: ApiShippingDetails;
  status: ApiOrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiManageOrderResponse {
  message: string;
  order: ApiOrder;
}

// ─── Seller Settings ─────────────────────────────────────────────────────────
export interface ApiSellerSettingsResponse {
  message: string;
  seller: {
    id: string;
    shopName: string;
    email: string;
    phone: number | null;
    address: { wilaya: string; commune: string } | null;
    logoUrl: string | null;
  };
}

/** Response from POST /cart/checkout */
export interface ApiCheckoutResponse {
  message: string;
  orders: ApiOrder[];
}

// ─── Shipping Fees ───────────────────────────────────────────────────────────
export interface ApiCheckoutShippingFeeItem {
  wilaya_id: number;
  wilaya_name: string | null;
  commune_id: number | null;
  commune_name: string | null;
  fees: {
    home?: number;
    desk?: number;
    return?: number;
  };
}

export interface ApiCheckoutShippingFeesResponse {
  shippingFees: {
    meta?: {
      company_id?: number;
      company_name?: string;
      company_code?: string;
      sub_provider?: string;
      api_code?: string;
      provider_enum?: string;
      timestamp?: string;
    };
    data: ApiCheckoutShippingFeeItem[];
    status: string;
  };
}

// ─── Customer Profile ─────────────────────────────────────────────────────────
export interface ApiCustomerProfile {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: "customer";
  shippingAddress: string | null;
  wishlist: string[];
  isVerified: boolean;
  imageUrl: ApiImageObject | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Delivery Companies ────────────────────────────────────────────────────────
export interface ApiDeliveryCompany {
  _id: string;
  id: number;
  name: string;
  api_code: string;
  company_code: string;
  logo: string;
}

export interface ApiDeliveryCompaniesResponse {
  companies: ApiDeliveryCompany[];
}

export interface ApiCompleteSellerSetupPayload {
  wilaya: string;
  commune: string;
  deliveryCompany: string;
  seller_delivery_token?: string;
}

export interface ApiCompleteSellerSetupResponse {
  message: string;
  seller: {
    _id: string;
    shopName: string;
    email: string;
    address: {
      wilaya: string;
      commune: string;
    };
    company_code: string;
  };
}
