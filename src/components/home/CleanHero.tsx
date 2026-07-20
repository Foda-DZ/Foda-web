import { ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import heroImage from "../../assets/new-hero.png";

/**
 * Clean, Zalando-style hero: one full-width banner, a short headline, and a
 * single primary CTA. No carousels, glows, or stat blocks — product-first.
 */
export default function CleanHero() {
  const navigate = useNavigate();
  const { tr, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-white">
      <div className="relative mx-auto max-w-[1600px]">
        <div className="relative h-[480px] w-full overflow-hidden sm:h-[560px] lg:h-[640px]">
          <img
            src={heroImage}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover object-center ${
              isRTL ? "-scale-x-100" : ""
            }`}
          />
          {/* Soft light-to-transparent gradient so dark text stays readable
              over the image's own cream tones, on the empty side of the shot */}
          <div
            className={`absolute inset-0 ${
              isRTL
                ? "bg-gradient-to-l from-[#FAF3E7] via-[#FAF3E7]/75 to-transparent"
                : "bg-gradient-to-r from-[#FAF3E7] via-[#FAF3E7]/75 to-transparent"
            }`}
          />

          <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-12">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
                {tr.home.heroTitle}
              </h1>
              <p className="mt-5 max-w-md text-base font-light leading-relaxed text-charcoal/70 sm:text-lg">
                {tr.home.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate("/shop")}
                  className="group inline-flex items-center gap-2 rounded-full bg-charcoal px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-black"
                >
                  {tr.home.heroCta}
                  <Arrow
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                  />
                </button>
                <button
                  onClick={() => navigate("/shop?sort=newest")}
                  className="text-sm font-semibold text-charcoal underline-offset-4 hover:underline"
                >
                  {tr.home.heroCtaSecondary}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
