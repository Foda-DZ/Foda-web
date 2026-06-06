import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
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
import { getSizesByCategory, isNumericSizes } from "../../utils/sizeOptions";
import type { SvgIconComponent } from "@mui/icons-material";

// ─── Constants ────────────────────────────────────────────────────────────────
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
  "& .MuiOutlinedInput-root": { borderRadius: "0.75rem", bgcolor: "#fff" },
};

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({
  title,
  desc,
  Icon,
}: {
  title: string;
  desc?: string;
  Icon: SvgIconComponent;
}) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="w-9 h-9 sl-icon-tile-gold flex items-center justify-center shrink-0">
        <Icon sx={{ fontSize: 17, color: "#C9A84C" }} />
      </div>
      <div>
        <h2 className="font-display font-bold text-[#1A1A2E] text-base leading-tight">
          {title}
        </h2>
        {desc && <p className="text-[11px] text-[#1A1A2E]/45 mt-0.5">{desc}</p>}
      </div>
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
        <div className="relative group rounded-xl border border-[#1A1A2E]/10 overflow-hidden">
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#1A1A2E]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors duration-200"
            >
              <CloudUploadIcon sx={{ fontSize: 13 }} /> {changeLabel}
            </button>
            <button
              type="button"
              onClick={() => onFile(null, "")}
              aria-label="remove"
              className="flex items-center gap-1 w-8 h-8 rounded-full justify-center bg-red-500/80 hover:bg-red-500 text-white transition-colors duration-200"
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] ${
            required
              ? "border-[#C9A84C]/40 hover:border-[#C9A84C] hover:bg-[#C9A84C]/5"
              : "border-[#1A1A2E]/15 hover:border-[#C9A84C]/50 hover:bg-[#FAF7F2]"
          }`}
        >
          <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 24, color: "rgba(201,168,76,0.5)" }} />
          <span className="text-xs font-semibold text-[#1A1A2E]/45">
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
  brand: string;
  mainCategory: string;
  subCategory: string;
  price: string;
  description: string;
  sizes: string[];
  colors: string[];
  imagePreviews: ImagePreviews;
  imageFiles: ImageFiles;
}

const defaultForm: FormState = {
  name: "",
  brand: "",
  mainCategory: "Women",
  subCategory: "Dresses",
  price: "",
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
  const { tr, isRTL } = useLang();
  const t = tr.seller.form;
  const isEdit = !!id;
  const existingProduct = isEdit
    ? sellerProducts.find((p) => p.id === id)
    : null;

  const mainCategories = [
    { value: "Men", label: t.catMen },
    { value: "Women", label: t.catWomen },
    { value: "Kids", label: t.catKids },
    { value: "Accessories", label: t.catAccessories },
    { value: "Other", label: t.catOther },
  ];

  const subCategoryKeys = [
    "Shirts", "Pants", "Dresses", "Shoes", "Jackets", "Hoodies", "Jeans",
    "Shorts", "T-Shirts", "Sweaters", "Coats", "Bags", "Hats", "Other",
  ] as const;
  const subCategories = subCategoryKeys.map((value) => ({
    value,
    label: t.subCats[value],
  }));

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
        brand: existingProduct.brand || "",
        mainCategory: existingProduct.category,
        subCategory: existingProduct.subCategory || "Other",
        price: String(existingProduct.price),
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

  // Dynamically get sizes based on selected sub-category (memoized for performance)
  const availableSizes = useMemo(
    () => getSizesByCategory(form.subCategory),
    [form.subCategory],
  );

  // Check if current sizes are numeric
  const isNumeric = useMemo(
    () => isNumericSizes(form.subCategory),
    [form.subCategory],
  );

  // Validate that selected sizes match available sizes for the category
  useEffect(() => {
    const validSizes = form.sizes.filter((size) =>
      availableSizes.includes(size),
    );
    if (validSizes.length !== form.sizes.length) {
      set("sizes", validSizes);
    }
  }, [form.subCategory, availableSizes]);

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.required;
    if (!form.brand.trim()) e.brand = t.brandRequired;
    const priceNum = parseFloat(form.price);
    if (!form.price.trim() || Number.isNaN(priceNum) || priceNum <= 0)
      e.price = t.validPrice;
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
      const priceNum = parseFloat(form.price);
      if (isEdit && id) {
        await updateProduct(id, {
          name: form.name.trim(),
          brand: form.brand.trim(),
          price: priceNum,
          mainCategory: form.mainCategory,
          subCategory: form.subCategory,
          description: form.description.trim() || undefined,
          sizes: form.sizes,
          colors: form.colors,
        });
      } else {
        await createProduct({
          name: form.name.trim(),
          brand: form.brand.trim(),
          price: priceNum,
          mainCategory: form.mainCategory,
          subCategory: form.subCategory,
          description: form.description.trim() || undefined,
          sizes: form.sizes,
          colors: form.colors,
          images: form.imageFiles.filter((f): f is File => f !== null),
        });
      }

      setSaved(true);
      // After create, send the seller to the Inventory page so they can set
      // stock for the new size × color matrix. On edit, return to products list.
      setTimeout(
        () => navigate(isEdit ? "/seller/products" : "/seller/inventory"),
        900,
      );
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
      <div className="p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sl-rise">
          <IconButton
            onClick={() => navigate("/seller/products")}
            sx={{
              borderRadius: "999px",
              width: 40,
              height: 40,
              border: "1px solid rgba(26,26,46,0.12)",
              bgcolor: "#fff",
              color: "rgba(26,26,46,0.55)",
              "&:hover": {
                borderColor: "rgba(201,168,76,0.5)",
                color: "#C9A84C",
                bgcolor: "rgba(201,168,76,0.06)",
              },
            }}
          >
            {isRTL ? (
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            ) : (
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
              {isEdit ? t.editProduct : t.addNewProduct}
            </h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-0.5">
              {isEdit ? t.editSubtitle : t.addSubtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Basic info ────────────────────────────────────────────── */}
          <div className="sl-card p-6 space-y-4 sl-rise transition-shadow duration-300 hover:shadow-md">
            <SectionHeader title={t.basicInfo} Icon={InfoOutlinedIcon} />

            {/* Row 1: Name + Brand */}
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
              <TextField
                label={t.brand}
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder={t.brandPlaceholder}
                error={!!errors.brand}
                helperText={errors.brand}
                fullWidth
                sx={inputSx}
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />
            </div>

            {/* Row 2: Categories */}
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label={t.mainCategoryLabel}
                value={form.mainCategory}
                onChange={(e) => set("mainCategory", e.target.value)}
                select
                fullWidth
                sx={inputSx}
                slotProps={{ select: { native: true } }}
              >
                {mainCategories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </TextField>
              <TextField
                label={t.subCategoryLabel}
                value={form.subCategory}
                onChange={(e) => set("subCategory", e.target.value)}
                select
                fullWidth
                sx={inputSx}
                slotProps={{ select: { native: true } }}
              >
                {subCategories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </TextField>
            </div>

            {/* Row 3: Description */}
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
          <div className="sl-card p-6 space-y-4 sl-rise transition-shadow duration-300 hover:shadow-md">
            <SectionHeader
              title={t.pricingStock}
              desc={t.pricingDesc}
              Icon={SellOutlinedIcon}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label={t.price}
                type="text"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder={t.pricePlaceholder}
                error={!!errors.price}
                helperText={errors.price}
                fullWidth
                sx={inputSx}
              />
              {/* Stock per (size, color) lives on the Inventory page — keeping
                  product creation focused on identity + visuals + variant axes. */}
            </div>
            <p className="text-[11px] text-[#1A1A2E]/45 -mt-2">
              {t.variantsHelper}
            </p>
          </div>

          {/* ── Images ────────────────────────────────────────────────── */}
          <div className="sl-card p-6 space-y-4 sl-rise transition-shadow duration-300 hover:shadow-md">
            <SectionHeader
              title={t.productImages}
              desc={t.imagesHint}
              Icon={PhotoLibraryOutlinedIcon}
            />
            {errors.images && (
              <Alert
                severity="error"
                sx={{ borderRadius: "0.75rem", py: 0.5, fontSize: "0.75rem" }}
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
                        titleAccess={t.dragToReorder}
                        sx={{
                          fontSize: 13,
                          color: "rgba(26,26,46,0.25)",
                          cursor: "grab",
                        }}
                      />
                    )}
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A2E]/55">
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
          <div className="sl-card p-6 space-y-4 sl-rise transition-shadow duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <SectionHeader
                title={t.availableSizes}
                Icon={StraightenOutlinedIcon}
              />
              <div className="flex items-center gap-2 ms-auto">
                {isNumeric && (
                  <span className="text-[10px] px-2.5 py-1 bg-[#C9A84C]/12 text-[#C9A84C] font-bold rounded-full">
                    {t.euSizes}
                  </span>
                )}
                {form.sizes.length > 0 && (
                  <span className="text-xs text-[#C9A84C] font-semibold">
                    {form.sizes.join(" · ")}
                  </span>
                )}
              </div>
            </div>
            {errors.sizes && (
              <Alert
                severity="error"
                sx={{ borderRadius: "0.75rem", py: 0.5, fontSize: "0.75rem" }}
              >
                {errors.sizes}
              </Alert>
            )}
            <div
              className={`grid gap-2 ${
                isNumeric
                  ? "grid-cols-6 sm:grid-cols-8"
                  : "grid-cols-3 sm:grid-cols-6"
              }`}
            >
              {availableSizes.map((size) => {
                const selected = form.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`h-10 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 flex items-center justify-center gap-1 ${
                      selected
                        ? "border-[#1A1A2E] bg-[#1A1A2E] text-white shadow-md"
                        : "border-[#1A1A2E]/15 text-[#1A1A2E]/60 hover:border-[#1A1A2E] hover:text-[#1A1A2E]"
                    }`}
                  >
                    {selected && <CheckIcon sx={{ fontSize: 13 }} />}
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Colors ────────────────────────────────────────────────── */}
          <div className="sl-card p-6 space-y-4 sl-rise transition-shadow duration-300 hover:shadow-md">
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
                        title={t.colorNames[c as keyof typeof t.colorNames] ?? c}
                        className="w-4 h-4 rounded-full border border-black/15 shrink-0 transition-transform duration-200 hover:scale-125"
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
                sx={{ borderRadius: "0.75rem", py: 0.5, fontSize: "0.75rem" }}
              >
                {errors.colors}
              </Alert>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COLORS_OPTIONS.map(({ name, hex }) => {
                const selected = form.colors.includes(name);
                const label =
                  t.colorNames[name as keyof typeof t.colorNames] ?? name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleColor(name)}
                    title={label}
                    className={`flex items-center gap-2 px-3 h-10 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      selected
                        ? "border-[#1A1A2E] bg-[#1A1A2E] text-white shadow-md"
                        : "border-[#1A1A2E]/15 text-[#1A1A2E]/60 hover:border-[#1A1A2E]/40 hover:text-[#1A1A2E]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border shrink-0 transition-shadow duration-200 ${
                        selected
                          ? "border-white/40 shadow-sm"
                          : "border-black/10"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* API error */}
          {apiError && (
            <Alert severity="error" sx={{ borderRadius: "0.875rem" }}>
              {apiError}
            </Alert>
          )}

          {/* ── Submit (sticky on desktop for easy access) ───────────────── */}
          <div className="flex items-center gap-3 pb-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving || saved}
              startIcon={
                saved ? (
                  <CheckIcon sx={{ fontSize: 16 }} />
                ) : saving ? (
                  <CircularProgress
                    size={14}
                    thickness={4}
                    sx={{ color: "inherit" }}
                  />
                ) : (
                  <PublishOutlinedIcon sx={{ fontSize: 16 }} />
                )
              }
              sx={{ borderRadius: "999px", minWidth: 180, px: 3, py: 1.1 }}
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
              sx={{ borderRadius: "999px", px: 3, py: 1.1 }}
            >
              {t.cancel}
            </Button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
