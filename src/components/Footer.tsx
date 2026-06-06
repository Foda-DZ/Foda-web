import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Smartphone,
  Sparkles,
} from "lucide-react";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import fodaLogo from "../assets/Foda-Logo (1).png";

export default function Footer() {
  const navigate = useNavigate();
  const { tr } = useLang();

  const footerSections = [
    {
      title: tr.footer.shopTitle,
      links: tr.footer.shopLinks,
      routes: [
        "/shop?sort=newest",
        "/shop?category=Women",
        "/shop?category=Men",
        "/shop?category=Kids",
        "/shop?category=Accessories",
        "/shop",
      ],
    },
    {
      title: tr.nav.myProfile,
      links: [tr.nav.myProfile, tr.wishlist.title, tr.cart.title, tr.nav.shop],
      routes: ["/profile", "/wishlist", "/cart", "/shop"],
    },
    {
      title: tr.footer.helpTitle,
      links: [
        tr.footer.helpLinks[0] ?? "FAQ",
        tr.footer.helpLinks[1] ?? "Shipping & Returns",
        tr.footer.helpLinks[4] ?? "Contact Us",
      ],
      actions: [
        () => navigate("/shop"),
        () => navigate("/checkout"),
        () => (window.location.href = `mailto:${tr.footer.email}`),
      ],
    },
  ];

  const contactItems = [
    { Icon: MapPin, text: tr.footer.address },
    { Icon: Phone, text: tr.footer.phone },
    { Icon: Mail, text: tr.footer.email },
  ];

  const quickActions = [
    {
      label: tr.nav.shopNow,
      action: () => navigate("/shop"),
    },
    {
      label: tr.sellWithUs.cta,
      action: () => navigate("/"),
    },
  ];

  return (
    <footer className="dark-gradient text-white relative overflow-hidden">
      <div className="h-px bg-linear-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src={fodaLogo}
                alt="FODA"
                className="h-20 w-auto object-contain filter-[invert(1)_hue-rotate(180deg)]"
              />
            </div>
            <p className="text-white/50 font-light leading-relaxed mb-8 max-w-sm text-sm">
              {tr.footer.tagline}
            </p>
            <div className="space-y-3 mb-8">
              {contactItems.map(({ Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon size={15} className="text-gold mt-0.5 shrink-0" />
                  <span className="text-white/45 text-sm">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((qa) => (
                <button
                  key={qa.label}
                  onClick={qa.action}
                  className="px-3 py-2 border border-white/12 text-white/70 text-[11px] font-semibold tracking-wider uppercase hover:border-gold hover:text-gold transition-colors"
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerSections.map(({ title, links, routes, actions }) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-4 h-px gold-gradient" /> {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link, i) => (
                  <li key={link}>
                    {routes || actions ? (
                      <button
                        onClick={() => {
                          if (routes?.[i]) {
                            navigate(routes[i]);
                            return;
                          }
                          actions?.[i]?.();
                        }}
                        className="text-white/40 text-sm hover:text-gold transition-colors duration-200 flex items-center gap-1.5 group"
                      >
                        <ArrowRight
                          size={11}
                          className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 rtl:rotate-180 rtl:translate-x-2 rtl:group-hover:translate-x-0"
                        />
                        {link}
                      </button>
                    ) : (
                      <a
                        href="#"
                        className="text-white/40 text-sm hover:text-gold transition-colors duration-200 flex items-center gap-1.5 group"
                      >
                        <ArrowRight
                          size={11}
                          className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 rtl:rotate-180 rtl:translate-x-2 rtl:group-hover:translate-x-0"
                        />
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Download App Section ─────────────────────────────────── */}
        <div className="py-8 border-t border-white/8">
          <div className="max-w-2xl mx-auto bg-white/4 border border-white/10 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 bg-white/95 rounded-xl flex items-center justify-center shrink-0">
                <QrCode2Icon sx={{ fontSize: 28 }} className="text-charcoal" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <Smartphone size={14} className="text-gold" />
                  {tr.footer.app.title}
                </p>
                <p className="text-white/45 text-xs truncate">
                  {tr.footer.app.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                <Sparkles size={10} />
                Coming Soon
              </span>
              <button
                onClick={() => navigate("/")}
                className="w-8 h-8 rounded-full border border-white/15 text-white/65 hover:text-gold hover:border-gold/40 transition-colors flex items-center justify-center"
                aria-label="Explore website"
              >
                <ArrowForwardIcon
                  sx={{ fontSize: 16 }}
                  className="rtl:rotate-180"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            {tr.footer.copyright.replace(
              "{year}",
              String(new Date().getFullYear()),
            )}
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/privacy")}
              className="text-white/35 text-xs hover:text-gold transition-colors duration-200"
            >
              {tr.footer.privacy}
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="text-white/35 text-xs hover:text-gold transition-colors duration-200"
            >
              {tr.footer.terms}
            </button>
            <button
              onClick={() =>
                (window.location.href = `mailto:${tr.footer.email}`)
              }
              className="text-white/35 text-xs hover:text-gold transition-colors duration-200"
            >
              {tr.footer.helpLinks[4] ?? "Contact"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            {["Visa", "MC", "Baridimob", "CIB"].map((p) => (
              <span
                key={p}
                className="px-2 py-1 border border-white/10 text-white/30 text-[10px] font-bold tracking-wider"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
