import { useLang } from "../../context/LangContext";

// ─── Brand SVG marks ────────────────────────────────────────────────────────
export function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07Z"
      />
    </svg>
  );
}

interface SocialAuthButtonsProps {
  /** Role passed to the OAuth entrypoint so the backend provisions the right account. */
  role?: "customer" | "seller";
  /** Divider label below the buttons. Defaults to the shared "or continue with email". */
  dividerLabel?: string;
}

// ─── Social auth row ──────────────────────────────────────────────────────────
export default function SocialAuthButtons({
  role = "customer",
  dividerLabel,
}: SocialAuthButtonsProps) {
  const { tr } = useLang();

  const handleProvider = (provider: "google" | "facebook") => {
    // OAuth redirect entrypoint — wired to backend when available.
    const base = import.meta.env.VITE_API_BASE_URL ?? "";
    window.location.href = `${base}/auth/${provider}?role=${role}`;
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleProvider("google")}
          className="flex items-center justify-center gap-2 h-11 border border-charcoal/15 bg-white text-charcoal text-xs font-semibold hover:border-charcoal/35 hover:shadow-sm transition-all duration-200"
        >
          <GoogleMark /> Google
        </button>
        <button
          type="button"
          onClick={() => handleProvider("facebook")}
          className="flex items-center justify-center gap-2 h-11 border border-charcoal/15 bg-white text-charcoal text-xs font-semibold hover:border-charcoal/35 hover:shadow-sm transition-all duration-200"
        >
          <FacebookMark /> Facebook
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-charcoal/10" />
        <span className="text-[10px] uppercase tracking-widest text-charcoal/35">
          {dividerLabel ?? tr.auth.socialDivider}
        </span>
        <span className="h-px flex-1 bg-charcoal/10" />
      </div>
    </div>
  );
}
