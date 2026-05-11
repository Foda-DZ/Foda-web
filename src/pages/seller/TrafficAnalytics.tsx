import { useCallback, useEffect, useState } from "react";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import TabletOutlinedIcon from "@mui/icons-material/TabletOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Skeleton from "@mui/material/Skeleton";
import SellerLayout from "../../components/seller/SellerLayout";
import { t, getLanguage } from "../../utils/i18n";
import { sellerService } from "../../services/sellerService";

interface TrafficSummary {
  totalVisitors: number;
  totalPageViews: number;
  avgBounceRate: number;
  avgSessionDuration: number;
  totalConversions: number;
  totalRevenue: number;
  avgConversionRate: number;
}

interface TrafficBySource {
  source: "meta" | "whatsapp" | "direct" | "other";
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  percentage: number;
}

interface TrafficByDevice {
  device: "mobile" | "desktop" | "tablet";
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  percentage: number;
}

interface TrafficAnalyticsData {
  summary: TrafficSummary;
  bySource: TrafficBySource[];
  byDevice: TrafficByDevice[];
  trends: Array<{
    date: string;
    meta: number;
    whatsapp: number;
    direct: number;
    other: number;
  }>;
  timeRange: {
    startDate: string;
    endDate: string;
  };
}

type TrafficDatePreset = "today" | "yesterday" | "last_7d" | "last_30d" | "last_90d";

const DATE_PRESETS: Array<{ value: TrafficDatePreset }> = [
  { value: "today" },
  { value: "yesterday" },
  { value: "last_7d" },
  { value: "last_30d" },
  { value: "last_90d" },
];

function fmt(n: number) { return n.toLocaleString(); }
function fmtPct(n: number) { return `${n.toFixed(1)}%`; }
function fmtDur(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}m ${sec}s`;
}
function fmtRevenue(n: number) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} DZD`;
}

function SkeletonKPI() {
  return (
    <div className="bg-white border border-[#1A1A2E]/8 p-4 space-y-3 animate-pulse">
      <Skeleton variant="text" width={80} height={12} sx={{ borderRadius: 0 }} />
      <Skeleton variant="text" width={100} height={28} sx={{ borderRadius: 0 }} />
    </div>
  );
}

const SOURCE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  meta:      { label: "Meta",      color: "#1877F2", bg: "#eff6ff", border: "#bfdbfe", emoji: "📱" },
  whatsapp:  { label: "WhatsApp",  color: "#25D366", bg: "#f0fdf4", border: "#bbf7d0", emoji: "💬" },
  direct:    { label: "Direct",    color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", emoji: "🔗" },
  other:     { label: "Other",     color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", emoji: "🌐" },
};

const DEVICE_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  mobile:  { icon: <SmartphoneOutlinedIcon sx={{ fontSize: 15 }} />, color: "#3b82f6" },
  desktop: { icon: <ComputerOutlinedIcon sx={{ fontSize: 15 }} />, color: "#10b981" },
  tablet:  { icon: <TabletOutlinedIcon sx={{ fontSize: 15 }} />, color: "#f59e0b" },
};

