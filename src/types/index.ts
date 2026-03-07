// ─── Product ──────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  sizes: string[];
  description: string;
  stock: number;
  isNew: boolean;
  sellerId?: string;
}

// ─── Cart ──────────────────────────────────────────────────────────────────────
export interface CartItem {
  key: string;     // `${productId}-${size}`
  product: Product;
  size: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; size: string; quantity: number } }
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
}

export type AuthModalView = "login" | "register" | "reset" | "verify" | null;

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
