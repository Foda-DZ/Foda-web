import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Mail,
  User,
  Check,
  ArrowRight,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import TextInput from "./ui/TextInput";
import PasswordInput from "./ui/PasswordInput";
import Button from "./ui/Button";
import SocialAuthButtons from "./auth/SocialAuthButtons";
import fodaLogo from "../assets/Foda-Logo (1).png";

const inputIcon = (Icon: typeof Mail) => (
  <Icon size={15} className="text-charcoal/40" />
);

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({
  switchTo,
  redirectTo,
}: {
  switchTo: (v: ModalView) => void;
  redirectTo: string | null;
}) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { tr } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
        role: "customer",
      });
      if (redirectTo) navigate(redirectTo);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <SocialAuthButtons />

      <div>
        <TextInput
          type="email"
          value={email}
          onChange={setEmail}
          label={tr.auth.labels.email}
          placeholder={tr.auth.login.emailPlaceholder}
          error={errors.email}
          icon={inputIcon(Mail)}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <PasswordInput
        value={password}
        onChange={setPassword}
        label={tr.auth.labels.password}
        placeholder={tr.auth.login.passwordPlaceholder}
        error={errors.password}
      />

      <div className="flex justify-end -mt-1">
        <button
          type="button"
          onClick={() => switchTo("reset")}
          className="text-xs text-charcoal/50 hover:text-gold transition-colors"
        >
          {tr.auth.login.forgotPassword}
        </button>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 leading-relaxed">
          {apiError}
        </div>
      )}

      <Button type="submit" fullWidth loading={loading} className="h-12 gap-2">
        {tr.auth.login.submit}
        <ArrowRight size={15} />
      </Button>

      <p className="text-center text-xs text-charcoal/50">
        {tr.auth.login.noAccount}{" "}
        <button
          type="button"
          onClick={() => switchTo("register")}
          className="text-gold font-semibold hover:underline"
        >
          {tr.auth.login.createOne}
        </button>
      </p>
    </form>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm({ switchTo }: { switchTo: (v: ModalView) => void }) {
  const { registerCustomer } = useAuth();
  const { tr } = useLang();
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof fields) => (val: string) =>
    setFields((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fields.fullName.trim()) e.fullName = tr.common.required;
    if (!fields.email.trim()) e.email = tr.common.required;
    else if (!/\S+@\S+\.\S+/.test(fields.email))
      e.email = tr.common.invalidEmail;
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

  const strengthLabels = [
    "",
    tr.auth.register.strength.weak,
    tr.auth.register.strength.fair,
    tr.auth.register.strength.good,
    tr.auth.register.strength.strong,
  ];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-yellow-400",
    "bg-blue-400",
    "bg-green-500",
  ][strength];

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      await registerCustomer({
        fullName: fields.fullName.trim(),
        email: fields.email.trim().toLowerCase(),
        password: fields.password,
      });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <SocialAuthButtons />

      <div>
        <TextInput
          value={fields.fullName}
          onChange={set("fullName")}
          label={tr.auth.labels.fullName}
          placeholder={tr.auth.register.fullNamePlaceholder}
          error={errors.fullName}
          icon={inputIcon(User)}
        />
        {errors.fullName && (
          <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>
        )}
      </div>

      <div>
        <TextInput
          type="email"
          value={fields.email}
          onChange={set("email")}
          label={tr.auth.labels.email}
          placeholder={tr.auth.register.emailPlaceholder}
          error={errors.email}
          icon={inputIcon(Mail)}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <PasswordInput
          value={fields.password}
          onChange={set("password")}
          label={tr.auth.labels.password}
          placeholder={tr.auth.register.passwordPlaceholder}
          error={errors.password}
        />
        {fields.password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-charcoal/10"}`}
                />
              ))}
            </div>
            <p className="text-[10px] text-charcoal/50 shrink-0 w-12 text-end">
              {strengthLabels[strength]}
            </p>
          </div>
        )}
      </div>

      <PasswordInput
        value={fields.confirm}
        onChange={set("confirm")}
        label={tr.auth.labels.confirm}
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
        <ArrowRight size={15} />
      </Button>

      <p className="text-center text-xs text-charcoal/50">
        {tr.auth.register.hasAccount}{" "}
        <button
          type="button"
          onClick={() => switchTo("login")}
          className="text-gold font-semibold hover:underline"
        >
          {tr.auth.register.signIn}
        </button>
      </p>
    </form>
  );
}

