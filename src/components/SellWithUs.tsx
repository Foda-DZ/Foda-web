import { useRef, useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";

const PERKS_EN = [
  "Free store setup — live in minutes",
  "Reach buyers across all 58 Algerian wilayas",
  "Powerful dashboard: orders, analytics & promotions",
  "Payouts within 48 hours, no hidden fees",
  "Dedicated seller support team",
];

const PERKS_AR = [
  "إنشاء متجر مجاني — ابدأ في دقائق",
  "تواصل مع مشترين في كل 58 ولاية جزائرية",
  "لوحة تحكم قوية: طلبات، تحليلات وعروض",
  "أرباح خلال 48 ساعة، بدون رسوم خفية",
  "فريق دعم مخصص للبائعين",
];

const METRICS = [
  { icon: StorefrontOutlinedIcon, value: "500+", en: "Active Sellers", ar: "بائع نشط" },
  { icon: GroupsOutlinedIcon,    value: "50K+", en: "Monthly Buyers", ar: "مشترٍ شهرياً" },
  { icon: TrendingUpIcon,        value: "48h",  en: "Payout Speed",   ar: "سرعة صرف الأرباح" },
];

export default function SellWithUs() {
  const { isRTL } = useLang();
  const { openLogin } = useAuth();
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

  const perks = isRTL ? PERKS_AR : PERKS_EN;

  return (
    <section ref={ref} className="bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 min-h-[600px]">

        {/* ── Left: image panel ─────────────────────────────────────────── */}
        <div
          className={`relative min-h-[360px] lg:min-h-0 overflow-hidden opacity-0-start ${
            visible ? "anim-fade-left" : ""
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=85"
            alt="Sell with Foda"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-e from-charcoal/70 via-charcoal/30 to-transparent lg:bg-gradient-to-r" />
          <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

          {/* Floating metrics */}
          <div className="absolute bottom-8 start-8 end-8 flex gap-3">
            {METRICS.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  className="glass flex-1 rounded-xl p-4 text-center"
                >
                  <Icon sx={{ fontSize: 18, color: "#C9A84C" }} />
                  <p className="font-display text-xl font-black text-white mt-1 leading-none">
                    {m.value}
                  </p>
                  <p className="text-white/45 text-[10px] mt-0.5 leading-tight">
                    {isRTL ? m.ar : m.en}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: copy panel ─────────────────────────────────────────── */}
        <div
          className={`flex flex-col justify-center px-8 lg:px-14 py-16 lg:py-20 opacity-0-start ${
            visible ? "anim-fade-right" : ""
          }`}
        >
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px gold-gradient" />
            <span className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase">
              {isRTL ? "بائع على فودا" : "Sell on Foda"}
            </span>
          </div>

          <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-[1.05] mb-5">
            {isRTL ? (
              <>
                حوّل شغفك
                <br />
                <span className="gold-text">إلى متجر ناجح</span>
              </>
            ) : (
              <>
                Turn Your Passion
                <br />
                <span className="gold-text">Into a Thriving Store</span>
              </>
            )}
          </h2>

          <p className="text-white/50 text-sm font-light leading-relaxed mb-8 max-w-sm">
            {isRTL
              ? "انضم إلى أكبر سوق أزياء في الجزائر وابدأ في البيع لآلاف المشترين عبر 58 ولاية — مجاناً."
              : "Join Algeria's largest fashion marketplace and start selling to thousands of buyers across 58 wilayas — for free."}
          </p>

          {/* Perks list */}
          <ul className="space-y-3 mb-10">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircleIcon sx={{ fontSize: 16, color: "#C9A84C", marginTop: "2px", flexShrink: 0 }} />
                <span className="text-white/65 text-sm leading-relaxed">{perk}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => openLogin({ redirectTo: "/seller/dashboard" })}
              className="btn-gold flex items-center gap-2 group"
            >
              {isRTL ? "ابدأ البيع مجاناً" : "Start Selling Free"}
              <ArrowForwardIcon
                sx={{ fontSize: 14 }}
                className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
              />
            </button>
            <button
              onClick={() => openLogin({ redirectTo: "/seller/dashboard" })}
              className="btn-outline-gold flex items-center gap-2"
            >
              {isRTL ? "تعرف على الخطط" : "View Plans"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
