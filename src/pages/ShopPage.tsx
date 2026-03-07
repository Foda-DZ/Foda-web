import { useState, useMemo, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { categories } from "../data/products";
import type { Product } from "../types";
import type { LayoutOutletContext } from "../components/Layout";
import Footer from "../components/Footer";
import { useLang } from "../context/LangContext";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";
import ProductCard from "../components/ui/ProductCard";

type ViewMode = "grid" | "list";
type QuickFilter = "new" | "instock";

export default function ShopPage() {
  const navigate = useNavigate();
  const { openProduct } = useOutletContext<LayoutOutletContext>();
  const { tr } = useLang();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadProducts = () => {
    setLoading(true);
    setFetchError(null);
    productsService
      .getAll()
      .then((ap) => setProducts(ap.map(apiProductToProduct)))
      .catch((err) =>
        setFetchError(err instanceof Error ? err.message : "Failed to load products."),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    productsService
      .getAll()
      .then((ap) => {
        if (!cancelled) setProducts(ap.map(apiProductToProduct));
      })
      .catch((err) => {
        if (!cancelled)
          setFetchError(err instanceof Error ? err.message : "Failed to load products.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  const quickFilterDefs: { key: QuickFilter; label: string }[] = [
    { key: "new", label: tr.shop.newArrivals },
    { key: "instock", label: tr.shop.inStock },
  ];

  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("category") ?? "All",
  );
  const [sortBy, setSortBy] = useState(() => {
    const s = searchParams.get("sort");
    return s && ["featured", "newest", "price-asc", "price-desc"].includes(s)
      ? s
      : "featured";
  });
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 40000]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<QuickFilter>>(new Set());

  useEffect(() => {
    const cat = searchParams.get("category");
    setActiveCategory(cat ?? "All");
    const sort = searchParams.get("sort");
    if (sort && ["featured", "newest", "price-asc", "price-desc"].includes(sort)) {
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
    let list = [...products];
    if (activeCategory !== "All") list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      );
    }
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (activeFilters.has("new")) list = list.filter((p) => p.isNew);
    if (activeFilters.has("instock")) list = list.filter((p) => p.stock > 0);
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
    }
    return list;
  }, [activeCategory, search, sortBy, priceRange, products, activeFilters]);

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
            <ArrowBackIcon sx={{ fontSize: 15 }} className="rtl:rotate-180" /> {tr.common.back}
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
          <div className="flex-1">
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr.shop.searchPlaceholder}
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16, color: "rgba(26,26,46,0.3)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch("")} sx={{ p: 0.3 }}>
                        <CloseIcon sx={{ fontSize: 14, color: "rgba(26,26,46,0.35)" }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{ "& .MuiOutlinedInput-root": { height: 44, bgcolor: "#fff", borderRadius: 0 } }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 px-4 border flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                showFilters
                  ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5"
                  : "border-[#1A1A2E]/15 text-[#1A1A2E]/60 hover:border-[#C9A84C]/50"
              }`}
            >
              <FilterListIcon sx={{ fontSize: 15 }} /> {tr.shop.filters}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="h-11 px-4 border border-[#1A1A2E]/15 flex items-center gap-2 text-sm text-[#1A1A2E]/60 hover:border-[#C9A84C]/50 transition-colors duration-200 min-w-[150px] justify-between"
              >
                <span>{sortOptions.find((s) => s.value === sortBy)?.label}</span>
                <KeyboardArrowDownIcon
                  sx={{ fontSize: 14 }}
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
                      className={`w-full text-start px-4 py-2.5 text-sm transition-colors duration-150 ${
                        sortBy === opt.value
                          ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/5"
                          : "text-[#1A1A2E]/70 hover:bg-[#FAF7F2] hover:text-[#1A1A2E]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex border border-[#1A1A2E]/15">
              {[
                { id: "grid" as const, Icon: GridViewIcon },
                { id: "list" as const, Icon: ViewListIcon },
              ].map(({ id, Icon }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`w-11 h-11 flex items-center justify-center transition-all duration-200 ${
                    view === id ? "bg-[#1A1A2E] text-white" : "text-[#1A1A2E]/40 hover:text-[#1A1A2E]"
                  }`}
                >
                  <Icon sx={{ fontSize: 15 }} />
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
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
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
                className={`flex-shrink-0 px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "gold-gradient text-[#1A1A2E]"
                    : "border border-[#1A1A2E]/15 text-[#1A1A2E]/60 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                }`}
              >
                {cat}
                {idx > 0 && (
                  <span className="ms-2 text-[10px] font-normal text-current opacity-60">
                    ({products.filter((p) => p.category === catKey).length})
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
            <span className="font-semibold text-[#1A1A2E]">{filtered.length}</span>{" "}
            {tr.shop.products}
            {activeCategory !== "All" && ` ${tr.shop.in} ${activeCategory}`}
          </p>
          {search && (
            <p className="text-[#1A1A2E]/50 text-sm">
              {tr.shop.resultsFor} "
              <span className="text-[#C9A84C] font-medium">{search}</span>"
              <IconButton size="small" onClick={() => setSearch("")} sx={{ ml: 0.5, p: 0.3 }}>
                <CloseIcon sx={{ fontSize: 12, color: "rgba(26,26,46,0.4)" }} />
              </IconButton>
            </p>
          )}
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <CircularProgress sx={{ color: "#C9A84C" }} size={32} />
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <ErrorOutlineIcon sx={{ fontSize: 32, color: "#f87171" }} />
            <p className="text-[#1A1A2E]/60 text-sm">{fetchError}</p>
            <button onClick={loadProducts} className="btn-gold">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-[#1A1A2E]/30 mb-3">{tr.shop.noProducts}</p>
            <p className="text-[#1A1A2E]/40 text-sm mb-6">{tr.shop.noProductsSub}</p>
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
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onViewDetail={openProduct} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((product) => (
              <ListRow key={product.id} product={product} onViewDetail={openProduct} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

// ─── List row (no fake fields) ────────────────────────────────────────────────
function ListRow({
  product,
  onViewDetail,
}: {
  product: Product;
  onViewDetail: (p: Product) => void;
}) {
  const { tr } = useLang();
  const [liked, setLiked] = useState(false);
  const isOutOfStock = product.stock === 0;

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
        {product.isNew && !isOutOfStock && (
          <span className="absolute top-2 start-2 text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase bg-[#1A1A2E] text-[#C9A84C]">
            NEW
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-2 start-2 text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase bg-[#1A1A2E]/55 text-white">
            Out of Stock
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 py-1">
        <p className="text-[#C9A84C] text-[10px] font-semibold tracking-widest uppercase">
          {product.category}
        </p>
        <h3
          className="font-display font-bold text-[#1A1A2E] text-lg mt-0.5 cursor-pointer hover:text-[#C9A84C] transition-colors duration-200"
          onClick={() => onViewDetail(product)}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-[#1A1A2E] text-base">
            {product.price.toLocaleString()} {tr.common.dzd}
          </span>
        </div>
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.sizes.slice(0, 5).map((s) => (
              <span
                key={s}
                className="text-[10px] font-medium px-1.5 py-0.5 border border-[#1A1A2E]/15 text-[#1A1A2E]/50"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-2">
        <IconButton
          size="small"
          onClick={() => onViewDetail(product)}
          sx={{
            borderRadius: 0,
            width: 36,
            height: 36,
            border: "1px solid rgba(26,26,46,0.15)",
            color: "rgba(26,26,46,0.4)",
            "&:hover": { borderColor: "#C9A84C", color: "#C9A84C" },
          }}
        >
          <VisibilityIcon sx={{ fontSize: 14 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => setLiked(!liked)}
          sx={{
            borderRadius: 0,
            width: 36,
            height: 36,
            border: liked ? "1px solid #fca5a5" : "1px solid rgba(26,26,46,0.15)",
            color: liked ? "#ef4444" : "rgba(26,26,46,0.4)",
            bgcolor: liked ? "#fef2f2" : "transparent",
            "&:hover": { borderColor: "#fca5a5", color: "#ef4444" },
          }}
        >
          {liked ? (
            <FavoriteIcon sx={{ fontSize: 14 }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 14 }} />
          )}
        </IconButton>
      </div>
    </div>
  );
}
