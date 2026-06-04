import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";

const CATEGORY_ROUTES: Record<string, string> = {
  women: "/shop?category=Women",
  men: "/shop?category=Men",
  kids: "/shop?category=Kids",
  accessories: "/shop?category=Accessories",
};

interface CategoryData {
  key: "women" | "men" | "kids" | "accessories";
  image: string;
  number: string;
  accentColor: string;
  gridClass: string;
}

const CATEGORY_DATA: CategoryData[] = [
  {
    key: "women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
    number: "01",
    accentColor: "#722F37",
    gridClass: "md:col-span-2 md:row-span-2",
  },
  {
    key: "men",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80",
    number: "02",
    accentColor: "#0F3460",
    gridClass: "",
  },
  {
    key: "kids",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=700&q=80",
    number: "03",
    accentColor: "#C9A84C",
    gridClass: "",
  },
  {
    key: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80",
    number: "04",
    accentColor: "#1A1A2E",
    gridClass: "md:col-span-2",
  },
];

function CategoryCard({
  data,
  delay,
  onNavigate,
}: {
  data: CategoryData;
  delay: number;
  onNavigate: () => void;
}) {
  const { tr, isRTL } = useLang();
  const item = tr.categories.items[data.key];
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
      className={`${data.gridClass} relative overflow-hidden cursor-pointer group opacity-0-start ${
        visible ? "anim-fade-up" : ""
      }`}
      style={{ animationDelay: `${delay}ms`, minHeight: "260px" }}
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

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[260px] gap-2.5">
        {CATEGORY_DATA.map((cat, i) => (
          <CategoryCard
            key={cat.key}
            data={cat}
            delay={i * 100}
            onNavigate={() => navigate(CATEGORY_ROUTES[cat.key])}
          />
        ))}
      </div>
    </section>
  );
}
