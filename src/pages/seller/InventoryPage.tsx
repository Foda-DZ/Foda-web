import { useEffect, useState, useCallback, useRef } from "react";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import { sellerService } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";
import SellerLayout from "../../components/seller/SellerLayout";

type InventoryStats = Awaited<ReturnType<typeof sellerService.getInventoryStats>>;

interface InventoryItem {
  _id: string;
  name: string;
  stock: number;
  sizes?: string[];
  sizeVariants?: { size: string; stock: number }[];
  images?: { url: string }[];
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({
  icon,
  label,
  desc,
  value,
  accent,
  loading,
  warning,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  value: number;
  accent: string;
  loading: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className="bg-white overflow-hidden border-t-2"
      style={{ borderTopColor: accent }}
    >
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal/40">
              {label}
            </p>
            <p className="text-[10px] text-charcoal/30 mt-0.5">{desc}</p>
          </div>
          <div
            className="w-9 h-9 flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accent}18` }}
          >
            {icon}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-7 w-20 bg-charcoal/8 rounded" />
            <div className="h-3 w-14 bg-charcoal/6 rounded" />
          </div>
        ) : (
          <p
            className="font-display text-2xl font-bold tabular-nums"
            style={{ color: warning && value > 0 ? accent : "#1A1A2E" }}
          >
            {value.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Alert product mini-card ───────────────────────────────────────────────────
function AlertCard({
  item,
  accent,
  badge,
  updateLabel,
  units,
  onUpdate,
}: {
  item: InventoryStats["outOfStockItems"][number];
  accent: string;
  badge: React.ReactNode;
  updateLabel: string;
  units: string;
  onUpdate: (id: string) => void;
}) {
  return (
    <div
      className="shrink-0 w-44 bg-white border border-charcoal/8 overflow-hidden flex flex-col"
      style={{ borderTopColor: accent, borderTopWidth: 2 }}
    >
      <div className="h-28 bg-cream overflow-hidden">
        {item.images?.[0]?.url ? (
          <img
            src={item.images[0].url}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <InventoryOutlinedIcon sx={{ fontSize: 24, color: "rgba(26,26,46,0.15)" }} />
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-[11px] font-semibold text-charcoal leading-snug line-clamp-2">
          {item.name}
        </p>
        <div className="flex items-center justify-between gap-1">
          {badge}
          <span className="text-[10px] text-charcoal/40 tabular-nums">
            {item.stock} {units}
          </span>
        </div>
        <button
          onClick={() => onUpdate(item._id)}
          className="mt-auto w-full py-1.5 text-[10px] font-bold uppercase tracking-wide border border-charcoal/15 text-charcoal/50 hover:border-gold/60 hover:text-gold transition-all duration-200"
        >
          {updateLabel}
        </button>
      </div>
    </div>
  );
}

// ── Stock badge ───────────────────────────────────────────────────────────────
function StockBadge({
  stock,
  labels,
}: {
  stock: number;
  labels: { outOfStock: string; lowStock: string; inStock: string };
}) {
  if (stock === 0)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 10 }} />
        {labels.outOfStock}
      </span>
    );
  if (stock <= 5)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
        <WarningAmberOutlinedIcon sx={{ fontSize: 10 }} />
        {labels.lowStock}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircleOutlinedIcon sx={{ fontSize: 10 }} />
      {labels.inStock}
    </span>
  );
}

// ── Table row skeleton ─────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-charcoal/5 animate-pulse">
      <td className="px-4 py-3"><div className="w-10 h-12 bg-charcoal/8 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-40 bg-charcoal/8 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-10 bg-charcoal/6 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-24 bg-charcoal/6 rounded" /></td>
      <td className="px-4 py-3"><div className="h-5 w-20 bg-charcoal/8 rounded" /></td>
      <td className="px-4 py-3"><div className="h-7 w-7 bg-charcoal/6 rounded" /></td>
    </tr>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function InventoryPage() {
  const { isRTL, tr } = useLang();
  const t = tr.seller.inventoryPage;

  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Ref map for scrolling to a row by product id
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  const LIMIT = 20;

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await sellerService.getInventoryStats();
      setStats(data);
    } catch {
      // Stats are supplementary; don't block the UI
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch inventory list
  const fetchInventory = useCallback(
    async (p: number, q?: string) => {
      setLoading(true);
      try {
        const data = await sellerService.getInventory({ page: p, limit: LIMIT, search: q });
        setInventory(data.items as InventoryItem[]);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        showToast(err instanceof Error ? err.message : t.toastLoadError, "error");
      } finally {
        setLoading(false);
      }
    },
    [t.toastLoadError],
  );

  useEffect(() => {
    fetchStats();
    fetchInventory(1, "");
  }, [fetchStats, fetchInventory]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchInventory(1, value);
    }, 400);
  };

