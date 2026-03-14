import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import type { UserRole } from "../types";
import TextInput from "./ui/TextInput";
import PasswordInput from "./ui/PasswordInput";
import Button from "./ui/Button";
import fodaLogo from "../assets/Foda-Logo (1).png";

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({ switchTo }: { switchTo: (v: ModalView) => void }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { tr } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = tr.common.required;
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = tr.common.invalidEmail;
    if (!password) e.password = tr.common.required;
    return e;
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      const session = await login({ email, password, role });
      if (session.role === "seller") {
        navigate("/seller/dashboard");
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role toggle */}
      <div className="flex gap-1 bg-[#1A1A2E]/5 p-1">
        {[
          { value: "customer" as UserRole, label: "Shop as Customer", Icon: ShoppingBagOutlinedIcon },
          { value: "seller" as UserRole, label: "Seller Login", Icon: StoreIcon },
        ].map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
              role === value ? "gold-gradient text-[#1A1A2E]" : "text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70"
            }`}
          >
            <Icon sx={{ fontSize: 13 }} /> {label}
          </button>
        ))}
      </div>

      <div>
        <TextInput
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={tr.auth.login.emailPlaceholder}
          error={errors.email}
          icon={<MailOutlineIcon sx={{ fontSize: 15, color: "rgba(26,26,46,0.4)" }} />}
        />
        {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
      </div>

      <PasswordInput
        value={password}
        onChange={setPassword}
        placeholder={tr.auth.login.passwordPlaceholder}
        error={errors.password}
      />

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 leading-relaxed">
          {apiError}
        </div>
      )}

      <Button type="submit" fullWidth loading={loading} className="h-12 gap-2">
        {tr.auth.login.submit}
        <ArrowForwardIcon sx={{ fontSize: 15 }} />
      </Button>

      <p className="text-center text-xs text-[#1A1A2E]/50">
        {tr.auth.login.noAccount}{" "}
        <button type="button" onClick={() => switchTo("register")} className="text-[#C9A84C] font-semibold hover:underline">
          {tr.auth.login.createOne}
        </button>
      </p>
    </form>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm({ switchTo }: { switchTo: (v: ModalView) => void }) {
  const { registerCustomer, registerSeller } = useAuth();
  const { tr } = useLang();
  const [role, setRole] = useState<UserRole>("customer");
  const [fields, setFields] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof fields) => (val: string) =>
    setFields((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fields.fullName.trim()) e.fullName = tr.common.required;
    if (!fields.email.trim()) e.email = tr.common.required;
    else if (!/\S+@\S+\.\S+/.test(fields.email)) e.email = tr.common.invalidEmail;
    if (!fields.password) e.password = tr.common.required;
    else if (fields.password.length < 8) e.password = tr.common.required;
    if (fields.confirm !== fields.password) e.confirm = tr.common.required;
    return e;
  };

  const strength = (() => {
    const p = fields.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabels = ["", tr.auth.register.strength.weak, tr.auth.register.strength.fair, tr.auth.register.strength.good, tr.auth.register.strength.strong];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      if (role === "seller") {
        await registerSeller({ shopName: fields.fullName.trim(), email: fields.email.trim(), password: fields.password });
      } else {
        await registerCustomer({ fullName: fields.fullName.trim(), email: fields.email.trim(), password: fields.password });
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role toggle */}
      <div className="flex gap-1 bg-[#1A1A2E]/5 p-1">
        {[
          { value: "customer" as UserRole, label: "Shop as Customer", Icon: ShoppingBagOutlinedIcon },
          { value: "seller" as UserRole, label: "Join as Seller", Icon: StoreIcon },
        ].map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
              role === value ? "gold-gradient text-[#1A1A2E]" : "text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70"
            }`}
          >
            <Icon sx={{ fontSize: 13 }} /> {label}
          </button>
        ))}
      </div>

      <div>
        <TextInput
          value={fields.fullName}
          onChange={set("fullName")}
          placeholder={role === "seller" ? tr.auth.register.shopNamePlaceholder : tr.auth.register.fullNamePlaceholder}
          error={errors.fullName}
          icon={role === "seller"
            ? <StoreIcon sx={{ fontSize: 15, color: "rgba(26,26,46,0.4)" }} />
            : <PersonOutlineIcon sx={{ fontSize: 15, color: "rgba(26,26,46,0.4)" }} />}
        />
        {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>}
      </div>

      <div>
        <TextInput
          type="email"
          value={fields.email}
          onChange={set("email")}
          placeholder={tr.auth.register.emailPlaceholder}
          error={errors.email}
          icon={<MailOutlineIcon sx={{ fontSize: 15, color: "rgba(26,26,46,0.4)" }} />}
        />
        {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <PasswordInput
          value={fields.password}
          onChange={set("password")}
          placeholder={tr.auth.register.passwordPlaceholder}
          error={errors.password}
        />
        {fields.password && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-[#1A1A2E]/10"}`} />
              ))}
            </div>
            <p className="text-[10px] text-[#1A1A2E]/50">{strengthLabels[strength]}</p>
          </div>
        )}
      </div>

      <PasswordInput
        value={fields.confirm}
        onChange={set("confirm")}
        placeholder={tr.auth.register.confirmPlaceholder}
        error={errors.confirm}
      />

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 leading-relaxed">
          {apiError}
        </div>
      )}

      <Button type="submit" fullWidth loading={loading} className="h-12 gap-2">
        {tr.auth.register.submit}
        <ArrowForwardIcon sx={{ fontSize: 15 }} />
      </Button>

      <p className="text-center text-xs text-[#1A1A2E]/50">
        {tr.auth.register.hasAccount}{" "}
        <button type="button" onClick={() => switchTo("login")} className="text-[#C9A84C] font-semibold hover:underline">
          {tr.auth.register.signIn}
        </button>
      </p>
    </form>
  );
}

