import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReplayIcon from "@mui/icons-material/Replay";
import SecurityIcon from "@mui/icons-material/Security";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";
import type { Product } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onViewProduct?: (p: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onViewProduct,
}: ProductDetailModalProps) {
  const { addItem } = useCart();
  const { user, openLogin } = useAuth();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (product) {
      setActiveImg(0);
      setSelectedSize(null);
      setQty(1);
      setAddedToCart(false);
      setSizeError(false);
    }
  }, [product]);

  useEffect(() => {
    productsService
      .getAll()
      .then((apiProducts) => setRelatedProducts(apiProducts.map(apiProductToProduct)))
      .catch(() => {});
  }, []);

  if (!product) return null;

  const hasSizes = product.sizes.length > 0;
  const isOutOfStock = product.stock === 0;
  const related = relatedProducts.filter((p) => p.id !== product.id).slice(0, 8);

  const handleAddToCart = () => {
    if (!user) { openLogin(); return; }
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    const sizeToAdd = selectedSize ?? "One Size";
    addItem(product, sizeToAdd, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const prevImg = () =>
    setActiveImg((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImg = () =>
    setActiveImg((i) => (i + 1) % product.images.length);

  const AddToCartButton = ({ compact = false }: { compact?: boolean }) => (
    <Button
      variant="contained"
      disabled={isOutOfStock}
      onClick={handleAddToCart}
      startIcon={
        addedToCart
          ? <CheckIcon sx={{ fontSize: compact ? 13 : 15 }} />
          : <ShoppingBagIcon sx={{ fontSize: compact ? 13 : 15 }} />
      }
      fullWidth
      sx={{
        height: compact ? 44 : 48,
        fontSize: compact ? "0.7rem" : "0.75rem",
        bgcolor: addedToCart ? "#16a34a" : sizeError ? "#ef4444" : "#C9A84C",
        color: "#1A1A2E",
        "&:hover": {
          bgcolor: addedToCart ? "#15803d" : sizeError ? "#dc2626" : "#D4B060",
        },
        "&:disabled": { bgcolor: "rgba(26,26,46,0.08)", color: "rgba(26,26,46,0.3)" },
      }}
    >
      {addedToCart
        ? compact ? "Added!" : "Added to Cart"
        : isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </Button>
  );

  return (
    <Dialog
      open={!!product}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="body"
      disableEnforceFocus
      slotProps={{
        backdrop: { sx: { bgcolor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" } },
      }}
      PaperProps={{
        sx: {
          bgcolor: "#FAF7F2",
          borderRadius: 0,
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          overflow: "hidden",
          maxHeight: { xs: "93dvh", sm: "92vh" },
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* ── Sticky header ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#1A1A2E]/10 flex-shrink-0 bg-[#FAF7F2] z-10">
        <div className="min-w-0 flex-1 pr-3">
          <p className="text-[#C9A84C] text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">
            {product.category}
          </p>
          <p className="font-display font-bold text-[#1A1A2E] text-sm sm:text-base leading-tight truncate">
            {product.name}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <IconButton
            size="small"
            onClick={() => setLiked(!liked)}
            sx={{
              borderRadius: 0, width: 32, height: 32,
              border: liked ? "1px solid #fca5a5" : "1px solid rgba(26,26,46,0.15)",
              color: liked ? "#ef4444" : "rgba(26,26,46,0.4)",
              bgcolor: liked ? "#fef2f2" : "transparent",
              "&:hover": { borderColor: "#fca5a5", color: "#ef4444" },
            }}
          >
            {liked ? <FavoriteIcon sx={{ fontSize: 13 }} /> : <FavoriteBorderIcon sx={{ fontSize: 13 }} />}
          </IconButton>
          <IconButton
            size="small"
            sx={{
              borderRadius: 0, width: 32, height: 32,
              border: "1px solid rgba(26,26,46,0.15)",
              color: "rgba(26,26,46,0.4)",
              "&:hover": { borderColor: "rgba(201,168,76,0.5)", color: "#C9A84C" },
            }}
          >
            <ShareIcon sx={{ fontSize: 13 }} />
          </IconButton>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              borderRadius: 0, width: 32, height: 32, ml: 0.5,
              color: "rgba(26,26,46,0.4)",
              "&:hover": { color: "#1A1A2E", bgcolor: "rgba(26,26,46,0.05)" },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">

        {/* LEFT — Image gallery */}
        <div className="lg:w-[55%] flex flex-col bg-[#F0EBE3] flex-shrink-0">
          <div className="relative overflow-hidden h-[42vw] max-h-56 sm:max-h-72 lg:max-h-none lg:flex-1">
            <img
              key={activeImg}
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ animation: "fadeIn .2s ease" }}
            />

            {/* Badges */}
            {product.isNew && (
              <div className="absolute top-2.5 left-2.5">
                <Chip
                  label="NEW"
                  size="small"
                  sx={{ bgcolor: "#1A1A2E", color: "#C9A84C", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", height: 20, borderRadius: 0 }}
                />
              </div>
            )}

            {/* Low-stock banner */}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="absolute bottom-0 left-0 right-0 bg-[#1A1A2E]/85 text-[#E8C96B] text-[10px] font-semibold px-3 py-1.5 text-center">
                Only {product.stock} left — Order soon
              </div>
            )}

            {/* Arrow nav */}
            {product.images.length > 1 && (
              <>
                <IconButton
                  onClick={prevImg}
                  size="small"
                  sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.8)", borderRadius: 0, "&:hover": { bgcolor: "#fff" }, width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 } }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 18, color: "#1A1A2E" }} />
                </IconButton>
                <IconButton
                  onClick={nextImg}
                  size="small"
                  sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.8)", borderRadius: 0, "&:hover": { bgcolor: "#fff" }, width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 } }}
                >
                  <ChevronRightIcon sx={{ fontSize: 18, color: "#1A1A2E" }} />
                </IconButton>
              </>
            )}

            {/* Dot indicators — mobile */}
            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 lg:hidden">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeImg ? "w-5 h-1.5 bg-[#C9A84C]" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail strip — desktop */}
          {product.images.length > 1 && (
            <div className="hidden lg:flex gap-2 p-3 flex-shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 overflow-hidden flex-shrink-0 transition-all duration-200 ${
                    i === activeImg
                      ? "ring-2 ring-[#C9A84C] ring-offset-2 ring-offset-[#F0EBE3]"
                      : "opacity-55 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Product info (scrollable) */}
        <div className="lg:w-[45%] overflow-y-auto flex-1">
          <div className="p-4 sm:p-5 lg:p-8 space-y-5">

            {/* Stock badge */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <Chip label="Out of Stock" size="small" sx={{ bgcolor: "#fee2e2", color: "#dc2626", borderRadius: 0, fontWeight: 700, fontSize: "0.68rem" }} />
              ) : (
                <Chip
                  label={`In Stock · ${product.stock} available`}
                  size="small"
                  sx={{ bgcolor: "#dcfce7", color: "#15803d", borderRadius: 0, fontWeight: 700, fontSize: "0.68rem" }}
                />
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                {product.price.toLocaleString()}{" "}
                <span className="text-base font-normal">DZD</span>
              </span>
            </div>

            <div className="h-px bg-[#1A1A2E]/8" />

            {/* Size selector */}
            {hasSizes && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-[10px] font-bold tracking-widest uppercase ${sizeError ? "text-red-500" : "text-[#1A1A2E]"}`}>
                    Size
                  </p>
                  {selectedSize ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#1A1A2E] text-[#C9A84C] tracking-widest uppercase">
                      {selectedSize} selected
                    </span>
                  ) : (
                    <span className={`text-[10px] font-medium ${sizeError ? "text-red-500" : "text-[#1A1A2E]/40"}`}>
                      {sizeError ? "Required — pick one" : "Choose a size"}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => { setSelectedSize(isSelected ? null : size); setSizeError(false); }}
                        className={`relative h-10 min-w-[48px] px-4 text-[11px] font-bold tracking-widest uppercase border-2 transition-all duration-200 select-none ${
                          isSelected
                            ? "border-[#1A1A2E] bg-[#1A1A2E] text-[#C9A84C] shadow-md"
                            : sizeError
                              ? "border-red-300 text-[#1A1A2E]/50 hover:border-red-400"
                              : "border-[#1A1A2E]/20 text-[#1A1A2E]/60 hover:border-[#1A1A2E] hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/5"
                        }`}
                      >
                        {size}
                        {isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C9A84C] rounded-full flex items-center justify-center shadow-sm">
                            <CheckIcon sx={{ fontSize: 9, color: "#1A1A2E" }} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {sizeError && (
                  <p className="text-red-500 text-[11px] mt-2 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
                    Please select a size before adding to cart.
                  </p>
                )}
              </div>
            )}

            {/* Quantity + Add to cart — desktop */}
            <div className="hidden lg:flex gap-3">
              <div className="flex items-center border border-[#1A1A2E]/20">
                <IconButton
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={isOutOfStock}
                  size="small"
                  sx={{ borderRadius: 0, width: 40, height: 48, color: "rgba(26,26,46,0.5)", "&:hover": { color: "#1A1A2E" }, "&:disabled": { opacity: 0.3 } }}
                >
                  <RemoveIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <span className="w-10 text-center text-[#1A1A2E] font-bold">{qty}</span>
                <IconButton
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={isOutOfStock}
                  size="small"
                  sx={{ borderRadius: 0, width: 40, height: 48, color: "rgba(26,26,46,0.5)", "&:hover": { color: "#1A1A2E" }, "&:disabled": { opacity: 0.3 } }}
                >
                  <AddIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </div>
              <AddToCartButton />
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#1A1A2E]/8">
              {[
                { Icon: LocalShippingIcon, label: "Free Shipping", sub: "5,000+ DZD" },
                { Icon: ReplayIcon, label: "Free Returns", sub: "30 days" },
                { Icon: SecurityIcon, label: "Secure Pay", sub: "Protected" },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon sx={{ fontSize: 15, color: "#C9A84C", display: "block", mx: "auto", mb: 0.5 }} />
                  <p className="text-[#1A1A2E] text-[10px] font-semibold leading-tight">{label}</p>
                  <p className="text-[#1A1A2E]/40 text-[9px]">{sub}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A2E]/40 mb-2">
                  Description
                </p>
                <p className="text-[#1A1A2E]/60 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* You May Also Like */}
            {related.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-[#1A1A2E]/8" />
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A2E]/40 flex-shrink-0">
                    You May Also Like
                  </p>
                  <div className="h-px flex-1 bg-[#1A1A2E]/8" />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                  {related.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onViewProduct?.(p)}
                      className="flex-shrink-0 w-32 text-left group"
                    >
                      <div className="relative w-32 h-40 bg-[#F0EBE3] overflow-hidden mb-2">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {p.isNew && (
                          <span className="absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.5 bg-[#1A1A2E] text-[#C9A84C]">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-[#C9A84C] text-[8px] font-bold tracking-widest uppercase truncate">
                        {p.category}
                      </p>
                      <p className="text-[#1A1A2E] text-xs font-semibold leading-snug truncate group-hover:text-[#C9A84C] transition-colors duration-200">
                        {p.name}
                      </p>
                      <p className="text-[#1A1A2E] text-xs font-bold mt-0.5">
                        {p.price.toLocaleString()}{" "}
                        <span className="text-[#1A1A2E]/40 font-normal text-[10px]">DZD</span>
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Mobile sticky footer ── */}
      <div className="lg:hidden flex-shrink-0 border-t border-[#1A1A2E]/10 bg-[#FAF7F2] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[#1A1A2E]/20 flex-shrink-0">
            <IconButton
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={isOutOfStock}
              size="small"
              sx={{ borderRadius: 0, width: 36, height: 44, color: "rgba(26,26,46,0.5)", "&:hover": { color: "#1A1A2E" }, "&:disabled": { opacity: 0.3 } }}
            >
              <RemoveIcon sx={{ fontSize: 13 }} />
            </IconButton>
            <span className="w-7 text-center text-[#1A1A2E] font-bold text-sm">{qty}</span>
            <IconButton
              onClick={() => setQty(Math.min(product.stock, qty + 1))}
              disabled={isOutOfStock}
              size="small"
              sx={{ borderRadius: 0, width: 36, height: 44, color: "rgba(26,26,46,0.5)", "&:hover": { color: "#1A1A2E" }, "&:disabled": { opacity: 0.3 } }}
            >
              <AddIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </div>
          <AddToCartButton compact />
        </div>
      </div>
    </Dialog>
  );
}
