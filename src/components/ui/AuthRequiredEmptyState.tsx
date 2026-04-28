import type { ReactNode } from "react";

interface AuthRequiredEmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  helperText?: string;
  ctaLabel: string;
  onCta: () => void;
}

export default function AuthRequiredEmptyState({
  icon,
  title,
  subtitle,
  helperText,
  ctaLabel,
  onCta,
}: AuthRequiredEmptyStateProps) {
  return (
    <div className="max-w-xl mx-auto text-center bg-white border border-[#1A1A2E]/8 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(26,26,46,0.08)]">
      <div className="relative w-28 h-28 mx-auto mb-6">
        <div className="absolute inset-0 rounded-[28px] gold-gradient rotate-6 animate-pulse-glow" />
        <div className="absolute inset-0 rounded-[28px] bg-[#1A1A2E] -rotate-6 opacity-85" />
        <div className="absolute inset-[10px] rounded-2xl bg-white flex items-center justify-center animate-float">
          {icon}
        </div>
      </div>

      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1A1A2E] mb-2">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-[#1A1A2E]/55 leading-relaxed mb-6">
        {subtitle}
      </p>

      {helperText && (
        <p className="text-xs text-[#1A1A2E]/35 mb-6">{helperText}</p>
      )}

      <button
        onClick={onCta}
        className="btn-dark px-8 py-3 text-sm font-semibold tracking-wider"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
