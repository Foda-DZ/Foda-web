import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import type { Product } from "../types";
import AuthRequiredEmptyState from "../components/ui/AuthRequiredEmptyState";

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
          className="absolute top-3 right-3 text-charcoal/40 hover:text-charcoal"
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </button>

        <h3 className="font-display text-lg font-bold text-charcoal mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-charcoal/50 mb-5">
          {product.price.toLocaleString()} {tr.common.dzd}
        </p>

        {/* Size */}
        {product.sizes.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold tracking-widest uppercase text-charcoal/60 mb-2">
              {tr.shop.size}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 text-xs font-semibold border-2 transition-all ${
                    size === s
                      ? "border-gold text-gold bg-gold/5"
                      : "border-charcoal/12 text-charcoal/60"
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
            <p className="text-xs font-bold tracking-widest uppercase text-charcoal/60 mb-2">
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
                      ? "ring-2 ring-gold ring-offset-2"
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
      <div className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-16 sm:pb-20">
          <AuthRequiredEmptyState
            icon={
              <FavoriteBorderIcon sx={{ fontSize: 42, color: "#C9A84C" }} />
            }
            title={tr.wishlist.signInTitle}
            subtitle={tr.wishlist.signInSub}
            helperText={tr.auth.login.sub}
            ctaLabel={tr.nav.signIn}
            onCta={() =>
              openLogin({ customerOnly: true, redirectTo: "/wishlist" })
            }
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 py-20">
          <AuthRequiredEmptyState
            icon={<FavoriteBorderIcon sx={{ fontSize: 38, color: "#C9A84C" }} />}
            title={tr.wishlist.emptyTitle}
            subtitle={tr.wishlist.emptySub}
            ctaLabel={tr.cartPage.continueShopping}
            onCta={() => navigate("/shop")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-4">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-charcoal/40 hover:text-gold transition-colors duration-200 mb-4 text-sm group"
        >
          <ArrowBackIcon
            sx={{ fontSize: 15 }}
            className="rtl:rotate-180 group-hover:-translate-x-0.5 transition-transform"
          />
          {tr.cartPage.continueShopping}
        </button>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-charcoal">
            {tr.wishlist.title}
          </h1>
          {!loading && items.length > 0 && (
            <span className="gold-gradient text-charcoal text-xs font-black px-3 py-1 rounded-full">
              {items.length}{" "}
              {items.length === 1 ? tr.wishlist.item : tr.wishlist.items}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {loading ? (
          /* ── Loading state ── */
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              <div
                className="absolute inset-0 w-12 h-12 border-2 border-transparent border-b-gold/30 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              />
            </div>
            <p className="text-sm text-charcoal/50">{tr.wishlist.loading}</p>
          </div>
        ) : (
          /* ── Wishlist items — modern product-card grid ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => {
              const hasDiscount =
                product.originalPrice && product.originalPrice > product.price;
              const discountPercent = hasDiscount
                ? Math.round(
                    ((product.originalPrice! - product.price) /
                      product.originalPrice!) *
                      100,
                  )
                : 0;
              const outOfStock = !product.inStock || product.totalStock === 0;
              const lowStock = !outOfStock && product.totalStock <= 5;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-[#F4F2EF] aspect-[3/4]">
                    <Link to={`/products/${product.id}`} className="absolute inset-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Soft gradient overlay for legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                    {/* Status badges — top left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      {outOfStock && (
                        <span className="text-white bg-black/50 text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {tr.shop.soldOut}
                        </span>
                      )}
                      {lowStock && (
                        <span className="text-white bg-orange-500 text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
                          {product.totalStock} left
                        </span>
                      )}
                    </div>

                    {/* Discount badge — bottom left */}
                    {hasDiscount && (
                      <span className="absolute bottom-3 left-3 z-10 text-white bg-red-500 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-md shadow-sm">
                        -{discountPercent}%
                      </span>
                    )}

                    {/* Remove from wishlist — top right */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label="Remove from wishlist"
                      className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-sm border border-white/60 bg-white/80 shadow-sm hover:bg-red-50/90 hover:border-red-200 hover:shadow-md hover:shadow-red-200/40 transition-all duration-300 ease-out hover:scale-110 active:scale-90"
                    >
                      <DeleteOutlineIcon
                        sx={{ fontSize: 17, color: "rgba(26,26,46,0.6)" }}
                        className="group-hover:text-[#ef4444]"
                      />
                    </button>
                  </div>

                  {/* Card body */}
                  <div className="p-3.5 flex flex-col gap-1 flex-1">
                    <Link to={`/products/${product.id}`}>
                      <p className="text-[11px] font-semibold tracking-widest uppercase text-[#1A1A2E]/45 truncate">
                        {product.brand || product.category}
                      </p>
                      <p className="text-[13px] font-semibold text-[#1A1A2E] leading-snug line-clamp-2 hover:text-[#C9A84C] transition-colors duration-200 min-h-[2.4em]">
                        {product.name}
                      </p>
                    </Link>

                    {/* Colors */}
                    {product.colors.length > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        {product.colors.slice(0, 5).map((color, idx) => (
                          <span
                            key={idx}
                            className="w-3 h-3 rounded-full border border-black/10"
                            style={{ backgroundColor: colorToHex(color) }}
                            title={color}
                          />
                        ))}
                        {product.colors.length > 5 && (
                          <span className="text-[9px] text-charcoal/40">
                            +{product.colors.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-1">
                      <span
                        className={`text-[15px] font-bold ${hasDiscount ? "text-red-500" : "text-[#1A1A2E]"}`}
                      >
                        {product.price.toLocaleString()}
                        <span
                          className={`text-[11px] font-normal ml-1 ${hasDiscount ? "text-red-500/60" : "text-[#1A1A2E]/40"}`}
                        >
                          {tr.common.dzd}
                        </span>
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] text-charcoal/40 line-through ml-2">
                          {product.originalPrice!.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Move to Cart */}
                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={outOfStock}
                      className="mt-2.5 w-full flex items-center justify-center gap-1.5 btn-dark py-2.5 text-xs font-semibold tracking-wider rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ShoppingBagIcon sx={{ fontSize: 14 }} />
                      {tr.wishlist.moveToCart}
                    </button>
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
    </div>
  );
}
