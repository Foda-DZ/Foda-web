import { useState, useEffect } from "react";
import { X, Mail, User, Check, ArrowRight, AlertCircle, Store, ShoppingBag as BagIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import type { UserRole } from "../types";
import TextInput from "./ui/TextInput";
import PasswordInput from "./ui/PasswordInput";
import Spinner from "./ui/Spinner";
import fodaLogo from "../assets/Foda-Logo (1).png";

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({
  switchTo,
}: {
  switchTo: (v: ModalView) => void;
}) {
  const navigate = useNavigate();
  const { login, openReset } = useAuth();
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

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    setTimeout(() => {
      const result = login({ email, password });
      setLoading(false);
      if ("success" in result) {
        if (result.session.role === "seller") {
          navigate(result.session.isActive ? "/seller/dashboard" : "/seller/pending");
        }
        // buyers: modal auto-closes (setAuthModal(null) called in login)
      } else {
        setApiError(result.error);
      }
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput type="email" value={email} onChange={setEmail}
        placeholder={tr.auth.login.emailPlaceholder} error={errors.email} icon={Mail} />
      <PasswordInput value={password} onChange={setPassword}
        placeholder={tr.auth.login.passwordPlaceholder} error={errors.password} />
      <div className="flex justify-end">
        <button type="button" onClick={openReset} className="text-xs text-[#C9A84C] hover:underline">
          {tr.auth.login.forgotPassword}
        </button>
      </div>
      {apiError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-600">
          <AlertCircle size={13} /> {apiError}
        </div>
      )}
      <button type="submit" disabled={loading}
        className="btn-gold w-full h-12 flex items-center justify-center gap-2 group disabled:opacity-70">
        {loading ? <Spinner /> : (
          <>{tr.auth.login.submit}{" "}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-[#1A1A2E]/50">
        {tr.auth.login.noAccount}{" "}
        <button type="button" onClick={() => switchTo("register")}
          className="text-[#C9A84C] font-semibold hover:underline">
          {tr.auth.login.createOne}
        </button>
      </p>
    </form>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm({
  switchTo,
}: {
  switchTo: (v: ModalView) => void;
}) {
  const { register } = useAuth();
  const { tr } = useLang();
  const [role, setRole] = useState<UserRole>("buyer");
  const [fields, setFields] = useState({
    firstName: "", lastName: "", email: "", password: "", confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof fields) => (val: string) =>
    setFields((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fields.firstName.trim()) e.firstName = tr.common.required;
    if (!fields.lastName.trim()) e.lastName = tr.common.required;
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

  const strengthLabels = ["", tr.auth.register.strength.weak, tr.auth.register.strength.fair,
    tr.auth.register.strength.good, tr.auth.register.strength.strong];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    setTimeout(() => {
      const result = register({
        firstName: fields.firstName.trim(),
        lastName: fields.lastName.trim(),
        email: fields.email.trim(),
        password: fields.password,
        role,
      });
      setLoading(false);
      if ("error" in result) setApiError(result.error);
      // On success, authModal switches to "verify" automatically
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role toggle */}
      <div className="flex gap-1 bg-[#1A1A2E]/5 p-1">
        {([
          { value: "buyer" as UserRole, label: "Shop as Buyer", Icon: BagIcon },
          { value: "seller" as UserRole, label: "Join as Seller", Icon: Store },
        ]).map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
              role === value
                ? "gold-gradient text-[#1A1A2E]"
                : "text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70"
            }`}
          >
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>
      {role === "seller" && (
        <div className="bg-[#C9A84C]/8 border border-[#C9A84C]/25 px-3 py-2.5 text-xs text-[#1A1A2E]/60 leading-relaxed">
          Seller accounts require admin approval before accessing the dashboard.
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <TextInput value={fields.firstName} onChange={set("firstName")}
          placeholder={tr.auth.register.firstNamePlaceholder} error={errors.firstName} icon={User} />
        <TextInput value={fields.lastName} onChange={set("lastName")}
          placeholder={tr.auth.register.lastNamePlaceholder} error={errors.lastName} icon={User} />
      </div>
      <TextInput type="email" value={fields.email} onChange={set("email")}
        placeholder={tr.auth.register.emailPlaceholder} error={errors.email} icon={Mail} />
      <div>
        <PasswordInput value={fields.password} onChange={set("password")}
          placeholder={tr.auth.register.passwordPlaceholder} error={errors.password} />
        {fields.password && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-[#1A1A2E]/10"}`} />
              ))}
            </div>
            <p className="text-[10px] text-[#1A1A2E]/50">{strengthLabels[strength]}</p>
          </div>
        )}
      </div>
      <PasswordInput value={fields.confirm} onChange={set("confirm")}
        placeholder={tr.auth.register.confirmPlaceholder} error={errors.confirm} />
      {apiError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-600">
          <AlertCircle size={13} /> {apiError}
        </div>
      )}
      <button type="submit" disabled={loading}
        className="btn-gold w-full h-12 flex items-center justify-center gap-2 group disabled:opacity-70">
        {loading ? <Spinner /> : (
          <>{tr.auth.register.submit}{" "}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-[#1A1A2E]/50">
        {tr.auth.register.hasAccount}{" "}
        <button type="button" onClick={() => switchTo("login")}
          className="text-[#C9A84C] font-semibold hover:underline">
          {tr.auth.register.signIn}
        </button>
      </p>
    </form>
  );
}

// ─── Verify Form ──────────────────────────────────────────────────────────────
function VerifyForm() {
  const navigate = useNavigate();
  const { verifyEmail, resendCode, pendingVerification } = useAuth();
  const { tr } = useLang();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendFlash, setResendFlash] = useState(false);

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (code.trim().length !== 6) { setError(tr.auth.verify.invalidCode); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = verifyEmail(code);
      setLoading(false);
      if ("error" in result) {
        setError(tr.auth.verify.invalidCode);
      } else if (result.session.role === "seller") {
        navigate(result.session.isActive ? "/seller/dashboard" : "/seller/pending");
      }
    }, 600);
  };

  const handleResend = () => {
    resendCode();
    setCode("");
    setError("");
    setResendFlash(true);
    setTimeout(() => setResendFlash(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-[#1A1A2E]/60 leading-relaxed">
        {tr.auth.verify.codeSent}{" "}
        <span className="font-semibold text-[#1A1A2E]">{pendingVerification?.email}</span>
      </p>

      <div className="flex items-center gap-4 bg-[#C9A84C]/8 border border-[#C9A84C]/25 px-4 py-3">
        <div className="w-9 h-9 gold-gradient flex items-center justify-center flex-shrink-0">
          <Mail size={15} className="text-[#1A1A2E]" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#1A1A2E]/40 mb-0.5">
            {tr.auth.verify.demoNote}
          </p>
          <p className="font-display font-black text-[#1A1A2E] text-2xl tracking-[0.35em]">
            {pendingVerification?.code}
          </p>
        </div>
      </div>

      <div>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder={tr.auth.verify.codePlaceholder}
          maxLength={6}
          inputMode="numeric"
          className={`w-full h-14 border-2 text-center text-3xl font-bold tracking-[0.5em] bg-white outline-none transition-colors duration-200 ${
            error
              ? "border-red-400 text-red-600"
              : "border-[#1A1A2E]/12 focus:border-[#C9A84C] text-[#1A1A2E]"
          }`}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle size={11} /> {error}
          </p>
        )}
      </div>

      {resendFlash && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2.5 text-xs text-green-600">
          <Check size={13} /> {tr.auth.verify.resendSuccess}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className="btn-gold w-full h-12 flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? <Spinner /> : <><Check size={15} /> {tr.auth.verify.submit}</>}
      </button>

      <button
        type="button"
        onClick={handleResend}
        className="w-full text-center text-xs text-[#1A1A2E]/40 hover:text-[#C9A84C] transition-colors duration-200"
      >
        {tr.auth.verify.resend}
      </button>
    </form>
  );
}

// ─── Reset Form ───────────────────────────────────────────────────────────────
function ResetForm({
  switchTo,
}: {
  switchTo: (v: ModalView) => void;
}) {
  const { sendReset } = useAuth();
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
      sendReset({ email });
      setLoading(false);
      setSent(true);
    }, 800);
  };

  if (sent) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check size={24} className="text-green-600" />
        </div>
        <div>
          <p className="font-display font-bold text-[#1A1A2E] text-lg">{tr.auth.reset.checkEmail}</p>
          <p className="text-[#1A1A2E]/50 text-sm mt-1">
            {tr.auth.reset.sentMessage.replace("{email}", email)}
          </p>
        </div>
        <button type="button" onClick={() => switchTo("login")}
          className="btn-gold mx-auto flex items-center gap-2 group">
          {tr.auth.reset.backToSignIn}{" "}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-[#1A1A2E]/60 text-sm leading-relaxed">{tr.auth.reset.description}</p>
      <TextInput type="email" value={email} onChange={setEmail}
        placeholder={tr.auth.reset.emailPlaceholder} error={error} icon={Mail} />
      <button type="submit" disabled={loading}
        className="btn-gold w-full h-12 flex items-center justify-center gap-2 group disabled:opacity-70">
        {loading ? <Spinner /> : (
          <>{tr.auth.reset.submit}{" "}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-[#1A1A2E]/50">
        {tr.auth.reset.hasPassword}{" "}
        <button type="button" onClick={() => switchTo("login")}
          className="text-[#C9A84C] font-semibold hover:underline">
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

  useEffect(() => {
    document.body.style.overflow = authModal ? "hidden" : "";
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

  return (
    <>
      <div
        className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm"
        style={{ animation: "fadeIn .2s ease" }}
        onClick={closeAuth}
      />
      <div className="fixed inset-0 z-[301] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-[#FAF7F2] w-full max-w-md shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
          style={{ animation: "scaleIn .28s cubic-bezier(.4,0,.2,1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative dark-gradient px-8 py-7">
            <div className="absolute top-0 end-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={fodaLogo}
                    alt="FODA"
                    className="h-10 w-auto object-contain [filter:invert(1)_hue-rotate(180deg)]"
                  />
                </div>
                <h2 className="font-display text-2xl font-bold text-white">{heading}</h2>
                <p className="text-white/50 text-sm mt-1">{sub}</p>
              </div>
              <button
                onClick={closeAuth}
                className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all duration-200 flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {showTabs && (
              <div className="relative z-10 flex gap-1 mt-5 bg-white/5 p-1">
                {(["login", "register"] as const).map((id) => (
                  <button
                    key={id}
                    onClick={() => setView(id)}
                    className={`flex-1 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
                      view === id
                        ? "gold-gradient text-[#1A1A2E]"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {id === "login" ? tr.auth.login.tab : tr.auth.register.tab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="px-8 py-6 overflow-y-auto flex-1">
            {view === "login"    && <LoginForm    switchTo={setView} />}
            {view === "register" && <RegisterForm switchTo={setView} />}
            {view === "reset"    && <ResetForm    switchTo={setView} />}
            {view === "verify"   && <VerifyForm />}
          </div>
        </div>
      </div>
    </>
  );
}
