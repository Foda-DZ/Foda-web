import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { collectionsService } from "../services/collectionsService";
import { apiProductToProduct } from "../lib/mappers";
import type { Collection } from "../types";
import type { ApiProduct } from "../types/api";
import ProductCard from "../components/ui/ProductCard";
import { useLang } from "../context/LangContext";

// ─── Skeleton grid ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-[#F5F0E8] border border-charcoal/6">
      <div className="aspect-3/4 bg-[#E8E2D9]" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 bg-[#E8E2D9] rounded w-1/4" />
        <div className="h-4 bg-[#E8E2D9] rounded w-3/4" />
        <div className="h-3 bg-[#E8E2D9] rounded w-1/2" />
        <div className="h-px bg-[#E8E2D9] mt-3" />
        <div className="h-5 bg-[#E8E2D9] rounded w-1/3" />
      </div>
    </div>
  );
}

// ─── Hero banner ──────────────────────────────────────────────────────────────
function CollectionHero({ collection }: { collection: Collection }) {
  const navigate = useNavigate();
  const { isRTL } = useLang();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden bg-charcoal"
      style={{ minHeight: 340 }}
    >
      {/* Background */}
      {collection.coverImage ? (
        <img
          src={collection.coverImage}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
      ) : collection.products[0]?.image ? (
        <img
          src={collection.products[0].image}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      ) : null}

      {/* Gradients */}
      <div className="absolute inset-0 bg-linear-to-r from-charcoal/95 via-charcoal/70 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-charcoal via-transparent to-transparent" />

      {/* Content */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-white/40 hover:text-gold text-xs font-semibold tracking-widest uppercase transition-colors duration-200 mb-8 group"
        >
          <ArrowLeft
            size={13}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Back
        </button>

        {/* Gold accent */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px gold-gradient shrink-0" />
          <span className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase">
            Foda Collection
          </span>
        </div>

        <h1 className="font-display text-5xl lg:text-7xl font-black text-white leading-none mb-4">
          {collection.name}
        </h1>

        {collection.description && (
          <p className="text-white/50 text-base font-light leading-relaxed max-w-xl mt-3 mb-6">
            {collection.description}
          </p>
        )}

        <p className="text-white/30 text-sm mt-2">
          {collection.productCount}{" "}
          {collection.productCount === 1 ? "piece" : "pieces"}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isRTL } = useLang();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    collectionsService
      .getById(id)
      .then(setCollection)
      .catch(() => setError("Collection not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // Map CollectionProduct → Product shape that ProductCard expects
  const products = collection
    ? collection.products.map((cp) => {
        const pseudo: ApiProduct = {
          _id: cp.id,
          sellerId: "",
          name: cp.name,
          brand: "",
          images: cp.image ? [{ url: cp.image, publicId: "" }] : [],
          price: cp.price,
          inStock: cp.inStock,
          totalStock: cp.totalStock,
          description: "",
          sizes: [],
          colors: [],
          variants: [],
          mainCategory: "Other",
          subCategory: "Other",
          createdAt: collection.createdAt,
          updatedAt: collection.createdAt,
        };
        return apiProductToProduct(pseudo);
      })
    : [];

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center flex-col gap-4">
        <p className="font-display text-2xl font-bold text-charcoal">{error}</p>
        <button onClick={() => navigate("/")} className="btn-dark px-8">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero */}
      {loading ? (
        <div className="w-full bg-charcoal animate-pulse" style={{ minHeight: 340 }} />
      ) : (
        collection && <CollectionHero collection={collection} />
      )}

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        {/* Section label */}
        {!loading && collection && (
          <div className="flex items-center gap-3 mb-10">
            <span className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase">
              All Pieces
            </span>
            <div className="flex-1 h-px bg-charcoal/8" />
            <span className="text-charcoal/30 text-xs">
              {collection.productCount}{" "}
              {collection.productCount === 1 ? "item" : "items"}
            </span>
          </div>
        )}

        {/* Grid — responsive 2 → 3 → 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 50} />
              ))}
        </div>

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-2xl font-bold text-charcoal/25 mb-3">
              No products yet
            </p>
            <p className="text-charcoal/30 text-sm">
              This collection is still being curated.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
