import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { translations, type Lang, type Translations } from "../translations";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: Translations;
  isRTL: boolean;
}

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "foda_lang";
const DEFAULT_LANG: Lang = "ar";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "en" ? "en" : DEFAULT_LANG;
  });

  const setLang = (l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  };

  // Apply dir + lang to <html> whenever language changes
  useEffect(() => {
    const html = document.documentElement;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    html.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider
      value={{ lang, setLang, tr: translations[lang], isRTL: lang === "ar" }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
