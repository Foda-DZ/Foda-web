import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockIcon from "@mui/icons-material/Lock";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import SecurityIcon from "@mui/icons-material/Security";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import type { SessionUser } from "../types";
import type { ApiOrder, ApiOrderStatus } from "../types/api";
import { ordersService } from "../services/ordersService";
import Footer from "../components/Footer";
import Field from "../components/ui/Field";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";

// ─── Info Tab ─────────────────────────────────────────────────────────────────
function InfoTab() {
  const { user, updateProfile } = useAuth();
  const { tr } = useLang();
  const [fullName, setFullName] = useState(user!.fullName);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const isDirty = fullName !== user!.fullName;

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = tr.common.required;
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    setTimeout(() => {
      updateProfile({ fullName: fullName.trim() });
      setSaving(false);
      setToast({ type: "success", message: tr.profile.infoSaved });
      setTimeout(() => setToast(null), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-1">{tr.profile.personalInfo}</h3>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.profile.infoSubtitle}</p>
      </div>

      {toast && (
        <div className={`px-3 py-2.5 text-xs leading-relaxed border ${
          toast.type === "success"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {toast.message}
        </div>
      )}

      <Field label={tr.profile.fullName} error={errors.fullName}>
        <TextInput
          value={fullName}
          onChange={setFullName}
          error={errors.fullName}
        />
      </Field>

      {/* Email — read-only with icons */}
      <div>
        <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/60 mb-1.5">
          {tr.checkout.email}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            <MailOutlineIcon sx={{ fontSize: 14, color: "rgba(26,26,46,0.3)" }} />
          </span>
          <input
            value={user!.email}
            readOnly
            disabled
            className="w-full border border-[#1A1A2E]/15 bg-[#FAF7F2] py-2.5 pl-8 pr-8 text-sm text-[#1A1A2E] opacity-50 cursor-not-allowed focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            <LockIcon sx={{ fontSize: 13, color: "rgba(26,26,46,0.2)" }} />
          </span>
        </div>
        <p className="flex items-center gap-1 mt-1.5 text-[10px] text-[#1A1A2E]/35">
          <SecurityIcon sx={{ fontSize: 11 }} /> {tr.profile.emailLocked}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={handleSave}
          disabled={!isDirty || saving}
          loading={saving}
          className="gap-2"
        >
          <EditIcon sx={{ fontSize: 14 }} /> {tr.profile.saveChanges}
        </Button>
        {isDirty && (
          <button
            onClick={() => { setFullName(user!.fullName); setErrors({}); }}
            className="text-xs text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70 transition-colors"
          >
            {tr.profile.cancel}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const { tr } = useLang();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-1">{tr.profile.security}</h3>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.profile.securitySubtitle}</p>
      </div>
      <div className="flex items-start gap-3 bg-[#C9A84C]/8 border border-[#C9A84C]/25 px-4 py-3">
        <SecurityIcon sx={{ fontSize: 16, color: "#C9A84C", mt: 0.25, flexShrink: 0 }} />
        <p className="text-sm text-[#1A1A2E]/60 leading-relaxed">
          Password management is handled securely by the server. To change your
          password, please use the forgot-password flow from the login screen.
        </p>
      </div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab({ onShopClick }: { onShopClick: () => void }) {
  const { tr } = useLang();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const STATUS_STYLES: Record<ApiOrderStatus, { bg: string; text: string; dot: string; label: string }> = {
    pending:   { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400",  label: tr.profile.statusPending },
    confirmed: { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400",   label: tr.profile.statusConfirmed },
    shipped:   { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400", label: tr.profile.statusShipped },
    delivered: { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400",  label: tr.profile.statusDelivered },
    cancelled: { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-400",    label: tr.profile.statusCancelled },
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await ordersService.getCustomerOrders();
      setOrders(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : tr.profile.ordersError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-1">{tr.profile.orders}</h3>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.profile.ordersSubtitle}</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-[#1A1A2E]/40">
          <span className="w-5 h-5 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">{tr.profile.loadingOrders}</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 w-full">
            {error}
          </div>
          <Button onClick={load}>{tr.profile.retry}</Button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-6 border border-dashed border-[#1A1A2E]/10">
          <div className="w-16 h-16 bg-[#F5F0E8] flex items-center justify-center">
            <Inventory2Icon sx={{ fontSize: 28, color: "rgba(26,26,46,0.25)" }} />
          </div>
          <div>
            <p className="font-display font-bold text-[#1A1A2E] text-lg mb-1">{tr.profile.noOrders}</p>
            <p className="text-[#1A1A2E]/40 text-sm max-w-xs">{tr.profile.noOrdersSub}</p>
          </div>
          <Button onClick={onShopClick} className="gap-2">
            <ShoppingBagIcon sx={{ fontSize: 15 }} /> {tr.profile.startShopping}
          </Button>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const st = STATUS_STYLES[order.status];
            const isOpen = expanded === order._id;
            const date = new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric", month: "short", day: "numeric",
            });

            return (
              <div key={order._id} className="border border-[#1A1A2E]/8 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-[#FAF7F2] transition-colors duration-150 text-start"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
                      <Inventory2Icon sx={{ fontSize: 16, color: "rgba(26,26,46,0.4)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A2E]">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-[#1A1A2E]/40 mt-0.5">
                        {tr.profile.orderPlaced} {date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 ${st.bg} ${st.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                    {isOpen
                      ? <ExpandLessIcon sx={{ fontSize: 15, color: "rgba(26,26,46,0.3)" }} />
                      : <ExpandMoreIcon sx={{ fontSize: 15, color: "rgba(26,26,46,0.3)" }} />
                    }
                  </div>
                </button>

                {!isOpen && (
                  <div className="flex items-center justify-between px-4 pb-3 pt-2 border-t border-[#1A1A2E]/5 text-xs">
                    <span className={`sm:hidden inline-flex items-center gap-1.5 font-medium px-2 py-0.5 ${st.bg} ${st.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                    <span className="text-[#1A1A2E]/40">
                      {order.items.length} {tr.checkout.items}
                    </span>
                    <span className="font-semibold text-[#1A1A2E]">
                      {order.totalAmount.toLocaleString()} {tr.common.dzd}
                    </span>
                  </div>
                )}

                {isOpen && (
                  <div className="border-t border-[#1A1A2E]/8">
                    <div className="p-4 space-y-3">
                      <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40">
                        {tr.checkout.orderItems}
                      </p>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-14 object-cover bg-[#F5F0E8] flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-14 bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
                              <ShoppingBagIcon sx={{ fontSize: 14, color: "rgba(26,26,46,0.2)" }} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1A1A2E] truncate">{item.name}</p>
                            <p className="text-xs text-[#1A1A2E]/40 mt-0.5">×{item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-[#1A1A2E] flex-shrink-0">
                            {(item.price * item.quantity).toLocaleString()} {tr.common.dzd}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#1A1A2E]/8 p-4 space-y-2">
                      <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40">
                        {tr.checkout.deliveryInfo}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#1A1A2E]/60">
                        <LocationOnIcon sx={{ fontSize: 12, flexShrink: 0, color: "rgba(26,26,46,0.3)" }} />
                        <span>{order.shippingDetails.wilaya}, {order.shippingDetails.commune}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#1A1A2E]/60">
                        <PhoneIcon sx={{ fontSize: 12, flexShrink: 0, color: "rgba(26,26,46,0.3)" }} />
                        <span>{order.shippingDetails.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#1A1A2E]/60">
                        <LocalShippingIcon sx={{ fontSize: 12, flexShrink: 0, color: "rgba(26,26,46,0.3)" }} />
                        <span>
                          {order.shippingDetails.shippingType === "home_delivery"
                            ? tr.profile.homeDelivery
                            : tr.profile.deskPickup}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-[#1A1A2E]/8 p-4 flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40">
                        {tr.checkout.total}
                      </span>
                      <span className="font-bold text-[#1A1A2E] text-base">
                        {order.totalAmount.toLocaleString()} {tr.common.dzd}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Profile Header ───────────────────────────────────────────────────────────
function ProfileHeader({ user, onBack }: { user: SessionUser; onBack: () => void }) {
  const { tr } = useLang();
  const memberSince = (() => {
    try {
      const users = JSON.parse(localStorage.getItem("foda_users") || "[]") as Array<{ id: number; createdAt?: string }>;
      const found = users.find((u) => u.id === user.id);
      if (found?.createdAt) return new Date(found.createdAt).toLocaleDateString("en-DZ", { year: "numeric", month: "long" });
    } catch { /* noop */ }
    return null;
  })();

  const initials = user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="dark-gradient pt-24 pb-10 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-[#C9A84C] transition-colors duration-200 mb-8 text-sm"
        >
          <ArrowBackIcon sx={{ fontSize: 15 }} className="rtl:rotate-180" /> {tr.common.back}
        </button>
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="relative">
            <div className="w-24 h-24 gold-gradient rounded-full flex items-center justify-center font-display text-4xl font-black text-[#1A1A2E]">
              {initials}
            </div>
            <div className="absolute -inset-1 gold-gradient opacity-20 rounded-full blur-md" />
          </div>
          <div className="text-center sm:text-start">
            <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-1">
              {tr.profile.myAccount}
            </p>
            <h1 className="font-display text-3xl font-bold text-white">{user.fullName}</h1>
            <p className="text-white/50 text-sm mt-0.5">{user.email}</p>
            {memberSince && (
              <p className="text-white/30 text-xs mt-1">{tr.profile.memberSince} {memberSince}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
type TabId = "info" | "security" | "orders";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { tr } = useLang();
  const [tab, setTab] = useState<TabId>("info");
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) return null;

  const TABS = [
    { id: "info" as const,     label: tr.profile.personalInfo, Icon: PersonIcon },
    { id: "security" as const, label: tr.profile.security,     Icon: SecurityIcon },
    { id: "orders" as const,   label: tr.profile.orders,       Icon: Inventory2Icon },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/");
  };

  const initials = user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <ProfileHeader user={user} onBack={() => navigate("/")} />
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 text-start ${
                    tab === id
                      ? "gold-gradient text-[#1A1A2E] font-semibold"
                      : "text-[#1A1A2E]/60 hover:bg-white hover:text-[#1A1A2E]"
                  }`}
                >
                  <Icon sx={{ fontSize: 15 }} /> {label}
                </button>
              ))}
              <div className="h-px bg-[#1A1A2E]/8 mx-4 my-2" />
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
              >
                {loggingOut
                  ? <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  : <LogoutIcon sx={{ fontSize: 15 }} />
                }
                {tr.profile.signOut}
              </button>
            </nav>

            <div className="mt-6 bg-white border border-[#1A1A2E]/8 p-4 space-y-3">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#1A1A2E]/35">
                {tr.profile.account}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center text-[#1A1A2E] text-xs font-black flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[#1A1A2E] text-sm font-semibold truncate">{user.fullName}</p>
                  <p className="text-[#1A1A2E]/40 text-[10px] truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-3">
            <div className="bg-white border border-[#1A1A2E]/8 p-6 lg:p-8">
              {tab === "info"     && <InfoTab />}
              {tab === "security" && <SecurityTab />}
              {tab === "orders"   && <OrdersTab onShopClick={() => navigate("/shop")} />}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
