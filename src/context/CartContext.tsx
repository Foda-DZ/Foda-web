import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Product, CartItem, CartState, CartAction, Variant } from "../types";
import type { ApiCartItem } from "../types/api";
import { useAuth } from "./AuthContext";
import { cartService } from "../services/cartService";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartContextValue extends CartState {
  addItem: (
    product: Product,
    size: string,
    color: string,
    quantity?: number,
  ) => Promise<void>;
  removeItem: (key: string) => void;
  updateQty: (key: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
  loading: boolean;
  lastError: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Build a CartItem from an API cart line. variantId is the line identity. */
function mapApiItem(item: ApiCartItem): CartItem {
  return {
    key: `${item.productId}-${item.variantId}`,
    variantId: item.variantId,
    product: {
      id: item.productId,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      images: item.image ? [item.image] : [],
      category: "",
      sizes: [],
      colors: [],
      variants: [],
      totalStock: 0,
      inStock: true,
      description: "",
      isNew: false,
      sellerId: item.sellerId,
    },
    size: item.selectedChoices.size,
    color: item.selectedChoices.color,
    quantity: item.quantity,
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    case "ADD_ITEM": {
      const { product, variantId, size, color, quantity } = action.payload;
      const key = `${product.id}-${variantId}`;
      const existing = state.items.find((i) => i.key === key);
      const variantStock =
        product.variants.find((v) => v.variantId === variantId)?.stock ?? Infinity;
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key
              ? { ...i, quantity: Math.min(i.quantity + quantity, variantStock) }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { key, product, variantId, size, color, quantity: Math.min(quantity, variantStock) },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.key !== action.payload),
      };
    case "UPDATE_QTY": {
      const { key, quantity } = action.payload;
      if (quantity < 1)
        return { ...state, items: state.items.filter((i) => i.key !== key) };
      return {
        ...state,
        items: state.items.map((i) => (i.key === key ? { ...i, quantity } : i)),
      };
    }
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

const initialState: CartState = { items: [], isOpen: false };

// ─── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";

  const itemsRef = useRef(state.items);
  itemsRef.current = state.items;

  const fetchCart = useCallback(async () => {
    if (!isCustomer) return;
    try {
      setLoading(true);
      const cart = await cartService.getCart();
      dispatch({ type: "SET_ITEMS", payload: cart.items.map(mapApiItem) });
    } catch {
      /* cart not created yet — keep empty */
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => {
    if (isCustomer) {
      fetchCart();
    } else {
      dispatch({ type: "CLEAR" });
    }
  }, [isCustomer, fetchCart]);

  // ── Add item ──────────────────────────────────────────────────────────────
  const addItem = useCallback(
    async (product: Product, size: string, color: string, quantity = 1) => {
      if (!isCustomer) return;
      setLastError(null);

      const variant: Variant | undefined = product.variants.find(
        (v) => v.size === size && v.color === color,
      );
      if (!variant) {
        setLastError("That size/color is not available");
        return;
      }

      // Optimistic update keyed by variantId.
      dispatch({
        type: "ADD_ITEM",
        payload: { product, variantId: variant.variantId, size, color, quantity },
      });

      try {
        const cart = await cartService.addItem(product.id, size, color, quantity);
        dispatch({ type: "SET_ITEMS", payload: cart.items.map(mapApiItem) });
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err instanceof Error ? err.message : "Could not add to cart");
        setLastError(message);
        await fetchCart(); // rollback to server truth
      }
    },
    [isCustomer, fetchCart],
  );

  // ── Remove item ───────────────────────────────────────────────────────────
  const removeItem = useCallback(
    (key: string) => {
      const item = itemsRef.current.find((i) => i.key === key);
      if (!item) return;

      dispatch({ type: "REMOVE_ITEM", payload: key });
      if (!isCustomer) return;

      (async () => {
        try {
          const cart = await cartService.removeItem(item.product.id, {
            variantId: item.variantId,
          });
          dispatch({ type: "SET_ITEMS", payload: cart.items.map(mapApiItem) });
        } catch {
          fetchCart();
        }
      })();
    },
    [isCustomer, fetchCart],
  );

  // ── Update quantity ───────────────────────────────────────────────────────
  const updateQty = useCallback(
    (key: string, quantity: number) => {
      const item = itemsRef.current.find((i) => i.key === key);
      if (!item) return;

      if (quantity < 1) {
        removeItem(key);
        return;
      }

      dispatch({ type: "UPDATE_QTY", payload: { key, quantity } });
      if (!isCustomer) return;

      const diff = quantity - item.quantity;

      (async () => {
        try {
          if (diff > 0) {
            const cart = await cartService.addItem(
              item.product.id,
              item.size,
              item.color,
              diff,
            );
            dispatch({ type: "SET_ITEMS", payload: cart.items.map(mapApiItem) });
          } else {
            await cartService.removeItem(item.product.id, { variantId: item.variantId });
            if (quantity > 0) {
              const cart = await cartService.addItem(
                item.product.id,
                item.size,
                item.color,
                quantity,
              );
              dispatch({ type: "SET_ITEMS", payload: cart.items.map(mapApiItem) });
            } else {
              await fetchCart();
            }
          }
        } catch {
          fetchCart();
        }
      })();
    },
    [isCustomer, fetchCart, removeItem],
  );

  // ── Clear cart ────────────────────────────────────────────────────────────
  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
    if (!isCustomer) return;
    (async () => {
      try {
        await cartService.clearCart();
      } catch {
        fetchCart();
      }
    })();
  }, [isCustomer, fetchCart]);

  // ── Drawer controls ───────────────────────────────────────────────────────
  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openCart,
        closeCart,
        totalItems,
        subtotal,
        loading,
        lastError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
