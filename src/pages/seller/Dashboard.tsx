import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

// MUI Icons — KPI
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningIcon from "@mui/icons-material/Warning";

// MUI Icons — Actions & UI
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditNoteIcon from "@mui/icons-material/EditNote";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";

// MUI Icons — Status
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

// MUI Components
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import type { SvgIconComponent } from "@mui/icons-material";

// App
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import { useSellerContext } from "../../context/SellerContext";
import SellerLayout from "../../components/seller/SellerLayout";
import type { ApiOrderStatus } from "../../types/api";

// ─── Local types ──────────────────────────────────────────────────────────────
interface QuickAction {
  label: string;
  description: string;
  Icon: SvgIconComponent;
  to: string;
  primary?: boolean;
}

// ─── Status icon map (language-independent) ──────────────────────────────────
type StatusConfig = { dot: string; badge: string; Icon: SvgIconComponent };

const STATUS_ICONS: Record<ApiOrderStatus, StatusConfig> = {
  pending: {
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700",
    Icon: RadioButtonUncheckedIcon,
  },
  confirmed: {
    dot: "bg-blue-400",
    badge: "bg-blue-100 text-blue-700",
    Icon: CheckCircleIcon,
  },
  shipped: {
    dot: "bg-purple-400",
    badge: "bg-purple-100 text-purple-700",
    Icon: LocalShippingIcon,
  },
  delivered: {
    dot: "bg-green-400",
    badge: "bg-green-100 text-green-700",
    Icon: CheckCircleIcon,
  },
  cancelled: {
    dot: "bg-red-400",
    badge: "bg-red-100 text-red-700",
    Icon: CancelIcon,
  },
};

/** Runtime-safe lookup — falls back to pending style for unknown/future statuses */
function getStatusConfig(status: string): StatusConfig {
  return (
    (STATUS_ICONS as Record<string, StatusConfig>)[status] ??
    STATUS_ICONS.pending
  );
}

