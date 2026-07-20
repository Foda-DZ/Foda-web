import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { collectionsService } from "../services/collectionsService";
import type { Collection, CollectionProduct } from "../types";

const AUTO_INTERVAL = 6000;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <section className="bg-[#1A1A2E]">
      <div className="flex flex-col lg:flex-row h-[520px] lg:h-[480px] animate-pulse">
        <div className="flex-1 bg-[#2a2a3e]" />
        <div className="w-full lg:w-[420px] bg-[#22223a] flex flex-col justify-center p-10 gap-5">
          <div className="h-3 w-24 bg-white/10 rounded" />
          <div className="h-8 w-3/4 bg-white/10 rounded" />
          <div className="h-8 w-1/2 bg-white/10 rounded" />
          <div className="h-3 w-full bg-white/10 rounded" />
          <div className="h-12 w-36 bg-white/10 rounded" />
        </div>
      </div>
      <div className="flex gap-4 px-6 lg:px-12 py-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-40 h-48 bg-[#2a2a3e] shrink-0 animate-pulse" />
        ))}
      </div>
    </section>
  );
}

// ─── Mini product card (matches ProductCard design) ──────────────────────────
function CollectionProductCard({ product }: { product: CollectionProduct }) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, openLogin } = useAuth();
  const isCustomer = user?.role === "customer";
  const [hovered, setHovered] = useState(false);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);

  const liked = isCustomer && isInWishlist(product.id);
  const isOutOfStock = !product.inStock || product.totalStock === 0;
  const isLowStock = !isOutOfStock && product.totalStock <= 5;

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isCustomer) { openLogin(); return; }
    setWishlistAnimating(true);
    setTimeout(() => setWishlistAnimating(false), 300);
    if (liked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        images: product.image ? [product.image] : [],
        category: "",
        sellerName: "",
        inStock: product.inStock,
        totalStock: product.totalStock,
        sizes: [],
        colors: [],
        variants: [],
        description: "",
        isNew: false,
      });
    }
  }

  return (
    <div
      className="group relative flex flex-col bg-white cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F4F2EF] aspect-[3/4]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
              hovered ? "scale-[1.04]" : "scale-100"
            }`}
          />
        ) : (
          <div className="absolute inset-0 bg-[#1e1e30]" />
        )}

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
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

        {/* Wishlist button */}
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
            <FavoriteBorderIcon sx={{ fontSize: 16, color: "rgba(26,26,46,0.6)" }} />
          )}
        </button>
      </div>

      {/* Card body */}
      <div className="p-3.5 flex flex-col gap-1">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#1A1A2E]/45 truncate">
          {product.brand}
        </p>
        <p className="text-[13px] font-semibold text-[#1A1A2E] leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors duration-200">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-[15px] font-bold text-[#1A1A2E]">
            {product.price.toLocaleString()}
            <span className="text-[11px] font-normal text-[#1A1A2E]/40 ml-1">DZD</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Product card strip ────────────────────────────────────────────────────────
function ProductStrip({ collection }: { collection: Collection }) {
  const navigate = useNavigate();
  const { isRTL } = useLang();
  const collectionUrl = `/collections/${collection.id}`;
  const products = collection.products.slice(0, 6);

  return (
    <div
      className="px-6 lg:px-12 py-8 bg-[#13131f]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {products.map((p) => (
          <div key={p.id} className="shrink-0 w-44 lg:w-52">
            <CollectionProductCard product={p} />
          </div>
        ))}

        {/* "See all" card */}
        {collection.productCount > products.length && (
          <div className="shrink-0 w-44 lg:w-52">
            <button
              onClick={() => navigate(collectionUrl)}
              className="w-full aspect-[3/4] rounded-xl bg-[#C9A84C]/8 border border-[#C9A84C]/20 flex flex-col items-center justify-center gap-3 hover:bg-[#C9A84C]/15 hover:border-[#C9A84C]/50 transition-all duration-300 group/all"
            >
              <div className="w-11 h-11 rounded-full border border-[#C9A84C]/30 flex items-center justify-center group-hover/all:border-[#C9A84C] group-hover/all:bg-[#C9A84C]/10 transition-all duration-300">
                <ChevronRight size={18} className="text-[#C9A84C]" />
              </div>
              <p className="text-[#C9A84C] text-[11px] font-bold tracking-widest uppercase">
                +{collection.productCount - products.length} more
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Slide indicator dots ─────────────────────────────────────────────────────
function SlideDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to collection ${i + 1}`}
          className={`transition-all duration-300 rounded-full ${
            i === active
              ? "w-7 h-2 gold-gradient"
              : "w-2 h-2 bg-white/25 hover:bg-white/50"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ duration, active }: { duration: number; active: boolean }) {
  const [width, setWidth] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setWidth(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      return;
    }
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setWidth(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [active, duration]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
      <div
        className="h-full gold-gradient transition-none"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * `startIndex` seeds which collection is shown first — lets the section appear
 * multiple times on a page while each instance opens on a different collection.
 * It is clamped against the loaded collection count.
 */
export default function FeaturedCollections({ startIndex = 0 }: { startIndex?: number } = {}) {
  const navigate = useNavigate();
  const { isRTL } = useLang();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    collectionsService
      .getFeatured()
      .then((data) => {
        setCollections(data);
        if (data.length > 0) {
          setActive(((startIndex % data.length) + data.length) % data.length);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [startIndex]);

  const goTo = useCallback(
    (idx: number, dir: "next" | "prev" = "next") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setActive(idx);
        setAnimating(false);
      }, 420);
    },
    [animating],
  );

  const next = useCallback(() => {
    if (collections.length < 2) return;
    goTo((active + 1) % collections.length, "next");
  }, [active, collections.length, goTo]);

  const prev = useCallback(() => {
    if (collections.length < 2) return;
    goTo((active - 1 + collections.length) % collections.length, "prev");
  }, [active, collections.length, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused || collections.length < 2) return;
    timerRef.current = setInterval(next, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, paused, collections.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  if (!loading && collections.length === 0) return null;
  if (loading) return <Skeleton />;

  const col = collections[active];
  const hasImage = Boolean(col.coverImage);
  const mosaic = col.products.slice(0, 4);

  // Slide animation classes
  const slideOut =
    direction === "next"
      ? isRTL ? "translate-x-8 opacity-0" : "-translate-x-8 opacity-0"
      : isRTL ? "-translate-x-8 opacity-0" : "translate-x-8 opacity-0";

  return (
    <section
      className="relative bg-[#1A1A2E] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row min-h-[480px]">

        {/* Left: image panel */}
        <div className="relative flex-1 min-h-[320px] lg:min-h-0 overflow-hidden">
          {hasImage ? (
            <img
              key={col.id + "-cover"}
              src={col.coverImage!}
              alt={col.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                animating ? slideOut : "translate-x-0 opacity-100"
              }`}
            />
          ) : mosaic.length > 0 ? (
            <div
              key={col.id + "-mosaic"}
              className={`absolute inset-0 grid grid-cols-2 gap-px transition-all duration-500 ${
                animating ? slideOut : "translate-x-0 opacity-100"
              }`}
            >
              {mosaic.map((p, i) => (
                <div key={p.id} className="relative overflow-hidden bg-[#111120]">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      loading={i > 1 ? "lazy" : undefined}
                    />
                  )}
                  {i > 0 && <div className="absolute inset-0 bg-[#1A1A2E]/35" />}
                </div>
              ))}
              {Array.from({ length: Math.max(0, 4 - mosaic.length) }).map((_, i) => (
                <div key={`e-${i}`} className="bg-[#111120]" />
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#111120]" />
          )}

          {/* Dark overlay to unify with right panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1A1A2E]/80 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/20 to-transparent lg:hidden" />

          {/* Slide counter — bottom-left of image */}
          <div className="absolute bottom-5 start-5 hidden lg:flex items-center gap-2">
            <span className="font-display text-4xl font-black text-white/20 leading-none tabular-nums">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="text-white/20 text-lg">/</span>
            <span className="font-display text-lg font-bold text-white/15 leading-none tabular-nums">
              {String(collections.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Right: text panel */}
        <div className="relative w-full lg:w-[440px] shrink-0 flex flex-col justify-center px-8 lg:px-12 py-10 lg:py-16 bg-[#1A1A2E] z-10">
          {/* Gold accent line */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px gold-gradient shrink-0" />
            <span className="text-[#C9A84C] text-[10px] font-bold tracking-[0.25em] uppercase">
              Foda Collection
            </span>
          </div>

          {/* Collection name — animated on slide change */}
          <div className="overflow-hidden mb-4">
            <h2
              key={col.id}
              className={`font-display text-4xl lg:text-5xl font-black text-white leading-tight transition-all duration-420 ${
                animating ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
              }`}
            >
              {col.name}
            </h2>
          </div>

          {/* Sub-line */}
          <p
            key={col.id + "-sub"}
            className={`text-white/45 text-sm font-light leading-relaxed mb-8 max-w-xs transition-all duration-420 delay-75 ${
              animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {col.productCount} carefully selected{" "}
            {col.productCount === 1 ? "piece" : "pieces"} — crafted to inspire.
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate(`/collections/${col.id}`)}
            className="btn-gold w-fit flex items-center gap-2.5 group/cta mb-10"
          >
            Explore Collection
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover/cta:translate-x-1"
            />
          </button>

          {/* Navigation row */}
          {collections.length > 1 && (
            <div className="flex items-center gap-5">
              {/* Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous collection"
                  className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/40 hover:border-[#C9A84C]/70 hover:text-[#C9A84C] transition-all duration-200"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next collection"
                  className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/40 hover:border-[#C9A84C]/70 hover:text-[#C9A84C] transition-all duration-200"
                >
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Dots */}
              <SlideDots
                count={collections.length}
                active={active}
                onSelect={(i) => goTo(i, i > active ? "next" : "prev")}
              />
            </div>
          )}

          {/* Progress bar — auto-advance timer */}
          {collections.length > 1 && !paused && (
            <ProgressBar key={`${active}-${paused}`} duration={AUTO_INTERVAL} active={!paused} />
          )}
        </div>
      </div>

      {/* ── Product strip ─────────────────────────────────────────────────── */}
      <div
        key={col.id + "-strip"}
        className={`transition-all duration-420 ${
          animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
        }`}
      >
        <ProductStrip collection={col} />
      </div>

      {/* ── Thumbnail nav — desktop sidebar on right ─────────────────────── */}
      {collections.length > 1 && (
        <div className="hidden xl:flex absolute top-0 end-0 h-[480px] flex-col justify-center gap-1.5 pe-3 z-20">
          {collections.map((c, i) => (
            <button
              key={c.id}
              onClick={() => goTo(i, i > active ? "next" : "prev")}
              className={`relative overflow-hidden transition-all duration-300 ${
                i === active
                  ? "w-14 h-14 ring-2 ring-[#C9A84C] ring-offset-2 ring-offset-[#1A1A2E]"
                  : "w-11 h-11 opacity-40 hover:opacity-70 hover:w-13 hover:h-13"
              }`}
              aria-label={c.name}
            >
              {c.coverImage ? (
                <img
                  src={c.coverImage}
                  alt={c.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : c.products[0]?.image ? (
                <img
                  src={c.products[0].image}
                  alt={c.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-[#2a2a3e]" />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
