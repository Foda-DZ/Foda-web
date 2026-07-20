import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import { collectionsService } from "../services/collectionsService";
import { apiProductToProduct } from "../lib/mappers";
import type { Collection, Product } from "../types";
import type { ApiProduct } from "../types/api";
import ProductCard from "../components/ui/ProductCard";
import Pagination from "../components/ui/Pagination";
import { useLang } from "../context/LangContext";

const ITEMS_PER_PAGE = 12;

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

// ─── Skeletons ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden bg-white border border-charcoal/6">
      <div className="aspect-3/4 bg-[#E8E2D9]" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 bg-[#E8E2D9] rounded w-1/4" />
        <div className="h-4 bg-[#E8E2D9] rounded w-3/4" />
        <div className="h-3 bg-[#E8E2D9] rounded w-1/2" />
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="w-full bg-charcoal animate-pulse" style={{ minHeight: 380 }} />
  );
}

// ─── Hero banner ────────────────────────────────────────────────────────────
function CollectionHero({ collection }: { collection: Collection }) {
  const navigate = useNavigate();
  const { isRTL } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const cover = collection.coverImage ?? collection.products[0]?.image ?? null;

  return (
    <div className="relative w-full overflow-hidden bg-charcoal" style={{ minHeight: 380 }}>
      {/* Background */}
      {cover && (
        <img
          src={cover}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
        />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-linear-to-r from-charcoal/95 via-charcoal/75 to-charcoal/40" />
      <div className="absolute inset-0 bg-linear-to-t from-charcoal via-transparent to-transparent" />

      {/* Content */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-white/40 hover:text-gold text-xs font-semibold tracking-widest uppercase transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft
            size={13}
            className="transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
          />
          Back
        </button>

        {/* Gold accent */}
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-px gold-gradient shrink-0" />
          <span className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase flex items-center gap-1.5">
            <Sparkles size={11} />
            Foda Collection
          </span>
        </div>

        <h1 className="font-display text-5xl lg:text-7xl font-black text-white leading-[0.95] mb-5 max-w-3xl">
          {collection.name}
        </h1>

        {collection.description && (
          <p className="text-white/55 text-base font-light leading-relaxed max-w-xl mb-8">
            {collection.description}
          </p>
        )}

        {/* Stat chip */}
        <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          <span className="text-white/70 text-xs font-medium">
            {collection.productCount}{" "}
            {collection.productCount === 1 ? "piece" : "pieces"} curated
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Sort dropdown ──────────────────────────────────────────────────────────
function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const OPTIONS: { key: SortKey; label: string }[] = [
    { key: "featured", label: "Featured" },
    { key: "price-asc", label: "Price: Low to High" },
    { key: "price-desc", label: "Price: High to Low" },
    { key: "name", label: "Name: A–Z" },
  ];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  const current = OPTIONS.find((o) => o.key === value)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-semibold tracking-wide transition-all duration-200 ${
          open
            ? "border-gold text-charcoal bg-gold/8"
            : "border-charcoal/12 text-charcoal/60 hover:border-gold/50 hover:text-charcoal"
        }`}
      >
        {current.label}
        <KeyboardArrowDownIcon
          sx={{ fontSize: 16 }}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-charcoal/8 py-1.5 z-20 anim-fade-up" style={{ animationDuration: "0.2s" }}>
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-charcoal/70 hover:bg-cream hover:text-charcoal transition-colors duration-150"
            >
              {opt.label}
              {opt.key === value && <CheckIcon sx={{ fontSize: 15 }} className="text-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isRTL } = useLang();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setPage(1);
    collectionsService
      .getById(id)
      .then(setCollection)
      .catch(() => setError("Collection not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // Map CollectionProduct → Product shape that ProductCard expects
  const allProducts: Product[] = useMemo(() => {
    if (!collection) return [];
    return collection.products.map((cp) => {
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
    });
  }, [collection]);

  const sortedProducts = useMemo(() => {
    const list = [...allProducts];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [allProducts, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const pageProducts = sortedProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  function handlePageChange(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center flex-col gap-5 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-charcoal/5 flex items-center justify-center">
          <Sparkles className="text-charcoal/25" size={26} />
        </div>
        <p className="font-display text-2xl font-bold text-charcoal">{error}</p>
        <p className="text-charcoal/40 text-sm max-w-xs">
          This collection may have been removed or the link is incorrect.
        </p>
        <button onClick={() => navigate("/")} className="btn-dark px-8 mt-2">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero */}
      {loading ? <HeroSkeleton /> : collection && <CollectionHero collection={collection} />}

      {/* Toolbar */}
      {!loading && collection && collection.products.length > 0 && (
        <div className="sticky top-0 z-10 bg-cream/90 backdrop-blur-md border-b border-charcoal/8">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-4">
            <span className="text-charcoal/40 text-xs font-medium tracking-wide">
              {sortedProducts.length} {sortedProducts.length === 1 ? "item" : "items"}
            </span>
            <SortDropdown value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
          </div>
        </div>
      )}

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : pageProducts.map((p, i) => (
                <div
                  key={p.id}
                  className="opacity-0-start anim-fade-up"
                  style={{ animationDelay: `${(i % ITEMS_PER_PAGE) * 40}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
        </div>

        {!loading && totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        )}

        {/* Empty state */}
        {!loading && allProducts.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-charcoal/5 flex items-center justify-center">
              <Sparkles className="text-charcoal/25" size={26} />
            </div>
            <p className="font-display text-2xl font-bold text-charcoal/25">
              No products yet
            </p>
            <p className="text-charcoal/30 text-sm max-w-xs">
              This collection is still being curated. Check back soon.
            </p>
            <button onClick={() => navigate("/shop")} className="btn-dark px-8 mt-2">
              Browse All Products
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