// ─── Enhanced Stat Card ───────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  Icon,
  accent = false,
  danger = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  Icon: SvgIconComponent;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={`bg-white border border-[#1A1A2E]/8 p-5 space-y-3 hover:shadow-md transition-all duration-300 relative overflow-hidden group ${
        danger
          ? "border-l-[3px] border-l-red-400"
          : accent
            ? "border-l-[3px] border-l-[#C9A84C]"
            : ""
      }`}
    >
      {/* Subtle hover shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#C9A84C]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#1A1A2E]/40">
          {label}
        </p>
        <div
          className={`w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            danger ? "bg-red-50" : accent ? "gold-gradient" : "bg-[#1A1A2E]/5"
          }`}
        >
          <Icon
            sx={{
              fontSize: 18,
              color: danger ? "#ef4444" : accent ? "#1A1A2E" : "#C9A84C",
            }}
          />
        </div>
      </div>
      <p className="relative font-display text-[1.7rem] font-bold text-[#1A1A2E] leading-tight">
        {value}
      </p>
      {sub && (
        <p className="relative text-[11px] text-[#1A1A2E]/40 leading-relaxed">
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton
          variant="text"
          width={80}
          height={14}
          sx={{ borderRadius: 0 }}
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={40}
          sx={{ borderRadius: 0 }}
        />
      </div>
      <Skeleton
        variant="text"
        width={120}
        height={32}
        sx={{ borderRadius: 0 }}
      />
      <Skeleton
        variant="text"
        width={140}
        height={14}
        sx={{ borderRadius: 0 }}
      />
    </div>
  );
}

// ─── Skeleton Table ───────────────────────────────────────────────────────────
function SkeletonTable() {
  return (
    <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
      <div className="bg-[#FAF7F2] border-b border-[#1A1A2E]/8 px-4 py-3 flex gap-8">
        {[100, 80, 60, 90, 70].map((w, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={w}
            height={14}
            sx={{ borderRadius: 0 }}
          />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="border-b border-[#1A1A2E]/5 last:border-0 px-4 py-3.5 flex gap-8"
        >
          <Skeleton
            variant="text"
            width={90}
            height={16}
            sx={{ borderRadius: 0 }}
          />
          <Skeleton
            variant="text"
            width={100}
            height={16}
            sx={{ borderRadius: 0 }}
          />
          <Skeleton
            variant="text"
            width={50}
            height={16}
            sx={{ borderRadius: 0 }}
          />
          <Skeleton
            variant="text"
            width={85}
            height={16}
            sx={{ borderRadius: 0 }}
          />
          <Skeleton
            variant="rectangular"
            width={70}
            height={20}
            sx={{ borderRadius: 0 }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  title,
  actionLabel,
  onAction,
  Icon,
  isRTL,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  Icon?: SvgIconComponent;
  isRTL?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between mb-5 ${
        isRTL ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`flex items-center gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        {Icon && (
          <div className="w-7 h-7 bg-[#C9A84C]/10 flex items-center justify-center">
            <Icon sx={{ fontSize: 14, color: "#C9A84C" }} />
          </div>
        )}
        <h2 className="font-display font-bold text-[#1A1A2E] text-lg">
          {title}
        </h2>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className={`text-xs font-semibold text-[#C9A84C] hover:text-[#A07830] flex items-center gap-1 transition-colors duration-200 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {actionLabel}{" "}
          <ArrowForwardIcon
            sx={{ fontSize: 11, transform: isRTL ? "scaleX(-1)" : "none" }}
          />
        </button>
      )}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const cfg = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {label}
    </span>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const { tr, isRTL } = useLang();
  const t = tr.seller.dash;
  const sl = tr.seller.statusLabels;
  const { getSellerStats, getSellerOrders, allOrders, loading } =
    useSellerContext();
  const navigate = useNavigate();

  const statusLabelMap = useMemo<Record<ApiOrderStatus, string>>(
    () => ({
      pending: sl.pending,
      confirmed: sl.confirmed,
      shipped: sl.shipped,
      delivered: sl.delivered,
      cancelled: sl.cancelled,
    }),
    [sl],
  );

  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        label: t.addProduct,
        description: t.listNewProduct,
        Icon: AddIcon,
        to: "/seller/products/new",
        primary: true,
      },
      {
        label: t.viewOrders,
        description: t.manageOrders,
        Icon: ShoppingBagIcon,
        to: "/seller/orders",
      },
      {
        label: t.editProducts,
        description: t.updateListings,
        Icon: EditNoteIcon,
        to: "/seller/products",
      },
      {
        label: tr.seller.layout.storeSettings,
        description: t.configureStore,
        Icon: SettingsOutlinedIcon,
        to: "/seller/settings",
      },
    ],
    [t, tr.seller.layout.storeSettings],
  );

  const stats = useMemo(
    () => (user ? getSellerStats(user.id) : null),
    [user, getSellerStats],
  );

  const recentOrders = useMemo(
    () =>
      user
        ? getSellerOrders(user.id)
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .slice(0, 5)
        : [],
    [user, getSellerOrders],
  );

  const statusBreakdown = useMemo(() => {
    const counts: Record<ApiOrderStatus, number> = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    allOrders.forEach((o) => {
      if (o.status in counts) counts[o.status]++;
    });
    const total = allOrders.length || 1;
    return (Object.keys(counts) as ApiOrderStatus[]).map((status) => ({
      status,
      count: counts[status],
      pct: Math.round((counts[status] / total) * 100),
    }));
  }, [allOrders]);

  const pendingCount = useMemo(
    () => allOrders.filter((o) => o.status === "pending").length,
    [allOrders],
  );

  const dateLocale = isRTL ? "ar-DZ" : "en-GB";

  return (
    <SellerLayout>
      <div className="p-8 space-y-8" dir={isRTL ? "rtl" : "ltr"}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          className={`flex flex-col sm:items-center justify-between gap-4 ${isRTL ? "sm:flex-row-reverse" : "sm:flex-row"}`}
        >
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
              {t.welcomeBack}{" "}
              <span className="text-[#C9A84C]">{user?.fullName}</span>
            </h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
              {t.storePerformance}
            </p>
          </div>
          <div
            className={`flex items-center gap-3 flex-wrap ${isRTL ? "flex-row-reverse justify-end" : "justify-start"}`}
          >
            {pendingCount > 0 && (
              <button
                onClick={() =>
                  navigate("/seller/orders", { state: { tab: "pending" } })
                }
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors duration-200"
              >
                <PendingOutlinedIcon sx={{ fontSize: 13 }} />
                {pendingCount} {t.pending}
              </button>
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/seller/orders")}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
              sx={{ borderRadius: 0 }}
            >
              {t.orders}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/seller/products/new")}
              startIcon={<AddIcon sx={{ fontSize: 15 }} />}
              sx={{ borderRadius: 0 }}
            >
              {t.addProduct}
            </Button>
          </div>
        </div>

        {/* ── KPI Cards ──────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label={t.totalRevenue}
              value={`${(stats?.revenue ?? 0).toLocaleString()} ${tr.common.dzd}`}
              sub={t.fromDelivered}
              Icon={TrendingUpIcon}
              accent
            />
            <StatCard
              label={t.totalOrders}
              value={stats?.totalOrders ?? 0}
              sub={t.ordersForProducts}
              Icon={ShoppingBagIcon}
            />
            <StatCard
              label={t.productsListed}
              value={stats?.productCount ?? 0}
              sub={t.activeMarketplace}
              Icon={Inventory2Icon}
            />
            <StatCard
              label={t.lowStock}
              value={stats?.lowStock.length ?? 0}
              sub={t.itemsFewUnits}
              Icon={WarningIcon}
              danger={(stats?.lowStock.length ?? 0) > 0}
            />
          </div>
        )}

        {/* ── Quick Actions ──────────────────────────────────────────────── */}
        <div>
          <SectionHeader
            title={t.quickActions}
            Icon={BarChartIcon}
            isRTL={isRTL}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map(({ label, description, Icon, to, primary }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className={`group p-4 border text-start transition-all duration-200 ${
                  primary
                    ? "bg-[#1A1A2E] border-[#1A1A2E] hover:bg-[#2d2d50]"
                    : "bg-white border-[#1A1A2E]/8 hover:border-[#C9A84C]/40 hover:shadow-sm"
                } ${isRTL ? "text-right" : ""}`}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 ${
                    primary ? "gold-gradient" : "bg-[#1A1A2E]/5"
                  }`}
                >
                  <Icon
                    sx={{
                      fontSize: 16,
                      color: primary ? "#1A1A2E" : "#C9A84C",
                    }}
                  />
                </div>
                <p
                  className={`text-xs font-bold tracking-wide ${
                    primary ? "text-white" : "text-[#1A1A2E]"
                  }`}
                >
                  {label}
                </p>
                <p
                  className={`text-[10px] mt-0.5 ${
                    primary ? "text-white/50" : "text-[#1A1A2E]/40"
                  }`}
                >
                  {description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Low stock alert ────────────────────────────────────────────── */}
        {!loading && (stats?.lowStock.length ?? 0) > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <WarningIcon
                sx={{ fontSize: 16, color: "#d97706", flexShrink: 0, mt: 0.25 }}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  {t.lowStockWarning}
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {t.lowStockDesc}
                </p>
                <ul className="mt-2 space-y-1">
                  {stats?.lowStock.map((p) => (
                    <li
                      key={p.id}
                      className="text-xs text-amber-700 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                      <span className="font-medium">{p.name}</span>
                      <span className="text-amber-500">
                        — {p.totalStock} {t.left}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Two-column: Recent Orders + Status Breakdown ─────────────── */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${isRTL ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Recent Orders — 2/3 */}
          <div className="lg:col-span-2">
            <SectionHeader
              title={t.recentOrders}
              Icon={ShoppingBagIcon}
              actionLabel={t.viewAll}
              onAction={() => navigate("/seller/orders")}
              isRTL={isRTL}
            />

            {loading ? (
              <SkeletonTable />
            ) : recentOrders.length === 0 ? (
              <div className="bg-white border border-[#1A1A2E]/8 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#1A1A2E]/5 flex items-center justify-center">
                  <ShoppingBagIcon
                    sx={{ fontSize: 28, color: "rgba(26,26,46,0.15)" }}
                  />
                </div>
                <p className="font-display font-bold text-[#1A1A2E] text-base mb-1">
                  {t.noOrdersYet}
                </p>
                <p className="text-[#1A1A2E]/40 text-sm mb-5 max-w-xs mx-auto">
                  {t.noOrdersDesc}
                </p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/seller/products/new")}
                  startIcon={<AddIcon sx={{ fontSize: 13 }} />}
                  sx={{ borderRadius: 0, fontSize: "0.8rem" }}
                >
                  {t.addFirstProduct}
                </Button>
              </div>
            ) : (
              <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1A1A2E]/8 bg-[#FAF7F2]">
                      {[t.orderId, t.date, t.items, t.total, t.status].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-start text-[10px] font-bold tracking-[0.15em] uppercase text-[#1A1A2E]/40"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        onClick={() => navigate("/seller/orders")}
                        className="border-b border-[#1A1A2E]/5 last:border-0 hover:bg-[#FAF7F2] transition-colors duration-150 cursor-pointer"
                      >
                        <td className="px-4 py-3.5 font-display font-bold text-[#C9A84C] text-xs tracking-wide">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3.5 text-[#1A1A2E]/50 text-xs">
                          <span className="flex items-center gap-1">
                            <AccessTimeIcon sx={{ fontSize: 11 }} />
                            {new Date(order.createdAt).toLocaleDateString(
                              dateLocale,
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-[#1A1A2E]/70 text-xs">
                          {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                          {t.units}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[#1A1A2E]">
                          {order.totalAmount.toLocaleString()} {tr.common.dzd}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge
                            status={order.status}
                            label={statusLabelMap[order.status] ?? order.status}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Order Status Breakdown — 1/3 */}
          <div>
            <SectionHeader
              title={t.orderStatus}
              Icon={BarChartIcon}
              isRTL={isRTL}
            />

            {loading ? (
              <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton
                        variant="text"
                        width={80}
                        height={14}
                        sx={{ borderRadius: 0 }}
                      />
                      <Skeleton
                        variant="text"
                        width={20}
                        height={14}
                        sx={{ borderRadius: 0 }}
                      />
                    </div>
                    <Skeleton
                      variant="rectangular"
                      height={6}
                      sx={{ borderRadius: 0 }}
                    />
                  </div>
                ))}
              </div>
            ) : allOrders.length === 0 ? (
              <div className="bg-white border border-[#1A1A2E]/8 p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#1A1A2E]/5 flex items-center justify-center">
                  <BarChartIcon
                    sx={{ fontSize: 20, color: "rgba(26,26,46,0.15)" }}
                  />
                </div>
                <p className="font-display font-bold text-[#1A1A2E] text-sm mb-1">
                  {t.noDataYet}
                </p>
                <p className="text-[#1A1A2E]/40 text-xs">{t.noDataDesc}</p>
              </div>
            ) : (
              <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-4">
                {/* Mini summary row */}
                <div className="grid grid-cols-2 gap-3 pb-4 border-b border-[#1A1A2E]/8">
                  <div className="bg-green-50 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-green-600/60">
                      {t.delivered}
                    </p>
                    <p className="font-display text-lg font-bold text-green-700 mt-0.5">
                      {statusBreakdown.find((s) => s.status === "delivered")
                        ?.count ?? 0}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-amber-600/60">
                      {sl.pending}
                    </p>
                    <p className="font-display text-lg font-bold text-amber-700 mt-0.5">
                      {statusBreakdown.find((s) => s.status === "pending")
                        ?.count ?? 0}
                    </p>
                  </div>
                </div>

                {/* Progress bars */}
                {statusBreakdown.map(({ status, count, pct }) => {
                  const cfg = getStatusConfig(status);
                  return (
                    <div key={status} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <cfg.Icon
                            sx={{ fontSize: 13, color: "rgba(26,26,46,0.4)" }}
                          />
                          <span className="text-xs font-medium text-[#1A1A2E]/70">
                            {statusLabelMap[status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#1A1A2E]/30">
                            {pct}%
                          </span>
                          <span className="text-xs font-bold text-[#1A1A2E] min-w-[20px] text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-[#1A1A2E]/5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ease-out ${cfg.dot}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Total */}
                <div className="pt-3 border-t border-[#1A1A2E]/8 flex items-center justify-between">
                  <span className="text-[10px] text-[#1A1A2E]/40 uppercase tracking-[0.15em] font-bold">
                    {t.totalOrdersLabel}
                  </span>
                  <span className="text-sm font-bold text-[#1A1A2E]">
                    {allOrders.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
