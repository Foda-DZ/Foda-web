import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import { sellerService } from "../../services/sellerService";
import Button from "../ui/Button";
import Select from "../ui/Select";
import TextInput from "../ui/TextInput";
import wilayasData from "../../data/wilayas.json";
import type { ApiDeliveryCompany } from "../../types/api";

const wilayas = wilayasData as Array<{
  wilayaCode: number;
  nameFr: string;
  nameAr: string;
  communes: Array<{
    id: number;
    nameFr: string;
    nameAr: string;
  }>;
}>;

export default function SellerSetupModal() {
  const { user, completeSellerSetup } = useAuth();
  const { lang, tr } = useLang();
  const t = tr.seller.setup;
  const [deliveryCompany, setDeliveryCompany] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [seller_delivery_token, setSeller_delivery_token] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companies, setCompanies] = useState<ApiDeliveryCompany[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch delivery companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const data = await sellerService.getDeliveryCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch delivery companies:", error);
        setErrors((prev) => ({
          ...prev,
          companies:
            t.errorFetchingCompanies || "Failed to load delivery companies",
        }));
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, [t.errorFetchingCompanies]);

  const selectedWilaya = useMemo(
    () => wilayas.find((w) => w.nameFr === wilaya) ?? null,
    [wilaya],
  );

  const wilayaOptions = useMemo(
    () =>
      wilayas.map((w) => ({
        value: w.nameFr,
        label: lang === "ar" ? `${w.nameAr} (${w.nameFr})` : w.nameFr,
      })),
    [lang],
  );

  const communeOptions = useMemo(
    () =>
      (selectedWilaya?.communes ?? []).map((c) => ({
        value: c.nameFr,
        label: lang === "ar" ? `${c.nameAr} (${c.nameFr})` : c.nameFr,
      })),
    [lang, selectedWilaya],
  );

  const deliveryCompanyOptions = useMemo(
    () =>
      companies.map((c) => ({
        value: c.api_code,
        label: c.name,
      })),
    [companies],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!user || user.role !== "seller" || user.sellerSetupStatus !== "pending") {
    return null;
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!deliveryCompany) nextErrors.deliveryCompany = t.errorDeliveryCompany;
    if (!wilaya) nextErrors.wilaya = t.errorWilaya;
    if (!commune) nextErrors.commune = t.errorCommune;
    if (deliveryCompany && !seller_delivery_token.trim())
      nextErrors.seller_delivery_token = t.errorToken;
    return nextErrors;
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      await completeSellerSetup({
        wilaya,
        commune,
        deliveryCompany,
        seller_delivery_token: seller_delivery_token.trim(),
      });
    } catch (error) {
      setErrors({
        submit: t.errorSubmit,
      });
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    {
      title: t.deliveryCompanyTitle,
      sub: t.deliveryCompanySub,
      Icon: LocalShippingOutlinedIcon,
    },
    {
      title: t.shippingAreaTitle,
      sub: t.shippingAreaSub,
      Icon: LocationOnOutlinedIcon,
    },
  ];

  const isRTL = lang === "ar";

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className={`relative z-10 w-full max-w-5xl overflow-hidden bg-white shadow-[0_30px_70px_rgba(0,0,0,0.35)] border border-black/5 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`grid lg:grid-cols-[1.15fr_0.85fr] ${isRTL ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Left panel */}
          <div className="relative overflow-hidden bg-charcoal px-8 py-8 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_35%)]" />
            <div className="relative z-10 flex flex-col items-start justify-between gap-4">
              <div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-[0.25em] uppercase text-white/80 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <VerifiedUserOutlinedIcon sx={{ fontSize: 12 }} />
                  {t.sellerSetup}
                </div>
                <h2 className="mt-5 font-display text-3xl font-bold leading-tight">
                  {t.finishSetup}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
                  {t.setupDescription}
                </p>
              </div>
              <div className="hidden lg:flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5">
                <StorefrontOutlinedIcon
                  sx={{ fontSize: 18, color: "#C9A84C" }}
                />
              </div>
            </div>

            <div className="relative z-10 mt-10 space-y-4">
              {steps.map(({ title, sub, Icon }, index) => (
                <div
                  key={title}
                  className={`flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-charcoal font-bold">
                    {index + 1}
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <div
                      className={`flex items-center gap-2 ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                    >
                      <Icon sx={{ fontSize: 16, color: "#C9A84C" }} />
                      <p className="font-semibold text-white">{title}</p>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-white/55">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <form
            onSubmit={handleSubmit}
            className={`relative bg-cream px-8 py-8 flex flex-col ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div className="max-w-xl flex-1">
              <div className="mb-5">
                <h3 className="font-display text-xl font-bold text-charcoal">
                  {t.deliverySetupDetails}
                </h3>
              </div>

              <div className="space-y-4">
                <Select
                  label={t.deliveryCompanyLabel}
                  value={deliveryCompany}
                  onChange={(val) => {
                    setDeliveryCompany(val);
                    setSeller_delivery_token("");
                    setErrors((prev) => ({
                      ...prev,
                      deliveryCompany: "",
                      seller_delivery_token: "",
                    }));
                  }}
                  options={deliveryCompanyOptions}
                  placeholder={
                    loadingCompanies
                      ? t.loading || "Loading..."
                      : t.selectDeliveryCompany
                  }
                  error={errors.deliveryCompany || errors.companies}
                  disabled={loadingCompanies}
                />

                <Select
                  label={t.wilayaLabel}
                  value={wilaya}
                  onChange={(val) => {
                    setWilaya(val);
                    setCommune("");
                    setErrors((prev) => ({
                      ...prev,
                      wilaya: "",
                      commune: "",
                    }));
                  }}
                  options={wilayaOptions}
                  placeholder={t.selectWilaya}
                  error={errors.wilaya}
                />

                <Select
                  label={t.communeLabel}
                  value={commune}
                  onChange={(val) => {
                    setCommune(val);
                    setErrors((prev) => ({ ...prev, commune: "" }));
                  }}
                  options={communeOptions}
                  placeholder={
                    selectedWilaya ? t.selectCommune : t.chooseWilayaFirst
                  }
                  disabled={!selectedWilaya}
                  error={errors.commune}
                />

                {deliveryCompany && (
                  <TextInput
                    type="password"
                    value={seller_delivery_token}
                    onChange={(val) => {
                      setSeller_delivery_token(val);
                      setErrors((prev) => ({
                        ...prev,
                        seller_delivery_token: "",
                      }));
                    }}
                    placeholder={t.tokenPlaceholder}
                    error={errors.seller_delivery_token}
                  />
                )}

                {errors.submit && (
                  <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {errors.submit}
                  </div>
                )}

                <div className="pt-1">
                  <Button
                    type="submit"
                    fullWidth
                    loading={saving}
                    className={`h-12 gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {t.saveSetup}
                    <ArrowForwardIcon sx={{ fontSize: 15 }} />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
