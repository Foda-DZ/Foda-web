import { useEffect, useMemo, useState, useCallback } from "react";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
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
  tiktok:    "#1A1A2E",
  whatsapp:  "#25D366",
  facebook:  "#1877F2",
  foda:    "#C9A84C",
};

// ── Visits trend bar chart — RTL-aware, hover tooltips ─────────────────────────
function BarChart({
  data,
  emptyLabel,
  isRTL,
}: {
  data: TrafficTrendPoint[];
  emptyLabel: string;
  isRTL: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const HEIGHT = 130;
  const BAR_W = 12;
  const GAP = 5;
  const GRID = 4;

  const max = useMemo(() => Math.max(...data.map((d) => d.visits), 1), [data]);
  const latestDate = data.length ? data[data.length - 1].date : null;
  const hasAny = data.some((d) => d.visits > 0);

  if (data.length === 0 || !hasAny) {
    return (
      <div className="h-36 flex flex-col items-center justify-center gap-2 text-[#1A1A2E]/30">
        <InsightsOutlinedIcon sx={{ fontSize: 28, opacity: 0.2 }} />
        <span className="text-sm">{emptyLabel}</span>
      </div>
    );
  }

  const displayed = isRTL ? [...data].reverse() : data;
  const totalW = displayed.length * (BAR_W + GAP) - GAP;
  const svgW = Math.max(totalW, 300);

  return (
    <div className="relative overflow-x-auto">
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${HEIGHT + 24}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ minHeight: HEIGHT + 24 }}
      >
        {/* Grid lines */}
        {Array.from({ length: GRID }).map((_, gi) => (
          <line
            key={gi}
            x1={0}
            y1={(HEIGHT / GRID) * gi}
            x2={svgW}
            y2={(HEIGHT / GRID) * gi}
            stroke="#1A1A2E0D"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
        ))}

        {/* Bars */}
        {displayed.map((d, i) => {
          const barH = Math.max(3, (d.visits / max) * HEIGHT);
          const x = i * (BAR_W + GAP);
          const y = HEIGHT - barH;
          const isLatest = d.date === latestDate;
          const isHov = hovered === i;
          return (
            <g
              key={d.date}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={x}
                y={y}
                width={BAR_W}
                height={barH}
                fill={isLatest ? "#C9A84C" : isHov ? "#C9A84C80" : "#C9A84C30"}
                rx={3}
                style={{ transition: "fill 0.12s" }}
              />
              {/* Hover tooltip */}
              {isHov && (
                <g>
                  <rect
                    x={Math.min(x - 18, svgW - 68)}
                    y={Math.max(y - 26, 2)}
                    width={64}
                    height={20}
                    rx={4}
                    fill="#1A1A2E"
                    opacity={0.88}
                  />
                  <text
                    x={Math.min(x - 18, svgW - 68) + 32}
                    y={Math.max(y - 26, 2) + 13}
                    textAnchor="middle"
                    fontSize={8.5}
                    fill="#fff"
                  >
                    {d.visits.toLocaleString()}
                  </text>
                </g>
              )}
              {/* Date label every 7 bars */}
              {(displayed.length <= 10 || i % 7 === 0) && (
                <text
                  x={x + BAR_W / 2}
                  y={HEIGHT + 17}
                  textAnchor="middle"
                  fontSize={7}
                  fill="#1A1A2E50"
                >
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

// ── Sparkline ──────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: TrafficTrendPoint[]; color: string }) {
  const max = Math.max(...data.map((d) => d.visits), 1);
  const W = 72;
  const H = 24;
  const n = data.length;
  if (n === 0) return <div style={{ width: W, height: H }} />;
  return (
    <svg width={W} height={H} className="shrink-0 rounded" preserveAspectRatio="none">
      {data.map((d, i) => {
        const bw = W / n;
        const bh = Math.max(2, (d.visits / max) * H);
        return (
          <rect
            key={i}
            x={i * bw}
            y={H - bh}
            width={Math.max(1, bw - 1.5)}
            height={bh}
            fill={`${color}99`}
            rx={1.5}
          />
        );
      })}
    </svg>
  );
}

// ── KPI card — RTL-correct ─────────────────────────────────────────────────────
function KpiCard({
  icon,
  label,
  desc,
  value,
  accent,
  loading,
  isRTL,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  value: string;
  accent: string;
  loading: boolean;
  isRTL: boolean;
}) {
  return (
    <div className="sl-card sl-card-hover p-5 relative overflow-hidden">
      <span className="absolute inset-x-0 top-0 h-1 rounded-b-full" style={{ background: accent }} />
      <div className="space-y-3.5">
        <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div
            className="w-11 h-11 sl-chip flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accent}1f` }}
          >
            {icon}
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <p className="sl-eyebrow">{label}</p>
            <p className="text-[10px] text-[#1A1A2E]/35 mt-0.5 leading-snug">{desc}</p>
          </div>
        </div>
        {loading ? (
          <div className="h-8 w-28 bg-[#1A1A2E]/8 rounded-lg animate-pulse" />
        ) : (
          <p className={`font-display text-2xl font-bold text-[#1A1A2E] tabular-nums ${isRTL ? "text-right" : "text-left"}`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
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
    if (!params) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const handle = setTimeout(() => {
      Promise.all([
        sellerService.getTrafficOverview(params),
        sellerService.getTrafficSources(params),
      ])
        .then(([ov, src]) => {
          if (cancelled) return;
          setOverview(ov);
          setSources(src);
        })
        .catch((err) => { if (!cancelled) setError(err?.message || t.error); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 300);
    return () => { cancelled = true; clearTimeout(handle); };
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
    } catch { /* silent */ }
    finally { setExporting(false); }
  }, [params]);

  const sourceName = (s: TrafficSource) => t.sources[s] ?? s;
  const nf = (n: number) => n.toLocaleString();

  const RANGE_TABS: { key: RangeKey; label: string }[] = [
    { key: "today", label: t.rangeToday },
    { key: "7d",    label: t.range7d    },
    { key: "30d",   label: t.range30d   },
    { key: "custom",label: t.rangeCustom },
  ];

  return (
    <SellerLayout>
      <div className="p-6 sm:p-8 lg:p-10 space-y-6" dir={isRTL ? "rtl" : "ltr"}>

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 sl-rise">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sl-icon-tile-gold flex items-center justify-center shrink-0">
              <InsightsOutlinedIcon sx={{ fontSize: 24, color: "#C9A84C" }} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                {t.title}
              </h1>
              <p className="text-[#1A1A2E]/50 text-sm mt-0.5">{t.subtitle}</p>
            </div>
          </div>

          {/* Export button with spinner */}
          <button
            onClick={handleExport}
            disabled={exporting || !params || loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border border-[#1A1A2E]/12 bg-white text-[#1A1A2E]/70 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {exporting ? (
              <span className="w-4 h-4 border-2 border-[#1A1A2E]/20 border-t-[#C9A84C] rounded-full animate-spin" />
            ) : (
              <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
            )}
            {exporting ? t.exporting : t.exportCsv}
          </button>
        </div>

        {/* Controls row */}
        <div className="sl-card p-4 flex flex-wrap items-center gap-4">
          {/* Range pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <CalendarTodayOutlinedIcon sx={{ fontSize: 15, color: "#C9A84C" }} />
            {RANGE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRange(tab.key)}
                className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  range === tab.key
                    ? "sl-nav-active"
                    : "border border-[#1A1A2E]/10 text-[#1A1A2E]/55 hover:text-[#1A1A2E] hover:border-[#C9A84C]/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Custom date range — RTL-aware */}
          {range === "custom" && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#1A1A2E]/50 font-medium">{t.from}</span>
              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(e) => setFrom(e.target.value)}
                className="h-8 rounded-xl border border-[#1A1A2E]/12 px-3 text-xs text-[#1A1A2E] bg-white focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              />
              <span className="text-xs text-[#1A1A2E]/50 font-medium">{t.to}</span>
              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(e) => setTo(e.target.value)}
                className="h-8 rounded-xl border border-[#1A1A2E]/12 px-3 text-xs text-[#1A1A2E] bg-white focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              />
            </div>
          )}

          {/* Product scope */}
          <div className="flex items-center gap-2 ms-auto flex-shrink-0">
            <FilterListOutlinedIcon sx={{ fontSize: 15, color: "#C9A84C" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1A1A2E]/40 hidden sm:block">
              {t.scopeLabel}
            </span>
            <div className="relative">
              <StorefrontOutlinedIcon
                sx={{
                  fontSize: 14,
                  color: "rgba(26,26,46,0.35)",
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  insetInlineStart: 10,
                  pointerEvents: "none",
                }}
              />
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="h-9 rounded-full border border-[#1A1A2E]/12 bg-white text-xs text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 transition-colors cursor-pointer max-w-[200px]"
                style={{ paddingInlineStart: 30, paddingInlineEnd: 12 }}
              >
                <option value="">{t.wholeStore}</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* KPI cards — 2 on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={<GroupsOutlinedIcon sx={{ fontSize: 20, color: "#C9A84C" }} />}
            label={t.totalVisits}
            desc={t.totalVisitsDesc}
            value={nf(overview?.totalVisits ?? 0)}
            accent="#C9A84C"
            loading={loading}
            isRTL={isRTL}
          />
          <KpiCard
            icon={<ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: "#1A1A2E" }} />}
            label={t.totalOrders}
            desc={t.totalOrdersDesc}
            value={nf(overview?.totalOrders ?? 0)}
            accent="#1A1A2E"
            loading={loading}
            isRTL={isRTL}
          />
          <KpiCard
            icon={<PercentOutlinedIcon sx={{ fontSize: 20, color: "#10B981" }} />}
            label={t.conversionRate}
            desc={t.conversionRateDesc}
            value={`${(overview?.conversionRate ?? 0).toFixed(1)}%`}
            accent="#10B981"
            loading={loading}
            isRTL={isRTL}
          />
          <KpiCard
            icon={<StarOutlineOutlinedIcon sx={{ fontSize: 20, color: "#E1306C" }} />}
            label={t.topSource}
            desc={t.topSourceDesc}
            value={overview?.topSource ? sourceName(overview.topSource) : "—"}
            accent="#E1306C"
            loading={loading}
            isRTL={isRTL}
          />
        </div>

        {/* Chart + Source breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">

          {/* Visits trend */}
          <div className="sl-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1A1A2E]/8 flex items-center gap-2">
              <InsightsOutlinedIcon sx={{ fontSize: 16, color: "#C9A84C" }} />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/45">
                {t.visitsTrend}
              </span>
            </div>
            <div className="px-5 pt-5 pb-4">
              {loading ? (
                <div className="h-36 animate-pulse bg-[#1A1A2E]/4 rounded-xl" />
              ) : (
                <BarChart
                  data={overview?.trend ?? []}
                  emptyLabel={t.visitsTrendEmpty}
                  isRTL={isRTL}
                />
              )}
            </div>
          </div>

          {/* Source breakdown — modern cards */}
          <div className="sl-card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#1A1A2E]/8 flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/45">
                {t.sourceBreakdown}
              </span>
              {!loading && sources.length > 0 && (
                <span className="text-[10px] text-[#1A1A2E]/35 font-medium">
                  {nf(overview?.totalVisits ?? 0)} {t.visits}
                </span>
              )}
            </div>

            {/* Source rows */}
            <div className="divide-y divide-[#1A1A2E]/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 animate-pulse space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#1A1A2E]/8" />
                        <div className="h-3 w-20 bg-[#1A1A2E]/8 rounded" />
                      </div>
                      <div className="h-3 w-12 bg-[#1A1A2E]/6 rounded" />
                    </div>
                    <div className="h-1.5 bg-[#1A1A2E]/6 rounded-full" />
                  </div>
                ))
              ) : sources.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <InsightsOutlinedIcon sx={{ fontSize: 28, color: "rgba(26,26,46,0.12)", display: "block", mx: "auto", mb: 1.5 }} />
                  <p className="text-sm text-[#1A1A2E]/30">{t.noSources}</p>
                </div>
              ) : (
                sources.map((s, idx) => {
                  const color = SOURCE_COLOR[s.source];
                  return (
                    <div key={s.source} className="px-5 py-3.5 space-y-2">
                      <div className={`flex items-center justify-between gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {/* Source name + rank */}
                        <div className={`flex items-center gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color, display: "block" }} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1A1A2E]">{sourceName(s.source)}</p>
                            {idx === 0 && (
                              <p className="text-[9px] font-semibold text-[#C9A84C] uppercase tracking-wide">
                                #{1} {t.topSource}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Visits + sparkline */}
                        <div className={`flex items-center gap-3 shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <div className={isRTL ? "text-left" : "text-right"}>
                            <p className="text-xs font-bold text-[#1A1A2E] tabular-nums">{nf(s.visits)}</p>
                            <p className="text-[9px] text-[#1A1A2E]/35">{s.percentage.toFixed(0)}%</p>
                          </div>
                          <Sparkline data={s.trend} color={color} />
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 bg-[#1A1A2E]/6 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${s.percentage}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
