import { useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { useLang } from "../context/LangContext";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";
import ProductCard from "./ui/ProductCard";

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-[#E8E2D9] aspect-[3/4] w-full" />
      <div className="pt-4 space-y-2">
        <div className="h-3 bg-[#E8E2D9] rounded w-1/3" />
        <div className="h-5 bg-[#E8E2D9] rounded w-3/4" />
        <div className="h-4 bg-[#E8E2D9] rounded w-1/2" />
      </div>
    </div>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const { tr } = useLang();

  const FILTERS = [
    { key: "All",         label: tr.products.all },
    { key: "Women",       label: tr.products.women },
    { key: "Men",         label: tr.products.men },
    { key: "Kids",        label: tr.products.kids },
  ];

  const [activeFilter, setActiveFilter] = useState("All");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsService
      .getAll()
      .then((apiProducts) => setAllProducts(apiProducts.map(apiProductToProduct)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = allProducts.slice(0, 4);
  const displayed =
    activeFilter === "All"
      ? featured
      : featured.filter((p) => p.category === activeFilter);

  return (
    <section id="arrivals" className="py-24 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase">
              {tr.products.handpicked}
            </span>
            <div className="divider-gold" style={{ margin: "0.75rem 0" }} />
            <h2 className="font-display text-5xl lg:text-6xl font-bold text-[#1A1A2E]">
              {tr.products.trending}
              <br />
              <span className="gold-text">{tr.products.thisSeason}</span>
            </h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                  activeFilter === key
                    ? "gold-gradient text-[#1A1A2E]"
                    : "border border-[#1A1A2E]/20 text-[#1A1A2E]/60 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : (displayed.length > 0 ? displayed : featured).map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  delay={i * 120}
                />
              ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={() => navigate("/shop")}
            className="btn-dark px-12 flex items-center gap-2 mx-auto group"
          >
            {tr.products.viewAll.replace("{count}", String(allProducts.length))}
            <ArrowForwardIcon
              sx={{ fontSize: 16 }}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
