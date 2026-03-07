import { useState } from "react";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  onViewDetail: (p: Product) => void;
  delay?: number;
}

export default function ProductCard({
  product,
  onViewDetail,
  delay = 0,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const hasSecondImage = product.images.length > 1;
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className="group relative flex flex-col bg-white cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div
        className="relative overflow-hidden bg-[#F0EBE3] aspect-[3/4]"
        onClick={() => onViewDetail(product)}
      >
        {/* Primary image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            hovered && hasSecondImage
              ? "opacity-0 scale-105"
              : "opacity-100 scale-100"
          }`}
        />
        {/* Secondary image */}
        {hasSecondImage && (
          <img
            src={product.images[1]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        )}

        {/* Badges — top left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <Chip
              label="NEW"
              size="small"
              sx={{
                bgcolor: "#1A1A2E",
                color: "#C9A84C",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                height: 20,
                borderRadius: 0,
              }}
            />
          )}
          {isOutOfStock && (
            <Chip
              label="OUT OF STOCK"
              size="small"
              sx={{
                bgcolor: "rgba(26,26,46,0.55)",
                color: "#fff",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                height: 20,
                borderRadius: 0,
              }}
            />
          )}
        </div>

        {/* Wishlist — top right */}
        <div className="absolute top-2 right-2 z-10">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
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

        {/* Quick view — bottom overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 flex justify-center p-3 transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<VisibilityIcon sx={{ fontSize: 13 }} />}
            onClick={() => onViewDetail(product)}
            fullWidth
            sx={{ fontSize: "0.68rem", letterSpacing: "0.08em", py: 0.8 }}
          >
            Quick View
          </Button>
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-0.5 bg-[#1A1A2E]/5 overflow-hidden">
        <div
          className="h-full bg-[#C9A84C] transition-all duration-500"
          style={{ width: hovered ? "100%" : "0%" }}
        />
      </div>

      {/* Card body */}
      <div
        className="p-3 flex flex-col gap-1.5 flex-1"
        onClick={() => onViewDetail(product)}
      >
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#C9A84C] truncate">
          {product.category}
        </p>
        <p className="text-sm font-bold text-[#1A1A2E] leading-snug group-hover:text-[#C9A84C] transition-colors duration-200 line-clamp-2">
          {product.name}
        </p>

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {product.sizes.slice(0, 4).map((s) => (
              <Chip
                key={s}
                label={s}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  borderRadius: 0,
                  bgcolor: "rgba(26,26,46,0.06)",
                  color: "rgba(26,26,46,0.6)",
                }}
              />
            ))}
            {product.sizes.length > 4 && (
              <Chip
                label={`+${product.sizes.length - 4}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  borderRadius: 0,
                  bgcolor: "rgba(201,168,76,0.12)",
                  color: "#C9A84C",
                }}
              />
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-2">
          <span className="text-base font-bold text-[#1A1A2E]">
            {product.price.toLocaleString()}
            <span className="text-xs font-normal text-[#1A1A2E]/50 ml-1">
              DZD
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
