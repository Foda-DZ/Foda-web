import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import TextInput from "./TextInput";

interface PasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  error,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <TextInput
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        icon={<Lock size={14} className="text-[#1A1A2E]/40" />}
        suffix={
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A2E]/30 hover:text-[#1A1A2E]/60 transition-colors"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
