import { useRef, useEffect, useState } from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { useLang } from "../context/LangContext";

const TRUST_ITEMS = [
  {
    icon: StorefrontOutlinedIcon,
    enLabel: "500+ Active Sellers",
    arLabel: "أكثر من 500 بائع نشط",
  },
  {
    icon: LocalShippingOutlinedIcon,
    enLabel: "Delivery to All 58 Wilayas",
    arLabel: "توصيل لكل 58 ولاية",
  },
  {
    icon: StarOutlinedIcon,
    enLabel: "4.8 / 5 Average Rating",
    arLabel: "تقييم متوسط 4.8 / 5",
  },
  {
    icon: VerifiedOutlinedIcon,
    enLabel: "100% Verified Sellers",
    arLabel: "بائعون موثقون 100%",
  },
  {
    icon: SupportAgentOutlinedIcon,
    enLabel: "7-Day Support",
    arLabel: "دعم 7 أيام",
  },
];

export default function TrustBar() {
  const { isRTL } = useLang();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-[#1A1A2E] border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
        <div className="flex flex-wrap justify-center lg:justify-between gap-6 lg:gap-0">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 opacity-0-start transition-all duration-500 ${
                  visible ? "anim-fade-up" : ""
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                  <Icon sx={{ fontSize: 16, color: "#C9A84C" }} />
                </div>
                <span className="text-white/70 text-xs font-medium tracking-wide whitespace-nowrap">
                  {isRTL ? item.arLabel : item.enLabel}
                </span>
                {i < TRUST_ITEMS.length - 1 && (
                  <div className="hidden lg:block w-px h-5 bg-white/10 ms-6" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
