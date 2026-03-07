import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningIcon from "@mui/icons-material/Warning";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useSellerContext } from "../../context/SellerContext";
import SellerLayout from "../../components/seller/SellerLayout";
import type { Product } from "../../types";

export default function ProductsPage() {
  const { sellerProducts, deleteProduct } = useSellerContext();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteProduct(confirmDelete.id);
      setConfirmDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete product.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const stockChip = (stock: number) => {
    if (stock === 0)
      return <Chip label="Out of Stock" size="small" color="error" sx={{ borderRadius: 0, fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.06em" }} />;
    if (stock <= 5)
      return <Chip label="Low Stock" size="small" color="warning" sx={{ borderRadius: 0, fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.06em" }} />;
    return <Chip label="In Stock" size="small" color="success" sx={{ borderRadius: 0, fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.06em" }} />;
  };

  return (
    <SellerLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">My Products</h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
              {sellerProducts.length} product{sellerProducts.length !== 1 ? "s" : ""} listed
            </p>
          </div>
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

        {/* Product list */}
        {sellerProducts.length === 0 ? (
          <div className="bg-white border border-[#1A1A2E]/8 p-16 text-center">
            <Inventory2Icon sx={{ fontSize: 40, color: "rgba(26,26,46,0.15)", display: "block", mx: "auto", mb: 2 }} />
            <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-2">No products yet</h3>
            <p className="text-[#1A1A2E]/40 text-sm mb-6">
              Add your first product to start selling on Foda.
            </p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/seller/products/new")}
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              sx={{ borderRadius: 0 }}
            >
              Add First Product
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A2E]/8">
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-start text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/40"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sellerProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#1A1A2E]/5 last:border-0 hover:bg-[#FAF7F2] transition-colors duration-150"
                  >
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-[#F0EBE3] overflow-hidden flex-shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1A1A2E] truncate max-w-[180px]">{product.name}</p>
                          <p className="text-[#1A1A2E]/40 text-xs">{product.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-[#1A1A2E]/60">{product.category}</td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#1A1A2E]">
                        {product.price.toLocaleString()} DZD
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${product.stock <= 5 ? "text-red-500" : "text-[#1A1A2E]/60"}`}>
                        {product.stock <= 5 && product.stock > 0 && <WarningIcon sx={{ fontSize: 11 }} />}
                        {product.stock} units
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">{stockChip(product.stock)}</td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <IconButton
                        onClick={() => setConfirmDelete(product)}
                        size="small"
                        title="Delete"
                        sx={{
                          borderRadius: 0,
                          width: 28,
                          height: 28,
                          border: "1px solid rgba(26,26,46,0.15)",
                          color: "rgba(26,26,46,0.5)",
                          "&:hover": { borderColor: "#fca5a5", color: "#ef4444" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => !deleting && setConfirmDelete(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 0, p: 3 } }}
      >
        <div className="space-y-4">
          <div className="w-12 h-12 bg-red-50 flex items-center justify-center mx-auto">
            <DeleteIcon sx={{ fontSize: 20, color: "#ef4444" }} />
          </div>
          <div className="text-center">
            <h3 className="font-display font-bold text-[#1A1A2E] text-lg">Delete Product</h3>
            <p className="text-[#1A1A2E]/50 text-sm mt-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#1A1A2E]">{confirmDelete?.name}</span>?
              This action cannot be undone.
            </p>
          </div>
          {deleteError && (
            <Alert severity="error" sx={{ borderRadius: 0, fontSize: "0.75rem", py: 0.5 }}>
              {deleteError}
            </Alert>
          )}
          <div className="flex gap-3">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => { setConfirmDelete(null); setDeleteError(""); }}
              disabled={deleting}
              fullWidth
              sx={{ borderRadius: 0 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              disabled={deleting}
              fullWidth
              startIcon={deleting ? <CircularProgress size={13} thickness={4} sx={{ color: "inherit" }} /> : undefined}
              sx={{ borderRadius: 0, bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, color: "#fff" }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      </Dialog>
    </SellerLayout>
  );
}
