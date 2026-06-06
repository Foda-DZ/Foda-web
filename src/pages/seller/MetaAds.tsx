import { useCallback, useEffect, useMemo, useState } from "react";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Skeleton from "@mui/material/Skeleton";
import SellerLayout from "../../components/seller/SellerLayout";
import { t, getLanguage } from "../../utils/i18n";
import {
  sellerService,
  type MetaDashboardResponse,
  type MetaDatePreset,
  type MetaEventsResponse,
  type MetaRangeFilter,
} from "../../services/sellerService";

const DATE_PRESETS: Array<{ label: string; value: MetaDatePreset }> = [
  { label: "today", value: "today" },
  { label: "yesterday", value: "yesterday" },
  { label: "last_7d", value: "last_7d" },
  { label: "last_30d", value: "last_30d" },
];

function formatMoney(value: number, currency?: string | null) {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency || "USD"}`;
}

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  loading?: boolean;
}

function KPICard({ label, value, icon, accent, loading }: KPICardProps) {
  const isRTL = getLanguage() === "ar";
  return (
    <div className="sl-card sl-card-hover p-5 space-y-3 relative overflow-hidden">
      <span className="absolute inset-x-0 top-0 h-0.5 rounded-b-full" style={{ background: accent }} />
      <div className={`flex items-start gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="w-10 h-10 sl-chip flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}1f` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
        <p className={`sl-eyebrow leading-snug flex-1 ${isRTL ? "text-right" : "text-left"}`}>{label}</p>
      </div>
      {loading ? (
        <Skeleton variant="rounded" width={100} height={28} sx={{ borderRadius: "0.5rem" }} />
      ) : (
        <p className={`font-display text-2xl font-bold text-[#1A1A2E] ${isRTL ? "text-right" : "text-left"}`}>{value}</p>
      )}
    </div>
  );
}

function SkeletonKPI() {
  return (
    <div className="sl-card p-5 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: "0.75rem" }} />
        <Skeleton variant="text" width={80} height={12} />
      </div>
      <Skeleton variant="rounded" width={100} height={28} sx={{ borderRadius: "0.5rem" }} />
    </div>
  );
}

