import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { storefrontService } from "../services/storefrontService";
import { apiProductToProduct } from "../lib/mappers";
import ProductCard from "./ui/ProductCard";
import type { ApiSellerProfile } from "../types/api";
import type { Product } from "../types";

interface SellerDrawerProps {
  sellerId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function SellerDrawer({ sellerId, open, onClose }: SellerDrawerProps) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ApiSellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !sellerId) return;
    setProfile(null);
    setProducts([]);
    setError("");
    setLoading(true);

    Promise.allSettled([
      storefrontService.getSellerProfile(sellerId),
      storefrontService.getSellerProducts(sellerId),
    ]).then(([profileResult, productsResult]) => {
      if (profileResult.status === "fulfilled") {
        setProfile(profileResult.value);
      } else {
        setError("Could not load seller information.");
      }
      if (productsResult.status === "fulfilled") {
        setProducts(productsResult.value.map(apiProductToProduct));
      }
      setLoading(false);
    });
  }, [sellerId, open]);

  const memberYear = profile?.memberSince
    ? new Date(profile.memberSince).getFullYear()
    : null;

  const initials = profile?.shopName
    ? profile.shopName.slice(0, 2).toUpperCase()
    : "??";

  const handleViewStorefront = () => {
    if (!sellerId) return;
    onClose();
    navigate(`/storefront/${sellerId}`);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          bgcolor: "#1A1A2E",
          backgroundImage: "none",
          display: "flex",
          flexDirection: "column",
        },
      }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: "blur(4px)", bgcolor: "rgba(0,0,0,0.5)" },
        },
      }}
    >
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <StorefrontIcon sx={{ fontSize: 20, color: "#C9A84C" }} />
          <h2 className="font-display text-lg font-bold text-white tracking-wide">
            Seller Profile
          </h2>
        </div>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#fff" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <LoadingSkeleton />
        ) : error && !profile ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : profile ? (
          <>
            {/* ── Seller info ── */}
            <div className="px-6 py-6 flex flex-col gap-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                {/* Logo or initials */}
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt={profile.shopName}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-[#C9A84C]/40 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center bg-[#C9A84C] text-[#1A1A2E] font-bold text-xl">
                    {initials}
                  </div>
                )}

                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg font-bold text-white truncate">
                      {profile.shopName}
                    </h3>
                    {profile.isVerified && (
                      <VerifiedIcon sx={{ fontSize: 16, color: "#C9A84C" }} />
                    )}
                  </div>
                  <p className="text-xs text-white/40">
                    {profile.productCount}{" "}
                    {profile.productCount === 1 ? "product" : "products"} in store
                  </p>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/50">
                {profile.address && (
                  <span className="flex items-center gap-1">
                    <LocationOnIcon sx={{ fontSize: 13, color: "#C9A84C" }} />
                    {profile.address.wilaya}, {profile.address.commune}
                  </span>
                )}
                {memberYear && (
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                    Member since {memberYear}
                  </span>
                )}
              </div>
            </div>

            {/* ── Gold divider ── */}
            <div className="h-px bg-[#C9A84C]/20 mx-6" />

            {/* ── Products ── */}
            <div className="px-6 py-5">
              <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">
                More from this seller
              </p>

              {products.length === 0 ? (
                <p className="text-sm text-white/30 text-center py-8">
                  No products available.
                </p>
              ) : (
                <div
                  className="grid grid-cols-2 gap-3"
                  onClick={onClose}
                >
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* ── Sticky footer button ── */}
      {profile && (
        <div className="shrink-0 px-6 py-4 border-t border-white/10">
          <button
            onClick={handleViewStorefront}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A84C] text-[#1A1A2E] font-bold text-sm tracking-wide hover:bg-[#b8953e] transition-colors"
          >
            View full storefront
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}
    </Drawer>
  );
}

function LoadingSkeleton() {
  return (
    <div className="px-6 py-6 space-y-5 animate-pulse">
      {/* Seller info skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/10 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-36 bg-white/10 rounded" />
          <div className="h-3 w-24 bg-white/10 rounded" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="h-3 w-28 bg-white/10 rounded" />
        <div className="h-3 w-20 bg-white/10 rounded" />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[3/4] bg-white/10 rounded" />
            <div className="h-3 w-full bg-white/10 rounded" />
            <div className="h-3 w-2/3 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
