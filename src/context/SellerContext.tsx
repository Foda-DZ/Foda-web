import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { products as platformProducts } from "../data/products";
import type { Product, StoredOrder } from "../types";
import { useAuth } from "./AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SellerStats {
  totalOrders: number;
  revenue: number;
  productCount: number;
  lowStock: Product[];
}

interface SellerContextValue {
  allProducts: Product[];
  sellerProducts: Product[];
  allOrders: StoredOrder[];
  getSellerOrders: (sellerId: number) => StoredOrder[];
  getSellerStats: (sellerId: number) => SellerStats;
  createProduct: (
    data: Omit<Product, "id" | "sellerId" | "rating" | "reviews" | "isNew">,
  ) => { success: true; product: Product } | { error: string };
  updateProduct: (
    id: number,
    data: Partial<Omit<Product, "id" | "sellerId">>,
  ) => { success: true } | { error: string };
  deleteProduct: (id: number) => { success: true } | { error: string };
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const SELLER_PRODUCTS_KEY = "foda_seller_products";
const ORDERS_KEY = "foda_orders";

function loadSellerProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem(SELLER_PRODUCTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function persistSellerProducts(products: Product[]): void {
  localStorage.setItem(SELLER_PRODUCTS_KEY, JSON.stringify(products));
}

function loadOrders(): StoredOrder[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const SellerContext = createContext<SellerContextValue | null>(null);

export function SellerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sellerProducts, setSellerProducts] =
    useState<Product[]>(loadSellerProducts);
  const [orders] = useState<StoredOrder[]>(loadOrders);

  // Merge platform (static) products with all seller-created products
  const allProducts = useMemo(
    () => [...platformProducts, ...sellerProducts],
    [sellerProducts],
  );

  // Only the current logged-in seller's products
  const currentSellerProducts = useMemo(
    () =>
      user?.role === "seller"
        ? sellerProducts.filter((p) => p.sellerId === user.id)
        : [],
    [sellerProducts, user],
  );

  const getSellerOrders = useCallback(
    (sellerId: number): StoredOrder[] =>
      orders.filter((o) =>
        o.items.some((item) => item.product.sellerId === sellerId),
      ),
    [orders],
  );

  const getSellerStats = useCallback(
    (sellerId: number): SellerStats => {
      const sellerOrders = getSellerOrders(sellerId);
      const revenue = sellerOrders.reduce((sum, order) => {
        const sellerRevenue = order.items
          .filter((item) => item.product.sellerId === sellerId)
          .reduce((s, item) => s + item.product.price * item.quantity, 0);
        return sum + sellerRevenue;
      }, 0);
      const myProducts = sellerProducts.filter((p) => p.sellerId === sellerId);
      return {
        totalOrders: sellerOrders.length,
        revenue,
        productCount: myProducts.length,
        lowStock: myProducts.filter((p) => p.stock <= 5),
      };
    },
    [getSellerOrders, sellerProducts],
  );

  const createProduct = useCallback(
    (
      data: Omit<Product, "id" | "sellerId" | "rating" | "reviews" | "isNew">,
    ): { success: true; product: Product } | { error: string } => {
      if (!user || user.role !== "seller") return { error: "Unauthorized." };
      if (!user.isActive) return { error: "Account pending approval." };
      const product: Product = {
        ...data,
        id: Date.now(),
        sellerId: user.id,
        rating: 0,
        reviews: 0,
        isNew: true,
      };
      const updated = [...sellerProducts, product];
      persistSellerProducts(updated);
      setSellerProducts(updated);
      return { success: true, product };
    },
    [user, sellerProducts],
  );

  const updateProduct = useCallback(
    (
      id: number,
      data: Partial<Omit<Product, "id" | "sellerId">>,
    ): { success: true } | { error: string } => {
      const idx = sellerProducts.findIndex((p) => p.id === id);
      if (idx === -1) return { error: "Product not found." };
      if (sellerProducts[idx].sellerId !== user?.id)
        return { error: "Unauthorized." };
      const updated = [...sellerProducts];
      updated[idx] = { ...updated[idx], ...data };
      persistSellerProducts(updated);
      setSellerProducts(updated);
      return { success: true };
    },
    [sellerProducts, user],
  );

  const deleteProduct = useCallback(
    (id: number): { success: true } | { error: string } => {
      const product = sellerProducts.find((p) => p.id === id);
      if (!product) return { error: "Product not found." };
      if (product.sellerId !== user?.id) return { error: "Unauthorized." };
      const updated = sellerProducts.filter((p) => p.id !== id);
      persistSellerProducts(updated);
      setSellerProducts(updated);
      return { success: true };
    },
    [sellerProducts, user],
  );

  return (
    <SellerContext.Provider
      value={{
        allProducts,
        sellerProducts: currentSellerProducts,
        allOrders: orders,
        getSellerOrders,
        getSellerStats,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
}

export function useSellerContext(): SellerContextValue {
  const ctx = useContext(SellerContext);
  if (!ctx)
    throw new Error("useSellerContext must be used within SellerProvider");
  return ctx;
}
