import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";

type Analytics = Awaited<ReturnType<typeof sellerService.getRevenueAnalytics>>;

// ── Status badge colours ───────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-50   text-amber-700   border-amber-200",
  confirmed: "bg-blue-50    text-blue-700    border-blue-200",
  shipped:   "bg-indigo-50  text-indigo-700  border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50     text-red-600     border-red-200",
};

// ── Tiny SVG bar chart (no external dependency) ───────────────────────────────
function BarChart({
  data,
  emptyLabel,
  isRTL,
}: {
  data: { _id: string; revenue: number; orders: number }[];
  emptyLabel: string;
  isRTL: boolean;
}) {
  const HEIGHT = 120;
  const BAR_W = 10;
  const GAP = 4;
  const max = useMemo(() => Math.max(...data.map((d) => d.revenue), 1), [data]);
  // data is sorted ascending — last element is always the most recent day
  const latestId = useMemo(() => (data.length > 0 ? data[data.length - 1]._id : null), [data]);

  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-charcoal/30 text-sm">
        {emptyLabel}
      </div>
    );
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
          const barH = Math.max(2, (d.revenue / max) * HEIGHT);
          const x = i * (BAR_W + GAP);
          const y = HEIGHT - barH;
          // compare by date string — works correctly in both LTR and RTL
          const isLatest = d._id === latestId;
          const fill = isLatest ? "#C9A84C" : "#C9A84C40";
          return (
            <g key={d._id}>
              <rect x={x} y={y} width={BAR_W} height={barH} fill={fill} rx={1} />
              {i % 5 === 0 && (
                <text
                  x={x + BAR_W / 2}
                  y={HEIGHT + 14}
                  textAnchor="middle"
                  fontSize={7}
                  fill="#1A1A2E60"
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

// ── KPI card ──────────────────────────────────────────────────────────────────
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
}) {
  return (
    <div
      className="bg-white border-t-2 border-charcoal/8 overflow-hidden"
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
            <div className="h-7 w-32 bg-charcoal/8 rounded" />
            <div className="h-3 w-20 bg-charcoal/6 rounded" />
          </div>
        ) : (
          <>
            <p className="font-display text-2xl font-bold text-charcoal tabular-nums">
              {value.toLocaleString()}{" "}
              <span className="text-sm font-normal text-charcoal/40">{dzd}</span>
            </p>
            <p className="text-xs text-charcoal/40">
              {count} {ordersLabel}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Skeleton rows for recent orders panel ─────────────────────────────────────
function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
      <div className="w-16 h-3 bg-charcoal/8 rounded" />
      <div className="flex-1 h-3 bg-charcoal/6 rounded" />
      <div className="w-12 h-5 bg-charcoal/8 rounded" />
      <div className="w-20 h-3 bg-charcoal/6 rounded" />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RevenueAnalyticsPage() {
  const { tr, isRTL } = useLang();
  const t = tr.seller.revenueAnalyticsPage;
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    sellerService
      .getRevenueAnalytics()
      .then((data) => { if (!cancelled) setAnalytics(data); })
      .catch((err) => { if (!cancelled) setError(err?.message || t.error); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [t.error]);

  // Trend: compare revenue of the second half of the daily window vs the first half
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
      icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18, color: "#1A1A2E" }} />,
      label: t.totalRevenue,
      desc: t.totalRevenueDesc,
      value: analytics?.totalRevenue?.value ?? 0,
      count: analytics?.totalRevenue?.count ?? 0,
      accent: "#1A1A2E",
    },
    {
      icon: <HourglassEmptyOutlinedIcon sx={{ fontSize: 18, color: "#F59E0B" }} />,
      label: t.pendingRevenue,
      desc: t.pendingRevenueDesc,
      value: analytics?.pendingRevenue?.value ?? 0,
      count: analytics?.pendingRevenue?.count ?? 0,
      accent: "#F59E0B",
    },
    {
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />,
      label: t.available,
      desc: t.availableDesc,
      value: analytics?.available?.value ?? 0,
      count: analytics?.available?.count ?? 0,
      accent: "#10B981",
    },
    {
      icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: "#C9A84C" }} />,
      label: t.thisMonth,
      desc: t.thisMonthDesc,
      value: analytics?.thisMonth?.value ?? 0,
      count: analytics?.thisMonth?.count ?? 0,
      accent: "#C9A84C",
    },
  ];

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(isRTL ? "ar-DZ" : "en-GB", {
      day: "numeric",
      month: "short",
    }).format(new Date(iso));

  return (
    <SellerLayout>
      <div className="p-6 md:p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUpOutlinedIcon sx={{ fontSize: 20, color: "#C9A84C" }} />
              <h1 className="font-display text-2xl font-bold text-charcoal">
                {t.title}
              </h1>
            </div>
            <p className="text-charcoal/50 text-sm">{t.subtitle}</p>
          </div>
        </div>

        {/* ── Error banner ────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 18 }} />
            {error}
          </div>
        )}

        {/* ── KPI cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
              loading={loading}
            />
          ))}
        </div>

        {/* ── Chart + Recent orders ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">

          {/* Bar chart panel */}
          <div className="bg-white border border-charcoal/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-charcoal/8 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUpOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-charcoal/40">
                  {t.chartTitle}
                </span>
              </div>
              {!loading && trend !== null && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 ${
                    trend >= 0
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : "text-red-600 bg-red-50 border border-red-200"
                  }`}
                >
                  {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
                </span>
              )}
            </div>
            <div className="px-5 pt-4 pb-3">
              {loading ? (
                <div className="h-36 animate-pulse bg-charcoal/4 rounded" />
              ) : (
                <BarChart
                  data={analytics?.daily ?? []}
                  emptyLabel={t.chartEmpty}
                  isRTL={isRTL}
                />
              )}
            </div>

            {/* Chart legend */}
            {!loading && (analytics?.daily.length ?? 0) > 0 && (
              <div className="px-5 pb-4 flex items-center gap-4 text-[10px] text-charcoal/40">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 inline-block bg-gold" />
                  {isRTL ? "أحدث يوم" : "Most recent"}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 inline-block bg-[#C9A84C40]" />
                  {isRTL ? "أيام سابقة" : "Earlier days"}
                </span>
              </div>
            )}
          </div>

          {/* Recent orders panel */}
          <div className="bg-white border border-charcoal/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-charcoal/8 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ReceiptLongOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-charcoal/40">
                  {t.recentOrders}
                </span>
              </div>
              <button
                onClick={() => navigate("/seller/orders")}
                className="text-[10px] font-semibold text-gold hover:underline"
              >
                {t.viewAll}
              </button>
            </div>

            <div className="divide-y divide-charcoal/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <OrderRowSkeleton key={i} />)
              ) : !analytics?.recentOrders?.length ? (
                <div className="px-5 py-10 text-center text-sm text-charcoal/30">
                  {t.noRecentOrders}
                </div>
              ) : (
                analytics.recentOrders.map((order) => {
                  const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
                  return (
                    <div
                      key={order._id}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-cream/60 transition-colors cursor-default"
                    >
                      {/* Short order ID */}
                      <span className="text-[10px] font-mono text-charcoal/30 shrink-0 w-12 truncate">
                        #{order._id.slice(-5).toUpperCase()}
                      </span>

                      {/* Wilaya */}
                      <span className="flex-1 text-xs text-charcoal/60 truncate">
                        {order.shippingDetails?.wilaya ?? "—"}
                      </span>

                      {/* Status pill */}
                      <span
                        className={`shrink-0 inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${statusStyle}`}
                      >
                        {t.statusLabels[order.status as keyof typeof t.statusLabels] ?? order.status}
                      </span>

                      {/* Amount */}
                      <span className="shrink-0 text-xs font-semibold text-charcoal tabular-nums">
                        {order.totalAmount.toLocaleString()}{" "}
                        <span className="text-[9px] text-charcoal/35">{t.dzd}</span>
                      </span>

                      {/* Date */}
                      <span className="shrink-0 text-[10px] text-charcoal/30">
                        {formatDate(order.createdAt)}
                      </span>
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
