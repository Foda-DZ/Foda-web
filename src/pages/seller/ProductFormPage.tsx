import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, AlertCircle, Check, Upload, ImageIcon } from "lucide-react";
import { useSellerContext } from "../../context/SellerContext";
import SellerLayout from "../../components/seller/SellerLayout";
import type { Product, ProductColor } from "../../types";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Women", "Men", "Kids", "Accessories"];
const SIZES_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const BADGE_OPTIONS = [
  { value: "", label: "None" },
  { value: "New", label: "New", color: "bg-[#C9A84C] text-[#1A1A2E]" },
  { value: "Sale", label: "Sale", color: "bg-red-500 text-white" },
  { value: "Limited", label: "Limited", color: "bg-[#1A1A2E] text-white" },
];
const BADGE_COLORS: Record<string, string> = {
  New: "bg-[#C9A84C] text-[#1A1A2E]",
  Sale: "bg-red-500 text-white",
  Limited: "bg-[#1A1A2E] text-white",
  "": "",
};

// ─── Helper components ────────────────────────────────────────────────────────
function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-semibold tracking-widest uppercase text-[#1A1A2E]/60 mb-1.5">
      {label}
      {required && <span className="text-red-400 ms-0.5">*</span>}
    </label>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <AlertCircle size={11} /> {error}
    </p>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 px-3 border border-[#1A1A2E]/15 bg-white text-[#1A1A2E] placeholder-[#1A1A2E]/30 text-sm outline-none focus:border-[#C9A84C]/60 transition-colors duration-200"
    />
  );
}

