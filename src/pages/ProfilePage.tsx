import { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  ShoppingBag,
  LogOut,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Edit3,
  Shield,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import type { SessionUser } from "../types";
import Footer from "../components/Footer";

// ─── Local helpers ─────────────────────────────────────────────────────────────
interface FieldProps {
  label: string; error?: string; success?: string; children: React.ReactNode;
}

function Field({ label, error, success, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50 mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
      {success && (
        <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
          <Check size={11} /> {success}
        </p>
      )}
    </div>
  );
}

interface TextInputProps {
  value: string; onChange?: (v: string) => void; placeholder?: string;
  disabled?: boolean; type?: string; suffix?: React.ReactNode;
}

function TextInput({ value, onChange, placeholder, disabled, type = "text", suffix }: TextInputProps) {
  return (
    <div className={`relative flex items-center border transition-colors duration-200 ${disabled ? "bg-[#F5F0E8] border-[#1A1A2E]/8" : "bg-white border-[#1A1A2E]/15 focus-within:border-[#C9A84C]/60"}`}>
      <input
        type={type} value={value} onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        className="w-full h-11 px-4 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/30 outline-none bg-transparent disabled:text-[#1A1A2E]/40 disabled:cursor-not-allowed"
      />
      {suffix}
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <TextInput type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
      suffix={
        <button type="button" onClick={() => setShow((s) => !s)}
          className="absolute end-3 text-[#1A1A2E]/30 hover:text-[#1A1A2E]/60 transition-colors">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
    />
  );
}

interface Toast { type: "success" | "error"; message: string; }

function ToastMessage({ toast }: { toast: Toast | null }) {
  if (!toast) return null;
  return (
    <div className={`flex items-center gap-2 px-4 py-3 text-sm border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>
      {toast.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
      {toast.message}
    </div>
  );
}

// ─── Info Tab ─────────────────────────────────────────────────────────────────
function InfoTab() {
  const { user, updateProfile } = useAuth();
  const { tr } = useLang();
  const [firstName, setFirstName] = useState(user!.firstName);
  const [lastName, setLastName] = useState(user!.lastName);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<Toast | null>(null);
  const [saving, setSaving] = useState(false);

  const isDirty = firstName !== user!.firstName || lastName !== user!.lastName;

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = tr.common.required;
    if (!lastName.trim()) e.lastName = tr.common.required;
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    setTimeout(() => {
      const result = updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() });
      setSaving(false);
      if ("error" in result) {
        setToast({ type: "error", message: result.error });
      } else {
        setToast({ type: "success", message: tr.profile.infoSaved });
        setTimeout(() => setToast(null), 3000);
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-1">{tr.profile.personalInfo}</h3>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.profile.infoSubtitle}</p>
      </div>
      <ToastMessage toast={toast} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={tr.checkout.firstName} error={errors.firstName}>
          <TextInput value={firstName} onChange={setFirstName} placeholder={tr.checkout.firstName} />
        </Field>
        <Field label={tr.checkout.lastName} error={errors.lastName}>
          <TextInput value={lastName} onChange={setLastName} placeholder={tr.checkout.lastName} />
        </Field>
      </div>
      <Field label={tr.checkout.email}>
        <div className="relative flex items-center border border-[#1A1A2E]/8 bg-[#F5F0E8]">
          <Mail size={15} className="absolute start-3.5 text-[#1A1A2E]/30 pointer-events-none" />
          <input value={user!.email} disabled
            className="w-full h-11 ps-10 pe-9 text-sm text-[#1A1A2E]/40 bg-transparent outline-none cursor-not-allowed" />
          <Lock size={13} className="absolute end-3.5 text-[#1A1A2E]/20 pointer-events-none" />
        </div>
        <p className="mt-1.5 text-[10px] text-[#1A1A2E]/35 flex items-center gap-1">
          <Shield size={10} /> {tr.profile.emailLocked}
        </p>
      </Field>
      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={!isDirty || saving}
          className="btn-gold flex items-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed">
          {saving ? (
            <span className="w-4 h-4 border-2 border-[#1A1A2E]/30 border-t-[#1A1A2E] rounded-full animate-spin" />
          ) : (
            <><Edit3 size={14} /> {tr.profile.saveChanges}</>
          )}
        </button>
        {isDirty && (
          <button onClick={() => { setFirstName(user!.firstName); setLastName(user!.lastName); setErrors({}); }}
            className="text-xs text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70 transition-colors">
            {tr.profile.cancel}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const { changePassword } = useAuth();
  const { tr } = useLang();
  const [fields, setFields] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<Toast | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof fields) => (v: string) => setFields((f) => ({ ...f, [k]: v }));

  const strength = (() => {
    const p = fields.next;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", tr.auth.register.strength.weak, tr.auth.register.strength.fair, tr.auth.register.strength.good, tr.auth.register.strength.strong][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  const handleSave = () => {
    const e: Record<string, string> = {};
    if (!fields.current) e.current = tr.common.required;
    if (!fields.next) e.next = tr.common.required;
    else if (fields.next.length < 8) e.next = tr.common.required;
    if (fields.confirm !== fields.next) e.confirm = tr.common.required;
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    setTimeout(() => {
      const result = changePassword({ currentPassword: fields.current, newPassword: fields.next });
      setSaving(false);
      if ("error" in result) {
        setToast({ type: "error", message: result.error });
      } else {
        setToast({ type: "success", message: tr.profile.passwordChanged });
        setFields({ current: "", next: "", confirm: "" });
        setTimeout(() => setToast(null), 3000);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-1">{tr.profile.security}</h3>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.profile.securitySubtitle}</p>
      </div>
      <ToastMessage toast={toast} />
      <Field label={tr.profile.currentPassword} error={errors.current}>
        <PasswordInput value={fields.current} onChange={set("current")} placeholder={tr.profile.currentPwdPlaceholder} />
      </Field>
      <div>
        <Field label={tr.profile.newPassword} error={errors.next}>
          <PasswordInput value={fields.next} onChange={set("next")} placeholder={tr.profile.newPwdPlaceholder} />
        </Field>
        {fields.next && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-[#1A1A2E]/10"}`} />
              ))}
            </div>
            <p className="text-[10px] text-[#1A1A2E]/40">{strengthLabel}</p>
          </div>
        )}
      </div>
      <Field label={tr.profile.confirmPassword} error={errors.confirm}>
        <PasswordInput value={fields.confirm} onChange={set("confirm")} placeholder={tr.profile.confirmPwdPlaceholder} />
      </Field>
      <button onClick={handleSave} disabled={saving || (!fields.current && !fields.next && !fields.confirm)}
        className="btn-gold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
        {saving ? (
          <span className="w-4 h-4 border-2 border-[#1A1A2E]/30 border-t-[#1A1A2E] rounded-full animate-spin" />
        ) : (
          <><Shield size={14} /> {tr.profile.updatePassword}</>
        )}
      </button>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab({ onShopClick }: { onShopClick: () => void }) {
  const { tr } = useLang();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-1">{tr.profile.orders}</h3>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.profile.ordersSubtitle}</p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center gap-6 border border-dashed border-[#1A1A2E]/10">
        <div className="w-16 h-16 bg-[#F5F0E8] flex items-center justify-center">
          <Package size={28} className="text-[#1A1A2E]/25" />
        </div>
        <div>
          <p className="font-display font-bold text-[#1A1A2E] text-lg mb-1">{tr.profile.noOrders}</p>
          <p className="text-[#1A1A2E]/40 text-sm max-w-xs">{tr.profile.noOrdersSub}</p>
        </div>
        <button onClick={onShopClick} className="btn-gold flex items-center gap-2 group">
          <ShoppingBag size={15} /> {tr.profile.startShopping}
        </button>
      </div>
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
      if (found?.createdAt)
        return new Date(found.createdAt).toLocaleDateString("en-DZ", { year: "numeric", month: "long" });
    } catch { /* noop */ }
    return null;
  })();

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="dark-gradient pt-24 pb-10 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-[#C9A84C] transition-colors duration-200 mb-8 text-sm">
          <ArrowLeft size={15} className="rtl:rotate-180" /> {tr.common.back}
        </button>
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="relative">
            <div className="w-24 h-24 gold-gradient rounded-full flex items-center justify-center font-display text-4xl font-black text-[#1A1A2E]">
              {initials}
            </div>
            <div className="absolute -inset-1 gold-gradient opacity-20 rounded-full blur-md" />
          </div>
          <div className="text-center sm:text-start">
            <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-1">{tr.profile.myAccount}</p>
            <h1 className="font-display text-3xl font-bold text-white">{user.firstName} {user.lastName}</h1>
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
    { id: "info" as const, label: tr.profile.personalInfo, Icon: User },
    { id: "security" as const, label: tr.profile.security, Icon: Shield },
    { id: "orders" as const, label: tr.profile.orders, Icon: Package },
  ];

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => { logout(); navigate("/"); }, 400);
  };

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <ProfileHeader user={user} onBack={() => navigate("/")} />
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-1">
              {TABS.map(({ id, label, Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 text-start ${tab === id ? "gold-gradient text-[#1A1A2E] font-semibold" : "text-[#1A1A2E]/60 hover:bg-white hover:text-[#1A1A2E]"}`}>
                  <Icon size={15} /> {label}
                </button>
              ))}
              <div className="h-px bg-[#1A1A2E]/8 mx-4 my-2" />
              <button onClick={handleLogout} disabled={loggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50">
                {loggingOut ? (
                  <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                ) : <LogOut size={15} />}
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
                  <p className="text-[#1A1A2E] text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-[#1A1A2E]/40 text-[10px] truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-3">
            <div className="bg-white border border-[#1A1A2E]/8 p-6 lg:p-8">
              {tab === "info" && <InfoTab />}
              {tab === "security" && <SecurityTab />}
              {tab === "orders" && <OrdersTab onShopClick={() => navigate("/shop")} />}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
