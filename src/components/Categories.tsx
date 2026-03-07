import { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
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
  color: string;
  span: string;
}

const CATEGORY_DATA: CategoryData[] = [
  {
    key: "women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    color: "from-[#722F37]/80",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    key: "men",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    color: "from-[#0F3460]/80",
    span: "",
  },
  {
    key: "kids",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80",
    color: "from-[#C9A84C]/80",
    span: "",
  },
  {
    key: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    color: "from-[#1A1A2E]/80",
    span: "lg:col-span-2",
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
      onClick={onNavigate}
      className={`${data.span} relative overflow-hidden cursor-pointer group card-lift opacity-0-start transition-all duration-700 ${visible ? "anim-fade-up" : ""}`}
      style={{ animationDelay: `${delay}ms`, minHeight: "220px" }}
    >
      <img
        src={data.image}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t ${data.color} to-transparent`}
      />
      <div className="absolute inset-0 bg-[#1A1A2E]/20 group-hover:bg-[#1A1A2E]/10 transition-colors duration-300" />
      <div className="absolute bottom-0 start-0 end-0 p-6 text-white">
        {/* Show the opposite script as accent — the bilingual flavour */}
        <p className="text-[#C9A84C] text-xs tracking-widest mb-1">
          {isRTL ? item.name : item.ar}
        </p>
        <h3 className="font-display text-2xl lg:text-3xl font-bold mb-1">
          {item.name}
        </h3>
        <p className="text-white/60 text-sm mb-4">{item.count}</p>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white/80 group-hover:text-[#C9A84C] transition-colors duration-300">
          {tr.categories.shopNow}
          <ArrowRight
            size={12}
            className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
          />
        </div>
      </div>
      <div className="absolute top-0 end-0 w-12 h-12 overflow-hidden">
        <div className="absolute top-0 end-0 w-0 h-0 border-s-[48px] border-s-transparent border-t-[48px] border-t-[#C9A84C]/60 transition-all duration-300 group-hover:border-t-[#C9A84C]" />
      </div>
    </div>
  );
}

export default function Categories() {
  const navigate = useNavigate();
  const { tr } = useLang();

  return (
    <section id="collections" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase">
          {tr.categories.browsBy}
        </span>
        <div className="divider-gold" />
        <h2 className="font-display text-5xl lg:text-6xl font-bold text-[#1A1A2E] mt-2">
          {tr.categories.shopBy}
          <br />
          <span className="gold-text">{tr.categories.category}</span>
        </h2>
        <p className="text-[#1A1A2E]/50 mt-4 font-light max-w-md mx-auto">
          {tr.categories.subtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]">
        {CATEGORY_DATA.map((cat, i) => (
          <CategoryCard key={cat.key} data={cat} delay={i * 150} onNavigate={() => navigate(CATEGORY_ROUTES[cat.key])} />
        ))}
      </div>
    </section>
  );
}
