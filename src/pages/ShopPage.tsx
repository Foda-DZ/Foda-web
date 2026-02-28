import { useState, useMemo, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  ChevronDown,
  Star,
  Heart,
  ShoppingBag,
  Eye,
  X,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { categories } from "../data/products";
import type { Product } from "../types";
import type { LayoutOutletContext } from "../components/Layout";
import Footer from "../components/Footer";
import { useLang } from "../context/LangContext";
import { useSellerContext } from "../context/SellerContext";

type ViewMode = "grid" | "list";
type QuickFilter = "sale" | "new" | "instock" | "bestsellers";

interface ProductCardProps {
  product: Product;
  onViewDetail: (p: Product) => void;
  view: ViewMode;
}

function ProductCard({ product, onViewDetail, view }: ProductCardProps) {
  const { tr } = useLang();
  const [liked, setLiked] = useState(false);

  if (view === "list") {
    return (
      <div className="flex gap-5 p-4 bg-white border border-[#1A1A2E]/8 hover:border-[#C9A84C]/30 transition-all duration-300 group">
        <div
          className="w-28 h-36 flex-shrink-0 overflow-hidden bg-[#F0EBE3] cursor-pointer relative"
          onClick={() => onViewDetail(product)}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span
              className={`absolute top-2 start-2 text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase ${product.badgeColor}`}
            >
              {product.badge}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <p className="text-[#C9A84C] text-[10px] font-semibold tracking-widest uppercase">
            {product.brand}
          </p>
          <h3
            className="font-display font-bold text-[#1A1A2E] text-lg mt-0.5 cursor-pointer hover:text-[#C9A84C] transition-colors duration-200"
            onClick={() => onViewDetail(product)}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-[#C9A84C] text-[#C9A84C]"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-[#1A1A2E]/40 text-xs">
              ({product.reviews})
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-[#1A1A2E] text-base">
              {product.price.toLocaleString()} {tr.common.dzd}
            </span>
            {product.originalPrice && (
              <span className="text-[#1A1A2E]/35 text-sm line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <button
            onClick={() => onViewDetail(product)}
            className="w-9 h-9 border border-[#1A1A2E]/15 flex items-center justify-center text-[#1A1A2E]/40 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className={`w-9 h-9 border flex items-center justify-center transition-all duration-200 ${liked ? "border-red-300 text-red-400 bg-red-50" : "border-[#1A1A2E]/15 text-[#1A1A2E]/40 hover:border-red-300 hover:text-red-400"}`}
          >
            <Heart size={14} className={liked ? "fill-current" : ""} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      <div
        className="relative overflow-hidden bg-[#F0EBE3] aspect-[3/4] cursor-pointer card-img-zoom"
        onClick={() => onViewDetail(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.badge && (
          <span
            className={`absolute top-3 start-3 text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase ${product.badgeColor}`}
          >
            {product.badge}
          </span>
        )}
        {product.stock <= 3 && (
          <span className="absolute top-3 end-3 text-[10px] font-bold px-2 py-0.5 bg-red-500 text-white">
            {product.stock}
          </span>
        )}
        <div className="absolute inset-0 bg-[#1A1A2E]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(product);
            }}
            className="glass text-white text-xs font-semibold px-5 py-2.5 flex items-center gap-2 hover:bg-white/20 transition-colors duration-200"
          >
            <Eye size={13} /> {tr.products.quickView}
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className={`absolute bottom-3 end-3 w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${liked ? "bg-red-500 text-white" : "glass text-white hover:bg-red-500"}`}
        >
          <Heart size={13} className={liked ? "fill-current" : ""} />
        </button>
      </div>
      <div className="pt-3 pb-1">
        <div className="flex items-center gap-1 mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={10}
              className={
                i < Math.floor(product.rating)
                  ? "fill-[#C9A84C] text-[#C9A84C]"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="text-[#1A1A2E]/40 text-xs ms-1">
            ({product.reviews})
          </span>
        </div>
        <p className="text-[#1A1A2E]/40 text-[10px] tracking-widest uppercase mb-0.5">
          {product.brand}
        </p>
        <h3
          className="font-display font-bold text-[#1A1A2E] text-base cursor-pointer hover:text-[#C9A84C] transition-colors duration-200 leading-tight mb-2"
          onClick={() => onViewDetail(product)}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#1A1A2E]">
              {product.price.toLocaleString()} {tr.common.dzd}
            </span>
            {product.originalPrice && (
              <span className="text-[#1A1A2E]/35 text-xs line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={() => onViewDetail(product)}
            className="w-8 h-8 border border-[#1A1A2E]/15 flex items-center justify-center text-[#1A1A2E]/50 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200"
          >
            <ShoppingBag size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const navigate = useNavigate();
  const { openProduct } = useOutletContext<LayoutOutletContext>();
  const { tr } = useLang();
  const { allProducts } = useSellerContext();
  const [searchParams] = useSearchParams();

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Best Rated" },
  ];

  const quickFilterDefs: { key: QuickFilter; label: string }[] = [
    { key: "sale",        label: tr.shop.onSale },
    { key: "new",         label: tr.shop.newArrivals },
    { key: "instock",     label: tr.shop.inStock },
    { key: "bestsellers", label: tr.shop.bestsellers },
  ];

  const [activeCategory, setActiveCategory] = useState(() => searchParams.get("category") ?? "All");
  const [sortBy, setSortBy] = useState(() => {
    const s = searchParams.get("sort");
    return s && ["featured","newest","price-asc","price-desc","rating"].includes(s) ? s : "featured";
  });
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 40000]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<QuickFilter>>(new Set());

  // Sync state when URL params change (e.g., navigating from category cards / navbar)
  useEffect(() => {
    const cat = searchParams.get("category");
    setActiveCategory(cat ?? "All");
    const sort = searchParams.get("sort");
    if (sort && ["featured","newest","price-asc","price-desc","rating"].includes(sort)) {
      setSortBy(sort);
    }
  }, [searchParams]);

  const toggleQuickFilter = (key: QuickFilter) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (activeCategory !== "All")
      list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );
    // Quick filters
    if (activeFilters.has("sale"))    list = list.filter((p) => p.originalPrice != null);
    if (activeFilters.has("new"))     list = list.filter((p) => p.isNew);
    if (activeFilters.has("instock")) list = list.filter((p) => p.stock > 0);

    if (activeFilters.has("bestsellers")) {
      list.sort((a, b) => b.reviews - a.reviews);
    } else {
      switch (sortBy) {
        case "newest":
          list = list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew));
          break;
        case "price-asc":
          list.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          list.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
          break;
      }
    }
    return list;
  }, [activeCategory, search, sortBy, priceRange, allProducts, activeFilters]);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="dark-gradient pt-28 pb-12 px-6 lg:px-12 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[#C9A84C]/5 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(45deg, transparent 45%, rgba(201,168,76,.05) 50%, transparent 55%)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-[#C9A84C] transition-colors duration-200 mb-6 text-sm"
          >
            <ArrowLeft size={15} className="rtl:rotate-180" /> {tr.common.back}
          </button>
          <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-2">
            {tr.shop.title.split(" ")[0]}
          </p>
          <h1 className="font-display text-5xl lg:text-7xl font-black text-white">
            {tr.shop.title.split(" ").slice(1).join(" ") || tr.shop.title}{" "}
            <span className="animated-gold-text">{tr.categories.category}</span>
          </h1>
          <p className="text-white/50 font-light mt-3">
            {tr.shop.subtitle.replace("{count}", String(filtered.length))}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute start-4 top-1/2 -translate-y-1/2 text-[#1A1A2E]/30"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr.shop.searchPlaceholder}
              className="w-full h-11 ps-11 pe-10 border border-[#1A1A2E]/15 bg-white text-[#1A1A2E] placeholder-[#1A1A2E]/30 text-sm outline-none focus:border-[#C9A84C]/60 transition-colors duration-300"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[#1A1A2E]/30 hover:text-[#1A1A2E]/60"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 px-4 border flex items-center gap-2 text-sm font-medium transition-all duration-200 ${showFilters ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5" : "border-[#1A1A2E]/15 text-[#1A1A2E]/60 hover:border-[#C9A84C]/50"}`}
            >
              <SlidersHorizontal size={15} /> {tr.shop.filters}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="h-11 px-4 border border-[#1A1A2E]/15 flex items-center gap-2 text-sm text-[#1A1A2E]/60 hover:border-[#C9A84C]/50 transition-colors duration-200 min-w-[150px] justify-between"
              >
                <span>
                  {sortOptions.find((s) => s.value === sortBy)?.label}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${showSortMenu ? "rotate-180" : ""}`}
                />
              </button>
              {showSortMenu && (
                <div className="absolute top-full end-0 mt-1 w-48 bg-white border border-[#1A1A2E]/10 shadow-xl z-30">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-start px-4 py-2.5 text-sm transition-colors duration-150 ${sortBy === opt.value ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/5" : "text-[#1A1A2E]/70 hover:bg-[#FAF7F2] hover:text-[#1A1A2E]"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex border border-[#1A1A2E]/15">
              {[
                { id: "grid" as const, Icon: Grid3X3 },
                { id: "list" as const, Icon: LayoutList },
              ].map(({ id, Icon }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`w-11 h-11 flex items-center justify-center transition-all duration-200 ${view === id ? "bg-[#1A1A2E] text-white" : "text-[#1A1A2E]/40 hover:text-[#1A1A2E]"}`}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-6 p-5 bg-white border border-[#1A1A2E]/8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50 mb-3">
                {tr.shop.priceRange}
              </p>
              <input
                type="range"
                min={0}
                max={40000}
                step={500}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full accent-[#C9A84C]"
              />
              <div className="flex justify-between text-xs text-[#1A1A2E]/50 mt-1">
                <span>0 {tr.common.dzd}</span>
                <span className="font-semibold text-[#C9A84C]">
                  {priceRange[1].toLocaleString()} {tr.common.dzd}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50 mb-3">
                {tr.shop.quickFilters}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickFilterDefs.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleQuickFilter(key)}
                    className={`px-3 py-1.5 border text-xs font-semibold transition-all duration-200 ${
                      activeFilters.has(key)
                        ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                        : "border-[#1A1A2E]/15 text-[#1A1A2E]/60 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {[tr.shop.all, ...categories].map((cat, idx) => {
            const catKey = idx === 0 ? "All" : categories[idx - 1];
            const isActive = activeCategory === catKey;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(catKey)}
                className={`flex-shrink-0 px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 whitespace-nowrap ${isActive ? "gold-gradient text-[#1A1A2E]" : "border border-[#1A1A2E]/15 text-[#1A1A2E]/60 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"}`}
              >
                {cat}
                {idx > 0 && (
                  <span className="ms-2 text-[10px] font-normal text-current opacity-60">
                    ({allProducts.filter((p) => p.category === catKey).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#1A1A2E]/50 text-sm">
            {tr.shop.showing}{" "}
            <span className="font-semibold text-[#1A1A2E]">
              {filtered.length}
            </span>{" "}
            {tr.shop.products}
            {activeCategory !== "All" && ` ${tr.shop.in} ${activeCategory}`}
          </p>
          {search && (
            <p className="text-[#1A1A2E]/50 text-sm">
              {tr.shop.resultsFor} "
              <span className="text-[#C9A84C] font-medium">{search}</span>"
              <button
                onClick={() => setSearch("")}
                className="ms-2 text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70"
              >
                <X size={12} className="inline" />
              </button>
            </p>
          )}
        </div>

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-[#1A1A2E]/30 mb-3">
              {tr.shop.noProducts}
            </p>
            <p className="text-[#1A1A2E]/40 text-sm mb-6">
              {tr.shop.noProductsSub}
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
                setPriceRange([0, 40000]);
                setActiveFilters(new Set());
              }}
              className="btn-gold"
            >
              {tr.shop.clearFilters}
            </button>
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6"
                : "flex flex-col gap-3"
            }
          >
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                view={view}
                onViewDetail={openProduct}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
