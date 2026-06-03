import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import VerifiedIcon from "@mui/icons-material/Verified";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ChevronDown } from "lucide-react";
import Footer from "../components/Footer";
import ImageGallery from "../components/product/ImageGallery";
import ProductCard from "../components/ui/ProductCard";
import { productsService } from "../services/productsService";
import { sellerService } from "../services/sellerService";
import { storefrontService } from "../services/storefrontService";
import { apiProductToProduct } from "../lib/mappers";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import type { Product } from "../types";
import type { ApiProductShare, ApiSellerProfile } from "../types/api";

const COLOR_HEX: Record<string, string> = {
  black: "#1a1a1a", white: "#f9f9f9", beige: "#f5f0e1", gray: "#9ca3af",
  grey: "#9ca3af", brown: "#7c3f1a", navy: "#1e3a5f", red: "#dc2626",
  burgundy: "#7f1d1d", pink: "#f9a8d4", orange: "#f97316", yellow: "#fde047",
  green: "#16a34a", olive: "#6b7c2d", blue: "#2563eb", teal: "#0d9488",
  purple: "#7c3aed", gold: "#C9A84C", khaki: "#c3b091", ivory: "#fffff0",
  cream: "#fffdd0", rose: "#fb7185", lavender: "#c4b5fd", sage: "#84a98c",
  silver: "#c0c0c0",
};
function colorToHex(name: string) {
  return COLOR_HEX[name.toLowerCase().replace(/\s+/g, "")] ?? name;
}

function setOpenGraphTags(product: Product | null) {
  const baseUrl = window.location.origin;
  const productUrl = product ? `${baseUrl}/products/${product.id}` : baseUrl;
  const tags = [
    { property: "og:title", content: product?.name ?? "Foda" },
    { property: "og:description", content: product?.description?.slice(0, 157) ?? "Shop on Foda" },
    { property: "og:image", content: product?.images?.[0] ?? "" },
    { property: "og:url", content: productUrl },
    { property: "og:type", content: "product" },
    { property: "product:price:amount", content: product ? String(product.price) : "" },
    { property: "product:price:currency", content: "DZD" },
  ];
  tags.forEach(({ property, content }) => {
    if (!content) return;
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute("property", property); document.head.appendChild(meta); }
    meta.content = content;
  });
}


