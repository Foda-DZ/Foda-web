import { useEffect, useState, useCallback } from "react";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Skeleton from "@mui/material/Skeleton";
import { sellerService } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";
import SellerLayout from "../../components/seller/SellerLayout";

interface InventoryItem {
  _id: string;
  name: string;
  stock: number;
  sizes?: string[];
  sizeVariants?: { size: string; stock: number }[];
  images?: { url: string }[];
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 10 }} />
        Out of stock
      </span>
    );
  if (stock <= 5)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
        <WarningAmberOutlinedIcon sx={{ fontSize: 10 }} />
        Low stock
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircleOutlinedIcon sx={{ fontSize: 10 }} />
      In stock
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[#1A1A2E]/5 animate-pulse">
      {[48, 200, 80, 100, 120, 90].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <Skeleton variant={i === 0 ? "rectangular" : "text"} width={w} height={i === 0 ? 48 : 14} sx={{ borderRadius: 0 }} />
        </td>
      ))}
    </tr>
  );
}

export default function InventoryPage() {
  const { isRTL } = useLang();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const LIMIT = 20;

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchInventory = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await sellerService.getInventory({ page: p, limit: LIMIT });
      setInventory(data.items as InventoryItem[]);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory(1);
  }, [fetchInventory]);

  const startEdit = (item: InventoryItem) => {
    setEditingId(item._id);
    setEditValue(item.stock);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue(0);
  };

  const saveStock = async (productId: string) => {
    if (typeof editValue !== "number" || Number.isNaN(editValue) || editValue < 0) {
      showToast("Please enter a valid stock number", "error");
      return;
    }
    setSavingId(productId);
    try {
      await sellerService.updateInventory(productId, { stock: editValue });
      setInventory((prev) =>
        prev.map((item) => (item._id === productId ? { ...item, stock: editValue } : item)),
      );
      showToast("Stock updated successfully", "success");
      setEditingId(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update stock", "error");
    } finally {
      setSavingId(null);
    }
  };

  const changePage = (p: number) => {
    setPage(p);
    fetchInventory(p);
  };

  const lowStockCount = inventory.filter((i) => i.stock > 0 && i.stock <= 5).length;
  const outOfStockCount = inventory.filter((i) => i.stock === 0).length;

  return (
    <SellerLayout>
      <div className="p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Inventory</h1>
          <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
            Manage your product stock levels
          </p>
        </div>

        {/* Summary chips */}
        {!loading && (outOfStockCount > 0 || lowStockCount > 0) && (
          <div className="flex flex-wrap gap-3">
            {outOfStockCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200">
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 15, color: "#dc2626" }} />
                <span className="text-xs font-semibold text-red-700">
                  {outOfStockCount} product{outOfStockCount > 1 ? "s" : ""} out of stock
                </span>
              </div>
            )}
            {lowStockCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200">
                <WarningAmberOutlinedIcon sx={{ fontSize: 15, color: "#d97706" }} />
                <span className="text-xs font-semibold text-amber-700">
                  {lowStockCount} product{lowStockCount > 1 ? "s" : ""} running low
                </span>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center gap-2">
            <WarehouseOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
              Stock levels — {inventory.length} products
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1A1A2E]/8">
                {["", "Product", "Stock", "Sizes", "Status", "Action"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-start text-[10px] font-bold tracking-[0.15em] uppercase text-[#1A1A2E]/40"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : inventory.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 bg-[#1A1A2E]/5 flex items-center justify-center">
                          <WarehouseOutlinedIcon sx={{ fontSize: 24, color: "rgba(26,26,46,0.2)" }} />
                        </div>
                        <p className="font-display font-bold text-[#1A1A2E]">No products found</p>
                        <p className="text-[#1A1A2E]/40 text-sm mt-1">Add products to start managing inventory.</p>
                      </td>
                    </tr>
                  )
                  : inventory.map((item) => {
                    const isEditing = editingId === item._id;
                    const isSaving = savingId === item._id;

                    return (
                      <tr
                        key={item._id}
                        className={`border-b border-[#1A1A2E]/5 last:border-0 transition-colors duration-150 ${
                          isEditing ? "bg-[#FAF7F2]" : "hover:bg-[#FAF7F2]/60"
                        }`}
                      >
                        {/* Image */}
                        <td className="px-4 py-3">
                          <div className="w-10 h-12 bg-[#F0EBE3] overflow-hidden shrink-0">
                            {item.images?.[0]?.url && (
                              <img
                                src={item.images[0].url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            )}
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#1A1A2E] text-xs truncate max-w-[200px]">
                            {item.name}
                          </p>
                        </td>

                        {/* Stock (editable) */}
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              value={editValue}
                              onChange={(e) => setEditValue(Number(e.target.value))}
                              autoFocus
                              className="w-20 h-8 border border-[#C9A84C]/60 bg-white text-xs text-[#1A1A2E] text-center focus:outline-none focus:border-[#C9A84C] transition-colors"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveStock(item._id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                            />
                          ) : (
                            <span className={`text-xs font-bold ${item.stock === 0 ? "text-red-500" : item.stock <= 5 ? "text-amber-600" : "text-[#1A1A2E]"}`}>
                              {item.stock}
                            </span>
                          )}
                        </td>

                        {/* Sizes */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {item.sizeVariants && item.sizeVariants.length > 0
                              ? item.sizeVariants.map((v) => (
                                <span key={v.size} className="text-[10px] px-1.5 py-0.5 bg-[#1A1A2E]/5 text-[#1A1A2E]/60">
                                  {v.size} ({v.stock})
                                </span>
                              ))
                              : item.sizes?.map((s) => (
                                <span key={s} className="text-[10px] px-1.5 py-0.5 bg-[#1A1A2E]/5 text-[#1A1A2E]/60">
                                  {s}
                                </span>
                              )) ?? <span className="text-[#1A1A2E]/30 text-xs">—</span>}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StockBadge stock={isEditing ? editValue : item.stock} />
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => saveStock(item._id)}
                                disabled={isSaving}
                                className="w-7 h-7 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-200 disabled:opacity-60"
                              >
                                {isSaving
                                  ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  : <CheckOutlinedIcon sx={{ fontSize: 13 }} />}
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={isSaving}
                                className="w-7 h-7 flex items-center justify-center bg-[#1A1A2E]/8 hover:bg-[#1A1A2E]/15 text-[#1A1A2E]/60 transition-colors duration-200"
                              >
                                <CloseOutlinedIcon sx={{ fontSize: 13 }} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(item)}
                              className="w-7 h-7 flex items-center justify-center border border-[#1A1A2E]/15 text-[#1A1A2E]/50 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all duration-200"
                            >
                              <EditOutlinedIcon sx={{ fontSize: 13 }} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="px-5 py-3.5 border-t border-[#1A1A2E]/8 bg-[#FAF7F2] flex items-center justify-between">
              <span className="text-xs text-[#1A1A2E]/40">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className={`w-7 h-7 text-xs font-semibold transition-all duration-200 ${
                      p === page
                        ? "gold-gradient text-[#1A1A2E]"
                        : "bg-white border border-[#1A1A2E]/12 text-[#1A1A2E]/50 hover:border-[#C9A84C]/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 shadow-lg text-sm font-medium transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
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
