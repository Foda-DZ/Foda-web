import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import { sellerService } from "../../services/sellerService";
import SellerLayout from "../../components/seller/SellerLayout";
import type { SvgIconComponent } from "@mui/icons-material";

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 0, bgcolor: "#fff" },
};

const disabledInputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 0, bgcolor: "#f5f5f5" },
};

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({
  title,
  Icon,
}: {
  title: string;
  Icon: SvgIconComponent;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-1">
      <div className="w-7 h-7 bg-[#C9A84C]/10 flex items-center justify-center">
        <Icon sx={{ fontSize: 14, color: "#C9A84C" }} />
      </div>
      <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
        {title}
      </h2>
    </div>
  );
}

interface SettingsForm {
  shopName: string;
  phone: string;
  email: string;
  wilaya: string;
  commune: string;
  logoPreview: string;
  logoFile: File | null;
}

export default function SettingsPage() {
  const { user, updateSellerSettings } = useAuth();
  const { tr, isRTL } = useLang();
  const t = tr.seller.settingsPage;
  const navigate = useNavigate();

  const [form, setForm] = useState<SettingsForm>({
    shopName: user?.shopName || user?.fullName || "",
    phone: user?.phone ? String(user.phone) : "",
    email: user?.email || "",
    wilaya: user?.address?.wilaya || "",
    commune: user?.address?.commune || "",
    logoPreview: user?.logoUrl || "",
    logoFile: null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const logoInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof SettingsForm>(key: K, val: SettingsForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((f) => ({
        ...f,
        logoPreview: reader.result as string,
        logoFile: file,
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (form.shopName.trim() && form.shopName.trim().length < 3) {
      e.shopName = t.errorShopName;
    }
    const hasWilaya = form.wilaya.trim().length > 0;
    const hasCommune = form.commune.trim().length > 0;
    if ((hasWilaya && !hasCommune) || (!hasWilaya && hasCommune)) {
      e.wilayaCommune = t.errorWilayaCommune;
    }
    return e;
  };

  const handleSave = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setApiError("");
    setSaving(true);

    try {
      const payload: {
        shopName?: string;
        phone?: number;
        wilaya?: string;
        commune?: string;
        logo?: File;
      } = {};

      if (form.shopName.trim()) payload.shopName = form.shopName.trim();
      if (form.phone.trim()) payload.phone = Number(form.phone);
      if (form.wilaya.trim() && form.commune.trim()) {
        payload.wilaya = form.wilaya.trim();
        payload.commune = form.commune.trim();
      }
      if (form.logoFile) payload.logo = form.logoFile;

      const res = await sellerService.updateSettings(payload);

      // Update the session with the new seller data
      const s = res.seller;
      updateSellerSettings({
        shopName: s.shopName,
        phone: s.phone,
        logoUrl: s.logoUrl,
        address: s.address,
      });

      // Navigate to dashboard
      navigate("/seller");
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Failed to save settings",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerLayout>
      <div className="p-8 max-w-3xl" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
            {t.title}
          </h1>
          <p className="text-[#1A1A2E]/50 text-sm mt-0.5">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* ── Store Identity ────────────────────────────────────────────── */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-5 transition-all duration-300 hover:shadow-sm">
            <SectionHeader title={t.storeIdentity} Icon={BadgeOutlinedIcon} />

            {/* Logo upload */}
            <div
              className={`flex items-center gap-5 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleLogoFile}
              />
              {form.logoPreview ? (
                <div className="relative group">
                  <img
                    src={form.logoPreview}
                    alt={t.storeLogo}
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
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          logoPreview: "",
                          logoFile: null,
                        }))
                      }
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
                    {t.logo}
                  </span>
                </button>
              )}
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]">
                  {t.storeLogo}
                </p>
                <p className="text-xs text-[#1A1A2E]/40 mt-0.5">{t.logoHint}</p>
              </div>
            </div>

            <TextField
              label={t.shopName}
              value={form.shopName}
              onChange={(e) => set("shopName", e.target.value)}
              placeholder={t.shopNamePlaceholder}
              error={!!errors.shopName}
              helperText={errors.shopName}
              fullWidth
              sx={inputSx}
            />
          </div>

          {/* ── Contact Information ───────────────────────────────────────── */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4 transition-all duration-300 hover:shadow-sm">
            <SectionHeader
              title={t.contactInfo}
              Icon={ContactMailOutlinedIcon}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label={t.phone}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder={t.phonePlaceholder}
                type="number"
                fullWidth
                sx={inputSx}
              />
              <div>
                <TextField
                  label={t.email}
                  type="email"
                  value={form.email}
                  disabled
                  fullWidth
                  sx={disabledInputSx}
                />
                <div className="flex items-center gap-1 mt-1">
                  <LockOutlinedIcon
                    sx={{ fontSize: 10, color: "rgba(26,26,46,0.3)" }}
                  />
                  <span className="text-[10px] text-[#1A1A2E]/40">
                    {t.emailDisabled}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Location ─────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4 transition-all duration-300 hover:shadow-sm">
            <SectionHeader
              title={t.locationInfo}
              Icon={LocationOnOutlinedIcon}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label={t.wilaya}
                value={form.wilaya}
                onChange={(e) => set("wilaya", e.target.value)}
                placeholder={t.wilayaPlaceholder}
                error={!!errors.wilayaCommune}
                fullWidth
                sx={inputSx}
              />
              <TextField
                label={t.commune}
                value={form.commune}
                onChange={(e) => set("commune", e.target.value)}
                placeholder={t.communePlaceholder}
                error={!!errors.wilayaCommune}
                fullWidth
                sx={inputSx}
              />
            </div>
            {errors.wilayaCommune && (
              <Alert
                severity="error"
                sx={{ borderRadius: 0, py: 0.5, fontSize: "0.75rem" }}
              >
                {errors.wilayaCommune}
              </Alert>
            )}
            <p className="text-[10px] text-[#1A1A2E]/40">
              {t.wilayaCommuneHint}
            </p>
          </div>

          {/* API error */}
          {apiError && (
            <Alert severity="error" sx={{ borderRadius: 0 }}>
              {apiError}
            </Alert>
          )}

          {/* Info banner */}
          <Alert severity="info" sx={{ borderRadius: 0 }}>
            {t.infoBanner}
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
              {saved ? t.saved : t.save}
            </Button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
