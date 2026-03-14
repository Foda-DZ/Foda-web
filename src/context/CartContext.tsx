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
import type { Product, CartItem, CartState, CartAction } from "../types";
import type { ApiCartItem } from "../types/api";
import { useAuth } from "./AuthContext";
import { cartService } from "../services/cartService";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartContextValue extends CartState {
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
  loading: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function mapApiItem(item: ApiCartItem): CartItem {
  return {
    key: `${item.productId}-${item.selectedChoices.size}-${item.selectedChoices.color}`,
    product: {
      id: item.productId,
      name: item.name,
      price: item.price,
      images: item.image ? [item.image] : [],
      category: "",
      sizes: [],
      colors: [],
      description: "",
      stock: 999,
      isNew: false,
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
      const { product, size, color, quantity } = action.payload;
      const key = `${product.id}-${size}-${color}`;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
              : i,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { key, product, size, color, quantity }],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.key !== action.payload) };
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
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";

  // Keep a ref to items for async callbacks
  const itemsRef = useRef(state.items);
  itemsRef.current = state.items;

  // ── Fetch cart from backend ───────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!isCustomer) return;
    try {
      setLoading(true);
      const cart = await cartService.getCart();
      dispatch({ type: "SET_ITEMS", payload: cart.items.map(mapApiItem) });
    } catch {
      // Cart doesn't exist yet — keep empty
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  // Fetch or clear when auth changes
  useEffect(() => {
    if (isCustomer) {
      fetchCart();
    } else {
      dispatch({ type: "CLEAR" });
    }
  }, [isCustomer, fetchCart]);

  // ── Add item ──────────────────────────────────────────────────────────────
  const addItem = useCallback(
    (product: Product, size: string, color: string, quantity = 1) => {
      if (!isCustomer) return;

      // Optimistic update
      dispatch({ type: "ADD_ITEM", payload: { product, size, color, quantity } });
      dispatch({ type: "OPEN_CART" });

      // Backend sync
      (async () => {
        try {
          for (let i = 0; i < quantity; i++) {
            await cartService.addItem(product.id, size, color);
          }
          const cart = await cartService.getCart();
          dispatch({ type: "SET_ITEMS", payload: cart.items.map(mapApiItem) });
        } catch {
          fetchCart();
        }
      })();
    },
    [isCustomer, fetchCart],
  );

  // ── Remove item ───────────────────────────────────────────────────────────
  const removeItem = useCallback(
    (key: string) => {
      const item = itemsRef.current.find((i) => i.key === key);
      if (!item) return;

      // Optimistic update
      dispatch({ type: "REMOVE_ITEM", payload: key });

      if (!isCustomer) return;

      (async () => {
        try {
          await cartService.removeItem(item.product.id);
          const cart = await cartService.getCart();
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

      // Optimistic update
      dispatch({ type: "UPDATE_QTY", payload: { key, quantity } });

      if (!isCustomer) return;

      const diff = quantity - item.quantity;

      (async () => {
        try {
          if (diff > 0) {
            // Increment: call addItem diff times
            for (let i = 0; i < diff; i++) {
              await cartService.addItem(item.product.id, item.size, item.color);
            }
          } else {
            // Decrement: remove then re-add with new quantity
            await cartService.removeItem(item.product.id);
            for (let i = 0; i < quantity; i++) {
              await cartService.addItem(item.product.id, item.size, item.color);
            }
          }
          const cart = await cartService.getCart();
          dispatch({ type: "SET_ITEMS", payload: cart.items.map(mapApiItem) });
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
