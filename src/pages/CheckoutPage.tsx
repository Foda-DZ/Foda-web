import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SecurityIcon from "@mui/icons-material/Security";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { cartService } from "../services/cartService";
import type { CartItem } from "../types";
import type {
  ApiShippingDetails,
  ApiOrder,
  ApiCheckoutShippingFeesResponse,
} from "../types/api";
import Field from "../components/ui/Field";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";

// ─── Dolivroo API ─────────────────────────────────────────────────────────────
const DOLIVROO_BASE = import.meta.env.VITE_DOLIVROO_BASE;
const DOLIVROO_TOKEN = import.meta.env.VITE_DOLIVROO_TOKEN;
const dlvHeaders = { Authorization: `Bearer ${DOLIVROO_TOKEN}` };

type DlvWilaya = {
  id: number;
  name: string;
  ar: string;
  aliases?: string[];
};

type DlvCommune = {
  id: number;
  name: string;
  arabic_name: string;
  wilaya_id: number;
  post_code: string;
  has_stop_desk: number;
  has_home_delivery: number;
};

async function fetchWilayas(): Promise<DlvWilaya[]> {
  const res = await fetch(`${DOLIVROO_BASE}/wilayas`, { headers: dlvHeaders });
  if (!res.ok) throw new Error("Failed to fetch wilayas");
  const data = await res.json();
  // API may return { wilayas: [...] } or [...] directly
  return Array.isArray(data) ? data : (data.wilayas ?? data.data ?? []);
}

async function fetchCommunes(
  companyCode: string,
  wilayaId: number,
): Promise<DlvCommune[]> {
  const url = `${DOLIVROO_BASE}/communes?company_code=${encodeURIComponent(companyCode)}&wilaya_id=${wilayaId}`;
  const res = await fetch(url, { headers: dlvHeaders });
  if (!res.ok) throw new Error("Failed to fetch communes");
  const data = await res.json();
  return Array.isArray(data) ? data : (data.communes ?? data.data ?? []);
}

type StopDeskCheckResult =
  | { ok: true }
  | { ok: false; reason: "no_stopdesk" }
  | { ok: false; reason: "api_error" };

