import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { Product } from "../types";
import { useAuth } from "./AuthContext";
import { wishlistService } from "../services/wishlistService";
import { apiProductToProduct } from "../lib/mappers";

// ─── Types ────────────────────────────────────────────────────────────────────
interface WishlistContextValue {
  items: Product[];
  totalItems: number;
  loading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist from backend when an authenticated customer is present
  useEffect(() => {
    if (!isCustomer) {
      setItems([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    wishlistService
      .getWishlist()
      .then((apiProducts) => {
        if (!cancelled) {
          setItems(apiProducts.map(apiProductToProduct));
        }
      })
      .catch(() => {
        // Silently fail — wishlist will be empty
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isCustomer, user?.id]);

  const addToWishlist = useCallback(
    async (product: Product) => {
      if (!isCustomer) return;
      // Optimistic update
      setItems((prev) => {
        if (prev.some((i) => i.id === product.id)) return prev;
        return [...prev, product];
      });
      try {
        await wishlistService.addToWishlist(product.id);
      } catch {
        // Revert on failure
        setItems((prev) => prev.filter((i) => i.id !== product.id));
      }
    },
    [isCustomer],
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (!isCustomer) return;
      // Keep removed item for rollback
      let removed: Product | undefined;
      setItems((prev) => {
        removed = prev.find((i) => i.id === productId);
        return prev.filter((i) => i.id !== productId);
      });
      try {
        await wishlistService.removeFromWishlist(productId);
      } catch {
        // Revert on failure
        if (removed) {
          setItems((prev) => [...prev, removed!]);
        }
      }
    },
    [isCustomer],
  );

  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.id === productId),
    [items],
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        totalItems: items.length,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
