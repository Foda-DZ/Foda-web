import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import type { Product } from "../types";

const COLOR_HEX: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f9f9f9",
  beige: "#f5f0e1",
  gray: "#9ca3af",
  grey: "#9ca3af",
  brown: "#7c3f1a",
  navy: "#1e3a5f",
  red: "#dc2626",
  burgundy: "#7f1d1d",
  pink: "#f9a8d4",
  orange: "#f97316",
  yellow: "#fde047",
  green: "#16a34a",
  olive: "#6b7c2d",
  blue: "#2563eb",
  teal: "#0d9488",
  purple: "#7c3aed",
  gold: "#C9A84C",
  khaki: "#c3b091",
  ivory: "#fffff0",
  cream: "#fffdd0",
  rose: "#fb7185",
  lavender: "#c4b5fd",
  sage: "#84a98c",
  silver: "#c0c0c0",
};
function colorToHex(name: string): string {
  return (
    COLOR_HEX[name.toLowerCase().replace(/\s+/g, "")] ?? name.toLowerCase()
  );
}

// ── Mini modal for selecting size/color before moving to cart ──
function MoveToCartModal({
  product,
  onClose,
  onConfirm,
}: {
  product: Product;
  onClose: () => void;
  onConfirm: (size: string, color: string) => void;
}) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const { tr } = useLang();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#1A1A2E]/40 hover:text-[#1A1A2E]"
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </button>

        <h3 className="font-display text-lg font-bold text-[#1A1A2E] mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-[#1A1A2E]/50 mb-5">
          {product.price.toLocaleString()} {tr.common.dzd}
        </p>

        {/* Size */}
        {product.sizes.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold tracking-widest uppercase text-[#1A1A2E]/60 mb-2">
              {tr.shop.size}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 text-xs font-semibold border-2 transition-all ${
                    size === s
                      ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5"
                      : "border-[#1A1A2E]/12 text-[#1A1A2E]/60"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        {product.colors.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold tracking-widest uppercase text-[#1A1A2E]/60 mb-2">
              {tr.shop.color}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  title={c}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c
                      ? "ring-2 ring-[#C9A84C] ring-offset-2"
                      : "ring-1 ring-inset ring-black/15"
                  }`}
                  style={{ backgroundColor: colorToHex(c) }}
                />
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => onConfirm(size, color)}
          disabled={!size || !color}
          className="w-full flex items-center justify-center gap-2 btn-dark py-3 text-sm font-semibold tracking-wider disabled:opacity-40"
        >
          <ShoppingBagIcon sx={{ fontSize: 16 }} />
          {tr.wishlist.moveToCart}
        </button>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const navigate = useNavigate();
  const { items, removeFromWishlist, loading } = useWishlist();
  const { addItem } = useCart();
  const { user, openLogin } = useAuth();
  const { tr } = useLang();
  const isCustomer = user?.role === "customer";
  const [moveProduct, setMoveProduct] = useState<Product | null>(null);

  const handleMoveToCart = (product: Product) => {
    if (product.sizes.length <= 1 && product.colors.length <= 1) {
      // no selection needed
      addItem(product, product.sizes[0] ?? "", product.colors[0] ?? "", 1);
      removeFromWishlist(product.id);
    } else {
      setMoveProduct(product);
    }
  };

  const confirmMove = (size: string, color: string) => {
    if (!moveProduct) return;
    addItem(moveProduct, size, color, 1);
    removeFromWishlist(moveProduct.id);
    setMoveProduct(null);
  };

  // Non-authenticated users see a sign-in prompt
  if (!isCustomer) {
    return (
      <>
        <div className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 flex items-center justify-center bg-[#FAF7F2] border border-[#C9A84C]/20 mb-6">
              <PersonIcon sx={{ fontSize: 32, color: "#C9A84C33" }} />
            </div>
            <h2 className="font-display text-xl font-bold text-[#1A1A2E] mb-2">
              {tr.wishlist.signInTitle}
            </h2>
            <p className="text-sm text-[#1A1A2E]/50 mb-6 max-w-sm">
              {tr.wishlist.signInSub}
            </p>
            <button
              onClick={openLogin}
              className="btn-dark px-8 py-3 text-sm font-semibold tracking-wider"
            >
              {tr.nav.signIn}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#1A1A2E]">
            {tr.wishlist.title}
          </h1>
          {!loading && items.length > 0 && (
            <p className="text-sm text-[#1A1A2E]/50 mt-2">
              {items.length} {items.length === 1 ? tr.wishlist.item : tr.wishlist.items}
            </p>
          )}
        </div>

        {loading ? (
          /* ── Loading state ── */
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#1A1A2E]/40 mt-4">{tr.wishlist.loading}</p>
          </div>
        ) : items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 flex items-center justify-center bg-[#FAF7F2] border border-[#C9A84C]/20 mb-6">
              <FavoriteIcon sx={{ fontSize: 32, color: "#C9A84C33" }} />
            </div>
            <h2 className="font-display text-xl font-bold text-[#1A1A2E] mb-2">
              {tr.wishlist.emptyTitle}
            </h2>
            <p className="text-sm text-[#1A1A2E]/50 mb-6 max-w-sm">
              {tr.wishlist.emptySub}
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="btn-dark px-8 py-3 text-sm font-semibold tracking-wider"
            >
              {tr.nav.shop}
            </button>
          </div>
        ) : (
          /* ── Wishlist grid ── */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((product) => {
              const hasDiscount =
                product.originalPrice && product.originalPrice > product.price;
              return (
                <div key={product.id} className="relative group bg-white">
                  {/* Image */}
                  <div
                    className="relative overflow-hidden bg-[#F0EBE3] aspect-[3/4] cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {hasDiscount && (
                      <span className="absolute top-2.5 left-2.5 text-white bg-red-500 text-[9px] font-black tracking-[0.08em] px-2 py-0.5 uppercase">
                        -
                        {Math.round(
                          ((product.originalPrice! - product.price) /
                            product.originalPrice!) *
                            100,
                        )}
                        %
                      </span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#1A1A2E]/60 tracking-widest uppercase">
                          {tr.shop.soldOut}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-3">
                    <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-[#C9A84C] mb-1">
                      {product.category}
                    </p>
                    <p
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-sm font-bold text-[#1A1A2E] leading-snug line-clamp-2 cursor-pointer hover:text-[#C9A84C] transition-colors"
                    >
                      {product.name}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-base font-bold text-[#1A1A2E]">
                        {product.price.toLocaleString()}
                        <span className="text-[10px] font-normal text-[#1A1A2E]/45 ml-1">
                          {tr.common.dzd}
                        </span>
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#1A1A2E]/30 line-through">
                          {product.originalPrice!.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 flex items-center justify-center gap-1.5 btn-dark py-2 text-[11px] font-semibold tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ShoppingBagIcon sx={{ fontSize: 14 }} />
                        {tr.wishlist.moveToCart}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="w-9 h-9 flex items-center justify-center border border-[#1A1A2E]/12 hover:border-red-300 hover:bg-red-50 transition-all"
                      >
                        <DeleteOutlineIcon
                          sx={{ fontSize: 16, color: "#ef4444" }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Move to cart modal */}
      {moveProduct && (
        <MoveToCartModal
          product={moveProduct}
          onClose={() => setMoveProduct(null)}
          onConfirm={confirmMove}
        />
      )}

      <Footer />
    </>
  );
}
