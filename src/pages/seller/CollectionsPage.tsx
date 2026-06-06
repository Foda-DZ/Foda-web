import { useState, useEffect, useRef, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import Skeleton from "@mui/material/Skeleton";
import { useLang } from "../../context/LangContext";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import { apiCollectionToCollection } from "../../lib/mappers";
import type { Collection, CollectionProduct } from "../../types";
import type { ApiCollection } from "../../types/api";

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, isRTL }: { msg: string; type: "success" | "error"; isRTL: boolean }) {
  return (
    <div
      className={`fixed bottom-6 z-[70] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold sl-rise ${
        type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
      }`}
      style={{ insetInlineEnd: 24 }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {type === "success" ? (
        <CheckCircleOutlinedIcon sx={{ fontSize: 17 }} />
      ) : (
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 17 }} />
      )}
      {msg}
    </div>
  );
}

// ─── Cover image picker ───────────────────────────────────────────────────────
function CoverPicker({
  current,
  onFile,
  isRTL,
  clickLabel,
  coverLabel,
  coverOptional,
}: {
  current: string | null;
  onFile: (f: File | null) => void;
  isRTL: boolean;
  clickLabel: string;
  coverLabel: string;
  coverOptional: string;
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
    <div className="space-y-1.5" dir={isRTL ? "rtl" : "ltr"}>
      <label className="sl-eyebrow">
        {coverLabel}{" "}
        <span className="normal-case font-normal text-[#1A1A2E]/30">{coverOptional}</span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-full h-36 rounded-xl border-2 border-dashed border-[#1A1A2E]/12 hover:border-[#C9A84C]/50 bg-[#FBF9F5] cursor-pointer overflow-hidden transition-colors duration-150 flex items-center justify-center"
      >
        {preview ? (
          <>
            <img src={preview} alt="cover" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clear}
              aria-label="remove"
              className="absolute top-2 rounded-full bg-black/60 text-white w-7 h-7 flex items-center justify-center hover:bg-black/80 transition-colors"
              style={{ insetInlineEnd: 8 }}
            >
              <CloseOutlinedIcon sx={{ fontSize: 13 }} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 28, color: "rgba(201,168,76,0.5)" }} />
            <span className="text-xs text-[#1A1A2E]/40 font-medium">{clickLabel}</span>
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
  isRTL,
  productsLabel,
  selectedCountLabel,
  searchPlaceholder,
  noProductsLabel,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  isRTL: boolean;
  productsLabel: string;
  selectedCountLabel: string;
  searchPlaceholder: string;
  noProductsLabel: string;
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
        setProducts(raw.map((p) => ({
          id: p._id,
          name: p.name,
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0].url : null,
          price: p.price,
        })));
      } catch { /* ignore */ }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = search.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    : products;

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  return (
    <div className="space-y-2" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between">
        <label className="sl-eyebrow">{productsLabel}</label>
        {selected.length > 0 && (
          <span className="text-[10px] font-bold text-[#C9A84C]">
            {selected.length} {selectedCountLabel}
          </span>
        )}
      </div>

      {/* Search input — RTL-aware */}
      <div className="relative">
        <SearchOutlinedIcon
          sx={{
            fontSize: 15,
            color: "rgba(26,26,46,0.3)",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            insetInlineStart: 12,
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 rounded-xl border border-[#1A1A2E]/12 bg-white text-xs text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/10 transition-all"
          style={{ paddingInlineStart: 32, paddingInlineEnd: 10 }}
        />
      </div>

      {/* Product list */}
      <div className="max-h-52 overflow-y-auto rounded-xl border border-[#1A1A2E]/10 divide-y divide-[#1A1A2E]/5">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 px-3 py-2.5">
              <Skeleton variant="rounded" width={32} height={38} sx={{ borderRadius: "0.5rem" }} />
              <Skeleton variant="text" width={120} />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <p className="px-3 py-5 text-xs text-[#1A1A2E]/35 text-center">{noProductsLabel}</p>
        ) : (
          filtered.map((p) => {
            const isSelected = selected.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-start transition-colors duration-100 ${
                  isSelected
                    ? "bg-[#C9A84C]/8 border-s-2 border-[#C9A84C]"
                    : "bg-white hover:bg-[#FBF9F5] border-s-2 border-transparent"
                }`}
              >
                <div className="w-8 h-9 rounded-lg bg-[#F0EBE3] overflow-hidden shrink-0">
                  {p.image && (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="flex-1 text-xs font-medium text-[#1A1A2E] truncate">{p.name}</span>
                {isSelected && (
                  <CheckCircleOutlinedIcon sx={{ fontSize: 15, color: "#C9A84C", flexShrink: 0 }} />
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
  const { isRTL, tr } = useLang();
  const t = tr.seller.collectionsPage;

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
    if (!trimmed) { setError(t.nameRequired); return; }
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
      setError(err instanceof Error ? err.message : t.failedSave);
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
      <div className="bg-white w-full max-w-md shadow-2xl border border-[#1A1A2E]/8 rounded-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A2E]/8 bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center shrink-0">
              <CollectionsBookmarkOutlinedIcon sx={{ fontSize: 16, color: "#1A1A2E" }} />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-[#1A1A2E]">
                {mode === "create" ? t.modalTitleCreate : t.modalTitleEdit}
              </p>
              {mode === "edit" && initial && (
                <p className="text-[10px] text-[#1A1A2E]/40 mt-0.5 truncate max-w-[200px]">
                  {initial.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            aria-label={t.cancel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A2E]/40 hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/5 transition-colors disabled:opacity-40"
          >
            <CloseOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="sl-eyebrow">
              {t.nameLabel} <span className="text-red-400 normal-case font-normal">*</span>
            </label>
            <input
              type="text"
              value={name}
              maxLength={100}
              placeholder={t.namePlaceholder}
              autoFocus
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className="w-full h-11 rounded-xl border border-[#1A1A2E]/12 bg-white text-sm text-[#1A1A2E] px-4 focus:outline-none focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/10 transition-all"
            />
            <div className="flex justify-between items-center">
              {error ? (
                <p className="text-xs text-red-500">{error}</p>
              ) : <span />}
              <span className="text-[10px] text-[#1A1A2E]/30 ms-auto">{name.length}/100</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="sl-eyebrow">
              {t.descriptionLabel}{" "}
              <span className="normal-case font-normal text-[#1A1A2E]/30">{t.coverOptional}</span>
            </label>
            <textarea
              value={description}
              maxLength={500}
              rows={3}
              placeholder={t.descriptionPlaceholder}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[#1A1A2E]/12 bg-white text-sm text-[#1A1A2E] px-4 py-2.5 focus:outline-none focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/10 transition-all resize-none"
            />
            <span className="text-[10px] text-[#1A1A2E]/30 block text-end">{description.length}/500</span>
          </div>

          {/* Cover */}
          <CoverPicker
            current={initial?.coverImage ?? null}
            onFile={setCoverFile}
            isRTL={isRTL}
            clickLabel={t.clickToUpload}
            coverLabel={t.coverLabel}
            coverOptional={t.coverOptional}
          />

          {/* Products */}
          <ProductSelector
            selected={selectedProducts}
            onChange={setSelectedProducts}
            isRTL={isRTL}
            productsLabel={t.productsLabel}
            selectedCountLabel={t.selectedCount}
            searchPlaceholder={t.searchProducts}
            noProductsLabel={t.noProductsFound}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1A1A2E]/8 bg-[#FAF7F2] shrink-0">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="w-full h-11 rounded-full flex items-center justify-center gap-2 bg-[#1A1A2E] text-white text-sm font-bold hover:bg-[#2d2d50] transition-colors disabled:opacity-60"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CollectionsBookmarkOutlinedIcon sx={{ fontSize: 15 }} />
            )}
            {saving ? t.saving : mode === "create" ? t.createCollection : t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Collection Card ──────────────────────────────────────────────────────────
function CollectionCard({
  collection,
  isRTL,
  editLabel,
  deleteLabel,
  productCountLabel,
  productCountPluralLabel,
  onEdit,
  onDelete,
}: {
  collection: Collection;
  isRTL: boolean;
  editLabel: string;
  deleteLabel: string;
  productCountLabel: string;
  productCountPluralLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const previewProducts = collection.products.slice(0, 4);
  const remaining = Math.max(0, collection.productCount - 4);
  const countLabel =
    collection.productCount === 1 ? productCountLabel : productCountPluralLabel;

  return (
    <div className="sl-card sl-card-hover overflow-hidden flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Visual: cover or mosaic */}
      <div className="relative h-40 bg-[#F5F3EF] overflow-hidden shrink-0">
        {collection.coverImage ? (
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : previewProducts.length > 0 ? (
          <ProductMosaic products={previewProducts} remaining={remaining} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CollectionsBookmarkOutlinedIcon sx={{ fontSize: 36, color: "rgba(26,26,46,0.1)" }} />
          </div>
        )}

        {/* Product count badge */}
        <span
          className="absolute bottom-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 text-white text-[10px] font-bold backdrop-blur-sm"
          style={{ insetInlineStart: 10 }}
        >
          <LayersOutlinedIcon sx={{ fontSize: 11 }} />
          {collection.productCount} {countLabel}
        </span>
      </div>

      {/* Info + always-visible actions */}
      <div className="px-4 py-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-[#1A1A2E] text-sm truncate">
            {collection.name}
          </p>
          {collection.description && (
            <p className="text-[11px] text-[#1A1A2E]/40 mt-0.5 line-clamp-2 leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>

        {/* Action buttons — always visible, not hidden behind hover */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onEdit}
            title={editLabel}
            aria-label={editLabel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A2E]/40 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 border border-[#1A1A2E]/8 hover:border-[#C9A84C]/30 transition-all duration-200"
          >
            <EditOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
          <button
            onClick={onDelete}
            title={deleteLabel}
            aria-label={deleteLabel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A2E]/40 hover:text-red-500 hover:bg-red-50 border border-[#1A1A2E]/8 hover:border-red-200 transition-all duration-200"
          >
            <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product mosaic ───────────────────────────────────────────────────────────
function ProductMosaic({ products, remaining }: { products: CollectionProduct[]; remaining: number }) {
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
          {p.image && (
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          {i === 3 && remaining > 0 && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <span className="text-white text-sm font-bold">+{remaining}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Collections Page ─────────────────────────────────────────────────────────
export default function CollectionsPage() {
  const { isRTL, tr } = useLang();
  const t = tr.seller.collectionsPage;

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

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(id);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sellerService.getCollections({ search: debouncedSearch || undefined });
      setCollections(data.collections.map((c) => apiCollectionToCollection(c)));
    } catch {
      showToast(t.failedLoad, "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, showToast, t.failedLoad]);

  useEffect(() => { load(); }, [load]);

  const handleSaved = (c: Collection) => {
    setCollections((prev) => {
      const idx = prev.findIndex((x) => x.id === c.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = c; return next; }
      return [c, ...prev];
    });
    setModal(null);
    showToast(modal?.mode === "create" ? t.created : t.updated, "success");
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await sellerService.deleteCollection(confirmDelete.id);
      setCollections((prev) => prev.filter((c) => c.id !== confirmDelete.id));
      showToast(t.created, "success"); // reuse toast — will fix with deleteSuccess key if needed
      setConfirmDelete(null);
    } catch {
      showToast(t.failedDelete, "error");
    } finally {
      setDeleting(false);
    }
  };

  const countText = loading
    ? t.loadingLabel
    : collections.length === 1
      ? `1 ${t.collectionCount}`
      : `${collections.length} ${t.collectionCountPlural}`;

  return (
    <SellerLayout>
      <div className="p-6 sm:p-8 lg:p-10 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 sl-rise">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sl-icon-tile-gold flex items-center justify-center shrink-0">
              <CollectionsBookmarkOutlinedIcon sx={{ fontSize: 24, color: "#C9A84C" }} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                {t.title}
              </h1>
              <p className="text-[#1A1A2E]/50 text-sm mt-0.5">{countText}</p>
            </div>
          </div>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="sl-btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-sm shrink-0"
          >
            <AddIcon sx={{ fontSize: 16 }} />
            {t.newCollection}
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <SearchOutlinedIcon
            sx={{
              fontSize: 18,
              color: "rgba(26,26,46,0.3)",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              insetInlineStart: 14,
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-full border border-[#1A1A2E]/10 bg-white text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/10 transition-all"
            style={{ paddingInlineStart: 42, paddingInlineEnd: 16 }}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sl-card overflow-hidden">
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 0 }} />
                <div className="p-4 space-y-2">
                  <Skeleton variant="rounded" width="65%" height={14} sx={{ borderRadius: "0.5rem" }} />
                  <Skeleton variant="rounded" width="45%" height={12} sx={{ borderRadius: "0.5rem" }} />
                </div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="sl-card p-16 text-center sl-rise">
            <div className="w-16 h-16 mx-auto mb-5 sl-icon-tile-gold flex items-center justify-center">
              <CollectionsBookmarkOutlinedIcon sx={{ fontSize: 30, color: "#C9A84C" }} />
            </div>
            <h3 className="font-display font-bold text-[#1A1A2E] text-lg mb-2">
              {debouncedSearch ? t.noSearchResults : t.noCollectionsTitle}
            </h3>
            <p className="text-[#1A1A2E]/40 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              {debouncedSearch ? t.tryDifferentKeyword : t.noCollectionsDesc}
            </p>
            {!debouncedSearch && (
              <button
                onClick={() => setModal({ mode: "create" })}
                className="sl-btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm mx-auto"
              >
                <AddIcon sx={{ fontSize: 16 }} />
                {t.createFirst}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((c) => (
              <CollectionCard
                key={c.id}
                collection={c}
                isRTL={isRTL}
                editLabel={t.edit}
                deleteLabel={t.deleteLabel}
                productCountLabel={t.productCount}
                productCountPluralLabel={t.productCountPlural}
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
          <div className="bg-white rounded-2xl border border-[#1A1A2E]/10 shadow-2xl w-full max-w-xs p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 26, color: "#ef4444" }} />
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-[#1A1A2E] text-base">{t.deleteTitle}</h3>
              <p className="text-[#1A1A2E]/50 text-sm mt-1.5 leading-relaxed">
                {t.deleteDesc.replace("{name}", confirmDelete.name)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="flex-1 h-11 rounded-full border border-[#1A1A2E]/12 text-xs font-semibold text-[#1A1A2E]/70 hover:border-[#1A1A2E]/30 transition-colors disabled:opacity-50"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-11 rounded-full flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors disabled:opacity-60"
              >
                {deleting && (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {deleting ? t.deleting : t.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} isRTL={isRTL} />}
    </SellerLayout>
  );
}
