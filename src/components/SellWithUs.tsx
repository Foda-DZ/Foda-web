import { useRef, useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BoltIcon from "@mui/icons-material/Bolt";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";

type SubscriptionPlan = {
  id: "basic" | "pro" | "brand";
  icon: typeof BoltIcon;
  accent: string;
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  price: { en: string; ar: string };
  period: { en: string; ar: string };
  highlight?: { en: string; ar: string };
  features: Array<{ en: string; ar: string }>;
  cta: { en: string; ar: string };
};

// TODO: Replace placeholder plans below with final pricing data when provided.
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    icon: BoltIcon,
    accent: "#C9A84C",
    title: { en: "Basic", ar: "أساسي" },
    subtitle: {
      en: "Best for new sellers starting out",
      ar: "مناسب للبائعين الجدد",
    },
    price: { en: "Custom Price", ar: "سعر مخصص" },
    period: { en: "per month", ar: "شهرياً" },
    features: [
      { en: "Store profile & product listing", ar: "ملف متجر وإدراج المنتجات" },
      { en: "Order management dashboard", ar: "لوحة إدارة الطلبات" },
      { en: "Marketplace visibility", ar: "ظهور داخل السوق" },
    ],
    cta: { en: "Choose Basic", ar: "اختر الأساسي" },
  },
  {
    id: "pro",
    icon: WorkspacePremiumIcon,
    accent: "#E8C96B",
    title: { en: "Pro", ar: "احترافي" },
    subtitle: {
      en: "For growing stores that need more reach",
      ar: "للمتاجر المتنامية التي تحتاج انتشاراً أكبر",
    },
    price: { en: "Custom Price", ar: "سعر مخصص" },
    period: { en: "per month", ar: "شهرياً" },
    highlight: { en: "Most Popular", ar: "الأكثر اختياراً" },
    features: [
      { en: "Everything in Basic", ar: "كل ما في الخطة الأساسية" },
      { en: "Priority placement opportunities", ar: "فرص ظهور أولوية" },
      { en: "Advanced performance insights", ar: "تحليلات أداء متقدمة" },
      { en: "Priority seller support", ar: "دعم بائعين بأولوية" },
    ],
    cta: { en: "Choose Pro", ar: "اختر الاحترافي" },
  },
  {
    id: "brand",
    icon: BusinessCenterIcon,
    accent: "#A07830",
    title: { en: "Brand", ar: "براند" },
    subtitle: {
      en: "For established brands and teams",
      ar: "للعلامات التجارية والفرق المتقدمة",
    },
    price: { en: "Custom Price", ar: "سعر مخصص" },
    period: { en: "per month", ar: "شهرياً" },
    features: [
      { en: "Everything in Pro", ar: "كل ما في الخطة الاحترافية" },
      { en: "Dedicated account onboarding", ar: "تأهيل خاص للحساب" },
      { en: "Campaign & growth support", ar: "دعم الحملات والنمو" },
      {
        en: "Brand-focused storefront options",
        ar: "خيارات متجر مخصصة للعلامة",
      },
    ],
    cta: { en: "Contact Sales", ar: "تواصل مع المبيعات" },
  },
];

export default function SellWithUs() {
  const { tr } = useLang();
  const { openLogin } = useAuth();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isArabic = tr.dir === "rtl";

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
    <section
      ref={ref}
      className="relative overflow-hidden bg-cream py-24 lg:py-28"
    >
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#1A1A2E 1px, transparent 1px), linear-gradient(90deg, #1A1A2E 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-0 inset-e-0 w-125 h-125 bg-gold/6 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div
          className={`text-center mb-16 opacity-0-start ${visible ? "anim-scale-in" : ""}`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-gold shadow-sm">
            {isArabic ? "خطط الاشتراك" : "Subscription Plans"}
          </span>
          <div
            className="divider-gold mx-auto"
            style={{ margin: "0.75rem auto", width: "3rem" }}
          />
          <h2 className="font-display text-4xl lg:text-6xl font-bold text-charcoal leading-tight mb-4">
            {isArabic ? "اختر الخطة المناسبة" : "Choose Your Growth"}
            <br />
            <span className="gold-text">
              {isArabic ? "لمتجرك" : "Subscription Plan"}
            </span>
          </h2>
          <p className="text-charcoal/55 font-light text-base lg:text-lg max-w-2xl mx-auto">
            {isArabic
              ? "جهزنا 3 باقات احترافية: أساسي، احترافي، وبراند. سنقوم بتحديث الأسعار والتفاصيل النهائية فور تزويدنا بها."
              : "We prepared 3 professional plans: Basic, Pro, and Brand. Final pricing and details can be dropped in as soon as you share them."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {SUBSCRIPTION_PLANS.map((plan, i) => {
            const Icon = plan.icon;
            const isPro = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className={`group relative overflow-hidden border p-8 transition-all duration-400 opacity-0-start ${
                  isPro
                    ? "bg-charcoal border-gold/45 shadow-[0_20px_50px_rgba(26,26,46,0.25)]"
                    : "bg-white border-charcoal/8 hover:border-gold/40 hover:shadow-lg"
                } ${visible ? `anim-fade-up delay-${(i + 1) * 100}` : ""}`}
              >
                {plan.highlight && (
                  <span className="absolute top-4 inset-e-4 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-charcoal">
                    {isArabic ? plan.highlight.ar : plan.highlight.en}
                  </span>
                )}

                <div className="w-14 h-14 gold-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon sx={{ fontSize: 24 }} />
                </div>

                <h3
                  className={`font-display text-2xl font-bold mb-1 transition-colors duration-200 ${
                    isPro
                      ? "text-white group-hover:text-gold"
                      : "text-charcoal group-hover:text-gold"
                  }`}
                >
                  {isArabic ? plan.title.ar : plan.title.en}
                </h3>

                <p
                  className={`text-sm font-light mb-6 ${isPro ? "text-white/65" : "text-charcoal/55"}`}
                >
                  {isArabic ? plan.subtitle.ar : plan.subtitle.en}
                </p>

                <div className="mb-6">
                  <div
                    className={`font-display text-4xl font-black ${isPro ? "text-white" : "text-charcoal"}`}
                  >
                    {isArabic ? plan.price.ar : plan.price.en}
                  </div>
                  <p
                    className={`text-xs tracking-widest uppercase mt-1 ${isPro ? "text-white/45" : "text-charcoal/35"}`}
                  >
                    {isArabic ? plan.period.ar : plan.period.en}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature.en} className="flex items-start gap-2.5">
                      <CheckCircleIcon
                        sx={{
                          fontSize: 16,
                          color: isPro ? undefined : plan.accent,
                          marginTop: "2px",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className={`text-sm leading-relaxed ${isPro ? "text-white/70" : "text-charcoal/65"}`}
                      >
                        {isArabic ? feature.ar : feature.en}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openLogin({ redirectTo: "/seller/dashboard" })}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    isPro
                      ? "bg-[#C9A84C] text-[#1A1A2E] hover:brightness-105"
                      : "border border-[#1A1A2E]/20 text-[#1A1A2E] hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  }`}
                >
                  {isArabic ? plan.cta.ar : plan.cta.en}
                  <ArrowForwardIcon
                    sx={{ fontSize: 14 }}
                    className="rtl:rotate-180"
                  />
                </button>

                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
