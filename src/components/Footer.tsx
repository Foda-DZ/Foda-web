import {
  Instagram,
  Facebook,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Smartphone,
} from "lucide-react";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import fodaLogo from "../assets/Foda-Logo (1).png";

function TikTokIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const socials = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: TikTokIcon, label: "TikTok", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  const navigate = useNavigate();
  const { tr } = useLang();

  const footerSections = [
    {
      title: tr.footer.shopTitle,
      links: tr.footer.shopLinks,
      // Routes match the order of tr.footer.shopLinks:
      // New Arrivals, Women's, Men's, Kids, Accessories, Sale
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
      title: tr.footer.companyTitle,
      links: tr.footer.companyLinks,
      routes: null,
    },
    { title: tr.footer.helpTitle, links: tr.footer.helpLinks, routes: null },
  ];

  const contactItems = [
    { Icon: MapPin, text: tr.footer.address },
    { Icon: Phone, text: tr.footer.phone },
    { Icon: Mail, text: tr.footer.email },
  ];

  const policyLinks = [
    { label: tr.footer.privacy },
    { label: tr.footer.terms },
    { label: tr.footer.cookies },
  ];

  return (
    <footer className="dark-gradient text-white relative overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="py-20 grid grid-cols-1 lg:grid-cols-5 gap-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src={fodaLogo}
                alt="FODA"
                className="h-20 w-auto object-contain [filter:invert(1)_hue-rotate(180deg)]"
              />
            </div>
            <p className="text-white/50 font-light leading-relaxed mb-8 max-w-sm text-sm">
              {tr.footer.tagline}
            </p>
            <div className="space-y-3 mb-8">
              {contactItems.map(({ Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon
                    size={15}
                    className="text-[#C9A84C] mt-0.5 flex-shrink-0"
                  />
                  <span className="text-white/45 text-sm">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 hover:scale-110"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerSections.map(({ title, links, routes }) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-4 h-px gold-gradient" /> {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link, i) => (
                  <li key={link}>
                    {routes ? (
                      <button
                        onClick={() => navigate(routes[i])}
                        className="text-white/40 text-sm hover:text-[#C9A84C] transition-colors duration-200 flex items-center gap-1.5 group"
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
                        className="text-white/40 text-sm hover:text-[#C9A84C] transition-colors duration-200 flex items-center gap-1.5 group"
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
        <div className="py-10 border-t border-white/8">
          <div className="max-w-xl mx-auto bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shrink-0">
              <QrCode2Icon sx={{ fontSize: 38 }} className="text-[#1A1A2E]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Smartphone size={16} className="text-[#C9A84C]" />
                <p className="text-white font-semibold text-sm truncate">
                  {tr.footer.app.title}
                </p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-2 py-0.5 rounded-full">
                  Coming soon
                </span>
              </div>
              <p className="text-white/45 text-xs leading-relaxed truncate">
                {tr.footer.app.subtitle}
              </p>
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
          <div className="flex items-center gap-6">
            {policyLinks.map(({ label }) => (
              <a
                key={label}
                href="#"
                className="text-white/30 text-xs hover:text-[#C9A84C] transition-colors duration-200"
              >
                {label}
              </a>
            ))}
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
