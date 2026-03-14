import { useState, useMemo, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TuneIcon from "@mui/icons-material/Tune";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Fuse from "fuse.js";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { categories } from "../data/products";
import type { Product } from "../types";
import Footer from "../components/Footer";
import { useLang } from "../context/LangContext";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";
import ProductCard from "../components/ui/ProductCard";
import FilterPanel, {
  defaultFilters,
  type Filters,
} from "../components/filters/FilterPanel";
import FilterChips from "../components/filters/FilterChips";
import Pagination from "../components/ui/Pagination";

type ViewMode = "grid" | "list";

const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
  const navigate = useNavigate();
  const { tr } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();

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
        setFetchError(
          err instanceof Error ? err.message : "Failed to load products.",
        ),
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
          setFetchError(
            err instanceof Error ? err.message : "Failed to load products.",
          );
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

  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("category") ?? "All",
  );
  const [sortBy, setSortBy] = useState(() => {
    const s = searchParams.get("sort");
    return s && ["featured", "newest", "price-asc", "price-desc"].includes(s)
      ? s
      : "featured";
  });
  const initialSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(initialSearch);
  const [view, setView] = useState<ViewMode>("grid");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
    const sort = searchParams.get("sort");
    if (
      sort &&
      ["featured", "newest", "price-asc", "price-desc"].includes(sort)
    ) {
      setSortBy(sort);
    }
    const s = searchParams.get("search");
    if (s) setSearch(s);
  }, [searchParams]);

  // Available filter options
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
    const order = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
    return Array.from(sizes).sort(
      (a, b) =>
        (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) -
        (order.indexOf(b) === -1 ? 99 : order.indexOf(b)),
    );
  }, [products]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => colors.add(c)));
    return Array.from(colors).sort();
  }, [products]);

  const availableSellers = useMemo(() => {
    const sellers = new Set<string>();
    products.forEach((p) => {
      if (p.sellerName) sellers.add(p.sellerName);
    });
    return Array.from(sellers).sort();
  }, [products]);

  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.price), 40000),
    [products],
  );

  // Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: [
          { name: "name", weight: 0.5 },
          { name: "category", weight: 0.25 },
          { name: "sellerName", weight: 0.15 },
          { name: "brand", weight: 0.1 },
        ],
        threshold: 0.4,
        minMatchCharLength: 2,
      }),
    [products],
  );

  // Apply all filters
  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "All")
      list = list.filter((p) => p.category === activeCategory);

    if (search.trim() && search.trim().length >= 2) {
      const fuseResults = fuse.search(search.trim());
      const matchedIds = new Set(fuseResults.map((r) => r.item.id));
      list = list.filter((p) => matchedIds.has(p.id));
      const scoreMap = new Map(
        fuseResults.map((r) => [r.item.id, r.score ?? 1]),
      );
      list.sort(
        (a, b) => (scoreMap.get(a.id) ?? 1) - (scoreMap.get(b.id) ?? 1),
      );
    }

    list = list.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );

    if (filters.sizes.length > 0)
      list = list.filter((p) => filters.sizes.some((s) => p.sizes.includes(s)));

    if (filters.colors.length > 0)
      list = list.filter((p) =>
        filters.colors.some((c) => p.colors.includes(c)),
      );

    if (filters.sellers.length > 0)
      list = list.filter(
        (p) => p.sellerName && filters.sellers.includes(p.sellerName),
      );

    if (filters.rating > 0)
      list = list.filter((p) => (p.rating ?? 0) >= filters.rating);

    if (filters.availability === "instock")
      list = list.filter((p) => p.stock > 0);

    if (!search.trim()) {
      switch (sortBy) {
        case "newest":
          list = list
            .filter((p) => p.isNew)
            .concat(list.filter((p) => !p.isNew));
          break;
        case "price-asc":
          list.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          list.sort((a, b) => b.price - a.price);
          break;
      }
    }

    return list;
  }, [activeCategory, search, sortBy, filters, products, fuse]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filtered, currentPage],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, search, sortBy, filters]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat === "All") params.delete("category");
    else params.set("category", cat);
    setSearchParams(params, { replace: true });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setShowSortMenu(false);
    const params = new URLSearchParams(searchParams);
    if (sort === "featured") params.delete("sort");
    else params.set("sort", sort);
    setSearchParams(params, { replace: true });
  };

  const activeFilterCount =
    (filters.priceRange[1] < maxPrice ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    filters.sellers.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.availability === "instock" ? 1 : 0);

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
            <ArrowBackIcon sx={{ fontSize: 15 }} className="rtl:rotate-180" />{" "}
            {tr.common.back}
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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="flex items-center border border-[#1A1A2E]/15 bg-white h-11">
              <SearchIcon
                sx={{ fontSize: 16, ml: 1.5, color: "rgba(26,26,46,0.3)" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tr.shop.searchPlaceholder}
                className="flex-1 px-2 py-2 text-sm bg-transparent outline-none text-[#1A1A2E] placeholder:text-[#1A1A2E]/30"
              />
              {search && (
                <IconButton
                  size="small"
                  onClick={() => setSearch("")}
                  sx={{ p: 0.3, mr: 0.5 }}
                >
                  <CloseIcon
                    sx={{ fontSize: 14, color: "rgba(26,26,46,0.35)" }}
                  />
                </IconButton>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden h-11 px-4 border border-[#1A1A2E]/15 flex items-center gap-2 text-sm font-medium text-[#1A1A2E]/60 hover:border-[#C9A84C]/50 transition-colors duration-200 relative"
            >
              <TuneIcon sx={{ fontSize: 15 }} /> Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -end-1.5 w-5 h-5 gold-gradient text-[#1A1A2E] text-[10px] font-black rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="h-11 px-4 border border-[#1A1A2E]/15 flex items-center gap-2 text-sm text-[#1A1A2E]/60 hover:border-[#C9A84C]/50 transition-colors duration-200 min-w-[150px] justify-between"
              >
                <span>
                  {sortOptions.find((s) => s.value === sortBy)?.label}
                </span>
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
                      onClick={() => handleSortChange(opt.value)}
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
              {(
                [
                  { id: "grid" as const, Icon: GridViewIcon },
                  { id: "list" as const, Icon: ViewListIcon },
                ] as const
              ).map(({ id, Icon }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`w-11 h-11 flex items-center justify-center transition-all duration-200 ${
                    view === id
                      ? "bg-[#1A1A2E] text-white"
                      : "text-[#1A1A2E]/40 hover:text-[#1A1A2E]"
                  }`}
                >
                  <Icon sx={{ fontSize: 15 }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {[tr.shop.all, ...categories].map((cat, idx) => {
            const catKey = idx === 0 ? "All" : categories[idx - 1];
            const isActive = activeCategory === catKey;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(catKey)}
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

        {/* Filter chips */}
        <FilterChips filters={filters} onChange={setFilters} />

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
              <IconButton
                size="small"
                onClick={() => setSearch("")}
                sx={{ ml: 0.5, p: 0.3 }}
              >
                <CloseIcon sx={{ fontSize: 12, color: "rgba(26,26,46,0.4)" }} />
              </IconButton>
            </p>
          )}
        </div>

        {/* Main content area */}
        <div className="flex gap-8">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            availableSizes={availableSizes}
            availableColors={availableColors}
            availableSellers={availableSellers}
            maxPrice={maxPrice}
            mobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          <div className="flex-1 min-w-0">
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
                    setFilters(defaultFilters);
                  }}
                  className="btn-gold"
                >
                  {tr.shop.clearFilters}
                </button>
              </div>
            ) : view === "grid" ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  {paginatedProducts.map((product) => (
                    <ListRow
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── List row ────────────────────────────────────────────────
function ListRow({
  product,
}: {
  product: Product;
}) {
  const { tr } = useLang();
  const navigate = useNavigate();
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className="flex gap-5 p-4 bg-white border border-[#1A1A2E]/8 hover:border-[#C9A84C]/30 transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="w-28 h-36 flex-shrink-0 overflow-hidden bg-[#F0EBE3] relative">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
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
        <h3 className="font-display font-bold text-[#1A1A2E] text-lg mt-0.5 group-hover:text-[#C9A84C] transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-[#1A1A2E] text-base">
            {product.price.toLocaleString()} {tr.common.dzd}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-[#1A1A2E]/30 line-through">
              {product.originalPrice.toLocaleString()} {tr.common.dzd}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
