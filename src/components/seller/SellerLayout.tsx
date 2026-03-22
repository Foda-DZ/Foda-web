import { NavLink, useNavigate } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import fodaLogo from "../../assets/Foda-Logo (1).png";

interface Props {
  children: React.ReactNode;
}

export default function SellerLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const { tr } = useLang();
  const s = tr.seller.layout;
  const navigate = useNavigate();

  const navItems = [
    { to: "/seller/dashboard", label: s.dashboard, Icon: DashboardOutlinedIcon },
    { to: "/seller/products", label: s.myProducts, Icon: Inventory2OutlinedIcon },
    { to: "/seller/orders", label: s.orders, Icon: LocalShippingOutlinedIcon },
    { to: "/seller/settings", label: s.storeSettings, Icon: SettingsOutlinedIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="w-64 dark-gradient flex flex-col fixed h-full z-40 shadow-2xl">
        {/* Branding */}
        <div className="px-6 py-5 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div>
              <img
                src={fodaLogo}
                alt="FODA"
                className="h-12 w-auto object-contain [filter:invert(1)_hue-rotate(180deg)]"
              />
              <p className="text-[#C9A84C] text-[9px] font-semibold tracking-[0.2em] uppercase mt-0.5">
                {s.portal}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "gold-gradient text-[#1A1A2E] font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    sx={{ fontSize: 16, color: isActive ? "#1A1A2E" : "inherit" }}
                  />
                  {label}
                  {isActive && (
                    <ChevronRightOutlinedIcon
                      sx={{ fontSize: 13, color: "rgba(26,26,46,0.6)", marginInlineStart: "auto" }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4 space-y-1 border-t border-white/8 pt-3">
          {/* Visit store link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            <OpenInNewOutlinedIcon sx={{ fontSize: 15 }} />
            {s.visitStore}
          </a>

          {/* User info */}
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            {user?.logoUrl ? (
              <img
                src={user.logoUrl}
                alt={user.fullName}
                className="w-8 h-8 object-cover rounded-full border border-white/20 flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 gold-gradient flex items-center justify-center rounded-full text-[#1A1A2E] text-xs font-black flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">
                {user?.fullName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <StorefrontOutlinedIcon sx={{ fontSize: 9, color: "#C9A84C" }} />
                <p className="text-[#C9A84C] text-[9px] uppercase tracking-widest font-semibold">
                  {s.seller}
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
          >
            <LogoutOutlinedIcon sx={{ fontSize: 15 }} /> {s.signOut}
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="ms-64 flex-1 min-w-0">{children}</main>
    </div>
  );
}
