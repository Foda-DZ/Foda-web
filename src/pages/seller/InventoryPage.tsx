import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { sellerService } from "../../services/sellerService";
import type { InventoryVariantUpdate } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";
import SellerLayout from "../../components/seller/SellerLayout";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type InventoryStats = Awaited<ReturnType<typeof sellerService.getInventoryStats>>;
type InventoryResponse = Awaited<ReturnType<typeof sellerService.getInventory>>;
type InventoryItem = InventoryResponse["items"][number];
type VariantCell = InventoryItem["variants"][number];

type Filter = "all" | "low" | "out";

const LOW_THRESHOLD = 5;
const GOLD = "#C9A84C";

// â”€â”€â”€ KPI card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function KpiCard({
  icon,
  label,
  desc,
  value,
  accent,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  value: number;
  accent: string;
  loading: boolean;
}) {
  return (
    <div className="sl-card sl-card-hover p-5 relative overflow-hidden">
      <span
        className="absolute inset-x-0 top-0 h-1 rounded-b-full"
        style={{ background: accent }}
      />
      <div className="space-y-3">
        <div
          className="w-11 h-11 sl-chip flex items-center justify-center"
          style={{ background: `${accent}1f` }}
        >
          {icon}
        </div>
        <div className="space-y-1">
          <p className="sl-eyebrow">{label}</p>
          {loading ? (
            <div className="h-8 w-16 bg-[#1A1A2E]/8 animate-pulse rounded-lg" />
          ) : (
            <p className="font-display text-[1.8rem] font-bold text-[#1A1A2E] tabular-nums leading-tight">
              {value.toLocaleString()}
            </p>
          )}
          <p className="text-[11px] text-[#1A1A2E]/40">{desc}</p>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function InventoryPage() {
  const { tr, isRTL } = useLang();
  const t = tr.seller.inventoryPage;

  // Server state
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // Matrix editor state
  const [activeId, setActiveId] = useState<string | null>(null);
  // Map<variantId, stock> with the *edited* values. Cleared after save.
  const [draft, setDraft] = useState<Record<string, number>>({});
  const undoRef = useRef<Record<string, number> | null>(null);
  const [skuDraft, setSkuDraft] = useState<Record<string, string>>({});
  // Raw string per cell while the seller is actively typing (allows empty / mid-entry values)
  const [rawInput, setRawInput] = useState<Record<string, string>>({});

  // Save state
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [inv, statsRes] = await Promise.all([
        sellerService.getInventory({ page: 1, limit: 200, search: search.trim() || undefined }),
        sellerService.getInventoryStats(),
      ]);
      setItems(inv.items);
      setStats(statsRes);
      // Keep the active selection if still present, else pick the first.
      setActiveId((prev) =>
        prev && inv.items.some((p) => p._id === prev) ? prev : inv.items[0]?._id ?? null,
      );
    } catch {
      setToast({ type: "error", msg: t.toastLoadError });
    } finally {
      setLoading(false);
    }
  }, [search, t.toastLoadError]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search refresh
  useEffect(() => {
    const id = setTimeout(() => {
      void load();
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // â”€â”€â”€ Derived â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((p) => {
      if (filter === "out") return p.totalStock === 0;
      if (filter === "low") {
        const stocks = p.variants.map((v) => v.stock);
        const min = stocks.length ? Math.min(...stocks) : 0;
        return min > 0 && min <= LOW_THRESHOLD && p.totalStock > 0;
      }
      return true;
    });
  }, [items, filter]);

  const activeProduct = useMemo(
    () => items.find((p) => p._id === activeId) || null,
    [items, activeId],
  );

  // Effective stock for a given variant â€” draft overrides the server value.
  const effStock = useCallback(
    (v: VariantCell) => (draft[v._id] !== undefined ? draft[v._id] : v.stock),
    [draft],
  );

  const dirty = Object.keys(draft).length > 0 || Object.keys(skuDraft).length > 0 || Object.keys(rawInput).length > 0;

  const liveTotal = useMemo(() => {
    if (!activeProduct) return 0;
    return activeProduct.variants.reduce((sum, v) => sum + effStock(v), 0);
  }, [activeProduct, effStock]);

  // â”€â”€â”€ Editing helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const setCell = (variantId: string, value: string) => {
    setRawInput((r) => ({ ...r, [variantId]: value }));
  };

  const commitCell = (variantId: string, value: string) => {
    const n = Math.max(0, Math.floor(Number(value) || 0));
    setRawInput((r) => { const next = { ...r }; delete next[variantId]; return next; });
    setDraft((d) => ({ ...d, [variantId]: n }));
  };

  const cancelEdits = () => {
    setDraft({});
    setSkuDraft({});
    setRawInput({});
    undoRef.current = null;
  };

  // Switching products discards the unsaved draft for the previous product.
  const selectProduct = (id: string) => {
    setActiveId(id);
    setDraft({});
    setSkuDraft({});
    setRawInput({});
    undoRef.current = null;
  };

  // â”€â”€â”€ Save â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const save = async () => {
    if (!activeProduct || !dirty) return;
    setSaving(true);
    try {
      const variants: InventoryVariantUpdate[] = [];
      for (const v of activeProduct.variants) {
        const newStock = draft[v._id];
        const newSku = skuDraft[v._id];
        if (newStock === undefined && newSku === undefined) continue;
        variants.push({
          variantId: v._id,
          size: v.size,
          color: v.color,
          stock: newStock !== undefined ? newStock : v.stock,
          sku: newSku !== undefined ? newSku || undefined : v.sku,
        });
      }
      if (variants.length === 0) return;

      await sellerService.updateInventory(activeProduct._id, { variants });
      setDraft({});
      setSkuDraft({});
      undoRef.current = null;
      setToast({ type: "success", msg: t.toastUpdated });
      await load();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t.toastUpdateError;
      setToast({ type: "error", msg });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  // â”€â”€â”€ Render helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const cellTone = (stock: number) => {
    if (stock === 0) return "border-red-400 bg-red-50/40";
    if (stock <= LOW_THRESHOLD) return "border-amber-400 bg-amber-50/40";
    return "border-[#1A1A2E]/12";
  };

  // â”€â”€â”€ UI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <SellerLayout>
      <div className="p-6 sm:p-8 lg:p-10 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className={`flex items-start justify-between flex-wrap gap-4 sl-rise`}>
          <div className={`flex items-center gap-3.5`}>
            <div className="w-12 h-12 sl-icon-tile-gold flex items-center justify-center shrink-0">
              <WarehouseOutlinedIcon sx={{ fontSize: 24, color: GOLD }} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">{t.title}</h1>
              <p className="text-[#1A1A2E]/50 text-sm mt-0.5">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchOutlinedIcon
                sx={{ fontSize: 18, color: "#1A1A2E", opacity: 0.4, position: "absolute", insetInlineStart: 14, top: 12 }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="h-11 ps-11 pe-4 rounded-full border border-[#1A1A2E]/10 bg-white text-sm w-56 focus:outline-none focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/10 transition-all"
              />
            </div>
            <button
              onClick={() => load()}
              className="h-11 w-11 rounded-full inline-flex items-center justify-center border border-[#1A1A2E]/10 bg-white text-[#1A1A2E]/60 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors"
              title="Refresh"
            >
              <RefreshOutlinedIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            icon={<InventoryOutlinedIcon sx={{ fontSize: 18, color: GOLD }} />}
            label={t.kpiTotalActive}
            desc={t.kpiTotalActiveDesc}
            value={stats?.totalActive ?? 0}
            accent={GOLD}
            loading={loading}
          />
          <KpiCard
            icon={<WarningAmberOutlinedIcon sx={{ fontSize: 18, color: "#f59e0b" }} />}
            label={t.kpiLowStock}
            desc={t.kpiLowStockDesc}
            value={stats?.lowStock ?? 0}
            accent="#f59e0b"
            loading={loading}
          />
          <KpiCard
            icon={<ErrorOutlineOutlinedIcon sx={{ fontSize: 18, color: "#ef4444" }} />}
            label={t.kpiOutOfStock}
            desc={t.kpiOutOfStockDesc}
            value={stats?.outOfStockVariants ?? 0}
            accent="#ef4444"
            loading={loading}
          />
          <KpiCard
            icon={<CheckCircleOutlinedIcon sx={{ fontSize: 18, color: "#10b981" }} />}
            label={t.kpiTotalUnits}
            desc={t.kpiTotalUnitsDesc}
            value={stats?.totalUnits ?? 0}
            accent="#10b981"
            loading={loading}
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "low", "out"] as Filter[]).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`h-9 px-4 rounded-full text-xs font-semibold transition-all duration-200 ${
                filter === k
                  ? "sl-nav-active"
                  : "bg-white border border-[#1A1A2E]/8 text-[#1A1A2E]/55 hover:text-[#1A1A2E] hover:border-[#C9A84C]/40"
              }`}
            >
              {k === "all" ? t.filterAll : k === "low" ? t.filterLow : t.filterOut}
            </button>
          ))}
        </div>

        {/* Two-pane layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          {/* â”€â”€ Product list pane â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="sl-card max-h-[70vh] overflow-y-auto">
            <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2]">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                {t.sectionHeader}
              </span>
            </div>
            {loading ? (
              <div className="p-4 space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-[#1A1A2E]/6 animate-pulse rounded" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-6 text-center text-[#1A1A2E]/45 text-sm">
                {filter === "all" ? t.emptyTitle : t.noProductsForFilter}
              </div>
            ) : (
              <ul className="divide-y divide-[#1A1A2E]/5">
                {filteredItems.map((p) => {
                  const stocks = p.variants.map((v) => v.stock);
                  const min = stocks.length ? Math.min(...stocks) : 0;
                  const dot =
                    p.totalStock === 0
                      ? "bg-red-500"
                      : min > 0 && min <= LOW_THRESHOLD
                        ? "bg-amber-500"
                        : "bg-emerald-500";
                  const isActive = p._id === activeId;
                  return (
                    <li key={p._id}>
                      <button
                        onClick={() => selectProduct(p._id)}
                        className={`w-full flex items-center gap-3 p-3 text-start transition-colors ${
                          isActive
                            ? "bg-[#C9A84C]/10 border-s-[3px] border-s-[#C9A84C]"
                            : "border-s-[3px] border-s-transparent hover:bg-[#1A1A2E]/[0.03]"
                        }`}
                      >
                        {p.images?.[0]?.url ? (
                          <img
                            src={p.images[0].url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-[#1A1A2E]/5 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#1A1A2E]/5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1A1A2E] truncate">{p.name}</p>
                          <p className="text-[11px] text-[#1A1A2E]/45 tabular-nums">
                            {p.totalStock} {t.units}
                          </p>
                        </div>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* â”€â”€ Matrix pane â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="l-card flex flex-col">
            <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                  {t.matrixTitle}
                </p>
                <p className="text-[11px] text-[#1A1A2E]/40 mt-0.5">{t.matrixSubtitle}</p>
              </div>
              {activeProduct && dirty && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-amber-600 font-semibold hidden sm:inline">
                    {t.unsavedChanges}
                  </span>
                  <button
                    type="button"
                    onClick={cancelEdits}
                    disabled={saving}
                    className="h-9 px-4 rounded-full inline-flex items-center gap-1.5 border border-[#1A1A2E]/15 text-xs font-semibold text-[#1A1A2E]/60 bg-white hover:border-[#1A1A2E]/30 hover:text-[#1A1A2E] disabled:opacity-40 transition-all duration-200"
                  >
                    <CloseOutlinedIcon sx={{ fontSize: 14 }} />
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="h-9 px-5 rounded-full inline-flex items-center gap-1.5 gold-gradient text-[#1A1A2E] text-xs font-bold shadow-sm hover:shadow-md disabled:opacity-50 transition-all duration-200"
                  >
                    {saving ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#1A1A2E]/40 border-t-[#1A1A2E] rounded-full animate-spin" />
                        {t.saving}
                      </>
                    ) : (
                      <>
                        <SaveOutlinedIcon sx={{ fontSize: 14 }} />
                        {t.saveChanges}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {!activeProduct ? (
              <div className="p-10 text-center text-[#1A1A2E]/40 text-sm">
                {items.length === 0 ? t.emptyTitle : t.matrixEmpty}
              </div>
            ) : activeProduct.variants.length === 0 ? (
              <div className="p-10 text-center text-[#1A1A2E]/40 text-sm">{t.matrixEmpty}</div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Live totals strip */}
                <div className="flex items-center gap-4 flex-wrap text-xs">
                  <span className="text-[#1A1A2E]/45">
                    {t.totalStockLabel}:{" "}
                    <span className="text-[#1A1A2E] font-bold tabular-nums">{liveTotal}</span>
                  </span>
                  {dirty && (
                    <span className="text-amber-600 font-semibold">{t.unsavedChanges}</span>
                  )}
                </div>

                {/* Matrix */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="text-start text-[10px] uppercase tracking-wide text-[#1A1A2E]/40 font-semibold p-2 w-24"></th>
                        {activeProduct.colors.map((c) => (
                          <th
                            key={c}
                            className="text-center text-[10px] uppercase tracking-wide text-[#1A1A2E]/50 font-semibold p-2 min-w-[90px]"
                          >
                            {c}
                          </th>
                        ))}
                        <th className="text-center text-[10px] uppercase tracking-wide text-[#1A1A2E]/40 font-semibold p-2 w-16">
                          Î£
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeProduct.sizes.map((size) => {
                        const rowTotal = activeProduct.variants
                          .filter((v) => v.size === size)
                          .reduce((s, v) => s + effStock(v), 0);
                        return (
                          <tr key={size} className="border-t border-[#1A1A2E]/5">
                            <th className="text-start font-bold text-[#1A1A2E] text-sm p-2">
                              {size}
                            </th>
                            {activeProduct.colors.map((color) => {
                              const v = activeProduct.variants.find(
                                (x) => x.size === size && x.color === color,
                              );
                              if (!v) {
                                return (
                                  <td key={color} className="p-2 text-center text-[#1A1A2E]/20">
                                    â€”
                                  </td>
                                );
                              }
                              const committed = effStock(v);
                              const displayValue = rawInput[v._id] !== undefined ? rawInput[v._id] : committed;
                              return (
                                <td key={color} className="p-1 align-top">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={displayValue}
                                    onChange={(e) => setCell(v._id, e.target.value)}
                                    onFocus={(e) => e.currentTarget.select()}
                                    onBlur={(e) => commitCell(v._id, e.target.value)}
                                    className={`w-full h-9 px-2 text-center tabular-nums border-2 text-sm font-semibold focus:outline-none focus:border-[#C9A84C] ${cellTone(committed)}`}
                                  />
                                </td>
                              );
                            })}
                            <td className="p-2 text-center text-[11px] text-[#1A1A2E]/60 tabular-nums font-semibold">
                              {rowTotal}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Column totals + fill row */}
                      <tr className="border-t border-[#1A1A2E]/12 bg-[#FAF7F2]">
                        <th className="text-start text-[10px] uppercase tracking-wide text-[#1A1A2E]/45 font-semibold p-2">
                          Î£
                        </th>
                        {activeProduct.colors.map((color) => {
                          const colTotal = activeProduct.variants
                            .filter((v) => v.color === color)
                            .reduce((s, v) => s + effStock(v), 0);
                          return (
                            <td
                              key={color}
                              className="p-2 text-center text-xs tabular-nums font-bold text-[#1A1A2E]"
                            >
                              {colTotal}
                            </td>
                          );
                        })}
                        <td className="p-2 text-center text-xs tabular-nums font-bold text-[#1A1A2E]">
                          {liveTotal}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium sl-rise ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </SellerLayout>
  );
}

