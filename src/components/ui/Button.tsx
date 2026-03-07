import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "dark" | "outline-gold";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  gold: "bg-[#C9A84C] text-[#1A1A2E] hover:bg-[#b8943e] border border-[#C9A84C]",
  dark: "bg-[#1A1A2E] text-white hover:bg-[#2a2a3e] border border-[#1A1A2E]",
  "outline-gold":
    "bg-transparent text-[#C9A84C] border border-[#C9A84C] hover:bg-[#C9A84C]/10",
};

export default function Button({
  variant = "gold",
  loading = false,
  disabled,
  children,
  fullWidth,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "relative flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold tracking-wider transition-all duration-200",
        variantClasses[variant],
        fullWidth ? "w-full" : "",
        disabled || loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
