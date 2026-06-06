import { useState, Fragment, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useSellerContext } from "../../context/SellerContext";
import { useLang } from "../../context/LangContext";
import { sellerService } from "../../services/sellerService";
import SellerLayout from "../../components/seller/SellerLayout";
import type {
  ApiOrderStatus,
  ApiOrderCustomer,
} from "../../types/api";

// â”€â”€â”€ Status config (language-independent) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATUS_STYLE: Record<
  ApiOrderStatus,
  { dot: string; badge: string; ring: string }
> = {
  pending: {
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    ring: "ring-amber-400",
  },
  confirmed: {
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
    ring: "ring-blue-400",
  },
  shipped: {
    dot: "bg-purple-400",
    badge: "bg-purple-50 text-purple-700 border border-purple-200",
    ring: "ring-purple-400",
  },
  delivered: {
    dot: "bg-green-400",
    badge: "bg-green-50 text-green-700 border border-green-200",
    ring: "ring-green-400",
  },
  cancelled: {
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 border border-red-200",
    ring: "ring-red-400",
  },
};

const ALL_STATUSES: ApiOrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

type SortKey = "newest" | "oldest" | "highest" | "lowest";

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getCustomerName(customerId: string | ApiOrderCustomer): string {
  if (typeof customerId === "object" && customerId?.fullName)
    return customerId.fullName;
  return "";
}

function getCustomerEmail(customerId: string | ApiOrderCustomer): string {
  if (typeof customerId === "object" && customerId?.email)
    return customerId.email;
  return "";
}

// â”€â”€â”€ Status Badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatusBadge({
  status,
  label,
}: {
  status: ApiOrderStatus;
  label: string;
}) {
  const cfg = STATUS_STYLE[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {label}
    </span>
  );
}

function OrderActionButtons({
  disabled,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  disabled: boolean;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onConfirm}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 border shadow-sm hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
      >
        <CheckCircleIcon sx={{ fontSize: 14 }} />
        {confirmLabel}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white text-red-600 border border-red-200 shadow-sm transition-all duration-200 hover:bg-red-50 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        <CancelIcon sx={{ fontSize: 14 }} />
        {cancelLabel}
      </button>
    </div>
  );
}

