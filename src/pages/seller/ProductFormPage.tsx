import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { useSellerContext } from "../../context/SellerContext";
import SellerLayout from "../../components/seller/SellerLayout";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Men", "Women", "Kids", "Accessories", "Other"];
const SIZES_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const COLORS_OPTIONS = [
  { name: "Black",    hex: "#1a1a1a" },
  { name: "White",    hex: "#f9f9f9" },
  { name: "Beige",    hex: "#f5f0e1" },
  { name: "Gray",     hex: "#9ca3af" },
  { name: "Brown",    hex: "#7c3f1a" },
  { name: "Navy",     hex: "#1e3a5f" },
  { name: "Red",      hex: "#dc2626" },
  { name: "Burgundy", hex: "#7f1d1d" },
  { name: "Pink",     hex: "#f9a8d4" },
  { name: "Orange",   hex: "#f97316" },
  { name: "Yellow",   hex: "#fde047" },
  { name: "Green",    hex: "#16a34a" },
  { name: "Olive",    hex: "#6b7c2d" },
  { name: "Blue",     hex: "#2563eb" },
  { name: "Teal",     hex: "#0d9488" },
  { name: "Purple",   hex: "#7c3aed" },
  { name: "Gold",     hex: "#C9A84C" },
  { name: "Khaki",    hex: "#c3b091" },
];

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 0, bgcolor: "#fff" },
};

// ─── Image Upload ─────────────────────────────────────────────────────────────
function ImageUpload({
  preview,
  required,
  onFile,
}: {
  preview: string;
  required?: boolean;
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
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-[#1A1A2E]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors duration-200"
            >
              <CloudUploadIcon sx={{ fontSize: 11 }} /> Change
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
          className={`w-full h-36 border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
            required
              ? "border-[#C9A84C]/40 hover:border-[#C9A84C] hover:bg-[#C9A84C]/5"
              : "border-[#1A1A2E]/15 hover:border-[#C9A84C]/50 hover:bg-[#FAF7F2]"
          }`}
        >
          <ImageIcon sx={{ fontSize: 22, color: "rgba(26,26,46,0.25)" }} />
          <span className="text-xs font-semibold text-[#1A1A2E]/40">
            Click to upload{required ? " *" : ""}
          </span>
          <span className="text-[10px] text-[#1A1A2E]/25">
            JPG · PNG · WEBP
          </span>
        </button>
      )}
    </div>
  );
}

// ─── Form state ───────────────────────────────────────────────────────────────
interface FormState {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  sizes: string[];
  colors: string[];
  imagePreviews: [string, string, string];
  imageFiles: [File | null, File | null, File | null];
}

const defaultForm: FormState = {
  name: "",
  category: "Women",
  price: "",
  stock: "",
  description: "",
  sizes: ["M", "L"],
  colors: ["Black", "White"],
  imagePreviews: ["", "", ""],
  imageFiles: [null, null, null],
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProductFormPage() {
  const navigate = useNavigate();
  const { createProduct } = useSellerContext();

  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleImage =
    (idx: 0 | 1 | 2) => (file: File | null, preview: string) => {
      const previews = [...form.imagePreviews] as [string, string, string];
      const files = [...form.imageFiles] as [
        File | null,
        File | null,
        File | null,
      ];
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
    if (!form.name.trim()) e.name = "Required.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price.";
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Enter a valid stock quantity.";
    if (!form.sizes.length) e.sizes = "Select at least one size.";
    if (!form.colors.length) e.colors = "Select at least one color.";
    if (!form.imageFiles[0])
      e.images = "At least one product image is required.";
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
      await createProduct({
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        description: form.description.trim() || undefined,
        sizes: form.sizes,
        colors: form.colors,
        images: form.imageFiles.filter((f): f is File => f !== null),
      });

      setSaved(true);
      setTimeout(() => navigate("/seller/products"), 900);
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Failed to add product.",
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
              Add New Product
            </h1>
            <p className="text-[#1A1A2E]/50 text-sm">
              Fill in the details to list a new product.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
              Basic Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Product Name *"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Robe Élégante"
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                sx={inputSx}
              />
              <TextField
                label="Category *"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                select
                fullWidth
                sx={inputSx}
                slotProps={{ select: { native: true } }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </TextField>
            </div>
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe your product… (optional)"
              multiline
              rows={3}
              fullWidth
              sx={inputSx}
            />
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
              Pricing & Stock
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Price (DZD) *"
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
                label="Stock Quantity *"
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

          {/* Images */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
              Product Images
            </h2>
            {errors.images && (
              <Alert
                severity="error"
                sx={{ borderRadius: 0, py: 0.5, fontSize: "0.75rem" }}
              >
                {errors.images}
              </Alert>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([0, 1, 2] as const).map((i) => (
                <div key={i}>
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/60 mb-1.5">
                    {i === 0 ? "Main Image" : `Image ${i + 1}`}
                    {i === 0 && <span className="text-red-400 ms-0.5">*</span>}
                  </p>
                  <ImageUpload
                    preview={form.imagePreviews[i]}
                    required={i === 0}
                    onFile={handleImage(i)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
                Available Sizes <span className="text-red-400">*</span>
              </h2>
              {form.sizes.length > 0 && (
                <span className="text-xs text-[#C9A84C] font-semibold">
                  {form.sizes.join(" · ")}
                </span>
              )}
            </div>
            {errors.sizes && (
              <Alert severity="error" sx={{ borderRadius: 0, py: 0.5, fontSize: "0.75rem" }}>
                {errors.sizes}
              </Alert>
            )}
            <div className="flex flex-wrap gap-2">
              {SIZES_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 h-9 text-xs font-semibold tracking-wide border transition-all duration-200 ${
                    form.sizes.includes(size)
                      ? "border-[#1A1A2E] bg-[#1A1A2E] text-white"
                      : "border-[#1A1A2E]/20 text-[#1A1A2E]/60 hover:border-[#1A1A2E] hover:text-[#1A1A2E]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
                Available Colors <span className="text-red-400">*</span>
              </h2>
              {form.colors.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {form.colors.map((c) => {
                    const opt = COLORS_OPTIONS.find((o) => o.name === c);
                    return (
                      <span
                        key={c}
                        title={c}
                        className="w-4 h-4 rounded-full border border-black/15 flex-shrink-0"
                        style={{ backgroundColor: opt?.hex ?? c.toLowerCase() }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            {errors.colors && (
              <Alert severity="error" sx={{ borderRadius: 0, py: 0.5, fontSize: "0.75rem" }}>
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
                        ? "border-[#1A1A2E] bg-[#1A1A2E] text-white"
                        : "border-[#1A1A2E]/15 text-[#1A1A2E]/60 hover:border-[#1A1A2E]/40 hover:text-[#1A1A2E]"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
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

          {/* Submit */}
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
                ) : undefined
              }
              sx={{ borderRadius: 0, minWidth: 160 }}
            >
              {saved ? "Product Added!" : "Publish Product"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={() => navigate("/seller/products")}
              disabled={saving || saved}
              sx={{ borderRadius: 0 }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