// ─── Verify Form ──────────────────────────────────────────────────────────────
function VerifyForm() {
  const navigate = useNavigate();
  const { verifyEmail, pendingEmail } = useAuth();
  const { tr } = useLang();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (code.trim().length !== 6) { setError(tr.auth.verify.invalidCode); return; }
    if (!pendingEmail) { setError("Missing email. Please start again."); return; }
    setError("");
    setLoading(true);
    try {
      const session = await verifyEmail({ email: pendingEmail, verificationCode: parseInt(code, 10) });
      if (session.role === "seller") {
        navigate("/seller/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : tr.auth.verify.invalidCode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-[#1A1A2E]/60 leading-relaxed">
        {tr.auth.verify.codeSent}{" "}
        <span className="font-semibold text-[#1A1A2E]">{pendingEmail}</span>
      </p>
      <div className="flex items-center gap-4 bg-[#C9A84C]/8 border border-[#C9A84C]/25 px-4 py-3">
        <div className="w-9 h-9 gold-gradient flex items-center justify-center flex-shrink-0">
          <MailOutlineIcon sx={{ fontSize: 16, color: "#1A1A2E" }} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#1A1A2E]/40 mb-0.5">Check your inbox</p>
          <p className="text-sm text-[#1A1A2E]/70">A 6-digit verification code was sent to your email address.</p>
        </div>
      </div>

      <div>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder={tr.auth.verify.codePlaceholder}
          className={`w-full border bg-white h-14 text-center text-3xl font-bold tracking-[0.5em] focus:outline-none transition-colors ${
            error ? "border-red-400" : "border-[#1A1A2E]/15 focus:border-[#C9A84C]"
          }`}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>

      <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={code.length !== 6}
        className="h-12 gap-2"
      >
        <CheckIcon sx={{ fontSize: 15 }} />
        {tr.auth.verify.submit}
      </Button>

      <p className="text-center text-xs text-[#1A1A2E]/40">
        Didn&apos;t receive the email? Check your spam folder.
      </p>
    </form>
  );
}

// ─── Reset Form ───────────────────────────────────────────────────────────────
function ResetForm({ switchTo }: { switchTo: (v: ModalView) => void }) {
  const { tr } = useLang();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError(tr.common.invalidEmail); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 800);
  };

  if (sent) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckIcon sx={{ fontSize: 24, color: "#16a34a" }} />
        </div>
        <div>
          <p className="font-display font-bold text-[#1A1A2E] text-lg">{tr.auth.reset.checkEmail}</p>
          <p className="text-[#1A1A2E]/50 text-sm mt-1">
            {tr.auth.reset.sentMessage.replace("{email}", email)}
          </p>
        </div>
        <Button onClick={() => switchTo("login")} className="gap-2">
          {tr.auth.reset.backToSignIn}
          <ArrowForwardIcon sx={{ fontSize: 15 }} />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-[#1A1A2E]/60 text-sm leading-relaxed">{tr.auth.reset.description}</p>

      <div>
        <TextInput
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={tr.auth.reset.emailPlaceholder}
          error={error}
          icon={<MailOutlineIcon sx={{ fontSize: 15, color: "rgba(26,26,46,0.4)" }} />}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>

      <Button type="submit" fullWidth loading={loading} className="h-12 gap-2">
        {tr.auth.reset.submit}
        <ArrowForwardIcon sx={{ fontSize: 15 }} />
      </Button>

      <p className="text-center text-xs text-[#1A1A2E]/50">
        {tr.auth.reset.hasPassword}{" "}
        <button type="button" onClick={() => switchTo("login")} className="text-[#C9A84C] font-semibold hover:underline">
          {tr.auth.reset.signIn}
        </button>
      </p>
    </form>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
type ModalView = "login" | "register" | "reset" | "verify";

export default function AuthModal() {
  const { authModal, closeAuth } = useAuth();
  const { tr } = useLang();
  const [view, setView] = useState<ModalView>("login");

  useEffect(() => {
    if (authModal) setView(authModal as ModalView);
  }, [authModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (authModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [authModal]);

  if (!authModal) return null;

  const titles: Record<ModalView, { heading: string; sub: string }> = {
    login:    { heading: tr.auth.login.heading,    sub: tr.auth.login.sub },
    register: { heading: tr.auth.register.heading, sub: tr.auth.register.sub },
    reset:    { heading: tr.auth.reset.heading,    sub: tr.auth.reset.sub },
    verify:   { heading: tr.auth.verify.heading,   sub: tr.auth.verify.sub },
  };

  const { heading, sub } = titles[view] ?? titles.login;
  const showTabs = view === "login" || view === "register";

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={closeAuth}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-none" />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#FAF7F2] shadow-[0_25px_50px_rgba(0,0,0,0.4)] overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative dark-gradient px-8 py-7 flex-shrink-0">
          <div className="absolute top-0 end-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={fodaLogo} alt="FODA" className="h-10 w-auto object-contain [filter:invert(1)_hue-rotate(180deg)]" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">{heading}</h2>
              <p className="text-white/50 text-sm mt-1">{sub}</p>
            </div>
            <button
              onClick={closeAuth}
              className="flex-shrink-0 w-8 h-8 border border-white/15 flex items-center justify-center text-white/50 hover:border-white/40 hover:text-white transition-colors"
            >
              <CloseIcon sx={{ fontSize: 15 }} />
            </button>
          </div>
          {showTabs && (
            <div className="relative z-10 flex gap-1 mt-5 bg-white/5 p-1">
              {(["login", "register"] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`flex-1 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
                    view === id ? "gold-gradient text-[#1A1A2E]" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {id === "login" ? tr.auth.login.tab : tr.auth.register.tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-8 py-6 overflow-y-auto">
          {view === "login" && <LoginForm switchTo={setView} />}
          {view === "register" && <RegisterForm switchTo={setView} />}
          {view === "reset" && <ResetForm switchTo={setView} />}
          {view === "verify" && <VerifyForm />}
        </div>
      </div>
    </div>,
    document.body
  );
}
