import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SecurityIcon from "@mui/icons-material/Security";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import IconButton from "@mui/material/IconButton";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LangContext";

const SHIPPING_THRESHOLD = 5000;

export default function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, removeItem, updateQty } = useCart();
  const { tr } = useLang();

  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 750;
  const total = subtotal + shipping;

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    setDiscountError(tr.cartPage.invalidCode);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <div className="dark-gradient pt-24 pb-8 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-3xl font-bold text-white">
              {tr.cartPage.title}
            </h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="flex flex-col items-center justify-center text-center gap-6">
            <div className="w-20 h-20 border border-[#1A1A2E]/10 flex items-center justify-center">
              <Inventory2Icon
                sx={{ fontSize: 32, color: "rgba(26,26,46,0.15)" }}
              />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-[#1A1A2E] mb-1">
                {tr.cartPage.emptyTitle}
              </p>
              <p className="text-[#1A1A2E]/40 text-sm">
                {tr.cartPage.emptySub}
              </p>
            </div>
            <button onClick={() => navigate("/shop")} className="btn-gold">
              {tr.cartPage.continueShopping}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="dark-gradient pt-24 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-white/50 hover:text-[#C9A84C] transition-colors duration-200 mb-4 text-sm"
          >
            <ArrowBackIcon sx={{ fontSize: 15 }} className="rtl:rotate-180" />
            {tr.cartPage.continueShopping}
          </button>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold text-white">
              {tr.cartPage.title}
            </h1>
            <span className="gold-gradient text-[#1A1A2E] text-xs font-black px-3 py-1 rounded-full">
              {items.reduce((s, i) => s + i.quantity, 0)}{" "}
              {tr.cartPage.itemCount}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.key}
                className="bg-white border border-[#1A1A2E]/8 p-4 sm:p-5 flex gap-4 sm:gap-5"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="w-24 h-28 sm:w-28 sm:h-32 flex-shrink-0 overflow-hidden bg-[#F0EBE3]"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-[#C9A84C] text-[10px] uppercase tracking-widest">
                        {item.product.category}
                      </p>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="text-[#1A1A2E] font-semibold text-sm leading-tight hover:text-[#C9A84C] transition-colors truncate block"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        {item.size && (
                          <span className="text-[#1A1A2E]/50 text-xs border border-[#1A1A2E]/10 px-2 py-0.5">
                            {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="flex items-center gap-1 text-[#1A1A2E]/50 text-xs">
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 inline-block"
                              style={{
                                backgroundColor: item.color.toLowerCase(),
                              }}
                            />
                            {item.color}
                          </span>
                        )}
                      </div>
                    </div>
                    <IconButton
                      onClick={() => removeItem(item.key)}
                      size="small"
                      sx={{
                        borderRadius: 0,
                        color: "rgba(26,26,46,0.3)",
                        "&:hover": { color: "#ef4444", bgcolor: "transparent" },
                        flexShrink: 0,
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="flex items-center border border-[#1A1A2E]/15">
                      <IconButton
                        onClick={() => updateQty(item.key, item.quantity - 1)}
                        size="small"
                        sx={{
                          borderRadius: 0,
                          width: 32,
                          height: 32,
                          color: "rgba(26,26,46,0.5)",
                          "&:hover": {
                            color: "#1A1A2E",
                            bgcolor: "rgba(26,26,46,0.05)",
                          },
                        }}
                      >
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <span className="w-8 text-center text-[#1A1A2E] text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <IconButton
                        onClick={() =>
                          updateQty(
                            item.key,
                            Math.min(item.quantity + 1, item.product.stock),
                          )
                        }
                        size="small"
                        sx={{
                          borderRadius: 0,
                          width: 32,
                          height: 32,
                          color: "rgba(26,26,46,0.5)",
                          "&:hover": {
                            color: "#1A1A2E",
                            bgcolor: "rgba(26,26,46,0.05)",
                          },
                        }}
                      >
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </div>
                    <p className="gold-text font-bold text-sm font-display">
                      {(item.product.price * item.quantity).toLocaleString()}{" "}
                      DZD
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-28 self-start">
            {/* Discount Code */}
            <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-3">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50 flex items-center gap-2">
                <LocalOfferIcon sx={{ fontSize: 13, color: "#C9A84C" }} />
                {tr.cartPage.discountCode}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value);
                    setDiscountError("");
                  }}
                  placeholder={tr.cartPage.enterCode}
                  className="flex-1 border border-[#1A1A2E]/15 bg-transparent px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                />
                <button
                  onClick={handleApplyDiscount}
                  className="px-4 py-2 text-xs font-semibold tracking-wider uppercase border border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white transition-all duration-200"
                >
                  {tr.cartPage.apply}
                </button>
              </div>
              {discountError && (
                <p className="text-xs text-red-500">{discountError}</p>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-4">
              <h3 className="font-display font-bold text-[#1A1A2E] text-lg">
                {tr.cartPage.orderSummary}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[#1A1A2E]/60">
                  <span>{tr.cart.subtotal}</span>
                  <span>{subtotal.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-sm text-[#1A1A2E]/60">
                  <span>{tr.cart.shipping}</span>
                  <span
                    className={
                      shipping === 0 ? "text-[#C9A84C] font-semibold" : ""
                    }
                  >
                    {shipping === 0
                      ? tr.cart.free
                      : `${shipping.toLocaleString()} DZD`}
                  </span>
                </div>
                <div className="h-px bg-[#1A1A2E]/8" />
                <div className="flex justify-between font-bold">
                  <span className="text-[#1A1A2E]">{tr.cart.total}</span>
                  <span className="gold-text font-display text-xl">
                    {total.toLocaleString()} DZD
                  </span>
                </div>
              </div>

              {/* Free shipping progress */}
              {subtotal < SHIPPING_THRESHOLD && (
                <div className="pt-2">
                  <p className="text-xs text-[#1A1A2E]/40 mb-1.5">
                    {tr.cart.addMore.replace(
                      "{amount}",
                      (SHIPPING_THRESHOLD - subtotal).toLocaleString(),
                    )}
                  </p>
                  <div className="h-1 bg-[#1A1A2E]/8 rounded-full overflow-hidden">
                    <div
                      className="h-full gold-gradient rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate("/checkout")}
                className="btn-gold w-full flex items-center justify-center gap-2 group"
              >
                {tr.cart.checkout}
                <ArrowForwardIcon
                  sx={{ fontSize: 16 }}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* Trust signals */}
            <div className="space-y-2">
              {[
                { Icon: SecurityIcon, text: tr.cartPage.secureCheckout },
                { Icon: LocalShippingIcon, text: tr.cartPage.freeShippingOver },
              ].map(({ Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-xs text-[#1A1A2E]/40"
                >
                  <Icon
                    sx={{ fontSize: 13, color: "#C9A84C", flexShrink: 0 }}
                  />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
