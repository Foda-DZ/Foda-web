import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { useSellerContext } from "../../context/SellerContext";
import { useLang } from "../../context/LangContext";
import SellerLayout from "../../components/seller/SellerLayout";
import type { SvgIconComponent } from "@mui/icons-material";

// ─── Constants ────────────────────────────────────────────────────────────────
const SIZES_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const COLORS_OPTIONS = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#f9f9f9" },
  { name: "Beige", hex: "#f5f0e1" },
  { name: "Gray", hex: "#9ca3af" },
  { name: "Brown", hex: "#7c3f1a" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Red", hex: "#dc2626" },
  { name: "Burgundy", hex: "#7f1d1d" },
  { name: "Pink", hex: "#f9a8d4" },
  { name: "Orange", hex: "#f97316" },
  { name: "Yellow", hex: "#fde047" },
  { name: "Green", hex: "#16a34a" },
  { name: "Olive", hex: "#6b7c2d" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Gold", hex: "#C9A84C" },
  { name: "Khaki", hex: "#c3b091" },
];

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 0, bgcolor: "#fff" },
};

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({
  title,
  Icon,
}: {
  title: string;
  Icon: SvgIconComponent;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-1">
      <div className="w-7 h-7 bg-[#C9A84C]/10 flex items-center justify-center">
        <Icon sx={{ fontSize: 14, color: "#C9A84C" }} />
      </div>
      <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
        {title}
      </h2>
    </div>
  );
}

