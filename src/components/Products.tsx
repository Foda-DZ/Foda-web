import { useRef, useEffect, useState } from "react";
import { Heart, ShoppingBag, Star, Eye, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products as allProducts } from "../data/products";
import type { Product } from "../types";
import { useLang } from "../context/LangContext";

const featured = allProducts.slice(0, 4);

interface ProductCardProps {
  product: Product;
  delay: number;
  onViewDetail: (p: Product) => void;
}

function ProductCard({ product, delay, onViewDetail }: ProductCardProps) {
  const { tr } = useLang();
  const [liked, setLiked] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group card-lift opacity-0-start ${visible ? "anim-fade-up" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="relative overflow-hidden bg-[#F0EBE3] aspect-[3/4] card-img-zoom cursor-pointer"
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className={`absolute top-3 end-3 w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 ${liked ? "bg-red-500 text-white" : "glass text-white"}`}
        >
          <Heart size={14} className={liked ? "fill-current" : ""} />
        </button>
        <div className="absolute inset-0 bg-[#1A1A2E]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(product);
            }}
            className="glass text-white text-xs font-semibold px-4 py-2.5 flex items-center gap-2 hover:bg-white/20 transition-colors duration-200"
          >
            <Eye size={13} /> {tr.products.quickView}
          </button>
        </div>
      </div>
      <div className="pt-4 pb-2">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-[#C9A84C] text-[#C9A84C]"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-[#1A1A2E]/50">({product.reviews})</span>
        </div>
        <p className="text-[#1A1A2E]/50 text-xs tracking-widest uppercase mb-1">
          {product.brand}
        </p>
        <h3
          className="font-display font-bold text-[#1A1A2E] text-lg leading-tight mb-2 cursor-pointer hover:text-[#C9A84C] transition-colors duration-200"
          onClick={() => onViewDetail(product)}
        >
          {product.name}
        </h3>
        <div className="flex gap-1.5 mb-3">
          {product.colors.map((c) => (
            <button
              key={c.name}
              title={c.name}
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-transform duration-200"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1A2E] text-lg">
              {product.price.toLocaleString()}{" "}
              <span className="text-sm font-normal">{tr.common.dzd}</span>
            </span>
            {product.originalPrice && (
              <span className="text-[#1A1A2E]/40 text-sm line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={() => onViewDetail(product)}
            className="w-9 h-9 flex items-center justify-center border border-[#1A1A2E]/20 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
            title={tr.products.viewAndAdd}
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProductsProps {
  onViewDetail: (product: Product) => void;
}

export default function Products({ onViewDetail }: ProductsProps) {
  const navigate = useNavigate();
  const { tr } = useLang();

  const FILTERS = [
    { key: "All", label: tr.products.all },
    { key: "Women", label: tr.products.women },
    { key: "Men", label: tr.products.men },
    { key: "Traditional", label: tr.products.traditional },
  ];

  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {(filtered.length > 0 ? filtered : featured).map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              delay={i * 120}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={() => navigate("/shop")}
            className="btn-dark px-12 flex items-center gap-2 mx-auto group"
          >
            {tr.products.viewAll.replace("{count}", String(allProducts.length))}
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
