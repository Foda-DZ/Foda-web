import { useEffect, useState, useCallback } from "react";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import { sellerService } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";
import SellerLayout from "../../components/seller/SellerLayout";

interface Promotion {
  type?: "percentage" | "amount";
  value?: number;
  active?: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

interface PromoProduct {
  _id: string;
  name: string;
  price: number;
  category?: string;
  images?: { url: string }[];
  promotion?: Promotion;
}

type PromoFilter = "all" | "active" | "inactive" | "no-promo";

function SkeletonRow() {
  return (
    <tr className="border-b border-[#1A1A2E]/5 animate-pulse">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A1A2E]/8 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 bg-[#1A1A2E]/8 rounded w-32" />
            <div className="h-2.5 bg-[#1A1A2E]/5 rounded w-20" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5"><div className="h-3 bg-[#1A1A2E]/8 rounded w-20" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-[#1A1A2E]/8 rounded w-16" /></td>
      <td className="px-4 py-3.5"><div className="h-5 bg-[#1A1A2E]/6 rounded w-16" /></td>
      <td className="px-4 py-3.5"><div className="h-5 bg-[#C9A84C]/10 rounded w-20" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-[#1A1A2E]/5 rounded w-28" /></td>
      <td className="px-4 py-3.5"><div className="h-7 bg-[#1A1A2E]/5 rounded w-8" /></td>
    </tr>
  );
}

export default function PromotionsPage() {
  const { tr, isRTL, lang } = useLang();
  const t = tr.seller.promotionsPage;
  const dzd = tr.common.dzd;

  const [promos, setPromos] = useState<PromoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PromoFilter>("all");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

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
      showToast(err instanceof Error ? err.message : t.toastLoadError, "error");
    } finally {
      setLoading(false);
    }
  }, [t.toastLoadError]);

  useEffect(() => {
    load();
  }, [load]);

