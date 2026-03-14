import LanguageIcon from "@mui/icons-material/Language";
import { useLang } from "../context/LangContext";

export default function LanguageSwitch() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      aria-label="Switch language"
      className="flex items-center gap-1 text-[#1A1A2E]/70 hover:text-[#1A1A2E] transition-colors duration-200"
    >
      <span className="text-sm font-semibold tracking-wide uppercase">
        {lang === "ar" ? "EN" : "AR"}
      </span>
      <LanguageIcon sx={{ fontSize: 26 }} />
    </button>
  );
}
