import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Package, AlertTriangle } from "lucide-react";
import { useSellerContext } from "../../context/SellerContext";
import SellerLayout from "../../components/seller/SellerLayout";
import type { Product } from "../../types";

export default function ProductsPage() {
  const { sellerProducts, deleteProduct } = useSellerContext();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    if (!confirmDelete) return;
    setDeleting(true);
    setTimeout(() => {
      deleteProduct(confirmDelete.id);
      setConfirmDelete(null);
      setDeleting(false);
    }, 400);
  };

  return (
    <SellerLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
              My Products
            </h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
              {sellerProducts.length} product
              {sellerProducts.length !== 1 ? "s" : ""} listed
            </p>
          </div>
          <button
            onClick={() => navigate("/seller/products/new")}
            className="btn-gold flex items-center gap-2"
          >
            <Plus size={15} /> Add Product
          </button>
        </div>

        {/* Product list */}
        {sellerProducts.length === 0 ? (
          <div className="bg-white border border-[#1A1A2E]/8 p-16 text-center">
            <Package size={40} className="text-[#1A1A2E]/15 mx-auto mb-4" />
            <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-2">
              No products yet
            </h3>
            <p className="text-[#1A1A2E]/40 text-sm mb-6">
              Add your first product to start selling on Foda.
            </p>
            <button
              onClick={() => navigate("/seller/products/new")}
              className="btn-gold inline-flex items-center gap-2"
            >
              <Plus size={14} /> Add First Product
            </button>
          </div>
        ) : (
          <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A2E]/8">
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Stock",
                    "Badge",
                    "Actions",
                  ].map((h) => (
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
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1A1A2E] truncate max-w-[180px]">
                            {product.name}
                          </p>
                          <p className="text-[#1A1A2E]/40 text-xs">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-[#1A1A2E]/60">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#1A1A2E]">
                        {product.price.toLocaleString()} DZD
                      </span>
                      {product.originalPrice && (
                        <span className="ms-2 text-[#1A1A2E]/30 line-through text-xs">
                          {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          product.stock <= 5
                            ? "text-red-500"
                            : "text-[#1A1A2E]/60"
                        }`}
                      >
                        {product.stock <= 5 && <AlertTriangle size={11} />}
                        {product.stock}
                      </span>
                    </td>

                    {/* Badge */}
                    <td className="px-4 py-3">
                      {product.badge ? (
                        <span
                          className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${product.badgeColor}`}
                        >
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-[#1A1A2E]/20 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/seller/products/${product.id}/edit`)
                          }
                          className="w-7 h-7 border border-[#1A1A2E]/15 flex items-center justify-center text-[#1A1A2E]/50 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all duration-200"
                          title="Edit"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(product)}
                          className="w-7 h-7 border border-[#1A1A2E]/15 flex items-center justify-center text-[#1A1A2E]/50 hover:border-red-300 hover:text-red-500 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <>
          <div
            className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="fixed inset-0 z-[51] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm shadow-2xl p-6 space-y-4">
              <div className="w-12 h-12 bg-red-50 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <div className="text-center">
                <h3 className="font-display font-bold text-[#1A1A2E] text-lg">
                  Delete Product
                </h3>
                <p className="text-[#1A1A2E]/50 text-sm mt-1">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-[#1A1A2E]">
                    {confirmDelete.name}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 btn-outline-gold"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 h-10 bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors duration-200 disabled:opacity-60"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </SellerLayout>
  );
}
