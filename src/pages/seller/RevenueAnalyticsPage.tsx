import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";
import { useSellerContext } from "../../context/SellerContext";

type Analytics = Awaited<ReturnType<typeof sellerService.getRevenueAnalytics>>;

// ── Status badge config ────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { cls: string; dot: string }> = {
  pending:   { cls: "bg-amber-50   text-amber-700  border-amber-200",  dot: "bg-amber-400"  },
  confirmed: { cls: "bg-blue-50    text-blue-700   border-blue-200",   dot: "bg-blue-400"   },
  shipped:   { cls: "bg-indigo-50  text-indigo-700 border-indigo-200", dot: "bg-indigo-400" },
  delivered: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  cancelled: { cls: "bg-red-50     text-red-600    border-red-200",    dot: "bg-red-400"    },
};

// ── Modern bar chart ───────────────────────────────────────────────────────────
function BarChart({
  data,
  emptyLabel,
  dzd,
  isRTL,
}: {
  data: { _id: string; revenue: number; orders: number }[];
  emptyLabel: string;
  dzd: string;
  isRTL: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const HEIGHT = 130;
  const BAR_W = 12;
  const GAP = 5;
  const GRID_LINES = 4;
  const max = useMemo(() => Math.max(...data.map((d) => d.revenue), 1), [data]);
  const latestId = data.length > 0 ? data[data.length - 1]._id : null;

  if (data.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-[#1A1A2E]/30 text-sm">
        {emptyLabel}
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
        {Array.from({ length: GRID_LINES }).map((_, gi) => {
          const y = (HEIGHT / GRID_LINES) * gi;
          return (
            <line
              key={gi}
              x1={0} y1={y} x2={svgW} y2={y}
              stroke="#1A1A2E10"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
          );
        })}

        {/* Bars */}
        {displayed.map((d, i) => {
          const barH = Math.max(3, (d.revenue / max) * HEIGHT);
          const x = i * (BAR_W + GAP);
          const y = HEIGHT - barH;
          const isLatest = d._id === latestId;
          const isHov = hovered === i;
          const fill = isLatest
            ? "#C9A84C"
            : isHov
              ? "#C9A84C80"
              : "#C9A84C30";

          return (
            <g
              key={d._id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={x}
                y={y}
                width={BAR_W}
                height={barH}
                fill={fill}
                rx={3}
                style={{ transition: "fill 0.15s" }}
              />
              {/* Hover tooltip */}
              {isHov && (
                <g>
                  <rect
                    x={Math.min(x - 20, svgW - 80)}
                    y={Math.max(y - 28, 2)}
                    width={78}
                    height={22}
                    rx={4}
                    fill="#1A1A2E"
                    opacity={0.88}
                  />
                  <text
                    x={Math.min(x - 20, svgW - 80) + 39}
                    y={Math.max(y - 28, 2) + 14}
                    textAnchor="middle"
                    fontSize={8.5}
                    fill="#fff"
                  >
                    {d.revenue.toLocaleString()} {dzd}
                  </text>
                </g>
              )}
              {/* Date label every 7 bars */}
              {i % 7 === 0 && (
                <text
                  x={x + BAR_W / 2}
                  y={HEIGHT + 17}
                  textAnchor="middle"
                  fontSize={7}
                  fill="#1A1A2E50"
                >
                  {d._id.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── KPI Card ───────────────────────────────────────────────────────────────────
function KpiCard({
  icon,
  label,
  desc,
  value,
  count,
  ordersLabel,
  dzd,
  accent,
  loading,
  isRTL,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  value: number;
  count: number;
  ordersLabel: string;
  dzd: string;
  accent: string;
  loading: boolean;
  isRTL: boolean;
}) {
  return (
    <div className="sl-card sl-card-hover p-5 relative overflow-hidden">
      {/* Top accent line */}
      <span
        className="absolute inset-x-0 top-0 h-1 rounded-b-full"
        style={{ background: accent }}
      />
      <div className="space-y-3.5">
        {/* Icon + label row — respects RTL */}
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
          <div className="space-y-2 animate-pulse">
            <div className="h-8 w-32 bg-[#1A1A2E]/8 rounded-lg" />
            <div className="h-3 w-20 bg-[#1A1A2E]/5 rounded" />
          </div>
        ) : (
          <div className={isRTL ? "text-right" : "text-left"}>
            <p className="font-display text-[1.75rem] font-bold text-[#1A1A2E] tabular-nums leading-none">
              {value.toLocaleString()}{" "}
              <span className="text-sm font-normal text-[#1A1A2E]/40">{dzd}</span>
            </p>
            <p className="text-xs text-[#1A1A2E]/40 mt-1.5">
              {count} {ordersLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Order row skeleton ─────────────────────────────────────────────────────────
function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-4 animate-pulse">
      <div className="w-14 h-3 bg-[#1A1A2E]/8 rounded" />
      <div className="flex-1 h-3 bg-[#1A1A2E]/6 rounded" />
      <div className="w-14 h-5 bg-[#1A1A2E]/8 rounded-full" />
      <div className="w-20 h-3 bg-[#1A1A2E]/6 rounded" />
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function RevenueAnalyticsPage() {
  const { tr, isRTL } = useLang();
  const t = tr.seller.revenueAnalyticsPage;
  const navigate = useNavigate();
  const { allOrders, reload: reloadOrders } = useSellerContext();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    sellerService
      .getRevenueAnalytics()
      .then((data) => setAnalytics(data))
      .catch((err) => setError(err?.message || t.error))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { fetchAnalytics(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => { fetchAnalytics(true); reloadOrders(); };

  // Compute live KPI stats from allOrders as the source of truth
  const liveStats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const delivered = allOrders.filter((o) => o.status === "delivered");
    const pending   = allOrders.filter((o) => o.status === "pending");
    const confirmed = allOrders.filter((o) => o.status === "confirmed");
    const shipped   = allOrders.filter((o) => o.status === "shipped");
    const thisMonth = allOrders.filter((o) => new Date(o.createdAt) >= monthStart);

    const sum = (orders: typeof allOrders) =>
      orders.reduce((s, o) => s + o.totalAmount, 0);

    // "Available" = delivered revenue (paid out)
    // "Pending"   = pending + confirmed + shipped (in-flight)
    const inFlight = [...pending, ...confirmed, ...shipped];

    return {
      totalRevenue:  { value: sum(allOrders.filter(o => o.status !== "cancelled")), count: allOrders.filter(o => o.status !== "cancelled").length },
      pendingRevenue:{ value: sum(inFlight),  count: inFlight.length },
      available:     { value: sum(delivered), count: delivered.length },
      thisMonth:     { value: sum(thisMonth), count: thisMonth.length },
    };
  }, [allOrders]);

  const trend = useMemo(() => {
    const daily = analytics?.daily ?? [];
    if (daily.length < 6) return null;
    const half = Math.floor(daily.length / 2);
    const recent = daily.slice(-half).reduce((s, d) => s + d.revenue, 0);
    const past = daily.slice(0, half).reduce((s, d) => s + d.revenue, 0);
    if (past === 0) return null;
    return ((recent - past) / past) * 100;
  }, [analytics?.daily]);

  const kpis = [
    {
      icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 20, color: "#1A1A2E" }} />,
      label: t.totalRevenue,
      desc: t.totalRevenueDesc,
      value: liveStats.totalRevenue.value,
      count: liveStats.totalRevenue.count,
      accent: "#1A1A2E",
    },
    {
      icon: <HourglassEmptyOutlinedIcon sx={{ fontSize: 20, color: "#F59E0B" }} />,
      label: t.pendingRevenue,
      desc: t.pendingRevenueDesc,
      value: liveStats.pendingRevenue.value,
      count: liveStats.pendingRevenue.count,
      accent: "#F59E0B",
    },
    {
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 20, color: "#10B981" }} />,
      label: t.available,
      desc: t.availableDesc,
      value: liveStats.available.value,
      count: liveStats.available.count,
      accent: "#10B981",
    },
    {
      icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: "#C9A84C" }} />,
      label: t.thisMonth,
      desc: t.thisMonthDesc,
      value: liveStats.thisMonth.value,
      count: liveStats.thisMonth.count,
      accent: "#C9A84C",
    },
  ];

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(isRTL ? "ar-DZ" : "en-GB", {
      day: "numeric",
      month: "short",
    }).format(new Date(iso));

  const ViewAllIcon = isRTL ? ArrowBackIcon : ArrowForwardIcon;

  return (
    <SellerLayout>
      <div className="p-6 sm:p-8 lg:p-10 space-y-6" dir={isRTL ? "rtl" : "ltr"}>

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 sl-rise">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sl-icon-tile-gold flex items-center justify-center shrink-0">
              <TrendingUpOutlinedIcon sx={{ fontSize: 24, color: "#C9A84C" }} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                {t.title}
              </h1>
              <p className="text-[#1A1A2E]/50 text-sm mt-0.5">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[#1A1A2E]/10 bg-white text-[#1A1A2E]/50 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] disabled:opacity-40 transition-all duration-200"
            title={isRTL ? "تحديث" : "Refresh"}
          >
            <RefreshOutlinedIcon
              sx={{ fontSize: 18, ...(refreshing && { animation: "spin 1s linear infinite" }) }}
            />
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* KPI Cards — single row on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <KpiCard
              key={k.label}
              icon={k.icon}
              label={k.label}
              desc={k.desc}
              value={k.value}
              count={k.count}
              ordersLabel={t.orders}
              dzd={t.dzd}
              accent={k.accent}
              loading={false}
              isRTL={isRTL}
            />
          ))}
        </div>

        {/* Chart + Recent orders */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">

          {/* Bar chart panel */}
          <div className="sl-card overflow-hidden">
            {/* Chart header */}
            <div className="px-5 py-4 border-b border-[#1A1A2E]/8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TrendingUpOutlinedIcon sx={{ fontSize: 16, color: "#C9A84C" }} />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                  {t.chartTitle}
                </span>
              </div>
              {/* Trend badge with MUI icon */}
              {!loading && trend !== null && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    trend >= 0
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-red-600 bg-red-50 border-red-200"
                  }`}
                >
                  {trend >= 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 13 }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 13 }} />
                  )}
                  {Math.abs(trend).toFixed(1)}% {t.trendVsPrev}
                </span>
              )}
            </div>

            {/* Chart body */}
            <div className="px-5 pt-5 pb-2">
              {loading ? (
                <div className="h-36 animate-pulse bg-[#1A1A2E]/4 rounded-xl" />
              ) : (
                <BarChart
                  data={analytics?.daily ?? []}
                  emptyLabel={t.chartEmpty}
                  dzd={t.dzd}
                  isRTL={isRTL}
                />
              )}
            </div>

            {/* Chart legend — translated */}
            {!loading && (analytics?.daily.length ?? 0) > 0 && (
              <div className={`px-5 pb-4 flex items-center gap-5 text-[11px] text-[#1A1A2E]/45 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm inline-block bg-[#C9A84C]" />
                  {t.legendRecent}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm inline-block bg-[#C9A84C30]" />
                  {t.legendEarlier}
                </span>
              </div>
            )}
          </div>

          {/* Recent orders panel */}
          <div className="sl-card overflow-hidden flex flex-col">
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-[#1A1A2E]/8 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <ReceiptLongOutlinedIcon sx={{ fontSize: 16, color: "#C9A84C" }} />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                  {t.recentOrders}
                </span>
              </div>
              <button
                onClick={() => navigate("/seller/orders")}
                className="text-[11px] font-semibold text-[#C9A84C] hover:text-[#A07830] inline-flex items-center gap-1 transition-colors"
              >
                {t.viewAll}
                <ViewAllIcon sx={{ fontSize: 12 }} />
              </button>
            </div>

            {/* Column headers */}
            {!loading && (analytics?.recentOrders?.length ?? 0) > 0 && (
              <div className={`px-5 py-2 bg-[#FBF9F5] grid grid-cols-[auto_1fr_auto_auto] gap-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#1A1A2E]/35 ${isRTL ? "text-right" : "text-left"}`}>
                <span>{t.orderIdLabel}</span>
                <span>{t.locationLabel}</span>
                <span className="text-end">{t.amountLabel}</span>
                <span></span>
              </div>
            )}

            {/* Rows */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#1A1A2E]/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <OrderRowSkeleton key={i} />)
              ) : !analytics?.recentOrders?.length ? (
                <div className="px-5 py-12 text-center">
                  <ReceiptLongOutlinedIcon sx={{ fontSize: 28, color: "rgba(26,26,46,0.12)", display: "block", mx: "auto", mb: 1.5 }} />
                  <p className="text-sm text-[#1A1A2E]/30">{t.noRecentOrders}</p>
                </div>
              ) : (
                analytics.recentOrders.map((order) => {
                  const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
                  return (
                    <div
                      key={order._id}
                      className={`grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center px-5 py-3.5 hover:bg-[#FBF9F5] transition-colors`}
                    >
                      {/* Order ID */}
                      <span className="font-mono text-[10px] text-[#C9A84C] font-bold">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>

                      {/* Location */}
                      <span className="flex items-center gap-1 text-xs text-[#1A1A2E]/55 truncate min-w-0">
                        <PlaceOutlinedIcon sx={{ fontSize: 12, color: "#C9A84C", flexShrink: 0 }} />
                        <span className="truncate">{order.shippingDetails?.wilaya ?? "—"}</span>
                      </span>

                      {/* Amount */}
                      <span className="text-xs font-bold text-[#1A1A2E] tabular-nums whitespace-nowrap">
                        {order.totalAmount.toLocaleString()}
                        <span className="text-[9px] font-normal text-[#1A1A2E]/35 ms-1">{t.dzd}</span>
                      </span>

                      {/* Status pill */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border whitespace-nowrap ${st.cls}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {t.statusLabels[order.status as keyof typeof t.statusLabels] ?? order.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer: date range of shown orders */}
            {!loading && (analytics?.recentOrders?.length ?? 0) > 1 && (
              <div className="px-5 py-3 border-t border-[#1A1A2E]/6 bg-[#FBF9F5] shrink-0">
                <p className="text-[10px] text-[#1A1A2E]/35">
                  {formatDate(analytics!.recentOrders[analytics!.recentOrders.length - 1].createdAt)}
                  {" — "}
                  {formatDate(analytics!.recentOrders[0].createdAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
