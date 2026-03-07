import type { ReactNode, InputHTMLAttributes } from "react";

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "error"> {
  value: string;
  onChange: (val: string) => void;
  /** Any ReactNode displayed as a left icon inside the input */
  icon?: ReactNode;
  /** Any ReactNode (e.g. show/hide button) absolutely positioned on the right */
  suffix?: ReactNode;
  /** Error string — turns border red. Caller is responsible for rendering error text. */
  error?: string;
}

export default function TextInput({
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  suffix,
  error,
  disabled,
  className = "",
  ...rest
}: TextInputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={[
          "w-full border bg-white py-2.5 text-sm text-[#1A1A2E] placeholder:text-[#1A1A2E]/30",
          "focus:outline-none transition-colors appearance-none",
          icon ? "pl-8 pr-3" : "px-3",
          suffix ? "pr-10" : "",
          error
            ? "border-red-400 focus:border-red-400"
            : "border-[#1A1A2E]/15 focus:border-[#C9A84C]",
          disabled ? "opacity-50 cursor-not-allowed bg-[#FAF7F2]" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
      {suffix}
    </div>
  );
}
