import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { useLang } from "../context/LangContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const GRID_COUNT = 6;

// ─── Sort products by newest first ────────────────────────────────────────────
function sortByNewest(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });
}

// ─── Featured "latest drop" hero panel ────────────────────────────────────────
function FeaturedDrop({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { tr, isRTL } = useLang();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, openLogin } = useAuth();
  const isCustomer = user?.role === "customer";
  const liked = isCustomer && isInWishlist(product.id);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isCustomer) return openLogin();
    if (liked) removeFromWishlist(product.id);
    else addToWishlist(product);
  }

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-[#13131f] cursor-pointer h-full min-h-[420px] lg:min-h-[560px]"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      {product.images[0] ? (
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#22223a] to-[#13131f]" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d16] via-[#0d0d16]/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d16]/50 via-transparent to-transparent" />

      {/* Latest-drop tag */}
      <div className="absolute top-5 start-5 flex items-center gap-2 rounded-full bg-[#C9A84C] px-3.5 py-1.5 shadow-lg">
        <Sparkles size={13} className="text-charcoal" />
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-charcoal">
          {tr.newArrivalsSection.featuredTag}
        </span>
      </div>

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-5 end-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-200 ${
          liked
            ? "border-red-200 bg-red-50/90 shadow-md"
            : "border-white/25 bg-white/10 hover:bg-white/20"
        }`}
      >
        {liked ? (
          <FavoriteIcon sx={{ fontSize: 18, color: "#ef4444" }} />
        ) : (
          <FavoriteBorderIcon sx={{ fontSize: 18, color: "#fff" }} />
        )}
      </button>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-9">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
          {product.brand || product.sellerName || product.category}
        </p>
        <h3 className="font-display text-2xl lg:text-4xl font-black leading-tight text-white">
          {product.name}
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="text-xl lg:text-2xl font-bold text-white">
            {product.price.toLocaleString()}
            <span className="ms-1.5 text-sm font-normal text-white/50">DZD</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-all duration-300 group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-charcoal">
            {tr.newArrivalsSection.viewProduct}
            <Arrow size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Compact product tile for the grid ────────────────────────────────────────
function ArrivalTile({ product, index }: { product: Product; index: number }) {
  const navigate = useNavigate();
  const { tr } = useLang();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, openLogin } = useAuth();
  const isCustomer = user?.role === "customer";
  const liked = isCustomer && isInWishlist(product.id);
  const isOutOfStock = !product.inStock || product.totalStock === 0;

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isCustomer) return openLogin();
    if (liked) removeFromWishlist(product.id);
    else addToWishlist(product);
  }

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl bg-[#13131f] cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1e1e30]">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1e1e30]" />
        )}

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

        {/* "Just In" badge — only on the two freshest tiles */}
        {index < 2 && (
          <span className="absolute top-3 start-3 rounded-full bg-[#C9A84C] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-charcoal shadow-sm">
            {tr.newArrivalsSection.justLanded}
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-3 start-3 rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Sold Out
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 end-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-200 ${
            liked
              ? "border-red-200 bg-red-50/90"
              : "border-white/20 bg-white/10 opacity-0 group-hover:opacity-100 hover:bg-white/20"
          }`}
        >
          {liked ? (
            <FavoriteIcon sx={{ fontSize: 14, color: "#ef4444" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 14, color: "#fff" }} />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-white/40">
          {product.brand || product.sellerName || product.category}
        </p>
        <p className="line-clamp-1 text-[13px] font-semibold text-white transition-colors duration-200 group-hover:text-[#C9A84C]">
          {product.name}
        </p>
        <span className="mt-0.5 text-[13px] font-bold text-white">
          {product.price.toLocaleString()}
          <span className="ms-1 text-[10px] font-normal text-white/40">DZD</span>
        </span>
      </div>
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
function FeaturedSkeleton() {
  return (
    <div className="h-full min-h-[420px] animate-pulse rounded-2xl bg-[#1a1a2b] lg:min-h-[560px]" />
  );
}

function TileSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl bg-[#13131f]">
      <div className="aspect-[3/4] bg-[#1a1a2b]" />
      <div className="space-y-2 p-3">
        <div className="h-2.5 w-1/3 rounded bg-[#1a1a2b]" />
        <div className="h-3.5 w-3/4 rounded bg-[#1a1a2b]" />
        <div className="h-3.5 w-1/2 rounded bg-[#1a1a2b]" />
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function NewArrivals() {
  const navigate = useNavigate();
  const { tr, isRTL } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    productsService
      .getAll()
      .then((apiProducts) =>
        setProducts(sortByNewest(apiProducts.map(apiProductToProduct))),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = products[0];
  const grid = useMemo(() => products.slice(1, 1 + GRID_COUNT), [products]);

  // Hide the section entirely if there's genuinely nothing to show
  if (!loading && products.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-[#0d0d16] py-20 lg:py-28"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute -top-32 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#C9A84C]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 shrink-0 gold-gradient" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#C9A84C]">
                {tr.newArrivalsSection.eyebrow}
              </span>
            </div>
            <h2 className="font-display text-4xl font-black leading-none text-white lg:text-6xl">
              {tr.newArrivalsSection.titleLine1}{" "}
              <span className="gold-text">{tr.newArrivalsSection.titleLine2}</span>
            </h2>
            <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-white/45">
              {tr.newArrivalsSection.subtitle}
            </p>
          </div>

          <button
            onClick={() => navigate("/shop")}
            className="group flex w-fit items-center gap-2.5 self-start rounded-full border border-white/15 px-7 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-[#C9A84C] hover:text-[#C9A84C] lg:self-auto"
          >
            {tr.newArrivalsSection.exploreAll}
            <Arrow size={14} className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </button>
        </div>

        {/* Content grid: featured hero + product grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Featured drop */}
          <div className="lg:col-span-5">
            {loading ? (
              <FeaturedSkeleton />
            ) : featured ? (
              <FeaturedDrop product={featured} />
            ) : null}
          </div>

          {/* Grid of recent arrivals */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:h-full">
              {loading
                ? Array.from({ length: GRID_COUNT }).map((_, i) => (
                    <TileSkeleton key={i} />
                  ))
                : grid.map((p, i) => (
                    <ArrivalTile key={p.id} product={p} index={i} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
