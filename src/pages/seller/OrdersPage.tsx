import { useState, Fragment } from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useSellerContext } from "../../context/SellerContext";
import SellerLayout from "../../components/seller/SellerLayout";
import type { ApiOrderStatus } from "../../types/api";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  ApiOrderStatus,
  { label: string; dot: string; badge: string }
> = {
  pending:   { label: "Pending",   dot: "bg-amber-400",  badge: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", dot: "bg-blue-400",   badge: "bg-blue-100 text-blue-700" },
  shipped:   { label: "Shipped",   dot: "bg-purple-400", badge: "bg-purple-100 text-purple-700" },
  delivered: { label: "Delivered", dot: "bg-green-400",  badge: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", dot: "bg-red-400",    badge: "bg-red-100 text-red-700" },
};

const ALL_STATUSES: ApiOrderStatus[] = [
  "pending", "confirmed", "shipped", "delivered", "cancelled",
];

const TABS: { key: string; label: string }[] = [
  { key: "all",       label: "All" },
  { key: "pending",   label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped",   label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ApiOrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-[#1A1A2E]/5 animate-pulse">
      {[140, 100, 160, 100, 100, 90, 110].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-3 bg-[#1A1A2E]/8 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Orders Page ─────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { allOrders, loading, updateOrderStatus } = useSellerContext();
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered =
    activeTab === "all"
      ? allOrders
      : allOrders.filter((o) => o.status === activeTab);

  const handleStatusChange = async (orderId: string, newStatus: ApiOrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const tabCount = (key: string) =>
    key === "all"
      ? allOrders.length
      : allOrders.filter((o) => o.status === key).length;

  return (
    <SellerLayout>
      <div className="p-8 space-y-6">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Orders</h1>
          <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
            {allOrders.length} total order{allOrders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ── Status filter tabs ─────────────────────────────────────────── */}
        <div className="flex items-center gap-1 border-b border-[#1A1A2E]/8 overflow-x-auto">
          {TABS.map(({ key, label }) => {
            const count = tabCount(key);
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 border-b-2 -mb-px ${
                  isActive
                    ? "border-[#C9A84C] text-[#1A1A2E]"
                    : "border-transparent text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70"
                }`}
              >
                {label}
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                        : "bg-[#1A1A2E]/8 text-[#1A1A2E]/40"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Orders Table ───────────────────────────────────────────────── */}
        <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
          {loading ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A2E]/8">
                  {["Order ID", "Date", "Items", "Wilaya", "Total", "Status", "Update"].map((h) => (
                    <th key={h} className="px-4 py-3 text-start text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <ShoppingBagIcon sx={{ fontSize: 36, color: "rgba(26,26,46,0.12)", display: "block", mx: "auto", mb: 2 }} />
              <p className="font-display font-bold text-[#1A1A2E] text-base mb-1">
                No {activeTab === "all" ? "" : activeTab} orders
              </p>
              <p className="text-[#1A1A2E]/40 text-sm">
                {activeTab === "all"
                  ? "Orders for your products will appear here once customers start buying."
                  : `You have no orders with the status "${activeTab}".`}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A2E]/8">
                  {["Order ID", "Date", "Items", "Wilaya", "Total", "Status", "Update Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-start text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const isExpanded = expandedId === order._id;
                  const isUpdating = updatingId === order._id;
                  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
                  const itemNames = order.items.map((i) => i.name).join(", ");

                  return (
                    <Fragment key={order._id}>
                      {/* Main row */}
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                        className={`border-b border-[#1A1A2E]/5 cursor-pointer transition-colors duration-150 ${
                          isExpanded ? "bg-[#FAF7F2]" : "hover:bg-[#FAF7F2]/60"
                        }`}
                      >
                        {/* Order ID */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {isExpanded
                              ? <ExpandLessIcon sx={{ fontSize: 13, color: "#C9A84C", flexShrink: 0 }} />
                              : <ExpandMoreIcon sx={{ fontSize: 13, color: "rgba(26,26,46,0.3)", flexShrink: 0 }} />
                            }
                            <span className="font-display font-bold text-[#C9A84C] text-xs tracking-wide">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-[#1A1A2E]/50 text-xs whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </td>

                        {/* Items */}
                        <td className="px-4 py-3">
                          <span className="font-semibold text-[#1A1A2E] text-xs">
                            {itemCount} item{itemCount !== 1 ? "s" : ""}
                          </span>
                          <p className="text-[#1A1A2E]/40 text-[10px] truncate max-w-[160px] mt-0.5">
                            {itemNames}
                          </p>
                        </td>

                        {/* Wilaya */}
                        <td className="px-4 py-3 text-[#1A1A2E]/60 text-xs">
                          <span className="flex items-center gap-1">
                            <LocationOnIcon sx={{ fontSize: 11, flexShrink: 0 }} />
                            {order.shippingDetails.wilaya}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-3 font-semibold text-[#1A1A2E] whitespace-nowrap">
                          {order.totalAmount.toLocaleString()} DZD
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>

                        {/* Update status */}
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          {isUpdating ? (
                            <CircularProgress size={18} thickness={4} sx={{ color: "#C9A84C" }} />
                          ) : (
                            <TextField
                              select
                              size="small"
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value as ApiOrderStatus)
                              }
                              sx={{
                                minWidth: 120,
                                "& .MuiOutlinedInput-root": { borderRadius: 0, fontSize: "0.75rem", height: 28 },
                              }}
                              slotProps={{ select: { native: true } }}
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                              ))}
                            </TextField>
                          )}
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr className="border-b border-[#1A1A2E]/5 bg-[#FAF7F2]">
                          <td colSpan={7} className="px-6 pb-5 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1A1A2E]/8">
                              {/* Items list */}
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/40 mb-3 flex items-center gap-1.5">
                                  <Inventory2Icon sx={{ fontSize: 11 }} /> Order Items
                                </p>
                                <div className="space-y-2">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white border border-[#1A1A2E]/8 p-2.5">
                                      {item.image && (
                                        <div className="w-10 h-12 bg-[#F0EBE3] overflow-hidden flex-shrink-0">
                                          <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                          />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-[#1A1A2E] truncate">{item.name}</p>
                                        <p className="text-[10px] text-[#1A1A2E]/40 mt-0.5">
                                          Qty: {item.quantity} × {item.price.toLocaleString()} DZD
                                        </p>
                                      </div>
                                      <span className="text-xs font-bold text-[#1A1A2E] flex-shrink-0">
                                        {(item.price * item.quantity).toLocaleString()} DZD
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Shipping details */}
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/40 mb-3 flex items-center gap-1.5">
                                  <LocalShippingIcon sx={{ fontSize: 11 }} /> Shipping Details
                                </p>
                                <div className="bg-white border border-[#1A1A2E]/8 p-4 space-y-3">
                                  <div className="flex items-start gap-2">
                                    <LocationOnIcon sx={{ fontSize: 13, color: "#C9A84C", flexShrink: 0, mt: 0.25 }} />
                                    <div>
                                      <p className="text-xs font-semibold text-[#1A1A2E]">
                                        {order.shippingDetails.wilaya}
                                        {order.shippingDetails.commune && `, ${order.shippingDetails.commune}`}
                                      </p>
                                      {order.shippingDetails.postalCode && (
                                        <p className="text-[10px] text-[#1A1A2E]/40">
                                          Postal: {order.shippingDetails.postalCode}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <PhoneIcon sx={{ fontSize: 13, color: "#C9A84C", flexShrink: 0 }} />
                                    <p className="text-xs text-[#1A1A2E]">{order.shippingDetails.phone}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {order.shippingDetails.shippingType === "home_delivery"
                                      ? <LocalShippingIcon sx={{ fontSize: 13, color: "#C9A84C", flexShrink: 0 }} />
                                      : <RadioButtonUncheckedIcon sx={{ fontSize: 13, color: "#C9A84C", flexShrink: 0 }} />
                                    }
                                    <p className="text-xs text-[#1A1A2E]">
                                      {order.shippingDetails.shippingType === "home_delivery"
                                        ? "Home Delivery"
                                        : "Desk Pickup"}
                                    </p>
                                  </div>
                                  <div className="pt-2 border-t border-[#1A1A2E]/8 flex items-center justify-between">
                                    <span className="text-[10px] text-[#1A1A2E]/40 uppercase tracking-widest font-semibold">
                                      Order Total
                                    </span>
                                    <span className="text-sm font-bold text-[#1A1A2E]">
                                      {order.totalAmount.toLocaleString()} DZD
                                    </span>
                                  </div>
                                </div>

                                {/* Status flow indicator */}
                                <div className="mt-3 flex items-center gap-1">
                                  {ALL_STATUSES.filter((s) => s !== "cancelled").map((s, idx, arr) => {
                                    const cfg = STATUS_CONFIG[s];
                                    const statusOrder = ["pending", "confirmed", "shipped", "delivered"];
                                    const currentIdx = statusOrder.indexOf(order.status);
                                    const stepIdx = statusOrder.indexOf(s);
                                    const isPast = stepIdx <= currentIdx && order.status !== "cancelled";
                                    const isCurrent = order.status === s && order.status !== "cancelled";

                                    return (
                                      <div key={s} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center gap-1 flex-1">
                                          <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                              isCurrent
                                                ? cfg.dot + " ring-2 ring-offset-1 ring-current"
                                                : isPast
                                                  ? cfg.dot
                                                  : "bg-[#1A1A2E]/8"
                                            }`}
                                          >
                                            {isPast && <CheckCircleIcon sx={{ fontSize: 10, color: "#fff" }} />}
                                          </div>
                                          <span
                                            className={`text-[9px] font-semibold uppercase tracking-wide ${
                                              isCurrent
                                                ? "text-[#1A1A2E]"
                                                : isPast
                                                  ? "text-[#1A1A2E]/50"
                                                  : "text-[#1A1A2E]/20"
                                            }`}
                                          >
                                            {cfg.label}
                                          </span>
                                        </div>
                                        {idx < arr.length - 1 && (
                                          <div
                                            className={`h-px flex-1 mx-1 mb-4 ${
                                              stepIdx < currentIdx && order.status !== "cancelled"
                                                ? "bg-[#1A1A2E]/20"
                                                : "bg-[#1A1A2E]/8"
                                            }`}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                  {order.status === "cancelled" && (
                                    <div className="flex items-center gap-1.5 ms-2">
                                      <CancelIcon sx={{ fontSize: 14, color: "#f87171" }} />
                                      <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">
                                        Cancelled
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
