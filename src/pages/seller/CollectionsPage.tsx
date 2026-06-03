import { useState, useEffect, useRef, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { useLang } from "../../context/LangContext";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import { apiCollectionToCollection } from "../../lib/mappers";
import type { Collection, CollectionProduct } from "../../types";
import type { ApiCollection } from "../../types/api";

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({
  msg,
  type,
  isRTL,
}: {
  msg: string;
  type: "success" | "error";
  isRTL: boolean;
}) {
  return (
    <div
      className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-[70] flex items-center gap-2.5 px-4 py-3 shadow-xl text-sm font-medium ${
        type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
      ) : (
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 16 }} />
      )}
      {msg}
    </div>
  );
}

// ─── Cover image picker ───────────────────────────────────────────────────────
function CoverPicker({
  current,
  onFile,
}: {
  current: string | null;
  onFile: (f: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(current);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFile(file);
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
        Cover Image <span className="normal-case font-normal text-[#1A1A2E]/30">(optional)</span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-full h-36 border-2 border-dashed border-[#1A1A2E]/15 hover:border-[#C9A84C]/50 bg-[#FAF7F2] cursor-pointer overflow-hidden transition-colors duration-150 flex items-center justify-center"
      >
        {preview ? (
          <>
            <img src={preview} alt="cover" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clear}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <CloseOutlinedIcon sx={{ fontSize: 12 }} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 pointer-events-none">
            <ImageOutlinedIcon sx={{ fontSize: 28, color: "rgba(26,26,46,0.2)" }} />
            <span className="text-xs text-[#1A1A2E]/35">Click to upload</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

// ─── Product selector ─────────────────────────────────────────────────────────
function ProductSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [products, setProducts] = useState<
    { id: string; name: string; image: string | null; price: number }[]
  >([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await sellerService.getProducts();
        if (cancelled) return;
        setProducts(
          raw.map((p) => ({
            id: p._id,
            name: p.name,
            image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0].url : null,
            price: p.price,
          })),
        );
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = search.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    : products;

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
          Products
        </label>
        {selected.length > 0 && (
          <span className="text-[10px] font-semibold text-[#C9A84C]">
            {selected.length} selected
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <SearchOutlinedIcon
          sx={{ fontSize: 14, color: "rgba(26,26,46,0.3)" }}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-8 pr-3 border border-[#1A1A2E]/15 bg-white text-xs text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
        />
      </div>

      {/* List */}
      <div className="max-h-52 overflow-y-auto border border-[#1A1A2E]/10 divide-y divide-[#1A1A2E]/5">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 px-3 py-2.5">
              <Skeleton variant="rectangular" width={32} height={38} sx={{ borderRadius: 0 }} />
              <Skeleton variant="text" width={120} />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <p className="px-3 py-4 text-xs text-[#1A1A2E]/35 text-center">No products found</p>
        ) : (
          filtered.map((p) => {
            const isSelected = selected.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors duration-100 ${
                  isSelected ? "bg-[#C9A84C]/8 border-l-2 border-[#C9A84C]" : "bg-white hover:bg-[#FAF7F2]"
                }`}
              >
                <div className="w-8 h-9 bg-[#F0EBE3] overflow-hidden shrink-0">
                  {p.image && (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="flex-1 text-xs font-medium text-[#1A1A2E] truncate">{p.name}</span>
                {isSelected && (
                  <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: "#C9A84C", shrink: 0 }} />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Collection Modal (create / edit) ────────────────────────────────────────
interface ModalProps {
  mode: "create" | "edit";
  initial?: Collection | null;
  onClose: () => void;
  onSaved: (c: Collection) => void;
}

function CollectionModal({ mode, initial, onClose, onSaved }: ModalProps) {
  const { isRTL } = useLang();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    initial?.products.map((p) => p.id) ?? [],
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Collection name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let raw: ApiCollection;
      if (mode === "create") {
        raw = await sellerService.createCollection({
          name: trimmed,
          description: description.trim() || undefined,
          products: selectedProducts,
          coverImage: coverFile ?? undefined,
        });
      } else {
        raw = await sellerService.updateCollection(initial!.id, {
          name: trimmed,
          description: description.trim(),
          products: selectedProducts,
          coverImage: coverFile ?? undefined,
        });
      }
      onSaved(apiCollectionToCollection(raw));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save collection");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-white w-full max-w-md shadow-2xl border border-[#1A1A2E]/8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 gold-gradient flex items-center justify-center">
              <CollectionsBookmarkOutlinedIcon sx={{ fontSize: 14, color: "#1A1A2E" }} />
            </div>
            <p className="text-sm font-bold text-[#1A1A2E]">
              {mode === "create" ? "New Collection" : "Edit Collection"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-7 h-7 flex items-center justify-center text-[#1A1A2E]/40 hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/5 transition-colors disabled:opacity-40"
          >
            <CloseOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              maxLength={100}
              placeholder="e.g. Summer 2025"
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className="w-full h-10 border border-[#1A1A2E]/15 bg-white text-sm text-[#1A1A2E] px-3 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
            />
            <div className="flex justify-between">
              {error && <p className="text-xs text-red-500">{error}</p>}
              <span className="text-[10px] text-[#1A1A2E]/30 ms-auto">{name.length}/100</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1A2E]/50">
              Description <span className="normal-case font-normal text-[#1A1A2E]/30">(optional)</span>
            </label>
            <textarea
              value={description}
              maxLength={500}
              rows={3}
              placeholder="Describe this collection…"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[#1A1A2E]/15 bg-white text-sm text-[#1A1A2E] px-3 py-2.5 focus:outline-none focus:border-[#C9A84C]/60 transition-colors resize-none"
            />
            <span className="text-[10px] text-[#1A1A2E]/30 block text-end">{description.length}/500</span>
          </div>

          {/* Cover */}
          <CoverPicker
            current={initial?.coverImage ?? null}
            onFile={setCoverFile}
          />

          {/* Products */}
          <ProductSelector
            selected={selectedProducts}
            onChange={setSelectedProducts}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1A1A2E]/8 bg-[#FAF7F2] shrink-0">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="w-full h-10 flex items-center justify-center gap-2 bg-[#1A1A2E] text-white text-xs font-bold uppercase tracking-wide hover:bg-[#2d2d50] transition-colors disabled:opacity-60"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CollectionsBookmarkOutlinedIcon sx={{ fontSize: 14 }} />
            )}
            {saving ? "Saving…" : mode === "create" ? "Create Collection" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Collections Page ─────────────────────────────────────────────────────────
export default function CollectionsPage() {
  const { isRTL } = useLang();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [modal, setModal] = useState<{ mode: "create" | "edit"; collection?: Collection } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Collection | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sellerService.getCollections({
        search: debouncedSearch || undefined,
      });
      setCollections(
        data.collections.map((c) => apiCollectionToCollection(c)),
      );
    } catch {
      showToast("Failed to load collections", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, showToast]);

  useEffect(() => { load(); }, [load]);

  const handleSaved = (c: Collection) => {
    setCollections((prev) => {
      const idx = prev.findIndex((x) => x.id === c.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = c;
        return next;
      }
      return [c, ...prev];
    });
    setModal(null);
    showToast(
      modal?.mode === "create" ? "Collection created" : "Collection updated",
      "success",
    );
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await sellerService.deleteCollection(confirmDelete.id);
      setCollections((prev) => prev.filter((c) => c.id !== confirmDelete.id));
      showToast("Collection deleted", "success");
    } catch {
      showToast("Failed to delete collection", "error");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  return (
    <SellerLayout>
      <div className="p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Collections</h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
              {loading ? "Loading…" : `${collections.length} collection${collections.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModal({ mode: "create" })}
            startIcon={<AddIcon sx={{ fontSize: 15 }} />}
            sx={{ borderRadius: 0 }}
          >
            New Collection
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <SearchOutlinedIcon
            sx={{ fontSize: 15, color: "rgba(26,26,46,0.3)" }}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search collections…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 border border-[#1A1A2E]/15 bg-white text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#1A1A2E]/8 overflow-hidden">
                <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 0 }} />
                <div className="p-4 space-y-2">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-white border border-[#1A1A2E]/8 p-16 text-center">
            <CollectionsBookmarkOutlinedIcon
              sx={{ fontSize: 40, color: "rgba(26,26,46,0.15)", display: "block", mx: "auto", mb: 2 }}
            />
            <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-2">
              {debouncedSearch ? "No collections match your search" : "No collections yet"}
            </h3>
            <p className="text-[#1A1A2E]/40 text-sm mb-6">
              {debouncedSearch
                ? "Try a different keyword"
                : "Create your first collection to group products together."}
            </p>
            {!debouncedSearch && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setModal({ mode: "create" })}
                startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                sx={{ borderRadius: 0 }}
              >
                Create Collection
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((c) => (
              <CollectionCard
                key={c.id}
                collection={c}
                onEdit={() => setModal({ mode: "edit", collection: c })}
                onDelete={() => setConfirmDelete(c)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <CollectionModal
          mode={modal.mode}
          initial={modal.collection ?? null}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && !deleting && setConfirmDelete(null)}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="bg-white border border-[#1A1A2E]/10 shadow-2xl w-full max-w-xs p-6 space-y-4">
            <div className="w-12 h-12 bg-red-50 flex items-center justify-center mx-auto">
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 20, color: "#ef4444" }} />
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-[#1A1A2E] text-lg">Delete Collection</h3>
              <p className="text-[#1A1A2E]/50 text-sm mt-1">
                Delete{" "}
                <span className="font-semibold text-[#1A1A2E]">"{confirmDelete.name}"</span>?
                This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="flex-1 h-10 border border-[#1A1A2E]/15 text-xs font-semibold text-[#1A1A2E]/70 hover:border-[#1A1A2E]/30 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-10 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
              >
                {deleting && (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} isRTL={isRTL} />}
    </SellerLayout>
  );
}

// ─── Collection Card ──────────────────────────────────────────────────────────
function CollectionCard({
  collection,
  onEdit,
  onDelete,
}: {
  collection: Collection;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const previewProducts = collection.products.slice(0, 4);
  const remaining = Math.max(0, collection.productCount - 4);

  return (
    <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden group hover:shadow-md transition-shadow duration-200">
      {/* Cover image or product thumbnails */}
      <div className="relative h-36 bg-[#F5F3EF] overflow-hidden">
        {collection.coverImage ? (
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : previewProducts.length > 0 ? (
          <ProductMosaic products={previewProducts} remaining={remaining} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CollectionsBookmarkOutlinedIcon
              sx={{ fontSize: 32, color: "rgba(26,26,46,0.12)" }}
            />
          </div>
        )}

        {/* Action overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="w-8 h-8 bg-white text-[#1A1A2E] flex items-center justify-center shadow-md hover:bg-[#C9A84C] hover:text-white transition-colors"
          >
            <EditOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 bg-white text-[#1A1A2E] flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition-colors"
          >
            <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3">
        <p className="font-semibold text-[#1A1A2E] text-sm truncate">{collection.name}</p>
        <p className="text-[#1A1A2E]/40 text-xs mt-0.5">
          {collection.productCount} product{collection.productCount !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

// ─── Product mosaic (when no cover image) ────────────────────────────────────
function ProductMosaic({
  products,
  remaining,
}: {
  products: CollectionProduct[];
  remaining: number;
}) {
  if (products.length === 1) {
    return (
      <img
        src={products[0].image ?? ""}
        alt={products[0].name}
        className="w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }

  return (
    <div className="w-full h-full grid grid-cols-2 gap-0.5">
      {products.slice(0, 4).map((p, i) => (
        <div key={p.id} className="relative overflow-hidden bg-[#EDE8E0]">
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : null}
          {i === 3 && remaining > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm font-bold">+{remaining}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
