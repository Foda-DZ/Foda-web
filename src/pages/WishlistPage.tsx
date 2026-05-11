import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import IconButton from "@mui/material/IconButton";
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
        {/* Header - matching CartPage style */}
        <div className="dark-gradient pt-24 pb-8 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-3xl font-bold text-white">
              {tr.wishlist.title}
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 sm:py-20">
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

  return (
    <div className="min-h-screen bg-cream">
      {/* Header - matching CartPage dark gradient style */}
      <div className="dark-gradient pt-24 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors duration-200 mb-4 text-sm group"
          >
            <ArrowBackIcon
              sx={{ fontSize: 15 }}
              className="rtl:rotate-180 group-hover:-translate-x-0.5 transition-transform"
            />
            {tr.cartPage.continueShopping}
          </button>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold text-white">
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
        ) : items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 backdrop-blur-sm border border-charcoal/10 rounded-2xl">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6">
              <FavoriteBorderIcon sx={{ fontSize: 42, color: "#C9A84C" }} />
            </div>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-2">
              {tr.wishlist.emptyTitle}
            </h2>
            <p className="text-charcoal/50 text-sm mb-8 max-w-sm">
              {tr.wishlist.emptySub}
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="btn-gold flex items-center gap-2 group"
            >
              {tr.nav.shop}
              <ArrowForwardIcon
                sx={{ fontSize: 16 }}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        ) : (
          /* ── Wishlist items - styled like CartPage ── */
          <div className="space-y-4">
            {items.map((product) => {
              const hasDiscount =
                product.originalPrice && product.originalPrice > product.price;
              return (
                <div
                  key={product.id}
                  className="bg-white border border-charcoal/8 p-4 sm:p-5 flex gap-4 sm:gap-5 rounded-xl"
                >
                  {/* Image */}
                  <Link
                    to={`/products/${product.id}`}
                    className="w-24 h-28 sm:w-28 sm:h-32 flex-shrink-0 overflow-hidden bg-cream rounded-lg"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="text-gold text-[10px] uppercase tracking-widest">
                          {product.category}
                        </p>
                        <Link
                          to={`/products/${product.id}`}
                          className="text-charcoal font-semibold text-sm leading-tight hover:text-gold transition-colors truncate block"
                        >
                          {product.name}
                        </Link>
                        {/* Colors available */}
                        {product.colors.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-charcoal/50 text-xs">
                              Colors:
                            </span>
                            <div className="flex items-center gap-1">
                              {product.colors.slice(0, 4).map((color, idx) => (
                                <span
                                  key={idx}
                                  className="w-3 h-3 rounded-full border border-black/10"
                                  style={{ backgroundColor: colorToHex(color) }}
                                  title={color}
                                />
                              ))}
                              {product.colors.length > 4 && (
                                <span className="text-[9px] text-charcoal/40">
                                  +{product.colors.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {/* Sizes available */}
                        {product.sizes.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-charcoal/50 text-xs">
                              Sizes:
                            </span>
                            <span className="text-charcoal/50 text-xs">
                              {product.sizes.slice(0, 4).join(", ")}
                              {product.sizes.length > 4 &&
                                ` +${product.sizes.length - 4}`}
                            </span>
                          </div>
                        )}
                      </div>
                      <IconButton
                        onClick={() => removeFromWishlist(product.id)}
                        size="small"
                        sx={{
                          borderRadius: 0,
                          color: "rgba(26,26,46,0.3)",
                          "&:hover": {
                            color: "#ef4444",
                            bgcolor: "transparent",
                          },
                          flexShrink: 0,
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-3">
                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-charcoal">
                          {product.price.toLocaleString()}{" "}
                          <span className="text-[10px] font-normal text-charcoal/50">
                            {tr.common.dzd}
                          </span>
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-charcoal/30 line-through">
                            {product.originalPrice!.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Move to Cart Button */}
                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={product.stock === 0}
                        className="flex items-center gap-1.5 btn-dark py-2 px-4 text-xs font-semibold tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ShoppingBagIcon sx={{ fontSize: 14 }} />
                        {tr.wishlist.moveToCart}
                      </button>
                    </div>

                    {product.stock === 0 && (
                      <p className="text-xs text-red-500 mt-2">
                        {tr.shop.soldOut}
                      </p>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                      <p className="text-xs text-orange-500 mt-2">
                        {product.stock} left
                      </p>
                    )}
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
