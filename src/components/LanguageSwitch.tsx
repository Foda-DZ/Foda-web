import TranslateIcon from "@mui/icons-material/Translate";
import { useLang } from "../context/LangContext";

interface Props {
  scrolled?: boolean;
}

export default function LanguageSwitch({ scrolled = false }: Props) {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      aria-label="Switch language"
      className={`flex items-center justify-center transition-colors duration-300 ${
        scrolled
          ? "text-[#1A1A2E]/60 hover:text-[#C9A84C]"
          : "text-white/60 hover:text-[#E8C96B]"
      }`}
    >
      <TranslateIcon sx={{ fontSize: 20 }} />
    </button>
  );
}
