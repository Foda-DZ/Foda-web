import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Package,
  Store,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import LanguageSwitch from "./LanguageSwitch";
import fodaLogo from "../assets/Foda-Logo (1).png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { totalItems, openCart } = useCart();
  const { user, openLogin, openRegister, logout } = useAuth();
  const { tr } = useLang();

  const navLinks = [
    {
      label: tr.nav.collections,
      href: "#collections",
      sub: [
        { label: tr.nav.women,       href: "/shop?category=Women" },
        { label: tr.nav.men,         href: "/shop?category=Men" },
        { label: tr.nav.kids,        href: "/shop?category=Kids" },
        { label: tr.nav.accessories, href: "/shop?category=Accessories" },
      ],
    },
    { label: tr.nav.newArrivals, href: "#arrivals" },
    { label: tr.nav.designers,   href: "/shop" },
    { label: tr.nav.sale,        href: "/shop", hot: true },
  ];

  // Scroll to anchor if on home, otherwise navigate to home first then scroll
  const handleNavLink = (href: string) => {
    if (href.startsWith("#")) {
      if (location.pathname === "/") {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }
    } else {
      navigate(href);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "";

  return (
    <>
      {/* Top announcement bar */}
      <div className="gold-gradient py-2 px-4 text-center">
        <p className="text-[#1A1A2E] text-xs font-semibold tracking-widest uppercase">
          {tr.nav.announcement}
        </p>
      </div>

      {/* Main navbar */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-warm shadow-lg shadow-black/10 top-0"
            : "bg-transparent top-9"
        }`}
        style={{ top: scrolled ? 0 : "36px" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            <img
              src={fodaLogo}
              alt="FODA"
              className={`h-25 w-auto pt-5 object-contain transition-all duration-500 ${
                scrolled ? "" : "[filter:invert(1)_hue-rotate(180deg)]"
              }`}
            />
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <button
                  onClick={() => handleNavLink(link.href)}
                  className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-300 ${
                    scrolled
                      ? "text-[#1A1A2E] hover:text-[#C9A84C]"
                      : "text-white/90 hover:text-[#E8C96B]"
                  }`}
                >
                  {link.label}
                  {link.hot && (
                    <span className="ms-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">
                      {tr.nav.hot}
                    </span>
                  )}
                  {"sub" in link && (
                    <ChevronDown
                      size={14}
                      className="mt-0.5 transition-transform duration-200 group-hover:rotate-180"
                    />
                  )}
                </button>
                <span className="absolute -bottom-1 start-0 w-0 h-0.5 gold-gradient transition-all duration-300 group-hover:w-full" />
                {"sub" in link && (
                  <div className="absolute top-full start-0 mt-3 w-44 glass-warm shadow-xl border border-[#C9A84C]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {link.sub!.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => navigate(item.href)}
                        className="w-full text-start block px-5 py-3 text-sm text-[#1A1A2E] hover:text-[#C9A84C] hover:ps-7 transition-all duration-200 border-b border-[#C9A84C]/10 last:border-0"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-3">
            {/* Language switch */}
            <div className="hidden lg:block">
              <LanguageSwitch scrolled={scrolled} />
            </div>

            {/* Auth */}
            {user ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="hidden lg:flex items-center gap-2 transition-colors duration-200"
                >
                  <div className="w-8 h-8 gold-gradient flex items-center justify-center rounded-full text-[#1A1A2E] text-xs font-black">
                    {initials}
                  </div>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${accountOpen ? "rotate-180" : ""} ${
                      scrolled ? "text-[#1A1A2E]/60" : "text-white/60"
                    }`}
                  />
                </button>
                {accountOpen && (
                  <div className="absolute top-full end-0 mt-3 w-52 bg-white border border-[#1A1A2E]/10 shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-[#1A1A2E]/8">
                      <p className="text-[#1A1A2E] font-semibold text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[#1A1A2E]/40 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                    {[
                      { Icon: User, label: tr.nav.myProfile, path: "/profile" },
                      {
                        Icon: Package,
                        label: tr.nav.myOrders,
                        path: "/profile",
                      },
                    ].map(({ Icon, label, path }) => (
                      <button
                        key={label}
                        onClick={() => {
                          navigate(path);
                          setAccountOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A2E]/70 hover:bg-[#FAF7F2] hover:text-[#C9A84C] transition-colors duration-150"
                      >
                        <Icon size={14} /> {label}
                      </button>
                    ))}
                    <div className="border-t border-[#1A1A2E]/8">
                      {user.role === "seller" && (
                        <button
                          onClick={() => {
                            navigate(
                              user.isActive
                                ? "/seller/dashboard"
                                : "/seller/pending",
                            );
                            setAccountOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A2E]/70 hover:bg-[#FAF7F2] hover:text-[#C9A84C] transition-colors duration-150"
                        >
                          <Store size={14} />
                          {user.isActive
                            ? "Seller Dashboard"
                            : "Pending Approval"}
                          {!user.isActive && (
                            <span className="ms-auto text-[10px] font-semibold text-amber-500 bg-amber-50 px-1.5 py-0.5">
                              Under Review
                            </span>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setAccountOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut size={14} /> {tr.nav.signOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLogin}
                className={`hidden lg:flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
                  scrolled
                    ? "text-[#1A1A2E]/70 hover:text-[#C9A84C]"
                    : "text-white/80 hover:text-[#E8C96B]"
                }`}
              >
                <User size={16} /> {tr.nav.signIn}
              </button>
            )}

            {/* Cart — only visible to authenticated users */}
            {user && (
              <button onClick={openCart} className="relative group">
                <ShoppingBag
                  size={20}
                  className={`transition-colors duration-300 ${
                    scrolled
                      ? "text-[#1A1A2E] group-hover:text-[#C9A84C]"
                      : "text-white/90 group-hover:text-[#E8C96B]"
                  }`}
                />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -end-2 w-4 h-4 gold-gradient text-[#1A1A2E] text-[10px] font-black flex items-center justify-center rounded-full">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className={`lg:hidden transition-colors duration-300 ${
                scrolled ? "text-[#1A1A2E]" : "text-white"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="glass-warm border-t border-[#C9A84C]/20 px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  handleNavLink(link.href);
                  setMenuOpen(false);
                }}
                className="block w-full text-start text-[#1A1A2E] font-medium text-base hover:text-[#C9A84C] transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-1">
              <LanguageSwitch scrolled />
            </div>

            <div className="pt-4 border-t border-[#C9A84C]/20 space-y-3">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-1 pb-2">
                    <div className="w-7 h-7 gold-gradient flex items-center justify-center rounded-full text-[#1A1A2E] text-xs font-black">
                      {initials}
                    </div>
                    <div>
                      <p className="text-[#1A1A2E] font-semibold text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[#1A1A2E]/40 text-[10px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {user.role === "seller" && (
                    <button
                      onClick={() => {
                        navigate(
                          user.isActive
                            ? "/seller/dashboard"
                            : "/seller/pending",
                        );
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 text-sm text-[#1A1A2E]/70 py-2"
                    >
                      <Store size={14} />
                      {user.isActive ? "Seller Dashboard" : "Pending Approval"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-sm text-red-500 py-2"
                  >
                    <LogOut size={14} /> {tr.nav.signOut}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      openLogin();
                      setMenuOpen(false);
                    }}
                    className="flex-1 btn-dark text-center text-sm py-2"
                  >
                    {tr.nav.signIn}
                  </button>
                  <button
                    onClick={() => {
                      openRegister();
                      setMenuOpen(false);
                    }}
                    className="flex-1 btn-outline-gold text-center text-sm py-2"
                  >
                    {tr.nav.register}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
