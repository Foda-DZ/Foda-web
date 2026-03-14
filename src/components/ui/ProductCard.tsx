import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import type { Product } from "../../types";

function RatingStars({ rating }: { rating: number }) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  for (let i = 0; i < full; i++) {
    stars.push(
      <StarIcon key={`f${i}`} sx={{ fontSize: 12, color: "#C9A84C" }} />,
    );
  }
  if (half) {
    stars.push(
      <StarHalfIcon key="h" sx={{ fontSize: 12, color: "#C9A84C" }} />,
    );
  }
  const empty = 5 - stars.length;
  for (let i = 0; i < empty; i++) {
    stars.push(
      <StarOutlineIcon
        key={`e${i}`}
        sx={{ fontSize: 12, color: "#C9A84C33" }}
      />,
    );
  }
  return <div className="flex items-center gap-px">{stars}</div>;
}

interface ProductCardProps {
  product: Product;
  delay?: number;
}

export default function ProductCard({
  product,
  delay = 0,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, openLogin } = useAuth();
  const isCustomer = user?.role === "customer";
  const [hovered, setHovered] = useState(false);
  const liked = isCustomer && isInWishlist(product.id);
  const hasSecondImage = product.images.length > 1;
  const isOutOfStock = product.stock === 0;
  const isLowStock = !isOutOfStock && product.stock <= 5;
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : 0;

  return (
    <div
      className="group relative flex flex-col bg-white cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image area ── */}
      <div
        className="relative overflow-hidden bg-[#F0EBE3] aspect-[3/4]"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            hovered && hasSecondImage
              ? "opacity-0 scale-105"
              : "opacity-100 scale-100"
          }`}
        />
        {hasSecondImage && (
          <img
            src={product.images[1]}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        )}

        {/* Badges — top left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="text-white bg-red-500 text-[9px] font-black tracking-[0.08em] px-2 py-0.5 uppercase">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="text-[#C9A84C] bg-[#1A1A2E] text-[9px] font-black tracking-[0.14em] px-2 py-0.5 uppercase">
              NEW
            </span>
          )}
          {isOutOfStock && (
            <span className="text-white bg-[#1A1A2E]/60 text-[9px] font-bold tracking-widest px-2 py-0.5 uppercase">
              Sold Out
            </span>
          )}
          {isLowStock && (
            <span className="text-white bg-orange-500/90 text-[9px] font-bold tracking-widest px-2 py-0.5 uppercase">
              {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist — top right */}
        <div className="absolute top-2 right-2 z-10">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (!isCustomer) {
                openLogin();
                return;
              }
              if (liked) removeFromWishlist(product.id);
              else addToWishlist(product);
            }}
            sx={{
              bgcolor: "rgba(255,255,255,0.85)",
              borderRadius: 0,
              width: 32,
              height: 32,
              "&:hover": { bgcolor: "#fff" },
            }}
          >
            {liked ? (
              <FavoriteIcon sx={{ fontSize: 14, color: "#ef4444" }} />
            ) : (
              <FavoriteBorderIcon
                sx={{ fontSize: 14, color: "rgba(26,26,46,0.5)" }}
              />
            )}
          </IconButton>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-px bg-[#1A1A2E]/6 overflow-hidden">
        <div
          className="h-full bg-[#C9A84C] transition-all duration-500"
          style={{ width: hovered ? "100%" : "0%" }}
        />
      </div>

      {/* ── Card body ── */}
      <div
        className="p-3 flex flex-col gap-1.5 flex-1"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {/* Category + seller */}
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-[#C9A84C]">
            {product.category}
          </p>
          {product.sellerName && (
            <p className="text-[9px] font-medium text-[#1A1A2E]/40 truncate max-w-[50%]">
              {product.sellerName}
            </p>
          )}
        </div>

        {/* Name */}
        <p className="text-sm font-bold text-[#1A1A2E] leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors duration-200">
          {product.name}
        </p>

        {/* Rating */}
        {product.rating != null && product.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <RatingStars rating={product.rating} />
            <span className="text-[10px] font-medium text-[#1A1A2E]/40">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-1.5 border-t border-[#1A1A2E]/6">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#1A1A2E]">
              {product.price.toLocaleString()}
              <span className="text-[10px] font-normal text-[#1A1A2E]/45 ml-1">
                DZD
              </span>
            </span>
            {hasDiscount && (
              <span className="text-xs font-medium text-[#1A1A2E]/30 line-through">
                {product.originalPrice!.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
