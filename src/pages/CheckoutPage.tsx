import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  CreditCard,
  Smartphone,
  Truck,
  CheckCircle,
  ShoppingBag,
  ChevronDown,
  AlertCircle,
  Shield,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import type { CartItem } from "../types";

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
  firstName: string; lastName: string; email: string; phone: string;
  address: string; wilaya: string; city: string; notes: string;
}

interface PaymentInfo {
  method: PaymentMethod; cardNumber: string; cardName: string;
  expiry: string; cvv: string; baridimobPhone: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/60 mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", className = "", ...rest }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; className?: string; [k: string]: unknown;
}) {
  return (
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full h-11 px-4 border border-[#1A1A2E]/15 bg-white text-[#1A1A2E] placeholder-[#1A1A2E]/30 text-sm outline-none focus:border-[#C9A84C]/60 transition-colors duration-200 ${className}`}
      {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
}

function Select({ value, onChange, children, error }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode; error?: string;
}) {
  return (
    <div className={`relative border transition-colors duration-200 ${error ? "border-red-400" : "border-[#1A1A2E]/15 focus-within:border-[#C9A84C]/60"}`}>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-4 pe-10 bg-white text-sm text-[#1A1A2E] outline-none appearance-none">
        {children}
      </select>
      <ChevronDown size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-[#1A1A2E]/40 pointer-events-none" />
    </div>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({ items, subtotal, shipping, total }: {
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
              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1A1A2E]/40 text-[10px] uppercase tracking-wider">{item.product.brand}</p>
              <p className="text-[#1A1A2E] text-sm font-semibold leading-tight truncate">{item.product.name}</p>
              <p className="text-[#1A1A2E]/50 text-xs mt-0.5">{item.size} · {item.color.name} · ×{item.quantity}</p>
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
          <span className="gold-text font-display text-xl">{total.toLocaleString()} {tr.common.dzd}</span>
        </div>
      </div>
      <div className="border-t border-[#1A1A2E]/8 pt-4 space-y-2">
        {[{ Icon: Shield, text: "Secure checkout" }, { Icon: Truck, text: "Delivery across all 58 wilayas" }].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-[#1A1A2E]/40">
            <Icon size={13} className="text-[#C9A84C] flex-shrink-0" /> {text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Delivery Form ────────────────────────────────────────────────────────────
function DeliveryForm({ info, setInfo, errors, onNext }: {
  info: DeliveryInfo; setInfo: React.Dispatch<React.SetStateAction<DeliveryInfo>>;
  errors: Record<string, string>; onNext: () => void;
}) {
  const { tr } = useLang();
  const set = (key: keyof DeliveryInfo) => (val: string) => setInfo((f) => ({ ...f, [key]: val }));
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1">{tr.checkout.deliveryTitle}</h2>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.checkout.deliverySub}</p>
      </div>
      <div className="space-y-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C]">Contact</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={tr.checkout.firstName} error={errors.firstName}>
            <Input value={info.firstName} onChange={set("firstName")} placeholder="Amira" />
          </Field>
          <Field label={tr.checkout.lastName} error={errors.lastName}>
            <Input value={info.lastName} onChange={set("lastName")} placeholder="Benmoussa" />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={tr.checkout.email} error={errors.email}>
            <Input type="email" value={info.email} onChange={set("email")} placeholder="you@example.com" />
          </Field>
          <Field label={tr.checkout.phone} error={errors.phone}>
            <Input type="tel" value={info.phone} onChange={set("phone")} placeholder="0555 XX XX XX" />
          </Field>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#C9A84C]">Shipping Address</p>
        <Field label={tr.checkout.address} error={errors.address}>
          <Input value={info.address} onChange={set("address")} placeholder="15 Rue Didouche Mourad" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={tr.checkout.wilaya} error={errors.wilaya}>
            <Select value={info.wilaya} onChange={set("wilaya")} error={errors.wilaya}>
              <option value="">{tr.checkout.selectWilaya}</option>
              {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
            </Select>
          </Field>
          <Field label={tr.checkout.city} error={errors.city}>
            <Input value={info.city} onChange={set("city")} placeholder="Alger Centre" />
          </Field>
        </div>
        <Field label={tr.checkout.notes}>
          <textarea
            value={info.notes} onChange={(e) => set("notes")(e.target.value)}
            placeholder={tr.checkout.notesPlaceholder} rows={3}
            className="w-full px-4 py-3 border border-[#1A1A2E]/15 bg-white text-[#1A1A2E] placeholder-[#1A1A2E]/30 text-sm outline-none focus:border-[#C9A84C]/60 transition-colors duration-200 resize-none"
          />
        </Field>
      </div>
      <button onClick={onNext} className="btn-gold w-full sm:w-auto flex items-center gap-2 group">
        {tr.checkout.nextPayment}{" "}
        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
      </button>
    </div>
  );
}

// ─── Payment Form ─────────────────────────────────────────────────────────────
function formatCard(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val: string) {
  const d = val.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function PaymentForm({ payment, setPayment, errors, onNext, onBack }: {
  payment: PaymentInfo; setPayment: React.Dispatch<React.SetStateAction<PaymentInfo>>;
  errors: Record<string, string>; onNext: () => void; onBack: () => void;
}) {
  const { tr } = useLang();
  const set = (key: keyof PaymentInfo) => (val: string) => setPayment((f) => ({ ...f, [key]: val }));

  const paymentMethods = [
    { id: "cod" as const, label: tr.checkout.cod, sub: tr.checkout.codSub, Icon: Truck },
    { id: "cib" as const, label: tr.checkout.cib, sub: tr.checkout.cibSub, Icon: CreditCard },
    { id: "baridimob" as const, label: tr.checkout.baridimob, sub: tr.checkout.baridimobSub, Icon: Smartphone },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1">{tr.checkout.paymentTitle}</h2>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.checkout.paymentSub}</p>
      </div>
      <div className="space-y-3">
        {paymentMethods.map(({ id, label, sub, Icon }) => (
          <button key={id} onClick={() => set("method")(id)}
            className={`w-full flex items-center gap-4 p-4 border-2 transition-all duration-200 text-start ${payment.method === id ? "border-[#C9A84C] bg-[#C9A84C]/5" : "border-[#1A1A2E]/10 hover:border-[#C9A84C]/40"}`}>
            <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${payment.method === id ? "gold-gradient" : "bg-[#F0EBE3]"}`}>
              <Icon size={18} className={payment.method === id ? "text-[#1A1A2E]" : "text-[#1A1A2E]/50"} />
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${payment.method === id ? "text-[#1A1A2E]" : "text-[#1A1A2E]/70"}`}>{label}</p>
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
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50">Card Details</p>
          <Field label={tr.checkout.cardNumber} error={errors.cardNumber}>
            <Input value={payment.cardNumber} onChange={(v) => set("cardNumber")(formatCard(v))} placeholder="1234 5678 9012 3456" />
          </Field>
          <Field label={tr.checkout.cardName} error={errors.cardName}>
            <Input value={payment.cardName} onChange={set("cardName")} placeholder="AMIRA BENMOUSSA" className="uppercase" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={tr.checkout.expiry} error={errors.expiry}>
              <Input value={payment.expiry} onChange={(v) => set("expiry")(formatExpiry(v))} placeholder="MM/YY" />
            </Field>
            <Field label={tr.checkout.cvv} error={errors.cvv}>
              <Input type="password" value={payment.cvv} onChange={(v) => set("cvv")(v.replace(/\D/g, "").slice(0, 4))} placeholder="•••" />
            </Field>
          </div>
        </div>
      )}
      {payment.method === "baridimob" && (
        <div className="space-y-4 bg-[#F5F0E8] p-5 border border-[#C9A84C]/20">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50">BaridiMob Details</p>
          <Field label={tr.checkout.baridimobPhone} error={errors.baridimobPhone}>
            <Input type="tel" value={payment.baridimobPhone}
              onChange={(v) => set("baridimobPhone")(v.replace(/\D/g, "").slice(0, 10))} placeholder="0796 XX XX XX" />
          </Field>
        </div>
      )}
      {payment.method === "cod" && (
        <div className="bg-[#F5F0E8] p-4 border border-[#C9A84C]/20">
          <p className="text-sm text-[#1A1A2E]/60 leading-relaxed">
            Pay in cash when your delivery arrives. A 750 {tr.common.dzd} delivery fee applies for orders under 5,000 {tr.common.dzd}.
          </p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onBack} className="btn-outline-gold flex items-center gap-2 group">
          <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />{" "}
          {tr.common.back}
        </button>
        <button onClick={onNext} className="btn-gold flex items-center gap-2 group">
          {tr.checkout.nextReview}{" "}
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </button>
      </div>
    </div>
  );
}

// ─── Review Step ──────────────────────────────────────────────────────────────
function ReviewStep({ info, payment, items, subtotal, shipping, total, onPlace, onBack, placing }: {
  info: DeliveryInfo; payment: PaymentInfo; items: CartItem[];
  subtotal: number; shipping: number; total: number;
  onPlace: () => void; onBack: () => void; placing: boolean;
}) {
  const { tr } = useLang();
  const methodLabels: Record<PaymentMethod, string> = {
    cod: tr.checkout.cod, cib: tr.checkout.cib, baridimob: tr.checkout.baridimob,
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1">{tr.checkout.reviewTitle}</h2>
        <p className="text-[#1A1A2E]/50 text-sm">{tr.checkout.reviewSub}</p>
      </div>
      <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50 flex items-center gap-2">
          <MapPin size={12} className="text-[#C9A84C]" /> {tr.checkout.deliveryInfo}
        </p>
        <div className="text-sm text-[#1A1A2E]/70 space-y-0.5">
          <p className="font-semibold text-[#1A1A2E]">{info.firstName} {info.lastName}</p>
          <p>{info.address}</p>
          <p>{info.city}, {info.wilaya}</p>
          <p>{info.phone}</p>
          {info.notes && <p className="text-[#1A1A2E]/40 italic">{info.notes}</p>}
        </div>
      </div>
      <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50 flex items-center gap-2">
          <CreditCard size={12} className="text-[#C9A84C]" /> {tr.checkout.paymentMethod}
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
          <ShoppingBag size={12} className="text-[#C9A84C]" /> {tr.checkout.orderItems} ({items.reduce((s, i) => s + i.quantity, 0)})
        </p>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.key} className="flex justify-between items-center text-sm">
              <div>
                <span className="text-[#1A1A2E] font-medium">{item.product.name}</span>
                <span className="text-[#1A1A2E]/40 ms-2">× {item.quantity}</span>
                <span className="text-[#1A1A2E]/40 text-xs ms-1">({item.size}, {item.color.name})</span>
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
              {shipping === 0 ? tr.checkout.freeShipping : `${shipping.toLocaleString()} ${tr.common.dzd}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-[#1A1A2E]/8 pt-2 mt-2">
            <span className="text-[#1A1A2E]">{tr.checkout.total}</span>
            <span className="gold-text font-display">{total.toLocaleString()} {tr.common.dzd}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onBack} disabled={placing} className="btn-outline-gold flex items-center gap-2 group disabled:opacity-50">
          <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />{" "}
          {tr.common.back}
        </button>
        <button onClick={onPlace} disabled={placing}
          className="btn-gold flex-1 flex items-center justify-center gap-2 group disabled:opacity-70">
          {placing ? (
            <span className="w-4 h-4 border-2 border-[#1A1A2E]/30 border-t-[#1A1A2E] rounded-full animate-spin" />
          ) : (
            <>
              {tr.checkout.placeOrder} · {total.toLocaleString()} {tr.common.dzd}{" "}
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Order Success ────────────────────────────────────────────────────────────
function OrderSuccess({ orderNumber, total, method, onHome }: {
  orderNumber: string; total: number; method: PaymentMethod; onHome: () => void;
}) {
  const { tr } = useLang();
  const methodLabels: Record<PaymentMethod, string> = {
    cod: tr.checkout.cod, cib: tr.checkout.cib, baridimob: tr.checkout.baridimob,
  };
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto gold-gradient rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-[#1A1A2E]" />
        </div>
        <div>
          <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-2">{tr.checkout.orderConfirmed}</p>
          <h1 className="font-display text-4xl font-bold text-[#1A1A2E] mb-3">{tr.checkout.successTitle}</h1>
          <p className="text-[#1A1A2E]/60 leading-relaxed">{tr.checkout.successSub}</p>
        </div>
        <div className="bg-white border border-[#1A1A2E]/8 p-6 text-start space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50">{tr.checkout.orderNumber}</span>
            <span className="font-display font-bold text-[#C9A84C] text-sm tracking-wide">{orderNumber}</span>
          </div>
          <div className="h-px bg-[#1A1A2E]/8" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50">{tr.checkout.total}</span>
            <span className="font-bold text-[#1A1A2E]">{total.toLocaleString()} {tr.common.dzd}</span>
          </div>
          <div className="h-px bg-[#1A1A2E]/8" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/50">{tr.checkout.paymentMethod}</span>
            <span className="text-sm text-[#1A1A2E]/70">{methodLabels[method]}</span>
          </div>
        </div>
        <button onClick={onHome} className="btn-dark w-full flex items-center justify-center gap-2 group">
          {tr.checkout.backHome}{" "}
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </button>
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
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < idx ? "gold-gradient text-[#1A1A2E]" : i === idx ? "bg-[#1A1A2E] text-white" : "border-2 border-[#1A1A2E]/15 text-[#1A1A2E]/30"}`}>
              {i < idx ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-semibold tracking-wide hidden sm:block transition-colors duration-300 ${i === idx ? "text-[#1A1A2E]" : i < idx ? "text-[#C9A84C]" : "text-[#1A1A2E]/30"}`}>
              {stepLabels[i]}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-12 sm:w-16 h-px mx-2 sm:mx-3 transition-all duration-300 ${i < idx ? "bg-[#C9A84C]" : "bg-[#1A1A2E]/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateInfo(info: DeliveryInfo): Record<string, string> {
  const e: Record<string, string> = {};
  if (!info.firstName.trim()) e.firstName = "Required.";
  if (!info.lastName.trim()) e.lastName = "Required.";
  if (!info.email.trim()) e.email = "Required.";
  else if (!/\S+@\S+\.\S+/.test(info.email)) e.email = "Invalid email.";
  if (!info.phone.trim()) e.phone = "Required.";
  if (!info.address.trim()) e.address = "Required.";
  if (!info.wilaya) e.wilaya = "Please select a wilaya.";
  if (!info.city.trim()) e.city = "Required.";
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
  const { user } = useAuth();
  const { tr } = useLang();

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 750;
  const total = subtotal + shipping;

  const [step, setStep] = useState<Step>("Delivery");
  const [info, setInfo] = useState<DeliveryInfo>({
    firstName: user?.firstName ?? "", lastName: user?.lastName ?? "",
    email: user?.email ?? "", phone: "", address: "", wilaya: "", city: "", notes: "",
  });
  const [infoErrors, setInfoErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState<PaymentInfo>({
    method: "cod", cardNumber: "", cardName: "", expiry: "", cvv: "", baridimobPhone: "",
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  if (items.length === 0 && step !== "Success") return <Navigate to="/shop" replace />;

  const handleNextFromDelivery = () => {
    const e = validateInfo(info);
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

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      const num = `FODA-${Date.now().toString(36).toUpperCase()}`;
      // Persist order so sellers can track revenue and analytics
      try {
        const existing = JSON.parse(localStorage.getItem("foda_orders") || "[]");
        localStorage.setItem("foda_orders", JSON.stringify([...existing, {
          id: num,
          buyerId: user?.id ?? 0,
          items,
          total,
          subtotal,
          shipping,
          paymentMethod: payment.method,
          delivery: info,
          createdAt: new Date().toISOString(),
          status: "pending",
        }]));
      } catch { /* best effort */ }
      setOrderNumber(num);
      clearCart();
      setStep("Success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  if (step === "Success" && orderNumber) {
    return (
      <OrderSuccess orderNumber={orderNumber} total={total} method={payment.method} onHome={() => navigate("/")} />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="dark-gradient pt-24 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate("/shop")}
            className="flex items-center gap-2 text-white/50 hover:text-[#C9A84C] transition-colors duration-200 mb-6 text-sm">
            <ArrowLeft size={15} className="rtl:rotate-180" /> {tr.checkout.backToCart}
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
              <PaymentForm payment={payment} setPayment={setPayment} errors={paymentErrors}
                onNext={handleNextFromPayment}
                onBack={() => { setStep("Delivery"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
            )}
            {step === "Review" && (
              <ReviewStep info={info} payment={payment} items={items} subtotal={subtotal}
                shipping={shipping} total={total} placing={placing} onPlace={handlePlaceOrder}
                onBack={() => { setStep("Payment"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
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
