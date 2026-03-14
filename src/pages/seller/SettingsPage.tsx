import { useState, useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../context/AuthContext";
import SellerLayout from "../../components/seller/SellerLayout";

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 0, bgcolor: "#fff" },
};

interface SettingsForm {
  shopName: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  logoPreview: string;
}

export default function SettingsPage() {
  const { user } = useAuth();

  const [form, setForm] = useState<SettingsForm>({
    shopName: user?.shopName || user?.fullName || "",
    description: "",
    phone: "",
    email: user?.email || "",
    address: "",
    logoPreview: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof SettingsForm>(key: K, val: SettingsForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => set("logoPreview", reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = (evt: React.FormEvent) => {
    evt.preventDefault();
    setSaving(true);
    // UI-only — simulate save
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  return (
    <SellerLayout>
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
            Store Settings
          </h1>
          <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
            Customize your store profile and contact information.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Store Identity */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-5">
            <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
              Store Identity
            </h2>

            {/* Logo upload */}
            <div className="flex items-center gap-5">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoFile}
              />
              {form.logoPreview ? (
                <div className="relative group">
                  <img
                    src={form.logoPreview}
                    alt="Store logo"
                    className="w-20 h-20 object-cover border border-[#1A1A2E]/10"
                  />
                  <div className="absolute inset-0 bg-[#1A1A2E]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="p-1.5 bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                      <CloudUploadIcon sx={{ fontSize: 14 }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => set("logoPreview", "")}
                      className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-[#1A1A2E]/15 hover:border-[#C9A84C]/50 hover:bg-[#FAF7F2] flex flex-col items-center justify-center gap-1 transition-all duration-200"
                >
                  <StorefrontIcon
                    sx={{ fontSize: 20, color: "rgba(26,26,46,0.25)" }}
                  />
                  <span className="text-[9px] font-semibold text-[#1A1A2E]/40 uppercase">
                    Logo
                  </span>
                </button>
              )}
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]">
                  Store Logo
                </p>
                <p className="text-xs text-[#1A1A2E]/40 mt-0.5">
                  JPG, PNG or WEBP. Max 2MB.
                </p>
              </div>
            </div>

            <TextField
              label="Shop Name *"
              value={form.shopName}
              onChange={(e) => set("shopName", e.target.value)}
              placeholder="My Fashion Store"
              fullWidth
              sx={inputSx}
            />
            <TextField
              label="Store Description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Tell customers about your store..."
              multiline
              rows={3}
              fullWidth
              sx={inputSx}
            />
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Phone Number"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="0555 XX XX XX"
                fullWidth
                sx={inputSx}
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="store@example.com"
                fullWidth
                sx={inputSx}
              />
            </div>
            <TextField
              label="Address"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Rue Didouche Mourad, Alger"
              fullWidth
              sx={inputSx}
            />
          </div>

          {/* Info banner */}
          <Alert severity="info" sx={{ borderRadius: 0 }}>
            Store settings are saved locally for now. Backend integration coming
            soon.
          </Alert>

          {/* Submit */}
          <div className="flex items-center gap-4 pb-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving || saved}
              startIcon={
                saved ? (
                  <CheckIcon sx={{ fontSize: 15 }} />
                ) : saving ? (
                  <CircularProgress
                    size={13}
                    thickness={4}
                    sx={{ color: "inherit" }}
                  />
                ) : undefined
              }
              sx={{ borderRadius: 0, minWidth: 160 }}
            >
              {saved ? "Settings Saved!" : "Save Settings"}
            </Button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
