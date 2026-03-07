import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  ExternalLink,
  Store,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import fodaLogo from "../../assets/Foda-Logo (1).png";

interface Props {
  children: React.ReactNode;
}

const navItems = [
  { to: "/seller/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/seller/products", label: "My Products", Icon: Package },
  { to: "/seller/orders", label: "Orders", Icon: ShoppingBag },
];

export default function SellerLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
                Seller Portal
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
                    size={16}
                    className={isActive ? "text-[#1A1A2E]" : ""}
                  />
                  {label}
                  {isActive && (
                    <ChevronRight
                      size={13}
                      className="ms-auto text-[#1A1A2E]/60"
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
            <ExternalLink size={15} />
            Visit Store
          </a>

          {/* User info */}
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            <div className="w-8 h-8 gold-gradient flex items-center justify-center rounded-full text-[#1A1A2E] text-xs font-black flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">
                {user?.fullName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Store size={9} className="text-[#C9A84C]" />
                <p className="text-[#C9A84C] text-[9px] uppercase tracking-widest font-semibold">
                  Seller
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="ms-64 flex-1 min-w-0">{children}</main>
    </div>
  );
}
