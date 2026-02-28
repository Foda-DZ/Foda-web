import { Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import fodaLogo from "../../assets/Foda-Logo (1).png";

export default function PendingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <img src={fodaLogo} alt="FODA" className="h-20 w-auto object-contain" />
        </div>

        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-[#C9A84C]/10 border-2 border-[#C9A84C]/30 rounded-full flex items-center justify-center">
          <Clock size={40} className="text-[#C9A84C]" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-bold text-[#1A1A2E]">
            Application Under Review
          </h1>
          <p className="text-[#1A1A2E]/60 leading-relaxed">
            Hello,{" "}
            <span className="font-semibold text-[#1A1A2E]">
              {user?.firstName}
            </span>
            . Your seller account is pending admin approval. You'll be notified
            once your application is reviewed.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-white border border-[#1A1A2E]/8 p-5 text-start space-y-3">
          {[
            { step: "1", text: "Account created & email verified" },
            { step: "2", text: "Admin reviews your application" },
            { step: "3", text: "Approval granted — access dashboard" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  step === "1"
                    ? "gold-gradient text-[#1A1A2E]"
                    : "border-2 border-[#1A1A2E]/15 text-[#1A1A2E]/30"
                }`}
              >
                {step === "1" ? "✓" : step}
              </div>
              <span
                className={`text-sm ${step === "1" ? "text-[#1A1A2E]" : "text-[#1A1A2E]/40"}`}
              >
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 btn-outline-gold flex items-center justify-center gap-2 group"
          >
            Browse Store
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 btn-dark flex items-center justify-center gap-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