// ─── Verify Form ──────────────────────────────────────────────────────────────
function VerifyForm({ redirectTo }: { redirectTo: string | null }) {
  const navigate = useNavigate();
  const { verifyEmail, pendingEmail } = useAuth();
  const { tr } = useLang();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (code.trim().length !== 6) {
      setError(tr.auth.verify.invalidCode);
      return;
    }
    if (!pendingEmail) {
      setError("Missing email. Please start again.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyEmail({
        email: pendingEmail.trim().toLowerCase(),
        verificationCode: parseInt(code, 10),
      });
      if (redirectTo) navigate(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : tr.auth.verify.invalidCode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3 bg-gold/8 border border-gold/25 px-4 py-3">
        <div className="w-9 h-9 gold-gradient flex items-center justify-center shrink-0">
          <Mail size={16} className="text-charcoal" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-0.5">
            {tr.auth.verify.codeSent}
          </p>
          <p className="text-sm font-semibold text-charcoal break-all">
            {pendingEmail}
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="verify-code"
          className="block mb-1.5 text-xs font-semibold text-charcoal/70"
        >
          {tr.auth.labels.code}
        </label>
        <input
          id="verify-code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder={tr.auth.verify.codePlaceholder}
          className={`w-full border bg-white h-14 text-center text-3xl font-bold tracking-[0.5em] focus:outline-none transition-colors ${
            error ? "border-red-400" : "border-charcoal/15 focus:border-gold"
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
        <Check size={15} />
        {tr.auth.verify.submit}
      </Button>
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
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError(tr.common.invalidEmail);
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  if (sent) {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check size={24} className="text-green-600" />
        </div>
        <div>
          <p className="font-display font-bold text-charcoal text-lg">
            {tr.auth.reset.checkEmail}
          </p>
          <p className="text-charcoal/50 text-sm mt-1">
            {tr.auth.reset.sentMessage.replace("{email}", email)}
          </p>
        </div>
        <Button onClick={() => switchTo("login")} className="gap-2">
          {tr.auth.reset.backToSignIn}
          <ArrowRight size={15} />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-charcoal/60 text-sm leading-relaxed">
        {tr.auth.reset.description}
      </p>

      <div>
        <TextInput
          type="email"
          value={email}
          onChange={setEmail}
          label={tr.auth.labels.email}
          placeholder={tr.auth.reset.emailPlaceholder}
          error={error}
          icon={inputIcon(Mail)}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>

      <Button type="submit" fullWidth loading={loading} className="h-12 gap-2">
        {tr.auth.reset.submit}
        <ArrowRight size={15} />
      </Button>

      <p className="text-center text-xs text-charcoal/50">
        {tr.auth.reset.hasPassword}{" "}
        <button
          type="button"
          onClick={() => switchTo("login")}
          className="text-gold font-semibold hover:underline"
        >
          {tr.auth.reset.signIn}
        </button>
      </p>
    </form>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
type ModalView = "login" | "register" | "reset" | "verify";

export default function AuthModal() {
  const { authModal, authRedirectTo, closeAuth } = useAuth();
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [authModal]);

  if (!authModal) return null;

  const titles: Record<ModalView, { heading: string; sub: string }> = {
    login: { heading: tr.auth.login.heading, sub: tr.auth.login.sub },
    register: { heading: tr.auth.register.heading, sub: tr.auth.register.sub },
    reset: { heading: tr.auth.reset.heading, sub: tr.auth.reset.sub },
    verify: { heading: tr.auth.verify.heading, sub: tr.auth.verify.sub },
  };

  const { heading, sub } = titles[view] ?? titles.login;
  const showTabs = view === "login" || view === "register";

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      onClick={closeAuth}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-none" />
      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-md bg-cream shadow-[0_25px_50px_rgba(0,0,0,0.4)] overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative dark-gradient px-7 pt-6 pb-5">
          {/* decorative glows */}
          <div className="absolute -top-8 inset-e-0 w-40 h-40 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -inset-s-6 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <img
                src={fodaLogo}
                alt="FODA"
                className="h-8 w-auto object-contain filter-[invert(1)_hue-rotate(180deg)] mb-3"
              />
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                {heading}
                {view === "register" && (
                  <Sparkles size={18} className="text-gold" />
                )}
              </h2>
              <p className="text-white/50 text-sm mt-0.5">{sub}</p>
            </div>
            <button
              onClick={closeAuth}
              aria-label="Close"
              className="shrink-0 w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-white/40 hover:text-white hover:rotate-90 transition-all duration-200"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-5">
          {view === "login" && (
            <LoginForm switchTo={setView} redirectTo={authRedirectTo} />
          )}
          {view === "register" && <RegisterForm switchTo={setView} />}
          {view === "reset" && <ResetForm switchTo={setView} />}
          {view === "verify" && <VerifyForm redirectTo={authRedirectTo} />}

          {showTabs && (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-charcoal/40">
              <ShieldCheck size={12} className="text-gold" />
              {tr.auth.terms}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
