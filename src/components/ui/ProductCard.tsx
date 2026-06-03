import { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  delay?: number;
}

export default function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, openLogin } = useAuth();
  const isCustomer = user?.role === "customer";
  const [hovered, setHovered] = useState(false);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);
  const liked = isCustomer && isInWishlist(product.id);
  const hasSecondImage = product.images.length > 1;
  const isOutOfStock = !product.inStock || product.totalStock === 0;
  const isLowStock = !isOutOfStock && product.totalStock <= 5;
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : 0;

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isCustomer) {
      openLogin();
      return;
    }
    setWishlistAnimating(true);
    setTimeout(() => setWishlistAnimating(false), 300);
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
          {hasDiscount && (
            <span className="text-white bg-red-500 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
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

        {/* Wishlist button — top right */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-sm border transition-all duration-200 ${
            liked
              ? "bg-red-50/90 border-red-200 shadow-md"
              : "bg-white/80 border-white/60 shadow-sm hover:bg-white hover:shadow-md"
          } ${wishlistAnimating ? "scale-125" : "scale-100"}`}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {liked ? (
            <FavoriteIcon sx={{ fontSize: 16, color: "#ef4444" }} />
          ) : (
            <FavoriteBorderIcon
              sx={{ fontSize: 16, color: "rgba(26,26,46,0.6)" }}
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

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-[15px] font-bold text-[#1A1A2E]">
            {product.price.toLocaleString()}
            <span className="text-[11px] font-normal text-[#1A1A2E]/40 ml-1">
              DZD
            </span>
          </span>
          {hasDiscount && (
            <span className="text-[12px] font-medium text-[#1A1A2E]/30 line-through">
              {product.originalPrice!.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
