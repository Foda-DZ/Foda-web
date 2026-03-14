import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CategoryIcon from "@mui/icons-material/Category";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import type { Product } from "../../types";

const RECENT_SEARCHES_KEY = "foda_recent_searches";
const MAX_RECENT = 6;

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  const recent = getRecentSearches().filter((s) => s !== term);
  recent.unshift(term);
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT)),
  );
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

interface SearchBarProps {
  products: Product[];
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function SearchBar({
  products,
  mobileOpen,
  onMobileClose,
}: SearchBarProps) {
  const navigate = useNavigate();
  const { tr } = useLang();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recentSearches, setRecentSearches] =
    useState<string[]>(getRecentSearches);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

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
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [products],
  );

  const results = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];
    return fuse.search(query.trim()).slice(0, 6);
  }, [fuse, query]);

  const categoryMatches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const cats = ["Women", "Men", "Kids", "Accessories"];
    return cats.filter((c) => c.toLowerCase().includes(q));
  }, [query]);

  const handleSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      saveRecentSearch(term.trim());
      setRecentSearches(getRecentSearches());
      setQuery("");
      setOpen(false);
      onMobileClose();
      navigate(`/shop?search=${encodeURIComponent(term.trim())}`);
    },
    [navigate, onMobileClose],
  );

  const handleProductClick = useCallback(
    (productId: string) => {
      setQuery("");
      setOpen(false);
      onMobileClose();
      navigate(`/product/${productId}`);
    },
    [navigate, onMobileClose],
  );

  const handleCategoryClick = useCallback(
    (category: string) => {
      setQuery("");
      setOpen(false);
      onMobileClose();
      navigate(`/shop?category=${category}`);
    },
    [navigate, onMobileClose],
  );

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus mobile input when overlay opens
  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setHighlightIdx(-1);
    }
  }, [mobileOpen]);

  // Keyboard navigation
  const totalItems =
    results.length +
    categoryMatches.length +
    (recentSearches.length > 0 && !query.trim() ? recentSearches.length : 0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev + 1) % Math.max(totalItems, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx(
        (prev) =>
          (prev - 1 + Math.max(totalItems, 1)) % Math.max(totalItems, 1),
      );
    } else if (e.key === "Enter") {
      if (highlightIdx >= 0 && highlightIdx < results.length) {
        handleProductClick(results[highlightIdx].item.id);
      } else if (
        highlightIdx >= results.length &&
        highlightIdx < results.length + categoryMatches.length
      ) {
        handleCategoryClick(categoryMatches[highlightIdx - results.length]);
      } else {
        handleSearch(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      onMobileClose();
      inputRef.current?.blur();
    }
  };

  const showDropdown =
    open && (query.trim().length >= 2 || recentSearches.length > 0);

  /* ── Shared dropdown content ─────────────────────────────────── */
  const dropdownContent = (mobile = false) => (
    <>
      {/* Recent searches (empty query) */}
      {!query.trim() && recentSearches.length > 0 && (
        <div className={mobile ? "p-4" : "p-3"}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A2E]/40">
              Recent Searches
            </p>
            <button
              onClick={() => {
                clearRecentSearches();
                setRecentSearches([]);
              }}
              className="text-[10px] text-[#C9A84C] hover:underline"
            >
              Clear
            </button>
          </div>
          {recentSearches.map((term, i) => (
            <button
              key={term}
              onClick={() => handleSearch(term)}
              className={`w-full flex items-center gap-2 px-2 py-2 text-sm text-[#1A1A2E]/70 hover:bg-[#FAF7F2] hover:text-[#C9A84C] transition-colors duration-150 rounded-lg ${
                highlightIdx === i ? "bg-[#FAF7F2] text-[#C9A84C]" : ""
              }`}
            >
              <HistoryIcon sx={{ fontSize: 14, opacity: 0.4 }} />
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Category suggestions */}
      {query.trim() && categoryMatches.length > 0 && (
        <div
          className={`${mobile ? "p-4" : "p-3"} border-b border-[#1A1A2E]/8`}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A2E]/40 mb-2">
            Categories
          </p>
          {categoryMatches.map((cat, i) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`w-full flex items-center gap-2 px-2 py-2 text-sm text-[#1A1A2E]/70 hover:bg-[#FAF7F2] hover:text-[#C9A84C] transition-colors duration-150 rounded-lg ${
                highlightIdx === results.length + i
                  ? "bg-[#FAF7F2] text-[#C9A84C]"
                  : ""
              }`}
            >
              <CategoryIcon sx={{ fontSize: 14, opacity: 0.4 }} />
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Product results */}
      {results.length > 0 && (
        <div className={mobile ? "p-4" : "p-3"}>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A2E]/40 mb-2">
            Products
          </p>
          {results.map((result, i) => (
            <button
              key={result.item.id}
              onClick={() => handleProductClick(result.item.id)}
              className={`w-full flex items-center gap-3 px-2 py-2 hover:bg-[#FAF7F2] transition-colors duration-150 rounded-lg ${
                highlightIdx === i ? "bg-[#FAF7F2]" : ""
              }`}
            >
              <div className="w-10 h-12 flex-shrink-0 bg-[#F0EBE3] overflow-hidden rounded-lg">
                <img
                  src={result.item.images[0]}
                  alt={result.item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-start flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A2E] truncate">
                  {result.item.name}
                </p>
                <p className="text-xs text-[#C9A84C] font-semibold">
                  {result.item.price.toLocaleString()} DZD
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {query.trim().length >= 2 &&
        results.length === 0 &&
        categoryMatches.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-sm text-[#1A1A2E]/40">No results found</p>
          </div>
        )}

      {/* Search all button */}
      {query.trim().length >= 2 && (
        <div className="border-t border-[#1A1A2E]/8 p-2">
          <button
            onClick={() => handleSearch(query)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-colors duration-150 rounded-lg"
          >
            <TrendingUpIcon sx={{ fontSize: 14 }} />
            Search all for &ldquo;{query}&rdquo;
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* ── Desktop search ────────────────────────────────────────── */}
      <div
        ref={wrapperRef}
        className="relative hidden lg:block w-full"
      >
        <div
          className={`flex items-center rounded-lg border transition-all duration-200 ${
            open
              ? "border-[#1A1A2E]/20 bg-white shadow-sm"
              : "border-[#1A1A2E]/10 bg-[#FAFAFA] hover:border-[#1A1A2E]/15"
          }`}
        >
          <SearchIcon
            sx={{ fontSize: 18 }}
            className="text-[#1A1A2E]/35 shrink-0 ms-3"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightIdx(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={tr.nav.searchPlaceholder}
            className="w-full px-2.5 py-2 text-sm bg-transparent outline-none text-[#1A1A2E] placeholder:text-[#1A1A2E]/35"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setHighlightIdx(-1);
              }}
              className="shrink-0 me-2.5 p-0.5 text-[#1A1A2E]/30 hover:text-[#1A1A2E]/60 transition-colors"
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </button>
          )}
        </div>

        {/* Desktop dropdown */}
        {showDropdown && (
          <div className="absolute top-full start-0 end-0 mt-1.5 bg-white rounded-xl border border-[#1A1A2E]/8 shadow-lg z-50 max-h-[420px] overflow-y-auto">
            {dropdownContent(false)}
          </div>
        )}
      </div>

      {/* ── Mobile overlay (portal) ──────────────────────────────── */}
      {mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[60] bg-white lg:hidden">
            <div className="flex items-center gap-3 p-4 border-b border-[#1A1A2E]/10">
              <SearchIcon
                sx={{ fontSize: 18 }}
                className="text-[#1A1A2E]/40 shrink-0"
              />
              <input
                ref={mobileInputRef}
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlightIdx(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder={tr.nav.searchPlaceholder}
                className="flex-1 text-base text-[#1A1A2E] outline-none placeholder:text-[#1A1A2E]/30"
              />
              <button
                onClick={() => {
                  onMobileClose();
                  setQuery("");
                }}
                className="p-1.5 text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70 transition-colors"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-72px)]">
              {dropdownContent(true)}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
