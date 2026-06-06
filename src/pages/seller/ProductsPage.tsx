import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningIcon from "@mui/icons-material/Warning";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import { useSellerContext } from "../../context/SellerContext";
import { useLang } from "../../context/LangContext";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import type { Product } from "../../types";

// â”€â”€â”€ Promotion Modal Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface PromoForm {
  active: boolean;
  type: "percentage" | "amount";
  value: string;
  startDate: string;
  endDate: string;
}

interface PromoModalState {
  product: Product;
}

// â”€â”€â”€ Toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Toggle({
  checked,
  onChange,
  isRTL = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  isRTL?: boolean;
}) {
  // In RTL the "on" knob slides to the left, so flip the travel sign.
  const offset = checked ? (isRTL ? -20 : 20) : 0;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40 ${
        checked ? "bg-emerald-500" : "bg-[#1A1A2E]/15"
      }`}
    >
      <span
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
        style={{
          insetInlineStart: 4,
          transform: `translateX(${offset}px)`,
        }}
      />
    </button>
  );
}

// â”€â”€â”€ Promotion Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PromotionModal({
  state,
  onClose,
  onSaved,
}: {
  state: PromoModalState;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { tr, isRTL } = useLang();
  const tp = tr.seller.promoModal;
  const { product } = state;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState<PromoForm>({
    active: false,
    type: "percentage",
    value: "",
    startDate: "",
    endDate: "",
  });

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load current promotion data for this product
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await sellerService.getProductPromotion(product.id);
        if (cancelled) return;
        const p = data.promotion;
        if (p) {
          setHasExisting(Boolean(p.value && p.value > 0));
          setForm({
            active: p.active ?? false,
            type: p.type ?? "percentage",
            value: p.value != null ? String(p.value) : "",
            startDate: p.startDate ? p.startDate.substring(0, 10) : "",
            endDate: p.endDate ? p.endDate.substring(0, 10) : "",
          });
        }
      } catch {
        // ignore â€” use empty defaults
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [product.id]);

  const handleSave = async () => {
    const valueNum = parseFloat(form.value);
    if (!form.value.trim() || Number.isNaN(valueNum) || valueNum <= 0) {
      showToast(tp.valueGreaterThanZero, "error");
      return;
    }
    if (form.type === "percentage" && valueNum > 100) {
      showToast(tp.pctCannotExceed, "error");
      return;
    }
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      showToast(tp.startBeforeEnd, "error");
      return;
    }
    setSaving(true);
    try {
      await sellerService.upsertPromotion(product.id, {
        active: form.active,
        type: form.type,
        value: valueNum,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
      showToast(tp.savedSuccess, "success");
      setHasExisting(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1200);
    } catch (err) {
      showToast(err instanceof Error ? err.message : tp.failedSave, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await sellerService.removePromotion(product.id);
      showToast(tp.removedSuccess, "success");
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : tp.failedRemove, "error");
    } finally {
      setRemoving(false);
      setConfirmRemove(false);
    }
  };

  const formValueNum = parseFloat(form.value) || 0;
  const discountedPrice =
    formValueNum > 0
      ? form.type === "percentage"
        ? product.price * (1 - formValueNum / 100)
        : Math.max(0, product.price - formValueNum)
      : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#1A1A2E]/8 flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center shrink-0">
              <LocalOfferOutlinedIcon sx={{ fontSize: 17, color: "#1A1A2E" }} />
            </div>
            <div className="min-w-0">
              <p className="sl-eyebrow">{tp.setPromotion}</p>
              <p className="text-xs font-semibold text-[#1A1A2E] leading-tight truncate max-w-[220px]">
                {product.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={tp.cancel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A2E]/40 hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/5 transition-colors shrink-0"
          >
            <CloseOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {loading ? (
            <div className="space-y-4">
              {[80, 120, 80, 100].map((w, i) => (
                <Skeleton key={i} variant="rounded" width="100%" height={w} sx={{ borderRadius: "0.75rem" }} />
              ))}
            </div>
          ) : (
            <>
              {/* Product preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#1A1A2E]/6">
                <div className="w-12 h-14 rounded-lg bg-[#F0EBE3] overflow-hidden shrink-0">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#1A1A2E] text-sm truncate">{product.name}</p>
                  <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
                    <span className="font-bold text-[#1A1A2E]">
                      {discountedPrice !== null
                        ? Math.round(discountedPrice).toLocaleString()
                        : product.price.toLocaleString()}{" "}
                      {tr.common.dzd}
                    </span>
                    {discountedPrice !== null && (
                      <span className="text-xs text-[#1A1A2E]/40 line-through">
                        {product.price.toLocaleString()} {tr.common.dzd}
                      </span>
                    )}
                  </div>
                  {discountedPrice !== null && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                      {form.type === "percentage"
                        ? `-${form.value}%`
                        : `-${formValueNum.toLocaleString()} ${tr.common.dzd}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between py-3 border-b border-[#1A1A2E]/6">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{tp.promotionActive}</p>
                  <p className="text-xs text-[#1A1A2E]/40 mt-0.5">
                    {form.active ? tp.visibleToCustomers : tp.hiddenFromCustomers}
                  </p>
                </div>
                <Toggle
                  checked={form.active}
                  onChange={(v) => setForm((f) => ({ ...f, active: v }))}
                  isRTL={isRTL}
                />
              </div>

              {/* Discount type & value */}
              <div className="space-y-2.5">
                <label className="sl-eyebrow">{tp.discount}</label>
                <div className="flex items-center gap-3">
                  {/* Type selector */}
                  <div className="flex rounded-full border border-[#1A1A2E]/12 overflow-hidden p-0.5 bg-white">
                    {(["percentage", "amount"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, type }))}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-150 ${
                          form.type === type
                            ? "gold-gradient text-[#1A1A2E]"
                            : "text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70"
                        }`}
                      >
                        {type === "percentage" ? "%" : tr.common.dzd}
                      </button>
                    ))}
                  </div>

                  {/* Value input — unit suffix follows the reading direction */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.value}
                      placeholder={
                        form.type === "percentage"
                          ? tp.valuePlaceholderPct
                          : tp.valuePlaceholderAmt
                      }
                      onChange={(e) =>
                        setForm((f) => ({ ...f, value: e.target.value }))
                      }
                      className="w-full h-10 rounded-xl border border-[#1A1A2E]/15 bg-white text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/10 transition-all"
                      style={{ paddingInlineStart: 12, paddingInlineEnd: 40 }}
                    />
                    <span
                      className="absolute top-1/2 -translate-y-1/2 text-xs text-[#1A1A2E]/30 font-semibold pointer-events-none"
                      style={{ insetInlineEnd: 12 }}
                    >
                      {form.type === "percentage" ? "%" : tr.common.dzd}
                    </span>
                  </div>
                </div>
                {form.type === "percentage" && form.value > 100 && (
                  <p className="text-xs text-red-500">{tp.pctCannotExceed}</p>
                )}
              </div>

              {/* Date range (optional) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="sl-eyebrow">
                    {tp.dateRange}{" "}
                    <span className="normal-case font-normal text-[#1A1A2E]/30">{tp.optional}</span>
                  </label>
                  {(form.startDate || form.endDate) && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, startDate: "", endDate: "" }))}
                      className="text-[10px] text-[#1A1A2E]/40 hover:text-red-500 transition-colors"
                    >
                      {tp.clearDates}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <CalendarTodayOutlinedIcon
                      sx={{
                        fontSize: 13,
                        color: "rgba(26,26,46,0.3)",
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        insetInlineStart: 12,
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                      className="w-full h-10 rounded-xl border border-[#1A1A2E]/15 bg-white text-xs text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                      style={{ paddingInlineStart: 34, paddingInlineEnd: 8 }}
                    />
                  </div>
                  <div className="relative">
                    <CalendarTodayOutlinedIcon
                      sx={{
                        fontSize: 13,
                        color: "rgba(26,26,46,0.3)",
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        insetInlineStart: 12,
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="date"
                      value={form.endDate}
                      min={form.startDate || undefined}
                      onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                      className="w-full h-10 rounded-xl border border-[#1A1A2E]/15 bg-white text-xs text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                      style={{ paddingInlineStart: 34, paddingInlineEnd: 8 }}
                    />
                  </div>
                </div>
                {form.startDate && form.endDate && form.startDate > form.endDate && (
                  <p className="text-xs text-red-500">{tp.startBeforeEnd}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="px-6 py-4 border-t border-[#1A1A2E]/8 bg-[#FAF7F2] shrink-0 space-y-3">
            {/* Remove confirmation inline */}
            {confirmRemove ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="flex-1 text-xs text-red-700 font-medium">
                  {tp.removeThisPromo}
                </p>
                <button
                  onClick={() => setConfirmRemove(false)}
                  className="text-xs text-[#1A1A2E]/50 hover:text-[#1A1A2E] px-2 py-1"
                >
                  {tp.cancel}
                </button>
                <button
                  onClick={handleRemove}
                  disabled={removing}
                  className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
                >
                  {removing && (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {tp.remove}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {hasExisting && (
                  <button
                    onClick={() => setConfirmRemove(true)}
                    disabled={saving || removing}
                    className="flex items-center gap-1.5 h-11 px-4 rounded-full border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                    {tp.remove}
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || removing || form.value <= 0}
                  className="flex-1 h-11 rounded-full flex items-center justify-center gap-2 bg-[#1A1A2E] text-white text-xs font-bold hover:bg-[#2d2d50] transition-colors disabled:opacity-60"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LocalOfferOutlinedIcon sx={{ fontSize: 15 }} />
                  )}
                  {saving ? tp.saving : tp.savePromotion}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-[60] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium sl-rise ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
          ) : (
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 16 }} />
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Tracked Links Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TRACKED_PLATFORMS = [
  { key: "instagram", label: "Instagram", color: "#E1306C" },
  { key: "tiktok", label: "TikTok", color: "#1A1A2E" },
  { key: "whatsapp", label: "WhatsApp", color: "#25D366" },
  { key: "facebook", label: "Facebook", color: "#1877F2" },
] as const;

function TrackedLinksModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { tr, isRTL } = useLang();
  const t = tr.seller.trackedLinks;
  const [copied, setCopied] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const linkFor = (src: string) => `${origin}/products/${product.id}?src=${src}`;

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
    } catch {
      // clipboard unavailable â€” ignore
    }
  };

  const copyAll = () =>
    copy(
      "all",
      TRACKED_PLATFORMS.map((p) => `${p.label}: ${linkFor(p.key)}`).join("\n"),
    );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#1A1A2E]/8 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A2E]/8 bg-[#FAF7F2]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center shrink-0">
              <ShareOutlinedIcon sx={{ fontSize: 17, color: "#1A1A2E" }} />
            </div>
            <div className="min-w-0">
              <p className="sl-eyebrow">{t.title}</p>
              <p className="text-xs font-semibold text-[#1A1A2E] leading-tight truncate max-w-[220px]">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={tr.seller.promoModal.cancel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A2E]/40 hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/5 transition-colors shrink-0"
          >
            <CloseOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-2.5">
          <p className="text-xs text-[#1A1A2E]/50">{t.subtitle}</p>
          {TRACKED_PLATFORMS.map((p) => {
            const link = linkFor(p.key);
            const isCopied = copied === p.key;
            return (
              <div key={p.key} className="flex items-center gap-3 rounded-xl border border-[#1A1A2E]/8 bg-[#FBF9F5] p-2.5 transition-colors hover:border-[#C9A84C]/30">
                <span className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${p.color}1a` }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-[#1A1A2E]">{p.label}</p>
                  <p className="text-[10px] text-[#1A1A2E]/45 truncate font-mono" dir="ltr">{link}</p>
                </div>
                <button
                  onClick={() => copy(p.key, link)}
                  className={`flex items-center gap-1 shrink-0 h-8 px-3 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors ${
                    isCopied
                      ? "bg-emerald-500 text-white border border-emerald-500"
                      : "border border-[#1A1A2E]/12 text-[#1A1A2E]/60 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                  }`}
                >
                  {isCopied ? (
                    <CheckCircleOutlinedIcon sx={{ fontSize: 12 }} />
                  ) : (
                    <ContentCopyOutlinedIcon sx={{ fontSize: 12 }} />
                  )}
                  {isCopied ? t.copied : t.copy}
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#1A1A2E]/35 flex-1">{t.hint}</p>
          <button
            onClick={copyAll}
            className="shrink-0 h-9 px-4 rounded-full bg-[#1A1A2E] text-white text-xs font-bold hover:bg-[#2d2d50] transition-colors inline-flex items-center gap-1.5"
          >
            {copied === "all" ? (
              <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} />
            ) : (
              <ContentCopyOutlinedIcon sx={{ fontSize: 14 }} />
            )}
            {copied === "all" ? t.copied : t.copyAll}
          </button>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Products Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ProductsPage() {
  const { sellerProducts, deleteProduct } = useSellerContext();
  const { tr, isRTL } = useLang();
  const t = tr.seller.productsList;
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [promoModal, setPromoModal] = useState<PromoModalState | null>(null);
  const [linksModal, setLinksModal] = useState<Product | null>(null);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteProduct(confirmDelete.id);
      setConfirmDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t.failedDelete);
    } finally {
      setDeleting(false);
    }
  };

  const stockChip = (stock: number) => {
    if (stock === 0)
      return (
        <Chip
          label={t.outOfStock}
          size="small"
          color="error"
          sx={{ borderRadius: "999px", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.06em" }}
        />
      );
    if (stock <= 5)
      return (
        <Chip
          label={t.lowStock}
          size="small"
          color="warning"
          sx={{ borderRadius: "999px", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.06em" }}
        />
      );
    return (
      <Chip
        label={t.inStock}
        size="small"
        color="success"
        sx={{ borderRadius: "999px", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.06em" }}
      />
    );
  };

  return (
    <SellerLayout>
      <div className="p-6 sm:p-8 lg:p-10 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className={`flex items-center justify-between flex-wrap gap-4 sl-rise`}>
          <div className={`flex items-center gap-3.5`}>
            <div className="w-12 h-12 sl-icon-tile-gold flex items-center justify-center shrink-0">
              <Inventory2Icon sx={{ fontSize: 24, color: "#C9A84C" }} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">{t.title}</h1>
              <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
                {sellerProducts.length} {t.listed}
              </p>
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/seller/products/new")}
            startIcon={<AddIcon sx={{ fontSize: 15 }} />}
            sx={{ borderRadius: "999px", px: 2.5 }}
          >
            {t.addProduct}
          </Button>
        </div>

        {/* Product list */}
        {sellerProducts.length === 0 ? (
          <div className="sl-card p-16 text-center sl-rise">
            <div className="w-16 h-16 mx-auto mb-4 sl-icon-tile-gold flex items-center justify-center">
              <Inventory2Icon sx={{ fontSize: 30, color: "#C9A84C" }} />
            </div>
            <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-2">{t.noProducts}</h3>
            <p className="text-[#1A1A2E]/40 text-sm mb-6">{t.noProductsDesc}</p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/seller/products/new")}
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              sx={{ borderRadius: "999px", px: 2.5 }}
            >
              {t.addFirstProduct}
            </Button>
          </div>
        ) : (
          <div className="sl-card overflow-hidden sl-rise">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A2E]/8">
                  {[t.product, t.category, t.price, t.stock, t.status, t.actions].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-start text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sellerProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#1A1A2E]/5 last:border-0 hover:bg-[#FAF7F2] transition-colors duration-150"
                  >
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg bg-[#F0EBE3] overflow-hidden shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1A1A2E] truncate max-w-[180px]">
                            {product.name}
                          </p>
                          <p className="text-[#1A1A2E]/40 text-xs">{product.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-[#1A1A2E]/60">{product.category}</td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#1A1A2E]">
                        {product.price.toLocaleString()} {tr.common.dzd}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${product.totalStock <= 5 ? "text-red-500" : "text-[#1A1A2E]/60"}`}
                      >
                        {product.totalStock <= 5 && product.totalStock > 0 && (
                          <WarningIcon sx={{ fontSize: 11 }} />
                        )}
                        {product.totalStock} {t.units}
                      </span>
                    </td>

                    {/* Status — stock state + active promotion indicator */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        {stockChip(product.totalStock)}
                        {product.promotion?.active && (product.promotion?.value ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C9A84C]/14 text-[#A07830] text-[9px] font-bold uppercase tracking-wide border border-[#C9A84C]/30">
                            <LocalOfferOutlinedIcon sx={{ fontSize: 9 }} />
                            {isRTL ? "مُرقَّى" : "Promoted"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions — Promote (primary) + a grouped secondary cluster */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        {/* Promote / Edit Promo — reflects current promo state */}
                        {product.promotion?.active && (product.promotion?.value ?? 0) > 0 ? (
                          <button
                            onClick={() => setPromoModal({ product })}
                            className="inline-flex items-center gap-1.5 h-8 ps-2.5 pe-3 rounded-full border border-[#C9A84C]/60 bg-[#C9A84C]/10 text-[#A07830] text-[11px] font-bold hover:bg-[#C9A84C]/20 transition-colors"
                          >
                            <LocalOfferOutlinedIcon sx={{ fontSize: 13 }} />
                            {isRTL ? "تعديل العرض" : "Edit Promo"}
                          </button>
                        ) : (
                          <button
                            onClick={() => setPromoModal({ product })}
                            className="inline-flex items-center gap-1.5 h-8 ps-2.5 pe-3 rounded-full gold-gradient text-[#1A1A2E] text-[11px] font-bold shadow-sm hover:shadow transition-shadow"
                          >
                            <RocketLaunchOutlinedIcon sx={{ fontSize: 14 }} />
                            {t.promote}
                          </button>
                        )}

                        {/* Secondary actions grouped in one soft pill */}
                        <div className="inline-flex items-center rounded-full border border-[#1A1A2E]/10 bg-white overflow-hidden">
                          {/* Tracked links */}
                          <button
                            onClick={() => setLinksModal(product)}
                            title={tr.seller.trackedLinks.title}
                            aria-label={tr.seller.trackedLinks.title}
                            className="w-8 h-8 flex items-center justify-center text-[#1A1A2E]/45 hover:text-[#C9A84C] hover:bg-[#C9A84C]/8 transition-colors"
                          >
                            <ShareOutlinedIcon sx={{ fontSize: 15 }} />
                          </button>
                          <span className="w-px h-4 bg-[#1A1A2E]/8" />
                          {/* Edit */}
                          <button
                            onClick={() => navigate(`/seller/products/${product.id}/edit`)}
                            title={t.edit}
                            aria-label={t.edit}
                            className="w-8 h-8 flex items-center justify-center text-[#1A1A2E]/45 hover:text-[#C9A84C] hover:bg-[#C9A84C]/8 transition-colors"
                          >
                            <EditOutlinedIcon sx={{ fontSize: 15 }} />
                          </button>
                          <span className="w-px h-4 bg-[#1A1A2E]/8" />
                          {/* Delete */}
                          <button
                            onClick={() => setConfirmDelete(product)}
                            title={t.deleteLabel}
                            aria-label={t.deleteLabel}
                            className="w-8 h-8 flex items-center justify-center text-[#1A1A2E]/45 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Promotion modal */}
      {promoModal && (
        <PromotionModal
          state={promoModal}
          onClose={() => setPromoModal(null)}
          onSaved={() => setPromoModal(null)}
        />
      )}

      {/* Tracked links modal */}
      {linksModal && <TrackedLinksModal product={linksModal} onClose={() => setLinksModal(null)} />}

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && !deleting && setConfirmDelete(null)}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="bg-white rounded-2xl border border-[#1A1A2E]/10 shadow-2xl w-full max-w-xs p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 24, color: "#ef4444" }} />
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-[#1A1A2E] text-lg">{t.deleteProduct}</h3>
              <p className="text-[#1A1A2E]/50 text-sm mt-1">
                {t.deleteConfirm}{" "}
                <span className="font-semibold text-[#1A1A2E]">{confirmDelete?.name}</span>
                ? {t.deleteWarning}
              </p>
            </div>
            {deleteError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 14, color: "#ef4444" }} />
                <p className="text-xs text-red-600">{deleteError}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmDelete(null); setDeleteError(""); }}
                disabled={deleting}
                className="flex-1 h-11 rounded-full border border-[#1A1A2E]/15 text-xs font-semibold text-[#1A1A2E]/70 hover:border-[#1A1A2E]/30 transition-colors disabled:opacity-50"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-11 rounded-full flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
              >
                {deleting && (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {deleting ? t.deleting : t.deleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}