// â”€â”€â”€ Skeleton Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SkeletonRow() {
  return (
    <tr className="border-b border-[#1A1A2E]/5 animate-pulse">
      {[140, 120, 100, 160, 90, 100, 90, 110].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-3 bg-[#1A1A2E]/8" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// â”€â”€â”€ Orders Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function OrdersPage() {
  const { allOrders, loading, updateOrderStatus } = useSellerContext();
  const { tr, lang, isRTL } = useLang();
  const t = tr.seller.ordersList;
  const sl = tr.seller.statusLabels;
  const ta = tr.seller.orderActions;
  const location = useLocation();

  const statusLabelMap: Record<ApiOrderStatus, string> = {
    pending: sl.pending,
    confirmed: sl.confirmed,
    shipped: sl.shipped,
    delivered: sl.delivered,
    cancelled: sl.cancelled,
  };

  const tabs: { key: string; label: string }[] = [
    { key: "all", label: t.all },
    { key: "pending", label: sl.pending },
    { key: "confirmed", label: sl.confirmed },
    { key: "shipped", label: sl.shipped },
    { key: "delivered", label: sl.delivered },
    { key: "cancelled", label: sl.cancelled },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    orderId: string;
    nextStatus: "confirmed" | "cancelled";
  } | null>(null);
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [downloadingLabelId, setDownloadingLabelId] = useState<string | null>(null);
  const [labelError, setLabelError] = useState<string | null>(null);

  // Allow Dashboard pending button to set the initial tab
  useEffect(() => {
    const navTab = (location.state as { tab?: string } | null)?.tab;
    if (navTab && ALL_STATUSES.includes(navTab as ApiOrderStatus)) {
      setActiveTab(navTab);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  // Filter + search + sort
  const filtered = useMemo(() => {
    let result =
      activeTab === "all"
        ? [...allOrders]
        : allOrders.filter((o) => o.status === activeTab);

    // Search by order ID, customer name, item names
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((o) => {
        const id = o._id.slice(-8).toLowerCase();
        const name = getCustomerName(o.customerId).toLowerCase();
        const items = o.items.map((i) => i.name.toLowerCase()).join(" ");
        return id.includes(q) || name.includes(q) || items.includes(q);
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortKey) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest":
          return b.totalAmount - a.totalAmount;
        case "lowest":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    return result;
  }, [allOrders, activeTab, search, sortKey]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: ApiOrderStatus,
  ) => {
    setUpdatingId(orderId);
    setActionError("");
    try {
      await updateOrderStatus(orderId, newStatus);
      setActionTarget(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : ta.unableToUpdate,
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadLabel = async (orderId: string) => {
    setDownloadingLabelId(orderId);
    setLabelError(null);
    try {
      await sellerService.downloadOrderLabel(orderId);
    } catch (err) {
      setLabelError(
        err instanceof Error
          ? err.message
          : isRTL ? "ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ù…Ù„ØµÙ‚ Ø§Ù„Ø´Ø­Ù†" : "Failed to download shipping label",
      );
      setTimeout(() => setLabelError(null), 4000);
    } finally {
      setDownloadingLabelId(null);
    }
  };

  const tabCount = (key: string) =>
    key === "all"
      ? allOrders.length
      : allOrders.filter((o) => o.status === key).length;

  const dateLocale = lang === "ar" ? "ar-DZ" : "en-GB";

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "newest", label: t.sortNewest },
    { key: "oldest", label: t.sortOldest },
    { key: "highest", label: t.sortHighest },
    { key: "lowest", label: t.sortLowest },
  ];

  const tableHeaders = [
    t.orderId,
    t.customer,
    t.date,
    t.items,
    t.wilaya,
    t.total,
    t.status,
    t.updateStatus,
  ];

  return (
    <SellerLayout>
      <div className="p-6 sm:p-8 lg:p-10 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div
          className={`flex items-center justify-between flex-wrap gap-4 sl-rise`}
        >
          <div className={`flex items-center gap-3.5`}>
            <div className="w-12 h-12 sl-icon-tile-gold flex items-center justify-center shrink-0">
              <ReceiptLongOutlinedIcon sx={{ fontSize: 24, color: "#C9A84C" }} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                {t.title}
              </h1>
              <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
                {allOrders.length} {t.totalOrders}
              </p>
            </div>
          </div>
        </div>

        {/* â”€â”€ Status filter tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map(({ key, label }) => {
            const count = tabCount(key);
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "sl-nav-active"
                    : "bg-white border border-[#1A1A2E]/8 text-[#1A1A2E]/50 hover:text-[#1A1A2E] hover:border-[#C9A84C]/40"
                }`}
              >
                {label}
                {count > 0 && (
                  <span
                    className={`min-w-[18px] px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                      isActive
                        ? "bg-[#1A1A2E]/15 text-[#1A1A2E]"
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

        {/* â”€â”€ Search & Sort â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <SearchIcon
              sx={{
                fontSize: 18,
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                left: lang === "ar" ? undefined : 14,
                right: lang === "ar" ? 14 : undefined,
                color: "rgba(26,26,46,0.3)",
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              className="w-full h-11 rounded-full border border-[#1A1A2E]/10 bg-white text-sm text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 focus:outline-none focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/10 transition-all duration-200"
              style={{ paddingInlineStart: 42, paddingInlineEnd: 16 }}
            />
          </div>
          <div className="relative flex items-center">
            <SortIcon
              sx={{
                fontSize: 16,
                position: "absolute",
                left: lang === "ar" ? undefined : 14,
                right: lang === "ar" ? 14 : undefined,
                color: "rgba(26,26,46,0.35)",
                pointerEvents: "none",
              }}
            />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="h-11 rounded-full border border-[#1A1A2E]/10 bg-white text-sm text-[#1A1A2E]/70 focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-200 cursor-pointer"
              style={{ paddingInlineStart: 40, paddingInlineEnd: 16 }}
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* â”€â”€ Orders Table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="sl-card overflow-hidden">
          {loading ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A2E]/8 bg-[#FAF7F2]">
                  {tableHeaders.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-start text-[10px] font-semibold tracking-widest uppercase text-[#1A1A2E]/40"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 sl-icon-tile-gold flex items-center justify-center">
                <ShoppingBagIcon
                  sx={{ fontSize: 28, color: "rgba(201,168,76,0.5)" }}
                />
              </div>
              <p className="font-display font-bold text-[#1A1A2E] text-base mb-1">
                {t.noOrders}{" "}
                {activeTab !== "all"
                  ? statusLabelMap[activeTab as ApiOrderStatus]
                  : ""}
              </p>
              <p className="text-[#1A1A2E]/40 text-sm max-w-xs mx-auto">
                {activeTab === "all"
                  ? t.noOrdersAll
                  : t.noOrdersStatus.replace(
                      "{status}",
                      statusLabelMap[activeTab as ApiOrderStatus],
                    )}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A2E]/8 bg-[#FAF7F2]">
                  {tableHeaders.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-start text-[10px] font-semibold tracking-widest uppercase text-[#1A1A2E]/40"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const isExpanded = expandedId === order._id;
                  const isUpdating = updatingId === order._id;
                  const itemCount = order.items.reduce(
                    (s, i) => s + i.quantity,
                    0,
                  );
                  const itemNames = order.items.map((i) => i.name).join(", ");
                  const customerName = getCustomerName(order.customerId);
                  const customerEmail = getCustomerEmail(order.customerId);

                  return (
                    <Fragment key={order._id}>
                      {/* Main row */}
                      <tr
                        onClick={() =>
                          setExpandedId(isExpanded ? null : order._id)
                        }
                        className={`border-b border-[#1A1A2E]/5 cursor-pointer transition-all duration-200 ${
                          isExpanded ? "bg-[#FAF7F2]" : "hover:bg-[#FAF7F2]/60"
                        }`}
                      >
                        {/* Order ID */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {isExpanded ? (
                              <ExpandLessIcon
                                sx={{
                                  fontSize: 13,
                                  color: "#C9A84C",
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <ExpandMoreIcon
                                sx={{
                                  fontSize: 13,
                                  color: "rgba(26,26,46,0.3)",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <span className="font-display font-bold text-[#C9A84C] text-xs tracking-wide">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          {customerName ? (
                            <div>
                              <p className="text-xs font-semibold text-[#1A1A2E] truncate max-w-[120px]">
                                {customerName}
                              </p>
                              {customerEmail && (
                                <p className="text-[10px] text-[#1A1A2E]/40 truncate max-w-[120px] mt-0.5">
                                  {customerEmail}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-[#1A1A2E]/30">â€”</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 text-[#1A1A2E]/50 text-xs whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString(
                            dateLocale,
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>

                        {/* Items */}
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-[#1A1A2E] text-xs">
                            {itemCount} {t.item}
                          </span>
                          <p className="text-[#1A1A2E]/40 text-[10px] truncate max-w-[160px] mt-0.5">
                            {itemNames}
                          </p>
                        </td>

                        {/* Wilaya */}
                        <td className="px-4 py-3.5 text-[#1A1A2E]/60 text-xs">
                          <span className="flex items-center gap-1">
                            <LocationOnIcon
                              sx={{ fontSize: 11, flexShrink: 0 }}
                            />
                            {order.shippingDetails.wilaya}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-3.5 font-semibold text-[#1A1A2E] whitespace-nowrap text-xs">
                          {order.totalAmount.toLocaleString()} {tr.common.dzd}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <StatusBadge
                            status={order.status}
                            label={statusLabelMap[order.status]}
                          />
                        </td>

                        {/* Update status */}
                        <td
                          className="px-4 py-3.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {order.status === "pending" ? (
                            <div className="flex flex-col gap-2">
                              <OrderActionButtons
                                disabled={isUpdating}
                                confirmLabel={ta.confirm}
                                cancelLabel={ta.cancel}
                                onConfirm={() => {
                                  setActionError("");
                                  setActionTarget({
                                    orderId: order._id,
                                    nextStatus: "confirmed",
                                  });
                                }}
                                onCancel={() => {
                                  setActionError("");
                                  setActionTarget({
                                    orderId: order._id,
                                    nextStatus: "cancelled",
                                  });
                                }}
                              />
                              {isUpdating && (
                                <span className="text-[10px] font-medium text-[#1A1A2E]/40">
                                  {ta.updating}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                              <StatusBadge
                                status={order.status}
                                label={statusLabelMap[order.status]}
                              />
                              {order.managedBy && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-[#1A1A2E]/45 bg-[#1A1A2E]/5 px-2 py-0.5">
                                  <PersonOutlineIcon sx={{ fontSize: 10 }} />
                                  {order.managedBy}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <tr className="border-b border-[#1A1A2E]/5 bg-[#FAF7F2]">
                          <td colSpan={8} className="px-6 pb-5 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#1A1A2E]/8">
                              {/* Items list */}
                              <div className="md:col-span-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/40 mb-3 flex items-center gap-1.5">
                                  <Inventory2Icon sx={{ fontSize: 11 }} />{" "}
                                  {t.orderItems}
                                </p>
                                <div className="space-y-2">
                                  {order.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="bg-white border border-[#1A1A2E]/8 rounded-xl p-3 transition-all duration-200 hover:shadow-sm"
                                    >
                                      <div className="flex items-start gap-3">
                                        {item.image && (
                                          <div className="w-12 h-14 rounded-lg bg-[#F0EBE3] overflow-hidden flex-shrink-0">
                                            <img
                                              src={item.image}
                                              alt={item.name}
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                (
                                                  e.target as HTMLImageElement
                                                ).style.display = "none";
                                              }}
                                            />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold text-[#1A1A2E] truncate">
                                            {item.name}
                                          </p>
                                          <p className="text-[10px] text-[#1A1A2E]/50 mt-1">
                                            {t.qty} {item.quantity} Ã—{" "}
                                            {item.price.toLocaleString()}{" "}
                                            {tr.common.dzd}
                                          </p>
                                          {/* Size & Color */}
                                          {item.selectedChoices && (
                                            <div className="flex items-center gap-3 mt-1.5">
                                              {item.selectedChoices.size && (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-[#1A1A2E]/60 bg-[#1A1A2E]/5 px-2 py-0.5">
                                                  <StraightenOutlinedIcon
                                                    sx={{ fontSize: 10 }}
                                                  />
                                                  {t.size}{" "}
                                                  {item.selectedChoices.size}
                                                </span>
                                              )}
                                              {item.selectedChoices.color && (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-[#1A1A2E]/60 bg-[#1A1A2E]/5 px-2 py-0.5">
                                                  <PaletteOutlinedIcon
                                                    sx={{ fontSize: 10 }}
                                                  />
                                                  {t.color}{" "}
                                                  {item.selectedChoices.color}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <span className="text-xs font-bold text-[#1A1A2E] flex-shrink-0 whitespace-nowrap">
                                          {(
                                            item.price * item.quantity
                                          ).toLocaleString()}{" "}
                                          {tr.common.dzd}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Customer info */}
                              <div className="md:col-span-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/40 mb-3 flex items-center gap-1.5">
                                  <PersonOutlineIcon sx={{ fontSize: 11 }} />{" "}
                                  {t.customerInfo}
                                </p>
                                <div className="bg-white border border-[#1A1A2E]/8 rounded-xl p-4 space-y-3">
                                  {customerName && (
                                    <div className="flex items-center gap-2">
                                      <PersonOutlineIcon
                                        sx={{
                                          fontSize: 13,
                                          color: "#C9A84C",
                                          flexShrink: 0,
                                        }}
                                      />
                                      <p className="text-xs font-semibold text-[#1A1A2E]">
                                        {customerName}
                                      </p>
                                    </div>
                                  )}
                                  {customerEmail && (
                                    <div className="flex items-center gap-2">
                                      <EmailOutlinedIcon
                                        sx={{
                                          fontSize: 13,
                                          color: "#C9A84C",
                                          flexShrink: 0,
                                        }}
                                      />
                                      <p className="text-xs text-[#1A1A2E]/70">
                                        {customerEmail}
                                      </p>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <PhoneIcon
                                      sx={{
                                        fontSize: 13,
                                        color: "#C9A84C",
                                        flexShrink: 0,
                                      }}
                                    />
                                    <p className="text-xs text-[#1A1A2E]">
                                      {order.shippingDetails.phone}
                                    </p>
                                  </div>
                                </div>

                                {/* Order total box */}
                                <div className="mt-3 bg-[#1A1A2E] p-4 flex items-center justify-between">
                                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                                    {t.orderTotal}
                                  </span>
                                  <span className="text-sm font-bold text-[#C9A84C]">
                                    {order.totalAmount.toLocaleString()}{" "}
                                    {tr.common.dzd}
                                  </span>
                                </div>

                                {/* Label download â€” only for confirmed/shipped/delivered orders with a tracking_id */}
                                {order.tracking_id &&
                                  (order.status === "confirmed" ||
                                    order.status === "shipped" ||
                                    order.status === "delivered") && (
                                    <button
                                      onClick={() => handleDownloadLabel(order._id)}
                                      disabled={downloadingLabelId === order._id}
                                      className="mt-2 w-full h-9 flex items-center justify-center gap-2 border border-[#C9A84C]/40 text-[#C9A84C] text-[11px] font-bold uppercase tracking-wide hover:bg-[#C9A84C]/8 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {downloadingLabelId === order._id ? (
                                        <>
                                          <span className="w-3.5 h-3.5 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
                                          {isRTL ? "Ø¬Ø§Ø±Ù Ø§Ù„ØªØ­Ù…ÙŠÙ„..." : "Downloading..."}
                                        </>
                                      ) : (
                                        <>
                                          <FileDownloadOutlinedIcon sx={{ fontSize: 14 }} />
                                          {isRTL ? "ØªØ­Ù…ÙŠÙ„ Ù…Ù„ØµÙ‚ Ø§Ù„Ø´Ø­Ù†" : "Download Label"}
                                        </>
                                      )}
                                    </button>
                                  )}
                              </div>

                              {/* Shipping details */}
                              <div className="md:col-span-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/40 mb-3 flex items-center gap-1.5">
                                  <LocalShippingIcon sx={{ fontSize: 11 }} />{" "}
                                  {t.shippingDetails}
                                </p>
                                <div className="bg-white border border-[#1A1A2E]/8 rounded-xl p-4 space-y-3">
                                  <div className="flex items-start gap-2">
                                    <LocationOnIcon
                                      sx={{
                                        fontSize: 13,
                                        color: "#C9A84C",
                                        flexShrink: 0,
                                        mt: 0.25,
                                      }}
                                    />
                                    <div>
                                      <p className="text-xs font-semibold text-[#1A1A2E]">
                                        {order.shippingDetails.wilaya}
                                        {order.shippingDetails.commune &&
                                          `, ${order.shippingDetails.commune}`}
                                      </p>
                                      {order.shippingDetails.postalCode && (
                                        <p className="text-[10px] text-[#1A1A2E]/40 mt-0.5">
                                          {t.postal}{" "}
                                          {order.shippingDetails.postalCode}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {order.shippingDetails.shippingType ===
                                    "home_delivery" ? (
                                      <LocalShippingIcon
                                        sx={{
                                          fontSize: 13,
                                          color: "#C9A84C",
                                          flexShrink: 0,
                                        }}
                                      />
                                    ) : (
                                      <RadioButtonUncheckedIcon
                                        sx={{
                                          fontSize: 13,
                                          color: "#C9A84C",
                                          flexShrink: 0,
                                        }}
                                      />
                                    )}
                                    <p className="text-xs text-[#1A1A2E]">
                                      {order.shippingDetails.shippingType ===
                                      "home_delivery"
                                        ? t.homeDelivery
                                        : t.deskPickup}
                                    </p>
                                  </div>
                                </div>

                                {/* Status flow indicator */}
                                <div className="mt-3 bg-white border border-[#1A1A2E]/8 rounded-xl p-4">
                                  <div className="flex items-center gap-1">
                                    {ALL_STATUSES.filter(
                                      (s) => s !== "cancelled",
                                    ).map((s, idx, arr) => {
                                      const statusOrder = [
                                        "pending",
                                        "confirmed",
                                        "shipped",
                                        "delivered",
                                      ];
                                      const currentIdx = statusOrder.indexOf(
                                        order.status,
                                      );
                                      const stepIdx = statusOrder.indexOf(s);
                                      const isPast =
                                        stepIdx <= currentIdx &&
                                        order.status !== "cancelled";
                                      const isCurrent =
                                        order.status === s;
                                      const cfg = STATUS_STYLE[s];

                                      return (
                                        <div
                                          key={s}
                                          className="flex items-center flex-1"
                                        >
                                          <div className="flex flex-col items-center gap-1 flex-1">
                                            <div
                                              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                                isCurrent
                                                  ? cfg.dot +
                                                    " ring-2 ring-offset-1 " +
                                                    cfg.ring
                                                  : isPast
                                                    ? cfg.dot
                                                    : "bg-[#1A1A2E]/8"
                                              }`}
                                            >
                                              {isPast && (
                                                <CheckCircleIcon
                                                  sx={{
                                                    fontSize: 10,
                                                    color: "#fff",
                                                  }}
                                                />
                                              )}
                                            </div>
                                            <span
                                              className={`text-[8px] font-semibold uppercase tracking-wide ${
                                                isCurrent
                                                  ? "text-[#1A1A2E]"
                                                  : isPast
                                                    ? "text-[#1A1A2E]/50"
                                                    : "text-[#1A1A2E]/20"
                                              }`}
                                            >
                                              {statusLabelMap[s]}
                                            </span>
                                          </div>
                                          {idx < arr.length - 1 && (
                                            <div
                                              className={`h-px flex-1 mx-1 mb-4 ${
                                                stepIdx < currentIdx &&
                                                order.status !== "cancelled"
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
                                        <CancelIcon
                                          sx={{
                                            fontSize: 14,
                                            color: "#f87171",
                                          }}
                                        />
                                        <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">
                                          {sl.cancelled}
                                        </span>
                                      </div>
                                    )}
                                  </div>
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

      <Dialog
        open={!!actionTarget}
        onClose={() => !updatingId && setActionTarget(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: "1.25rem", p: 3 } }}
      >
        <div className="space-y-4">
          <div
            className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${actionTarget?.nextStatus === "confirmed" ? "bg-emerald-50" : "bg-red-50"}`}
          >
            {actionTarget?.nextStatus === "confirmed" ? (
              <CheckCircleIcon sx={{ fontSize: 24, color: "#16a34a" }} />
            ) : (
              <CancelIcon sx={{ fontSize: 24, color: "#ef4444" }} />
            )}
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-display font-bold text-[#1A1A2E] text-lg">
              {actionTarget?.nextStatus === "confirmed" ? ta.confirmTitle : ta.cancelTitle}
            </h3>
            <p className="text-[#1A1A2E]/50 text-sm leading-relaxed">
              {actionTarget?.nextStatus === "confirmed" ? ta.confirmDesc : ta.cancelDesc}
            </p>
          </div>

          {actionError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {actionError}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outlined"
              onClick={() => setActionTarget(null)}
              disabled={!!updatingId}
              fullWidth
              sx={{ borderRadius: "999px" }}
            >
              {ta.back}
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                actionTarget &&
                handleStatusChange(
                  actionTarget.orderId,
                  actionTarget.nextStatus,
                )
              }
              disabled={!!updatingId || !actionTarget}
              fullWidth
              sx={{
                borderRadius: "999px",
                bgcolor:
                  actionTarget?.nextStatus === "confirmed"
                    ? "#16a34a"
                    : "#ef4444",
                "&:hover": {
                  bgcolor:
                    actionTarget?.nextStatus === "confirmed"
                      ? "#15803d"
                      : "#dc2626",
                },
                color: "#fff",
              }}
              startIcon={
                updatingId ? (
                  <span className="inline-flex w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : undefined
              }
            >
              {updatingId
                ? ta.saving
                : actionTarget?.nextStatus === "confirmed"
                  ? ta.confirm
                  : ta.cancel}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* â”€â”€ Label download error toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {labelError && (
        <div
          className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-50 flex items-center gap-2.5 px-4 py-3 shadow-xl text-sm font-medium bg-red-600 text-white`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <CancelIcon sx={{ fontSize: 16 }} />
          {labelError}
        </div>
      )}
    </SellerLayout>
  );
}
