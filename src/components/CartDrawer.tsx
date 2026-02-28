import { useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LangContext";
import type { CartItem } from "../types";

const SHIPPING_THRESHOLD = 5000;

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQty,
    subtotal,
    totalItems,
  } = useCart();
  const { tr, isRTL } = useLang();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 750;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-400 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer fixed top-0 right-0 h-full w-full max-w-[420px] z-[101] flex flex-col dark-gradient shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${
          isOpen ? "cart-drawer-open translate-x-0" : "cart-drawer-closed translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#C9A84C]" />
            <h2 className="font-display text-xl font-bold text-white">
              {tr.cart.title}
            </h2>
            {totalItems > 0 && (
              <span className="gold-gradient text-[#1A1A2E] text-xs font-black px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-[#C9A84C]/50 transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Free shipping progress */}
        {subtotal < SHIPPING_THRESHOLD && (
          <div className="px-6 py-3 bg-white/5 border-b border-white/10">
            <div className="flex justify-between text-xs text-white/50 mb-1.5">
              <span>
                {tr.cart.addMore.replace("{amount}", (SHIPPING_THRESHOLD - subtotal).toLocaleString())}
              </span>
              <span>{tr.cart.freeShippingAt}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full gold-gradient rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
        {subtotal >= SHIPPING_THRESHOLD && (
          <div className="px-6 py-3 bg-[#C9A84C]/10 border-b border-[#C9A84C]/20">
            <p className="text-xs text-[#C9A84C] font-semibold text-center">
              {tr.cart.qualifies}
            </p>
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-6">
              <div className="w-20 h-20 border border-white/10 flex items-center justify-center">
                <Package size={32} className="text-white/20" />
              </div>
              <div>
                <p className="text-white font-display text-lg mb-1">
                  {tr.cart.empty}
                </p>
                <p className="text-white/40 text-sm">
                  {tr.cart.emptySub}
                </p>
              </div>
              <button onClick={closeCart} className="btn-gold">
                {tr.cart.explore}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.key}
                item={item}
                onRemove={() => removeItem(item.key)}
                onUpdateQty={(q) => updateQty(item.key, q)}
                removeLabel={tr.cart.remove}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>{tr.cart.subtotal}</span>
                <span>{subtotal.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>{tr.cart.shipping}</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-[#C9A84C]">{tr.cart.free}</span>
                  ) : (
                    `${shipping.toLocaleString()} DZD`
                  )}
                </span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between font-bold">
                <span className="text-white">{tr.cart.total}</span>
                <span className="gold-text font-display text-xl">
                  {total.toLocaleString()} DZD
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-gold w-full flex items-center justify-center gap-2 group"
            >
              {tr.cart.checkout}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <button
              onClick={closeCart}
              className="w-full text-center text-white/40 hover:text-white/70 text-xs transition-colors duration-200"
            >
              {tr.cart.continueShopping}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

interface CartItemRowProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQty: (q: number) => void;
  removeLabel: string;
}

function CartItemRow({ item, onRemove, onUpdateQty, removeLabel }: CartItemRowProps) {
  const { product, size, color, quantity } = item;

  return (
    <div className="flex gap-4 group">
      <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-white/5">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-white/40 text-[10px] uppercase tracking-widest truncate">
              {product.brand}
            </p>
            <p className="text-white font-semibold text-sm leading-tight truncate">
              {product.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white/40 text-xs">{size}</span>
              <span className="text-white/20 text-xs">·</span>
              <span className="flex items-center gap-1 text-xs text-white/40">
                <span
                  className="w-3 h-3 rounded-full inline-block border border-white/20"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </span>
            </div>
          </div>
          <button
            onClick={onRemove}
            aria-label={removeLabel}
            className="text-white/20 hover:text-red-400 transition-colors duration-200 flex-shrink-0 mt-0.5"
          >
            <Trash2 size={13} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-white/15">
            <button
              onClick={() => onUpdateQty(quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all duration-150"
            >
              <Minus size={11} />
            </button>
            <span className="w-7 text-center text-white text-sm font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQty(Math.min(quantity + 1, product.stock))}
              className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all duration-150"
            >
              <Plus size={11} />
            </button>
          </div>
          <p className="gold-text font-bold text-sm">
            {(product.price * quantity).toLocaleString()} DZD
          </p>
        </div>
      </div>
    </div>
  );
}