export default function MetaAdsPage() {
  const lang = getLanguage();
  const isRTL = lang === "ar";

  const [dashboard, setDashboard] = useState<MetaDashboardResponse | null>(null);
  const [events, setEvents] = useState<MetaEventsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [datePreset, setDatePreset] = useState<MetaDatePreset>("last_7d");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const rangeParams: MetaRangeFilter = useMemo(() => {
    if (useCustomRange && startDate && endDate) return { startDate, endDate };
    return { datePreset };
  }, [datePreset, endDate, startDate, useCustomRange]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [metaDashboard, metaEvents] = await Promise.all([
        sellerService.getMetaAdsDashboard(rangeParams),
        sellerService.getMetaAdsEvents(rangeParams),
      ]);
      setDashboard(metaDashboard);
      setEvents(metaEvents);
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("meta.message.syncError", lang), "error");
    } finally {
      setLoading(false);
    }
  }, [rangeParams, lang]);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const startOAuthFlow = async () => {
    try {
      const { authUrl } = await sellerService.startMetaAdsOAuth();
      window.location.href = authUrl;
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("meta.message.oauthError", lang), "error");
    }
  };

  const disconnect = async () => {
    setConfirmDisconnect(false);
    try {
      await sellerService.disconnectMetaAds();
      showToast(t("meta.message.disconnectSuccess", lang), "success");
      setDashboard(null);
      setEvents(null);
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("meta.message.disconnectError", lang), "error");
    }
  };

  const syncNow = async () => {
    setSyncing(true);
    try {
      const synced = await sellerService.syncMetaAds(rangeParams);
      setDashboard(synced);
      const metaEvents = await sellerService.getMetaAdsEvents(rangeParams);
      setEvents(metaEvents);
      showToast(t("meta.message.syncSuccess", lang), "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : t("meta.message.syncError", lang), "error");
    } finally {
      setSyncing(false);
    }
  };

  const sendTestEvent = async () => {
    setTesting(true);
    try {
      await sellerService.sendTestMetaAdsEvent();
      showToast(t("meta.message.testEventSent", lang), "success");
      const metaEvents = await sellerService.getMetaAdsEvents(rangeParams);
      setEvents(metaEvents);
    } catch (e) {
      const msg = e instanceof Error ? e.message : t("meta.message.testEventError", lang);
      const hint = msg.includes("pixel") || msg.includes("access token")
        ? `${msg} â€” ${t("meta.message.pixelConfigHint", lang)}`
        : msg;
      showToast(hint, "error");
    } finally {
      setTesting(false);
    }
  };

  const kpis = dashboard?.kpis;
  const connected = dashboard?.metaAds?.isConnected;

  const kpiItems = [
    { label: t("meta.kpi.spend", lang), value: kpis ? formatMoney(kpis.spend, kpis.currency) : "â€”", icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#ef4444" },
    { label: t("meta.kpi.roas", lang), value: kpis ? kpis.roas.toFixed(2) : "â€”", icon: <TrendingUpOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#10b981" },
    { label: t("meta.kpi.conversions", lang), value: kpis ? kpis.conversions.toLocaleString() : "â€”", icon: <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#10b981" },
    { label: t("meta.kpi.purchases", lang), value: kpis ? kpis.purchases.toLocaleString() : "â€”", icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#3b82f6" },
    { label: t("meta.kpi.impressions", lang), value: kpis ? kpis.impressions.toLocaleString() : "â€”", icon: <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#06b6d4" },
    { label: t("meta.kpi.reach", lang), value: kpis ? kpis.reach.toLocaleString() : "â€”", icon: <PeopleOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#f59e0b" },
    { label: t("meta.kpi.ctr", lang), value: kpis ? `${kpis.ctr.toFixed(2)}%` : "â€”", icon: <TouchAppOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#3b82f6" },
    { label: t("meta.kpi.cpc", lang), value: kpis ? formatMoney(kpis.cpc, kpis.currency) : "â€”", icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 16 }} />, accent: "#f59e0b" },
  ];

  return (
    <SellerLayout>
      <div className="p-6 sm:p-8 lg:p-10 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className={`flex items-start justify-between flex-wrap gap-4 sl-rise`}>
          <div className={`flex items-center gap-3.5`}>
            <div className="w-12 h-12 sl-icon-tile-gold flex items-center justify-center shrink-0">
              <AdsClickOutlinedIcon sx={{ fontSize: 24, color: "#C9A84C" }} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">{t("meta.title", lang)}</h1>
              <p className="text-[#1A1A2E]/50 text-sm mt-0.5 max-w-lg">{t("meta.subtitle", lang)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => void loadDashboard()}
              disabled={loading}
              className="h-10 px-4 rounded-full flex items-center gap-2 border border-[#1A1A2E]/12 bg-white text-xs font-semibold text-[#1A1A2E]/70 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors disabled:opacity-50"
            >
              <RefreshOutlinedIcon sx={{ fontSize: 14 }} />
              {t("meta.btn.refresh", lang)}
            </button>
            {connected ? (
              <>
                <button
                  onClick={() => void syncNow()}
                  disabled={syncing}
                  className="h-10 px-4 rounded-full flex items-center gap-2 bg-[#1A1A2E] text-white text-xs font-bold hover:bg-[#2d2d50] transition-colors disabled:opacity-60"
                >
                  {syncing
                    ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <SyncOutlinedIcon sx={{ fontSize: 14 }} />}
                  {syncing ? t("meta.btn.syncing", lang) : t("meta.btn.syncNow", lang)}
                </button>
                <button
                  onClick={() => void sendTestEvent()}
                  disabled={testing}
                  className="h-10 px-4 rounded-full flex items-center gap-2 border border-amber-400 text-amber-700 text-xs font-semibold hover:bg-amber-50 transition-colors disabled:opacity-50"
                >
                  {testing
                    ? <span className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    : <BugReportOutlinedIcon sx={{ fontSize: 14 }} />}
                  {t("meta.btn.testEvent", lang)}
                </button>
                <button
                  onClick={() => setConfirmDisconnect(true)}
                  className="h-10 px-4 rounded-full flex items-center gap-2 border border-red-300 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                >
                  <LinkOffOutlinedIcon sx={{ fontSize: 14 }} />
                  {t("meta.btn.disconnect", lang)}
                </button>
              </>
            ) : (
              <button
                onClick={() => void startOAuthFlow()}
                className="sl-btn-gold h-10 px-5 flex items-center gap-2 text-xs"
              >
                <LinkOutlinedIcon sx={{ fontSize: 14 }} />
                {t("meta.btn.connectMeta", lang)}
              </button>
            )}
          </div>
        </div>


        {/* Date Range Filter */}
        {connected && (
          <div className="sl-card">
            <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                {t("meta.dateRange.label", lang)}
              </span>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                {DATE_PRESETS.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => { setDatePreset(item.value); setUseCustomRange(false); }}
                    className={`h-8 px-4 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all duration-200 ${
                      datePreset === item.value && !useCustomRange
                        ? "sl-nav-active"
                        : "bg-white border border-[#1A1A2E]/8 text-[#1A1A2E]/50 hover:text-[#1A1A2E] hover:border-[#C9A84C]/40"
                    }`}
                  >
                    {t(`meta.dateRange.${item.value}`, lang)}
                  </button>
                ))}
                <button
                  onClick={() => setUseCustomRange(true)}
                  className={`h-8 px-4 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all duration-200 ${
                    useCustomRange
                      ? "sl-nav-active"
                      : "bg-white border border-[#1A1A2E]/8 text-[#1A1A2E]/50 hover:text-[#1A1A2E] hover:border-[#C9A84C]/40"
                  }`}
                >
                  {t("meta.dateRange.custom", lang)}
                </button>
              </div>
              {useCustomRange && (
                <div className="flex flex-wrap gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A2E]/40">
                      {t("meta.dateRange.startDate", lang)}
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-[#1A1A2E]/12 bg-white text-xs text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A2E]/40">
                      {t("meta.dateRange.endDate", lang)}
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-9 px-3 rounded-xl border border-[#1A1A2E]/12 bg-white text-xs text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KPI Grid */}
        {connected && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonKPI key={i} />)
                : kpiItems.map((kpi) => (
                  <KPICard key={kpi.label} {...kpi} />
                ))}
            </div>

            {/* Connection + Campaigns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Connection Details */}
              <div className="sl-card overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center gap-2">
                  <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: "#059669" }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                    {t("meta.connection.title", lang)}
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A2E]/40">
                      {t("meta.connection.status", lang)}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      connected
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-red-500"}`} />
                      {connected ? t("meta.connection.connected", lang) : t("meta.connection.disconnected", lang)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A2E]/40">
                      {t("meta.connection.adAccount", lang)}
                    </p>
                    <p className="text-xs text-[#1A1A2E] font-medium">
                      {dashboard?.metaAds?.adAccountName || dashboard?.metaAds?.adAccountId || "â€”"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A2E]/40">
                      {t("meta.connection.pixelId", lang)}
                    </p>
                    {dashboard?.metaAds?.pixelId ? (
                      <a
                        href={`https://business.facebook.com/pixels/?act=${dashboard?.metaAds?.adAccountId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-[#C9A84C] hover:underline break-all"
                      >
                        {dashboard.metaAds.pixelId}
                      </a>
                    ) : (
                      <p className="text-xs text-[#1A1A2E]/40">â€”</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A2E]/40">
                      {t("meta.connection.trackingKey", lang)}
                    </p>
                    <p className="text-[10px] font-mono bg-[#F5F3EF] rounded-xl px-2.5 py-1.5 text-[#1A1A2E]/60 break-all">
                      {dashboard?.tracking?.trackingKey || "â€”"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1A1A2E]/40">
                      {t("meta.connection.lastSync", lang)}
                    </p>
                    <p className="text-xs text-[#1A1A2E]">
                      {dashboard?.metaAds?.lastSyncedAt
                        ? new Date(dashboard.metaAds.lastSyncedAt).toLocaleString(isRTL ? "ar-SA" : "en-US")
                        : t("meta.connection.never", lang)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Campaigns */}
              <div className="sl-card overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center gap-2">
                  <TrendingUpOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                    {t("meta.campaigns.title", lang)}
                  </span>
                </div>
                <div className="p-5 max-h-72 overflow-y-auto">
                  {(dashboard?.campaigns || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-12 h-12 sl-icon-tile-gold rounded-2xl flex items-center justify-center mb-3">
                        <TrendingUpOutlinedIcon sx={{ fontSize: 22, color: "#C9A84C" }} />
                      </div>
                      <p className="font-display font-bold text-[#1A1A2E] text-sm">No campaigns yet</p>
                      <p className="text-[#1A1A2E]/40 text-xs mt-1 max-w-xs">
                        {t("meta.campaigns.empty", lang)}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dashboard?.campaigns.map((campaign) => (
                        <div key={campaign.campaignId} className="border border-[#1A1A2E]/8 rounded-xl p-3.5 space-y-2">
                          <p className="text-xs font-bold text-[#1A1A2E]">{campaign.name}</p>
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                              campaign.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-[#1A1A2E]/5 text-[#1A1A2E]/50 border-[#1A1A2E]/10"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${campaign.status === "ACTIVE" ? "bg-emerald-500" : "bg-[#1A1A2E]/30"}`} />
                              {campaign.status}
                            </span>
                            {campaign.objective && (
                              <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#1A1A2E]/5 text-[#1A1A2E]/50 border border-[#1A1A2E]/10">
                                {campaign.objective}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Events Table */}
            <div className="sl-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center gap-2">
                <VisibilityOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
                  {t("meta.events.title", lang)}
                </span>
                <span className="ms-auto text-[10px] text-[#1A1A2E]/35">{t("meta.events.description", lang)}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1A1A2E]/8">
                    {[t("meta.events.type", lang), t("meta.events.timestamp", lang), t("meta.connection.status", lang)].map((h) => (
                      <th key={h} className="px-4 py-3 text-start text-[10px] font-bold tracking-[0.15em] uppercase text-[#1A1A2E]/40">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(events?.events || []).slice(0, 20).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center">
                        <p className="text-[#1A1A2E]/40 text-sm">{t("meta.events.empty", lang)}</p>
                      </td>
                    </tr>
                  ) : (
                    (events?.events || []).slice(0, 20).map((evt) => (
                      <tr key={evt._id} className="border-b border-[#1A1A2E]/5 last:border-0 hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#1A1A2E]">{evt.eventName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#1A1A2E]/60">
                            {new Date(evt.eventTime).toLocaleString(isRTL ? "ar-SA" : "en-US")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            evt.forwardStatus === "forwarded"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : evt.forwardStatus === "stored"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-600 border-red-200"
                          }`}>
                            {evt.forwardStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Disconnect Confirmation */}
      {confirmDisconnect && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#1A1A2E]/10 shadow-2xl w-full max-w-xs p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 24, color: "#ef4444" }} />
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-[#1A1A2E] text-lg">
                {t("meta.dialog.disconnectTitle", lang)}
              </h3>
              <p className="text-[#1A1A2E]/50 text-sm mt-1">
                {t("meta.dialog.disconnectMessage", lang)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDisconnect(false)}
                className="flex-1 h-11 rounded-full border border-[#1A1A2E]/15 text-xs font-semibold text-[#1A1A2E]/70 hover:border-[#1A1A2E]/30 transition-colors"
              >
                {t("meta.btn.cancel", lang)}
              </button>
              <button
                onClick={() => void disconnect()}
                className="flex-1 h-11 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors"
              >
                {t("meta.btn.disconnect", lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium sl-rise ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
          style={{ insetInlineEnd: 24 }}
          dir={isRTL ? "rtl" : "ltr"}
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
