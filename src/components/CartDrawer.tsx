import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Inventory2Icon from "@mui/icons-material/Inventory2";
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
  const { tr } = useLang();

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 750;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeCart}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          bgcolor: "#1A1A2E",
          backgroundImage: "none",
          display: "flex",
          flexDirection: "column",
        },
      }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(4px)", bgcolor: "rgba(0,0,0,0.5)" },
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ShoppingBagIcon sx={{ fontSize: 20, color: "#C9A84C" }} />
          <h2 className="font-display text-xl font-bold text-white">
            {tr.cart.title}
          </h2>
          {totalItems > 0 && (
            <span className="gold-gradient text-[#1A1A2E] text-xs font-black px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </div>
        <IconButton
          onClick={closeCart}
          sx={{
            borderRadius: 0,
            width: 32,
            height: 32,
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.5)",
            "&:hover": { borderColor: "rgba(201,168,76,0.5)", color: "#fff" },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </div>

      {/* Free shipping progress */}
      {subtotal < SHIPPING_THRESHOLD && (
        <div className="px-6 py-3 bg-white/5 border-b border-white/10">
          <div className="flex justify-between text-xs text-white/50 mb-1.5">
            <span>
              {tr.cart.addMore.replace(
                "{amount}",
                (SHIPPING_THRESHOLD - subtotal).toLocaleString(),
              )}
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
              <Inventory2Icon
                sx={{ fontSize: 32, color: "rgba(255,255,255,0.2)" }}
              />
            </div>
            <div>
              <p className="text-white font-display text-lg mb-1">
                {tr.cart.empty}
              </p>
              <p className="text-white/40 text-sm">{tr.cart.emptySub}</p>
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
            <ArrowForwardIcon
              sx={{ fontSize: 16 }}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
          <button
            onClick={() => {
              closeCart();
              navigate("/cart");
            }}
            className="w-full text-center text-[#C9A84C] hover:text-[#d4b85d] text-xs font-semibold transition-colors duration-200"
          >
            {tr.cart.viewFullCart}
          </button>
          <button
            onClick={closeCart}
            className="w-full text-center text-white/40 hover:text-white/70 text-xs transition-colors duration-200"
          >
            {tr.cart.continueShopping}
          </button>
        </div>
      )}
    </Drawer>
  );
}

interface CartItemRowProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQty: (q: number) => void;
  removeLabel: string;
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQty,
  removeLabel,
}: CartItemRowProps) {
  const { product, size, color, quantity } = item;

  return (
    <div className="flex gap-4">
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
            <p className="text-[#C9A84C] text-[10px] uppercase tracking-widest truncate">
              {product.category}
            </p>
            <p className="text-white font-semibold text-sm leading-tight truncate">
              {product.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {size && (
                <span className="text-white/40 text-xs">{size}</span>
              )}
              {color && (
                <>
                  {size && <span className="text-white/20 text-xs">·</span>}
                  <span className="flex items-center gap-1 text-white/40 text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block flex-shrink-0"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    {color}
                  </span>
                </>
              )}
            </div>
          </div>
          <IconButton
            onClick={onRemove}
            aria-label={removeLabel}
            size="small"
            sx={{
              borderRadius: 0,
              color: "rgba(255,255,255,0.2)",
              "&:hover": { color: "#ef4444", bgcolor: "transparent" },
              flexShrink: 0,
              mt: 0.25,
            }}
          >
            <DeleteIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-white/15">
            <IconButton
              onClick={() => onUpdateQty(quantity - 1)}
              size="small"
              sx={{
                borderRadius: 0,
                width: 28,
                height: 28,
                color: "rgba(255,255,255,0.5)",
                "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.05)" },
              }}
            >
              <RemoveIcon sx={{ fontSize: 12 }} />
            </IconButton>
            <span className="w-7 text-center text-white text-sm font-semibold">
              {quantity}
            </span>
            <IconButton
              onClick={() => onUpdateQty(Math.min(quantity + 1, product.stock))}
              size="small"
              sx={{
                borderRadius: 0,
                width: 28,
                height: 28,
                color: "rgba(255,255,255,0.5)",
                "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.05)" },
              }}
            >
              <AddIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </div>
          <p className="gold-text font-bold text-sm">
            {(product.price * quantity).toLocaleString()} DZD
          </p>
        </div>
      </div>
    </div>
  );
}
