import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useSearchParams } from "react-router-dom";
import type { Product } from "../types";
import Footer from "../components/Footer";
import { useLang } from "../context/LangContext";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";
import ProductCard from "../components/ui/ProductCard";
import Pagination from "../components/ui/Pagination";
import {
  COLOR_HEX,
  SUB_CATEGORIES,
  defaultFilters,
  type Filters,
} from "../components/filters/FilterPanel";

const ITEMS_PER_PAGE = 24;

// Sub-category Arabic translations
const SUB_CAT_AR: Record<string, string> = {
  Shirts: "قمصان",
  Pants: "سراويل",
  Dresses: "فساتين",
  Shoes: "أحذية",
  Jackets: "جاكيتات",
  Hoodies: "هوديز",
  Jeans: "جينز",
  Shorts: "شورتات",
  "T-Shirts": "تيشيرتات",
  Sweaters: "كنزات",
  Coats: "معاطف",
  Bags: "حقائب",
  Hats: "قبعات",
  Other: "أخرى",
};

// ─── Single dropdown ─────────────────────────────────────────────────────────
function FilterDropdown({
  label,
  active,
  badge,
  onOpen,
  children,
}: {
  label: string;
  active: boolean;
  badge?: number;
  onOpen?: () => void;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  const handleToggle = () => {
    setOpen((o) => {
      if (!o && onOpen) onOpen();
      return !o;
    });
  };

  useEffect(() => {
    if (!open) return;
    let timer: ReturnType<typeof setTimeout>;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    timer = setTimeout(
      () => document.addEventListener("mousedown", handler),
      0,
    );
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={handleToggle}
        className={`h-10 px-4 flex items-center gap-1.5 border text-sm font-semibold transition-colors duration-150 whitespace-nowrap select-none ${
          active
            ? "border-charcoal bg-charcoal text-white"
            : open
              ? "border-charcoal/60 bg-white text-charcoal"
              : "border-charcoal/25 bg-white text-charcoal/70 hover:border-charcoal/55 hover:text-charcoal"
        }`}
      >
        {label}
        {badge != null && badge > 0 && (
          <span className="ms-0.5 min-w-4 h-4 px-0.5 rounded-full gold-gradient text-charcoal text-[9px] font-black flex items-center justify-center leading-none">
            {badge}
          </span>
        )}
        <KeyboardArrowDownIcon
          sx={{ fontSize: 15 }}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full inset-s-0 mt-0 z-50 bg-white border border-charcoal/15 shadow-xl overflow-hidden animate-dropdown">
          {children(close)}
        </div>
      )}
    </div>
  );
}