export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, openLogin } = useAuth();
  const isCustomer = user?.role === "customer";
  const { tr, isRTL } = useLang();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [shareData, setShareData] = useState<ApiProductShare | null>(null);
  const [cartAdded, setCartAdded] = useState(false);
  const [sellerProfile, setSellerProfile] = useState<ApiSellerProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const [sellerOpen, setSellerOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    setSellerProfile(null);
    setIsFollowing(false);
    setFollowersCount(0);
    let resolvedSellerId: string | undefined;
    productsService
      .getById(id)
      .then((ap) => {
        const mapped = apiProductToProduct(ap);
        setProduct(mapped);
        setSelectedSize(mapped.sizes[0] ?? null);
        setSelectedColor(mapped.colors[0] ?? null);
        setQuantity(1);
        resolvedSellerId = ap.sellerId;
        return productsService.getAll({ category: mapped.category });
      })
      .then((all) => {
        setRelated(all.map(apiProductToProduct).filter((p) => p.id !== id).slice(0, 4));
        if (resolvedSellerId) {
          storefrontService.getSellerProfile(resolvedSellerId).then((profile) => {
            setSellerProfile(profile);
            setIsFollowing(profile.isFollowing);
            setFollowersCount(profile.followers);
          }).catch(() => undefined);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Visit tracking
  useEffect(() => {
    if (!id) return;
    const allowed = ["instagram", "tiktok", "whatsapp", "facebook"];
    const raw = new URLSearchParams(location.search).get("src");
    const source = raw && allowed.includes(raw.toLowerCase()) ? raw.toLowerCase() : "direct";
    let visitorId = localStorage.getItem("foda_vid") || "";
    if (!visitorId) {
      visitorId = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("foda_vid", visitorId);
    }
    const deviceType = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? "mobile" : "desktop";
    sellerService.trackProductVisit(id, { source, visitorId, deviceType, referrer: document.referrer || undefined }).catch(() => undefined);
  }, [id, location.search]);

  useEffect(() => { setOpenGraphTags(product); }, [product]);

  const handleFollowToggle = async () => {
    if (!isCustomer) { openLogin(); return; }
    if (!sellerProfile || followLoading) return;
    setFollowLoading(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setFollowersCount((n) => wasFollowing ? Math.max(0, n - 1) : n + 1);
    try {
      const result = wasFollowing
        ? await storefrontService.unfollowSeller(sellerProfile.id)
        : await storefrontService.followSeller(sellerProfile.id);
      setFollowersCount(result.followers);
    } catch {
      setIsFollowing(wasFollowing);
      setFollowersCount((n) => wasFollowing ? n + 1 : Math.max(0, n - 1));
    } finally {
      setFollowLoading(false);
    }
  };

  const wishlisted = isCustomer && product ? isInWishlist(product.id) : false;
  const hasDiscount = product?.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product!.originalPrice! - product!.price) / product!.originalPrice!) * 100)
    : 0;

  const promo = product?.promotion?.active && (product.promotion.value ?? 0) > 0 ? product.promotion : null;
  const promoDiscountedPrice = promo
    ? promo.type === "percentage" ? product!.price * (1 - promo.value! / 100) : Math.max(0, product!.price - promo.value!)
    : null;
  const promoPercent = promo && promo.type === "percentage"
    ? promo.value!
    : promo && promo.type === "amount" && product ? Math.round((promo.value! / product.price) * 100) : 0;

  const isOutOfStock = product ? !product.inStock || product.totalStock <= 0 : false;

  const availableSizes = useMemo(() => {
    if (!product) return new Set<string>();
    return new Set(product.variants.filter((v) => v.stock > 0 && (!selectedColor || v.color === selectedColor)).map((v) => v.size));
  }, [product, selectedColor]);

  const availableColors = useMemo(() => {
    if (!product) return new Set<string>();
    return new Set(product.variants.filter((v) => v.stock > 0 && (!selectedSize || v.size === selectedSize)).map((v) => v.color));
  }, [product, selectedSize]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedSize || !selectedColor) return null;
    return product.variants.find((v) => v.size === selectedSize && v.color === selectedColor) ?? null;
  }, [product, selectedSize, selectedColor]);

  const variantStock = selectedVariant?.stock ?? 0;
  const canAdd = !isOutOfStock
    && (product?.sizes.length === 0 || !!selectedSize)
    && (product?.colors.length === 0 || !!selectedColor)
    && (!selectedVariant || variantStock > 0);

  const handleAddToCart = () => {
    if (!product || !canAdd || !selectedSize || !selectedColor) return;
    if (!user || user.role !== "customer") {
      openLogin({ customerOnly: true, redirectTo: `${location.pathname}${location.search}` });
      return;
    }
    addItem(product, selectedSize, selectedColor, Math.max(1, Math.min(quantity, variantStock)));
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 4000);
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (!isCustomer) { openLogin(); return; }
    if (wishlisted) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const copyShareLink = async (link?: string) => {
    const url = link || shareData?.productUrl || `${window.location.origin}/products/${product?.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      setShareError(isRTL ? "تعذر نسخ الرابط." : "Could not copy automatically.");
    }
  };

  const handleOpenShare = async () => {
    if (!product) return;
    setIsShareOpen(true);
    setShareLoading(true);
    setShareError("");
    setShareData(null);
    try {
      const response = await productsService.getShareLink(product.id);
      const incoming = response.share;
      let prodUrl = incoming.productUrl || `${window.location.origin}/products/${product.id}`;
      prodUrl = prodUrl.replace("/product/", "/products/");
      setShareData({ ...incoming, productUrl: prodUrl });
    } catch (err) {
      setShareError(err instanceof Error ? err.message : "Failed to load share links.");
    } finally {
      setShareLoading(false);
    }
  };

  const handlePlatformShare = async (platform: "whatsapp" | "facebook" | "telegram" | "instagram") => {
    if (!product) return;
    const url = shareData?.productUrl || `${window.location.origin}/products/${product.id}`;
    const title = product.name;
    const price = `${product.price.toLocaleString()} ${tr.common.dzd}`;
    const desc = product.description?.slice(0, 140) ?? "";
    const message = `${title} — ${price}${desc ? "\n\n" + desc : ""}\n\n${url}`;
    setIsShareOpen(false);
    if (navigator.share) {
      try { await navigator.share({ title, text: `${title} — ${price}`, url } as any); return; } catch {}
    }
    if (platform === "whatsapp") { window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); return; }
    if (platform === "telegram") { window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + " — " + price)}`, "_blank", "noopener,noreferrer"); return; }
    if (platform === "facebook") { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer"); return; }
    await copyShareLink(url);
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <>
        <div className="pt-8 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="flex gap-3">
              <div className="w-[72px] flex flex-col gap-2">
                {[0,1,2].map(i => <div key={i} className="w-full aspect-[3/4] bg-[#1A1A2E]/8 animate-pulse" />)}
              </div>
              <div className="flex-1 aspect-[3/4] max-h-[70vh] bg-[#1A1A2E]/8 animate-pulse" />
            </div>
            <div className="space-y-5 pt-2">
              <div className="h-3 w-32 bg-[#1A1A2E]/10 animate-pulse rounded" />
              <div className="h-9 w-3/4 bg-[#1A1A2E]/10 animate-pulse rounded" />
              <div className="h-4 w-24 bg-[#1A1A2E]/8 animate-pulse rounded" />
              <div className="h-10 w-1/3 bg-[#1A1A2E]/10 animate-pulse rounded" />
              <div className="h-px bg-[#1A1A2E]/6" />
              <div className="flex gap-2">
                {[0,1,2,3].map(i => <div key={i} className="w-12 h-10 bg-[#1A1A2E]/8 animate-pulse rounded" />)}
              </div>
              <div className="h-12 w-full bg-[#1A1A2E]/8 animate-pulse rounded" />
              <div className="flex gap-3">
                <div className="h-14 flex-1 bg-[#1A1A2E]/10 animate-pulse" />
                <div className="h-14 w-14 bg-[#1A1A2E]/8 animate-pulse" />
                <div className="h-14 w-14 bg-[#1A1A2E]/8 animate-pulse" />
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
        <div className="pt-6 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
          <p className="text-[#1A1A2E]/60 text-lg">{tr.shop.noResults}</p>
          <button onClick={() => navigate("/shop")} className="mt-4 btn-dark px-8 py-3 text-sm">
            {tr.nav.shop}
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const shopName = sellerProfile?.shopName ?? product.sellerName ?? "";
  const sellerInitial = shopName.charAt(0).toUpperCase() || "S";

  return (
    <>
      <div className="bg-[#FAF8F5] min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-20">

          {/* ── Seller breadcrumb ── */}
          {shopName && (
            <button
              onClick={() => navigate(`/storefront/${product.sellerId}`)}
              className="inline-flex items-center gap-2 mb-6 group"
            >
              <div className="flex items-center gap-2 bg-white border border-[#1A1A2E]/10 rounded-full px-3 py-1.5 shadow-sm group-hover:border-[#C9A84C]/40 transition-colors">
                {sellerProfile?.logoUrl ? (
                  <img src={sellerProfile.logoUrl} alt={shopName} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full gold-gradient flex items-center justify-center text-[#1A1A2E] text-[9px] font-black">
                    {sellerInitial}
                  </div>
                )}
                <span className="text-[12px] font-semibold text-[#1A1A2E] group-hover:text-[#C9A84C] transition-colors">
                  {shopName}
                </span>
                {sellerProfile?.verifiedBadge && (
                  <VerifiedIcon sx={{ fontSize: 13, color: "#C9A84C" }} />
                )}
              </div>
              <ChevronRightIcon sx={{ fontSize: 14, color: "rgba(26,26,46,0.3)" }} className={isRTL ? "rotate-180" : ""} />
              <span className="text-[12px] text-[#1A1A2E]/40 max-w-[200px] truncate">{product.name}</span>
            </button>
          )}

          {/* ── Main grid ── */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">

            {/* Gallery — sticky */}
            <div className="lg:sticky lg:top-6">
              <ImageGallery images={product.images} alt={product.name} isRTL={isRTL} />
            </div>

            {/* ── Product info ── */}
            <div className="flex flex-col gap-5">

              {/* Brand + Name */}
              {product.brand && (
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A2E]/40">
                  {product.brand}
                </p>
              )}
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-[#1A1A2E] leading-tight -mt-2">
                {product.name}
              </h1>

              {/* Rating link */}
              {product.rating != null && product.rating > 0 && (
                <button
                  onClick={() => navigate(`/products/${id}/reviews`)}
                  className="flex items-center gap-2 w-fit group"
                >
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        sx={{
                          fontSize: 14,
                          color: i < Math.round(product.rating!) ? "#C9A84C" : "#C9A84C33",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[13px] font-semibold text-[#1A1A2E]/60 group-hover:text-[#C9A84C] transition-colors">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-[13px] text-[#1A1A2E]/35 group-hover:text-[#C9A84C]/60 transition-colors">
                    · {isRTL ? "عرض التقييمات" : "See reviews"}
                  </span>
                </button>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                {promo && promoDiscountedPrice !== null ? (
                  <>
                    <span className="text-[2rem] font-extrabold text-[#C9A84C] tracking-tight leading-none">
                      {Math.round(promoDiscountedPrice).toLocaleString()}
                      <span className="text-base font-semibold text-[#C9A84C]/70 ml-1">{tr.common.dzd}</span>
                    </span>
                    <span className="text-base text-[#1A1A2E]/30 line-through">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-xs font-bold">
                      -{promoPercent}%
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[2rem] font-extrabold text-[#C9A84C] tracking-tight leading-none">
                      {product.price.toLocaleString()}
                      <span className="text-base font-semibold text-[#C9A84C]/70 ml-1">{tr.common.dzd}</span>
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-base text-[#1A1A2E]/30 line-through">
                          {product.originalPrice!.toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-xs font-bold">
                          -{discountPercent}%
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="h-px bg-[#1A1A2E]/8" />

              {/* Size */}
              {product.sizes.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-[#1A1A2E]/50 mb-2.5">
                    {tr.shop.size}
                    {selectedSize && <span className="text-[#1A1A2E] ms-1.5">{selectedSize}</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => {
                      const enabled = availableSizes.has(s);
                      return (
                        <button
                          key={s}
                          onClick={() => enabled && setSelectedSize(s)}
                          disabled={!enabled}
                          className={`min-w-[44px] px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-150 ${
                            selectedSize === s
                              ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/8"
                              : enabled
                                ? "border-[#1A1A2E]/12 text-[#1A1A2E]/60 hover:border-[#1A1A2E]/30 bg-white"
                                : "border-[#1A1A2E]/8 text-[#1A1A2E]/25 line-through cursor-not-allowed bg-white"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color */}
              {product.colors.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-[#1A1A2E]/50 mb-2.5">
                    {tr.shop.color}
                    {selectedColor && <span className="text-[#1A1A2E] ms-1.5 capitalize">{selectedColor}</span>}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => {
                      const enabled = availableColors.has(c);
                      return (
                        <button
                          key={c}
                          onClick={() => enabled && setSelectedColor(c)}
                          disabled={!enabled}
                          title={c}
                          className={`w-8 h-8 rounded-full transition-all duration-150 ${
                            selectedColor === c
                              ? "ring-2 ring-[#C9A84C] ring-offset-2"
                              : enabled
                                ? "ring-1 ring-inset ring-black/15 hover:ring-black/30"
                                : "ring-1 ring-inset ring-black/10 opacity-40 cursor-not-allowed"
                          }`}
                          style={{ backgroundColor: colorToHex(c) }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#1A1A2E]/50 mb-2.5">
                  {tr.productPage.quantity}
                  {selectedVariant && variantStock > 0 && variantStock <= 7 && (
                    <span className="ms-2 text-orange-500 normal-case tracking-normal font-medium">
                      · {isRTL ? `كمية محدودة · ${variantStock}` : `Limited · ${variantStock} left`}
                    </span>
                  )}
                </p>
                <div className="flex items-center bg-white border border-[#1A1A2E]/12 rounded-lg w-fit overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 text-xl font-light text-[#1A1A2E]/50 hover:text-[#C9A84C] transition-colors"
                  >
                    −
                  </button>
                  <span className="w-11 h-11 flex items-center justify-center text-sm font-bold text-[#1A1A2E] border-x border-[#1A1A2E]/10">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant ? variantStock : product.totalStock, quantity + 1))}
                    className="w-11 h-11 text-xl font-light text-[#1A1A2E]/50 hover:text-[#C9A84C] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Out of stock notice */}
              {isOutOfStock && (
                <p className="text-sm font-semibold text-red-500">{tr.shop.soldOut}</p>
              )}

              {/* ── Action buttons ── */}
              <div className="flex gap-3 mt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  className="flex-1 flex items-center justify-center gap-2 gold-gradient text-[#1A1A2E] h-14 text-sm font-bold tracking-wide rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBagIcon sx={{ fontSize: 18 }} />
                  {tr.productPage.addToCart}
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                    wishlisted
                      ? "border-red-300 bg-red-50"
                      : "border-[#1A1A2E]/12 bg-white hover:border-[#C9A84C]"
                  }`}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {wishlisted
                    ? <FavoriteIcon sx={{ fontSize: 20, color: "#ef4444" }} />
                    : <FavoriteBorderIcon sx={{ fontSize: 20, color: "rgba(26,26,46,0.5)" }} />
                  }
                </button>
                <button
                  onClick={handleOpenShare}
                  className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-[#1A1A2E]/12 bg-white hover:border-[#C9A84C] transition-all duration-200"
                  aria-label="Share"
                >
                  <ShareIcon sx={{ fontSize: 20, color: "rgba(26,26,46,0.5)" }} />
                </button>
              </div>

              <div className="h-px bg-[#1A1A2E]/8" />

              {/* ── Description accordion ── */}
              {product.description && (
                <div className="border border-[#1A1A2E]/8 rounded-2xl bg-white overflow-hidden">
                  <button
                    onClick={() => setDescOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-5 py-4"
                  >
                    <span className="text-[14px] font-bold text-[#1A1A2E]">
                      {tr.productPage.description}
                    </span>
                    <ChevronDown
                      size={15}
                      className={`text-[#1A1A2E]/40 transition-transform duration-200 ${descOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {descOpen && (
                    <div className="px-5 pb-5 border-t border-[#1A1A2E]/6 space-y-4">
                      <p className="pt-4 text-sm text-[#1A1A2E]/65 leading-relaxed">
                        {product.description}
                      </p>
                      {/* Meta rows */}
                      <div className="space-y-0 divide-y divide-[#1A1A2E]/6">
                        {product.brand && (
                          <div className="flex items-center justify-between py-2.5">
                            <span className="text-[13px] text-[#1A1A2E]/40">{isRTL ? "الماركة" : "Brand"}</span>
                            <span className="text-[13px] font-medium text-[#1A1A2E]/70">{product.brand}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between py-2.5">
                          <span className="text-[13px] text-[#1A1A2E]/40">{isRTL ? "الفئة" : "Category"}</span>
                          <span className="text-[13px] font-medium text-[#1A1A2E]/70">{product.category}</span>
                        </div>
                        {shopName && (
                          <div className="flex items-center justify-between py-2.5">
                            <span className="text-[13px] text-[#1A1A2E]/40">{isRTL ? "البائع" : "Seller"}</span>
                            <button
                              onClick={() => navigate(`/storefront/${product.sellerId}`)}
                              className="text-[13px] font-medium text-[#1A1A2E]/70 hover:text-[#C9A84C] transition-colors"
                            >
                              {shopName}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── About seller accordion ── */}
              {product.sellerId && shopName && (
                <div className="border border-[#1A1A2E]/8 rounded-2xl bg-white overflow-hidden">
                  <button
                    onClick={() => setSellerOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-5 py-4"
                  >
                    <span className="text-[14px] font-bold text-[#1A1A2E]">
                      {isRTL ? "عن البائع" : "About the Seller"}
                    </span>
                    <ChevronDown
                      size={15}
                      className={`text-[#1A1A2E]/40 transition-transform duration-200 ${sellerOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {sellerOpen && (
                    <div className="border-t border-[#1A1A2E]/6 px-5 py-4" dir="ltr">
                      <div className="flex items-center gap-4">
                        {/* Logo / initials */}
                        <button
                          onClick={() => navigate(`/storefront/${product.sellerId}`)}
                          className="shrink-0"
                        >
                          {sellerProfile?.logoUrl ? (
                            <img
                              src={sellerProfile.logoUrl}
                              alt={shopName}
                              className="w-14 h-14 rounded-2xl object-cover ring-1 ring-[#C9A84C]/30"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center text-[#1A1A2E] font-black text-lg select-none">
                              {sellerInitial}
                            </div>
                          )}
                        </button>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <button
                              onClick={() => navigate(`/storefront/${product.sellerId}`)}
                              className="text-[15px] font-bold text-[#1A1A2E] hover:text-[#C9A84C] transition-colors truncate"
                            >
                              {shopName}
                            </button>
                            {sellerProfile?.verifiedBadge && (
                              <VerifiedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
                            )}
                          </div>
                          {sellerProfile?.address?.wilaya && (
                            <p className="text-[12px] text-[#1A1A2E]/45 truncate">
                              {sellerProfile.address.wilaya}
                            </p>
                          )}
                          {product.rating != null && product.rating > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <StarIcon sx={{ fontSize: 12, color: "#C9A84C" }} />
                              <span className="text-[12px] font-semibold text-[#1A1A2E]/60">
                                {product.rating.toFixed(1)}
                              </span>
                              {sellerProfile?.address?.wilaya && (
                                <span className="text-[12px] text-[#1A1A2E]/30">
                                  · {sellerProfile.address.wilaya}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Visit store */}
                        <button
                          onClick={() => navigate(`/storefront/${product.sellerId}`)}
                          className="shrink-0 flex items-center gap-1.5 text-[12px] font-semibold text-[#1A1A2E]/60 border border-[#1A1A2E]/15 rounded-lg px-3 py-2 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all"
                        >
                          <StorefrontOutlinedIcon sx={{ fontSize: 14 }} />
                          {isRTL ? "زيارة المتجر" : "Visit store"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews link */}
              <button
                onClick={() => navigate(`/products/${id}/reviews`)}
                className="flex items-center justify-between w-full bg-white border border-[#1A1A2E]/8 rounded-2xl px-5 py-4 hover:border-[#C9A84C]/30 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <StarIcon sx={{ fontSize: 16, color: "#C9A84C" }} />
                  <span className="text-[14px] font-bold text-[#1A1A2E]">
                    {isRTL ? "تقييمات العملاء" : "Customer Reviews"}
                    {product.rating != null && product.rating > 0 && (
                      <span className="text-[#1A1A2E]/40 font-normal ms-1.5">
                        {product.rating.toFixed(1)} / 5
                      </span>
                    )}
                  </span>
                </div>
                <ChevronRightIcon
                  sx={{ fontSize: 18, color: "rgba(26,26,46,0.3)" }}
                  className={`group-hover:text-[#C9A84C] transition-colors ${isRTL ? "rotate-180" : ""}`}
                />
              </button>

            </div>
          </div>

          {/* ── Related Products ── */}
          {related.length > 0 && (
            <section className="mt-16">
              <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent mb-10" />
              <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-8">
                {isRTL ? "المزيد من هذا البائع" : "More from this seller"}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={i * 100} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ── Cart added toast ── */}
      {cartAdded && (
        <div
          className={`fixed top-6 ${isRTL ? "left-6" : "right-6"} z-[200] flex items-center gap-3 px-5 py-4 bg-[#1A1A2E] text-white shadow-2xl max-w-xs`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="shrink-0 w-8 h-8 gold-gradient flex items-center justify-center">
            <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: "#1A1A2E" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#C9A84C]">
              {isRTL ? "تمت الإضافة" : "Added to cart"}
            </p>
            <p className="text-xs text-white/70 mt-0.5 truncate">{product?.name}</p>
          </div>
        </div>
      )}

      {/* ── Share modal ── */}
      {isShareOpen && (
        <div className="fixed inset-0 z-[120] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#C9A84C]/15 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A2E]/8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#C9A84C] font-bold">
                  {isRTL ? "مشاركة المنتج" : "Share Product"}
                </p>
                <h3 className="font-display text-lg text-[#1A1A2E] font-bold truncate max-w-[280px]">
                  {product.name}
                </h3>
              </div>
              <button
                onClick={() => setIsShareOpen(false)}
                className="w-9 h-9 rounded-full border border-[#1A1A2E]/15 flex items-center justify-center text-[#1A1A2E]/50 hover:text-[#1A1A2E] transition-colors"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {shareLoading ? (
                <p className="text-sm text-[#1A1A2E]/60">{isRTL ? "جارٍ تجهيز الروابط..." : "Preparing links..."}</p>
              ) : shareData ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "WhatsApp", Icon: WhatsAppIcon, key: "whatsapp", color: "#25D366" },
                      { label: "Facebook", Icon: FacebookIcon, key: "facebook", color: "#1877F2" },
                      { label: "Telegram", Icon: TelegramIcon, key: "telegram", color: "#229ED9" },
                      { label: "Instagram", Icon: InstagramIcon, key: "instagram", color: "#E4405F" },
                    ].map(({ label, Icon, key, color }) => (
                      <button
                        key={label}
                        onClick={() => handlePlatformShare(key as any)}
                        className="flex items-center gap-2.5 p-3 rounded-xl border border-[#1A1A2E]/10 hover:border-[#C9A84C]/40 transition-all"
                      >
                        <Icon sx={{ fontSize: 19, color }} />
                        <span className="text-sm font-semibold text-[#1A1A2E]">{label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-widest text-[#1A1A2E]/40 font-semibold">
                      {isRTL ? "رابط المنتج" : "Product Link"}
                    </p>
                    <div className="flex items-stretch gap-2">
                      <input
                        value={shareData.productUrl}
                        readOnly
                        className="flex-1 border border-[#1A1A2E]/12 rounded-lg px-3 py-2 text-xs text-[#1A1A2E]/70 bg-[#FAF7F2]"
                      />
                      <button
                        onClick={() => copyShareLink(shareData.productUrl)}
                        className="px-3 rounded-lg border border-[#C9A84C]/40 text-[#1A1A2E] hover:bg-[#C9A84C]/10 transition-colors"
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                    {shareCopied && (
                      <p className="text-xs text-emerald-600 font-medium">
                        {isRTL ? "تم نسخ الرابط ✅" : "Link copied ✅"}
                      </p>
                    )}
                  </div>
                </>
              ) : null}
              {shareError && <p className="text-xs text-red-500">{shareError}</p>}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
