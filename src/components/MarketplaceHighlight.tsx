import { useRef, useEffect, useState } from "react";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";

// Static showcase tiles — replaced with real API data when /sellers/featured endpoint exists
const SELLER_TILES = [
  {
    id: "a",
    shopName: "Maison Lyna",
    tag: { en: "Women's Fashion", ar: "أزياء نسائية" },
    wilaya: "Alger",
    products: 84,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    logo: null,
  },
  {
    id: "b",
    shopName: "Atlas Wear",
    tag: { en: "Men's Collection", ar: "أزياء رجالية" },
    wilaya: "Oran",
    products: 62,
    image: "https://images.unsplash.com/photo-1556906781-9a412961a28b?w=600&q=80",
    logo: null,
  },
  {
    id: "c",
    shopName: "Djurdjura Kids",
    tag: { en: "Kids & Baby", ar: "ملابس أطفال" },
    wilaya: "Tizi Ouzou",
    products: 47,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
    logo: null,
  },
  {
    id: "d",
    shopName: "Sahara Luxe",
    tag: { en: "Accessories", ar: "إكسسوارات" },
    wilaya: "Constantine",
    products: 130,
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&q=80",
    logo: null,
  },
];

const STATS = [
  {
    icon: StorefrontOutlinedIcon,
    value: "500+",
    en: "Active Sellers",
    ar: "بائع نشط",
  },
  {
    icon: GroupsOutlinedIcon,
    value: "50K+",
    en: "Happy Buyers",
    ar: "مشتري سعيد",
  },
  {
    icon: TrendingUpIcon,
    value: "58",
    en: "Wilayas Covered",
    ar: "ولاية مغطاة",
  },
  {
    icon: DiamondOutlinedIcon,
    value: "100%",
    en: "Verified Stores",
    ar: "متاجر موثقة",
  },
];

function SellerCard({
  seller,
  delay,
  visible,
}: {
  seller: (typeof SELLER_TILES)[0];
  delay: number;
  visible: boolean;
}) {
  const navigate = useNavigate();
  const { isRTL } = useLang();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl cursor-pointer opacity-0-start ${
        visible ? "anim-fade-up" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/sellers/${seller.id}`)}
    >
      {/* Cover image */}
      <div className="relative h-64 overflow-hidden bg-[#1A1A2E]">
        <img
          src={seller.image}
          alt={seller.shopName}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            hovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/30 to-transparent" />

        {/* Verified badge */}
        <div className="absolute top-3 end-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-2.5 py-1 flex items-center gap-1.5">
          <VerifiedIcon sx={{ fontSize: 11, color: "#C9A84C" }} />
          <span className="text-white text-[10px] font-bold tracking-wide">
            {isRTL ? "موثق" : "Verified"}
          </span>
        </div>

        {/* Category tag */}
        <div className="absolute top-3 start-3">
          <span className="bg-[#C9A84C]/90 text-[#1A1A2E] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
            {isRTL ? seller.tag.ar : seller.tag.en}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#1A1A2E] p-4 border-t border-white/5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-white font-display font-bold text-base leading-tight group-hover:text-[#C9A84C] transition-colors duration-300">
              {seller.shopName}
            </h3>
            <p className="text-white/40 text-xs mt-0.5">{seller.wilaya}</p>
          </div>
          <div className="shrink-0 text-end">
            <p className="text-[#C9A84C] font-bold text-sm">{seller.products}</p>
            <p className="text-white/35 text-[10px] uppercase tracking-wide">
              {isRTL ? "منتج" : "Products"}
            </p>
          </div>
        </div>

        <div
          className={`mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          {isRTL ? "زيارة المتجر" : "Visit Store"}
          <ArrowForwardIcon sx={{ fontSize: 11 }} className="rtl:rotate-180" />
        </div>
      </div>
    </div>
  );
}

export default function MarketplaceHighlight() {
  const { isRTL } = useLang();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#1A1A2E] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div
            className={`opacity-0-start ${visible ? "anim-fade-left" : ""}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px gold-gradient" />
              <span className="text-[#C9A84C] text-[10px] font-bold tracking-[0.25em] uppercase">
                {isRTL ? "سوق المصممين" : "The Marketplace"}
              </span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-none">
              {isRTL ? (
                <>
                  اكتشف{" "}
                  <span className="gold-text">أفضل البائعين</span>
                  <br />
                  في الجزائر
                </>
              ) : (
                <>
                  Discover Algeria's
                  <br />
                  <span className="gold-text">Top Fashion Sellers</span>
                </>
              )}
            </h2>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className={`btn-outline-gold flex items-center gap-2 self-start lg:self-auto shrink-0 opacity-0-start ${
              visible ? "anim-fade-right" : ""
            }`}
          >
            {isRTL ? "تصفح جميع المتاجر" : "Browse All Stores"}
            <ArrowForwardIcon sx={{ fontSize: 14 }} className="rtl:rotate-180" />
          </button>
        </div>

        {/* Stats row */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 opacity-0-start ${
            visible ? "anim-fade-up delay-100" : ""
          }`}
        >
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="glass rounded-xl p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center shrink-0">
                  <Icon sx={{ fontSize: 18, color: "#1A1A2E" }} />
                </div>
                <div>
                  <p className="font-display text-2xl font-black text-white leading-none">
                    {s.value}
                  </p>
                  <p className="text-white/45 text-xs mt-0.5 leading-tight">
                    {isRTL ? s.ar : s.en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Seller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SELLER_TILES.map((seller, i) => (
            <SellerCard
              key={seller.id}
              seller={seller}
              delay={i * 100}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