// ─── Image Upload ─────────────────────────────────────────────────────────────
function ImageUpload({
  preview,
  required,
  changeLabel,
  uploadLabel,
  fileTypesLabel,
  onFile,
}: {
  preview: string;
  required?: boolean;
  changeLabel: string;
  uploadLabel: string;
  fileTypesLabel: string;
  onFile: (file: File | null, preview: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onFile(file, reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {preview ? (
        <div className="relative group border border-[#1A1A2E]/10 overflow-hidden">
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#1A1A2E]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors duration-200"
            >
              <CloudUploadIcon sx={{ fontSize: 11 }} /> {changeLabel}
            </button>
            <button
              type="button"
              onClick={() => onFile(null, "")}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs transition-colors duration-200"
            >
              <DeleteIcon sx={{ fontSize: 11 }} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full h-36 border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] ${
            required
              ? "border-[#C9A84C]/40 hover:border-[#C9A84C] hover:bg-[#C9A84C]/5"
              : "border-[#1A1A2E]/15 hover:border-[#C9A84C]/50 hover:bg-[#FAF7F2]"
          }`}
        >
          <ImageIcon sx={{ fontSize: 22, color: "rgba(26,26,46,0.25)" }} />
          <span className="text-xs font-semibold text-[#1A1A2E]/40">
            {uploadLabel}
            {required ? " *" : ""}
          </span>
          <span className="text-[10px] text-[#1A1A2E]/25">
            {fileTypesLabel}
          </span>
        </button>
      )}
    </div>
  );
}

// ─── Form state ───────────────────────────────────────────────────────────────
type ImagePreviews = [string, string, string, string, string];
type ImageFiles = [
  File | null,
  File | null,
  File | null,
  File | null,
  File | null,
];

interface FormState {
  name: string;
  mainCategory: string;
  subCategory: string;
  price: string;
  stock: string;
  description: string;
  sizes: string[];
  colors: string[];
  imagePreviews: ImagePreviews;
  imageFiles: ImageFiles;
}

const defaultForm: FormState = {
  name: "",
  mainCategory: "Women",
  subCategory: "Dresses",
  price: "",
  stock: "",
  description: "",
  sizes: [],
  colors: [],
  imagePreviews: ["", "", "", "", ""],
  imageFiles: [null, null, null, null, null],
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createProduct, updateProduct, sellerProducts } = useSellerContext();
  const { tr } = useLang();
  const t = tr.seller.form;
  const isEdit = !!id;
  const existingProduct = isEdit
    ? sellerProducts.find((p) => p.id === id)
    : null;

  const mainCategories = [
    { value: "Men", label: "Men" },
    { value: "Women", label: "Women" },
    { value: "Kids", label: "Kids" },
    { value: "Accessories", label: "Accessories" },
    { value: "Other", label: "Other" },
  ];

  const subCategories = [
    { value: "Shirts", label: "Shirts" },
    { value: "Pants", label: "Pants" },
    { value: "Dresses", label: "Dresses" },
    { value: "Shoes", label: "Shoes" },
    { value: "Jackets", label: "Jackets" },
    { value: "Hoodies", label: "Hoodies" },
    { value: "Jeans", label: "Jeans" },
    { value: "Shorts", label: "Shorts" },
    { value: "T-Shirts", label: "T-Shirts" },
    { value: "Sweaters", label: "Sweaters" },
    { value: "Coats", label: "Coats" },
    { value: "Bags", label: "Bags" },
    { value: "Hats", label: "Hats" },
    { value: "Other", label: "Other" },
  ];

  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && existingProduct) {
      setForm({
        name: existingProduct.name,
        mainCategory: existingProduct.category,
        subCategory: existingProduct.subCategory || "Other",
        price: String(existingProduct.price),
        stock: String(existingProduct.stock),
        description: existingProduct.description || "",
        sizes: existingProduct.sizes,
        colors: existingProduct.colors,
        imagePreviews: [
          existingProduct.images[0] || "",
          existingProduct.images[1] || "",
          existingProduct.images[2] || "",
          existingProduct.images[3] || "",
          existingProduct.images[4] || "",
        ] as ImagePreviews,
        imageFiles: [null, null, null, null, null],
      });
    }
  }, [isEdit, existingProduct]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleImage =
    (idx: 0 | 1 | 2 | 3 | 4) => (file: File | null, preview: string) => {
      const previews = [...form.imagePreviews] as ImagePreviews;
      const files = [...form.imageFiles] as ImageFiles;
      previews[idx] = preview;
      files[idx] = file;
      setForm((f) => ({ ...f, imagePreviews: previews, imageFiles: files }));
    };

  const toggleSize = (size: string) =>
    set(
      "sizes",
      form.sizes.includes(size)
        ? form.sizes.filter((s) => s !== size)
        : [...form.sizes, size],
    );

  const toggleColor = (color: string) =>
    set(
      "colors",
      form.colors.includes(color)
        ? form.colors.filter((c) => c !== color)
        : [...form.colors, color],
    );

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.required;
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = t.validPrice;
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = t.validStock;
    if (!form.sizes.length) e.sizes = t.selectSize;
    if (!form.colors.length) e.colors = t.selectColor;
    if (!form.imageFiles[0] && !(isEdit && form.imagePreviews[0]))
      e.images = t.imageRequired;
    return e;
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setApiError("");
    setSaving(true);

    try {
      if (isEdit && id) {
        await updateProduct(id, {
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          mainCategory: form.mainCategory,
          subCategory: form.subCategory,
          description: form.description.trim() || undefined,
          sizes: form.sizes,
          colors: form.colors,
        });
      } else {
        await createProduct({
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          mainCategory: form.mainCategory,
          subCategory: form.subCategory,
          description: form.description.trim() || undefined,
          sizes: form.sizes,
          colors: form.colors,
          images: form.imageFiles.filter((f): f is File => f !== null),
        });
      }

      setSaved(true);
      setTimeout(() => navigate("/seller/products"), 900);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : isEdit
            ? t.failedUpdate
            : t.failedAdd,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerLayout>
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <IconButton
            onClick={() => navigate("/seller/products")}
            sx={{
              borderRadius: 0,
              width: 36,
              height: 36,
              border: "1px solid rgba(26,26,46,0.15)",
              color: "rgba(26,26,46,0.5)",
              "&:hover": {
                borderColor: "rgba(201,168,76,0.5)",
                color: "#C9A84C",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
              {isEdit ? t.editProduct : t.addNewProduct}
            </h1>
            <p className="text-[#1A1A2E]/50 text-sm">
              {isEdit ? t.editSubtitle : t.addSubtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Basic info ────────────────────────────────────────────── */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4 transition-all duration-300 hover:shadow-sm">
            <SectionHeader title={t.basicInfo} Icon={InfoOutlinedIcon} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label={t.productName}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder={t.productNamePlaceholder}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                sx={inputSx}
              />
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Main Category"
                  value={form.mainCategory}
                  onChange={(e) => set("mainCategory", e.target.value)}
                  select
                  fullWidth
                  sx={inputSx}
                  slotProps={{ select: { native: true } }}
                >
                  {mainCategories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Sub Category"
                  value={form.subCategory}
                  onChange={(e) => set("subCategory", e.target.value)}
                  select
                  fullWidth
                  sx={inputSx}
                  slotProps={{ select: { native: true } }}
                >
                  {subCategories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </TextField>
              </div>
            </div>
            <TextField
              label={t.description}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder={t.descriptionPlaceholder}
              multiline
              rows={3}
              fullWidth
              sx={inputSx}
            />
          </div>

          {/* ── Pricing & Stock ───────────────────────────────────────── */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4 transition-all duration-300 hover:shadow-sm">
            <SectionHeader title={t.pricingStock} Icon={SellOutlinedIcon} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label={t.price}
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="8900"
                error={!!errors.price}
                helperText={errors.price}
                fullWidth
                sx={inputSx}
              />
              <TextField
                label={t.stockQty}
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="50"
                error={!!errors.stock}
                helperText={errors.stock}
                fullWidth
                sx={inputSx}
              />
            </div>
          </div>

          {/* ── Images ────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4 transition-all duration-300 hover:shadow-sm">
            <SectionHeader
              title={t.productImages}
              Icon={PhotoLibraryOutlinedIcon}
            />
            {errors.images && (
              <Alert
                severity="error"
                sx={{ borderRadius: 0, py: 0.5, fontSize: "0.75rem" }}
              >
                {errors.images}
              </Alert>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {([0, 1, 2, 3, 4] as const).map((i) => (
                <div
                  key={i}
                  draggable={!!form.imagePreviews[i]}
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={() => {
                    if (dragIdx !== null && dragIdx !== i) {
                      const previews = [...form.imagePreviews] as ImagePreviews;
                      const files = [...form.imageFiles] as ImageFiles;
                      [previews[dragIdx], previews[i]] = [
                        previews[i],
                        previews[dragIdx],
                      ];
                      [files[dragIdx], files[i]] = [files[i], files[dragIdx]];
                      setForm((f) => ({
                        ...f,
                        imagePreviews: previews,
                        imageFiles: files,
                      }));
                    }
                    setDragIdx(null);
                  }}
                  onDragEnd={() => setDragIdx(null)}
                  className={`transition-all duration-300 ${dragIdx === i ? "opacity-50 scale-95" : "hover:scale-[1.02]"}`}
                >
                  <div className="flex items-center gap-1 mb-1.5">
                    {form.imagePreviews[i] && (
                      <DragIndicatorIcon
                        sx={{
                          fontSize: 12,
                          color: "rgba(26,26,46,0.25)",
                          cursor: "grab",
                        }}
                      />
                    )}
                    <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/60">
                      {i === 0 ? t.mainImage : `${t.image} ${i + 1}`}
                      {i === 0 && (
                        <span className="text-red-400 ms-0.5">*</span>
                      )}
                    </p>
                  </div>
                  <ImageUpload
                    preview={form.imagePreviews[i]}
                    required={i === 0}
                    changeLabel={t.change}
                    uploadLabel={t.clickUpload}
                    fileTypesLabel={t.fileTypes}
                    onFile={handleImage(i)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Sizes ─────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4 transition-all duration-300 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <SectionHeader
                title={t.availableSizes}
                Icon={StraightenOutlinedIcon}
              />
              {form.sizes.length > 0 && (
                <span className="text-xs text-[#C9A84C] font-semibold animate-in">
                  {form.sizes.join(" · ")}
                </span>
              )}
            </div>
            {errors.sizes && (
              <Alert
                severity="error"
                sx={{ borderRadius: 0, py: 0.5, fontSize: "0.75rem" }}
              >
                {errors.sizes}
              </Alert>
            )}
            <div className="flex flex-wrap gap-2">
              {SIZES_OPTIONS.map((size) => {
                const selected = form.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 h-9 text-xs font-semibold tracking-wide border transition-all duration-200 ${
                      selected
                        ? "border-[#1A1A2E] bg-[#1A1A2E] text-white scale-105 shadow-md"
                        : "border-[#1A1A2E]/20 text-[#1A1A2E]/60 hover:border-[#1A1A2E] hover:text-[#1A1A2E] hover:scale-105"
                    }`}
                  >
                    {selected && (
                      <CheckIcon
                        sx={{ fontSize: 11, mr: 0.5, verticalAlign: "middle" }}
                      />
                    )}
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Colors ────────────────────────────────────────────────── */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4 transition-all duration-300 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <SectionHeader
                title={t.availableColors}
                Icon={PaletteOutlinedIcon}
              />
              {form.colors.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {form.colors.map((c) => {
                    const opt = COLORS_OPTIONS.find((o) => o.name === c);
                    return (
                      <span
                        key={c}
                        title={c}
                        className="w-4 h-4 rounded-full border border-black/15 flex-shrink-0 transition-transform duration-200 hover:scale-125"
                        style={{ backgroundColor: opt?.hex ?? c.toLowerCase() }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            {errors.colors && (
              <Alert
                severity="error"
                sx={{ borderRadius: 0, py: 0.5, fontSize: "0.75rem" }}
              >
                {errors.colors}
              </Alert>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COLORS_OPTIONS.map(({ name, hex }) => {
                const selected = form.colors.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleColor(name)}
                    className={`flex items-center gap-2 px-3 h-9 text-xs font-semibold border transition-all duration-200 ${
                      selected
                        ? "border-[#1A1A2E] bg-[#1A1A2E] text-white scale-105 shadow-md"
                        : "border-[#1A1A2E]/15 text-[#1A1A2E]/60 hover:border-[#1A1A2E]/40 hover:text-[#1A1A2E] hover:scale-105"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-shadow duration-200 ${
                        selected
                          ? "border-white/40 shadow-sm"
                          : "border-black/10"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                    <span className="truncate">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* API error */}
          {apiError && (
            <Alert severity="error" sx={{ borderRadius: 0 }}>
              {apiError}
            </Alert>
          )}

          {/* ── Submit ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-4 pb-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving || saved}
              startIcon={
                saved ? (
                  <CheckIcon sx={{ fontSize: 15 }} />
                ) : saving ? (
                  <CircularProgress
                    size={13}
                    thickness={4}
                    sx={{ color: "inherit" }}
                  />
                ) : (
                  <PublishOutlinedIcon sx={{ fontSize: 15 }} />
                )
              }
              sx={{ borderRadius: 0, minWidth: 160 }}
            >
              {saved
                ? isEdit
                  ? t.productUpdated
                  : t.productAdded
                : isEdit
                  ? t.saveChanges
                  : t.publishProduct}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={() => navigate("/seller/products")}
              disabled={saving || saved}
              sx={{ borderRadius: 0 }}
            >
              {t.cancel}
            </Button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
