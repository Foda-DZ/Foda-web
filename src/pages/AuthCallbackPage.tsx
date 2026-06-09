import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth, type OAuthSessionUser } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import fodaLogo from "../assets/Foda-Logo (1).png";

/**
 * Lands here after the backend Google OAuth redirect. The backend places the
 * access token + session user in the URL *fragment* (never the query string, so
 * it stays out of server logs and the Referer header) and sets the refresh
 * token as an HTTP-only cookie. We hydrate the session, scrub the fragment from
 * the URL, then route the user to the right portal.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();
  const { tr } = useLang();
  const [error, setError] = useState<string | null>(null);
  // React 18 StrictMode mounts effects twice in dev — guard against double-run.
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const isAr = tr.dir === "rtl";
    const fail = (msg: string) => setError(msg);

    // Errors come back on the query string; success data on the fragment.
    const query = new URLSearchParams(window.location.search);
    if (query.get("error")) {
      fail(
        isAr
          ? "تعذّر تسجيل الدخول عبر Google. حاول مرة أخرى."
          : "Google sign-in failed. Please try again.",
      );
      return;
    }

    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = params.get("accessToken");
    const role = params.get("role");
    const encodedUser = params.get("user");

    if (!accessToken || !role || !encodedUser) {
      fail(
        isAr
          ? "رابط غير صالح. حاول تسجيل الدخول مرة أخرى."
          : "Invalid sign-in link. Please try again.",
      );
      return;
    }

    let user: OAuthSessionUser;
    try {
      // base64 → UTF-8 JSON (atob yields a binary string; decode it properly).
      const json = decodeURIComponent(escape(atob(encodedUser)));
      user = JSON.parse(json) as OAuthSessionUser;
    } catch {
      fail(
        isAr
          ? "تعذّرت قراءة بيانات الحساب."
          : "Could not read account data.",
      );
      return;
    }

    const normalisedRole = role === "seller" ? "seller" : "customer";
    const isNew = params.get("isNew") === "true";

    // Scrub the token from the URL/history before anything else renders.
    window.history.replaceState(null, "", window.location.pathname);

    try {
      const session = completeOAuthLogin({
        accessToken,
        role: normalisedRole,
        isNew,
        user,
      });
      navigate(session.role === "seller" ? "/seller/dashboard" : "/", {
        replace: true,
      });
    } catch {
      fail(
        isAr
          ? "حدث خطأ أثناء تسجيل الدخول."
          : "Something went wrong while signing you in.",
      );
    }
  }, [completeOAuthLogin, navigate, tr.dir]);

  const isAr = tr.dir === "rtl";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cream px-4"
      dir={tr.dir}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.12)] p-8 text-center">
        <img
          src={fodaLogo}
          alt="FODA"
          className="h-9 w-auto object-contain mx-auto mb-6"
        />

        {error ? (
          <>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <p className="text-sm text-charcoal/70 leading-relaxed mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="btn-dark h-11 px-6 text-sm font-semibold rounded-lg"
            >
              {isAr ? "العودة للرئيسية" : "Back to home"}
            </button>
          </>
        ) : (
          <>
            <Loader2
              size={28}
              className="text-gold animate-spin mx-auto mb-4"
            />
            <p className="text-sm text-charcoal/70">
              {isAr ? "جارٍ تسجيل دخولك..." : "Signing you in..."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
