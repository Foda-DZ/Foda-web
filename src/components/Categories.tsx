import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";

type CategoryKey =
  | "women"
  | "men"
  | "kids"
  | "accessories"
  | "sale"
  | "newArrivals";

const CATEGORY_ROUTES: Record<CategoryKey, string> = {
  women: "/shop?category=Women",
  men: "/shop?category=Men",
  kids: "/shop?category=Kids",
  accessories: "/shop?category=Accessories",
  sale: "/shop?sort=price-asc",
  newArrivals: "/shop?sort=newest",
};

// Canonical (English) sub-category keys used by the ?sub= filter on the Shop
// page. Index-aligned with the localized labels in tr.categories.subs.
const SUB_KEYS: Partial<Record<CategoryKey, string[]>> = {
  women: ["Dresses", "T-Shirts", "Shoes", "Bags"],
  men: ["Shirts", "Pants", "Jackets", "Shoes"],
  kids: ["T-Shirts", "Pants", "Jackets", "Shoes"],
  accessories: ["Bags", "Hats", "Shoes", "Other"],
};

interface CategoryData {
  key: CategoryKey;
  image: string;
  number: string;
  accentColor: string;
}

const CATEGORY_DATA: CategoryData[] = [
  {
    key: "women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
    number: "01",
    accentColor: "#722F37",
  },
  {
    key: "men",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80",
    number: "02",
    accentColor: "#0F3460",
  },
  {
    key: "kids",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=700&q=80",
    number: "03",
    accentColor: "#C9A84C",
  },
  {
    key: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80",
    number: "04",
    accentColor: "#1A1A2E",
  },
  {
    key: "newArrivals",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&q=80",
    number: "05",
    accentColor: "#C9A84C",
  },
  {
    key: "sale",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=80",
    number: "06",
    accentColor: "#722F37",
  },
];

function CategoryCard({
  data,
  delay,
  onNavigate,
  onNavigateSub,
}: {
  data: CategoryData;
  delay: number;
  onNavigate: () => void;
  onNavigateSub: (sub: string) => void;
}) {
  const { tr, isRTL } = useLang();
  const item = tr.categories.items[data.key];
  const subKeys = SUB_KEYS[data.key];
  const subLabels =
    data.key in tr.categories.subs
      ? tr.categories.subs[data.key as keyof typeof tr.categories.subs]
      : undefined;
  const isSpecial = data.key === "sale" || data.key === "newArrivals";

  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative shrink-0 w-55 sm:w-auto sm:flex-1 snap-start rounded-2xl overflow-hidden cursor-pointer group opacity-0-start ${
        visible ? "anim-fade-up" : ""
      }`}
      style={{ animationDelay: `${delay}ms`, height: "380px" }}
    >
      {/* Background image */}
      <img
        src={data.image}
        alt={item.name}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
          hovered ? "scale-110" : "scale-100"
        }`}
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-[#1A1A2E]/40 group-hover:bg-[#1A1A2E]/25 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/90 via-[#1A1A2E]/20 to-transparent" />

      {/* Accent bar — left edge */}
      <div
        className={`absolute top-0 start-0 w-1 transition-all duration-500 ${
          hovered ? "h-full opacity-100" : "h-0 opacity-0"
        }`}
        style={{ backgroundColor: data.accentColor }}
      />

      {/* High-intent badge for Sale / New Arrivals */}
      {isSpecial && (
        <div className="absolute top-5 inset-e-5">
          <span
            className="rounded-full px-2.5 py-1 text-[9px] font-black tracking-[0.2em] uppercase text-white"
            style={{ backgroundColor: data.accentColor }}
          >
            {data.key === "sale" ? "%" : "★"}
          </span>
        </div>
      )}

      {/* Number tag — top start */}
      <div className="absolute top-5 start-5">
        <span className="font-display text-xs font-black text-white/30 tracking-widest">
          {data.number}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 inset-x-0 p-6 text-white">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-1"
          style={{ color: data.accentColor === "#C9A84C" ? "#C9A84C" : "rgba(201,168,76,0.75)" }}>
          {isRTL ? item.name : item.ar}
        </p>
        <h3 className="font-display text-2xl lg:text-3xl font-black leading-none mb-1.5 group-hover:text-[#C9A84C] transition-colors duration-300">
          {item.name}
        </h3>

        {/* Sub-category quick links — revealed on hover (demographic tiles only) */}
        {subKeys && subLabels && (
          <div
            className={`overflow-hidden transition-all duration-300 ${
              hovered ? "max-h-12 opacity-100 mb-2" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {subLabels.map((label, idx) => (
                <button
                  key={subKeys[idx]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateSub(subKeys[idx]);
                  }}
                  className="text-[11px] text-white/70 hover:text-gold transition-colors duration-200 border-b border-transparent hover:border-gold/60"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-white/45 text-xs">{item.count}</p>
          <div
            className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
              hovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 rtl:translate-x-2"
            }`}
          >
            <span className="text-[#C9A84C]">{tr.categories.shopNow}</span>
            <span className="text-[#C9A84C] rtl:rotate-180">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const navigate = useNavigate();
  const { tr } = useLang();

  return (
    <section id="collections" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-px gold-gradient" />
            <span className="text-[#C9A84C] text-[10px] font-bold tracking-[0.25em] uppercase">
              {tr.categories.browsBy}
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-[#1A1A2E] leading-none">
            {tr.categories.shopBy}{" "}
            <span className="gold-text">{tr.categories.category}</span>
          </h2>
        </div>
        <p className="text-[#1A1A2E]/45 text-sm font-light max-w-xs leading-relaxed">
          {tr.categories.subtitle}
        </p>
      </div>

      {/* Single horizontal row — scrolls on mobile, evenly fills the row on desktop */}
      <div className="flex sm:items-stretch gap-3 overflow-x-auto sm:overflow-visible pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none scrollbar-none">
        {CATEGORY_DATA.map((cat, i) => (
          <CategoryCard
            key={cat.key}
            data={cat}
            delay={i * 100}
            onNavigate={() => navigate(CATEGORY_ROUTES[cat.key])}
            onNavigateSub={(sub) =>
              navigate(`${CATEGORY_ROUTES[cat.key]}&sub=${encodeURIComponent(sub)}`)
            }
          />
        ))}
      </div>
    </section>
  );
}
