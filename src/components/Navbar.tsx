import { useState, useEffect, useRef, useCallback } from "react";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import StoreIcon from "@mui/icons-material/Store";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { useWishlist } from "../context/WishlistContext";
import LanguageSwitch from "./LanguageSwitch";
import SearchBar from "./search/SearchBar";
import fodaLogo from "../assets/Foda-Logo (1).png";
import type { Product } from "../types";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";

/* ── Clean icon button (no background) ─────────────────────────── */
function NavIconBtn({
  onClick,
  children,
  badge,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="relative p-1.5 text-[#1A1A2E]/70 hover:text-[#1A1A2E] transition-colors duration-200"
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute -top-0.5 -end-0.5 min-w-[17px] h-[17px] bg-[#1A1A2E] text-white text-[9px] font-bold flex items-center justify-center rounded-full px-0.5">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

/* ── Mobile icon button (with subtle bg) ───────────────────────── */
function MobileIconBtn({
  onClick,
  children,
  badge,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#1A1A2E]/70 hover:bg-[#F5F0E8] transition-colors duration-200"
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute top-0 -end-0.5 min-w-[17px] h-[17px] bg-[#1A1A2E] text-white text-[9px] font-bold flex items-center justify-center rounded-full px-0.5">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const authPopupRef = useRef<HTMLDivElement>(null);
  const authCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const { totalItems, openCart } = useCart();
  const { user, openLogin, openRegister, logout } = useAuth();
  const { tr } = useLang();
  const { totalItems: wishlistCount } = useWishlist();
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);

  useEffect(() => {
    productsService
      .getAll()
      .then((ap) => setSearchProducts(ap.map(apiProductToProduct)))
      .catch(() => {});
  }, []);

  /* ── Category links only ─────────────────────────────────────── */
  const navLinks = [
    { label: tr.nav.women, href: "/shop?category=Women" },
    { label: tr.nav.men, href: "/shop?category=Men" },
    { label: tr.nav.kids, href: "/shop?category=Kids" },
    { label: tr.nav.accessories, href: "/shop?category=Accessories" },
  ];

  const handleNavLink = (href: string) => {
    navigate(href);
  };

  // Auth popup hover handlers (logged-out state)
  const openAuthPopup = useCallback(() => {
    if (authCloseTimer.current) {
      clearTimeout(authCloseTimer.current);
      authCloseTimer.current = null;
    }
    setAuthPopupOpen(true);
  }, []);

  const scheduleCloseAuthPopup = useCallback(() => {
    authCloseTimer.current = setTimeout(() => setAuthPopupOpen(false), 200);
  }, []);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);

      const delta = y - lastScrollY.current;

      if (y <= 10) {
        // At the top — always show
        setNavHidden(false);
        lastScrollY.current = y;
      } else if (delta > 10) {
        // Scrolling down by 10+px — hide
        setNavHidden(true);
        lastScrollY.current = y;
      } else if (delta < -10) {
        // Scrolling up by 10+px — show
        setNavHidden(false);
        lastScrollY.current = y;
      }
      // Ignore small movements (keep current state, don't update lastScrollY)
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Measure nav height for spacer (fixed nav is out of flow)
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setNavHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const initials = user
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <>
      {/* ── Main navbar (fixed) ────────────────────────────────────── */}
      <nav
        ref={navRef}
        className={`fixed top-0 inset-x-0 z-50 bg-white transition-transform duration-300 ${
          scrolled ? "shadow-md shadow-black/5" : ""
        } ${navHidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        {/* ── Promo bar ──────────────────────────────────────────── */}
        <div className="gold-gradient py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 sm:gap-10">
            <span className="flex items-center gap-1.5 text-[#1A1A2E] text-[11px] sm:text-xs font-semibold tracking-wide">
              <LocalShippingOutlinedIcon sx={{ fontSize: 14 }} />
              {tr.nav.promoBar.shipping}
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[#1A1A2E] text-[11px] sm:text-xs font-semibold tracking-wide">
              <AutorenewIcon sx={{ fontSize: 14 }} />
              {tr.nav.promoBar.returns}
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-[#1A1A2E] text-[11px] sm:text-xs font-semibold tracking-wide">
              <HeadsetMicOutlinedIcon sx={{ fontSize: 14 }} />
              {tr.nav.promoBar.support}
            </span>
          </div>
        </div>

        {/* ── Nav content ────────────────────────────────────────── */}
        <div className="border-b border-[#1A1A2E]/8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* ── Desktop Row 1: Logo | Icons ──────────────────────── */}
          <div className="hidden lg:flex items-center justify-between h-14">
            {/* Logo */}
            <a href="/" className="flex items-center shrink-0">
              <img
                src={fodaLogo}
                alt="FODA"
                className="h-20 w-auto pt-3 object-contain"
              />
            </a>

            {/* Icons — clean outlines, no backgrounds */}
            <div className="flex items-center gap-5">
              <LanguageSwitch />

              {/* Account — logged in: icon only, click to toggle dropdown */}
              {user ? (
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => setAccountOpen((o) => !o)}
                    className="relative p-1.5 text-[#1A1A2E]/70 hover:text-[#1A1A2E] transition-colors duration-200"
                  >
                    <PersonOutlineIcon sx={{ fontSize: 26 }} />
                  </button>

                  {/* Account dropdown */}
                  {accountOpen && (
                    <div className="absolute top-full end-0 mt-2 w-52 bg-white rounded-xl border border-[#1A1A2E]/8 shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#1A1A2E]/8">
                        <p className="text-[#1A1A2E] font-semibold text-sm">
                          {user.fullName}
                        </p>
                        <p className="text-[#1A1A2E]/40 text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                      {[
                        {
                          Icon: PersonIcon,
                          label: tr.nav.myProfile,
                          path: "/profile",
                        },
                        {
                          Icon: Inventory2Icon,
                          label: tr.nav.myOrders,
                          path: "/profile?tab=orders",
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
                          <Icon sx={{ fontSize: 15 }} /> {label}
                        </button>
                      ))}
                      <div className="border-t border-[#1A1A2E]/8">
                        {user.role === "seller" && (
                          <button
                            onClick={() => {
                              navigate("/seller/dashboard");
                              setAccountOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A2E]/70 hover:bg-[#FAF7F2] hover:text-[#C9A84C] transition-colors duration-150"
                          >
                            <StoreIcon sx={{ fontSize: 15 }} /> Seller Dashboard
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            setAccountOpen(false);
                            await logout();
                            navigate("/");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
                        >
                          <LogoutIcon sx={{ fontSize: 15 }} /> {tr.nav.signOut}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Account — logged out: hover shows auth popup */
                <div
                  className="relative"
                  ref={authPopupRef}
                  onMouseEnter={openAuthPopup}
                  onMouseLeave={scheduleCloseAuthPopup}
                >
                  <button
                    onClick={openLogin}
                    className="relative p-1.5 text-[#1A1A2E]/70 hover:text-[#1A1A2E] transition-colors duration-200"
                  >
                    <PersonOutlineIcon sx={{ fontSize: 26 }} />
                  </button>

                  {/* Auth hover popup */}
                  {authPopupOpen && (
                    <div
                      className="absolute top-full end-0 mt-2 w-60 bg-white rounded-xl border border-[#1A1A2E]/8 shadow-lg z-50 overflow-hidden"
                      onMouseEnter={openAuthPopup}
                      onMouseLeave={scheduleCloseAuthPopup}
                    >
                      <div className="px-5 pt-5 pb-3">
                        <p className="text-[#1A1A2E] font-semibold text-sm">
                          {tr.nav.myProfile}
                        </p>
                        <p className="text-[#1A1A2E]/45 text-xs mt-1 leading-relaxed">
                          {tr.auth.login.sub}
                        </p>
                      </div>
                      <div className="px-5 pb-5 flex flex-col gap-2">
                        <button
                          onClick={() => {
                            setAuthPopupOpen(false);
                            openLogin();
                          }}
                          className="w-full py-2.5 text-sm font-semibold text-white bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 rounded-lg transition-colors duration-150"
                        >
                          {tr.nav.signIn}
                        </button>
                        <button
                          onClick={() => {
                            setAuthPopupOpen(false);
                            openRegister();
                          }}
                          className="w-full py-2.5 text-sm font-semibold text-[#1A1A2E] border border-[#1A1A2E]/15 hover:border-[#C9A84C] hover:text-[#C9A84C] rounded-lg transition-colors duration-150"
                        >
                          {tr.nav.register}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist — customers only */}
              {user?.role === "customer" && (
                <NavIconBtn
                  onClick={() => navigate("/wishlist")}
                  badge={wishlistCount}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 26 }} />
                </NavIconBtn>
              )}

              {/* Cart */}
              {user && (
                <NavIconBtn onClick={openCart} badge={totalItems}>
                  <LocalMallOutlinedIcon sx={{ fontSize: 26 }} />
                </NavIconBtn>
              )}
            </div>
          </div>

          {/* ── Desktop Row 2: Categories | Search ───────────────── */}
          <div className="hidden lg:flex items-center justify-between h-11 border-t border-[#1A1A2E]/5">
            {/* Category links */}
            <div className="flex items-center gap-7">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group">
                  <button
                    onClick={() => handleNavLink(link.href)}
                    className="text-[13px] font-semibold tracking-wide text-[#1A1A2E]/60 hover:text-[#C9A84C] transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                  <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-[#C9A84C] transition-all duration-300 group-hover:w-full rounded-full" />
                </div>
              ))}
            </div>

            {/* Search bar */}
            <div className="w-72 xl:w-80">
              <SearchBar
                products={searchProducts}
                mobileOpen={mobileSearchOpen}
                onMobileClose={() => setMobileSearchOpen(false)}
              />
            </div>
          </div>

          {/* ── Mobile layout ────────────────────────────────────── */}
          <div className="flex lg:hidden items-center justify-between h-14">
            <a href="/" className="flex items-center shrink-0">
              <img
                src={fodaLogo}
                alt="FODA"
                className="h-16 w-auto pt-2 object-contain"
              />
            </a>

            <div className="flex items-center gap-1">
              <MobileIconBtn onClick={() => setMobileSearchOpen(true)}>
                <SearchIcon sx={{ fontSize: 22 }} />
              </MobileIconBtn>

              {user?.role === "customer" && (
                <MobileIconBtn
                  onClick={() => navigate("/wishlist")}
                  badge={wishlistCount}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 22 }} />
                </MobileIconBtn>
              )}

              {user && (
                <MobileIconBtn onClick={openCart} badge={totalItems}>
                  <LocalMallOutlinedIcon sx={{ fontSize: 22 }} />
                </MobileIconBtn>
              )}

              <MobileIconBtn onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? (
                  <CloseIcon sx={{ fontSize: 22 }} />
                ) : (
                  <MenuIcon sx={{ fontSize: 22 }} />
                )}
              </MobileIconBtn>
            </div>
          </div>
        </div>
        </div>
      </nav>

      {/* Spacer to offset fixed navbar */}
      <div style={{ height: navHeight }} />

      {/* ── Mobile drawer backdrop ───────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Mobile drawer panel ──────────────────────────────────── */}
      <div
        className={`fixed top-0 end-0 bottom-0 w-[300px] max-w-[85vw] z-50 bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden overflow-y-auto ${
          menuOpen
            ? "translate-x-0"
            : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-5">
          {/* Close */}
          <div className="flex justify-end">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1.5 text-[#1A1A2E]/60 hover:text-[#1A1A2E] transition-colors"
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </button>
          </div>

          {/* Category links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  handleNavLink(link.href);
                  setMenuOpen(false);
                }}
                className="block w-full text-start px-3 py-3 text-[#1A1A2E] font-medium text-base hover:text-[#C9A84C] hover:bg-[#FAF7F2] rounded-xl transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="border-t border-[#1A1A2E]/8 pt-4 space-y-3">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 pb-3">
                  <div className="w-9 h-9 gold-gradient flex items-center justify-center rounded-full text-[#1A1A2E] text-xs font-black">
                    {initials}
                  </div>
                  <div>
                    <p className="text-[#1A1A2E] font-semibold text-sm">
                      {user.fullName}
                    </p>
                    <p className="text-[#1A1A2E]/40 text-[10px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#1A1A2E]/70 hover:text-[#C9A84C] hover:bg-[#FAF7F2] rounded-xl transition-colors duration-200"
                >
                  <PersonIcon sx={{ fontSize: 16 }} /> {tr.nav.myProfile}
                </button>
                <button
                  onClick={() => {
                    navigate("/profile?tab=orders");
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#1A1A2E]/70 hover:text-[#C9A84C] hover:bg-[#FAF7F2] rounded-xl transition-colors duration-200"
                >
                  <Inventory2Icon sx={{ fontSize: 16 }} /> {tr.nav.myOrders}
                </button>
                {user.role === "customer" && (
                  <button
                    onClick={() => {
                      navigate("/wishlist");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#1A1A2E]/70 hover:text-[#C9A84C] hover:bg-[#FAF7F2] rounded-xl transition-colors duration-200"
                  >
                    <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                    {tr.wishlist.title}
                    {wishlistCount > 0 && (
                      <span className="ms-auto text-[10px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-1.5 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                )}
                {user.role === "seller" && (
                  <button
                    onClick={() => {
                      navigate("/seller/dashboard");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#1A1A2E]/70 hover:text-[#C9A84C] hover:bg-[#FAF7F2] rounded-xl transition-colors duration-200"
                  >
                    <StoreIcon sx={{ fontSize: 16 }} /> Seller Dashboard
                  </button>
                )}
                <div className="border-t border-[#1A1A2E]/8 pt-2 mt-2">
                  <button
                    onClick={async () => {
                      setMenuOpen(false);
                      await logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                  >
                    <LogoutIcon sx={{ fontSize: 16 }} /> {tr.nav.signOut}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    openLogin();
                    setMenuOpen(false);
                  }}
                  className="flex-1 btn-dark text-center text-sm py-2.5 rounded-xl"
                >
                  {tr.nav.signIn}
                </button>
                <button
                  onClick={() => {
                    openRegister();
                    setMenuOpen(false);
                  }}
                  className="flex-1 btn-outline-gold text-center text-sm py-2.5 rounded-xl"
                >
                  {tr.nav.register}
                </button>
              </div>
            )}
          </div>

          <div className="pt-2">
            <LanguageSwitch />
          </div>
        </div>
      </div>
    </>
  );
}
