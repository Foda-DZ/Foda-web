import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";

interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string;
  onChange: (val: string) => void;
  icon?: LucideIcon;
  suffix?: React.ReactNode;
  error?: string;
}

export default function TextInput({
  value,
  onChange,
  icon: Icon,
  suffix,
  error,
  className = "",
  ...rest
}: TextInputProps) {
  return (
    <div>
      <div
        className={`relative flex items-center border transition-colors duration-200 ${
          error
            ? "border-red-400 bg-red-50/30"
            : "border-[#1A1A2E]/15 bg-white focus-within:border-[#C9A84C]/60"
        }`}
      >
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3.5 text-[#1A1A2E]/30 flex-shrink-0"
          />
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-11 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/30 outline-none bg-transparent ${
            Icon ? "pl-10" : "pl-4"
          } ${suffix ? "pr-10" : "pr-4"} ${className}`}
          {...rest}
        />
        {suffix}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}
