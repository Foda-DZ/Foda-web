import { ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";

const PROMO_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80";

/**
 * A single clean promotional banner used to break up the product rails —
 * one message, one CTA, generous whitespace.
 */
export default function PromoStrip() {
  const navigate = useNavigate();
  const { tr, isRTL } = useLang();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900">
        <img
          src={PROMO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative flex flex-col items-start gap-4 px-8 py-12 sm:px-12 lg:py-16">
          <h2 className="max-w-md text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {tr.home.promoTitle}
          </h2>
          <p className="max-w-md text-sm font-light text-white/80 sm:text-base">
            {tr.home.promoSubtitle}
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="group mt-1 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors duration-200 hover:bg-neutral-200"
          >
            {tr.home.promoCta}
            <Arrow
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
