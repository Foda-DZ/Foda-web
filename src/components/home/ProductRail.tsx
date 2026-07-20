import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types";
import type { ApiProduct } from "../../types/api";
import { useLang } from "../../context/LangContext";
import { productsService } from "../../services/productsService";
import type { GetProductsParams } from "../../services/productsService";
import { apiProductToProduct } from "../../lib/mappers";
import ProductCard from "../ui/ProductCard";

interface ProductRailProps {
  title: string;
  /** Link the "See all" action navigates to. */
  seeAllTo: string;
  /**
   * How to fetch this rail's products. Defaults to the generic /products list
   * (optionally filtered by `params`); pass a dedicated section fetcher
   * (e.g. productsService.getTrending) for the curated home sections.
   */
  fetcher?: (limit: number) => Promise<ApiProduct[]>;
  /** Filter for the default fetcher (e.g. { mainCategory: "Men" }). */
  params?: GetProductsParams;
  /** How many products to show. */
  limit?: number;
  /** Mark cards with a "Trending" badge (for the analytics-driven section). */
  trending?: boolean;
}

function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] w-full rounded-lg bg-neutral-200" />
      <div className="space-y-2 pt-3">
        <div className="h-3 w-1/3 rounded bg-neutral-200" />
        <div className="h-3.5 w-3/4 rounded bg-neutral-200" />
        <div className="h-3.5 w-1/2 rounded bg-neutral-200" />
      </div>
    </div>
  );
}

/**
 * A clean, light product rail: left-aligned title, a "See all" link, and an
 * even grid of plain product cards. The core Zalando-style content block.
 */
export default function ProductRail({
  title,
  seeAllTo,
  fetcher,
  params,
  limit = 5,
  trending = false,
}: ProductRailProps) {
  const navigate = useNavigate();
  const { tr, isRTL } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    // Curated sections use their dedicated endpoint (server-filtered/sorted);
    // otherwise fall back to the generic list with optional filters.
    const request = fetcher
      ? fetcher(limit)
      : productsService.getAll(params);
    request
      .then((apiProducts) => {
        if (!alive) return;
        setProducts(apiProducts.map(apiProductToProduct));
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, JSON.stringify(params), limit]);

  if (!loading && products.length === 0) return null;

  const items = products.slice(0, limit);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 lg:px-12 lg:py-14">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
          {title}
        </h2>
        <button
          onClick={() => navigate(seeAllTo)}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-black hover:text-neutral-500"
        >
          {tr.home.seeAll}
          <Arrow
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
          />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
        {loading
          ? Array.from({ length: limit }).map((_, i) => <CardSkeleton key={i} />)
          : items.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 80} trending={trending} />
            ))}
      </div>
    </section>
  );
}
