import { useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { useLang } from "../context/LangContext";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";
import ProductCard from "./ui/ProductCard";

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-[#E8E2D9] aspect-3/4 w-full rounded-lg" />
      <div className="pt-4 space-y-2">
        <div className="h-3 bg-[#E8E2D9] rounded w-1/3" />
        <div className="h-5 bg-[#E8E2D9] rounded w-3/4" />
        <div className="h-4 bg-[#E8E2D9] rounded w-1/2" />
      </div>
    </div>
  );
}

function NewArrivalsTicker({ isRTL }: { isRTL: boolean }) {
  const items = isRTL
    ? ["وصل حديثاً ✦", "أحدث الموضة ✦", "تصاميم جديدة ✦", "كولكشن خاص ✦", "اكتشف الجديد ✦"]
    : ["New Arrivals ✦", "Fresh Drops ✦", "Just In ✦", "New Season ✦", "Latest Styles ✦"];
  const repeated = [...items, ...items];

  return (
    <div className="overflow-hidden bg-gold py-2.5 mb-12 -mx-6 lg:-mx-12 px-0 relative">
      <div
        className="flex gap-10 whitespace-nowrap animate-marquee"
        style={{ animationDirection: isRTL ? "reverse" : "normal" }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="text-charcoal text-xs font-black tracking-[0.2em] uppercase shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const { tr, isRTL } = useLang();

  const FILTERS = [
    { key: "All",   label: tr.products.all },
    { key: "Women", label: tr.products.women },
    { key: "Men",   label: tr.products.men },
    { key: "Kids",  label: tr.products.kids },
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
    <section id="arrivals" className="py-24 bg-[#F5F0E8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <WhatshotIcon sx={{ fontSize: 14 }} className="text-gold" />
              <span className="text-[#C9A84C] text-[10px] font-bold tracking-[0.25em] uppercase">
                {tr.products.handpicked}
              </span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-charcoal leading-none">
              {tr.products.trending}
              <br />
              <span className="gold-text">{tr.products.thisSeason}</span>
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-5 py-2 text-[10px] font-bold tracking-widest uppercase rounded-full transition-all duration-200 ${
                  activeFilter === key
                    ? "gold-gradient text-charcoal shadow-md"
                    : "bg-white border border-charcoal/12 text-charcoal/55 hover:border-gold/60 hover:text-gold"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ticker */}
      <NewArrivalsTicker isRTL={isRTL} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : (displayed.length > 0 ? displayed : featured).map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 120} />
              ))}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-14">
          <button
            onClick={() => navigate("/shop")}
            className="btn-dark px-12 flex items-center gap-2 mx-auto group"
          >
            {tr.products.viewAll.replace("{count}", String(allProducts.length))}
            <ArrowForwardIcon
              sx={{ fontSize: 16 }}
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
