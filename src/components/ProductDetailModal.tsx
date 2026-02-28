import { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  Share2,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import type { Product, ProductColor } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const { addItem } = useCart();
  const { user, openLogin } = useAuth();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product?.colors[0] ?? null,
  );
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "details">(
    "description",
  );

  useEffect(() => {
    if (product) {
      setActiveImg(0);
      setSelectedSize(null);
      setSelectedColor(product.colors[0]);
      setQty(1);
      setAddedToCart(false);
      setSizeError(false);
    }
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = product ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!user) { openLogin(); return; }
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem(product, selectedSize, selectedColor!, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const prevImg = () =>
    setActiveImg(
      (i) => (i - 1 + product.images.length) % product.images.length,
    );
  const nextImg = () => setActiveImg((i) => (i + 1) % product.images.length);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  return (
    <>
      <div
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn .25s ease" }}
      />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-[#FAF7F2] w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
          style={{ animation: "scaleIn .3s cubic-bezier(.4,0,.2,1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A2E]/10 lg:hidden">
            <p className="font-display font-bold text-[#1A1A2E]">
              {product.name}
            </p>
            <button
              onClick={onClose}
              className="text-[#1A1A2E]/50 hover:text-[#1A1A2E]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* Left: Image gallery */}
            <div className="lg:w-[55%] flex flex-col bg-[#F0EBE3] relative">
              <button
                onClick={onClose}
                className="hidden lg:flex absolute top-4 right-4 z-10 w-9 h-9 bg-white/80 items-center justify-center hover:bg-white transition-colors duration-200"
              >
                <X size={16} className="text-[#1A1A2E]" />
              </button>
              <div className="flex-1 relative overflow-hidden min-h-[280px] lg:min-h-0">
                <img
                  key={activeImg}
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-cover anim-scale-in"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.badge && (
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase ${product.badgeColor}`}
                    >
                      {product.badge}
                    </span>
                  )}
                  {discount && (
                    <span className="text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase bg-red-500 text-white">
                      -{discount}%
                    </span>
                  )}
                </div>
                {product.stock <= 5 && (
                  <div className="absolute bottom-4 left-4 right-4 bg-[#1A1A2E]/80 text-[#E8C96B] text-xs font-semibold px-3 py-2 text-center">
                    Only {product.stock} left in stock — Order soon
                  </div>
                )}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center transition-colors duration-200"
                    >
                      <ChevronLeft size={18} className="text-[#1A1A2E]" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center transition-colors duration-200"
                    >
                      <ChevronRight size={18} className="text-[#1A1A2E]" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-2 p-3 bg-[#F0EBE3]">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      i === activeImg
                        ? "ring-2 ring-[#C9A84C] ring-offset-2 ring-offset-[#F0EBE3]"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product info */}
            <div className="lg:w-[45%] overflow-y-auto">
              <div className="p-6 lg:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`w-8 h-8 border flex items-center justify-center transition-all duration-200 ${
                        liked
                          ? "border-red-400 text-red-400 bg-red-50"
                          : "border-[#1A1A2E]/15 text-[#1A1A2E]/40 hover:border-red-300 hover:text-red-400"
                      }`}
                    >
                      <Heart
                        size={13}
                        className={liked ? "fill-current" : ""}
                      />
                    </button>
                    <button className="w-8 h-8 border border-[#1A1A2E]/15 flex items-center justify-center text-[#1A1A2E]/40 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all duration-200">
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>

                <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#1A1A2E] leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < Math.floor(product.rating)
                            ? "fill-[#C9A84C] text-[#C9A84C]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[#1A1A2E] text-sm font-semibold">
                    {product.rating}
                  </span>
                  <span className="text-[#1A1A2E]/40 text-sm">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-bold text-[#1A1A2E]">
                    {product.price.toLocaleString()}{" "}
                    <span className="text-lg font-normal">DZD</span>
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-[#1A1A2E]/40 text-lg line-through">
                        {product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-red-500">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>

                <div className="h-px bg-[#1A1A2E]/8" />

                {/* Color selector */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[#1A1A2E] text-sm font-semibold">
                      Color
                    </p>
                    <p className="text-[#C9A84C] text-xs font-medium">
                      {selectedColor?.name}
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        title={color.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                          selectedColor?.name === color.name
                            ? "border-[#C9A84C] ring-2 ring-[#C9A84C]/30 scale-110"
                            : "border-[#1A1A2E]/15"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size selector */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p
                      className={`text-sm font-semibold ${sizeError ? "text-red-500" : "text-[#1A1A2E]"}`}
                    >
                      Size{" "}
                      {sizeError && (
                        <span className="font-normal text-red-500">
                          — Please select a size
                        </span>
                      )}
                    </p>
                    <button className="text-[#C9A84C] text-xs hover:underline">
                      Size guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={`min-w-[44px] h-10 px-3 text-xs font-semibold tracking-wide border transition-all duration-200 ${
                          selectedSize === size
                            ? "border-[#1A1A2E] bg-[#1A1A2E] text-white"
                            : "border-[#1A1A2E]/20 text-[#1A1A2E]/70 hover:border-[#1A1A2E] hover:text-[#1A1A2E]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity + Add to cart */}
                <div className="flex gap-3">
                  <div className="flex items-center border border-[#1A1A2E]/20">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-12 flex items-center justify-center text-[#1A1A2E]/50 hover:text-[#1A1A2E] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-[#1A1A2E] font-bold">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="w-10 h-12 flex items-center justify-center text-[#1A1A2E]/50 hover:text-[#1A1A2E] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 flex items-center justify-center gap-2 font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                      addedToCart
                        ? "bg-green-600 text-white"
                        : sizeError
                          ? "bg-red-500 text-white"
                          : "btn-gold"
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check size={15} /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} /> Add to Cart
                      </>
                    )}
                  </button>
                </div>

                {/* Trust signals */}
                <div className="grid grid-cols-3 gap-3 py-3 border-t border-b border-[#1A1A2E]/8">
                  {[
                    {
                      Icon: Truck,
                      label: "Free Shipping",
                      sub: "Orders 5,000+ DZD",
                    },
                    {
                      Icon: RotateCcw,
                      label: "Free Returns",
                      sub: "Within 30 days",
                    },
                    {
                      Icon: Shield,
                      label: "Secure Pay",
                      sub: "100% protected",
                    },
                  ].map(({ Icon, label, sub }) => (
                    <div key={label} className="text-center group">
                      <Icon
                        size={18}
                        className="text-[#C9A84C] mx-auto mb-1 transition-transform duration-300 group-hover:scale-110"
                      />
                      <p className="text-[#1A1A2E] text-[11px] font-semibold leading-tight">
                        {label}
                      </p>
                      <p className="text-[#1A1A2E]/40 text-[10px]">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div>
                  <div className="flex border-b border-[#1A1A2E]/10 mb-4">
                    {(["description", "details"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 text-xs font-semibold tracking-widest uppercase capitalize transition-all duration-200 ${
                          activeTab === tab
                            ? "border-b-2 border-[#C9A84C] text-[#1A1A2E]"
                            : "text-[#1A1A2E]/40 hover:text-[#1A1A2E]/70"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  {activeTab === "description" ? (
                    <p className="text-[#1A1A2E]/60 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {product.details.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-sm text-[#1A1A2E]/60"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-2 flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
