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
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import SellerSetupModal from "./SellerSetupModal";
import fodaLogo from "../../assets/Foda-Logo (1).png";

interface Props {
  children: React.ReactNode;
}

const NAV_GROUPS = [
  {
    label: "Overview",
    labelAr: "نظرة عامة",
    items: [
      { to: "/seller/dashboard", labelKey: "dashboard", Icon: DashboardOutlinedIcon },
    ],
  },
  {
    label: "Products",
    labelAr: "المنتجات",
    items: [
      { to: "/seller/products", labelKey: "myProducts", Icon: Inventory2OutlinedIcon },
      { to: "/seller/inventory", labelKey: "inventory", Icon: WarehouseOutlinedIcon },
      { to: "/seller/promotions", labelKey: "promotions", Icon: LocalOfferOutlinedIcon },
    ],
  },
  {
    label: "Sales",
    labelAr: "المبيعات",
    items: [
      { to: "/seller/orders", labelKey: "orders", Icon: LocalShippingOutlinedIcon },
    ],
  },
  {
    label: "Analytics",
    labelAr: "التحليلات",
    items: [
      { to: "/seller/analytics/revenue", labelKey: "revenue", Icon: TrendingUpOutlinedIcon },
      { to: "/seller/traffic-analytics", labelKey: "trafficAnalytics", Icon: AnalyticsOutlinedIcon },
      { to: "/seller/meta-ads", labelKey: "metaAds", Icon: AdsClickOutlinedIcon },
    ],
  },
  {
    label: "Account",
    labelAr: "الحساب",
    items: [
      { to: "/seller/settings", labelKey: "storeSettings", Icon: SettingsOutlinedIcon },
    ],
  },
];

const LABEL_FALLBACKS: Record<string, { en: string; ar: string }> = {
  inventory:        { en: "Inventory",          ar: "المخزون" },
  promotions:       { en: "Promotions",          ar: "العروض" },
  revenue:          { en: "Revenue",             ar: "الإيرادات" },
  metaAds:          { en: "Meta Ads",            ar: "إعلانات Meta" },
  trafficAnalytics: { en: "Traffic Analytics",   ar: "تحليلات حركة المرور" },
};

export default function SellerLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const { tr, isRTL, lang } = useLang();
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

  const initials = user
    ? user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "";

  const sidebarW = collapsed ? "w-[60px]" : "w-60";
  const mainOffset = isRTL
    ? collapsed ? "mr-[60px]" : "mr-60"
    : collapsed ? "ml-[60px]" : "ml-60";

  return (
    <div className="flex h-screen bg-[#F5F3EF]" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside
        className={`${sidebarW} dark-gradient flex flex-col fixed top-0 bottom-0 z-40 shadow-2xl transition-[width] duration-300 ease-in-out ${
          isRTL ? "right-0" : "left-0"
        }`}
      >
        {/* Branding */}
        <div className={`flex items-center border-b border-white/8 shrink-0 transition-all duration-300 ${collapsed ? "px-3 py-4 justify-center" : "px-5 py-4"}`}>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <img
                src={fodaLogo}
                alt="FODA"
                className="h-9 w-auto object-contain filter-[invert(1)_hue-rotate(180deg)]"
              />
              <p className="text-gold text-[9px] font-semibold tracking-[0.2em] uppercase mt-1">
                {s.portal}
              </p>
            </div>
          )}
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`flex items-center justify-center w-7 h-7 rounded-none text-white/40 hover:text-white hover:bg-white/8 transition-all duration-200 shrink-0 ${collapsed ? "" : "ms-2"}`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed
              ? (isRTL ? <ChevronLeftOutlinedIcon sx={{ fontSize: 16 }} /> : <MenuOutlinedIcon sx={{ fontSize: 16 }} />)
              : (isRTL ? <ChevronRightOutlinedIcon sx={{ fontSize: 16 }} /> : <MenuOpenOutlinedIcon sx={{ fontSize: 16 }} />)}
          </button>
        </div>

        {/* Navigation — scrollable, does NOT jump on route change */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="space-y-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                {!collapsed && (
                  <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 whitespace-nowrap">
                    {lang === "ar" ? group.labelAr : group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map(({ to, labelKey, Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      title={collapsed ? getLabel(labelKey) : undefined}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-all duration-200 group relative rounded-none ${
                          collapsed ? "justify-center px-0" : ""
                        } ${
                          isActive
                            ? "gold-gradient text-charcoal font-semibold"
                            : "text-white/55 hover:text-white hover:bg-white/5"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            sx={{
                              fontSize: 15,
                              color: isActive ? "#1A1A2E" : "inherit",
                              flexShrink: 0,
                            }}
                          />
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate">{getLabel(labelKey)}</span>
                              {isActive && (
                                <ChevronRightOutlinedIcon
                                  sx={{
                                    fontSize: 12,
                                    color: "rgba(26,26,46,0.5)",
                                    transform: isRTL ? "scaleX(-1)" : "none",
                                  }}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom section — user info + logout */}
        <div className={`border-t border-white/8 pt-3 pb-3 shrink-0 ${collapsed ? "px-1 space-y-1" : "px-2 space-y-0.5"}`}>
          {/* User info */}
          {collapsed ? (
            <div className="flex justify-center py-1">
              {user?.logoUrl ? (
                <img
                  src={user.logoUrl}
                  alt={user.fullName}
                  className="w-8 h-8 object-cover rounded-full border border-white/20"
                />
              ) : (
                <div className="w-8 h-8 gold-gradient flex items-center justify-center rounded-full text-charcoal text-xs font-black">
                  {initials}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-3 py-2">
              {user?.logoUrl ? (
                <img
                  src={user.logoUrl}
                  alt={user.fullName}
                  className="w-8 h-8 object-cover rounded-full border border-white/20 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 gold-gradient flex items-center justify-center rounded-full text-charcoal text-xs font-black shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate">{user?.fullName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <StorefrontOutlinedIcon sx={{ fontSize: 9, color: "#C9A84C" }} />
                  <p className="text-gold text-[9px] uppercase tracking-widest font-semibold">{s.seller}</p>
                </div>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? s.signOut : undefined}
            className={`w-full flex items-center gap-2.5 py-2 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200 ${
              collapsed ? "justify-center px-0" : "px-3"
            }`}
          >
            <LogoutOutlinedIcon sx={{ fontSize: 14 }} />
            {!collapsed && s.signOut}
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <main className={`flex-1 min-w-0 overflow-y-auto transition-[margin] duration-300 ease-in-out ${mainOffset}`}>
        {children}
      </main>

      <SellerSetupModal />
    </div>
  );
}
