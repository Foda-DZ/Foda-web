// ─── Product ──────────────────────────────────────────────────────────────────
export interface ProductPromotion {
  active?: boolean;
  type?: "percentage" | "amount";
  value?: number;
  startDate?: string | null;
  endDate?: string | null;
}

export interface Variant {
  variantId: string;
  size: string;
  color: string;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  variants: Variant[];
  totalStock: number;
  inStock: boolean;
  description: string;
  isNew: boolean;
  sellerId?: string;
  sellerName?: string;
  rating?: number;
  reviewCount?: number;
  promotion?: ProductPromotion;
}

// ─── Cart ──────────────────────────────────────────────────────────────────────
export interface CartItem {
  key: string;       // `${productId}-${variantId}`
  product: Product;
  variantId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { product: Product; variantId: string; size: string; color: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { key: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

// ─── Auth ──────────────────────────────────────────────────────────────────────
export type UserRole = "customer" | "seller";

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  /** Seller-only fields (populated from login / settings responses) */
  shopName?: string;
  phone?: number | null;
  logoUrl?: string | null;
  address?: { wilaya: string; commune: string } | null;
  deliveryCompany?: string;
  deliveryToken?: string;
  connectionLabel?: string;
  sellerSetupStatus?: "pending" | "complete";
}

export type AuthModalView = "login" | "register" | "reset" | "verify" | null;

// ─── Collections ──────────────────────────────────────────────────────────────
export interface CollectionProduct {
  id: string;
  name: string;
  brand: string;
  image: string | null;
  price: number;
  totalStock: number;
  inStock: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string | null;
  productCount: number;
  products: CollectionProduct[];
  createdAt: string;
}

// ─── Orders ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingDetails {
  phone: string;
  wilaya: string;
  commune: string;
  postalCode?: string;
  shippingType: "home_delivery" | "desk_pickup";
}

export interface StoredOrder {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  shippingDetails: ShippingDetails;
  createdAt: string;
  status: OrderStatus;
}
