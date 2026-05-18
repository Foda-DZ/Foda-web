import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import LoopIcon from "@mui/icons-material/Loop";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import Footer from "../components/Footer";
import ImageGallery from "../components/product/ImageGallery";
import ProductCard from "../components/ui/ProductCard";
import { productsService } from "../services/productsService";
import { sellerService } from "../services/sellerService";
import { apiProductToProduct } from "../lib/mappers";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import type { Product } from "../types";
import type { ApiProductReview, ApiProductShare } from "../types/api";

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

// ── Set Open Graph meta tags for rich share preview ──
function setOpenGraphTags(product: Product | null) {
  const baseUrl = window.location.origin;
  const productUrl = product ? `${baseUrl}/products/${product.id}` : baseUrl;

  const tags = [
    { property: "og:title", content: product?.name ?? "Foda" },
    {
      property: "og:description",
      content:
        product?.description && product.description.length > 160
          ? product.description.slice(0, 157) + "..."
          : (product?.description ?? "Shop modern fashion on Foda"),
    },
    { property: "og:image", content: product?.images?.[0] ?? "" },
    { property: "og:url", content: productUrl },
    { property: "og:type", content: "product" },
    {
      property: "product:price:amount",
      content: product ? String(product.price) : "",
    },
    { property: "product:price:currency", content: "DZD" },
  ];

  tags.forEach(({ property, content }) => {
    if (!content) return;
    let meta = document.querySelector(
      `meta[property="${property}"]`,
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  });

  // Also set Twitter card for better compatibility
  const twitterTags = [
    { name: "twitter:card", content: "product" },
    { name: "twitter:title", content: product?.name ?? "Foda" },
    {
      name: "twitter:description",
      content:
        product?.description && product.description.length > 160
          ? product.description.slice(0, 157) + "..."
          : (product?.description ?? "Shop modern fashion on Foda"),
    },
    { name: "twitter:image", content: product?.images?.[0] ?? "" },
  ];

  twitterTags.forEach(({ name, content }) => {
    if (!content) return;
    let meta = document.querySelector(
      `meta[name="${name}"]`,
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  });
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
  const location = useLocation();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, openLogin } = useAuth();
  const isCustomer = user?.role === "customer";
  const { tr, isRTL } = useLang();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ApiProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [shareData, setShareData] = useState<ApiProductShare | null>(null);
  const [cartAdded, setCartAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    setReviews([]);
    setReviewsError("");
    setReviewsLoading(true);
    productsService
      .getById(id)
      .then((ap) => {
        const mapped = apiProductToProduct(ap);
        setProduct(mapped);
        setSelectedSize(mapped.sizes[0] ?? null);
        setSelectedColor(mapped.colors[0] ?? null);
        setQuantity(1);
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

  // Update Open Graph meta tags when product loads for rich share preview
  useEffect(() => {
    setOpenGraphTags(product);
  }, [product]);

  // Record an anonymous visit (tracked-link beacon) — fire once per product view
  useEffect(() => {
    if (!id) return;
    const allowed = ["instagram", "tiktok", "whatsapp", "facebook"];
    const raw = new URLSearchParams(location.search).get("src");
    const source = raw && allowed.includes(raw.toLowerCase()) ? raw.toLowerCase() : "direct";
    let visitorId: string;
    try {
      visitorId = localStorage.getItem("foda_vid") || "";
      if (!visitorId) {
        visitorId =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem("foda_vid", visitorId);
      }
    } catch {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }
    const deviceType = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? "mobile" : "desktop";
    sellerService
      .trackProductVisit(id, { source, visitorId, deviceType, referrer: document.referrer || undefined })
      .catch(() => undefined);
  }, [id, location.search]);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setReviewsLoading(true);
    setReviewsError("");

    productsService
      .getProductReviews(id)
      .then((data) => {
        if (!active) return;
        setReviews(data.reviews);
      })
      .catch((err) => {
        if (!active) return;
        setReviewsError(
          err instanceof Error ? err.message : "Failed to load reviews.",
        );
      })
      .finally(() => {
        if (active) setReviewsLoading(false);
      });

    return () => {
      active = false;
    };
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

  // Active promotion from seller
  const promo = product?.promotion?.active && (product.promotion.value ?? 0) > 0
    ? product.promotion
    : null;
  const promoDiscountedPrice = promo
    ? promo.type === "percentage"
      ? product!.price * (1 - promo.value! / 100)
      : Math.max(0, product!.price - promo.value!)
    : null;
  const promoPercent = promo && promo.type === "percentage"
    ? promo.value!
    : promo && promo.type === "amount" && product
      ? Math.round((promo.value! / product.price) * 100)
      : 0;

  const isOutOfStock = product ? !product.inStock || product.totalStock <= 0 : false;
  const hasSizes = product ? product.sizes.length > 0 : false;
  const hasColors = product ? product.colors.length > 0 : false;

  // Variant-aware availability. A size is available when at least one variant
  // for that size has stock > 0 (and matches the currently selected color, if any).
  // Same logic for colors. Once both are picked, `selectedVariant.stock` is the cap.
  const availableSizes = useMemo(() => {
    if (!product) return new Set<string>();
    return new Set(
      product.variants
        .filter((v) => v.stock > 0 && (!selectedColor || v.color === selectedColor))
        .map((v) => v.size),
    );
  }, [product, selectedColor]);

  const availableColors = useMemo(() => {
    if (!product) return new Set<string>();
    return new Set(
      product.variants
        .filter((v) => v.stock > 0 && (!selectedSize || v.size === selectedSize))
        .map((v) => v.color),
    );
  }, [product, selectedSize]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedSize || !selectedColor) return null;
    return (
      product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor,
      ) ?? null
    );
  }, [product, selectedSize, selectedColor]);

  const variantStock = selectedVariant?.stock ?? 0;
  const canAdd =
    !isOutOfStock &&
    (!hasSizes || !!selectedSize) &&
    (!hasColors || !!selectedColor) &&
    (!selectedVariant || variantStock > 0);

  const reviewStats = useMemo(() => {
    const total = reviews.length;
    const average = total
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
      : 0;
    const breakdown = [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((review) => review.rating === rating).length;
      return { rating, count, percent: total ? (count / total) * 100 : 0 };
    });
    return { total, average, breakdown };
  }, [reviews]);

  const reviewCopy = {
    title: tr.dir === "rtl" ? "آراء العملاء" : "Customer Reviews",
    summary:
      tr.dir === "rtl"
        ? "تقييمات حقيقية من العملاء الذين اشتروا هذا المنتج."
        : "Real feedback from customers who bought this product.",
    emptyTitle: tr.dir === "rtl" ? "لا توجد مراجعات بعد" : "No reviews yet",
    emptySub:
      tr.dir === "rtl"
        ? "كن أول من يشارك رأيه حول هذا المنتج."
        : "Be the first to share feedback about this product.",
    loadText:
      tr.dir === "rtl" ? "جارٍ تحميل التقييمات..." : "Loading reviews...",
    errorText:
      tr.dir === "rtl"
        ? "تعذر تحميل المراجعات حالياً."
        : "We couldn’t load reviews right now.",
    starsLabel: tr.dir === "rtl" ? "من 5" : "out of 5",
    latestLabel: tr.dir === "rtl" ? "أحدث المراجعات" : "Latest reviews",
  };

  const formatReviewDate = (date: string) =>
    new Intl.DateTimeFormat(tr.dir === "rtl" ? "ar-DZ" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  const handleAddToCart = () => {
    if (!product || !canAdd || !selectedSize || !selectedColor) return;
    if (!user || user.role !== "customer") {
      openLogin({
        customerOnly: true,
        redirectTo: `${location.pathname}${location.search}`,
      });
      return;
    }
    const qty = Math.max(1, Math.min(quantity, variantStock));
    addItem(product, selectedSize, selectedColor, qty);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 4000);
  };

  const handleBuyNow = () => {
    if (!product || !canAdd || !selectedSize || !selectedColor) return;
    if (!user || user.role !== "customer") {
      openLogin({
        customerOnly: true,
        redirectTo: `${location.pathname}${location.search}`,
      });
      return;
    }
    const qty = Math.max(1, Math.min(quantity, variantStock));
    addItem(product, selectedSize, selectedColor, qty);
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

  const copyShareLink = async (link?: string) => {
    const url =
      link ||
      shareData?.productUrl ||
      `${window.location.origin}/products/${product?.id}`;
    const title = product?.name ?? "";
    const price = product
      ? `${product.price.toLocaleString()} ${tr.common.dzd}`
      : "";
    const image = product?.images?.[0] ?? "";

    // Compose a professional share message
    const messageLines = [title, price];
    if (product?.description) {
      const desc =
        product.description.length > 140
          ? product.description.slice(0, 137) + "..."
          : product.description;
      messageLines.push(desc);
    }
    if (image) messageLines.push(image);
    messageLines.push(url);

    const textToCopy = messageLines.join("\n\n");

    try {
      await navigator.clipboard.writeText(textToCopy);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      setShareError(
        tr.dir === "rtl"
          ? "تعذر نسخ الرابط، انسخه يدوياً."
          : "Could not copy automatically, please copy it manually.",
      );
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
      // Ensure product URL uses /products/ (not /product/)
      const incoming = response.share;
      let prodUrl =
        incoming.productUrl ||
        `${window.location.origin}/products/${product.id}`;
      prodUrl = prodUrl.replace("/product/", "/products/");
      setShareData({ ...incoming, productUrl: prodUrl });
    } catch (err) {
      setShareError(
        err instanceof Error ? err.message : "Failed to load share links.",
      );
    } finally {
      setShareLoading(false);
    }
  };

  const handlePlatformShare = async (
    platform: "whatsapp" | "facebook" | "telegram" | "instagram",
  ) => {
    if (!product) return;
    const url =
      shareData?.productUrl ||
      `${window.location.origin}/products/${product.id}`;
    const title = product.name;
    const price = `${product.price.toLocaleString()} ${tr.common.dzd}`;
    const desc = product.description
      ? product.description.length > 140
        ? product.description.slice(0, 137) + "..."
        : product.description
      : "";
    const image = product.images?.[0] ?? "";

    const message = `${title} — ${price}${desc ? "\n\n" + desc : ""}\n\n${url}`;

    // Close share modal
    setIsShareOpen(false);

    // Prefer Web Share API when available (native sharing)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} — ${price}${desc ? "\n\n" + desc : ""}`,
          url,
        } as any);
        return;
      } catch (e) {
        // fall through to platform-specific fallback
      }
    }

    // Platform-specific web fallbacks
    if (platform === "whatsapp") {
      const href = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (platform === "telegram") {
      const href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + " — " + price + (desc ? "\n\n" + desc : ""))}`;
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (platform === "facebook") {
      const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    // Instagram has no simple share URL for links; fallback to copying a rich message
    await copyShareLink(url);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!user) {
      openLogin();
      return;
    }
    if (reviewRating < 1) {
      setReviewError("Please select a rating.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Please enter a comment.");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");
    try {
      await productsService.reviewProduct(product.id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess("Your review has been submitted successfully!");
      setReviewRating(0);
      setReviewComment("");
      const refreshed = await productsService.getProductReviews(product.id);
      setReviews(refreshed.reviews);
    } catch (err: any) {
      setReviewError(
        err?.response?.data?.message || "Failed to submit review.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <>
        <div className="pt-6 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
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
        <div className="pt-6 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
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
      <div className="pt-6 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-[#1A1A2E]/40 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
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
          <div className="lg:sticky lg:top-4">
            <ImageGallery images={product.images} alt={product.name} />
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col gap-5">
            {/* Category + seller */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 bg-[#C9A84C]/10 text-[10px] font-bold tracking-[0.14em] uppercase text-[#C9A84C]">
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

            {/* Promotion banner */}
            {promo && (
              <div className="relative overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-r from-[#C9A84C]/8 via-[#C9A84C]/5 to-transparent px-4 py-3 flex items-center gap-3">
                <div className="shrink-0 w-8 h-8 gold-gradient flex items-center justify-center">
                  <LocalOfferIcon sx={{ fontSize: 15, color: "#1A1A2E" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C9A84C]">
                    {isRTL ? "عرض خاص" : "Special Offer"}
                  </p>
                  <p className="text-xs font-semibold text-[#1A1A2E] mt-0.5">
                    {promo.type === "percentage"
                      ? isRTL
                        ? `خصم ${promo.value}% على هذا المنتج`
                        : `${promo.value}% off this product`
                      : isRTL
                        ? `خصم ${promo.value} ${tr.common.dzd} على السعر`
                        : `Save ${promo.value} ${tr.common.dzd} on this item`}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  <p className="text-[10px] text-[#1A1A2E]/40 uppercase tracking-wide font-semibold">
                    {isRTL ? "توفير" : "Save"}
                  </p>
                  <p className="text-sm font-bold text-[#C9A84C]">
                    -{promoPercent}%
                  </p>
                </div>
                {/* Decorative stripe */}
                <div className="absolute inset-y-0 right-0 w-1 gold-gradient opacity-60" />
              </div>
            )}

            {/* Price + Stock panel */}
            <div className="bg-[#FAF7F2] border border-[#C9A84C]/10 px-5 py-4 space-y-2">
              {promo && promoDiscountedPrice !== null ? (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-[#1A1A2E]">
                      {Math.round(promoDiscountedPrice).toLocaleString()}{" "}
                      <span className="text-sm font-normal text-[#1A1A2E]/45">
                        {tr.common.dzd}
                      </span>
                    </span>
                    <span className="text-base text-[#1A1A2E]/35 line-through">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 gold-gradient text-[10px] font-bold text-[#1A1A2E] uppercase tracking-wide">
                      -{promoPercent}%
                    </span>
                  </div>
                </div>
              ) : (
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
              )}

              {/* Stock indicator — once a variant is picked, show its exact stock.
                  Before that, fall back to the product total. */}
              {isOutOfStock ? (
                <span className="text-sm font-semibold text-red-500">
                  {tr.shop.soldOut}
                </span>
              ) : selectedVariant ? (
                variantStock === 0 ? (
                  <span className="text-sm font-semibold text-red-500">
                    {tr.shop.soldOut}
                  </span>
                ) : variantStock <= 5 ? (
                  <span className="text-sm font-medium text-orange-500">
                    {variantStock} {tr.shop.left}
                  </span>
                ) : null
              ) : product.totalStock <= 5 ? (
                <span className="text-sm font-medium text-orange-500">
                  {product.totalStock} {tr.shop.left}
                </span>
              ) : null}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-[#1A1A2E]/60 mb-3">
                  {tr.shop.size}:{" "}
                  <span className="text-[#1A1A2E]">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const enabled = availableSizes.has(s);
                    return (
                      <button
                        key={s}
                        onClick={() => enabled && setSelectedSize(s)}
                        disabled={!enabled}
                        className={`px-4 py-2 text-sm font-semibold border-2 transition-all duration-200 ${
                          selectedSize === s
                            ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5"
                            : enabled
                              ? "border-[#1A1A2E]/12 text-[#1A1A2E]/60 hover:border-[#1A1A2E]/30"
                              : "border-[#1A1A2E]/8 text-[#1A1A2E]/25 line-through cursor-not-allowed"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
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
                  {product.colors.map((c) => {
                    const enabled = availableColors.has(c);
                    return (
                      <div key={c} className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => enabled && setSelectedColor(c)}
                          disabled={!enabled}
                          title={enabled ? c : `${c} — ${tr.shop.soldOut}`}
                          className={`w-8 h-8 rounded-full flex-shrink-0 transition-all duration-200 ${
                            selectedColor === c
                              ? "ring-2 ring-[#C9A84C] ring-offset-2"
                              : enabled
                                ? "ring-1 ring-inset ring-black/15 hover:ring-black/30"
                                : "ring-1 ring-inset ring-black/10 opacity-40 cursor-not-allowed"
                          }`}
                          style={{ backgroundColor: colorToHex(c) }}
                        />
                        <span
                          className={`text-[9px] capitalize ${
                            enabled ? "text-[#1A1A2E]/40" : "text-[#1A1A2E]/25 line-through"
                          }`}
                        >
                          {c}
                        </span>
                      </div>
                    );
                  })}
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
                    setQuantity(
                      Math.min(
                        selectedVariant ? variantStock : product.totalStock,
                        quantity + 1,
                      ),
                    )
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
                  className="flex-1 flex items-center justify-center gap-2 btn-dark h-13 text-sm font-semibold tracking-wider hover:scale-[1.01] transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ShoppingBagIcon sx={{ fontSize: 18 }} />
                  {tr.productPage.addToCart}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!canAdd}
                  className="flex-1 flex items-center justify-center gap-2 gold-gradient text-[#1A1A2E] h-13 text-sm font-bold tracking-wider hover:opacity-90 hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <FlashOnIcon sx={{ fontSize: 18 }} />
                  {tr.productPage.buyNow}
                </button>
              </div>
              <button
                onClick={toggleWishlist}
                className="w-full sm:w-13 h-13 flex items-center justify-center border-2 border-[#1A1A2E]/12 hover:border-[#C9A84C] hover:scale-[1.04] transition-all"
              >
                {wishlisted ? (
                  <FavoriteIcon sx={{ fontSize: 20, color: "#ef4444" }} />
                ) : (
                  <FavoriteBorderIcon
                    sx={{ fontSize: 20, color: "#1A1A2E80" }}
                  />
                )}
              </button>
              <button
                onClick={handleOpenShare}
                className="w-full sm:w-13 h-13 flex items-center justify-center border-2 border-[#1A1A2E]/12 hover:border-[#C9A84C] hover:text-[#C9A84C] hover:scale-[1.04] transition-all"
                aria-label="Share product"
              >
                <ShareIcon sx={{ fontSize: 20, color: "#1A1A2E80" }} />
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
                  className="flex flex-col items-center gap-1.5 py-3 bg-[#FAF7F2] border border-[#C9A84C]/10 border-l-2 border-l-[#C9A84C]/30"
                >
                  <Icon sx={{ fontSize: 20, color: "#C9A84C" }} />
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

        {/* ── Customer Reviews ── */}
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-2">
                {reviewCopy.title}
              </h2>
              <p className="text-sm text-[#1A1A2E]/55 max-w-2xl">
                {reviewCopy.summary}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-[#1A1A2E]/45">
              <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              {reviewCopy.latestLabel}
            </div>
          </div>

          <div className="grid lg:grid-cols-[340px_1fr] gap-5 lg:gap-6">
            <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-5 lg:sticky lg:top-24 h-fit">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <StarIcon sx={{ fontSize: 20, color: "#C9A84C" }} />
                    <span className="font-display text-3xl font-bold text-[#1A1A2E]">
                      {reviewStats.average
                        ? reviewStats.average.toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-[#1A1A2E]/45 uppercase tracking-widest font-semibold">
                      {reviewStats.total}{" "}
                      {reviewStats.total === 1
                        ? tr.dir === "rtl"
                          ? "تقييم"
                          : "review"
                        : tr.dir === "rtl"
                          ? "تقييمات"
                          : "reviews"}
                    </p>
                    <p className="text-xs text-[#1A1A2E]/45">
                      {reviewCopy.starsLabel}
                    </p>
                  </div>
                </div>
                <RatingStars rating={reviewStats.average} />
              </div>

              <div className="space-y-2">
                {reviewStats.breakdown.map(({ rating, count, percent }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#1A1A2E]/60 w-5">
                      {rating}
                    </span>
                    <div className="flex-1 h-2 bg-[#1A1A2E]/8 overflow-hidden">
                      <div
                        className="h-full bg-[#C9A84C]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#1A1A2E]/45 w-6 text-end">
                      {count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1A1A2E]/8 pt-4 text-sm text-[#1A1A2E]/60 leading-relaxed">
                {reviewStats.total > 0
                  ? reviewCopy.summary
                  : reviewCopy.emptySub}
              </div>
            </div>

            <div className="bg-white border border-[#1A1A2E]/8">
              <div className="px-5 py-4 border-b border-[#1A1A2E]/8 flex items-center justify-between">
                <h3 className="font-semibold text-[#1A1A2E]">
                  {tr.dir === "rtl" ? "أحدث الآراء" : "Recent feedback"}
                </h3>
                <span className="text-xs text-[#1A1A2E]/45">
                  {reviewStats.total}
                </span>
              </div>

              <div className="p-5">
                {reviewsLoading ? (
                  <div className="space-y-3">
                    {[0, 1, 2].map((s) => (
                      <div
                        key={s}
                        className="animate-pulse border border-[#1A1A2E]/8 p-4 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1A1A2E]/10" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-32 bg-[#1A1A2E]/10" />
                            <div className="h-3 w-20 bg-[#1A1A2E]/10" />
                          </div>
                        </div>
                        <div className="h-3 w-full bg-[#1A1A2E]/10" />
                        <div className="h-3 w-5/6 bg-[#1A1A2E]/10" />
                      </div>
                    ))}
                  </div>
                ) : reviewsError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
                    {reviewCopy.errorText}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-10 px-4 space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                      <StarOutlineIcon
                        sx={{ fontSize: 22, color: "#C9A84C" }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A2E]">
                        {reviewCopy.emptyTitle}
                      </p>
                      <p className="text-sm text-[#1A1A2E]/55 mt-1 max-w-sm mx-auto">
                        {reviewCopy.emptySub}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <article
                        key={review._id}
                        className="border border-[#1A1A2E]/8 bg-[#FAF7F2] p-4 sm:p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-full gold-gradient text-[#1A1A2E] flex items-center justify-center font-black text-sm shrink-0">
                              {review.customerId.fullName
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#1A1A2E] truncate">
                                {review.customerId.fullName}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <RatingStars rating={review.rating} />
                                <span className="text-[11px] uppercase tracking-widest text-[#1A1A2E]/40">
                                  {formatReviewDate(review.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-sm sm:text-[15px] text-[#1A1A2E]/75 leading-relaxed">
                          {review.comment}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Write a Review Section ── */}
        {isCustomer && (
          <section className="mt-14 max-w-2xl">
            <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent mb-10" />
            <h3 className="font-display text-xl font-bold text-[#1A1A2E] mb-4">
              Write a Review
            </h3>

            {reviewSuccess ? (
              <div className="bg-[#C9A84C]/10 p-4 font-medium text-sm text-[#C9A84C]">
                {reviewSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        {reviewRating >= star ? (
                          <StarIcon sx={{ fontSize: 24, color: "#C9A84C" }} />
                        ) : (
                          <StarOutlineIcon
                            sx={{ fontSize: 24, color: "#C9A84C33" }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                    Comment
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full bg-transparent border border-[#1A1A2E]/15 p-3 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors resize-none rounded-none"
                    rows={4}
                  />
                </div>

                {reviewError && (
                  <p className="text-red-500 text-sm">{reviewError}</p>
                )}

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-dark px-8 py-3 text-sm"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </section>
        )}

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="mt-14">
            <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent mb-10" />
            <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-8">
              {tr.productPage.youMayAlsoLike}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 100} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Cart added toast ───────────────────────────────────────────── */}
      {cartAdded && (
        <div
          className={`fixed top-6 ${isRTL ? "left-6" : "right-6"} z-[200] flex items-center gap-3 px-5 py-4 bg-[#1A1A2E] text-white shadow-2xl max-w-xs transition-all`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="shrink-0 w-8 h-8 gold-gradient flex items-center justify-center">
            <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: "#1A1A2E" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#C9A84C]">
              {isRTL ? "تمت الإضافة" : "Added to cart"}
            </p>
            <p className="text-xs text-white/70 mt-0.5 truncate">
              {product?.name}
            </p>
          </div>
        </div>
      )}

      {isShareOpen && (
        <div className="fixed inset-0 z-[120] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#C9A84C]/20 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A2E]/10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#C9A84C] font-bold">
                  {tr.dir === "rtl" ? "مشاركة المنتج" : "Share Product"}
                </p>
                <h3 className="font-display text-xl text-[#1A1A2E] font-bold">
                  {product.name}
                </h3>
              </div>
              <button
                onClick={() => setIsShareOpen(false)}
                className="w-9 h-9 border border-[#1A1A2E]/15 flex items-center justify-center text-[#1A1A2E]/50 hover:text-[#1A1A2E] hover:border-[#C9A84C]/50 transition-colors"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {shareLoading ? (
                <div className="text-sm text-[#1A1A2E]/60">
                  {tr.dir === "rtl"
                    ? "جارٍ تجهيز روابط المشاركة..."
                    : "Preparing share links..."}
                </div>
              ) : shareData ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "WhatsApp",
                        Icon: WhatsAppIcon,
                        key: "whatsapp",
                        color: "#25D366",
                      },
                      {
                        label: "Facebook",
                        Icon: FacebookIcon,
                        key: "facebook",
                        color: "#1877F2",
                      },
                      {
                        label: "Telegram",
                        Icon: TelegramIcon,
                        key: "telegram",
                        color: "#229ED9",
                      },
                      {
                        label: "Instagram",
                        Icon: InstagramIcon,
                        key: "instagram",
                        color: "#E4405F",
                      },
                    ].map(({ label, Icon, key, color }) => (
                      <button
                        key={label}
                        onClick={() => handlePlatformShare(key as any)}
                        className="flex items-center gap-2.5 p-3 border border-[#1A1A2E]/12 hover:border-[#C9A84C]/45 transition-all text-start"
                      >
                        <Icon sx={{ fontSize: 19, color }} />
                        <span className="text-sm font-semibold text-[#1A1A2E]">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-[#1A1A2E]/45 font-semibold">
                      {tr.dir === "rtl" ? "رابط المنتج" : "Product Link"}
                    </p>
                    <div className="flex items-stretch gap-2">
                      <input
                        value={shareData.productUrl}
                        readOnly
                        className="flex-1 border border-[#1A1A2E]/15 px-3 py-2 text-xs text-[#1A1A2E]/80 bg-[#FAF7F2]"
                      />
                      <button
                        onClick={() => copyShareLink(shareData.productUrl)}
                        className="px-3 border border-[#C9A84C]/40 text-[#1A1A2E] hover:bg-[#C9A84C]/10 transition-colors"
                        title={tr.dir === "rtl" ? "نسخ الرابط" : "Copy link"}
                      >
                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                    {shareCopied && (
                      <p className="text-xs text-emerald-600 font-medium">
                        {tr.dir === "rtl"
                          ? "تم نسخ الرابط ✅"
                          : "Link copied ✅"}
                      </p>
                    )}
                  </div>
                </>
              ) : null}

              {shareError && (
                <p className="text-xs text-red-500 leading-relaxed">
                  {shareError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
