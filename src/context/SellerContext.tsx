import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import type { Product } from "../types";
import type { ApiOrder, ApiOrderStatus } from "../types/api";
import { useAuth } from "./AuthContext";
import { sellerService } from "../services/sellerService";
import type { AddProductPayload } from "../services/sellerService";
import { apiProductToProduct } from "../lib/mappers";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SellerStats {
  totalOrders: number;
  revenue: number;
  productCount: number;
  lowStock: Product[];
}

interface SellerContextValue {
  /** Products belonging to the current seller */
  sellerProducts: Product[];
  /** Alias of sellerProducts — for backward-compatibility with ShopPage */
  allProducts: Product[];
  /** Orders for the current seller */
  allOrders: ApiOrder[];
  loading: boolean;
  error: string | null;
  getSellerOrders: (sellerId: string) => ApiOrder[];
  getSellerStats: (sellerId: string) => SellerStats;
  createProduct: (payload: AddProductPayload) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: ApiOrderStatus) => Promise<void>;
  reload: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const SellerContext = createContext<SellerContextValue | null>(null);

export function SellerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (user?.role !== "seller") {
      setProducts([]);
      setOrders([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([sellerService.getProducts(), sellerService.getOrders()])
      .then(([apiProducts, apiOrders]) => {
        if (cancelled) return;
        setProducts(apiProducts.map(apiProductToProduct));
        setOrders(apiOrders);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, tick]);

  const getSellerOrders = useCallback(
    (sellerId: string): ApiOrder[] =>
      orders.filter((o) => o.sellerId === sellerId),
    [orders],
  );

  const getSellerStats = useCallback(
    (sellerId: string): SellerStats => {
      const sellerOrders = orders.filter((o) => o.sellerId === sellerId);
      const revenue = sellerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const lowStock = products.filter((p) => p.stock <= 5);
      return {
        totalOrders: sellerOrders.length,
        revenue,
        productCount: products.length,
        lowStock,
      };
    },
    [orders, products],
  );

  const createProduct = useCallback(
    async (payload: AddProductPayload): Promise<Product> => {
      const apiProduct = await sellerService.addProduct(payload);
      const product = apiProductToProduct(apiProduct);
      setProducts((prev) => [...prev, product]);
      return product;
    },
    [],
  );

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    await sellerService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateOrderStatus = useCallback(
    async (id: string, status: ApiOrderStatus): Promise<void> => {
      await sellerService.updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o)),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      sellerProducts: products,
      allProducts: products,
      allOrders: orders,
      loading,
      error,
      getSellerOrders,
      getSellerStats,
      createProduct,
      deleteProduct,
      updateOrderStatus,
      reload,
    }),
    [
      products,
      orders,
      loading,
      error,
      getSellerOrders,
      getSellerStats,
      createProduct,
      deleteProduct,
      updateOrderStatus,
      reload,
    ],
  );

  return (
    <SellerContext.Provider value={value}>{children}</SellerContext.Provider>
  );
}

export function useSellerContext(): SellerContextValue {
  const ctx = useContext(SellerContext);
  if (!ctx)
    throw new Error("useSellerContext must be used within SellerProvider");
  return ctx;
}
