// ─── Product ──────────────────────────────────────────────────────────────────
export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  badge: string | null;
  badgeColor: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: string[];
  stock: number;
  isNew: boolean;
  sellerId?: number; // undefined = platform product
}

// ─── Cart ──────────────────────────────────────────────────────────────────────
export interface CartItem {
  key: string;       // `${productId}-${size}-${colorName}`
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; size: string; color: ProductColor; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { key: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

// ─── Auth ──────────────────────────────────────────────────────────────────────
export type UserRole = "buyer" | "seller";

export interface SessionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface StoredUser extends SessionUser {
  password: string;
  emailVerified: boolean;
  createdAt: string;
}

export type AuthModalView = "login" | "register" | "reset" | "verify" | null;

// ─── Orders ────────────────────────────────────────────────────────────────────
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

export interface OrderDelivery {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  city: string;
  notes: string;
}

export interface StoredOrder {
  id: string;
  buyerId: number;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  delivery: OrderDelivery;
  createdAt: string;
  status: OrderStatus;
}
