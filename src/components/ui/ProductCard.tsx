import { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  delay?: number;
  /** Show a "Trending" badge (for the analytics-driven trending section). */
  trending?: boolean;
}

export default function ProductCard({ product, delay = 0, trending = false }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, openLogin } = useAuth();
  const { tr } = useLang();
  const isCustomer = user?.role === "customer";
  const [hovered, setHovered] = useState(false);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);
  const liked = isCustomer && isInWishlist(product.id);
  const hasSecondImage = product.images.length > 1;
  const isOutOfStock = !product.inStock || product.totalStock === 0;
  const isLowStock = !isOutOfStock && product.totalStock <= 5;

  // A "deal" is either an active promotion or a static original-price markdown.
  // Promotion takes priority. We resolve everything into a single shape:
  //   dealPrice      → what the customer pays now
  //   referencePrice → the original ("reference") price, shown struck through
  //   dealPercent    → the discount percentage
  const promo =
    product.promotion?.active && (product.promotion.value ?? 0) > 0
      ? product.promotion
      : null;

  let dealPrice: number | null = null;
  let referencePrice: number | null = null;
  let dealPercent = 0;

  if (promo) {
    dealPrice =
      promo.type === "percentage"
        ? product.price * (1 - promo.value! / 100)
        : Math.max(0, product.price - promo.value!);
    referencePrice = product.price;
    dealPercent =
      promo.type === "percentage"
        ? Math.round(promo.value!)
        : Math.round((promo.value! / product.price) * 100);
  } else if (product.originalPrice && product.originalPrice > product.price) {
    dealPrice = product.price;
    referencePrice = product.originalPrice;
    dealPercent = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );
  }

  const hasDeal = dealPrice !== null && referencePrice !== null;
  const displayPrice = hasDeal ? dealPrice! : product.price;

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isCustomer) {
      openLogin();
      return;
    }
    setWishlistAnimating(true);
    setTimeout(() => setWishlistAnimating(false), 450);
    if (liked) removeFromWishlist(product.id);
    else addToWishlist(product);
  }

  return (
    <div
      className="group relative flex flex-col bg-white cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image area ── */}
      <div
        className="relative overflow-hidden bg-[#F4F2EF] aspect-[3/4]"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {/* Main image */}
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
            hovered && hasSecondImage
              ? "opacity-0 scale-[1.04]"
              : "opacity-100 scale-100"
          }`}
        />

        {/* Hover image */}
        {hasSecondImage && (
          <img
            src={product.images[1]}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
              hovered ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"
            }`}
          />
        )}

        {/* Soft gradient overlay at bottom for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {trending && (
            <span className="flex items-center gap-1 text-charcoal gold-gradient text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              <LocalFireDepartmentIcon sx={{ fontSize: 12 }} />
              {tr.products.trendingBadge}
            </span>
          )}
          {product.isNew && !hasDeal && (
            <span className="text-white bg-[#1A1A2E] text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {isOutOfStock && (
            <span className="text-white bg-black/50 text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">
              Sold Out
            </span>
          )}
          {isLowStock && (
            <span className="text-white bg-orange-500 text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              {product.totalStock} left
            </span>
          )}
        </div>

        {/* Deal badge — bottom left (promo or static discount) */}
        {hasDeal && (
          <span className="absolute bottom-3 left-3 z-10 text-white bg-red-500 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-md shadow-sm">
            {tr.products.deal}
          </span>
        )}

        {/* Wishlist button — top right */}
        <button
          onClick={handleWishlist}
          className={`group/heart absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-sm border transition-all duration-300 ease-out hover:scale-115 active:scale-90 ${
            liked
              ? "bg-red-50/90 border-red-200 shadow-md shadow-red-200/50"
              : "bg-white/80 border-white/60 shadow-sm hover:bg-white hover:border-red-200 hover:shadow-md hover:shadow-red-200/40"
          } ${wishlistAnimating ? "animate-heart-pop" : ""}`}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {liked ? (
            <FavoriteIcon
              sx={{ fontSize: 16, color: "#ef4444" }}
              className="transition-transform duration-300 group-hover/heart:scale-110"
            />
          ) : (
            <FavoriteBorderIcon
              sx={{ fontSize: 16, color: "rgba(26,26,46,0.6)" }}
              className="transition-all duration-300 group-hover/heart:scale-110 group-hover/heart:text-[#ef4444]"
            />
          )}
        </button>
      </div>

      {/* ── Card body ── */}
      <div
        className="p-3.5 flex flex-col gap-1"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {/* Brand / seller name */}
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#1A1A2E]/45 truncate">
          {product.brand || product.sellerName || product.category}
        </p>

        {/* Product name */}
        <p className="text-[13px] font-semibold text-[#1A1A2E] leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors duration-200">
          {product.name}
        </p>

        {/* Price */}
        <div className="mt-1.5">
          <span className={`text-[15px] font-bold ${hasDeal ? "text-red-500" : "text-[#1A1A2E]"}`}>
            {Math.round(displayPrice).toLocaleString()}
            <span className={`text-[11px] font-normal ml-1 ${hasDeal ? "text-red-500/60" : "text-[#1A1A2E]/40"}`}>
              DZD
            </span>
          </span>

          {/* Reference price line — shown only on deals */}
          {hasDeal && (
            <p className="text-[11px] text-[#1A1A2E]/40 mt-0.5">
              {tr.products.referencePrice}:{" "}
              <span className="line-through">
                {referencePrice!.toLocaleString()}
              </span>{" "}
              <span className="text-red-500 font-semibold">-{dealPercent}%</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
