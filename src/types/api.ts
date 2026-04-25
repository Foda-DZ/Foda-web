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
