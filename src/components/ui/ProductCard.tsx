import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Product } from "../../types";

// Maps stored color names → hex for reliable swatch rendering
const COLOR_HEX: Record<string, string> = {
  black: "#1a1a1a", white: "#f9f9f9", beige: "#f5f0e1",
  gray: "#9ca3af", grey: "#9ca3af", brown: "#7c3f1a",
  navy: "#1e3a5f", red: "#dc2626", burgundy: "#7f1d1d",
  pink: "#f9a8d4", orange: "#f97316", yellow: "#fde047",
  green: "#16a34a", olive: "#6b7c2d", blue: "#2563eb",
  teal: "#0d9488", purple: "#7c3aed", gold: "#C9A84C",
  khaki: "#c3b091", ivory: "#fffff0", cream: "#fffdd0",
  rose: "#fb7185", lavender: "#c4b5fd", sage: "#84a98c",
  silver: "#c0c0c0",
};

function colorToHex(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return COLOR_HEX[key] ?? name.toLowerCase().replace(/\s+/g, "");
}

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
  const isLowStock = !isOutOfStock && product.stock <= 5;

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
        onClick={() => onViewDetail(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            hovered && hasSecondImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />
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
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
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
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            sx={{
              bgcolor: "rgba(255,255,255,0.85)", borderRadius: 0,
              width: 32, height: 32, "&:hover": { bgcolor: "#fff" },
            }}
          >
            {liked
              ? <FavoriteIcon sx={{ fontSize: 14, color: "#ef4444" }} />
              : <FavoriteBorderIcon sx={{ fontSize: 14, color: "rgba(26,26,46,0.5)" }} />
            }
          </IconButton>
        </div>

        {/* Quick view — bottom overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<VisibilityIcon sx={{ fontSize: 13 }} />}
            onClick={() => onViewDetail(product)}
            fullWidth
            sx={{ fontSize: "0.68rem", letterSpacing: "0.08em", py: 0.8, borderRadius: 0 }}
          >
            Quick View
          </Button>
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
        className="p-3 flex flex-col gap-2 flex-1"
        onClick={() => onViewDetail(product)}
      >
        {/* Category + name */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-[#C9A84C] mb-0.5">
            {product.category}
          </p>
          <p className="text-sm font-bold text-[#1A1A2E] leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors duration-200">
            {product.name}
          </p>
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 6).map((c) => (
                <span
                  key={c}
                  title={c}
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-1 ring-inset ring-black/10"
                  style={{ backgroundColor: colorToHex(c) }}
                />
              ))}
              {product.colors.length > 6 && (
                <span className="text-[9px] font-bold text-[#1A1A2E]/35">
                  +{product.colors.length - 6}
                </span>
              )}
            </div>
            <span className="text-[9px] text-[#1A1A2E]/35 tracking-wide">
              {product.colors.length} color{product.colors.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {product.sizes.slice(0, 5).map((s) => (
              <span
                key={s}
                className="px-1.5 py-px text-[9px] font-bold tracking-wide text-[#1A1A2E]/50 bg-[#1A1A2E]/5 border border-[#1A1A2E]/8"
              >
                {s}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="px-1.5 py-px text-[9px] font-bold text-[#C9A84C] bg-[#C9A84C]/8 border border-[#C9A84C]/20">
                +{product.sizes.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-1.5 border-t border-[#1A1A2E]/6">
          <span className="text-base font-bold text-[#1A1A2E]">
            {product.price.toLocaleString()}
            <span className="text-[10px] font-normal text-[#1A1A2E]/45 ml-1">DZD</span>
          </span>
        </div>
      </div>
    </div>
  );
}
