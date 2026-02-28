import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "dark" | "outline-gold";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  gold: "btn-gold",
  dark: "btn-dark",
  "outline-gold": "btn-outline-gold",
};

export default function Button({
  variant = "gold",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${variantClass[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
