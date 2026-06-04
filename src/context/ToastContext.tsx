import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useLang } from "./LangContext";

export type ToastVariant = "success" | "info" | "error";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 3200;

const variantIcon: Record<ToastVariant, ReactNode> = {
  success: <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: "#1A1A2E" }} />,
  info: <InfoOutlinedIcon sx={{ fontSize: 16, color: "#1A1A2E" }} />,
  error: <ErrorOutlineIcon sx={{ fontSize: 16, color: "#1A1A2E" }} />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const { isRTL } = useLang();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_DURATION);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div
          className={`fixed top-6 z-[300] flex flex-col gap-2.5 ${
            isRTL ? "left-6" : "right-6"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 px-5 py-3.5 bg-[#1A1A2E] text-white shadow-2xl max-w-xs animate-dropdown"
            >
              <div className="shrink-0 w-8 h-8 gold-gradient flex items-center justify-center">
                {variantIcon[t.variant]}
              </div>
              <p className="flex-1 min-w-0 text-xs text-white/90 leading-snug">
                {t.message}
              </p>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