// ─── Price dual slider ────────────────────────────────────────────────────────
function PriceSlider({
  min,
  max,
  value,
  onChange,
  onSave,
  isRTL,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  onSave: () => void;
  isRTL: boolean;
}) {
  const snap = useCallback(
    (v: number) => Math.round(Math.max(min, Math.min(max, v)) / 500) * 500,
    [min, max],
  );
  const range = max - min || 1;
  const lowPct = ((value[0] - min) / range) * 100;
  const highPct = ((value[1] - min) / range) * 100;

  return (
    <div className="w-72">
      <div className="p-5">
        {/* Min / Max boxes */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 border border-charcoal/20 px-3 py-2.5">
            <p className="text-[9px] font-black tracking-widest uppercase text-charcoal/40 mb-0.5">
              {isRTL ? "أدنى" : "Min"}
            </p>
            <p className="text-sm font-bold text-charcoal tabular-nums">
              {value[0].toLocaleString()}
              <span className="text-[10px] font-normal text-charcoal/40 ms-0.5">
                DZD
              </span>
            </p>
          </div>
          <div className="w-4 h-px bg-charcoal/20 shrink-0" />
          <div className="flex-1 border border-charcoal/20 px-3 py-2.5">
            <p className="text-[9px] font-black tracking-widest uppercase text-charcoal/40 mb-0.5">
              {isRTL ? "أقصى" : "Max"}
            </p>
            <p className="text-sm font-bold text-charcoal tabular-nums">
              {value[1].toLocaleString()}
              <span className="text-[10px] font-normal text-charcoal/40 ms-0.5">
                DZD
              </span>
            </p>
          </div>
        </div>

        {/* Track */}
        <div className="relative h-5 flex items-center mb-3">
          <div className="w-full h-px bg-charcoal/15">
            <div
              className="absolute h-px bg-charcoal"
              style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={500}
            value={value[0]}
            onChange={(e) => {
              const v = snap(+e.target.value);
              if (v < value[1]) onChange([v, value[1]]);
            }}
            className="absolute w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: value[0] > max * 0.5 ? 5 : 3 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={500}
            value={value[1]}
            onChange={(e) => {
              const v = snap(+e.target.value);
              if (v > value[0]) onChange([value[0], v]);
            }}
            className="absolute w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: 4 }}
          />
          <div
            className="absolute w-4 h-4 bg-white border border-charcoal shadow-sm pointer-events-none"
            style={{ left: `calc(${lowPct}% - 8px)`, zIndex: 6 }}
          />
          <div
            className="absolute w-4 h-4 bg-white border border-charcoal shadow-sm pointer-events-none"
            style={{ left: `calc(${highPct}% - 8px)`, zIndex: 6 }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-charcoal/35 font-medium">
          <span>0 DZD</span>
          <span>{max.toLocaleString()} DZD</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex border-t border-charcoal/10">
        <button
          onClick={() => onChange([0, max])}
          className="flex-1 py-3 text-xs font-semibold text-charcoal/40 hover:text-charcoal transition-colors border-e border-charcoal/10"
        >
          {isRTL ? "مسح" : "Reset"}
        </button>
        <button
          onClick={onSave}
          className="flex-1 py-3 text-xs font-bold text-white bg-charcoal hover:bg-charcoal/85 transition-colors"
        >
          {isRTL ? "تطبيق" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-3/4 bg-[#EDEAE4]" />
      <div className="pt-3 space-y-2">
        <div className="h-2.5 bg-[#EDEAE4] rounded w-1/3" />
        <div className="h-3.5 bg-[#EDEAE4] rounded w-3/4" />
        <div className="h-3 bg-[#EDEAE4] rounded w-1/2" />
      </div>
    </div>
  );
}

// ─── Active chip ──────────────────────────────────────────────────────────────
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="group flex items-center gap-1.5 px-3 py-1.5 border border-charcoal/20 bg-white text-[11px] font-semibold text-charcoal/70 hover:border-red-300 hover:text-red-500 transition-all duration-150 capitalize"
    >
      {label}
      <CloseRoundedIcon
        sx={{ fontSize: 10 }}
        className="opacity-50 group-hover:opacity-100"
      />
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const { isRTL } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();

  const topRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerStuck, setHeaderStuck] = useState(false);

  // ── Data ──────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadProducts = useCallback(() => {
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
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productsService
      .getAll()
      .then((ap) => {
        if (!cancelled) setProducts(ap.map(apiProductToProduct));
      })
      .catch((err) => {
        if (!cancelled)
          setFetchError(err instanceof Error ? err.message : "Failed.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── State ─────────────────────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [mainCategory, setMainCategory] = useState(""); // Women / Men / Kids / Accessories
  const [searchTerm, setSearchTerm] = useState(""); // free-text search from the search bar
  const [currentPage, setCurrentPage] = useState(1);

  // Pending (uncommitted) filter selections — only applied when Save is clicked
  const [pendingSizes, setPendingSizes] = useState<string[]>([]);
  const [pendingColors, setPendingColors] = useState<string[]>([]);
  const [pendingPrice, setPendingPrice] = useState<[number, number] | null>(
    null,
  );

  // Sync filters that live in the URL (?sort= / ?category= / ?sub= / ?search=)
  useEffect(() => {
    const sort = searchParams.get("sort");
    if (
      sort &&
      ["featured", "newest", "price-asc", "price-desc"].includes(sort)
    )
      setSortBy(sort);
    else setSortBy("featured");

    setMainCategory(searchParams.get("category") ?? "");
    setSearchTerm(searchParams.get("search") ?? "");

    const sub = searchParams.get("sub") ?? "";
    setFilters((f) => (f.subCategory === sub ? f : { ...f, subCategory: sub }));
  }, [searchParams]);

  // Sticky header
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setHeaderStuck(!e.isIntersecting),
      { threshold: 1, rootMargin: "-1px 0px 0px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Real derived filter options ───────────────────────────────────────────
  const availableSizes = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.sizes.forEach((x) => s.add(x)));
    const order = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
    return Array.from(s).sort((a, b) => {
      const ai = order.indexOf(a),
        bi = order.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [products]);

  const availableColors = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) =>
      p.colors.forEach((c) => {
        if (c && c.trim()) s.add(c.trim().toLowerCase());
      }),
    );
    return Array.from(s).sort();
  }, [products]);

  const maxPrice = useMemo(
    () => (products.length ? Math.max(...products.map((p) => p.price)) : 40000),
    [products],
  );

  // Sync priceRange ceiling with real maxPrice once loaded
  useEffect(() => {
    if (!loading && products.length > 0) {
      setFilters((f) => ({
        ...f,
        priceRange: [f.priceRange[0], maxPrice],
      }));
    }
  }, [loading, maxPrice, products.length]);

  // ── Filtering & sorting ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...products];

    // Main category (Women / Men / Kids / Accessories) — maps to product.category
    if (mainCategory) {
      const mc = mainCategory.toLowerCase();
      list = list.filter((p) => (p.category ?? "").toLowerCase() === mc);
    }

    // Free-text search across name / brand / category / subCategory
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand ?? "").toLowerCase().includes(q) ||
          (p.category ?? "").toLowerCase().includes(q) ||
          (p.subCategory ?? "").toLowerCase().includes(q),
      );
    }

    if (filters.subCategory) {
      const sub = filters.subCategory.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(sub) ||
          (p.subCategory ?? "").toLowerCase().includes(sub) ||
          (p.description ?? "").toLowerCase().includes(sub),
      );
    }

    list = list.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );

    if (filters.sizes.length)
      list = list.filter((p) => filters.sizes.some((s) => p.sizes.includes(s)));

    if (filters.colors.length)
      list = list.filter((p) =>
        filters.colors.some((c) =>
          p.colors.map((x) => x.toLowerCase()).includes(c),
        ),
      );

    if (sortBy === "newest")
      list = list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew));
    else if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [sortBy, filters, products, mainCategory, searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filtered, currentPage],
  );
  useEffect(
    () => setCurrentPage(1),
    [sortBy, filters, mainCategory, searchTerm],
  );

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    const p = new URLSearchParams(searchParams);
    sort === "featured" ? p.delete("sort") : p.set("sort", sort);
    setSearchParams(p, { replace: true });
  };

  const clearAll = () => {
    setFilters({ ...defaultFilters, priceRange: [0, maxPrice] });
    setPendingSizes([]);
    setPendingColors([]);
    setPendingPrice(null);
  };

  const priceActive =
    filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice;
  const activeCount =
    (filters.subCategory ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    (priceActive ? 1 : 0);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
  };

  const sortLabels: Record<string, string> = {
    featured: isRTL ? "الأبرز" : "Featured",
    newest: isRTL ? "الأحدث" : "Newest first",
    "price-asc": isRTL ? "السعر: الأقل" : "Price: Low to High",
    "price-desc": isRTL ? "السعر: الأعلى" : "Price: High to Low",
  };

  // "Showing N results for X" suffix — reflects the active main category or search term
  const mainCatLabelAr: Record<string, string> = {
    Women: "نساء",
    Men: "رجال",
    Kids: "أطفال",
    Accessories: "إكسسوارات",
    Other: "أخرى",
  };
  const resultsContext = searchTerm.trim()
    ? isRTL
      ? ` لـ "${searchTerm.trim()}"`
      : ` for "${searchTerm.trim()}"`
    : mainCategory
      ? isRTL
        ? ` في ${mainCatLabelAr[mainCategory] ?? mainCategory}`
        : ` in ${mainCategory}`
      : "";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-15 bg-white">
      {/* Sticky-observer sentinel (Navbar already provides its own height spacer) */}
      <div ref={headerRef} className="h-px w-full" />

      {/* ── Sticky filter bar ── */}
      <div
        className={`sticky top-0 z-30 bg-white border-b transition-all duration-200 ${
          headerStuck ? "border-charcoal/15 shadow-sm" : "border-charcoal/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* No overflow clipping here — it would clip the open dropdown panels. */}
          <div className="flex items-center gap-2 py-2">
            {/* ── Sort by ── */}
            <FilterDropdown
              label={isRTL ? "الترتيب" : "Sort by"}
              active={sortBy !== "featured"}
            >
              {(close) => (
                <div className="min-w-52">
                  {Object.entries(sortLabels).map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        handleSortChange(val);
                        close();
                      }}
                      className={`w-full flex items-center justify-between px-5 py-3.5 text-sm border-b border-charcoal/8 last:border-0 transition-colors duration-100 ${
                        sortBy === val
                          ? "font-bold text-charcoal bg-charcoal/5"
                          : "text-charcoal/60 hover:bg-charcoal/3 hover:text-charcoal"
                      }`}
                    >
                      {lbl}
                      {sortBy === val && (
                        <CheckIcon sx={{ fontSize: 15, color: "#1A1A2E" }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </FilterDropdown>

            {/* ── Size ── */}
            <FilterDropdown
              label={isRTL ? "المقاس" : "Size"}
              active={filters.sizes.length > 0}
              badge={filters.sizes.length || undefined}
              onOpen={() => setPendingSizes(filters.sizes)}
            >
              {(close) => (
                <div className="min-w-52">
                  {loading ? (
                    <div className="p-4 space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-9 bg-charcoal/6 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : availableSizes.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-charcoal/40 italic">
                      {isRTL ? "لا توجد مقاسات" : "No sizes available"}
                    </p>
                  ) : (
                    <>
                      <div className="max-h-72 overflow-y-auto">
                        {availableSizes.map((size) => {
                          const sel = pendingSizes.includes(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() =>
                                setPendingSizes((prev) =>
                                  sel
                                    ? prev.filter((s) => s !== size)
                                    : [...prev, size],
                                )
                              }
                              className={`w-full flex items-center justify-between px-5 py-3.5 text-sm border-b border-charcoal/8 last:border-0 transition-colors duration-100 ${
                                sel
                                  ? "font-bold text-charcoal bg-charcoal/5"
                                  : "text-charcoal/60 hover:bg-charcoal/3 hover:text-charcoal"
                              }`}
                            >
                              {size}
                              {sel && (
                                <CheckIcon
                                  sx={{ fontSize: 15, color: "#1A1A2E" }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex border-t border-charcoal/10">
                        <button
                          type="button"
                          onClick={() => setPendingSizes([])}
                          className="flex-1 py-3 text-xs font-semibold text-charcoal/40 hover:text-charcoal transition-colors border-e border-charcoal/10"
                        >
                          {isRTL ? "مسح" : "Reset"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFilters((f) => ({ ...f, sizes: pendingSizes }));
                            close();
                          }}
                          className="flex-1 py-3 text-xs font-bold text-white bg-charcoal hover:bg-charcoal/85 transition-colors"
                        >
                          {isRTL ? "تطبيق" : "Save"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </FilterDropdown>

            {/* ── Colour ── */}
            <FilterDropdown
              label={isRTL ? "اللون" : "Colour"}
              active={filters.colors.length > 0}
              badge={filters.colors.length || undefined}
              onOpen={() => setPendingColors(filters.colors)}
            >
              {(close) => (
                <div className="min-w-52">
                  {loading ? (
                    <div className="p-4 space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-9 bg-charcoal/6 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : availableColors.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-charcoal/40 italic">
                      {isRTL ? "لا توجد ألوان" : "No colours available"}
                    </p>
                  ) : (
                    <>
                      <div className="max-h-72 overflow-y-auto">
                        {availableColors.map((color) => {
                          const hex = COLOR_HEX[color] ?? "#ccc";
                          const sel = pendingColors.includes(color);
                          const isLight = [
                            "white",
                            "ivory",
                            "cream",
                            "yellow",
                            "beige",
                          ].includes(color);
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() =>
                                setPendingColors((prev) =>
                                  sel
                                    ? prev.filter((c) => c !== color)
                                    : [...prev, color],
                                )
                              }
                              className={`w-full flex items-center gap-4 px-5 py-3 border-b border-charcoal/8 last:border-0 transition-colors duration-100 ${
                                sel ? "bg-charcoal/5" : "hover:bg-charcoal/3"
                              }`}
                            >
                              <span
                                className="w-6 h-6 shrink-0 flex items-center justify-center"
                                style={{
                                  backgroundColor: hex,
                                  outline: isLight
                                    ? "1px solid rgba(26,26,46,0.2)"
                                    : "none",
                                }}
                              >
                                {sel && (
                                  <CheckIcon
                                    sx={{ fontSize: 13 }}
                                    style={{
                                      color: isLight ? "#1A1A2E" : "#fff",
                                    }}
                                  />
                                )}
                              </span>
                              <span
                                className={`text-sm capitalize ${sel ? "font-bold text-charcoal" : "text-charcoal/65"}`}
                              >
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex border-t border-charcoal/10">
                        <button
                          type="button"
                          onClick={() => setPendingColors([])}
                          className="flex-1 py-3 text-xs font-semibold text-charcoal/40 hover:text-charcoal transition-colors border-e border-charcoal/10"
                        >
                          {isRTL ? "مسح" : "Reset"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFilters((f) => ({
                              ...f,
                              colors: pendingColors,
                            }));
                            close();
                          }}
                          className="flex-1 py-3 text-xs font-bold text-white bg-charcoal hover:bg-charcoal/85 transition-colors"
                        >
                          {isRTL ? "تطبيق" : "Save"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </FilterDropdown>

            {/* ── Price ── */}
            <FilterDropdown
              label={isRTL ? "السعر" : "Price"}
              active={priceActive}
              badge={priceActive ? 1 : undefined}
              onOpen={() => setPendingPrice(filters.priceRange)}
            >
              {(close) =>
                loading ? (
                  <div className="p-5 w-72 space-y-3">
                    <div className="h-12 bg-charcoal/6 animate-pulse" />
                    <div className="h-2 bg-charcoal/8 animate-pulse" />
                  </div>
                ) : (
                  <PriceSlider
                    min={0}
                    max={maxPrice}
                    value={pendingPrice ?? filters.priceRange}
                    onChange={(v) => setPendingPrice(v)}
                    onSave={() => {
                      setFilters((f) => ({
                        ...f,
                        priceRange: pendingPrice ?? f.priceRange,
                      }));
                      close();
                    }}
                    isRTL={isRTL}
                  />
                )
              }
            </FilterDropdown>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Clear all */}
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="h-10 px-4 shrink-0 flex items-center gap-1.5 border border-charcoal/20 text-sm font-semibold text-charcoal/55 hover:border-red-300 hover:text-red-500 transition-colors duration-150 whitespace-nowrap"
              >
                <CloseRoundedIcon sx={{ fontSize: 13 }} />
                {isRTL ? `مسح (${activeCount})` : `Clear (${activeCount})`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div ref={topRef} className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex gap-12">
          {/* ── Left: subcategory list — plain, no frame ── */}
          <aside className="hidden lg:block w-40 shrink-0">
            <p className="text-sm font-bold text-charcoal mb-4">
              {isRTL ? "الفئات" : "Categories"}
            </p>
            <ul className="space-y-0.5">
              {SUB_CATEGORIES.map((sub) => {
                const active = filters.subCategory === sub;
                const label = isRTL ? (SUB_CAT_AR[sub] ?? sub) : sub;
                return (
                  <li key={sub}>
                    <button
                      type="button"
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          subCategory: active ? "" : sub,
                        }))
                      }
                      className={`w-full text-start py-1.5 text-sm transition-colors duration-100 ${
                        active
                          ? "font-bold text-charcoal"
                          : "text-charcoal/50 hover:text-charcoal"
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ── Product grid ── */}
          <div className="flex-1 min-w-0">
            {/* ── Mobile sub-category chips (sidebar is hidden < lg) ── */}
            <div className="lg:hidden -mx-6 px-6 mb-5 flex gap-2 overflow-x-auto scrollbar-none">
              {SUB_CATEGORIES.map((sub) => {
                const active = filters.subCategory === sub;
                const label = isRTL ? (SUB_CAT_AR[sub] ?? sub) : sub;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        subCategory: active ? "" : sub,
                      }))
                    }
                    className={`shrink-0 px-3.5 py-1.5 text-[12px] font-semibold border transition-colors duration-150 whitespace-nowrap ${
                      active
                        ? "border-charcoal bg-charcoal text-white"
                        : "border-charcoal/20 bg-white text-charcoal/60 hover:border-charcoal/45 hover:text-charcoal"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* ── Results count ── */}
            {!loading && !fetchError && (
              <p className="text-[13px] text-charcoal/55 mb-4">
                {filtered.length === 0
                  ? isRTL
                    ? "لا توجد نتائج"
                    : "No results"
                  : isRTL
                    ? `عرض ${filtered.length} ${filtered.length === 1 ? "منتج" : "منتجات"}${resultsContext}`
                    : `Showing ${filtered.length} ${filtered.length === 1 ? "result" : "results"}${resultsContext}`}
              </p>
            )}

            {/* Active chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {filters.subCategory && (
                  <Chip
                    label={
                      isRTL
                        ? (SUB_CAT_AR[filters.subCategory] ??
                          filters.subCategory)
                        : filters.subCategory
                    }
                    onRemove={() =>
                      setFilters((f) => ({ ...f, subCategory: "" }))
                    }
                  />
                )}
                {filters.sizes.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    onRemove={() =>
                      setFilters((f) => ({
                        ...f,
                        sizes: f.sizes.filter((x) => x !== s),
                      }))
                    }
                  />
                ))}
                {filters.colors.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    onRemove={() =>
                      setFilters((f) => ({
                        ...f,
                        colors: f.colors.filter((x) => x !== c),
                      }))
                    }
                  />
                ))}
                {priceActive && (
                  <Chip
                    label={`${filters.priceRange[0].toLocaleString()} – ${filters.priceRange[1].toLocaleString()} DZD`}
                    onRemove={() =>
                      setFilters((f) => ({ ...f, priceRange: [0, maxPrice] }))
                    }
                  />
                )}
              </div>
            )}

            {/* States */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center gap-4 py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                  <ErrorOutlineIcon sx={{ fontSize: 28, color: "#f87171" }} />
                </div>
                <p className="text-charcoal/55 text-sm max-w-xs">
                  {fetchError}
                </p>
                <button onClick={loadProducts} className="btn-gold mt-1">
                  {isRTL ? "إعادة المحاولة" : "Retry"}
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-32 text-center">
                <div className="w-20 h-20 rounded-3xl bg-charcoal/5 flex items-center justify-center">
                  <SearchOffIcon
                    sx={{ fontSize: 32, color: "rgba(26,26,46,0.2)" }}
                  />
                </div>
                <p className="font-display text-2xl font-bold text-charcoal/30">
                  {isRTL ? "لا توجد منتجات" : "No products found"}
                </p>
                <p className="text-charcoal/40 text-sm max-w-xs">
                  {isRTL
                    ? "جرّب تغيير الفلاتر أو اختر فئة مختلفة"
                    : "Try adjusting your filters or selecting a different category"}
                </p>
                <button onClick={clearAll} className="btn-dark mt-1">
                  {isRTL ? "إزالة الفلاتر" : "Clear All Filters"}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
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
