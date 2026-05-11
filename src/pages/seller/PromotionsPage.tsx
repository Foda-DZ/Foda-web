import { useEffect, useState, useCallback } from "react";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import Skeleton from "@mui/material/Skeleton";
import { sellerService } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";
import SellerLayout from "../../components/seller/SellerLayout";

interface Promotion {
  type?: "percentage" | "fixed";
  value?: number;
  code?: string;
  active?: boolean;
}

interface PromoProduct {
  _id: string;
  name: string;
  price: number;
  images?: { url: string }[];
  promotion?: Promotion;
}

type EditMap = Record<string, Partial<Promotion>>;

function SkeletonRow() {
  return (
    <tr className="border-b border-[#1A1A2E]/5 animate-pulse">
      {[48, 200, 60, 120, 100, 100].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton variant={i === 0 ? "rectangular" : "text"} width={w} height={i === 0 ? 48 : 14} sx={{ borderRadius: 0 }} />
        </td>
      ))}
    </tr>
  );
}

function Toggle({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
        checked ? "bg-emerald-500" : "bg-[#1A1A2E]/15"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function PromotionsPage() {
  const { tr, isRTL } = useLang();

  const [promos, setPromos] = useState<PromoProduct[]>([]);
  const [editing, setEditing] = useState<EditMap>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sellerService.listPromotions();
      setPromos(data as PromoProduct[]);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load promotions", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const setEdit = (id: string, patch: Partial<Promotion>) => {
    setEditing((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...patch } }));
  };

  const toggleActive = async (product: PromoProduct) => {
    setSavingId(product._id);
    try {
      await sellerService.upsertPromotion(product._id, {
        ...(product.promotion ?? {}),
        active: !product.promotion?.active,
      });
      setPromos((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? { ...p, promotion: { ...p.promotion, active: !p.promotion?.active } }
            : p,
        ),
      );
      showToast(
        !product.promotion?.active ? "Promotion activated" : "Promotion paused",
        "success",
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update", "error");
    } finally {
      setSavingId(null);
    }
  };

  const savePromo = async (product: PromoProduct) => {
    const patch = editing[product._id] ?? {};
    setSavingId(product._id);
    try {
      await sellerService.upsertPromotion(product._id, {
        ...(product.promotion ?? {}),
        ...patch,
      });
      showToast("Promotion saved", "success");
      await load();
      setEditing((prev) => { const next = { ...prev }; delete next[product._id]; return next; });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save", "error");
    } finally {
      setSavingId(null);
    }
  };

  const removePromo = async (productId: string) => {
    setSavingId(productId);
    setConfirmRemove(null);
    try {
      await sellerService.removePromotion(productId);
      showToast("Promotion removed", "success");
      await load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to remove", "error");
    } finally {
      setSavingId(null);
    }
  };

  const activeCount = promos.filter((p) => p.promotion?.active).length;

  return (
    <SellerLayout>
      <div className="p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Promotions</h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
              Set discounts and promo codes on your products
            </p>
          </div>
          {!loading && activeCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200">
              <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: "#059669" }} />
              <span className="text-xs font-semibold text-emerald-700">
                {activeCount} active promotion{activeCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center gap-2">
            <LocalOfferOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
              Product promotions — {promos.length} products
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1A1A2E]/8">
                {["", "Product", "Active", "Discount", "Promo Code", ""].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-start text-[10px] font-bold tracking-[0.15em] uppercase text-[#1A1A2E]/40"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                : promos.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 bg-[#C9A84C]/8 flex items-center justify-center">
                          <LocalOfferOutlinedIcon sx={{ fontSize: 24, color: "rgba(201,168,76,0.4)" }} />
                        </div>
                        <p className="font-display font-bold text-[#1A1A2E]">No products yet</p>
                        <p className="text-[#1A1A2E]/40 text-sm mt-1 max-w-xs mx-auto">
                          Add products to your store to start setting up promotions and discounts.
                        </p>
                      </td>
                    </tr>
                  )
                  : promos.map((product) => {
                    const edit = editing[product._id] ?? {};
                    const currentType = edit.type ?? product.promotion?.type ?? "percentage";
                    const currentValue = edit.value ?? product.promotion?.value ?? 0;
                    const currentCode = edit.code ?? product.promotion?.code ?? "";
                    const isSaving = savingId === product._id;
                    const hasEdits = Object.keys(editing[product._id] ?? {}).length > 0;

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-[#1A1A2E]/5 last:border-0 hover:bg-[#FAF7F2]/60 transition-colors duration-150"
                      >
                        {/* Image */}
                        <td className="px-4 py-3">
                          <div className="w-10 h-12 bg-[#F0EBE3] overflow-hidden shrink-0">
                            {product.images?.[0]?.url && (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            )}
                          </div>
                        </td>

                        {/* Product name + price */}
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#1A1A2E] text-xs truncate max-w-[180px]">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-[#1A1A2E]/40 mt-0.5">
                            {product.price.toLocaleString()} {tr.common.dzd}
                          </p>
                        </td>

                        {/* Toggle */}
                        <td className="px-4 py-3">
                          <Toggle
                            checked={Boolean(product.promotion?.active)}
                            disabled={isSaving}
                            onChange={() => toggleActive(product)}
                          />
                        </td>

                        {/* Discount type + value */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex border border-[#1A1A2E]/12 overflow-hidden">
                              {(["percentage", "fixed"] as const).map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setEdit(product._id, { type })}
                                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors duration-150 ${
                                    currentType === type
                                      ? "gold-gradient text-[#1A1A2E]"
                                      : "bg-white text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70"
                                  }`}
                                >
                                  {type === "percentage" ? "%" : "DZD"}
                                </button>
                              ))}
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                min={0}
                                max={currentType === "percentage" ? 100 : undefined}
                                value={currentValue}
                                onChange={(e) => setEdit(product._id, { value: Number(e.target.value) })}
                                className="w-16 h-7 border border-[#1A1A2E]/12 bg-white text-xs text-[#1A1A2E] text-center focus:outline-none focus:border-[#C9A84C]/60 transition-colors pr-4"
                              />
                              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-[#1A1A2E]/30 pointer-events-none">
                                {currentType === "percentage"
                                  ? <PercentOutlinedIcon sx={{ fontSize: 9 }} />
                                  : <TagOutlinedIcon sx={{ fontSize: 9 }} />}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Promo code */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            placeholder="e.g. SUMMER20"
                            value={currentCode}
                            onChange={(e) => setEdit(product._id, { code: e.target.value.toUpperCase() })}
                            className="w-28 h-7 border border-[#1A1A2E]/12 bg-white text-xs text-[#1A1A2E] px-2.5 focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder:text-[#1A1A2E]/25 uppercase tracking-wider"
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {hasEdits && (
                              <button
                                onClick={() => savePromo(product)}
                                disabled={isSaving}
                                className="h-7 px-3 flex items-center gap-1.5 bg-[#1A1A2E] text-white text-[10px] font-bold uppercase tracking-wide hover:bg-[#2d2d50] transition-colors disabled:opacity-60"
                              >
                                {isSaving
                                  ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  : <CheckOutlinedIcon sx={{ fontSize: 11 }} />}
                                Save
                              </button>
                            )}
                            {product.promotion && (
                              <button
                                onClick={() => setConfirmRemove(product._id)}
                                disabled={isSaving}
                                className="w-7 h-7 flex items-center justify-center border border-[#1A1A2E]/12 text-[#1A1A2E]/40 hover:border-red-300 hover:text-red-500 transition-all duration-200 disabled:opacity-50"
                                title="Remove promotion"
                              >
                                <DeleteOutlineOutlinedIcon sx={{ fontSize: 13 }} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remove confirmation dialog */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#1A1A2E]/10 shadow-2xl w-full max-w-xs p-6 space-y-4">
            <div className="w-12 h-12 bg-red-50 flex items-center justify-center mx-auto">
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 22, color: "#ef4444" }} />
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-[#1A1A2E] text-lg">Remove promotion?</h3>
              <p className="text-[#1A1A2E]/50 text-sm mt-1">
                The discount and promo code will be removed from this product.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 h-10 border border-[#1A1A2E]/15 text-xs font-semibold text-[#1A1A2E]/70 hover:border-[#1A1A2E]/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => removePromo(confirmRemove)}
                className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 shadow-lg text-sm font-medium ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success"
            ? <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
            : <ErrorOutlineOutlinedIcon sx={{ fontSize: 16 }} />}
          {toast.msg}
        </div>
      )}
    </SellerLayout>
  );
}
