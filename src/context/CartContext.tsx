import { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  Product,
  ProductColor,
  CartItem,
  CartState,
  CartAction,
} from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartContextValue extends CartState {
  addItem: (
    product: Product,
    size: string,
    color: ProductColor,
    quantity?: number,
  ) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size, color, quantity } = action.payload;
      const key = `${product.id}-${size}-${color.name}`;
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + quantity, product.stock),
                }
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

function loadCartItems(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem("foda_cart") || "[]") as CartItem[];
  } catch {
    return [];
  }
}

const initialState: CartState = {
  items: loadCartItems(),
  isOpen: false,
};

// ─── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("foda_cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (
    product: Product,
    size: string,
    color: ProductColor,
    quantity = 1,
  ) => {
    dispatch({ type: "ADD_ITEM", payload: { product, size, color, quantity } });
    dispatch({ type: "OPEN_CART" });
  };

  const removeItem = (key: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: key });
  const updateQty = (key: string, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", payload: { key, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR" });
  const openCart = () => dispatch({ type: "OPEN_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

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
