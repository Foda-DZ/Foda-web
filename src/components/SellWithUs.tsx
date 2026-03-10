import { useRef, useEffect, useState } from "react";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";

const STEPS = [
  {
    Icon: StorefrontIcon,
    key: "step1" as const,
    color: "#C9A84C",
  },
  {
    Icon: PeopleIcon,
    key: "step2" as const,
    color: "#C9A84C",
  },
  {
    Icon: DashboardIcon,
    key: "step3" as const,
    color: "#C9A84C",
  },
];

export default function SellWithUs() {
  const { tr } = useLang();
  const { openRegister } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

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

  const stats = [
    { value: tr.sellWithUs.stat1Value, label: tr.sellWithUs.stat1Label },
    { value: tr.sellWithUs.stat2Value, label: tr.sellWithUs.stat2Label },
    { value: tr.sellWithUs.stat3Value, label: tr.sellWithUs.stat3Label },
  ];

  const stepData = [
    { title: tr.sellWithUs.step1Title, sub: tr.sellWithUs.step1Sub },
    { title: tr.sellWithUs.step2Title, sub: tr.sellWithUs.step2Sub },
    { title: tr.sellWithUs.step3Title, sub: tr.sellWithUs.step3Sub },
  ];

  return (
    <section ref={ref} className="py-28 bg-[#F5F0E8] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#1A1A2E 1px, transparent 1px), linear-gradient(90deg, #1A1A2E 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-[#C9A84C]/6 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-16 opacity-0-start ${visible ? "anim-scale-in" : ""}`}
        >
          <span className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase">
            {tr.sellWithUs.tag}
          </span>
          <div
            className="divider-gold mx-auto"
            style={{ margin: "0.75rem auto", width: "3rem" }}
          />
          <h2 className="font-display text-5xl lg:text-6xl font-bold text-[#1A1A2E] leading-tight mb-4">
            {tr.sellWithUs.title1}
            <br />
            <span className="gold-text">{tr.sellWithUs.title2}</span>
          </h2>
          <p className="text-[#1A1A2E]/55 font-light text-lg max-w-2xl mx-auto">
            {tr.sellWithUs.subtitle}
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {STEPS.map(({ Icon, key }, i) => (
            <div
              key={key}
              className={`group relative bg-white border border-[#1A1A2E]/8 p-8 hover:border-[#C9A84C]/40 hover:shadow-lg transition-all duration-400 opacity-0-start ${visible ? `anim-fade-up delay-${(i + 1) * 100}` : ""}`}
            >
              {/* Step number */}
              <div className="absolute top-5 end-6 text-[#1A1A2E]/8 font-display text-5xl font-black select-none">
                0{i + 1}
              </div>

              <div className="w-14 h-14 gold-gradient flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon sx={{ fontSize: 26, color: "#1A1A2E" }} />
              </div>

              <h3 className="font-display text-xl font-bold text-[#1A1A2E] mb-3 group-hover:text-[#C9A84C] transition-colors duration-200">
                {stepData[i].title}
              </h3>
              <p className="text-[#1A1A2E]/55 text-sm font-light leading-relaxed">
                {stepData[i].sub}
              </p>

              {/* Gold accent line on hover */}
              <div className="absolute bottom-0 start-0 end-0 h-0.5 bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start" />
            </div>
          ))}
        </div>

        {/* Stats + CTA dark card */}
        <div
          className={`dark-gradient rounded-none overflow-hidden opacity-0-start ${visible ? "anim-fade-up delay-400" : ""}`}
        >
          <div className="absolute top-0 start-1/2 -translate-x-1/2 w-80 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />

          <div className="grid lg:grid-cols-2 items-center">
            {/* Stats side */}
            <div className="p-10 lg:p-14 border-b lg:border-b-0 lg:border-e border-white/8">
              <p className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-8">
                Platform at a Glance
              </p>
              <div className="grid grid-cols-3 gap-6">
                {stats.map((s, i) => (
                  <div key={i} className="text-center group">
                    <div className="gold-text font-display text-4xl font-black mb-1 group-hover:scale-105 transition-transform duration-300 inline-block">
                      {s.value}
                    </div>
                    <p className="text-white/45 text-xs tracking-wider uppercase leading-tight">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 space-y-3">
                {[
                  "No monthly fees — pay only on sales",
                  "Fast approval & onboarding",
                  "Dedicated seller support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircleIcon
                      sx={{ fontSize: 15, color: "#C9A84C", flexShrink: 0 }}
                    />
                    <span className="text-white/60 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA side */}
            <div className="p-10 lg:p-14 text-center lg:text-start relative">
              <div className="absolute top-0 start-0 end-0 lg:top-0 lg:start-0 lg:bottom-0 lg:end-auto w-full lg:w-px h-px lg:h-auto bg-white/8" />
              <h3 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Ready to grow
                <br />
                <span className="animated-gold-text">your brand?</span>
              </h3>
              <p className="text-white/50 font-light text-sm leading-relaxed mb-8 max-w-sm">
                Create your seller account for free and reach thousands of
                fashion shoppers across Algeria.
              </p>
              <button
                onClick={openRegister}
                className="btn-gold flex items-center gap-2 group w-full lg:w-auto justify-center lg:justify-start"
              >
                {tr.sellWithUs.cta}
                <ArrowForwardIcon
                  sx={{ fontSize: 16 }}
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
                />
              </button>
              <p className="text-white/30 text-xs mt-4">
                {tr.sellWithUs.ctaSub}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
