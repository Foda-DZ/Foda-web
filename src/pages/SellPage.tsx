import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Store,
  TrendingUp,
  LayoutDashboard,
  Rocket,
  ArrowRight,
  Check,
  Star,
  Quote,
  X,
} from "lucide-react";
import { useLang } from "../context/LangContext";
import SellerAuthForm from "../components/seller/SellerAuthForm";
import Footer from "../components/Footer";

const BENEFIT_ICONS = [TrendingUp, LayoutDashboard, Rocket];

// ─── Page ───────────────────────────────────────────────────────────────────
export default function SellPage() {
  const navigate = useNavigate();
  const { tr } = useLang();
  const s = tr.sell;
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = loginOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loginOpen]);

  const goRegister = () => navigate("/seller/auth");
  const scrollToPlans = () => {
    document
      .getElementById("plans")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const stats = [
    { value: s.statsReach, label: s.statsReachLabel },
    { value: s.statsFee, label: s.statsFeeLabel },
    { value: s.statsSetup, label: s.statsSetupLabel },
  ];

  return (
    <>
      <main className="bg-charcoal">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-24 inset-e-0 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -inset-s-24 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center flex flex-col items-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px gold-gradient" />
              <span className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase">
                {s.badge}
              </span>
              <span className="w-8 h-px gold-gradient" />
            </div>

            <h1 className="font-display text-4xl lg:text-6xl font-black text-white leading-[1.08] mb-5">
              {s.title}
            </h1>

            <p className="text-white/55 text-base lg:text-lg font-light leading-relaxed mb-9 max-w-xl">
              {s.subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-14">
              <button
                onClick={scrollToPlans}
                className="btn-gold flex items-center gap-2 group"
              >
                {s.ctaStart}
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
                />
              </button>
              <button
                onClick={() => setLoginOpen(true)}
                className="btn-outline-gold flex items-center gap-2"
              >
                {s.ctaHaveAccount}
              </button>
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 gap-8 lg:gap-14">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-black gold-text leading-none">
                    {stat.value}
                  </p>
                  <p className="text-white/45 text-[11px] mt-1.5 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Benefits ──────────────────────────────────────────────────── */}
        <section className="bg-cream">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid md:grid-cols-3 gap-6">
              {s.benefits.map((benefit, i) => {
                const Icon = BENEFIT_ICONS[i] ?? Store;
                return (
                  <div
                    key={benefit.title}
                    className="bg-white rounded-2xl border border-charcoal/8 p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center mb-5">
                      <Icon size={22} className="text-charcoal" />
                    </span>
                    <h3 className="font-display text-lg font-bold text-charcoal mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-charcoal/55 text-sm leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Subscription plans ────────────────────────────────────────── */}
        <section
          id="plans"
          className="bg-cream border-t border-charcoal/8 scroll-mt-4"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="w-8 h-px gold-gradient" />
                <span className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase">
                  {s.plans.badge}
                </span>
                <span className="w-8 h-px gold-gradient" />
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-black text-charcoal leading-tight mb-3">
                {s.plans.title}
              </h2>
              <p className="text-charcoal/55 text-sm font-light max-w-lg mx-auto">
                {s.plans.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-7 items-stretch max-w-5xl mx-auto">
              {s.plans.tiers.map((tier, i) => {
                const popular = i === 1;
                return (
                  <div
                    key={tier.name}
                    className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 ${
                      popular
                        ? "dark-gradient text-white shadow-2xl md:-translate-y-3 ring-1 ring-gold/40"
                        : "bg-white text-charcoal border border-charcoal/8 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    {popular && (
                      <span className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 gold-gradient text-charcoal text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                        <Star size={11} className="fill-charcoal" />
                        {s.plans.mostPopular}
                      </span>
                    )}

                    <h3
                      className={`font-display text-lg font-bold mb-1 ${popular ? "text-gold" : "text-charcoal"}`}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className={`text-xs mb-5 leading-relaxed ${popular ? "text-white/55" : "text-charcoal/50"}`}
                    >
                      {tier.tagline}
                    </p>

                    <div className="mb-1 flex items-end gap-1.5">
                      <span className="font-display text-3xl font-black leading-none">
                        {tier.price}
                      </span>
                      {tier.price !== "0 DZD" && tier.price !== "0 دج" && (
                        <span
                          className={`text-xs mb-0.5 ${popular ? "text-white/45" : "text-charcoal/45"}`}
                        >
                          {s.plans.perMonth}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] mb-6 ${popular ? "text-white/40" : "text-charcoal/40"}`}
                    >
                      {tier.priceNote}
                    </p>

                    <ul className="space-y-3 mb-7 flex-1">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <span
                            className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                              popular ? "gold-gradient" : "bg-gold/15"
                            }`}
                          >
                            <Check
                              size={11}
                              className={popular ? "text-charcoal" : "text-gold"}
                            />
                          </span>
                          <span
                            className={`text-sm leading-snug ${popular ? "text-white/75" : "text-charcoal/70"}`}
                          >
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={goRegister}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                        popular
                          ? "gold-gradient text-charcoal hover:brightness-105"
                          : "border border-charcoal/15 text-charcoal hover:border-gold hover:text-gold"
                      }`}
                    >
                      {s.plans.cta}
                      <ArrowRight size={15} className="rtl:rotate-180" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        <section className="relative bg-charcoal overflow-hidden">
          <div className="absolute -top-24 -inset-s-24 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="w-8 h-px gold-gradient" />
                <span className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase">
                  {s.testimonials.badge}
                </span>
                <span className="w-8 h-px gold-gradient" />
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
                {s.testimonials.title}
              </h2>
              <p className="text-white/50 text-sm font-light max-w-lg mx-auto">
                {s.testimonials.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {s.testimonials.items.map((t) => (
                <div
                  key={t.name}
                  className="glass rounded-2xl border border-white/8 p-7 flex flex-col"
                >
                  <Quote size={28} className="text-gold/60 mb-4 rtl:-scale-x-100" />
                  <p className="text-white/75 text-sm leading-relaxed flex-1">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-1 mt-5 mb-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={13}
                        className="fill-gold text-gold"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 gold-gradient rounded-full flex items-center justify-center text-charcoal text-xs font-black shrink-0">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-white font-semibold text-sm leading-tight">
                        {t.name}
                      </p>
                      <p className="text-white/40 text-xs">{t.shop}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* ── Seller login popup ──────────────────────────────────────────── */}
      {loginOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-center justify-center p-4"
            onClick={() => setLoginOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-none" />
            <div
              className="relative z-10 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLoginOpen(false)}
                aria-label="Close"
                className="absolute -top-3 inset-e-0 z-20 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white hover:rotate-90 transition-all duration-200"
              >
                <X size={15} />
              </button>
              <SellerAuthForm initialView="login" />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