  const removePromo = async (productId: string) => {
    setRemovingId(productId);
    setConfirmRemove(null);
    try {
      await sellerService.removePromotion(productId);
      showToast(t.toastRemoved, "success");
      setPromos((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, promotion: undefined } : p)),
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.toastRemoveError, "error");
    } finally {
      setRemovingId(null);
    }
  };

  const now = new Date();
  const withPromo = promos.filter((p) => p.promotion?.value && p.promotion.value > 0);
  const activeCount = withPromo.filter((p) => p.promotion?.active).length;

  const filterCounts: Record<PromoFilter, number> = {
    all: promos.length,
    active: withPromo.filter((p) => p.promotion?.active).length,
    inactive: withPromo.filter((p) => !p.promotion?.active).length,
    "no-promo": promos.filter((p) => !p.promotion?.value || p.promotion.value === 0).length,
  };

  const filtered = promos.filter((p) => {
    const hasP = Boolean(p.promotion?.value && p.promotion.value > 0);
    const isA = Boolean(p.promotion?.active);
    if (filter === "active") return hasP && isA;
    if (filter === "inactive") return hasP && !isA;
    if (filter === "no-promo") return !hasP;
    return true;
  });

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-DZ" : "en-GB", {
      day: "numeric",
      month: "short",
    }).format(new Date(iso));

  const filterLabels: Record<PromoFilter, string> = {
    all: t.filterAll,
    active: t.filterActive,
    inactive: t.filterInactive,
    "no-promo": t.filterNoPromo,
  };

  const tableHeaders = [
    t.colProduct,
    lang === "ar" ? "الفئة" : "Category",
    lang === "ar" ? "السعر" : "Price",
    t.colActive,
    t.colDiscount,
    lang === "ar" ? "الفترة" : "Period",
    "",
  ];

  return (
    <SellerLayout>
      <div className="p-6 md:p-8 space-y-5" dir={isRTL ? "rtl" : "ltr"}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: "#C9A84C" }} />
              <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">{t.title}</h1>
            </div>
            <p className="text-[#1A1A2E]/50 text-sm">{t.subtitle}</p>
          </div>

          {!loading && activeCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200">
              <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: "#059669" }} />
              <span className="text-xs font-semibold text-emerald-700">
                {activeCount} {activeCount > 1 ? t.activePlural : t.activeSingle}
              </span>
            </div>
          )}
        </div>

        {/* ── Summary strip ───────────────────────────────────────────────── */}
        {!loading && promos.length > 0 && (
          <div className="flex items-center gap-6 px-5 py-3 bg-[#FAF7F2] border border-[#1A1A2E]/8 text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/40">
            <span>{promos.length} {t.productWord}</span>
            <span className="w-px h-3 bg-[#1A1A2E]/15" />
            <span className="text-emerald-600">{activeCount} {t.activePlural}</span>
            <span className="w-px h-3 bg-[#1A1A2E]/15" />
            <span>{withPromo.length - activeCount} {t.statusInactive.toLowerCase()}</span>
          </div>
        )}

        {/* ── Filter tabs ─────────────────────────────────────────────────── */}
        {!loading && promos.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["all", "active", "inactive", "no-promo"] as PromoFilter[]).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`h-7 px-3 text-[10px] font-bold uppercase tracking-wide transition-all duration-200 ${
                  filter === key
                    ? "bg-[#1A1A2E] text-white"
                    : "bg-white border border-[#1A1A2E]/12 text-[#1A1A2E]/50 hover:border-[#1A1A2E]/25"
                }`}
              >
                {filterLabels[key]}
                {filterCounts[key] > 0 && (
                  <span
                    className={`ms-1.5 text-[9px] ${
                      filter === key ? "text-white/60" : "text-[#1A1A2E]/30"
                    }`}
                  >
                    {filterCounts[key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Table ───────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A2E]/8 bg-[#FAF7F2]">
                  {tableHeaders.map((h, i) => (
                    <th key={i} className="px-4 py-3 text-start text-[10px] font-semibold tracking-widest uppercase text-[#1A1A2E]/40 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : promos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#1A1A2E]/8">
            <div className="w-16 h-16 bg-[#C9A84C]/8 flex items-center justify-center mb-4">
              <LocalOfferOutlinedIcon sx={{ fontSize: 28, color: "rgba(201,168,76,0.35)" }} />
            </div>
            <p className="font-display font-bold text-[#1A1A2E] text-lg">{t.emptyTitle}</p>
            <p className="text-[#1A1A2E]/40 text-sm mt-1 max-w-xs text-center">{t.emptyDesc}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-[#1A1A2E]/8 gap-3">
            <LocalOfferOutlinedIcon sx={{ fontSize: 24, color: "rgba(26,26,46,0.15)" }} />
            <p className="text-[#1A1A2E]/40 text-sm">
              {lang === "ar" ? "لا توجد منتجات في هذا التصنيف" : "No products match this filter"}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A2E]/8 bg-[#FAF7F2]">
                  {tableHeaders.map((h, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3 text-[10px] font-semibold tracking-widest uppercase text-[#1A1A2E]/40 whitespace-nowrap ${i === tableHeaders.length - 1 ? "text-end" : "text-start"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const hasPromo = Boolean(product.promotion?.value && product.promotion.value > 0);
                  const isActive = Boolean(product.promotion?.active);
                  const isExpired = Boolean(
                    product.promotion?.endDate && new Date(product.promotion.endDate) < now,
                  );
                  const isRemoving = removingId === product._id;
                  const isPercent = product.promotion?.type === "percentage";
                  const discounted = hasPromo
                    ? isPercent
                      ? product.price * (1 - (product.promotion!.value! / 100))
                      : Math.max(0, product.price - (product.promotion!.value!))
                    : null;

                  return (
                    <tr
                      key={product._id}
                      className="border-b border-[#1A1A2E]/5 hover:bg-[#FAF7F2]/60 transition-colors duration-150"
                    >
                      {/* Product image + name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#F0EBE3] overflow-hidden shrink-0 flex items-center justify-center">
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <ImageNotSupportedOutlinedIcon sx={{ fontSize: 14, color: "rgba(201,168,76,0.3)" }} />
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#1A1A2E] truncate max-w-[160px]" title={product.name}>
                            {product.name}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-medium text-[#1A1A2E]/40 uppercase tracking-wide">
                          {product.category ?? "—"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-xs font-semibold text-[#1A1A2E]">
                          {product.price.toLocaleString()} {dzd}
                        </span>
                        {discounted !== null && (
                          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                            → {discounted.toFixed(0)} {dzd}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {hasPromo ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                              isExpired
                                ? "bg-red-50 text-red-600 border border-red-200"
                                : isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-[#1A1A2E]/5 text-[#1A1A2E]/40 border border-[#1A1A2E]/10"
                            }`}
                          >
                            {isExpired ? (
                              <ErrorOutlineOutlinedIcon sx={{ fontSize: 9 }} />
                            ) : isActive ? (
                              <CheckCircleOutlinedIcon sx={{ fontSize: 9 }} />
                            ) : (
                              <PauseCircleOutlineOutlinedIcon sx={{ fontSize: 9 }} />
                            )}
                            {isExpired ? t.statusExpired : isActive ? t.statusActive : t.statusInactive}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#1A1A2E]/25 font-medium">—</span>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="px-4 py-3.5">
                        {hasPromo && product.promotion?.value ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 gold-gradient text-[10px] font-bold uppercase tracking-wide text-[#1A1A2E]">
                            {isPercent ? (
                              <>
                                <PercentOutlinedIcon sx={{ fontSize: 9 }} />
                                {product.promotion.value}% OFF
                              </>
                            ) : (
                              <>−{product.promotion.value} {dzd}</>
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-[#1A1A2E]/25 border border-[#1A1A2E]/8 bg-[#FAF7F2]">
                            {t.noPromoLabel}
                          </span>
                        )}
                      </td>

                      {/* Date range */}
                      <td className="px-4 py-3.5">
                        {hasPromo && (product.promotion?.startDate || product.promotion?.endDate) ? (
                          <div className="flex items-center gap-1 text-[10px] text-[#1A1A2E]/40 whitespace-nowrap">
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 9, flexShrink: 0 }} />
                            {product.promotion?.startDate && (
                              <span>{formatDate(product.promotion.startDate)}</span>
                            )}
                            {product.promotion?.startDate && product.promotion?.endDate && (
                              <span className="mx-0.5">→</span>
                            )}
                            {product.promotion?.endDate && (
                              <span className={isExpired ? "text-red-500 font-semibold" : ""}>
                                {product.promotion.startDate
                                  ? formatDate(product.promotion.endDate)
                                  : `${t.expiresOn} ${formatDate(product.promotion.endDate)}`}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#1A1A2E]/20">—</span>
                        )}
                      </td>

                      {/* Delete action */}
                      <td className="px-4 py-3.5 text-end">
                        {hasPromo && (
                          <button
                            onClick={() => setConfirmRemove(product._id)}
                            disabled={isRemoving}
                            className="w-7 h-7 inline-flex items-center justify-center border border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 disabled:opacity-30"
                            title={t.removeTooltip}
                          >
                            {isRemoving ? (
                              <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <DeleteOutlineOutlinedIcon sx={{ fontSize: 13 }} />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Remove confirmation modal ────────────────────────────────────── */}
      {confirmRemove && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="bg-white border border-[#1A1A2E]/10 shadow-2xl w-full max-w-xs p-6 space-y-5">
            <div className="w-12 h-12 bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 22, color: "#ef4444" }} />
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-[#1A1A2E] text-lg">{t.removeTitle}</h3>
              <p className="text-[#1A1A2E]/50 text-sm mt-1 leading-relaxed">{t.removeDesc}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 h-10 border border-[#1A1A2E]/15 text-xs font-semibold text-[#1A1A2E]/70 hover:border-[#1A1A2E]/30 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => removePromo(confirmRemove)}
                className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors"
              >
                {t.remove}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ───────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-50 flex items-center gap-2.5 px-4 py-3 shadow-xl text-sm font-medium ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {toast.type === "success" ? (
            <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
          ) : (
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 16 }} />
          )}
          {toast.msg}
        </div>
      )}
    </SellerLayout>
  );
}
