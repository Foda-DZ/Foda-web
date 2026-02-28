import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import fodaLogo from "../assets/Foda-Logo (1).png";

const socials = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Twitter, label: "Twitter / X", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
];

export default function Footer() {
  const navigate = useNavigate();
  const { tr } = useLang();

  const footerSections = [
    {
      title: tr.footer.shopTitle,
      links: tr.footer.shopLinks,
      // Routes match the order of tr.footer.shopLinks:
      // New Arrivals, Women's, Men's, Traditional, Accessories, Sale
      routes: [
        "/shop?sort=newest",
        "/shop?category=Women",
        "/shop?category=Men",
        "/shop",
        "/shop?category=Accessories",
        "/shop",
      ],
    },
    { title: tr.footer.companyTitle, links: tr.footer.companyLinks, routes: null },
    { title: tr.footer.helpTitle,    links: tr.footer.helpLinks,    routes: null },
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

        <div className="py-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            {tr.footer.copyright.replace("{year}", String(new Date().getFullYear()))}
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
