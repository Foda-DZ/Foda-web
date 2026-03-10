import { useState } from "react";
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
import type { ApiShippingDetails, ApiOrder } from "../types/api";
import Field from "../components/ui/Field";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";

// ─── Constants ────────────────────────────────────────────────────────────────
const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi",
  "05 - Batna", "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida",
  "10 - Bouira", "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen",
  "14 - Tiaret", "15 - Tizi Ouzou", "16 - Alger", "17 - Djelfa",
  "18 - Jijel", "19 - Sétif", "20 - Saïda", "21 - Skikda",
  "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine",
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara",
  "30 - Ouargla", "31 - Oran", "32 - El Bayadh", "33 - Illizi",
  "34 - Bordj Bou Arréridj", "35 - Boumerdès", "36 - El Tarf",
  "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla",
  "45 - Naâma", "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane",
  "49 - El M'Ghair", "50 - El Menia", "51 - Ouled Djellal",
  "52 - Bordj Badji Mokhtar", "53 - Béni Abbès", "54 - Timimoun",
  "55 - Touggourt", "56 - Djanet", "57 - In Salah", "58 - In Guezzam",
];

const SHIPPING_THRESHOLD = 5000;
const STEPS = ["Delivery", "Payment", "Review"] as const;
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

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({
  items, subtotal, shipping, total,
}: {
  items: CartItem[]; subtotal: number; shipping: number; total: number;
}) {
  const { tr } = useLang();
  return (
    <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-5 lg:sticky lg:top-28">
      <h3 className="font-display font-bold text-[#1A1A2E] text-lg">{tr.checkout.orderSummary}</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto pe-1">
        {items.map((item) => (
          <div key={item.key} className="flex gap-3">
            <div className="w-14 h-16 flex-shrink-0 bg-[#F0EBE3] overflow-hidden">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1A1A2E]/40 text-[10px] uppercase tracking-wider">
                {item.product.category}
              </p>
              <p className="text-[#1A1A2E] text-sm font-semibold leading-tight truncate">
                {item.product.name}
              </p>
              <p className="text-[#1A1A2E]/50 text-xs mt-0.5">
                {item.size} · ×{item.quantity}
              </p>
            </div>
            <p className="text-[#1A1A2E] font-bold text-sm flex-shrink-0">
              {(item.product.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-[#1A1A2E]/8 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-[#1A1A2E]/60">
          <span>{tr.checkout.subtotal}</span>
          <span>{subtotal.toLocaleString()} {tr.common.dzd}</span>
        </div>
        <div className="flex justify-between text-sm text-[#1A1A2E]/60">
          <span>{tr.checkout.shipping}</span>
          <span className={shipping === 0 ? "text-[#C9A84C] font-semibold" : ""}>
            {shipping === 0 ? tr.checkout.freeShipping : `${shipping.toLocaleString()} ${tr.common.dzd}`}
          </span>
        </div>
        <div className="h-px bg-[#1A1A2E]/8" />
        <div className="flex justify-between font-bold">
          <span className="text-[#1A1A2E]">{tr.checkout.total}</span>
          <span className="gold-text font-display text-xl">
            {total.toLocaleString()} {tr.common.dzd}
          </span>
        </div>
      </div>
      <div className="border-t border-[#1A1A2E]/8 pt-4 space-y-2">
        {[
          { Icon: SecurityIcon, text: "Secure checkout" },
          { Icon: LocalShippingIcon, text: "Delivery across all 58 wilayas" },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-[#1A1A2E]/40">
            <Icon sx={{ fontSize: 13, color: "#C9A84C", flexShrink: 0 }} /> {text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Delivery Form ────────────────────────────────────────────────────────────
function DeliveryForm({
  info, setInfo, errors, onNext,
}: {
  info: DeliveryInfo;
  setInfo: React.Dispatch<React.SetStateAction<DeliveryInfo>>;
  errors: Record<string, string>;
  onNext: () => void;
}) {
  const { tr } = useLang();
  const set = (key: keyof DeliveryInfo) => (val: string) =>
    setInfo((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1">
          {tr.checkout.deliveryTitle}
        </h2>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.checkout.deliverySub}</p>
      </div>

      {/* Shipping type */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C]">
          Shipping Method
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            { value: "home_delivery" as const, label: "Home Delivery", sub: "Delivered to your door", Icon: HomeIcon },
            { value: "desk_pickup" as const, label: "Desk Pickup", sub: "Pick up at delivery desk", Icon: BusinessIcon },
          ]).map(({ value, label, sub, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setInfo((f) => ({ ...f, shippingType: value }))}
              className={`flex items-center gap-3 p-4 border-2 transition-all duration-200 text-start ${
                info.shippingType === value
                  ? "border-[#C9A84C] bg-[#C9A84C]/5"
                  : "border-[#1A1A2E]/10 hover:border-[#C9A84C]/40"
              }`}
            >
              <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 ${info.shippingType === value ? "gold-gradient" : "bg-[#F0EBE3]"}`}>
                <Icon
                  sx={{
                    fontSize: 16,
                    color: info.shippingType === value ? "#1A1A2E" : "rgba(26,26,46,0.5)",
                  }}
                />
              </div>
              <div>
                <p className={`font-semibold text-sm ${info.shippingType === value ? "text-[#1A1A2E]" : "text-[#1A1A2E]/60"}`}>
                  {label}
                </p>
                <p className="text-[#1A1A2E]/40 text-xs">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C]">Contact</p>
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
        <p className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C]">
          Shipping Address
        </p>
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/60 mb-1.5">
            {tr.checkout.wilaya}
          </label>
          <select
            value={info.wilaya}
            onChange={(e) => set("wilaya")(e.target.value)}
            className={`w-full border bg-white py-2.5 px-3 text-sm text-[#1A1A2E] focus:outline-none transition-colors appearance-none cursor-pointer ${
              errors.wilaya
                ? "border-red-400"
                : "border-[#1A1A2E]/15 focus:border-[#C9A84C]"
            } ${!info.wilaya ? "text-[#1A1A2E]/40" : ""}`}
          >
            <option value="">{tr.checkout.selectWilaya}</option>
            {WILAYAS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {errors.wilaya && <p className="mt-1.5 text-xs text-red-500">{errors.wilaya}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Commune" error={errors.commune}>
            <TextInput
              value={info.commune}
              onChange={set("commune")}
              placeholder="Bab El Oued"
              error={errors.commune}
            />
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

      <Button onClick={onNext} className="h-11 gap-2">
        {tr.checkout.nextPayment} <ArrowForwardIcon sx={{ fontSize: 15 }} />
      </Button>
    </div>
  );
}

// ─── Payment Form ──────────────────────────────────────────────────────────────
function formatCard(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val: string) {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function PaymentForm({
  payment, setPayment, errors, onNext, onBack,
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
    { id: "cod" as const, label: tr.checkout.cod, sub: tr.checkout.codSub, Icon: LocalShippingIcon },
    { id: "cib" as const, label: tr.checkout.cib, sub: tr.checkout.cibSub, Icon: CreditCardIcon },
    { id: "baridimob" as const, label: tr.checkout.baridimob, sub: tr.checkout.baridimobSub, Icon: SmartphoneIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1">
          {tr.checkout.paymentTitle}
        </h2>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.checkout.paymentSub}</p>
      </div>
      <div className="space-y-3">
        {paymentMethods.map(({ id, label, sub, Icon }) => (
          <button
            key={id}
            onClick={() => set("method")(id)}
            className={`w-full flex items-center gap-4 p-4 border-2 transition-all duration-200 text-start ${
              payment.method === id
                ? "border-[#C9A84C] bg-[#C9A84C]/5"
                : "border-[#1A1A2E]/10 hover:border-[#C9A84C]/40"
            }`}
          >
            <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${payment.method === id ? "gold-gradient" : "bg-[#F0EBE3]"}`}>
              <Icon sx={{ fontSize: 18, color: payment.method === id ? "#1A1A2E" : "rgba(26,26,46,0.5)" }} />
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${payment.method === id ? "text-[#1A1A2E]" : "text-[#1A1A2E]/70"}`}>
                {label}
              </p>
              <p className="text-[#1A1A2E]/40 text-xs">{sub}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${payment.method === id ? "border-[#C9A84C] bg-[#C9A84C]" : "border-[#1A1A2E]/20"}`}>
              {payment.method === id && <div className="w-2 h-2 rounded-full bg-[#1A1A2E]" />}
            </div>
          </button>
        ))}
      </div>

      {payment.method === "cib" && (
        <div className="space-y-4 bg-[#F5F0E8] p-5 border border-[#C9A84C]/20">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50">
            Card Details
          </p>
          <Field label={tr.checkout.cardNumber} error={errors.cardNumber}>
            <TextInput
              value={payment.cardNumber}
              onChange={(v) => set("cardNumber")(formatCard(v))}
              placeholder="1234 5678 9012 3456"
              error={errors.cardNumber}
            />
          </Field>
          <Field label={tr.checkout.cardName} error={errors.cardName}>
            <TextInput
              value={payment.cardName}
              onChange={set("cardName")}
              placeholder="AMIRA BENMOUSSA"
              error={errors.cardName}
              className="uppercase"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={tr.checkout.expiry} error={errors.expiry}>
              <TextInput
                value={payment.expiry}
                onChange={(v) => set("expiry")(formatExpiry(v))}
                placeholder="MM/YY"
                error={errors.expiry}
              />
            </Field>
            <Field label={tr.checkout.cvv} error={errors.cvv}>
              <TextInput
                type="password"
                value={payment.cvv}
                onChange={(v) => set("cvv")(v.replace(/\D/g, "").slice(0, 4))}
                placeholder="•••"
                error={errors.cvv}
              />
            </Field>
          </div>
        </div>
      )}

      {payment.method === "baridimob" && (
        <div className="space-y-4 bg-[#F5F0E8] p-5 border border-[#C9A84C]/20">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50">
            BaridiMob Details
          </p>
          <Field label={tr.checkout.baridimobPhone} error={errors.baridimobPhone}>
            <TextInput
              type="tel"
              value={payment.baridimobPhone}
              onChange={(v) => set("baridimobPhone")(v.replace(/\D/g, "").slice(0, 10))}
              placeholder="0796 XX XX XX"
              error={errors.baridimobPhone}
            />
          </Field>
        </div>
      )}

      {payment.method === "cod" && (
        <div className="bg-[#F5F0E8] p-4 border border-[#C9A84C]/20">
          <p className="text-sm text-[#1A1A2E]/60 leading-relaxed">
            Pay in cash when your delivery arrives. A 750 {tr.common.dzd} delivery fee applies for
            orders under 5,000 {tr.common.dzd}.
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

// ─── Review Step ──────────────────────────────────────────────────────────────
function ReviewStep({
  info, payment, items, subtotal, shipping, total, onPlace, onBack, placing, placeError,
}: {
  info: DeliveryInfo;
  payment: PaymentInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  onPlace: () => void;
  onBack: () => void;
  placing: boolean;
  placeError: string;
}) {
  const { tr } = useLang();
  const methodLabels: Record<PaymentMethod, string> = {
    cod: tr.checkout.cod, cib: tr.checkout.cib, baridimob: tr.checkout.baridimob,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1">
          {tr.checkout.reviewTitle}
        </h2>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.checkout.reviewSub}</p>
      </div>

      <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50 flex items-center gap-2">
          <LocationOnIcon sx={{ fontSize: 12, color: "#C9A84C" }} /> {tr.checkout.deliveryInfo}
        </p>
        <div className="text-sm text-[#1A1A2E]/70 space-y-0.5">
          <p className="font-semibold text-[#1A1A2E] capitalize">
            {info.shippingType === "home_delivery" ? "Home Delivery" : "Desk Pickup"}
          </p>
          <p>{info.commune}, {info.wilaya}</p>
          {info.postalCode && <p>Postal: {info.postalCode}</p>}
          <p>{info.phone}</p>
        </div>
      </div>

      <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50 flex items-center gap-2">
          <CreditCardIcon sx={{ fontSize: 12, color: "#C9A84C" }} /> {tr.checkout.paymentMethod}
        </p>
        <p className="text-sm text-[#1A1A2E]/70">
          {methodLabels[payment.method]}
          {payment.method === "cib" && payment.cardNumber && (
            <span className="ms-2 text-[#1A1A2E]/40">•••• {payment.cardNumber.slice(-4)}</span>
          )}
          {payment.method === "baridimob" && payment.baridimobPhone && (
            <span className="ms-2 text-[#1A1A2E]/40">{payment.baridimobPhone}</span>
          )}
        </p>
      </div>

      <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50 flex items-center gap-2">
          <ShoppingBagIcon sx={{ fontSize: 12, color: "#C9A84C" }} />
          {tr.checkout.orderItems} ({items.reduce((s, i) => s + i.quantity, 0)})
        </p>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.key} className="flex justify-between items-center text-sm">
              <div>
                <span className="text-[#1A1A2E] font-medium">{item.product.name}</span>
                <span className="text-[#1A1A2E]/40 ms-2">× {item.quantity}</span>
                <span className="text-[#1A1A2E]/40 text-xs ms-1">({item.size})</span>
              </div>
              <span className="font-semibold text-[#1A1A2E]">
                {(item.product.price * item.quantity).toLocaleString()} {tr.common.dzd}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#1A1A2E]/8 pt-3 space-y-1.5">
          <div className="flex justify-between text-sm text-[#1A1A2E]/50">
            <span>{tr.checkout.subtotal}</span>
            <span>{subtotal.toLocaleString()} {tr.common.dzd}</span>
          </div>
          <div className="flex justify-between text-sm text-[#1A1A2E]/50">
            <span>{tr.checkout.shipping}</span>
            <span className={shipping === 0 ? "text-[#C9A84C]" : ""}>
              {shipping === 0
                ? tr.checkout.freeShipping
                : `${shipping.toLocaleString()} ${tr.common.dzd}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-[#1A1A2E]/8 pt-2 mt-2">
            <span className="text-[#1A1A2E]">{tr.checkout.total}</span>
            <span className="gold-text font-display">{total.toLocaleString()} {tr.common.dzd}</span>
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
        <Button variant="outline-gold" onClick={onBack} disabled={placing} className="h-11 gap-2">
          <ArrowBackIcon sx={{ fontSize: 15 }} /> {tr.common.back}
        </Button>
        <Button
          onClick={onPlace}
          loading={placing}
          className="h-11 flex-1 gap-2"
        >
          {tr.checkout.placeOrder} · {total.toLocaleString()} {tr.common.dzd}
          <ArrowForwardIcon sx={{ fontSize: 15 }} />
        </Button>
      </div>
    </div>
  );
}

// ─── Order Success ────────────────────────────────────────────────────────────
function OrderSuccess({
  orders, method, onHome, onViewOrders,
}: {
  orders: ApiOrder[];
  method: PaymentMethod;
  onHome: () => void;
  onViewOrders: () => void;
}) {
  const { tr } = useLang();
  const methodLabels: Record<PaymentMethod, string> = {
    cod: tr.checkout.cod, cib: tr.checkout.cib, baridimob: tr.checkout.baridimob,
  };
  const allItems = orders.flatMap((o) => o.items);
  const grandTotal = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const shipping = orders[0]?.shippingDetails;
  const orderDate = orders[0]?.createdAt
    ? new Date(orders[0].createdAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto gold-gradient rounded-full flex items-center justify-center shadow-lg">
            <CheckCircleIcon sx={{ fontSize: 38, color: "#1A1A2E" }} />
          </div>
          <div>
            <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-2">
              {tr.checkout.orderConfirmed}
            </p>
            <h1 className="font-display text-4xl font-bold text-[#1A1A2E] mb-2">
              {tr.checkout.successTitle}
            </h1>
            <p className="text-[#1A1A2E]/55 leading-relaxed max-w-sm mx-auto">
              {tr.checkout.successSub}
            </p>
          </div>
        </div>

        {/* Order references + meta */}
        <div className="bg-white border border-[#1A1A2E]/8 divide-y divide-[#1A1A2E]/6">
          {orders.map((order) => (
            <div key={order._id} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/45">
                {tr.checkout.orderNumber}
              </span>
              <span className="font-display font-bold text-[#C9A84C] text-sm tracking-widest">
                #{order._id.slice(-10).toUpperCase()}
              </span>
            </div>
          ))}
          {orderDate && (
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/45">
                Date Placed
              </span>
              <span className="text-sm text-[#1A1A2E]/70">{orderDate}</span>
            </div>
          )}
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/45">
              Status
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/45">
              {tr.checkout.paymentMethod}
            </span>
            <span className="text-sm text-[#1A1A2E]/70">{methodLabels[method]}</span>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-[#1A1A2E]/8">
          <div className="px-5 py-3 border-b border-[#1A1A2E]/6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/45 flex items-center gap-2">
              <ShoppingBagIcon sx={{ fontSize: 12, color: "#C9A84C" }} />
              {tr.checkout.orderItems} ({allItems.reduce((s, i) => s + i.quantity, 0)})
            </p>
          </div>
          <div className="divide-y divide-[#1A1A2E]/5">
            {allItems.map((item, idx) => (
              <div key={`${item.productId}-${idx}`} className="flex gap-4 px-5 py-4">
                {item.image && (
                  <div className="w-14 h-16 flex-shrink-0 bg-[#F0EBE3] overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[#1A1A2E] text-sm font-semibold leading-tight">{item.name}</p>
                  <p className="text-[#1A1A2E]/45 text-xs mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="text-[#1A1A2E] font-bold text-sm flex-shrink-0">
                  {(item.price * item.quantity).toLocaleString()} {tr.common.dzd}
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-[#1A1A2E]/6 flex justify-between items-center">
            <span className="text-sm font-bold text-[#1A1A2E]">{tr.checkout.total}</span>
            <span className="font-display font-bold text-xl gold-text">
              {grandTotal.toLocaleString()} {tr.common.dzd}
            </span>
          </div>
        </div>

        {/* Shipping */}
        {shipping && (
          <div className="bg-white border border-[#1A1A2E]/8">
            <div className="px-5 py-3 border-b border-[#1A1A2E]/6">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/45 flex items-center gap-2">
                <LocationOnIcon sx={{ fontSize: 12, color: "#C9A84C" }} />
                {tr.checkout.deliveryInfo}
              </p>
            </div>
            <div className="px-5 py-4 space-y-1.5 text-sm text-[#1A1A2E]/70">
              <p className="font-semibold text-[#1A1A2E]">
                {shipping.shippingType === "home_delivery" ? "Home Delivery" : "Desk Pickup"}
              </p>
              <p>{shipping.commune}, {shipping.wilaya}</p>
              {shipping.postalCode && <p>Postal code: {shipping.postalCode}</p>}
              <p>{shipping.phone}</p>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button variant="outline-gold" onClick={onViewOrders} className="flex-1 h-11 gap-2">
            <ShoppingBagIcon sx={{ fontSize: 15 }} /> View My Orders
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
  const stepLabels = [tr.checkout.delivery, tr.checkout.payment, tr.checkout.review];
  const idx = STEPS.indexOf(current as (typeof STEPS)[number]);
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < idx
                  ? "gold-gradient text-[#1A1A2E]"
                  : i === idx
                    ? "bg-[#1A1A2E] text-white"
                    : "border-2 border-[#1A1A2E]/15 text-[#1A1A2E]/30"
              }`}
            >
              {i < idx ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs font-semibold tracking-wide hidden sm:block transition-colors duration-300 ${
                i === idx ? "text-[#1A1A2E]" : i < idx ? "text-[#C9A84C]" : "text-[#1A1A2E]/30"
              }`}
            >
              {stepLabels[i]}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-12 sm:w-16 h-px mx-2 sm:mx-3 transition-all duration-300 ${
                i < idx ? "bg-[#C9A84C]" : "bg-[#1A1A2E]/10"
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
    if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, "").length < 16)
      e.cardNumber = "Enter a valid 16-digit card number.";
    if (!payment.cardName.trim()) e.cardName = "Required.";
    if (!payment.expiry || payment.expiry.length < 5) e.expiry = "Enter a valid expiry (MM/YY).";
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

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 750;
  const total = subtotal + shipping;

  const [step, setStep] = useState<Step>("Delivery");
  const [info, setInfo] = useState<DeliveryInfo>({
    phone: "", wilaya: "", commune: "", postalCode: "", shippingType: "home_delivery",
  });
  const [infoErrors, setInfoErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState<PaymentInfo>({
    method: "cod", cardNumber: "", cardName: "", expiry: "", cvv: "", baridimobPhone: "",
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");
  const [placedOrders, setPlacedOrders] = useState<ApiOrder[] | null>(null);

  if (items.length === 0 && step !== "Success") return <Navigate to="/shop" replace />;
  if (!user) {
    openLogin();
    return <Navigate to="/shop" replace />;
  }

  const handleNextFromDelivery = () => {
    const e = validateDelivery(info);
    if (Object.keys(e).length) { setInfoErrors(e); return; }
    setInfoErrors({});
    setStep("Payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextFromPayment = () => {
    const e = validatePayment(payment);
    if (Object.keys(e).length) { setPaymentErrors(e); return; }
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
      };
      await cartService.clearCart();
      for (const item of items) {
        await cartService.addItem(item.product.id, item.size, item.color);
      }
      const result = await cartService.checkout(shippingDetails);
      clearCart();
      setPlacedOrders(result.orders);
      setStep("Success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setPlaceError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
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
        onViewOrders={() => navigate("/profile")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="dark-gradient pt-24 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-white/50 hover:text-[#C9A84C] transition-colors duration-200 mb-6 text-sm"
          >
            <ArrowBackIcon sx={{ fontSize: 15 }} className="rtl:rotate-180" />
            {tr.checkout.backToCart}
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-display text-3xl font-bold text-white">{tr.checkout.title}</h1>
            <StepIndicator current={step} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {step === "Delivery" && (
              <DeliveryForm info={info} setInfo={setInfo} errors={infoErrors} onNext={handleNextFromDelivery} />
            )}
            {step === "Payment" && (
              <PaymentForm
                payment={payment}
                setPayment={setPayment}
                errors={paymentErrors}
                onNext={handleNextFromPayment}
                onBack={() => { setStep("Delivery"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              />
            )}
            {step === "Review" && (
              <ReviewStep
                info={info}
                payment={payment}
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                placing={placing}
                placeError={placeError}
                onPlace={handlePlaceOrder}
                onBack={() => { setStep("Payment"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              />
            )}
          </div>
          <div>
            <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
