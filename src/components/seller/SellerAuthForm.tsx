import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, ArrowRight, Check, Mail } from "lucide-react";
import { useLang } from "../../context/LangContext";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import TextInput from "../ui/TextInput";
import PasswordInput from "../ui/PasswordInput";
import Button from "../ui/Button";
import SocialAuthButtons from "../auth/SocialAuthButtons";

export type SellerAuthView = "register" | "login" | "verify";

interface SellerAuthFormProps {
  initialView: SellerAuthView;
}

export default function SellerAuthForm({ initialView }: SellerAuthFormProps) {
  const navigate = useNavigate();
  const { login, verifyEmail } = useAuth();
  const { tr } = useLang();
  const f = tr.sell.form;

  const [view, setView] = useState<SellerAuthView>(initialView);
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateAuth = () => {
    const e: Record<string, string> = {};
    if (view === "register" && !shopName.trim()) e.shopName = tr.common.required;
    if (!email.trim()) e.email = tr.common.required;
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = tr.common.invalidEmail;
    if (!password) e.password = tr.common.required;
    else if (view === "register" && password.length < 8)
      e.password = tr.common.required;
    return e;
  };

  const handleRegister = async () => {
    await authService.registerSeller({
      shopName: shopName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    setView("verify");
  };

  const handleLogin = async () => {
    await login({
      email: email.trim().toLowerCase(),
      password,
      role: "seller",
    });
    navigate("/seller/dashboard");
  };

  const handleVerify = async () => {
    if (code.trim().length !== 6) {
      setErrors({ code: tr.auth.verify.invalidCode });
      return;
    }
    await verifyEmail({
      email: email.trim().toLowerCase(),
      verificationCode: parseInt(code, 10),
    });
    navigate("/seller/dashboard");
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setApiError("");
    if (view !== "verify") {
      const e = validateAuth();
      if (Object.keys(e).length) {
        setErrors(e);
        return;
      }
    }
    setErrors({});
    setLoading(true);
    try {
      if (view === "register") await handleRegister();
      else if (view === "login") await handleLogin();
      else await handleVerify();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const heading =
    view === "register"
      ? f.registerHeading
      : view === "login"
        ? f.loginHeading
        : f.verifyHeading;
  const sub =
    view === "register"
      ? f.registerSub
      : view === "login"
        ? f.loginSub
        : f.verifySub;

  return (
    <div className="w-full max-w-md bg-cream rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden">
      {/* card header */}
      <div className="relative dark-gradient px-7 pt-6 pb-5">
        <div className="absolute -top-8 inset-e-0 w-40 h-40 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <span className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center shrink-0">
            <Store size={20} className="text-charcoal" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {heading}
            </h2>
            <p className="text-white/50 text-xs mt-0.5">{sub}</p>
          </div>
        </div>
      </div>

      {/* card body */}
      <form onSubmit={handleSubmit} className="px-7 py-6 space-y-3.5">
        {view !== "verify" && <SocialAuthButtons role="seller" />}

        {view === "register" && (
          <div>
            <TextInput
              value={shopName}
              onChange={setShopName}
              label={f.shopNameLabel}
              placeholder={f.shopNamePlaceholder}
              error={errors.shopName}
              icon={<Store size={15} className="text-charcoal/40" />}
            />
            {errors.shopName && (
              <p className="mt-1.5 text-xs text-red-500">{errors.shopName}</p>
            )}
          </div>
        )}

        {view !== "verify" && (
          <>
            <div>
              <TextInput
                type="email"
                value={email}
                onChange={setEmail}
                label={f.emailLabel}
                placeholder="you@example.com"
                error={errors.email}
                icon={<Mail size={15} className="text-charcoal/40" />}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <PasswordInput
              value={password}
              onChange={setPassword}
              label={f.passwordLabel}
              placeholder={tr.auth.register.passwordPlaceholder}
              error={errors.password}
            />
          </>
        )}

        {view === "verify" && (
          <div>
            <label
              htmlFor="seller-verify-code"
              className="block mb-1.5 text-xs font-semibold text-charcoal/70"
            >
              {tr.auth.labels.code}
            </label>
            <input
              id="seller-verify-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder={tr.auth.verify.codePlaceholder}
              className={`w-full border bg-white h-14 text-center text-3xl font-bold tracking-[0.5em] focus:outline-none transition-colors ${
                errors.code
                  ? "border-red-400"
                  : "border-charcoal/15 focus:border-gold"
              }`}
            />
            {errors.code && (
              <p className="mt-1.5 text-xs text-red-500">{errors.code}</p>
            )}
          </div>
        )}

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 leading-relaxed">
            {apiError}
          </div>
        )}

        <Button type="submit" fullWidth loading={loading} className="h-12 gap-2">
          {view === "register"
            ? f.submitRegister
            : view === "login"
              ? f.submitLogin
              : f.verifySubmit}
          {view === "verify" ? <Check size={15} /> : <ArrowRight size={15} />}
        </Button>

        {view !== "verify" && (
          <p className="text-center text-xs text-charcoal/50">
            {view === "register" ? f.haveAccount : f.noAccount}{" "}
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setApiError("");
                setView(view === "register" ? "login" : "register");
              }}
              className="text-gold font-semibold hover:underline"
            >
              {view === "register" ? f.switchToLogin : f.switchToRegister}
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
