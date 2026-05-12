import { useEffect, useMemo, useState, useCallback } from "react";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";
import type {
  ApiProduct,
  TrafficOverview,
  TrafficSource,
  TrafficSourceRow,
  TrafficRangeParams,
  TrafficTrendPoint,
} from "../../types/api";

type RangeKey = "today" | "7d" | "30d" | "custom";

const SOURCE_COLOR: Record<TrafficSource, string> = {
  instagram: "#E1306C",
  tiktok: "#1A1A2E",
  whatsapp: "#25D366",
  facebook: "#1877F2",
  direct: "#C9A84C",
  other: "#94A3B8",
};

// ── Visits trend bar chart (pure SVG, RTL-aware) ──────────────────────────────
function BarChart({ data, emptyLabel, isRTL }: { data: TrafficTrendPoint[]; emptyLabel: string; isRTL: boolean }) {
  const HEIGHT = 130;
  const BAR_W = 12;
  const GAP = 5;
  const max = useMemo(() => Math.max(...data.map((d) => d.visits), 1), [data]);
  const latestDate = useMemo(() => (data.length ? data[data.length - 1].date : null), [data]);
  const hasAny = data.some((d) => d.visits > 0);

  if (data.length === 0 || !hasAny) {
    return <div className="h-36 flex items-center justify-center text-charcoal/30 text-sm">{emptyLabel}</div>;
  }

  const displayed = isRTL ? [...data].reverse() : data;
  const totalW = displayed.length * (BAR_W + GAP) - GAP;

  return (
    <div className="relative overflow-x-auto">
      <svg
        width="100%"
        viewBox={`0 0 ${Math.max(totalW, 200)} ${HEIGHT + 20}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ minHeight: HEIGHT + 20 }}
      >
        {displayed.map((d, i) => {
          const barH = Math.max(2, (d.visits / max) * HEIGHT);
          const x = i * (BAR_W + GAP);
          const y = HEIGHT - barH;
          const isLatest = d.date === latestDate;
          return (
            <g key={d.date}>
              <rect x={x} y={y} width={BAR_W} height={barH} fill={isLatest ? "#C9A84C" : "#C9A84C40"} rx={1} />
              {(displayed.length <= 14 || i % 5 === 0) && (
                <text x={x + BAR_W / 2} y={HEIGHT + 14} textAnchor="middle" fontSize={7} fill="#1A1A2E60">
                  {d.date.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Tiny sparkline for source rows ────────────────────────────────────────────
function Sparkline({ data, color }: { data: TrafficTrendPoint[]; color: string }) {
  const max = Math.max(...data.map((d) => d.visits), 1);
  const W = 80;
  const H = 22;
  const n = data.length;
  if (n === 0) return <div style={{ width: W, height: H }} />;
  return (
    <svg width={W} height={H} className="shrink-0" preserveAspectRatio="none">
      {data.map((d, i) => {
        const bw = W / n;
        const bh = Math.max(1, (d.visits / max) * H);
        return <rect key={i} x={i * bw} y={H - bh} width={Math.max(1, bw - 1)} height={bh} fill={`${color}AA`} />;
      })}
    </svg>
  );
}

// ── KPI card ──────────────────────────────────────────────────────────────────
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
  value: string;
  accent: string;
  loading: boolean;
}) {
  return (
    <div className="bg-white border-t-2 overflow-hidden" style={{ borderTopColor: accent }}>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal/40">{label}</p>
            <p className="text-[10px] text-charcoal/30 mt-0.5">{desc}</p>
          </div>
          <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}18` }}>
            {icon}
          </div>
        </div>
        {loading ? (
          <div className="h-7 w-28 bg-charcoal/8 rounded animate-pulse" />
        ) : (
          <p className="font-display text-2xl font-bold text-charcoal tabular-nums">{value}</p>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TrafficAnalyticsPage() {
  const { tr, isRTL } = useLang();
  const t = tr.seller.trafficAnalyticsPage;

  const [range, setRange] = useState<RangeKey>("7d");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState<ApiProduct[]>([]);

  const [overview, setOverview] = useState<TrafficOverview | null>(null);
  const [sources, setSources] = useState<TrafficSourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    sellerService.getProducts().then(setProducts).catch(() => undefined);
  }, []);

  const params = useMemo<TrafficRangeParams | null>(() => {
    if (range === "custom") {
      if (!from || !to) return null;
      return { range: "custom", from, to, ...(productId ? { productId } : {}) };
    }
    return { range, ...(productId ? { productId } : {}) };
  }, [range, from, to, productId]);

  useEffect(() => {
    if (!params) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const handle = setTimeout(() => {
      Promise.all([sellerService.getTrafficOverview(params), sellerService.getTrafficSources(params)])
        .then(([ov, src]) => {
          if (cancelled) return;
          setOverview(ov);
          setSources(src);
        })
        .catch((err) => {
          if (!cancelled) setError(err?.message || t.error);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [params, t.error]);

  const handleExport = useCallback(async () => {
    if (!params) return;
    setExporting(true);
    try {
      const blob = await sellerService.exportTrafficReport(params);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `traffic-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // download failure — no banner needed
    } finally {
      setExporting(false);
    }
  }, [params]);

  const sourceName = (s: TrafficSource) => t.sources[s] ?? s;
  const nf = (n: number) => n.toLocaleString();

  const RANGE_TABS: { key: RangeKey; label: string }[] = [
    { key: "today", label: t.rangeToday },
    { key: "7d", label: t.range7d },
    { key: "30d", label: t.range30d },
    { key: "custom", label: t.rangeCustom },
  ];

  return (
    <SellerLayout>
      <div className="p-6 md:p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <InsightsOutlinedIcon sx={{ fontSize: 20, color: "#C9A84C" }} />
              <h1 className="font-display text-2xl font-bold text-charcoal">{t.title}</h1>
            </div>
            <p className="text-charcoal/50 text-sm">{t.subtitle}</p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting || !params || loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-charcoal/15 text-charcoal hover:bg-cream/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
            {exporting ? t.exporting : t.exportCsv}
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex border border-charcoal/10 bg-white">
            {RANGE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRange(tab.key)}
                className={`px-3.5 py-2 text-xs font-semibold transition-colors ${
                  range === tab.key ? "bg-charcoal text-white" : "text-charcoal/55 hover:bg-cream/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {range === "custom" && (
            <div className="flex items-center gap-2 text-xs text-charcoal/60">
              <span>{t.from}</span>
              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(e) => setFrom(e.target.value)}
                className="border border-charcoal/15 px-2 py-1.5 text-xs"
              />
              <span>{t.to}</span>
              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(e) => setTo(e.target.value)}
                className="border border-charcoal/15 px-2 py-1.5 text-xs"
              />
            </div>
          )}

          <div className="flex items-center gap-2 ms-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal/40">{t.scopeLabel}</span>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="border border-charcoal/15 bg-white px-2.5 py-1.5 text-xs max-w-[220px]"
            >
              <option value="">{t.wholeStore}</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 18 }} />
            {error}
          </div>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            icon={<GroupsOutlinedIcon sx={{ fontSize: 18, color: "#C9A84C" }} />}
            label={t.totalVisits}
            desc={t.totalVisitsDesc}
            value={nf(overview?.totalVisits ?? 0)}
            accent="#C9A84C"
            loading={loading}
          />
          <KpiCard
            icon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: "#1A1A2E" }} />}
            label={t.totalOrders}
            desc={t.totalOrdersDesc}
            value={nf(overview?.totalOrders ?? 0)}
            accent="#1A1A2E"
            loading={loading}
          />
          <KpiCard
            icon={<PercentOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />}
            label={t.conversionRate}
            desc={t.conversionRateDesc}
            value={`${(overview?.conversionRate ?? 0).toFixed(1)}%`}
            accent="#10B981"
            loading={loading}
          />
          <KpiCard
            icon={<StarOutlineOutlinedIcon sx={{ fontSize: 18, color: "#E1306C" }} />}
            label={t.topSource}
            desc={t.topSourceDesc}
            value={overview?.topSource ? sourceName(overview.topSource) : "—"}
            accent="#E1306C"
            loading={loading}
          />
        </div>

        {/* Chart + source breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
          {/* Visits trend */}
          <div className="bg-white border border-charcoal/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-charcoal/8 flex items-center gap-2">
              <InsightsOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-charcoal/40">{t.visitsTrend}</span>
            </div>
            <div className="px-5 pt-4 pb-4">
              {loading ? (
                <div className="h-36 animate-pulse bg-charcoal/5 rounded" />
              ) : (
                <BarChart data={overview?.trend ?? []} emptyLabel={t.visitsTrendEmpty} isRTL={isRTL} />
              )}
            </div>
          </div>

          {/* Source breakdown */}
          <div className="bg-white border border-charcoal/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-charcoal/8 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-charcoal/40">{t.sourceBreakdown}</span>
            </div>
            <div className="divide-y divide-charcoal/5">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 animate-pulse">
                    <div className="h-3 w-24 bg-charcoal/8 rounded mb-2" />
                    <div className="h-2 w-full bg-charcoal/5 rounded" />
                  </div>
                ))
              ) : sources.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-charcoal/30">{t.noSources}</div>
              ) : (
                sources.map((s) => (
                  <div key={s.source} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="flex items-center gap-2 text-xs font-semibold text-charcoal">
                        <span className="w-2.5 h-2.5 inline-block rounded-sm" style={{ backgroundColor: SOURCE_COLOR[s.source] }} />
                        {sourceName(s.source)}
                      </span>
                      <span className="text-xs text-charcoal/50 tabular-nums">
                        {nf(s.visits)} <span className="text-[10px] text-charcoal/30">{t.visits}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-charcoal/8 rounded overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${s.percentage}%`, backgroundColor: SOURCE_COLOR[s.source] }} />
                      </div>
                      <span className="text-[10px] text-charcoal/40 tabular-nums w-10 text-right">{s.percentage.toFixed(0)}%</span>
                      <Sparkline data={s.trend} color={SOURCE_COLOR[s.source]} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
