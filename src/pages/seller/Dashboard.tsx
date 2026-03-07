import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningIcon from "@mui/icons-material/Warning";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Button from "@mui/material/Button";
import type { SvgIconComponent } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useSellerContext } from "../../context/SellerContext";
import SellerLayout from "../../components/seller/SellerLayout";
import type { ApiOrderStatus } from "../../types/api";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  ApiOrderStatus,
  { label: string; dot: string; badge: string; Icon: SvgIconComponent }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700",
    Icon: RadioButtonUncheckedIcon,
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-blue-400",
    badge: "bg-blue-100 text-blue-700",
    Icon: CheckCircleIcon,
  },
  shipped: {
    label: "Shipped",
    dot: "bg-purple-400",
    badge: "bg-purple-100 text-purple-700",
    Icon: LocalShippingIcon,
  },
  delivered: {
    label: "Delivered",
    dot: "bg-green-400",
    badge: "bg-green-100 text-green-700",
    Icon: CheckCircleIcon,
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    badge: "bg-red-100 text-red-700",
    Icon: CancelIcon,
  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
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
    <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40">
          {label}
        </p>
        <div
          className={`w-9 h-9 flex items-center justify-center ${
            danger ? "bg-red-50" : accent ? "gold-gradient" : "bg-[#1A1A2E]/5"
          }`}
        >
          <Icon
            sx={{
              fontSize: 16,
              color: danger ? "#ef4444" : accent ? "#1A1A2E" : "#C9A84C",
            }}
          />
        </div>
      </div>
      <p className="font-display text-2xl font-bold text-[#1A1A2E]">{value}</p>
      {sub && <p className="text-xs text-[#1A1A2E]/40">{sub}</p>}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ApiOrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const { getSellerStats, getSellerOrders, allOrders } = useSellerContext();
  const navigate = useNavigate();

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

  return (
    <SellerLayout>
      <div className="p-8 space-y-8">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
              Welcome back,{" "}
              <span className="text-[#C9A84C]">{user?.fullName}</span>
            </h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
              Here's how your store is performing today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/seller/orders")}
              startIcon={<ShoppingBagIcon sx={{ fontSize: 14 }} />}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
              sx={{ borderRadius: 0 }}
            >
              Orders
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/seller/products/new")}
              startIcon={<AddIcon sx={{ fontSize: 15 }} />}
              sx={{ borderRadius: 0 }}
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* ── KPI Cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={`${(stats?.revenue ?? 0).toLocaleString()} DZD`}
            sub="From all your orders"
            Icon={TrendingUpIcon}
            accent
          />
          <StatCard
            label="Total Orders"
            value={stats?.totalOrders ?? 0}
            sub="Orders for your products"
            Icon={ShoppingBagIcon}
          />
          <StatCard
            label="Products Listed"
            value={stats?.productCount ?? 0}
            sub="Active in the marketplace"
            Icon={Inventory2Icon}
          />
          <StatCard
            label="Low Stock"
            value={stats?.lowStock.length ?? 0}
            sub="Items with ≤ 5 units left"
            Icon={WarningIcon}
            danger={(stats?.lowStock.length ?? 0) > 0}
          />
        </div>

        {/* ── Low stock alert ─────────────────────────────────────────────── */}
        {(stats?.lowStock.length ?? 0) > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <WarningIcon
                sx={{ fontSize: 16, color: "#d97706", flexShrink: 0, mt: 0.25 }}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  Low stock warning
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  The following products have 5 or fewer units remaining:
                </p>
                <ul className="mt-2 space-y-1">
                  {stats?.lowStock.map((p) => (
                    <li
                      key={p.id}
                      className="text-xs text-amber-700 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      <span className="font-medium">{p.name}</span>
                      <span className="text-amber-500">— {p.stock} left</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Two-column: Recent Orders + Status Breakdown ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders — 2/3 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-[#1A1A2E] text-lg">
                Recent Orders
              </h2>
              <button
                onClick={() => navigate("/seller/orders")}
                className="text-xs font-semibold text-[#C9A84C] hover:underline flex items-center gap-1"
              >
                View all <ArrowForwardIcon sx={{ fontSize: 11 }} />
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div className="bg-white border border-[#1A1A2E]/8 p-10 text-center">
                <ShoppingBagIcon
                  sx={{
                    fontSize: 32,
                    color: "rgba(26,26,46,0.15)",
                    display: "block",
                    mx: "auto",
                    mb: 1.5,
                  }}
                />
                <p className="text-[#1A1A2E]/40 text-sm">
                  No orders yet. Orders for your products will appear here.
                </p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/seller/products/new")}
                  startIcon={<AddIcon sx={{ fontSize: 13 }} />}
                  sx={{ borderRadius: 0, mt: 2, fontSize: "0.8rem" }}
                >
                  Add your first product
                </Button>
              </div>
            ) : (
              <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1A1A2E]/8">
                      {["Order ID", "Date", "Items", "Total", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-start text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40"
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
                        <td className="px-4 py-3 font-display font-bold text-[#C9A84C] text-xs tracking-wide">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-[#1A1A2E]/50 text-xs">
                          <span className="flex items-center gap-1">
                            <AccessTimeIcon sx={{ fontSize: 11 }} />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#1A1A2E]/70">
                          {order.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                          unit(s)
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#1A1A2E]">
                          {order.totalAmount.toLocaleString()} DZD
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
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
            <h2 className="font-display font-bold text-[#1A1A2E] text-lg mb-4">
              Order Status
            </h2>
            <div className="bg-white border border-[#1A1A2E]/8 p-5 space-y-4">
              {allOrders.length === 0 ? (
                <p className="text-xs text-[#1A1A2E]/40 text-center py-6">
                  No orders yet
                </p>
              ) : (
                statusBreakdown.map(({ status, count, pct }) => {
                  const cfg = STATUS_CONFIG[status];
                  return (
                    <div key={status} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}
                          />
                          <span className="text-xs font-medium text-[#1A1A2E]/70">
                            {cfg.label}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#1A1A2E]">
                          {count}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#1A1A2E]/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${cfg.dot}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
              {allOrders.length > 0 && (
                <div className="pt-2 border-t border-[#1A1A2E]/8 flex items-center justify-between">
                  <span className="text-[10px] text-[#1A1A2E]/40 uppercase tracking-widest font-semibold">
                    Total orders
                  </span>
                  <span className="text-xs font-bold text-[#1A1A2E]">
                    {allOrders.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