// ─── Image Upload component ───────────────────────────────────────────────────
function ImageUpload({
  value,
  onChange,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = ""; // allow re-selecting same file
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
      {value ? (
        <div className="relative group border border-[#1A1A2E]/10 overflow-hidden">
          <img
            src={value}
            alt="preview"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-[#1A1A2E]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors duration-200"
            >
              <Upload size={11} /> Change
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs transition-colors duration-200"
            >
              <Trash2 size={11} />
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
          <ImageIcon size={22} className="text-[#1A1A2E]/25" />
          <span className="text-xs font-semibold text-[#1A1A2E]/40">
            Click to upload{required ? " *" : ""}
          </span>
          <span className="text-[10px] text-[#1A1A2E]/25">JPG · PNG · WEBP</span>
        </button>
      )}
    </div>
  );
}

// ─── Form state type ──────────────────────────────────────────────────────────
interface FormState {
  name: string;
  brand: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  description: string;
  badge: string;
  images: [string, string, string];
  sizes: string[];
  colors: [ProductColor, ProductColor, ProductColor];
  details: [string, string, string, string];
}

const defaultForm: FormState = {
  name: "",
  brand: "",
  category: "Women",
  price: "",
  originalPrice: "",
  stock: "",
  description: "",
  badge: "",
  images: ["", "", ""],
  sizes: ["M", "L"],
  colors: [
    { name: "Black", hex: "#1A1A2E" },
    { name: "", hex: "#ffffff" },
    { name: "", hex: "#ffffff" },
  ],
  details: ["", "", "", ""],
};

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price.toString(),
    originalPrice: p.originalPrice?.toString() ?? "",
    stock: p.stock.toString(),
    description: p.description,
    badge: p.badge ?? "",
    images: [
      p.images[0] ?? "",
      p.images[1] ?? "",
      p.images[2] ?? "",
    ],
    sizes: p.sizes,
    colors: [
      p.colors[0] ?? { name: "Black", hex: "#1A1A2E" },
      p.colors[1] ?? { name: "", hex: "#ffffff" },
      p.colors[2] ?? { name: "", hex: "#ffffff" },
    ],
    details: [
      p.details[0] ?? "",
      p.details[1] ?? "",
      p.details[2] ?? "",
      p.details[3] ?? "",
    ],
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { sellerProducts, createProduct, updateProduct } = useSellerContext();

  const existing = isEdit
    ? sellerProducts.find((p) => p.id === Number(id))
    : undefined;

  const [form, setForm] = useState<FormState>(
    existing ? productToForm(existing) : defaultForm,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isEdit && existing) {
      setForm(productToForm(existing));
    }
  }, [isEdit, existing]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required.";
    if (!form.brand.trim()) e.brand = "Required.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price.";
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Enter a valid stock quantity.";
    if (!form.description.trim()) e.description = "Required.";
    if (!form.images[0].trim())
      e.images = "At least one product image is required.";
    if (form.sizes.length === 0) e.sizes = "Select at least one size.";
    if (!form.colors[0].name.trim())
      e.colors = "At least one color is required.";
    return e;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSaving(true);

    const productData: Omit<
      Product,
      "id" | "sellerId" | "rating" | "reviews" | "isNew"
    > = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock),
      description: form.description.trim(),
      badge: form.badge || null,
      badgeColor: BADGE_COLORS[form.badge] ?? "",
      images: form.images.filter(Boolean),
      sizes: form.sizes,
      colors: form.colors.filter((c) => c.name.trim()),
      details: form.details.filter(Boolean),
    };

    setTimeout(() => {
      if (isEdit && id) {
        updateProduct(Number(id), productData);
      } else {
        createProduct(productData);
      }
      setSaving(false);
      setSaved(true);
      setTimeout(() => navigate("/seller/products"), 800);
    }, 600);
  };

  const toggleSize = (size: string) => {
    set(
      "sizes",
      form.sizes.includes(size)
        ? form.sizes.filter((s) => s !== size)
        : [...form.sizes, size],
    );
  };

  return (
    <SellerLayout>
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/seller/products")}
            className="w-9 h-9 border border-[#1A1A2E]/15 flex items-center justify-center text-[#1A1A2E]/50 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all duration-200"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-[#1A1A2E]/50 text-sm">
              {isEdit
                ? "Update your product details."
                : "Fill in the details to list a new product."}
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
              <div>
                <FieldLabel label="Product Name" required />
                <TextInput
                  value={form.name}
                  onChange={(v) => set("name", v)}
                  placeholder="e.g. Robe Élégante"
                />
                <FieldError error={errors.name} />
              </div>
              <div>
                <FieldLabel label="Brand" required />
                <TextInput
                  value={form.brand}
                  onChange={(v) => set("brand", v)}
                  placeholder="e.g. Maison Foda"
                />
                <FieldError error={errors.brand} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Category" required />
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full h-10 px-3 border border-[#1A1A2E]/15 bg-white text-[#1A1A2E] text-sm outline-none focus:border-[#C9A84C]/60 transition-colors duration-200 appearance-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel label="Badge" />
                <select
                  value={form.badge}
                  onChange={(e) => set("badge", e.target.value)}
                  className="w-full h-10 px-3 border border-[#1A1A2E]/15 bg-white text-[#1A1A2E] text-sm outline-none focus:border-[#C9A84C]/60 transition-colors duration-200 appearance-none"
                >
                  {BADGE_OPTIONS.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <FieldLabel label="Description" required />
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Describe your product…"
                className="w-full px-3 py-2.5 border border-[#1A1A2E]/15 bg-white text-[#1A1A2E] placeholder-[#1A1A2E]/30 text-sm outline-none focus:border-[#C9A84C]/60 transition-colors duration-200 resize-none"
              />
              <FieldError error={errors.description} />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
              Pricing & Stock
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel label="Price (DZD)" required />
                <TextInput
                  type="number"
                  value={form.price}
                  onChange={(v) => set("price", v)}
                  placeholder="8900"
                />
                <FieldError error={errors.price} />
              </div>
              <div>
                <FieldLabel label="Original Price (DZD)" />
                <TextInput
                  type="number"
                  value={form.originalPrice}
                  onChange={(v) => set("originalPrice", v)}
                  placeholder="12000 (optional)"
                />
              </div>
              <div>
                <FieldLabel label="Stock Quantity" required />
                <TextInput
                  type="number"
                  value={form.stock}
                  onChange={(v) => set("stock", v)}
                  placeholder="50"
                />
                <FieldError error={errors.stock} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
              Product Images
            </h2>
            <FieldError error={errors.images} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([0, 1, 2] as const).map((i) => (
                <div key={i}>
                  <FieldLabel
                    label={i === 0 ? "Main Image" : `Image ${i + 1}`}
                    required={i === 0}
                  />
                  <ImageUpload
                    value={form.images[i]}
                    required={i === 0}
                    onChange={(v) => {
                      const imgs = [...form.images] as [string, string, string];
                      imgs[i] = v;
                      set("images", imgs);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
              Available Sizes
            </h2>
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
            <FieldError error={errors.sizes} />
          </div>

          {/* Colors */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
              Colors (up to 3)
            </h2>
            <FieldError error={errors.colors} />
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.colors[i].hex}
                  onChange={(e) => {
                    const cols = [...form.colors] as [
                      ProductColor,
                      ProductColor,
                      ProductColor,
                    ];
                    cols[i] = { ...cols[i], hex: e.target.value };
                    set("colors", cols);
                  }}
                  className="w-10 h-10 border border-[#1A1A2E]/15 cursor-pointer p-0.5 bg-white"
                />
                <div className="flex-1">
                  <TextInput
                    value={form.colors[i].name}
                    onChange={(v) => {
                      const cols = [...form.colors] as [
                        ProductColor,
                        ProductColor,
                        ProductColor,
                      ];
                      cols[i] = { ...cols[i], name: v };
                      set("colors", cols);
                    }}
                    placeholder={
                      i === 0
                        ? "Color name (e.g. Black) *"
                        : "Color name (optional)"
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="bg-white border border-[#1A1A2E]/8 p-6 space-y-4">
            <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-widest">
              Product Details (up to 4 bullet points)
            </h2>
            {([0, 1, 2, 3] as const).map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0" />
                <div className="flex-1">
                  <TextInput
                    value={form.details[i]}
                    onChange={(v) => {
                      const d = [...form.details] as [
                        string,
                        string,
                        string,
                        string,
                      ];
                      d[i] = v;
                      set("details", d);
                    }}
                    placeholder={`Detail ${i + 1} (optional)`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pb-4">
            <button
              type="submit"
              disabled={saving || saved}
              className="btn-gold flex items-center gap-2 disabled:opacity-70 min-w-[160px] justify-center"
            >
              {saved ? (
                <>
                  <Check size={15} /> Saved!
                </>
              ) : saving ? (
                <span className="w-4 h-4 border-2 border-[#1A1A2E]/30 border-t-[#1A1A2E] rounded-full animate-spin" />
              ) : (
                <>{isEdit ? "Save Changes" : "Publish Product"}</>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="btn-outline-gold"
              disabled={saving || saved}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
}