export default function TrafficAnalytics() {
  const lang = getLanguage();
  const isRTL = lang === "ar";

  const [analytics, setAnalytics] = useState<TrafficAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [datePreset, setDatePreset] = useState<TrafficDatePreset>("last_7d");
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const filter =
        useCustomDate && customStartDate && customEndDate
          ? { startDate: customStartDate, endDate: customEndDate }
          : { datePreset };
      const data = await sellerService.getTrafficAnalytics(filter);
      setAnalytics(data.data);
      if (isRefresh) showToast("Traffic data refreshed successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load traffic analytics", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [datePreset, useCustomDate, customStartDate, customEndDate]);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  const summary = analytics?.summary;

  const kpiItems = summary ? [
    { label: t("traffic.metric.visitors", lang), value: fmt(summary.totalVisitors), icon: <PeopleOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#3b82f6" },
    { label: t("traffic.metric.pageViews", lang), value: fmt(summary.totalPageViews), icon: <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#06b6d4" },
    { label: t("traffic.metric.conversions", lang), value: fmt(summary.totalConversions), icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#10b981" },
    { label: t("traffic.metric.revenue", lang), value: fmtRevenue(summary.totalRevenue), icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#10b981" },
    { label: t("traffic.metric.bounceRate", lang), value: fmtPct(summary.avgBounceRate), icon: <TrendingDownOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#f59e0b" },
    { label: t("traffic.metric.conversionRate", lang), value: fmtPct(summary.avgConversionRate), icon: <TrendingUpOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#10b981" },
    { label: t("traffic.metric.avgSessionDuration", lang), value: fmtDur(summary.avgSessionDuration), icon: <AnalyticsOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#6366f1" },
  ] : [];

  return (
    <SellerLayout>
      <div className="p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">{t("traffic.title", lang)}</h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-0.5 max-w-lg">{t("traffic.subtitle", lang)}</p>
          </div>
          <button
            onClick={() => void loadAnalytics(true)}
            disabled={refreshing}
            className="h-9 px-4 flex items-center gap-2 border border-[#1A1A2E]/15 text-xs font-semibold text-[#1A1A2E]/70 hover:border-[#1A1A2E]/30 transition-colors disabled:opacity-50"
          >
            {refreshing
              ? <span className="w-3 h-3 border-2 border-[#1A1A2E]/40 border-t-transparent rounded-full animate-spin" />
              : <RefreshOutlinedIcon sx={{ fontSize: 14 }} />}
            {t("common.refresh", lang)}
          </button>
        </div>

        {/* Date Range */}
        <div className="bg-white border border-[#1A1A2E]/8">
          <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
              {t("traffic.dateRange.label", lang)}
            </span>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {DATE_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => { setDatePreset(p.value); setUseCustomDate(false); }}
                  className={`h-7 px-3 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                    datePreset === p.value && !useCustomDate
                      ? "gold-gradient text-[#1A1A2E]"
                      : "border border-[#1A1A2E]/15 text-[#1A1A2E]/50 hover:border-[#1A1A2E]/30"
                  }`}
                >
                  {t(`traffic.dateRange.${p.value}`, lang)}
                </button>
              ))}
              <button
                onClick={() => setUseCustomDate(true)}
                className={`h-7 px-3 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                  useCustomDate
                    ? "gold-gradient text-[#1A1A2E]"
                    : "border border-[#1A1A2E]/15 text-[#1A1A2E]/50 hover:border-[#1A1A2E]/30"
                }`}
              >
                {t("traffic.dateRange.custom", lang)}
              </button>
            </div>
            {useCustomDate && (
              <div className="flex flex-wrap gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A2E]/40">
                    {t("traffic.dateRange.startDate", lang)}
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="h-8 px-3 border border-[#1A1A2E]/15 bg-white text-xs text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A2E]/40">
                    {t("traffic.dateRange.endDate", lang)}
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="h-8 px-3 border border-[#1A1A2E]/15 bg-white text-xs text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => <SkeletonKPI key={i} />)
            : kpiItems.map((kpi) => (
              <div key={kpi.label} className="bg-white border border-[#1A1A2E]/8 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/45 leading-tight">
                    {kpi.label}
                  </span>
                  <span style={{ color: kpi.accent }}>{kpi.icon}</span>
                </div>
                <p className="text-xl font-bold text-[#1A1A2E]">{kpi.value}</p>
              </div>
            ))}
        </div>

        {analytics && (
          <>
            {/* Traffic by Source */}
            <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center gap-2">
                <AnalyticsOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                  {t("traffic.bySource.title", lang)}
                </span>
              </div>
              {analytics.bySource.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-[#1A1A2E]/40 text-sm">No traffic source data available for this period.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1A1A2E]/8">
                      {[
                        t("traffic.bySource.source", lang),
                        t("traffic.metric.visitors", lang),
                        t("traffic.metric.conversionRate", lang),
                        t("traffic.metric.revenue", lang),
                        t("traffic.metric.percentage", lang),
                      ].map((h) => (
                        <th key={h} className="px-4 py-3 text-start text-[10px] font-bold tracking-[0.15em] uppercase text-[#1A1A2E]/40">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.bySource.map((src) => {
                      const cfg = SOURCE_CONFIG[src.source] ?? SOURCE_CONFIG.other;
                      return (
                        <tr key={src.source} className="border-b border-[#1A1A2E]/5 last:border-0 hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold">
                                {cfg.emoji} {cfg.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs font-semibold text-[#1A1A2E]">{fmt(src.visitors)}</td>
                          <td className="px-4 py-3 text-xs text-[#1A1A2E]">{fmtPct(src.conversionRate)}</td>
                          <td className="px-4 py-3 text-xs text-[#1A1A2E]">{fmtRevenue(src.revenue)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-[#1A1A2E]/8 overflow-hidden">
                                <div
                                  className="h-full transition-all duration-500"
                                  style={{ width: `${src.percentage}%`, background: cfg.color }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-[#1A1A2E]/60 w-10 text-right">
                                {fmtPct(src.percentage)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Device Distribution */}
            <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center gap-2">
                <ComputerOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                  {t("traffic.byDevice.title", lang)}
                </span>
              </div>
              <div className="p-5 space-y-5">
                {analytics.byDevice.length === 0 ? (
                  <p className="text-[#1A1A2E]/40 text-sm text-center py-8">No device data available.</p>
                ) : (
                  analytics.byDevice.map((dev) => {
                    const cfg = DEVICE_CONFIG[dev.device] ?? DEVICE_CONFIG.desktop;
                    return (
                      <div key={dev.device} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2" style={{ color: cfg.color }}>
                            {cfg.icon}
                            <span className="text-xs font-semibold text-[#1A1A2E] capitalize">
                              {t(`traffic.device.${dev.device}`, lang)}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#1A1A2E]/50">
                            {fmtPct(dev.percentage)} ({fmt(dev.visitors)} {t("traffic.metric.visitors", lang)})
                          </span>
                        </div>
                        <div className="h-2 bg-[#1A1A2E]/8 overflow-hidden">
                          <div
                            className="h-full transition-all duration-700"
                            style={{ width: `${dev.percentage}%`, background: cfg.color }}
                          />
                        </div>
                        <div className="flex gap-4 text-[10px] text-[#1A1A2E]/45">
                          <span>CR: {fmtPct(dev.conversionRate)}</span>
                          <span>Bounce: {fmtPct(dev.bounceRate)}</span>
                          <span>Session: {fmtDur(dev.avgSessionDuration)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Trends Table */}
            {analytics.trends.length > 0 && (
              <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center gap-2">
                  <TrendingUpOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                    {t("traffic.trends.title", lang)}
                  </span>
                  <span className="ms-auto text-[10px] text-[#1A1A2E]/35">Last 14 days</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1A1A2E]/8">
                        {[t("traffic.trends.date", lang), "📱 Meta", "💬 WhatsApp", "🔗 Direct", "🌐 Other"].map((h) => (
                          <th key={h} className="px-4 py-3 text-start text-[10px] font-bold tracking-[0.15em] uppercase text-[#1A1A2E]/40">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.trends.slice(-14).map((trend) => (
                        <tr key={trend.date} className="border-b border-[#1A1A2E]/5 last:border-0 hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="px-4 py-3 text-xs font-medium text-[#1A1A2E]">{trend.date}</td>
                          <td className="px-4 py-3 text-xs text-[#1A1A2E]/70">{fmt(trend.meta)}</td>
                          <td className="px-4 py-3 text-xs text-[#1A1A2E]/70">{fmt(trend.whatsapp)}</td>
                          <td className="px-4 py-3 text-xs text-[#1A1A2E]/70">{fmt(trend.direct)}</td>
                          <td className="px-4 py-3 text-xs text-[#1A1A2E]/70">{fmt(trend.other)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 shadow-lg text-sm font-medium ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success"
            ? <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
            : <ErrorOutlineOutlinedIcon sx={{ fontSize: 16 }} />}
          {toast.msg}
        </div>
      )}
    </SellerLayout>
  );
}
