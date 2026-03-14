import { useEffect, useRef, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorefrontIcon from "@mui/icons-material/Storefront";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";

interface HeroSlide {
  id: number;
  tag: string;
  title: string[];
  subtitle: string;
  cta: string;
  ctaSecondary: string;
  accent: string;
  bg: string;
  image: string;
  stat1: { value: string; label: string };
  stat2: { value: string; label: string };
  stat3: { value: string; label: string };
}

export default function Hero() {
  const navigate = useNavigate();
  const { tr } = useLang();
  const { openRegister } = useAuth();
  const [current, setCurrent] = useState(0);
  const [animClass, setAnimClass] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      tag: tr.hero.slide1.badge,
      title: [tr.hero.slide1.line1, tr.hero.slide1.line2, tr.hero.slide1.line3],
      subtitle: tr.hero.slide1.subtitle,
      cta: tr.hero.slide1.cta1,
      ctaSecondary: tr.hero.slide1.cta2,
      accent: "#C9A84C",
      bg: "from-[#1A1A2E] via-[#16213E] to-[#0F3460]",
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
      stat1: { value: "500+", label: tr.hero.slide1.statDesigners },
      stat2: { value: "50K+", label: tr.hero.slide1.statClients },
      stat3: { value: "48hrs", label: tr.hero.slide1.statDelivery },
    },
    {
      id: 2,
      tag: tr.hero.slide2.badge,
      title: [tr.hero.slide2.line1, tr.hero.slide2.line2, tr.hero.slide2.line3],
      subtitle: tr.hero.slide2.subtitle,
      cta: tr.hero.slide2.cta1,
      ctaSecondary: tr.hero.slide2.cta2,
      accent: "#C9A84C",
      bg: "from-[#0F3460] via-[#16213E] to-[#1A1A2E]",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      stat1: { value: "500+", label: tr.hero.slide2.statSellers },
      stat2: { value: "58", label: tr.hero.slide2.statWilayas },
      stat3: { value: "48hrs", label: tr.hero.slide2.statPayout },
    },
  ];

  const goTo = (idx: number) => {
    setAnimClass("opacity-0 translate-y-4");
    setTimeout(() => {
      setCurrent(idx);
      setAnimClass("opacity-100 translate-y-0");
    }, 400);
  };

  useEffect(() => {
    setAnimClass("opacity-100 translate-y-0");
    intervalRef.current = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % heroSlides.length;
        goTo(next);
        return c;
      });
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const slide = heroSlides[current];

  return (
    <section
      className={`relative min-h-screen bg-gradient-to-br ${slide.bg} overflow-hidden transition-all duration-1000`}
    >
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt="hero"
          className="w-full h-full object-cover object-top opacity-25 transition-opacity duration-1000"
          key={slide.id}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A2E]/90 via-[#1A1A2E]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-transparent to-transparent" />
      </div>

      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#C9A84C]/10 blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/3 w-60 h-60 rounded-full bg-[#722F37]/15 blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <div className="absolute top-20 right-10 lg:right-32 w-64 h-64 lg:w-96 lg:h-96 opacity-20">
        <div className="w-full h-full border border-[#C9A84C]/40 rounded-full animate-spin-slow" />
        <div
          className="absolute inset-4 border border-[#C9A84C]/20 rounded-full animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "15s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-48 pb-24 flex flex-col lg:flex-row items-center gap-16 min-h-screen">
        <div className={`flex-1 transition-all duration-500 ${animClass}`}>
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-px gold-gradient" />
            <span className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase">
              {slide.tag}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-none mb-6">
            {slide.title.map((line, i) => (
              <span
                key={i}
                className={`block ${i === 1 ? "animated-gold-text" : ""}`}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="text-white/60 text-lg font-light leading-relaxed mb-10 max-w-lg">
            {slide.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 mb-16">
            <button
              onClick={() => current === 1 ? openRegister() : navigate("/shop")}
              className="btn-gold flex items-center gap-2 group"
            >
              {slide.cta}{" "}
              <ArrowForwardIcon
                sx={{ fontSize: 16 }}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <button
              onClick={() => current === 1 ? navigate("/shop") : navigate("/shop")}
              className="btn-outline-gold flex items-center gap-2"
            >
              {current === 1
                ? <StorefrontIcon sx={{ fontSize: 14 }} />
                : <NewReleasesIcon sx={{ fontSize: 14 }} />
              }
              {slide.ctaSecondary}
            </button>
          </div>
          <div className="flex gap-6 sm:gap-10">
            {[slide.stat1, slide.stat2, slide.stat3].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="gold-text font-display text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="text-white/50 text-xs tracking-wider uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-end">
          <div className="relative">
            <div className="relative w-72 lg:w-80 h-96 lg:h-[480px] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={slide.image}
                alt="featured"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/80 via-transparent to-transparent" />
              {current === 0 && (
                <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <NewReleasesIcon sx={{ fontSize: 12, color: "#C9A84C" }} />
                  <span className="text-white text-xs font-semibold">New Drop</span>
                </div>
              )}
              {current === 1 && (
                <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <StorefrontIcon sx={{ fontSize: 12, color: "#C9A84C" }} />
                  <span className="text-white text-xs font-semibold">500+ Sellers</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {current === 0 ? (
                  <>
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                      {tr.hero.slide1.featuredLabel}
                    </p>
                    <p className="text-white font-display font-bold text-lg">
                      {tr.hero.slide1.featuredName}
                    </p>
                    <p className="gold-text font-bold text-xl mt-1">
                      {tr.hero.slide1.featuredPrice}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                      Seller Spotlight
                    </p>
                    <p className="text-white font-display font-bold text-lg">
                      Grow Your Brand
                    </p>
                    <p className="gold-text font-bold text-sm mt-1">
                      Join Algeria's #1 Fashion Market
                    </p>
                  </>
                )}
              </div>
            </div>
            {current === 0 ? (
              <div className="absolute -bottom-6 -left-10 glass rounded-xl p-4 flex items-center gap-3 shadow-xl border border-white/10 animate-float">
                <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center text-[#1A1A2E] font-bold text-xs">
                  {tr.hero.slide1.featuredBadge}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">
                    {tr.hero.slide1.newBadge}
                  </p>
                  <p className="text-white/50 text-xs">{tr.hero.slide1.newSub}</p>
                </div>
              </div>
            ) : (
              <div className="absolute -bottom-6 -left-10 glass rounded-xl p-4 flex items-center gap-3 shadow-xl border border-white/10 animate-float">
                <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center text-[#1A1A2E]">
                  <StorefrontIcon sx={{ fontSize: 18 }} />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Free to Join</p>
                  <p className="text-white/50 text-xs">Start selling in minutes</p>
                </div>
              </div>
            )}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-[#C9A84C]/50 rounded-tr-2xl" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? "w-8 h-2 gold-gradient" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF7F2] to-transparent" />
    </section>
  );
}
