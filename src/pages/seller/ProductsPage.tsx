import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningIcon from "@mui/icons-material/Warning";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
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

// ─── Promotion Modal Types ────────────────────────────────────────────────────
interface PromoForm {
  active: boolean;
  type: "percentage" | "amount";
  value: number;
  startDate: string;
  endDate: string;
}

interface PromoModalState {
  product: Product;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-emerald-500" : "bg-[#1A1A2E]/15"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Promotion Modal ──────────────────────────────────────────────────────────
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
    value: 0,
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
            value: p.value ?? 0,
            startDate: p.startDate ? p.startDate.substring(0, 10) : "",
            endDate: p.endDate ? p.endDate.substring(0, 10) : "",
          });
        }
      } catch {
        // ignore — use empty defaults
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [product.id]);

  const handleSave = async () => {
    if (form.value <= 0) {
      showToast("Discount value must be greater than 0", "error");
      return;
    }
    if (form.type === "percentage" && form.value > 100) {
      showToast("Percentage discount cannot exceed 100%", "error");
      return;
    }
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      showToast("Start date must be before end date", "error");
      return;
    }
    setSaving(true);
    try {
      await sellerService.upsertPromotion(product.id, {
        active: form.active,
        type: form.type,
        value: form.value,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
      showToast("Promotion saved successfully", "success");
      setHasExisting(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1200);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save promotion", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await sellerService.removePromotion(product.id);
      showToast("Promotion removed", "success");
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to remove promotion", "error");
    } finally {
      setRemoving(false);
      setConfirmRemove(false);
    }
  };

  const discountedPrice =
    form.value > 0
      ? form.type === "percentage"
        ? product.price * (1 - form.value / 100)
        : Math.max(0, product.price - form.value)
      : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-white w-full max-w-md shadow-2xl border border-[#1A1A2E]/8 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 gold-gradient flex items-center justify-center">
              <LocalOfferOutlinedIcon sx={{ fontSize: 14, color: "#1A1A2E" }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/40">
                Set Promotion
              </p>
              <p className="text-xs font-semibold text-[#1A1A2E] leading-tight truncate max-w-[220px]">
                {product.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[#1A1A2E]/40 hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/5 transition-colors"
          >
            <CloseOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {loading ? (
            <div className="space-y-4">
              {[80, 120, 80, 100].map((w, i) => (
                <Skeleton key={i} variant="rectangular" width="100%" height={w} sx={{ borderRadius: 0 }} />
              ))}
            </div>
          ) : (
            <>
              {/* Product preview */}
              <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] border border-[#1A1A2E]/6">
                <div className="w-12 h-14 bg-[#F0EBE3] overflow-hidden shrink-0">
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
                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-sm">
                      {form.type === "percentage"
                        ? `-${form.value}%`
                        : `-${form.value.toLocaleString()} ${tr.common.dzd}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between py-3 border-b border-[#1A1A2E]/6">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E]">Promotion active</p>
                  <p className="text-xs text-[#1A1A2E]/40 mt-0.5">
                    {form.active ? "Visible to customers" : "Hidden from customers"}
                  </p>
                </div>
                <Toggle
                  checked={form.active}
                  onChange={(v) => setForm((f) => ({ ...f, active: v }))}
                />
              </div>

              {/* Discount type & value */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                  Discount
                </label>
                <div className="flex items-center gap-3">
                  {/* Type selector */}
                  <div className="flex border border-[#1A1A2E]/15 overflow-hidden">
                    {(["percentage", "amount"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, type }))}
                        className={`px-4 py-2 text-xs font-bold transition-colors duration-150 ${
                          form.type === type
                            ? "gold-gradient text-[#1A1A2E]"
                            : "bg-white text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70"
                        }`}
                      >
                        {type === "percentage" ? "%" : "DZD"}
                      </button>
                    ))}
                  </div>

                  {/* Value input */}
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      min={0}
                      max={form.type === "percentage" ? 100 : undefined}
                      value={form.value || ""}
                      placeholder={form.type === "percentage" ? "e.g. 20" : "e.g. 500"}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, value: Number(e.target.value) }))
                      }
                      className="w-full h-10 border border-[#1A1A2E]/15 bg-white text-sm text-[#1A1A2E] px-3 pr-10 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#1A1A2E]/30 font-semibold pointer-events-none">
                      {form.type === "percentage" ? "%" : "DZD"}
                    </span>
                  </div>
                </div>
                {form.type === "percentage" && form.value > 100 && (
                  <p className="text-xs text-red-500">Percentage cannot exceed 100%</p>
                )}
              </div>

              {/* Date range (optional) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                    Date range{" "}
                    <span className="normal-case font-normal text-[#1A1A2E]/30">(optional)</span>
                  </label>
                  {(form.startDate || form.endDate) && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, startDate: "", endDate: "" }))}
                      className="text-[10px] text-[#1A1A2E]/40 hover:text-red-500 transition-colors"
                    >
                      Clear dates
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <CalendarTodayOutlinedIcon
                      sx={{ fontSize: 12, color: "rgba(26,26,46,0.3)" }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                      className="w-full h-10 border border-[#1A1A2E]/15 bg-white text-xs text-[#1A1A2E] pl-8 pr-2 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <CalendarTodayOutlinedIcon
                      sx={{ fontSize: 12, color: "rgba(26,26,46,0.3)" }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <input
                      type="date"
                      value={form.endDate}
                      min={form.startDate || undefined}
                      onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                      className="w-full h-10 border border-[#1A1A2E]/15 bg-white text-xs text-[#1A1A2E] pl-8 pr-2 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                    />
                  </div>
                </div>
                {form.startDate && form.endDate && form.startDate > form.endDate && (
                  <p className="text-xs text-red-500">Start date must be before end date</p>
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
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200">
                <p className="flex-1 text-xs text-red-700 font-medium">
                  Remove this promotion permanently?
                </p>
                <button
                  onClick={() => setConfirmRemove(false)}
                  className="text-xs text-[#1A1A2E]/50 hover:text-[#1A1A2E] px-2 py-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemove}
                  disabled={removing}
                  className="flex items-center gap-1.5 h-7 px-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
                >
                  {removing && (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {hasExisting && (
                  <button
                    onClick={() => setConfirmRemove(true)}
                    disabled={saving || removing}
                    className="flex items-center gap-1.5 h-10 px-3 border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                    Remove
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || removing || form.value <= 0}
                  className="flex-1 h-10 flex items-center justify-center gap-2 bg-[#1A1A2E] text-white text-xs font-bold uppercase tracking-wide hover:bg-[#2d2d50] transition-colors disabled:opacity-60"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LocalOfferOutlinedIcon sx={{ fontSize: 14 }} />
                  )}
                  {saving ? "Saving…" : "Save Promotion"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-[60] flex items-center gap-2.5 px-4 py-3 shadow-lg text-sm font-medium ${
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

// ─── Tracked Links Modal ──────────────────────────────────────────────────────
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
      // clipboard unavailable — ignore
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
      <div className="bg-white w-full max-w-md shadow-2xl border border-[#1A1A2E]/8 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A2E]/8 bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 gold-gradient flex items-center justify-center">
              <LinkOutlinedIcon sx={{ fontSize: 14, color: "#1A1A2E" }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/40">{t.title}</p>
              <p className="text-xs font-semibold text-[#1A1A2E] leading-tight truncate max-w-[220px]">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[#1A1A2E]/40 hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/5 transition-colors"
          >
            <CloseOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          <p className="text-xs text-[#1A1A2E]/50">{t.subtitle}</p>
          {TRACKED_PLATFORMS.map((p) => {
            const link = linkFor(p.key);
            return (
              <div key={p.key} className="flex items-center gap-2.5 border border-[#1A1A2E]/10 p-2.5">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-[#1A1A2E]">{p.label}</p>
                  <p className="text-[10px] text-[#1A1A2E]/45 truncate font-mono">{link}</p>
                </div>
                <button
                  onClick={() => copy(p.key, link)}
                  className="flex items-center gap-1 shrink-0 h-7 px-2.5 border border-[#1A1A2E]/15 text-[10px] font-bold uppercase tracking-wide text-[#1A1A2E]/60 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors"
                >
                  <ContentCopyOutlinedIcon sx={{ fontSize: 11 }} />
                  {copied === p.key ? t.copied : t.copy}
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center justify-between gap-3">
          <p className="text-[10px] text-[#1A1A2E]/35 flex-1">{t.hint}</p>
          <button
            onClick={copyAll}
            className="shrink-0 h-9 px-3.5 bg-[#1A1A2E] text-white text-xs font-bold uppercase tracking-wide hover:bg-[#2d2d50] transition-colors"
          >
            {copied === "all" ? t.copied : t.copyAll}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Products Page ────────────────────────────────────────────────────────────
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
          sx={{ borderRadius: 0, fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.06em" }}
        />
      );
    if (stock <= 5)
      return (
        <Chip
          label={t.lowStock}
          size="small"
          color="warning"
          sx={{ borderRadius: 0, fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.06em" }}
        />
      );
    return (
      <Chip
        label={t.inStock}
        size="small"
        color="success"
        sx={{ borderRadius: 0, fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.06em" }}
      />
    );
  };

  return (
    <SellerLayout>
      <div className="p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">{t.title}</h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
              {sellerProducts.length} {t.listed}
            </p>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/seller/products/new")}
            startIcon={<AddIcon sx={{ fontSize: 15 }} />}
            sx={{ borderRadius: 0 }}
          >
            {t.addProduct}
          </Button>
        </div>

        {/* Product list */}
        {sellerProducts.length === 0 ? (
          <div className="bg-white border border-[#1A1A2E]/8 p-16 text-center">
            <Inventory2Icon
              sx={{ fontSize: 40, color: "rgba(26,26,46,0.15)", display: "block", mx: "auto", mb: 2 }}
            />
            <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-2">{t.noProducts}</h3>
            <p className="text-[#1A1A2E]/40 text-sm mb-6">{t.noProductsDesc}</p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/seller/products/new")}
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              sx={{ borderRadius: 0 }}
            >
              {t.addFirstProduct}
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
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
                        <div className="w-10 h-12 bg-[#F0EBE3] overflow-hidden flex-shrink-0">
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
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${product.stock <= 5 ? "text-red-500" : "text-[#1A1A2E]/60"}`}
                      >
                        {product.stock <= 5 && product.stock > 0 && (
                          <WarningIcon sx={{ fontSize: 11 }} />
                        )}
                        {product.stock} {t.units}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">{stockChip(product.stock)}</td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {/* Promote button */}
                        <button
                          onClick={() => setPromoModal({ product })}
                          title={t.promote}
                          className="w-7 h-7 flex items-center justify-center border border-[#C9A84C]/45 text-[#C9A84C] bg-[#C9A84C]/6 hover:border-[#C9A84C] hover:bg-[#C9A84C]/15 transition-all duration-200"
                        >
                          <RocketLaunchOutlinedIcon sx={{ fontSize: 13 }} />
                        </button>

                        {/* Tracked links button */}
                        <button
                          onClick={() => setLinksModal(product)}
                          title={tr.seller.trackedLinks.title}
                          className="w-7 h-7 flex items-center justify-center border border-[#1A1A2E]/15 text-[#1A1A2E]/50 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all duration-200"
                        >
                          <ShareOutlinedIcon sx={{ fontSize: 13 }} />
                        </button>

                        {/* Edit button */}
                        <button
                          onClick={() => navigate(`/seller/products/${product.id}/edit`)}
                          title={t.edit}
                          className="w-7 h-7 flex items-center justify-center border border-[#1A1A2E]/15 text-[#1A1A2E]/50 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all duration-200"
                        >
                          <EditIcon sx={{ fontSize: 13 }} />
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => setConfirmDelete(product)}
                          title={t.deleteLabel}
                          className="w-7 h-7 flex items-center justify-center border border-[#1A1A2E]/15 text-[#1A1A2E]/50 hover:border-red-300 hover:text-red-500 transition-all duration-200"
                        >
                          <DeleteIcon sx={{ fontSize: 13 }} />
                        </button>
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
          <div className="bg-white border border-[#1A1A2E]/10 shadow-2xl w-full max-w-xs p-6 space-y-4">
            <div className="w-12 h-12 bg-red-50 flex items-center justify-center mx-auto">
              <DeleteIcon sx={{ fontSize: 20, color: "#ef4444" }} />
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
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200">
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 14, color: "#ef4444" }} />
                <p className="text-xs text-red-600">{deleteError}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmDelete(null); setDeleteError(""); }}
                disabled={deleting}
                className="flex-1 h-10 border border-[#1A1A2E]/15 text-xs font-semibold text-[#1A1A2E]/70 hover:border-[#1A1A2E]/30 transition-colors disabled:opacity-50"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-10 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
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
