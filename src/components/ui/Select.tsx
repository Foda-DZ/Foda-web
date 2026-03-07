interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  error,
  disabled,
  fullWidth = true,
  placeholder,
}: SelectProps) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/60 mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={[
          "border bg-white py-2.5 px-3 text-sm text-[#1A1A2E] focus:outline-none transition-colors appearance-none cursor-pointer",
          fullWidth ? "w-full" : "",
          error
            ? "border-red-400 focus:border-red-400"
            : "border-[#1A1A2E]/15 focus:border-[#C9A84C]",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          !value ? "text-[#1A1A2E]/40" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
