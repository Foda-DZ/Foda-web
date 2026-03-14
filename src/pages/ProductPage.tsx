import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import LoopIcon from "@mui/icons-material/Loop";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import Footer from "../components/Footer";
import ImageGallery from "../components/product/ImageGallery";
import ProductCard from "../components/ui/ProductCard";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
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
  const key = name.toLowerCase().replace(/\s+/g, "");
  return COLOR_HEX[key] ?? key;
}

function RatingStars({ rating }: { rating: number }) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  for (let i = 0; i < full; i++)
    stars.push(
      <StarIcon key={`f${i}`} sx={{ fontSize: 18, color: "#C9A84C" }} />,
    );
  if (half)
    stars.push(
      <StarHalfIcon key="h" sx={{ fontSize: 18, color: "#C9A84C" }} />,
    );
  const empty = 5 - stars.length;
  for (let i = 0; i < empty; i++)
    stars.push(
      <StarOutlineIcon
        key={`e${i}`}
        sx={{ fontSize: 18, color: "#C9A84C33" }}
      />,
    );
  return <div className="flex items-center gap-px">{stars}</div>;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, openLogin } = useAuth();
  const isCustomer = user?.role === "customer";
  const { tr } = useLang();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    productsService
      .getById(id)
      .then((ap) => {
        const mapped = apiProductToProduct(ap);
        setProduct(mapped);
        setSelectedSize(mapped.sizes[0] ?? null);
        setSelectedColor(mapped.colors[0] ?? null);
        setQuantity(1);
        // fetch related
        return productsService.getAll({ category: mapped.category });
      })
      .then((all) => {
        setRelated(
          all
            .map(apiProductToProduct)
            .filter((p) => p.id !== id)
            .slice(0, 4),
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const wishlisted = isCustomer && product ? isInWishlist(product.id) : false;
  const hasDiscount =
    product?.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product!.originalPrice! - product!.price) / product!.originalPrice!) *
          100,
      )
    : 0;
  const isOutOfStock = product ? product.stock === 0 : false;
  const canAdd = !isOutOfStock && selectedSize && selectedColor;

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (!isCustomer) {
      openLogin();
      return;
    }
    if (wishlisted) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <>
        <div className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-[#F0EBE3] aspect-[3/4] max-h-[70vh] animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 w-20 bg-[#1A1A2E]/10 animate-pulse" />
              <div className="h-8 w-3/4 bg-[#1A1A2E]/10 animate-pulse" />
              <div className="h-6 w-1/3 bg-[#1A1A2E]/10 animate-pulse" />
              <div className="h-20 w-full bg-[#1A1A2E]/10 animate-pulse mt-6" />
              <div className="flex gap-3 mt-6">
                <div className="h-12 flex-1 bg-[#1A1A2E]/10 animate-pulse" />
                <div className="h-12 flex-1 bg-[#1A1A2E]/10 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <div className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
          <p className="text-[#1A1A2E]/60 text-lg">{tr.shop.noResults}</p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 btn-dark px-8 py-3 text-sm"
          >
            {tr.nav.shop}
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-[#1A1A2E]/40 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button
            onClick={() => navigate("/")}
            className="hover:text-[#C9A84C] transition-colors"
          >
            {tr.nav.shopNow.split(" ")[0]}
          </button>
          <span>/</span>
          <button
            onClick={() => navigate(`/shop?category=${product.category}`)}
            className="hover:text-[#C9A84C] transition-colors"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-[#1A1A2E]/70 truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image gallery */}
          <div className="lg:sticky lg:top-28">
            <ImageGallery images={product.images} alt={product.name} />
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col gap-5">
            {/* Category + seller */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#C9A84C]">
                {product.category}
              </span>
              {product.sellerName && (
                <span className="text-xs text-[#1A1A2E]/40">
                  {tr.productPage.by} {product.sellerName}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-[#1A1A2E] leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating != null && product.rating > 0 && (
              <div className="flex items-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="text-sm font-medium text-[#1A1A2E]/50">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#1A1A2E]">
                {product.price.toLocaleString()}{" "}
                <span className="text-sm font-normal text-[#1A1A2E]/45">
                  {tr.common.dzd}
                </span>
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-[#1A1A2E]/30 line-through">
                    {product.originalPrice!.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-red-500">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock indicator */}
            {isOutOfStock ? (
              <span className="text-sm font-semibold text-red-500">
                {tr.shop.soldOut}
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-sm font-medium text-orange-500">
                {product.stock} {tr.shop.left}
              </span>
            ) : null}

            {/* Divider */}
            <div className="h-px bg-[#1A1A2E]/8" />

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-[#1A1A2E]/60 mb-3">
                  {tr.shop.size}:{" "}
                  <span className="text-[#1A1A2E]">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-sm font-semibold border-2 transition-all duration-200 ${
                        selectedSize === s
                          ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5"
                          : "border-[#1A1A2E]/12 text-[#1A1A2E]/60 hover:border-[#1A1A2E]/30"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-[#1A1A2E]/60 mb-3">
                  {tr.shop.color}:{" "}
                  <span className="text-[#1A1A2E]">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      className={`w-8 h-8 rounded-full flex-shrink-0 transition-all duration-200 ${
                        selectedColor === c
                          ? "ring-2 ring-[#C9A84C] ring-offset-2"
                          : "ring-1 ring-inset ring-black/15 hover:ring-black/30"
                      }`}
                      style={{ backgroundColor: colorToHex(c) }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#1A1A2E]/60 mb-3">
                {tr.productPage.quantity}
              </p>
              <div className="flex items-center border border-[#1A1A2E]/12 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 text-lg font-medium text-[#1A1A2E]/60 hover:text-[#C9A84C] transition-colors"
                >
                  -
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-bold text-[#1A1A2E] border-x border-[#1A1A2E]/12">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="w-10 h-10 text-lg font-medium text-[#1A1A2E]/60 hover:text-[#C9A84C] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <div className="flex gap-3 flex-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  className="flex-1 flex items-center justify-center gap-2 btn-dark py-3.5 text-sm font-semibold tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBagIcon sx={{ fontSize: 18 }} />
                  {tr.productPage.addToCart}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!canAdd}
                  className="flex-1 flex items-center justify-center gap-2 gold-gradient text-[#1A1A2E] py-3.5 text-sm font-bold tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FlashOnIcon sx={{ fontSize: 18 }} />
                  {tr.productPage.buyNow}
                </button>
              </div>
              <button
                onClick={toggleWishlist}
                className="w-full sm:w-13 h-13 flex items-center justify-center border-2 border-[#1A1A2E]/12 hover:border-[#C9A84C] transition-colors"
              >
                {wishlisted ? (
                  <FavoriteIcon sx={{ fontSize: 20, color: "#ef4444" }} />
                ) : (
                  <FavoriteBorderIcon
                    sx={{ fontSize: 20, color: "#1A1A2E80" }}
                  />
                )}
              </button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { Icon: LocalShippingIcon, label: tr.productPage.freeDelivery },
                { Icon: VerifiedIcon, label: tr.productPage.verifiedSeller },
                { Icon: LoopIcon, label: tr.productPage.easyReturns },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 py-3 bg-[#FAF7F2] border border-[#C9A84C]/10"
                >
                  <Icon sx={{ fontSize: 18, color: "#C9A84C" }} />
                  <span className="text-[10px] font-medium text-[#1A1A2E]/60 text-center leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-4">
                <h3 className="text-xs font-bold tracking-widest uppercase text-[#1A1A2E]/60 mb-3">
                  {tr.productPage.description}
                </h3>
                <p className="text-sm text-[#1A1A2E]/70 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-8">
              {tr.productPage.youMayAlsoLike}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  delay={i * 100}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </>
  );
}