  const startEdit = (item: InventoryItem) => {
    setEditingId(item._id);
    setEditValue(item.stock);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue(0);
  };

  const saveStock = async (productId: string) => {
    if (typeof editValue !== "number" || Number.isNaN(editValue) || editValue < 0) {
      showToast(t.toastInvalidStock, "error");
      return;
    }
    setSavingId(productId);
    try {
      await sellerService.updateInventory(productId, { stock: editValue });
      setInventory((prev) =>
        prev.map((item) => item._id === productId ? { ...item, stock: editValue } : item),
      );
      // Refresh stats after update
      fetchStats();
      showToast(t.toastUpdated, "success");
      setEditingId(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.toastUpdateError, "error");
    } finally {
      setSavingId(null);
    }
  };

  const changePage = (p: number) => {
    setPage(p);
    fetchInventory(p, search);
  };

  // Scroll to table row and open edit mode
  const scrollToAndEdit = (productId: string) => {
    const row = rowRefs.current[productId];
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      const item = inventory.find((i) => i._id === productId);
      if (item) startEdit(item);
    } else {
      // Product not on current page — reload page 1 and search by jumping to table
      setPage(1);
      fetchInventory(1, search).then(() => {
        setTimeout(() => {
          const r = rowRefs.current[productId];
          if (r) { r.scrollIntoView({ behavior: "smooth", block: "center" }); }
        }, 300);
      });
    }
  };

  const hasAlerts = (stats?.outOfStock ?? 0) > 0 || (stats?.lowStock ?? 0) > 0;

  const kpis = [
    {
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />,
      label: t.kpiTotalActive,
      desc: t.kpiTotalActiveDesc,
      value: stats?.totalActive ?? 0,
      accent: "#10B981",
      warning: false,
    },
    {
      icon: <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: "#F59E0B" }} />,
      label: t.kpiLowStock,
      desc: t.kpiLowStockDesc,
      value: stats?.lowStock ?? 0,
      accent: "#F59E0B",
      warning: true,
    },
    {
      icon: <ErrorOutlineOutlinedIcon sx={{ fontSize: 18, color: "#EF4444" }} />,
      label: t.kpiOutOfStock,
      desc: t.kpiOutOfStockDesc,
      value: stats?.outOfStock ?? 0,
      accent: "#EF4444",
      warning: true,
    },
    {
      icon: <InventoryOutlinedIcon sx={{ fontSize: 18, color: "#C9A84C" }} />,
      label: t.kpiTotalUnits,
      desc: t.kpiTotalUnitsDesc,
      value: stats?.totalUnits ?? 0,
      accent: "#C9A84C",
      warning: false,
    },
  ];

  return (
    <SellerLayout>
      <div className="p-6 md:p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <WarehouseOutlinedIcon sx={{ fontSize: 20, color: "#C9A84C" }} />
              <h1 className="font-display text-2xl font-bold text-charcoal">
                {t.title}
              </h1>
            </div>
            <p className="text-charcoal/50 text-sm">{t.subtitle}</p>
          </div>
        </div>

        {/* ── KPI cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <KpiCard
              key={k.label}
              icon={k.icon}
              label={k.label}
              desc={k.desc}
              value={k.value}
              accent={k.accent}
              loading={statsLoading}
              warning={k.warning}
            />
          ))}
        </div>

        {/* ── Low-stock alert panel ─────────────────────────────────────── */}
        {!statsLoading && hasAlerts && (
          <div className="bg-white border border-charcoal/8 overflow-hidden">
            {/* Alert header */}
            <div className="px-5 py-4 border-b border-charcoal/8 bg-amber-50/60 flex items-center gap-2">
              <NotificationsActiveOutlinedIcon sx={{ fontSize: 16, color: "#D97706" }} />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700">
                  {t.alertTitle}
                </span>
                <span className="text-[10px] text-amber-600/70 ms-2">{t.alertSubtitle}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {(stats?.outOfStock ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold border border-red-200">
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: 9 }} />
                    {stats!.outOfStock}
                  </span>
                )}
                {(stats?.lowStock ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200">
                    <WarningAmberOutlinedIcon sx={{ fontSize: 9 }} />
                    {stats!.lowStock}
                  </span>
                )}
              </div>
            </div>

            <div className="divide-y divide-charcoal/5">
              {/* Out of stock section */}
              {(stats?.outOfStockItems?.length ?? 0) > 0 && (
                <div className="px-5 py-4 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-500 flex items-center gap-1.5">
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: 11 }} />
                    {t.alertOutOfStockSection}
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                    {stats!.outOfStockItems.map((item) => (
                      <AlertCard
                        key={item._id}
                        item={item}
                        accent="#EF4444"
                        badge={
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: 8 }} />
                            {t.outOfStock}
                          </span>
                        }
                        updateLabel={t.updateStock}
                        units={t.units}
                        onUpdate={scrollToAndEdit}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Low stock section */}
              {(stats?.lowStockItems?.length ?? 0) > 0 && (
                <div className="px-5 py-4 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-600 flex items-center gap-1.5">
                    <WarningAmberOutlinedIcon sx={{ fontSize: 11 }} />
                    {t.alertLowStockSection}
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                    {stats!.lowStockItems.map((item) => (
                      <AlertCard
                        key={item._id}
                        item={item}
                        accent="#F59E0B"
                        badge={
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                            <WarningAmberOutlinedIcon sx={{ fontSize: 8 }} />
                            {t.lowStock}
                          </span>
                        }
                        updateLabel={t.updateStock}
                        units={t.units}
                        onUpdate={scrollToAndEdit}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Inventory table ───────────────────────────────────────────── */}
        <div className="bg-white border border-charcoal/8 overflow-hidden">
          {/* Table header + search */}
          <div className="px-5 py-3.5 border-b border-charcoal/8 bg-cream flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <WarehouseOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-charcoal/50">
                {t.sectionHeader} — {loading ? "…" : inventory.length} {t.productPlural}
              </span>
            </div>
            {/* Search */}
            <div className="relative">
              <SearchOutlinedIcon
                sx={{ fontSize: 14, color: "rgba(26,26,46,0.4)" }}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-2.5" : "left-2.5"} pointer-events-none`}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`h-8 w-52 border border-charcoal/12 bg-white text-xs text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold/50 transition-colors ${isRTL ? "pr-8 pl-3" : "pl-8 pr-3"}`}
              />
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/8">
                {["", t.colProduct, t.colStock, t.colSizes, t.colStatus, t.colAction].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-start text-[10px] font-bold tracking-[0.15em] uppercase text-charcoal/40"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-charcoal/5 flex items-center justify-center">
                      <WarehouseOutlinedIcon sx={{ fontSize: 24, color: "rgba(26,26,46,0.2)" }} />
                    </div>
                    <p className="font-display font-bold text-charcoal">{t.emptyTitle}</p>
                    <p className="text-charcoal/40 text-sm mt-1">{t.emptyDesc}</p>
                  </td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const isEditing = editingId === item._id;
                  const isSaving = savingId === item._id;
                  const isAlert = item.stock === 0 || item.stock <= 5;

                  return (
                    <tr
                      key={item._id}
                      ref={(el) => { rowRefs.current[item._id] = el; }}
                      className={`border-b border-charcoal/5 last:border-0 transition-colors duration-150 ${
                        isEditing
                          ? "bg-cream"
                          : isAlert && item.stock === 0
                          ? "bg-red-50/40 hover:bg-red-50/70"
                          : isAlert
                          ? "bg-amber-50/30 hover:bg-amber-50/60"
                          : "hover:bg-cream/60"
                      }`}
                    >
                      {/* Image */}
                      <td className="px-4 py-3">
                        <div className="w-10 h-12 bg-cream overflow-hidden shrink-0">
                          {item.images?.[0]?.url && (
                            <img
                              src={item.images[0].url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-charcoal text-xs truncate max-w-50">
                          {item.name}
                        </p>
                      </td>

                      {/* Stock (editable) */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            value={editValue}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            autoFocus
                            className="w-20 h-8 border border-gold/60 bg-white text-xs text-charcoal text-center focus:outline-none focus:border-gold transition-colors"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveStock(item._id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                        ) : (
                          <span
                            className={`text-xs font-bold tabular-nums ${
                              item.stock === 0
                                ? "text-red-500"
                                : item.stock <= 5
                                ? "text-amber-600"
                                : "text-charcoal"
                            }`}
                          >
                            {item.stock}
                          </span>
                        )}
                      </td>

                      {/* Sizes */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {item.sizeVariants && item.sizeVariants.length > 0
                            ? item.sizeVariants.map((v) => (
                                <span
                                  key={v.size}
                                  className={`text-[10px] px-1.5 py-0.5 ${
                                    v.stock === 0
                                      ? "bg-red-50 text-red-500 border border-red-200"
                                      : v.stock <= 5
                                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                                      : "bg-charcoal/5 text-charcoal/60"
                                  }`}
                                >
                                  {v.size} ({v.stock})
                                </span>
                              ))
                            : (item.sizes?.map((s) => (
                                <span key={s} className="text-[10px] px-1.5 py-0.5 bg-charcoal/5 text-charcoal/60">
                                  {s}
                                </span>
                              )) ?? (
                                <span className="text-charcoal/30 text-xs">—</span>
                              ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StockBadge
                          stock={isEditing ? editValue : item.stock}
                          labels={{ outOfStock: t.outOfStock, lowStock: t.lowStock, inStock: t.inStock }}
                        />
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => saveStock(item._id)}
                              disabled={isSaving}
                              className="w-7 h-7 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-200 disabled:opacity-60"
                            >
                              {isSaving ? (
                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <CheckOutlinedIcon sx={{ fontSize: 13 }} />
                              )}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={isSaving}
                              className="w-7 h-7 flex items-center justify-center bg-charcoal/8 hover:bg-charcoal/15 text-charcoal/60 transition-colors duration-200"
                            >
                              <CloseOutlinedIcon sx={{ fontSize: 13 }} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(item)}
                            className="w-7 h-7 flex items-center justify-center border border-charcoal/15 text-charcoal/50 hover:border-gold/50 hover:text-gold transition-all duration-200"
                          >
                            <EditOutlinedIcon sx={{ fontSize: 13 }} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="px-5 py-3.5 border-t border-charcoal/8 bg-cream flex items-center justify-between">
              <span className="text-xs text-charcoal/40">
                {t.page} {page} {t.of} {totalPages}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className={`w-7 h-7 text-xs font-semibold transition-all duration-200 ${
                      p === page
                        ? "gold-gradient text-charcoal"
                        : "bg-white border border-charcoal/12 text-charcoal/50 hover:border-gold/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-50 flex items-center gap-2.5 px-4 py-3 shadow-lg text-sm font-medium transition-all duration-300 ${
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
    </SellerLayout>
  );
}
