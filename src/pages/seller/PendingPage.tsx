import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import fodaLogo from "../../assets/Foda-Logo (1).png";

export default function PendingPage() {
  const { user, logout } = useAuth();
  const { tr, isRTL } = useLang();
  const t = tr.seller.pendingPage;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const steps = [
    { step: "1", text: t.step1 },
    { step: "2", text: t.step2 },
    { step: "3", text: t.step3 },
  ];

  return (
    <div
      className="min-h-screen bg-cream flex items-center justify-center px-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <img
            src={fodaLogo}
            alt="FODA"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-[#C9A84C]/10 border-2 border-[#C9A84C]/30 rounded-full flex items-center justify-center">
          <AccessTimeIcon sx={{ fontSize: 40, color: "#C9A84C" }} />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-bold text-[#1A1A2E]">
            {t.title}
          </h1>
          <p className="text-[#1A1A2E]/60 leading-relaxed">
            {t.hello}{" "}
            <span className="font-semibold text-[#1A1A2E]">
              {user?.fullName}
            </span>
            . {t.message}
          </p>
        </div>

        {/* Info box */}
        <div className="bg-white border border-[#1A1A2E]/8 p-5 text-start space-y-3">
          {steps.map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  step === "1"
                    ? "gold-gradient text-[#1A1A2E]"
                    : "border-2 border-[#1A1A2E]/15 text-[#1A1A2E]/30"
                }`}
              >
                {step === "1" ? <CheckIcon sx={{ fontSize: 14 }} /> : step}
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
            {t.browseStore}
            <ArrowForwardIcon
              sx={{ fontSize: 14 }}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 btn-dark flex items-center justify-center gap-2"
          >
            {t.signOut}
          </button>
        </div>
      </div>
    </div>
  );
}
