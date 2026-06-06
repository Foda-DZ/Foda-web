import { useEffect, useState, useCallback } from "react";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import { sellerService } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";
import type { Translations } from "../../translations";
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

// ─── Promo Card — modern, scannable, shows the data a seller cares about ──────
function PromoCard({
  product,
  t,
  dzd,
  isRTL,
  now,
  formatDate,
  removing,
  onRemove,
}: {
  product: PromoProduct;
  t: Translations["seller"]["promotionsPage"];
  dzd: string;
  isRTL: boolean;
  now: Date;
  formatDate: (iso: string) => string;
  removing: boolean;
  onRemove: () => void;
}) {
  const promo = product.promotion;
  const value = promo?.value ?? 0;
  const hasPromo = value > 0;

  // Products without a promotion render as a compact, muted card.
  if (!hasPromo) {
    return (
      <div
        className="sl-card overflow-hidden flex items-center gap-3 p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-14 h-14 rounded-xl bg-[#F0EBE3] overflow-hidden shrink-0 flex items-center justify-center">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <ImageNotSupportedOutlinedIcon sx={{ fontSize: 18, color: "rgba(201,168,76,0.35)" }} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#1A1A2E] truncate" title={product.name}>
            {product.name}
          </p>
          <p className="text-xs font-semibold text-[#1A1A2E]/55 mt-0.5">
            {product.price.toLocaleString()} {dzd}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#1A1A2E]/40 border border-[#1A1A2E]/8 bg-[#FBF9F5] shrink-0">
          {t.noPromoLabel}
        </span>
      </div>
    );
  }

  const isPercent = promo?.type === "percentage";
  const isActive = Boolean(promo?.active);
  const end = promo?.endDate ? new Date(promo.endDate) : null;
  const start = promo?.startDate ? new Date(promo.startDate) : null;
  const isExpired = Boolean(end && end < now);
  const notStarted = Boolean(start && start > now);

  const discounted = isPercent
    ? product.price * (1 - value / 100)
    : Math.max(0, product.price - value);
  const savings = Math.round(product.price - discounted);

  const DAY = 86_400_000;
  const daysLeft = end
    ? Math.max(0, Math.ceil((end.getTime() - now.getTime()) / DAY))
    : null;
  const daysToStart = start
    ? Math.max(0, Math.ceil((start.getTime() - now.getTime()) / DAY))
    : null;

  // Status pill config
  const status = isExpired
    ? { label: t.statusExpired, cls: "bg-red-50 text-red-600 border-red-200", Icon: ErrorOutlineOutlinedIcon }
    : isActive
      ? { label: t.statusActive, cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircleOutlinedIcon }
      : { label: t.statusInactive, cls: "bg-[#1A1A2E]/5 text-[#1A1A2E]/45 border-[#1A1A2E]/10", Icon: PauseCircleOutlineOutlinedIcon };

  return (
    <div
      className={`sl-card sl-card-hover overflow-hidden flex flex-col ${isExpired ? "opacity-80" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top: product identity + discount ribbon */}
      <div className="relative p-4 flex items-start gap-3">
        {/* Discount ribbon (top corner) */}
        <span
          className="absolute top-0 gold-gradient text-[#1A1A2E] text-[11px] font-extrabold px-3 py-1"
          style={{
            insetInlineEnd: 0,
            borderEndStartRadius: "0.75rem",
          }}
        >
          {isPercent ? `-${value}%` : `-${value.toLocaleString()} ${dzd}`}
        </span>

        <div className="w-16 h-16 rounded-xl bg-[#F0EBE3] overflow-hidden shrink-0 flex items-center justify-center">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <ImageNotSupportedOutlinedIcon sx={{ fontSize: 20, color: "rgba(201,168,76,0.35)" }} />
          )}
        </div>

        <div className="min-w-0 flex-1 pe-12">
          <p className="text-sm font-bold text-[#1A1A2E] truncate" title={product.name}>
            {product.name}
          </p>
          {product.category && (
            <span className="inline-block mt-1 text-[10px] font-semibold text-[#1A1A2E]/45 uppercase tracking-wide">
              {product.category}
            </span>
          )}
          <div className="mt-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${status.cls}`}
            >
              <status.Icon sx={{ fontSize: 10 }} />
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: price was → now + savings */}
      <div className="px-4 pb-3 flex items-end justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#1A1A2E]/35 line-through">
            {product.price.toLocaleString()} {dzd}
          </span>
          <p className="font-display text-xl font-bold text-[#1A1A2E] leading-none mt-0.5">
            {Math.round(discounted).toLocaleString()}{" "}
            <span className="text-xs font-semibold text-[#1A1A2E]/40">{dzd}</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
          <SavingsOutlinedIcon sx={{ fontSize: 13 }} />
          {t.youSave} {savings.toLocaleString()} {dzd}
        </span>
      </div>

      {/* Footer: period + remove */}
      <div className="mt-auto px-4 py-3 border-t border-[#1A1A2E]/6 bg-[#FBF9F5] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-[#1A1A2E]/55 min-w-0">
          {notStarted ? (
            <>
              <HourglassBottomOutlinedIcon sx={{ fontSize: 13, color: "#C9A84C" }} />
              <span className="truncate">{t.startsIn} {daysToStart} {t.daysLeft}</span>
            </>
          ) : daysLeft !== null ? (
            <>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 12, color: isExpired ? "#ef4444" : "#C9A84C" }} />
              <span className={`truncate ${isExpired ? "text-red-500 font-semibold" : ""}`}>
                {isExpired ? `${t.expiresOn} ${end ? formatDate(end.toISOString()) : ""}` : `${daysLeft} ${t.daysLeft}`}
              </span>
            </>
          ) : (
            <>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 12, color: "#C9A84C" }} />
              <span className="truncate">{t.ongoing}</span>
            </>
          )}
        </div>
        <button
          onClick={onRemove}
          disabled={removing}
          title={t.removeTooltip}
          aria-label={t.removeTooltip}
          className="w-8 h-8 rounded-full inline-flex items-center justify-center border border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 disabled:opacity-30 shrink-0"
        >
          {removing ? (
            <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
          )}
        </button>
      </div>
    </div>
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


  return (
    <SellerLayout>
      <div className="p-6 sm:p-8 lg:p-10 space-y-5" dir={isRTL ? "rtl" : "ltr"}>

        {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className={`flex items-start justify-between flex-wrap gap-4 sl-rise`}>
          <div className={`flex items-center gap-3.5`}>
            <div className="w-12 h-12 sl-icon-tile-gold flex items-center justify-center shrink-0">
              <LocalOfferOutlinedIcon sx={{ fontSize: 24, color: "#C9A84C" }} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">{t.title}</h1>
              <p className="text-[#1A1A2E]/50 text-sm mt-0.5">{t.subtitle}</p>
            </div>
          </div>

          {!loading && activeCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
              <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: "#059669" }} />
              <span className="text-xs font-semibold text-emerald-700">
                {activeCount} {activeCount > 1 ? t.activePlural : t.activeSingle}
              </span>
            </div>
          )}
        </div>

        {/* â”€â”€ Summary strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {!loading && promos.length > 0 && (
          <div className="flex items-center gap-6 px-5 py-3.5 rounded-2xl bg-[#FBF9F5] border border-[#1A1A2E]/6 text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/40">
            <span>{promos.length} {t.productWord}</span>
            <span className="w-px h-3 bg-[#1A1A2E]/15" />
            <span className="text-emerald-600">{activeCount} {t.activePlural}</span>
            <span className="w-px h-3 bg-[#1A1A2E]/15" />
            <span>{withPromo.length - activeCount} {t.statusInactive.toLowerCase()}</span>
          </div>
        )}

        {/* â”€â”€ Filter tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {!loading && promos.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "active", "inactive", "no-promo"] as PromoFilter[]).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`h-9 px-4 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all duration-200 ${
                  filter === key
                    ? "sl-nav-active"
                    : "bg-white border border-[#1A1A2E]/8 text-[#1A1A2E]/50 hover:text-[#1A1A2E] hover:border-[#C9A84C]/40"
                }`}
              >
                {filterLabels[key]}
                {filterCounts[key] > 0 && (
                  <span
                    className={`ms-1.5 text-[9px] ${
                      filter === key ? "text-[#1A1A2E]/50" : "text-[#1A1A2E]/30"
                    }`}
                  >
                    {filterCounts[key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* â”€â”€ Table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sl-card p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-[#1A1A2E]/8 shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-[#1A1A2E]/8 rounded w-3/4" />
                    <div className="h-2.5 bg-[#1A1A2E]/6 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-px bg-[#1A1A2E]/6 my-4" />
                <div className="flex justify-between">
                  <div className="h-6 bg-[#1A1A2E]/6 rounded w-20" />
                  <div className="h-6 bg-[#C9A84C]/12 rounded-full w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : promos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 sl-card">
            <div className="w-16 h-16 sl-icon-tile-gold flex items-center justify-center mb-4">
              <LocalOfferOutlinedIcon sx={{ fontSize: 28, color: "rgba(201,168,76,0.5)" }} />
            </div>
            <p className="font-display font-bold text-[#1A1A2E] text-lg">{t.emptyTitle}</p>
            <p className="text-[#1A1A2E]/40 text-sm mt-1 max-w-xs text-center">{t.emptyDesc}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sl-card gap-3">
            <SearchOffOutlinedIcon sx={{ fontSize: 26, color: "rgba(26,26,46,0.18)" }} />
            <p className="text-[#1A1A2E]/40 text-sm">{t.emptyDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <PromoCard
                key={product._id}
                product={product}
                t={t}
                dzd={dzd}
                isRTL={isRTL}
                now={now}
                formatDate={formatDate}
                removing={removingId === product._id}
                onRemove={() => setConfirmRemove(product._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* â”€â”€ Remove confirmation modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {confirmRemove && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="bg-white rounded-2xl border border-[#1A1A2E]/10 shadow-2xl w-full max-w-xs p-6 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 24, color: "#ef4444" }} />
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-[#1A1A2E] text-lg">{t.removeTitle}</h3>
              <p className="text-[#1A1A2E]/50 text-sm mt-1 leading-relaxed">{t.removeDesc}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 h-11 rounded-full border border-[#1A1A2E]/15 text-xs font-semibold text-[#1A1A2E]/70 hover:border-[#1A1A2E]/30 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => removePromo(confirmRemove)}
                className="flex-1 h-11 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors"
              >
                {t.remove}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ Toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {toast && (
        <div
          className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium sl-rise ${
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