async function checkStopDesk(
  companyCode: string,
  connectionLabel: string,
  originWilaya: string,
  destWilaya: string,
  destCommune: string,
  phone: string,
  total: number,
): Promise<StopDeskCheckResult> {
  try {
    const res = await fetch(`${DOLIVROO_BASE}/parcels`, {
      method: "POST",
      headers: { ...dlvHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: companyCode,
        connection_label: connectionLabel,
        order: {
          reference: `Foda-CHK-${Date.now()}`,
          customer: {
            first_name: "Client",
            last_name: "Foda",
            phone: phone || "0555000000",
            phone_secondary: "",
            address: destCommune,
          },
          destination: { wilaya: destWilaya, commune: destCommune },
          origin: { wilaya: originWilaya },
          package: {
            products: "Order",
            weight: 1,
            length: 20,
            width: 15,
            height: 10,
          },
          payment: {
            amount: total,
            declared_value: total,
            free_shipping: false,
          },
          options: {
            delivery_type: "stopdesk",
            exchange: false,
            confirmed: false,
            insurance: false,
          },
          notes: "",
        },
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // treat explicit "no stop desk" errors from the API
      const msg: string = (err?.message ?? err?.error ?? "").toLowerCase();
      if (
        msg.includes("stop desk") ||
        msg.includes("stopdesk") ||
        msg.includes("no desk") ||
        res.status === 422
      ) {
        return { ok: false, reason: "no_stopdesk" };
      }
      return { ok: false, reason: "api_error" };
    }
    const data = await res.json();
    // some providers return a flag directly
    const hasDesk =
      data?.parcel?.has_stop_desk ??
      data?.has_stop_desk ??
      data?.data?.has_stop_desk;
    if (hasDesk === 0 || hasDesk === false)
      return { ok: false, reason: "no_stopdesk" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "api_error" };
  }
}

function getShippingFeeAmount(
  shippingFees: ApiCheckoutShippingFeesResponse["shippingFees"] | null,
  wilayaId: number,
  shippingType: DeliveryInfo["shippingType"],
) {
  if (!shippingFees?.data?.length) return null;

  const matchedFee =
    shippingFees.data.find((entry) => entry.wilaya_id === wilayaId) ??
    shippingFees.data[0];

  if (!matchedFee) return null;

  return shippingType === "desk_pickup"
    ? (matchedFee.fees.desk ?? matchedFee.fees.home ?? null)
    : (matchedFee.fees.home ?? matchedFee.fees.desk ?? null);
}

const STEPS = ["Shipping", "Payment", "Review"] as const;
type Step = (typeof STEPS)[number] | "Success";
type PaymentMethod = "cod" | "cib" | "baridimob";

interface DeliveryInfo {
  phone: string;
  wilaya: string;
  commune: string;
  postalCode: string;
  shippingType: "home_delivery" | "desk_pickup";
}

interface PaymentInfo {
  method: PaymentMethod;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  baridimobPhone: string;
}

// ─── Shipping Skeleton ────────────────────────────────────────────────────────
function ShippingSkeleton() {
  return (
    <span className="inline-block h-4 w-16 bg-charcoal/10 animate-pulse rounded" />
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
  shippingLoading,
  shippingError,
}: {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingLoading: boolean;
  shippingError: string;
}) {
  const { tr } = useLang();

  const savingsTotal = items.reduce((sum, i) => {
    if (i.product.originalPrice && i.product.originalPrice > i.product.price) {
      return sum + (i.product.originalPrice - i.product.price) * i.quantity;
    }
    return sum;
  }, 0);

  return (
    <div className="bg-white border border-charcoal/8 p-6 space-y-5 lg:sticky lg:top-28">
      <h3 className="font-display font-bold text-charcoal text-lg">
        {tr.checkout.orderSummary}
      </h3>
      <div className="space-y-3 max-h-60 overflow-y-auto pe-1">
        {items.map((item) => {
          const hasDiscount =
            item.product.originalPrice !== undefined &&
            item.product.originalPrice > item.product.price;
          return (
            <div key={item.key} className="flex gap-3">
              <div className="w-14 h-16 shrink-0 bg-cream overflow-hidden">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-charcoal/40 text-[10px] uppercase tracking-wider">
                  {item.product.category}
                </p>
                <p className="text-charcoal text-sm font-semibold leading-tight truncate">
                  {item.product.name}
                </p>
                <p className="text-charcoal/50 text-xs mt-0.5">
                  {item.size} · ×{item.quantity}
                </p>
              </div>
              <div className="text-end shrink-0">
                {hasDiscount && (
                  <p className="text-charcoal/35 text-xs line-through">
                    {(
                      (item.product.originalPrice ?? 0) * item.quantity
                    ).toLocaleString()}
                  </p>
                )}
                <p
                  className={`font-bold text-sm ${hasDiscount ? "text-gold" : "text-charcoal"}`}
                >
                  {(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-charcoal/8 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-charcoal/60">
          <span>{tr.checkout.subtotal}</span>
          <span>
            {subtotal.toLocaleString()} {tr.common.dzd}
          </span>
        </div>
        {savingsTotal > 0 && (
          <div className="flex justify-between text-sm font-medium text-emerald-600">
            <span>You save</span>
            <span>
              -{savingsTotal.toLocaleString()} {tr.common.dzd}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm text-charcoal/60">
          <span>{tr.checkout.shipping}</span>
          <span className="text-gold font-semibold">
            {shippingLoading ? (
              <ShippingSkeleton />
            ) : shippingError ? (
              "Unavailable"
            ) : (
              `${shipping.toLocaleString()} ${tr.common.dzd}`
            )}
          </span>
        </div>
        <div className="h-px bg-charcoal/8" />
        <div className="flex justify-between font-bold items-center">
          <span className="text-charcoal">{tr.checkout.total}</span>
          {shippingLoading ? (
            <span className="inline-block h-6 w-24 bg-charcoal/10 animate-pulse rounded" />
          ) : (
            <span className="gold-text font-display text-xl">
              {total.toLocaleString()} {tr.common.dzd}
            </span>
          )}
        </div>
      </div>
      <div className="border-t border-charcoal/8 pt-4 space-y-2">
        {[
          { Icon: SecurityIcon, text: "Secure checkout" },
          { Icon: LocalShippingIcon, text: "Delivery across all 58 wilayas" },
        ].map(({ Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 text-xs text-charcoal/40"
          >
            <Icon sx={{ fontSize: 13, color: "#C9A84C", flexShrink: 0 }} />{" "}
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Delivery Form ────────────────────────────────────────────────────────────
function DeliveryForm({
  info,
  setInfo,
  errors,
  onNext,
  wilayas,
  wilayasLoading,
  communes,
  communesLoading,
  onWilayaChange,
  stopDeskChecking,
  stopDeskWarning,
  onDismissStopDeskWarning,
  onProceedAnyway,
}: {
  info: DeliveryInfo;
  setInfo: React.Dispatch<React.SetStateAction<DeliveryInfo>>;
  errors: Record<string, string>;
  onNext: () => void;
  wilayas: DlvWilaya[];
  wilayasLoading: boolean;
  communes: DlvCommune[];
  communesLoading: boolean;
  onWilayaChange: (wilayaName: string, wilayaId: number) => void;
  stopDeskChecking: boolean;
  stopDeskWarning: boolean;
  onDismissStopDeskWarning: () => void;
  onProceedAnyway: () => void;
}) {
  const { tr } = useLang();
  const isRtl = tr.dir === "rtl";
  const set = (key: keyof DeliveryInfo) => (val: string) =>
    setInfo((f) => ({ ...f, [key]: val }));

  const wilayaOptions = wilayas.map((wilaya) => ({
    value: wilaya.name,
    id: wilaya.id,
    label: `${String(wilaya.id).padStart(2, "0")} - ${isRtl ? wilaya.ar || wilaya.name : wilaya.name}`,
  }));

  const communeOptions = communes.map((commune) => ({
    value: commune.name,
    label: isRtl ? commune.arabic_name || commune.name : commune.name,
    postCode: commune.post_code,
  }));

  const handleWilayaChange = (nextWilayaName: string) => {
    const found = wilayas.find((w) => w.name === nextWilayaName);
    setInfo((f) => ({
      ...f,
      wilaya: nextWilayaName,
      commune: "",
      postalCode: "",
    }));
    onWilayaChange(nextWilayaName, found?.id ?? 0);
  };

  const handleCommuneChange = (nextCommuneName: string) => {
    const found = communeOptions.find((c) => c.value === nextCommuneName);
    setInfo((f) => ({
      ...f,
      commune: nextCommuneName,
      postalCode: found?.postCode || f.postalCode,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal mb-1">
          {tr.checkout.deliveryTitle}
        </h2>
        <p className="text-charcoal/50 text-sm">{tr.checkout.deliverySub}</p>
      </div>

      {/* Shipping type */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-gold">
          Shipping Method
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              value: "home_delivery" as const,
              label: "Home Delivery",
              sub: "Delivered to your door",
              Icon: HomeIcon,
            },
            {
              value: "desk_pickup" as const,
              label: "Desk Pickup",
              sub: "Pick up at delivery desk",
              Icon: BusinessIcon,
            },
          ].map(({ value, label, sub, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setInfo((f) => ({ ...f, shippingType: value }))}
              className={`flex items-center gap-3 p-4 border-2 transition-all duration-200 text-start ${
                info.shippingType === value
                  ? "border-gold bg-gold/5"
                  : "border-charcoal/10 hover:border-gold/40"
              }`}
            >
              <div
                className={`w-9 h-9 flex items-center justify-center shrink-0 ${info.shippingType === value ? "gold-gradient" : "bg-[#F0EBE3]"}`}
              >
                <Icon
                  sx={{
                    fontSize: 16,
                    color:
                      info.shippingType === value
                        ? "#1A1A2E"
                        : "rgba(26,26,46,0.5)",
                  }}
                />
              </div>
              <div>
                <p
                  className={`font-semibold text-sm ${info.shippingType === value ? "text-charcoal" : "text-charcoal/60"}`}
                >
                  {label}
                </p>
                <p className="text-charcoal/40 text-xs">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-gold">
          Contact
        </p>
        <Field label={tr.checkout.phone} error={errors.phone}>
          <TextInput
            type="tel"
            value={info.phone}
            onChange={set("phone")}
            placeholder="0555 XX XX XX"
            error={errors.phone}
          />
        </Field>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-gold">
          Shipping Address
        </p>
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-charcoal/60 mb-1.5">
            {tr.checkout.wilaya}
          </label>
          <select
            value={info.wilaya}
            onChange={(e) => handleWilayaChange(e.target.value)}
            disabled={wilayasLoading}
            className={`w-full border bg-white py-2.5 px-3 text-sm text-charcoal focus:outline-none transition-colors appearance-none cursor-pointer ${
              errors.wilaya
                ? "border-red-400"
                : "border-charcoal/15 focus:border-gold"
            } ${
              !info.wilaya
                ? "text-charcoal/70 font-medium"
                : "text-charcoal font-semibold"
            } ${wilayasLoading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <option value="">
              {wilayasLoading ? "Loading wilayas…" : tr.checkout.selectWilaya}
            </option>
            {wilayaOptions.map((wilaya) => (
              <option key={wilaya.id} value={wilaya.value}>
                {wilaya.label}
              </option>
            ))}
          </select>
          {errors.wilaya && (
            <p className="mt-1.5 text-xs text-red-500">{errors.wilaya}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Commune" error={errors.commune}>
            <select
              value={info.commune}
              onChange={(e) => handleCommuneChange(e.target.value)}
              disabled={!info.wilaya || communesLoading}
              className={`w-full border bg-white py-2.5 px-3 text-sm text-charcoal focus:outline-none transition-colors appearance-none cursor-pointer ${
                errors.commune
                  ? "border-red-400"
                  : "border-charcoal/15 focus:border-gold"
              } ${!info.wilaya || communesLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <option value="">
                {communesLoading
                  ? "Loading communes…"
                  : isRtl
                    ? "اختر البلدية"
                    : "Select commune"}
              </option>
              {communeOptions.map((commune) => (
                <option key={commune.value} value={commune.value}>
                  {commune.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Postal Code (optional)">
            <TextInput
              value={info.postalCode}
              onChange={set("postalCode")}
              placeholder="16000"
            />
          </Field>
        </div>
      </div>

      {stopDeskWarning && (
        <div className="border border-amber-300 bg-amber-50 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <ErrorOutlineIcon
              sx={{ fontSize: 20, color: "#d97706", flexShrink: 0, mt: 0.1 }}
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-amber-800">
                {tr.dir === "rtl"
                  ? "لا يوجد مكتب توصيل في هذه البلدية"
                  : "No stop desk available in this commune"}
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                {tr.dir === "rtl"
                  ? `لا تتوفر نقطة استلام في ${info.commune}. يمكنك التحويل إلى التوصيل المنزلي أو المتابعة على مسؤوليتك.`
                  : `There is no pickup desk in ${info.commune}. You can switch to home delivery or continue at your own discretion.`}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 ps-8">
            <button
              type="button"
              onClick={() => {
                setInfo((f) => ({ ...f, shippingType: "home_delivery" }));
                onDismissStopDeskWarning();
              }}
              className="flex-1 border-2 border-gold bg-gold/5 text-charcoal text-sm font-semibold py-2 px-4 hover:bg-gold/10 transition-colors"
            >
              {tr.dir === "rtl"
                ? "التحويل إلى توصيل منزلي"
                : "Switch to Home Delivery"}
            </button>
            <button
              type="button"
              onClick={onProceedAnyway}
              className="flex-1 border-2 border-charcoal/15 text-charcoal/60 text-sm font-semibold py-2 px-4 hover:border-charcoal/30 transition-colors"
            >
              {tr.dir === "rtl" ? "متابعة على أي حال" : "Continue Anyway"}
            </button>
          </div>
        </div>
      )}

      <Button
        onClick={onNext}
        loading={stopDeskChecking}
        disabled={stopDeskChecking}
        className="h-11 gap-2"
      >
        {stopDeskChecking ? (
          tr.dir === "rtl" ? (
            "جارٍ التحقق…"
          ) : (
            "Checking availability…"
          )
        ) : (
          <>
            {tr.checkout.nextPayment} <ArrowForwardIcon sx={{ fontSize: 15 }} />
          </>
        )}
      </Button>
    </div>
  );
}

function PaymentForm({
  payment,
  setPayment,
  errors: _errors,
  onNext,
  onBack,
}: {
  payment: PaymentInfo;
  setPayment: React.Dispatch<React.SetStateAction<PaymentInfo>>;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}) {
  const { tr } = useLang();
  const set = (key: keyof PaymentInfo) => (val: string) =>
    setPayment((f) => ({ ...f, [key]: val }));

  const paymentMethods = [
    {
      id: "cod" as const,
      label: tr.checkout.cod,
      sub: tr.checkout.codSub,
      Icon: LocalShippingIcon,
      disabled: false,
    },
    {
      id: "cib" as const,
      label: tr.checkout.cib,
      sub: tr.checkout.comingSoon,
      Icon: CreditCardIcon,
      disabled: true,
    },
    {
      id: "baridimob" as const,
      label: tr.checkout.baridimob,
      sub: tr.checkout.comingSoon,
      Icon: SmartphoneIcon,
      disabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal mb-1">
          {tr.checkout.paymentTitle}
        </h2>
        <p className="text-charcoal/50 text-sm">{tr.checkout.paymentSub}</p>
      </div>
      <div className="space-y-3">
        {paymentMethods.map(({ id, label, sub, Icon, disabled }) => (
          <button
            key={id}
            onClick={() => !disabled && set("method")(id)}
            disabled={disabled}
            className={`w-full flex items-center gap-4 p-4 border-2 transition-all duration-200 text-start ${
              disabled
                ? "border-charcoal/5 bg-[#F0EBE3]/50 opacity-60 cursor-not-allowed"
                : payment.method === id
                  ? "border-gold bg-gold/5"
                  : "border-charcoal/10 hover:border-gold/40"
            }`}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center shrink-0 ${!disabled && payment.method === id ? "gold-gradient" : "bg-[#F0EBE3]"}`}
            >
              <Icon
                sx={{
                  fontSize: 18,
                  color:
                    !disabled && payment.method === id
                      ? "#1A1A2E"
                      : "rgba(26,26,46,0.5)",
                }}
              />
            </div>
            <div className="flex-1">
              <p
                className={`font-semibold text-sm ${!disabled && payment.method === id ? "text-charcoal" : "text-charcoal/70"}`}
              >
                {label}
                {disabled && (
                  <span className="ms-2 text-[10px] font-bold tracking-widest uppercase text-gold bg-gold/10 px-2 py-0.5">
                    {tr.checkout.comingSoon}
                  </span>
                )}
              </p>
              {!disabled && <p className="text-charcoal/40 text-xs">{sub}</p>}
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                disabled
                  ? "border-charcoal/10"
                  : payment.method === id
                    ? "border-gold bg-gold"
                    : "border-charcoal/20"
              }`}
            >
              {!disabled && payment.method === id && (
                <div className="w-2 h-2 rounded-full bg-charcoal" />
              )}
            </div>
          </button>
        ))}
      </div>

      {payment.method === "cod" && (
        <div className="bg-[#F5F0E8] p-4 border border-gold/20">
          <p className="text-sm text-charcoal/60 leading-relaxed">
            Pay in cash when your delivery arrives. A 750 {tr.common.dzd}{" "}
            delivery fee applies for orders under 5,000 {tr.common.dzd}.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline-gold" onClick={onBack} className="h-11 gap-2">
          <ArrowBackIcon sx={{ fontSize: 15 }} /> {tr.common.back}
        </Button>
        <Button onClick={onNext} className="h-11 gap-2">
          {tr.checkout.nextReview} <ArrowForwardIcon sx={{ fontSize: 15 }} />
        </Button>
      </div>
    </div>
  );
}

// ─── Review & Confirm Step ───────────────────────────────────────────────────
function ReviewConfirmStep({
  info,
  payment,
  items,
  subtotal,
  shipping,
  total,
  shippingLoading,
  shippingError,
  onPlace,
  onBack,
  placing,
  placeError,
}: {
  info: DeliveryInfo;
  payment: PaymentInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingLoading: boolean;
  shippingError: string;
  onPlace: () => void;
  onBack: () => void;
  placing: boolean;
  placeError: string;
}) {
  const { tr } = useLang();
  const methodLabels: Record<PaymentMethod, string> = {
    cod: tr.checkout.cod,
    cib: tr.checkout.cib,
    baridimob: tr.checkout.baridimob,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal mb-1">
          {tr.checkout.reviewTitle}
        </h2>
        <p className="text-charcoal/50 text-sm">{tr.checkout.reviewSub}</p>
      </div>

      {/* Delivery info */}
      <div className="bg-white border border-charcoal/8 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/50 flex items-center gap-2">
          <LocationOnIcon sx={{ fontSize: 12, color: "#C9A84C" }} />{" "}
          {tr.checkout.deliveryInfo}
        </p>
        <div className="text-sm text-charcoal/70 space-y-0.5">
          <p className="font-semibold text-charcoal capitalize">
            {info.shippingType === "home_delivery"
              ? "Home Delivery"
              : "Desk Pickup"}
          </p>
          <p>
            {info.commune}, {info.wilaya}
          </p>
          {info.postalCode && <p>Postal: {info.postalCode}</p>}
          <p>{info.phone}</p>
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white border border-charcoal/8 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/50 flex items-center gap-2">
          <CreditCardIcon sx={{ fontSize: 12, color: "#C9A84C" }} />{" "}
          {tr.checkout.paymentMethod}
        </p>
        <p className="text-sm text-charcoal/70">
          {methodLabels[payment.method]}
        </p>
      </div>

      {/* Order items */}
      <div className="bg-white border border-charcoal/8 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/50 flex items-center gap-2">
          <ShoppingBagIcon sx={{ fontSize: 12, color: "#C9A84C" }} />
          {tr.checkout.orderItems} ({items.reduce((s, i) => s + i.quantity, 0)})
        </p>
        <div className="space-y-3">
          {items.map((item) => {
            const hasDiscount =
              item.product.originalPrice !== undefined &&
              item.product.originalPrice > item.product.price;
            return (
              <div
                key={item.key}
                className="flex justify-between items-start text-sm"
              >
                <div>
                  <span className="text-charcoal font-medium">
                    {item.product.name}
                  </span>
                  <span className="text-charcoal/40 ms-2">
                    &times; {item.quantity}
                  </span>
                  {item.size && (
                    <span className="text-charcoal/40 text-xs ms-1">
                      ({item.size})
                    </span>
                  )}
                </div>
                <div className="text-end ms-3 shrink-0">
                  {hasDiscount && (
                    <span className="block text-charcoal/35 text-xs line-through">
                      {(
                        (item.product.originalPrice ?? 0) * item.quantity
                      ).toLocaleString()}{" "}
                      {tr.common.dzd}
                    </span>
                  )}
                  <span
                    className={`font-semibold ${hasDiscount ? "text-gold" : "text-charcoal"}`}
                  >
                    {(item.product.price * item.quantity).toLocaleString()}{" "}
                    {tr.common.dzd}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-charcoal/8 pt-3 space-y-1.5">
          <div className="flex justify-between text-sm text-charcoal/50">
            <span>{tr.checkout.subtotal}</span>
            <span>
              {subtotal.toLocaleString()} {tr.common.dzd}
            </span>
          </div>
          {(() => {
            const savingsTotal = items.reduce((sum, i) => {
              if (
                i.product.originalPrice &&
                i.product.originalPrice > i.product.price
              ) {
                return (
                  sum + (i.product.originalPrice - i.product.price) * i.quantity
                );
              }
              return sum;
            }, 0);
            return savingsTotal > 0 ? (
              <div className="flex justify-between text-sm font-medium text-emerald-600">
                <span>You save</span>
                <span>
                  -{savingsTotal.toLocaleString()} {tr.common.dzd}
                </span>
              </div>
            ) : null;
          })()}
          <div className="flex justify-between text-sm text-charcoal/50 items-center">
            <span>{tr.checkout.shipping}</span>
            <span className="text-gold">
              {shippingLoading ? (
                <ShippingSkeleton />
              ) : shippingError ? (
                "Unavailable"
              ) : (
                `${shipping.toLocaleString()} ${tr.common.dzd}`
              )}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-charcoal/8 pt-2 mt-2 items-center">
            <span className="text-charcoal">{tr.checkout.total}</span>
            {shippingLoading ? (
              <span className="inline-block h-5 w-20 bg-charcoal/10 animate-pulse rounded" />
            ) : (
              <span className="gold-text font-display">
                {total.toLocaleString()} {tr.common.dzd}
              </span>
            )}
          </div>
        </div>
      </div>

      {placeError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 leading-relaxed">
          <ErrorOutlineIcon sx={{ fontSize: 16, flexShrink: 0, mt: 0.1 }} />
          {placeError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline-gold"
          onClick={onBack}
          disabled={placing}
          className="h-11 gap-2"
        >
          <ArrowBackIcon sx={{ fontSize: 15 }} /> {tr.common.back}
        </Button>
        <Button
          onClick={onPlace}
          loading={placing}
          disabled={placing || shippingLoading}
          className="h-11 flex-1 gap-2"
        >
          {shippingLoading
            ? "Calculating shipping..."
            : `${tr.checkout.placeOrder} · ${total.toLocaleString()} ${tr.common.dzd}`}
          {!shippingLoading && <ArrowForwardIcon sx={{ fontSize: 15 }} />}
        </Button>
      </div>
    </div>
  );
}

// ─── Order Success ────────────────────────────────────────────────────────────
function OrderSuccess({
  orders,
  method,
  onHome,
  onViewOrders,
}: {
  orders: ApiOrder[];
  method: PaymentMethod;
  onHome: () => void;
  onViewOrders: () => void;
}) {
  const { tr } = useLang();
  const isRtl = tr.dir === "rtl";
  const methodLabels: Record<PaymentMethod, string> = {
    cod: tr.checkout.cod,
    cib: tr.checkout.cib,
    baridimob: tr.checkout.baridimob,
  };
  const grandTotal = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const orderDate = orders[0]?.createdAt
    ? new Date(orders[0].createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-cream py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto gold-gradient rounded-full flex items-center justify-center shadow-lg">
            <CheckCircleIcon sx={{ fontSize: 38, color: "#1A1A2E" }} />
          </div>
          <div>
            <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">
              {tr.checkout.orderConfirmed}
            </p>
            <h1 className="font-display text-4xl font-bold text-charcoal mb-2">
              {tr.checkout.successTitle}
            </h1>
            <p className="text-charcoal/55 leading-relaxed max-w-sm mx-auto">
              {tr.checkout.successSub}
            </p>
          </div>
        </div>

        <div className="bg-white border border-charcoal/8 divide-y divide-charcoal/6">
          {orders.map((order) => {
            const shippingFee = order.shippingDetails?.shippingFee ?? 0;
            const itemsTotal = Math.max(order.totalAmount - shippingFee, 0);

            return (
              <div key={order._id} className="px-5 py-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold tracking-widest uppercase text-charcoal/45">
                    {isRtl ? "رقم الطلب" : tr.checkout.orderNumber}
                  </span>
                  <span className="font-display font-bold text-gold text-sm tracking-widest">
                    #{order._id.slice(-10).toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${order._id}-${item.productId}-${idx}`}
                      className="flex gap-4"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-16 object-cover bg-[#F0EBE3] shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-16 bg-[#F0EBE3] shrink-0 flex items-center justify-center">
                          <ShoppingBagIcon
                            sx={{ fontSize: 14, color: "rgba(26,26,46,0.25)" }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-charcoal text-sm font-semibold leading-tight">
                          {item.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-charcoal/45">
                          <span>
                            {isRtl ? "الكمية" : "Qty"}: {item.quantity}
                          </span>
                          {item.selectedChoices?.size && (
                            <span>
                              {isRtl ? "المقاس" : "Size"}:{" "}
                              {item.selectedChoices.size}
                            </span>
                          )}
                          {item.selectedChoices?.color && (
                            <span>
                              {isRtl ? "اللون" : "Color"}:{" "}
                              {item.selectedChoices.color}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-charcoal font-bold text-sm shrink-0">
                        {(item.price * item.quantity).toLocaleString()}{" "}
                        {tr.common.dzd}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-charcoal/6 pt-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-charcoal/55">
                    <span>{isRtl ? "المجموع الفرعي" : "Subtotal"}</span>
                    <span>
                      {itemsTotal.toLocaleString()} {tr.common.dzd}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-charcoal/55">
                    <span>{isRtl ? "رسوم الشحن" : tr.checkout.shipping}</span>
                    <span className="text-gold font-semibold">
                      {shippingFee.toLocaleString()} {tr.common.dzd}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-charcoal border-t border-charcoal/6 pt-2 mt-2">
                    <span>{isRtl ? "الإجمالي" : tr.checkout.total}</span>
                    <span className="gold-text font-display">
                      {order.totalAmount.toLocaleString()} {tr.common.dzd}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-charcoal/70 border-t border-charcoal/5 pt-3">
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-charcoal/45 mb-1">
                      {isRtl ? "طريقة الشحن" : tr.checkout.deliveryInfo}
                    </p>
                    <p className="font-semibold text-charcoal">
                      {order.shippingDetails.shippingType === "home_delivery"
                        ? tr.profile.homeDelivery
                        : tr.profile.deskPickup}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-charcoal/45 mb-1">
                      {isRtl ? "العنوان" : tr.checkout.deliveryInfo}
                    </p>
                    <p>
                      {order.shippingDetails.commune},{" "}
                      {order.shippingDetails.wilaya}
                    </p>
                    {order.shippingDetails.postalCode && (
                      <p>
                        {isRtl ? "الرمز البريدي" : "Postal code"}:{" "}
                        {order.shippingDetails.postalCode}
                      </p>
                    )}
                    <p>{order.shippingDetails.phone}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {orderDate && (
          <div className="bg-white border border-charcoal/8 px-5 py-4 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-widest uppercase text-charcoal/45">
              {isRtl ? "تاريخ الطلب" : "Date Placed"}
            </span>
            <span className="text-sm text-charcoal/70">{orderDate}</span>
          </div>
        )}

        <div className="bg-white border border-charcoal/8 px-5 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest uppercase text-charcoal/45">
            {isRtl ? "الحالة" : "Status"}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {isRtl ? "قيد الانتظار" : "Pending"}
          </span>
        </div>

        <div className="bg-white border border-charcoal/8 px-5 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest uppercase text-charcoal/45">
            {tr.checkout.paymentMethod}
          </span>
          <span className="text-sm text-charcoal/70">
            {methodLabels[method]}
          </span>
        </div>

        <div className="bg-white border border-charcoal/8 px-5 py-4 flex justify-between items-center">
          <span className="text-sm font-bold text-charcoal">
            {isRtl ? "إجمالي الطلبات" : tr.checkout.total}
          </span>
          <span className="font-display font-bold text-xl gold-text">
            {grandTotal.toLocaleString()} {tr.common.dzd}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline-gold"
            onClick={onViewOrders}
            className="flex-1 h-11 gap-2"
          >
            <ShoppingBagIcon sx={{ fontSize: 15 }} />
            {isRtl ? "عرض طلباتي" : "View My Orders"}
          </Button>
          <Button variant="dark" onClick={onHome} className="flex-1 h-11 gap-2">
            {tr.checkout.backHome} <ArrowForwardIcon sx={{ fontSize: 15 }} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: string }) {
  const { tr } = useLang();
  const stepLabels = [
    tr.checkout.delivery,
    tr.checkout.payment,
    tr.checkout.review,
  ];
  const idx = STEPS.indexOf(current as (typeof STEPS)[number]);
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < idx
                  ? "gold-gradient text-charcoal"
                  : i === idx
                    ? "bg-charcoal text-white"
                    : "border-2 border-charcoal/15 text-charcoal/30"
              }`}
            >
              {i < idx ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs font-semibold tracking-wide hidden sm:block transition-colors duration-300 ${
                i === idx
                  ? "text-charcoal"
                  : i < idx
                    ? "text-gold"
                    : "text-charcoal/30"
              }`}
            >
              {stepLabels[i]}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-12 sm:w-16 h-px mx-2 sm:mx-3 transition-all duration-300 ${
                i < idx ? "bg-gold" : "bg-charcoal/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateDelivery(info: DeliveryInfo): Record<string, string> {
  const e: Record<string, string> = {};
  if (!info.phone.trim()) e.phone = "Required.";
  if (!info.wilaya) e.wilaya = "Please select a wilaya.";
  if (!info.commune.trim()) e.commune = "Required.";
  return e;
}

function validatePayment(payment: PaymentInfo): Record<string, string> {
  const e: Record<string, string> = {};
  if (payment.method === "cib") {
    if (
      !payment.cardNumber ||
      payment.cardNumber.replace(/\s/g, "").length < 16
    )
      e.cardNumber = "Enter a valid 16-digit card number.";
    if (!payment.cardName.trim()) e.cardName = "Required.";
    if (!payment.expiry || payment.expiry.length < 5)
      e.expiry = "Enter a valid expiry (MM/YY).";
    if (!payment.cvv || payment.cvv.length < 3) e.cvv = "Enter a valid CVV.";
  }
  if (payment.method === "baridimob") {
    if (!payment.baridimobPhone || payment.baridimobPhone.length < 10)
      e.baridimobPhone = "Enter a valid 10-digit phone number.";
  }
  return e;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user, openLogin } = useAuth();
  const { tr } = useLang();

  const [step, setStep] = useState<Step>("Shipping");
  const [shippingPerSeller, setShippingPerSeller] = useState<
    Record<string, number>
  >({});
  const [shippingTotal, setShippingTotal] = useState<number>(0);
  const [info, setInfo] = useState<DeliveryInfo>({
    phone: "",
    wilaya: "",
    commune: "",
    postalCode: "",
    shippingType: "home_delivery",
  });
  const [infoErrors, setInfoErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState<PaymentInfo>({
    method: "cod",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    baridimobPhone: "",
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>(
    {},
  );
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");
  const [placedOrders, setPlacedOrders] = useState<ApiOrder[] | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [stopDeskChecking, setStopDeskChecking] = useState(false);
  const [stopDeskWarning, setStopDeskWarning] = useState(false);
  const shippingCacheRef = useRef(
    new Map<string, ApiCheckoutShippingFeesResponse["shippingFees"]>(),
  );

  // ── Wilayas from Dolivroo ─────────────────────────────────────────────────
  const [wilayas, setWilayas] = useState<DlvWilaya[]>([]);
  const [wilayasLoading, setWilayasLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchWilayas()
      .then((data) => {
        if (active) setWilayas(data);
      })
      .catch(() => {
        /* silently degrade — select stays empty */
      })
      .finally(() => {
        if (active) setWilayasLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // ── Communes from Dolivroo ────────────────────────────────────────────────
  const [communes, setCommunes] = useState<DlvCommune[]>([]);
  const [communesLoading, setCommunesLoading] = useState(false);
  // selected wilaya id used to fetch communes
  const [selectedWilayaId, setSelectedWilayaId] = useState<number>(0);
  // company_code and connection_label sourced from shipping fees meta / seller id
  const companyCodeRef = useRef<string>("");
  const connectionLabelRef = useRef<string>("");

  const loadCommunes = useCallback(async (wilayaId: number) => {
    if (!wilayaId) {
      setCommunes([]);
      return;
    }
    const code = companyCodeRef.current;
    if (!code) {
      setCommunes([]);
      return;
    }
    setCommunesLoading(true);
    try {
      const data = await fetchCommunes(code, wilayaId);
      setCommunes(data);
    } catch {
      setCommunes([]);
    } finally {
      setCommunesLoading(false);
    }
  }, []);

  const handleWilayaChange = useCallback(
    (_wilayaName: string, wilayaId: number) => {
      setSelectedWilayaId(wilayaId);
      loadCommunes(wilayaId);
    },
    [loadCommunes],
  );

  const shippingWilayaName = useMemo(() => info.wilaya, [info.wilaya]);

  // derive wilaya_id from the wilayas list for shipping fee matching
  const shippingWilayaId = useMemo(
    () => wilayas.find((w) => w.name === shippingWilayaName)?.id ?? 0,
    [wilayas, shippingWilayaName],
  );

  // compute per-seller shipping fees in parallel and cache results per product:wilaya
  useEffect(() => {
    if (!items.length || !shippingWilayaName) {
      setShippingPerSeller({});
      setShippingTotal(0);
      setShippingLoading(false);
      setShippingError("");
      return;
    }

    let active = true;
    setShippingLoading(true);
    setShippingError("");

    const groups = new Map<string, typeof items>();
    for (const it of items) {
      const sellerId = it.product.sellerId ?? "__unknown";
      const arr = groups.get(sellerId) ?? [];
      arr.push(it);
      groups.set(sellerId, arr);
    }

    const promises: Promise<void>[] = [];
    const nextPerSeller: Record<string, number> = {};
    let nextTotal = 0;

    for (const [sellerId, groupItems] of groups.entries()) {
      const productId = groupItems[0].product.id;
      const cacheKey = `${productId}:${shippingWilayaName}`;
      const cached = shippingCacheRef.current.get(cacheKey);

      if (cached) {
        if (cached.meta?.company_code && !companyCodeRef.current) {
          companyCodeRef.current = cached.meta.company_code;
        }
        if (!connectionLabelRef.current) {
          connectionLabelRef.current = `foda_seller_${sellerId}`;
        }
        const fee =
          getShippingFeeAmount(cached, shippingWilayaId, info.shippingType) ??
          0;
        nextPerSeller[sellerId] = fee;
        nextTotal += fee;
      } else {
        const p = cartService
          .getShippingFees(productId, shippingWilayaName)
          .then((fees) => {
            if (!active) return;
            shippingCacheRef.current.set(cacheKey, fees);
            if (fees.meta?.company_code && !companyCodeRef.current) {
              companyCodeRef.current = fees.meta.company_code;
              if (selectedWilayaId) loadCommunes(selectedWilayaId);
            }
            if (!connectionLabelRef.current) {
              connectionLabelRef.current = `foda_seller_${sellerId}`;
            }
            const fee =
              getShippingFeeAmount(fees, shippingWilayaId, info.shippingType) ??
              0;
            nextPerSeller[sellerId] = fee;
            nextTotal += fee;
          })
          .catch((err) => {
            if (!active) return;
            nextPerSeller[sellerId] = 0;
            setShippingError(
              (e) =>
                e ||
                (err instanceof Error
                  ? err.message
                  : "Unable to calculate shipping."),
            );
          });

        promises.push(p);
      }
    }

    Promise.all(promises)
      .then(() => {
        if (!active) return;
        setShippingPerSeller((prev) => {
          const merged = { ...prev, ...nextPerSeller };
          const sum = Object.values(merged).reduce((s, v) => s + v, 0);
          setShippingTotal(sum);
          return merged;
        });
      })
      .finally(() => {
        if (active) setShippingLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    items,
    shippingWilayaName,
    shippingWilayaId,
    info.shippingType,
    selectedWilayaId,
    loadCommunes,
  ]);

  // shippingTotal is the sum of per-seller shipping fees
  const shipping = shippingTotal;
  const total = subtotal + shipping;

  if (items.length === 0 && step !== "Success")
    return <Navigate to="/shop" replace />;
  if (!user) {
    openLogin();
    return <Navigate to="/shop" replace />;
  }

  const proceedToPayment = () => {
    setStopDeskWarning(false);
    setStep("Payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextFromDelivery = async () => {
    const e = validateDelivery(info);
    if (Object.keys(e).length) {
      setInfoErrors(e);
      return;
    }
    setInfoErrors({});

    if (info.shippingType === "desk_pickup") {
      const cachedFees = shippingCacheRef.current.values().next().value as
        | ApiCheckoutShippingFeesResponse["shippingFees"]
        | undefined;
      const companyCode = cachedFees?.meta?.company_code ?? companyCodeRef.current;
      const connectionLabel = connectionLabelRef.current;
      const originWilaya = user.address?.wilaya ?? "";

      setStopDeskChecking(true);
      setStopDeskWarning(false);
      const result = await checkStopDesk(
        companyCode,
        connectionLabel,
        originWilaya,
        info.wilaya,
        info.commune,
        info.phone,
        total,
      );
      setStopDeskChecking(false);
      if (result.ok === false && result.reason === "no_stopdesk") {
        setStopDeskWarning(true);
        return;
      }
    }

    proceedToPayment();
  };

  const handleNextFromPayment = () => {
    const e = validatePayment(payment);
    if (Object.keys(e).length) {
      setPaymentErrors(e);
      return;
    }
    setPaymentErrors({});
    setStep("Review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPlaceError("");
    try {
      const shippingDetails: ApiShippingDetails = {
        phone: info.phone,
        wilaya: info.wilaya,
        commune: info.commune,
        shippingType: info.shippingType,
        ...(info.postalCode ? { postalCode: info.postalCode } : {}),
        // include aggregated shipping in shippingDetails for visibility
        shippingFee: shippingTotal,
      };

      // build per-seller shippingFees array to send to backend so it can persist exact fee per order
      const shippingFeesPayload = Object.entries(shippingPerSeller).map(
        ([sellerId, fee]) => ({ sellerId, shippingFee: fee }),
      );

      // Backend cart is already in sync — just checkout and send per-seller fees
      const result = await cartService.checkout(
        shippingDetails,
        shippingFeesPayload,
      );
      clearCart();
      setPlacedOrders(result.orders);
      setStep("Success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setPlaceError(
        err instanceof Error
          ? err.message
          : "Failed to place order. Please try again.",
      );
    } finally {
      setPlacing(false);
    }
  };

  if (step === "Success" && placedOrders) {
    return (
      <OrderSuccess
        orders={placedOrders}
        method={payment.method}
        onHome={() => navigate("/")}
        onViewOrders={() => navigate("/profile?tab=orders")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="dark-gradient pt-24 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors duration-200 mb-6 text-sm"
          >
            <ArrowBackIcon sx={{ fontSize: 15 }} className="rtl:rotate-180" />
            {tr.checkout.backToCart}
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-display text-3xl font-bold text-white">
              {tr.checkout.title}
            </h1>
            <StepIndicator current={step} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {step === "Shipping" && (
              <DeliveryForm
                info={info}
                setInfo={setInfo}
                errors={infoErrors}
                onNext={handleNextFromDelivery}
                wilayas={wilayas}
                wilayasLoading={wilayasLoading}
                communes={communes}
                communesLoading={communesLoading}
                onWilayaChange={handleWilayaChange}
                stopDeskChecking={stopDeskChecking}
                stopDeskWarning={stopDeskWarning}
                onDismissStopDeskWarning={() => setStopDeskWarning(false)}
                onProceedAnyway={proceedToPayment}
              />
            )}
            {step === "Payment" && (
              <PaymentForm
                payment={payment}
                setPayment={setPayment}
                errors={paymentErrors}
                onNext={handleNextFromPayment}
                onBack={() => {
                  setStep("Shipping");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
            {step === "Review" && (
              <ReviewConfirmStep
                info={info}
                payment={payment}
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                shippingLoading={shippingLoading}
                shippingError={shippingError}
                placing={placing}
                placeError={placeError}
                onPlace={handlePlaceOrder}
                onBack={() => {
                  setStep("Payment");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </div>
          <div>
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              shippingLoading={shippingLoading}
              shippingError={shippingError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
