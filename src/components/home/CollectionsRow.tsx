import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import type { Collection, CollectionProduct } from "../../types";
import { useLang } from "../../context/LangContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { collectionsService } from "../../services/collectionsService";

const MAX_COLLECTIONS = 3;

// ─── Product card in the collection carousel ──────────────────────────────────
function CarouselCard({ product }: { product: CollectionProduct }) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, openLogin } = useAuth();
  const isCustomer = user?.role === "customer";
  const liked = isCustomer && isInWishlist(product.id);

  function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isCustomer) return openLogin();
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
      className="group w-44 shrink-0 cursor-pointer sm:w-52"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute end-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-neutral-100"
        >
          {liked ? (
            <FavoriteIcon sx={{ fontSize: 16, color: "#ef4444" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 16, color: "#1A1A2E" }} />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="pt-2.5">
        <p className="truncate text-[13px] font-bold text-black">{product.brand}</p>
        <p className="mt-0.5 line-clamp-1 text-[13px] text-neutral-600">
          {product.name}
        </p>
        <p className="mt-1 text-[13px] font-semibold text-black">
          {product.price.toLocaleString()}
          <span className="ms-1 text-[11px] font-normal text-neutral-400">DZD</span>
        </p>
      </div>
    </div>
  );
}

// ─── Featured collection: banner + product carousel ───────────────────────────
function FeaturedCollection({
  collection,
  reversed = false,
}: {
  collection: Collection;
  /** Flip the banner so the text panel sits before the images (alternating rows). */
  reversed?: boolean;
}) {
  const navigate = useNavigate();
  const { tr, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const scrollRef = useRef<HTMLDivElement>(null);

  const collectionUrl = `/collections/${collection.id}`;
  // Two banner images: cover + first product, or the first two products.
  const bannerImages = [
    collection.coverImage ?? collection.products[0]?.image ?? null,
    collection.products[collection.coverImage ? 0 : 1]?.image ??
      collection.products[1]?.image ??
      null,
  ];

  function scroll(dir: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (isRTL ? -320 : 320), behavior: "smooth" });
  }

  return (
    <div className="mb-4">
      {/* ── Banner: images and text side by side (alternating each row) ── */}
      <div className="grid grid-cols-1 items-stretch gap-0 overflow-hidden rounded-xl bg-neutral-50 lg:grid-cols-2">
        {/* Images */}
        <div className={`grid grid-cols-2 gap-1 ${reversed ? "lg:order-2" : "lg:order-1"}`}>
          {bannerImages.map((img, i) => (
            <div key={i} className="aspect-[4/5] overflow-hidden bg-neutral-100">
              {img ? (
                <img
                  src={img}
                  alt={collection.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-neutral-200" />
              )}
            </div>
          ))}
        </div>

        {/* Text panel */}
        <div className={`flex flex-col justify-center p-8 lg:p-12 ${reversed ? "lg:order-1" : "lg:order-2"}`}>
          <span className="mb-3 text-xs font-medium text-neutral-400">
            {tr.home.collectionsTitle}
          </span>
          <h3 className="text-3xl font-bold leading-tight tracking-tight text-black lg:text-4xl">
            {collection.name}
          </h3>
          {collection.description && (
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
              {collection.description}
            </p>
          )}
          <button
            onClick={() => navigate(collectionUrl)}
            className="group mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-black px-8 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:bg-black hover:text-white"
          >
            {tr.home.discoverNow}
            <Arrow
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            />
          </button>
        </div>
      </div>

      {/* ── Product carousel ── */}
      <div className="relative mt-4">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {collection.products.map((p) => (
            <CarouselCard key={p.id} product={p} />
          ))}
        </div>

        {/* Scroll button — desktop only */}
        {collection.products.length > 4 && (
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll products"
            className="absolute end-0 top-[38%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition-colors hover:bg-neutral-50 lg:flex"
          >
            <Arrow size={18} className="text-black" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
/**
 * Renders a single featured collection (banner + product carousel), Zalando-style.
 * `index` selects which product-bearing collection to show, so the HomePage can
 * interleave several collections between product sections. The collections data
 * is cached/deduped in the service, so multiple instances share one fetch.
 */
export default function CollectionsRow({ index = 0 }: { index?: number } = {}) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    collectionsService
      .getFeatured()
      .then((data) => {
        if (alive) setCollections(data);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading || collections.length === 0) return null;

  // Prefer collections that actually have products to show in the carousel.
  const withProducts = collections.filter((c) => c.products.length > 0);
  const pool = (withProducts.length > 0 ? withProducts : collections).slice(
    0,
    MAX_COLLECTIONS,
  );

  const collection = pool[index];
  if (!collection) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 lg:px-12 lg:py-14">
      <FeaturedCollection collection={collection} reversed={index % 2 === 1} />
    </section>
  );
}
