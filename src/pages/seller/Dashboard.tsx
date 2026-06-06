import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

// MUI Icons — KPI
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";

// MUI Icons — UI
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AddIcon from "@mui/icons-material/Add";

// MUI Components
import Skeleton from "@mui/material/Skeleton";
import type { SvgIconComponent } from "@mui/icons-material";

// App
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import { useSellerContext } from "../../context/SellerContext";
import SellerLayout from "../../components/seller/SellerLayout";

// ─── KPI Stat Card (rounded / soft, clickable → drills into its detail page) ──
function StatCard({
  label,
  value,
  sub,
  Icon,
  tint,
  isRTL,
  delay = 0,
  onClick,
}: {
  label: string;
  value: string | number;
  sub?: string;
  Icon: SvgIconComponent;
  /** Soft per-card icon-tile tint (matches reference) */
  tint: { bg: string; fg: string };
  isRTL?: boolean;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${value}`}
      className={`sl-card sl-card-hover sl-rise p-5 w-full block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50 ${
        isRTL ? "text-right" : "text-left"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <div
          className="w-11 h-11 sl-chip flex items-center justify-center"
          style={{ backgroundColor: tint.bg }}
        >
          <Icon sx={{ fontSize: 20, color: tint.fg }} />
        </div>
        <p className="sl-eyebrow max-w-[60%] leading-snug">{label}</p>
      </div>

      <p className="font-display text-[2rem] font-bold text-[#1A1A2E] leading-tight mt-3">
        {value}
      </p>
      {sub && <p className="text-[11px] text-[#1A1A2E]/40 mt-1">{sub}</p>}
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="sl-card p-5">
      <div className="flex items-start justify-between">
        <Skeleton variant="rounded" width={44} height={44} />
        <Skeleton variant="text" width={70} height={14} />
      </div>
      <Skeleton variant="text" width={90} height={40} sx={{ mt: 1.5 }} />
      <Skeleton variant="text" width={120} height={14} />
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const { tr, isRTL } = useLang();
  const t = tr.seller.dash;
  const sl = tr.seller.statusLabels;
  const { allOrders, sellerProducts, loading } = useSellerContext();
  const navigate = useNavigate();

  const Arrow = isRTL ? ArrowBackIcon : ArrowForwardIcon;
  const dateLocale = isRTL ? "ar-DZ" : "en-GB";

  // ── Derived metrics ───────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const lowStock = sellerProducts.filter(
      (p) => p.totalStock > 0 && p.totalStock <= 5,
    );
    const outOfStock = sellerProducts.filter((p) => p.totalStock === 0);
    const pendingOrders = allOrders.filter((o) => o.status === "pending");
    const confirmedLifetime = allOrders.filter(
      (o) =>
        o.status === "confirmed" ||
        o.status === "shipped" ||
        o.status === "delivered",
    ).length;
    const pendingValue = pendingOrders.reduce(
      (sum, o) => sum + o.totalAmount,
      0,
    );
    const deliveredCount = allOrders.filter(
      (o) => o.status === "delivered",
    ).length;
    const revenue = allOrders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      productCount: sellerProducts.length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      pendingCount: pendingOrders.length,
      confirmedLifetime,
      pendingValue,
      totalOrders: allOrders.length,
      deliveredCount,
      revenue,
    };
  }, [sellerProducts, allOrders]);

  const recentPending = useMemo(
    () =>
      allOrders
        .filter((o) => o.status === "pending")
        .slice()
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .slice(0, 5),
    [allOrders],
  );

  // Prefer the shop name; fall back to the seller's first name.
  const shopName =
    user?.shopName?.trim() || user?.fullName?.split(" ")[0] || "";

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diff / 60000);
    if (mins < 1) return isRTL ? "الآن" : "now";
    if (mins < 60) return isRTL ? `منذ ${mins} د` : `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return isRTL ? `منذ ${hrs} س` : `${hrs}h ago`;
    return new Date(iso).toLocaleDateString(dateLocale, {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <SellerLayout>
      <div className="p-6 sm:p-8 lg:p-10 space-y-8" dir={isRTL ? "rtl" : "ltr"}>
        {/* ── Hero ──────────────────────────────────────────────────────────
            dir="rtl" on the wrapper already flips flex flow, so the welcome
            block (first child) sits on the right and the actions (last child)
            on the left in Arabic — no manual reversing needed. */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className={`sl-rise ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A2E] leading-tight">
              {t.welcomeBack}{" "}
              <span className="text-[#C9A84C]">{shopName}</span>.
            </h1>
            <p className="text-[#1A1A2E]/50 text-sm sm:text-base mt-2">
              {t.whatAwaits}
            </p>
          </div>

          <div
            className="sl-rise flex items-center gap-2.5 flex-wrap shrink-0"
            style={{ animationDelay: "80ms" }}
          >
            <button
              onClick={() => navigate("/seller/orders")}
              className="sl-btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
              {t.orders}
            </button>
            <button
              onClick={() => navigate("/seller/products/new")}
              className="sl-btn-dark inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              <AddIcon sx={{ fontSize: 18 }} />
              {t.addProduct}
            </button>
          </div>
        </div>

        {/* ── KPI Cards — single row (matches reference) ───────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Finance — total earned revenue from delivered orders */}
            <StatCard
              label={t.totalRevenue}
              value={`${metrics.revenue.toLocaleString()} ${tr.common.dzd}`}
              sub={t.fromDelivered}
              Icon={PaymentsOutlinedIcon}
              tint={{ bg: "rgba(201, 168, 76, 0.16)", fg: "#C9A84C" }}
              isRTL={isRTL}
              delay={0}
              onClick={() => navigate("/seller/analytics/revenue")}
            />
            {/* All-time orders */}
            <StatCard
              label={t.totalOrders}
              value={metrics.totalOrders}
              sub={`${metrics.deliveredCount} ${t.deliveredSub}`}
              Icon={ReceiptLongOutlinedIcon}
              tint={{ bg: "rgba(26, 26, 46, 0.06)", fg: "#1A1A2E" }}
              isRTL={isRTL}
              delay={60}
              onClick={() => navigate("/seller/orders")}
            />
            {/* Pending — action item, with value as subtitle */}
            <StatCard
              label={t.pendingOrders}
              value={metrics.pendingCount}
              sub={`${metrics.pendingValue.toLocaleString()} ${tr.common.dzd}`}
              Icon={ScheduleOutlinedIcon}
              tint={{ bg: "rgba(217, 119, 6, 0.12)", fg: "#D97706" }}
              isRTL={isRTL}
              delay={120}
              onClick={() =>
                navigate("/seller/orders", { state: { tab: "pending" } })
              }
            />
            {/* Catalog — products with stock health subtitle */}
            <StatCard
              label={t.productsListed}
              value={metrics.productCount}
              sub={`${metrics.lowStockCount} ${t.catalogSizeSub} · ${metrics.outOfStockCount} ${t.outOfStock}`}
              Icon={Inventory2OutlinedIcon}
              tint={{ bg: "rgba(168, 85, 64, 0.10)", fg: "#A85540" }}
              isRTL={isRTL}
              delay={180}
              onClick={() => navigate("/seller/products")}
            />
          </div>
        )}

        {/* ── Two-column: Inventory Health + Recent Pending ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory Health — 1/3 */}
          <div
            className="sl-card sl-rise p-6 flex flex-col"
            style={{ animationDelay: "120ms" }}
          >
            <h2
              className={`font-display font-bold text-[#1A1A2E] text-lg mb-5 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t.inventoryHealth}
            </h2>

            {loading ? (
              <div className="space-y-4 flex-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="text" height={24} />
                ))}
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                <HealthRow
                  label={t.lowStockItems}
                  value={metrics.lowStockCount}
                  tone={metrics.lowStockCount > 0 ? "warn" : "ok"}
                  isRTL={isRTL}
                />
                <HealthRow
                  label={t.outOfStock}
                  value={metrics.outOfStockCount}
                  tone={metrics.outOfStockCount > 0 ? "danger" : "ok"}
                  isRTL={isRTL}
                />
                <HealthRow
                  label={t.totalProducts}
                  value={metrics.productCount}
                  tone="neutral"
                  isRTL={isRTL}
                />
              </div>
            )}

            <button
              onClick={() => navigate("/seller/inventory")}
              className={`sl-btn-ghost mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] w-full ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {t.browseInventory}
              <Arrow sx={{ fontSize: 15 }} />
            </button>
          </div>

          {/* Recent Pending — 2/3 */}
          <div
            className="sl-card sl-rise p-6 lg:col-span-2"
            style={{ animationDelay: "180ms" }}
          >
            <div
              className={`flex items-start justify-between mb-5 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className={isRTL ? "text-right" : "text-left"}>
                <h2 className="font-display font-bold text-[#1A1A2E] text-lg">
                  {t.recentPendingOrders}
                </h2>
                <p className="text-[11px] text-[#1A1A2E]/40 mt-0.5">
                  {t.oldestFirst}
                </p>
              </div>
              <button
                onClick={() =>
                  navigate("/seller/orders", { state: { tab: "pending" } })
                }
                className={`text-xs font-semibold text-[#C9A84C] hover:text-[#A07830] inline-flex items-center gap-1 transition-colors duration-200 shrink-0 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {t.viewAll}
                <Arrow sx={{ fontSize: 13 }} />
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={56} />
                ))}
              </div>
            ) : recentPending.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 mx-auto mb-4 sl-icon-tile-gold flex items-center justify-center">
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 26, color: "#C9A84C" }}
                  />
                </div>
                <p className="font-display font-bold text-[#1A1A2E] text-base mb-1">
                  {t.noPendingOrders}
                </p>
                <p className="text-[#1A1A2E]/40 text-sm">{t.noPendingDesc}</p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {recentPending.map((order) => {
                  const itemCount = order.items.reduce(
                    (s, i) => s + i.quantity,
                    0,
                  );
                  return (
                    <li key={order._id}>
                      <button
                        onClick={() =>
                          navigate("/seller/orders", {
                            state: { tab: "pending" },
                          })
                        }
                        className={`w-full sl-chip bg-[#FBF9F5] hover:bg-[#F5F1E9] border border-[#1A1A2E]/5 px-4 py-3 flex items-center gap-4 transition-colors duration-150 ${
                          isRTL ? "flex-row-reverse text-right" : "text-left"
                        }`}
                      >
                        {/* Amount */}
                        <div className="shrink-0">
                          <p className="font-display font-bold text-[#1A1A2E] text-sm leading-none">
                            {order.totalAmount.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-[#1A1A2E]/40 mt-1">
                            {tr.common.dzd}
                          </p>
                        </div>

                        {/* Meta */}
                        <div className="flex-1 min-w-0">
                          <div
                            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              {sl.pending}
                            </span>
                            <span className="font-display font-bold text-[#C9A84C] text-[11px] tracking-wide">
                              #{order._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-2 mt-1 text-[11px] text-[#1A1A2E]/45 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <span className="inline-flex items-center gap-0.5">
                              <PlaceOutlinedIcon sx={{ fontSize: 12 }} />
                              {order.shippingDetails?.wilaya ?? "—"}
                            </span>
                            <span className="text-[#1A1A2E]/20">·</span>
                            <span>
                              {itemCount} {t.item}
                            </span>
                            <span className="text-[#1A1A2E]/20">·</span>
                            <span>{relativeTime(order.createdAt)}</span>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

// ─── Inventory health row ─────────────────────────────────────────────────────
function HealthRow({
  label,
  value,
  tone,
  isRTL,
}: {
  label: string;
  value: number;
  tone: "ok" | "warn" | "danger" | "neutral";
  isRTL?: boolean;
}) {
  const toneColor =
    tone === "danger"
      ? "text-red-500"
      : tone === "warn"
        ? "text-amber-500"
        : tone === "neutral"
          ? "text-[#1A1A2E]"
          : "text-[#1A1A2E]/40";
  return (
    <div
      className={`flex items-center justify-between py-2.5 border-b border-[#1A1A2E]/5 last:border-0 ${
        isRTL ? "flex-row-reverse" : ""
      }`}
    >
      <span className="text-sm text-[#1A1A2E]/60">{label}</span>
      <span className={`font-display text-lg font-bold ${toneColor}`}>
        {value}
      </span>
    </div>
  );
}
