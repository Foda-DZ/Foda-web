import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { useLang } from "../context/LangContext";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";
import ProductCard from "./ui/ProductCard";

type Gender = "Men" | "Women";

const GRID_COUNT = 4;

interface Theme {
  /** Background of the whole section */
  bg: string;
  /** Mood panel gradient */
  panel: string;
  /** Accent colour for eyebrow / lines */
  accent: string;
  /** Editorial mood image */
  image: string;
  /** Which side the mood panel sits on (LTR). Grid takes the other side. */
  panelSide: "start" | "end";
}

const THEMES: Record<Gender, Theme> = {
  Men: {
    bg: "#0F1419",
    panel: "linear-gradient(150deg, #16213E 0%, #0F3460 60%, #0d0d16 100%)",
    accent: "#5B8DEF",
    image:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1000&q=85",
    panelSide: "start",
  },
  Women: {
    bg: "#1A1016",
    panel: "linear-gradient(150deg, #3A1C28 0%, #722F37 55%, #1A1016 100%)",
    accent: "#E8A0B0",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=85",
    panelSide: "end",
  },
};

// ─── Skeletons ────────────────────────────────────────────────────────────────
function GridSkeleton() {
  return (
    <>
      {Array.from({ length: GRID_COUNT }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] w-full rounded-xl bg-white/5" />
          <div className="space-y-2 pt-4">
            <div className="h-2.5 w-1/3 rounded bg-white/5" />
            <div className="h-4 w-3/4 rounded bg-white/5" />
            <div className="h-3.5 w-1/2 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function GenderShowcase({ gender }: { gender: Gender }) {
  const navigate = useNavigate();
  const { tr, isRTL } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = THEMES[gender];
  const copy = gender === "Men" ? tr.genderShowcase.men : tr.genderShowcase.women;
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const shopUrl = `/shop?category=${gender}`;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    productsService
      .getAll({ mainCategory: gender })
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
  }, [gender]);

  // Nothing to show and not loading → hide the whole section.
  if (!loading && products.length === 0) return null;

  const grid = products.slice(0, GRID_COUNT);
  // Small stacked previews shown inside the mood panel.
  const previews = products.slice(0, 3);

  // Panel sits start/end depending on gender for a mirrored, editorial rhythm.
  const panelOrderClass =
    theme.panelSide === "start" ? "lg:order-1" : "lg:order-2";
  const gridOrderClass =
    theme.panelSide === "start" ? "lg:order-2" : "lg:order-1";

  return (
    <section
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ backgroundColor: theme.bg }}
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={copy.eyebrow}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* ── Mood / editorial panel ─────────────────────────────────────── */}
        <div
          className={`relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-3xl p-8 lg:col-span-5 lg:p-10 ${panelOrderClass}`}
          style={{ background: theme.panel }}
        >
          {/* Mood image */}
          <img
            src={theme.image}
            alt={copy.title}
            className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-luminosity"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${theme.bg} 0%, transparent 55%, transparent 100%)`,
            }}
          />

          {/* Content */}
          <div className="relative">
            <div className="mb-5 flex items-center gap-3">
              <span
                className="h-px w-8 shrink-0"
                style={{ backgroundColor: theme.accent }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.28em]"
                style={{ color: theme.accent }}
              >
                {copy.eyebrow}
              </span>
            </div>

            <h2 className="font-display text-4xl font-black leading-none text-white lg:text-5xl">
              {copy.title}
            </h2>

            <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-white/55">
              {copy.subtitle}
            </p>

            {/* Stacked product previews */}
            {previews.length > 0 && (
              <div className="mt-7 flex items-center gap-3">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {previews.map(
                    (p) =>
                      p.images[0] && (
                        <button
                          key={p.id}
                          onClick={() => navigate(`/products/${p.id}`)}
                          aria-label={p.name}
                          className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/20 transition-transform duration-200 hover:z-10 hover:scale-110"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ),
                  )}
                </div>
                <span className="text-xs font-medium text-white/45">
                  {products.length}+ {tr.genderShowcase.pieces}
                </span>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={() => navigate(shopUrl)}
              className="group mt-8 inline-flex w-fit items-center gap-2.5 rounded-full px-7 py-3.5 text-[11px] font-bold uppercase tracking-widest text-charcoal shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ backgroundColor: "#fff" }}
            >
              {copy.cta}
              <Arrow
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* ── Product grid ───────────────────────────────────────────────── */}
        <div className={`lg:col-span-7 ${gridOrderClass}`}>
          <div className="grid h-full grid-cols-2 gap-4 lg:gap-5">
            {loading ? (
              <GridSkeleton />
            ) : (
              grid.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 100} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
