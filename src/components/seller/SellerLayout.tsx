import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import SellerSetupModal from "./SellerSetupModal";
import fodaLogo from "../../assets/Foda-Logo (1).png";

interface Props {
  children: React.ReactNode;
}

// Flat, importance-ordered nav — one "Menu" section (matches reference).
const NAV_ITEMS = [
  { to: "/seller/dashboard", labelKey: "dashboard", Icon: DashboardOutlinedIcon },
  { to: "/seller/orders", labelKey: "orders", Icon: LocalShippingOutlinedIcon },
  { to: "/seller/products", labelKey: "myProducts", Icon: Inventory2OutlinedIcon },
  { to: "/seller/inventory", labelKey: "inventory", Icon: WarehouseOutlinedIcon },
  { to: "/seller/promotions", labelKey: "promotions", Icon: LocalOfferOutlinedIcon },
  { to: "/seller/collections", labelKey: "collections", Icon: CollectionsBookmarkOutlinedIcon },
  { to: "/seller/confirmators", labelKey: "confirmationTeam", Icon: GroupsOutlinedIcon },
  { to: "/seller/analytics/revenue", labelKey: "revenue", Icon: TrendingUpOutlinedIcon },
  { to: "/seller/traffic-analytics", labelKey: "trafficAnalytics", Icon: AnalyticsOutlinedIcon },
  { to: "/seller/meta-ads", labelKey: "metaAds", Icon: AdsClickOutlinedIcon },
  { to: "/seller/settings", labelKey: "storeSettings", Icon: SettingsOutlinedIcon },
];

const LABEL_FALLBACKS: Record<string, { en: string; ar: string }> = {
  inventory: { en: "Inventory", ar: "المخزون" },
  promotions: { en: "Promotions", ar: "العروض" },
  collections: { en: "Collections", ar: "المجموعات" },
  revenue: { en: "Revenue", ar: "الإيرادات" },
  metaAds: { en: "Meta Ads", ar: "إعلانات Meta" },
};

export default function SellerLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const { tr, isRTL, lang, setLang } = useLang();
  const s = tr.seller.layout;
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const getLabel = (key: string) => {
    if (key in s) return (s as Record<string, string>)[key];
    if (key in LABEL_FALLBACKS)
      return lang === "ar" ? LABEL_FALLBACKS[key].ar : LABEL_FALLBACKS[key].en;
    return key;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleToggleLang = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };

  const initials = user
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const sidebarW = collapsed ? "w-[72px]" : "w-64";
  const mainOffset = isRTL
    ? collapsed
      ? "mr-[72px]"
      : "mr-64"
    : collapsed
      ? "ml-[72px]"
      : "ml-64";

  // Toggle sits on the sidebar's *inner* edge and protrudes onto the canvas.
  const toggleEdge = isRTL ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2";
  const ChevronIcon = isRTL ? ChevronLeftOutlinedIcon : ChevronRightOutlinedIcon;

  return (
    <div
      className="seller-shell flex h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside
        className={`${sidebarW} dark-gradient flex flex-col fixed top-0 bottom-0 z-40 transition-[width] duration-300 ease-in-out ${
          isRTL ? "right-0" : "left-0"
        }`}
        style={{ boxShadow: "0 0 40px -10px rgba(26,26,46,0.45)" }}
      >
        {/* Floating gold toggle on the inner edge (matches reference) */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`absolute top-7 ${toggleEdge} z-50 w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-charcoal shadow-lg ring-4 ring-[#F3F0EA] hover:scale-110 active:scale-95 transition-transform duration-200`}
        >
          {collapsed ? (
            <ChevronIcon sx={{ fontSize: 18 }} />
          ) : (
            <ChevronLeftOutlinedIcon
              sx={{ fontSize: 18, transform: isRTL ? "scaleX(-1)" : "none" }}
            />
          )}
        </button>

        {/* Branding — logo centered */}
        <div className="flex items-center justify-center px-4 pt-7 pb-6 shrink-0">
          <img
            src={fodaLogo}
            alt="FODA"
            className={`object-contain filter-[invert(1)_hue-rotate(180deg)] transition-all duration-300 ${
              collapsed ? "h-8" : "h-14"
            }`}
          />
        </div>

        {/* Navigation — flat "Menu" list (matches reference) */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {!collapsed && (
            <p className="px-2 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 whitespace-nowrap">
              {s.menu}
            </p>
          )}
          <div className="space-y-1">
            {NAV_ITEMS.map(({ to, labelKey, Icon }) => (
              <NavLink
                key={to}
                to={to}
                title={collapsed ? getLabel(labelKey) : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-all duration-200 group relative rounded-xl ${
                    collapsed ? "justify-center px-0" : ""
                  } ${
                    isActive
                      ? "sl-nav-active-soft font-semibold text-gold"
                      : "text-white/55 hover:text-white hover:bg-white/[0.06]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      sx={{
                        fontSize: 19,
                        color: isActive ? "#C9A84C" : "#C9A84C",
                        opacity: isActive ? 1 : 0.5,
                        flexShrink: 0,
                        transition: "opacity .2s",
                      }}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">
                          {getLabel(labelKey)}
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                        )}
                      </>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom section — user info + logout */}
        <div
          className={`border-t border-white/8 pt-3 pb-4 shrink-0 ${collapsed ? "px-2 space-y-1.5" : "px-3 space-y-1.5"}`}
        >
          {/* User info */}
          {collapsed ? (
            <div className="flex justify-center py-1">
              {user?.logoUrl ? (
                <img
                  src={user.logoUrl}
                  alt={user.fullName}
                  className="w-9 h-9 object-cover rounded-full border border-white/20"
                />
              ) : (
                <div className="w-9 h-9 gold-gradient flex items-center justify-center rounded-full text-charcoal text-xs font-black">
                  {initials}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl bg-white/[0.04]">
              {user?.logoUrl ? (
                <img
                  src={user.logoUrl}
                  alt={user.fullName}
                  className="w-9 h-9 object-cover rounded-full border border-white/20 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 gold-gradient flex items-center justify-center rounded-full text-charcoal text-xs font-black shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate">
                  {user?.fullName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <StorefrontOutlinedIcon
                    sx={{ fontSize: 9, color: "#C9A84C" }}
                  />
                  <p className="text-gold text-[9px] uppercase tracking-widest font-semibold">
                    {s.seller}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className={`flex gap-1.5 ${collapsed ? "flex-col" : ""}`}>
            {/* Switch lang */}
            <button
              onClick={handleToggleLang}
              title={s.switchLang}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors duration-200 ${
                collapsed ? "w-full px-0" : "flex-1 px-2 text-[12px] font-medium"
              }`}
            >
              <TranslateOutlinedIcon sx={{ fontSize: 16 }} />
              {!collapsed && (lang === "ar" ? "EN" : "ع")}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title={collapsed ? s.signOut : undefined}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors duration-200 ${
                collapsed ? "w-full px-0" : "flex-1 px-2"
              }`}
            >
              <LogoutOutlinedIcon sx={{ fontSize: 15 }} />
              {!collapsed && s.signOut}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <main
        className={`flex-1 min-w-0 overflow-y-auto transition-[margin] duration-300 ease-in-out ${mainOffset}`}
      >
        {children}
      </main>

      <SellerSetupModal />
    </div>
  );
}
