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
  category: ApiCategory;
  createdAt: string;
  updatedAt: string;
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

export interface ApiOrder {
  _id: string;
  customerId: string;
  sellerId: string;
  items: ApiCartItem[];
  shippingDetails: ApiShippingDetails;
  status: ApiOrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
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
