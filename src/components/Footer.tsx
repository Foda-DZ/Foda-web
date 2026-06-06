import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Smartphone,
  Sparkles,
} from "lucide-react";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import fodaLogo from "../assets/Foda-Logo (1).png";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
  </svg>
);

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

  const socialLinks = [
    {
      label: tr.footer.social.instagram,
      href: "https://www.instagram.com/foda.dz",
      Icon: InstagramIcon,
      hoverColor: "hover:text-[#E1306C] hover:border-[#E1306C]/40 hover:bg-[#E1306C]/8",
    },
    {
      label: tr.footer.social.facebook,
      href: "https://www.facebook.com/foda.dz",
      Icon: FacebookIcon,
      hoverColor: "hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/8",
    },
    {
      label: tr.footer.social.tiktok,
      href: "https://www.tiktok.com/@foda.dz",
      Icon: TikTokIcon,
      hoverColor: "hover:text-white hover:border-white/30 hover:bg-white/8",
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

            {/* Social media */}
            <div className="mt-8">
              <p className="text-white/35 text-[10px] font-semibold tracking-widest uppercase mb-3">
                {tr.footer.social.followUs}
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ label, href, Icon, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={`group w-10 h-10 rounded-xl border border-white/12 bg-white/4 flex items-center justify-center text-white/40 transition-all duration-250 ${hoverColor} hover:scale-110 active:scale-95`}
                  >
                    <Icon className="w-4.5 h-4.5 transition-transform duration-250 group-hover:scale-110" />
                  </a>
                ))}
              </div>
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

        {/* ── Bottom Bar ─────────────────────────────────────────────── */}
        <div className="border-t border-white/8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* LEFT — legal links + copyright */}
            <div className="flex flex-col items-center lg:items-start gap-3">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2">
                {[
                  { label: tr.footer.privacy, action: () => navigate("/privacy") },
                  { label: tr.footer.terms,   action: () => navigate("/terms") },
                  { label: tr.footer.helpLinks[4] ?? "Contact", action: () => (window.location.href = `mailto:${tr.footer.email}`) },
                ].map(({ label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="text-white/40 text-xs hover:text-gold transition-colors duration-200"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-white/25 text-[11px]">
                {tr.footer.copyright.replace("{year}", String(new Date().getFullYear()))}
              </p>
            </div>

            {/* CENTER — App download */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shrink-0">
                <QrCode2Icon sx={{ fontSize: 36 }} className="text-charcoal" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-1 text-white/40 text-[10px] font-semibold tracking-widest uppercase">
                  <Sparkles size={10} className="text-gold" />
                  {tr.footer.app.title}
                </span>
                {/* App Store badge */}
                <a
                  href="#"
                  aria-label="Download on the App Store"
                  className="flex items-center gap-2 bg-white/8 border border-white/12 rounded-lg px-3 py-1.5 hover:bg-white/14 hover:border-white/20 transition-all duration-200 group"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="leading-tight">
                    <p className="text-white/35 text-[8px] font-medium">Download on the</p>
                    <p className="text-white/75 text-[11px] font-semibold">App Store</p>
                  </div>
                </a>
                {/* Google Play badge */}
                <a
                  href="#"
                  aria-label="Get it on Google Play"
                  className="flex items-center gap-2 bg-white/8 border border-white/12 rounded-lg px-3 py-1.5 hover:bg-white/14 hover:border-white/20 transition-all duration-200 group"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" aria-hidden="true">
                    <path d="M3.18 23.76c.3.17.64.24.99.2l12.99-7.5-2.87-2.87-11.11 10.17zM.44 1.06C.17 1.4 0 1.88 0 2.49v19.04c0 .61.17 1.09.44 1.43l.07.07 10.67-10.67v-.24L.5 1.06l-.06-.0zM20.49 10.37l-2.78-1.6-3.19 3.19 3.19 3.19 2.8-1.62c.8-.46.8-1.2-.02-1.66zM3.18.26l12.99 7.5-2.87 2.87L2.19.46c.3-.37.69-.38.99-.2z" />
                  </svg>
                  <div className="leading-tight">
                    <p className="text-white/35 text-[8px] font-medium">Get it on</p>
                    <p className="text-white/75 text-[11px] font-semibold">Google Play</p>
                  </div>
                </a>
              </div>
            </div>

            {/* RIGHT — social icons */}
            <div className="flex flex-col items-center lg:items-end gap-3">
              <p className="text-white/40 text-xs font-medium">{tr.footer.social.followUs}</p>
              <div className="flex items-center gap-2.5">
                {socialLinks.map(({ label, href, Icon, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={`group w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/50 transition-all duration-200 ${hoverColor} hover:scale-110 active:scale-95`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {["Visa", "MC", "Baridimob", "CIB"].map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 border border-white/10 text-white/25 text-[10px] font-bold tracking-wider rounded"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}
