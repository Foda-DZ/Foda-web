import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLang } from "../context/LangContext";
import SellerAuthForm from "../components/seller/SellerAuthForm";
import type { SellerAuthView } from "../components/seller/SellerAuthForm";
import fodaLogo from "../assets/Foda-Logo (1).png";

export default function SellerAuthPage() {
  const [params] = useSearchParams();
  const { tr } = useLang();
  const view: SellerAuthView = params.get("mode") === "login" ? "login" : "register";

  return (
    <main className="relative min-h-screen bg-charcoal overflow-hidden flex flex-col items-center justify-center px-6 py-12">
      {/* decorative glows */}
      <div className="absolute -top-24 inset-e-0 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -inset-s-24 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* back to landing */}
      <Link
        to="/sell"
        className="absolute top-6 inset-s-6 flex items-center gap-2 text-white/50 hover:text-white text-xs font-semibold transition-colors duration-200"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
        {tr.sell.badge}
      </Link>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <Link to="/" className="mb-8">
          <img
            src={fodaLogo}
            alt="FODA"
            className="h-10 w-auto object-contain filter-[invert(1)_hue-rotate(180deg)]"
          />
        </Link>

        <SellerAuthForm initialView={view} />
      </div>
    </main>
  );
}
