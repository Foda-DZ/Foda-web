import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Footer from "../components/Footer";
import ProductCard from "../components/ui/ProductCard";
import { storefrontService } from "../services/storefrontService";
import { apiProductToProduct } from "../lib/mappers";
import { useAuth } from "../context/AuthContext";
import type { ApiSellerProfile } from "../types/api";
import type { Product } from "../types";

export default function SellerStorefrontPage() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();
  const isCustomer = user?.role === "customer";
  const textDir = document.documentElement.dir;

  const [profile, setProfile] = useState<ApiSellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  if (!sellerId) return <Navigate to="/" replace />;

  useEffect(() => {
    setLoading(true);
    setError("");
    setProfile(null);
    setProducts([]);
    setIsFollowing(false);
    setFollowersCount(0);

    Promise.allSettled([
      storefrontService.getSellerProfile(sellerId),
      storefrontService.getSellerProducts(sellerId),
    ]).then(([profileResult, productsResult]) => {
      if (profileResult.status === "fulfilled") {
        setProfile(profileResult.value);
        setIsFollowing(profileResult.value.isFollowing);
        setFollowersCount(profileResult.value.followers);
      } else {
        setError("Could not load seller information.");
      }
      if (productsResult.status === "fulfilled") {
        setProducts(productsResult.value.map(apiProductToProduct));
      }
      setLoading(false);
    });
  }, [sellerId]);

  const handleFollowToggle = async () => {
    if (!sellerId || !profile || followLoading) return;
    if (!isCustomer) {
      openLogin();
      return;
    }

    const wasFollowing = isFollowing;
    setFollowLoading(true);
    setIsFollowing(!wasFollowing);
    setFollowersCount((count) =>
      wasFollowing ? Math.max(0, count - 1) : count + 1,
    );

    try {
      const result = wasFollowing
        ? await storefrontService.unfollowSeller(sellerId)
        : await storefrontService.followSeller(sellerId);

      setFollowersCount(result.followers);
      setProfile((current) =>
        current
          ? {
              ...current,
              followers: result.followers,
              isFollowing: !wasFollowing,
            }
          : current,
      );
    } catch {
      setIsFollowing(wasFollowing);
      setFollowersCount((count) =>
        wasFollowing ? count + 1 : Math.max(0, count - 1),
      );
    } finally {
      setFollowLoading(false);
    }
  };

  const memberYear = profile?.memberSince
    ? new Date(profile.memberSince).getFullYear()
    : null;

  const initials = profile?.shopName
    ? profile.shopName.slice(0, 2).toUpperCase()
    : "??";

  function StarRating({ value }: { value: number }) {
    return (
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = value >= n;
          const half = !filled && value >= n - 0.5;
          const Icon = filled ? StarIcon : half ? StarHalfIcon : StarBorderIcon;
          return <Icon key={n} sx={{ fontSize: 11, color: "#C9A84C" }} />;
        })}
      </span>
    );
  }

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        {/* Hero skeleton */}
        <div className="bg-[#1A1A2E] animate-pulse">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-12">
            <div className="h-3 w-12 bg-white/10 rounded mb-8" />
            <div className="flex items-end gap-6">
              <div className="w-20 h-20 rounded-full bg-white/10 shrink-0" />
              <div className="space-y-3 pb-1">
                <div className="h-7 w-48 bg-white/10 rounded" />
                <div className="flex gap-3">
                  <div className="h-3 w-20 bg-white/10 rounded" />
                  <div className="h-3 w-24 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="aspect-[3/4] bg-[#1A1A2E]/8" />
                <div className="h-3 w-full bg-[#1A1A2E]/8 rounded" />
                <div className="h-3 w-2/3 bg-[#1A1A2E]/8 rounded" />
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error && !profile) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-20 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1A1A2E]/6 flex items-center justify-center">
            <Inventory2OutlinedIcon
              sx={{ fontSize: 28, color: "#1A1A2E", opacity: 0.25 }}
            />
          </div>
          <p className="text-[#1A1A2E]/50 text-base max-w-sm">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A2E] text-white text-sm font-semibold hover:bg-[#1A1A2E]/85 transition-colors"
          >
            <ArrowBackIcon sx={{ fontSize: 14 }} />
            Go back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Dark hero banner ── */}
      <div className="bg-[#1A1A2E] relative overflow-hidden">
        {/* Subtle gold texture dots */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-10">
          {/* Back nav */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-white/35 hover:text-white/70 transition-colors mb-8 tracking-wide"
          >
            <ArrowBackIcon sx={{ fontSize: 13 }} />
            Back
          </button>

          {/* Profile row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Logo / initials */}
            {profile?.logoUrl ? (
              <img
                src={profile.logoUrl}
                alt={profile?.shopName}
                className="w-[72px] h-[72px] rounded-full object-cover ring-2 ring-[#C9A84C]/40 shrink-0"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full shrink-0 flex items-center justify-center bg-[#C9A84C] text-[#1A1A2E] font-bold text-2xl select-none">
                {initials}
              </div>
            )}

            {/* Name + meta */}
            <div className="flex flex-col gap-2.5 pb-0.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-white leading-none">
                  {profile?.shopName}
                </h1>
                {/* {profile?.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C9A84C]/15 border border-[#C9A84C]/25 text-[#C9A84C] text-[10px] font-bold tracking-wider uppercase">
                    <VerifiedIcon sx={{ fontSize: 10 }} />
                    Verified
                  </span>
                )} */}
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-white/45">
                <span className="flex items-center gap-1.5">
                  <Inventory2OutlinedIcon
                    sx={{ fontSize: 13, color: "#C9A84C" }}
                  />
                  <span className="text-white/70 font-medium">
                    {profile?.productCount ?? 0}
                  </span>
                  &nbsp;products
                </span>
                {profile?.address && (
                  <span className="flex items-center gap-1.5">
                    <LocationOnIcon sx={{ fontSize: 13, color: "#C9A84C" }} />
                    {profile.address.wilaya}, {profile.address.commune}
                  </span>
                )}
                {memberYear && (
                  <span className="flex items-center gap-1.5">
                    <CalendarTodayOutlinedIcon
                      sx={{ fontSize: 12, color: "#C9A84C" }}
                    />
                    Since {memberYear}
                  </span>
                )}
                {profile && profile.ratingCount > 0 && (
                  <span className="flex items-center gap-1.5">
                    <StarRating value={profile.rating} />
                    <span className="text-white/70 font-semibold">
                      {profile.rating.toFixed(1)}
                    </span>
                    <span className="text-white/35">
                      ({profile.ratingCount})
                    </span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1.5">
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading || !profile}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isFollowing
                      ? "border-[#C9A84C]/35 bg-[#C9A84C]/15 text-[#C9A84C] hover:bg-[#C9A84C]/20"
                      : "border-white/10 bg-white/5 text-white hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
                  }`}
                >
                  {followLoading ? (
                    <span className="h-3.5 w-3.5 rounded-full border border-current border-r-transparent animate-spin" />
                  ) : isFollowing ? (
                    <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />
                  ) : (
                    <AddCircleOutlineIcon sx={{ fontSize: 15 }} />
                  )}
                  <span>{isFollowing ? "Following" : "Follow store"}</span>
                  {/* <span
                    className={`text-[11px] font-bold ${isFollowing ? "text-[#C9A84C]/80" : "text-white/55"}`}
                  >
                    {followersCount.toLocaleString()}
                  </span> */}
                </button>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/55">
                  <span className="font-semibold text-white/80">
                    {followersCount.toLocaleString()}
                  </span>
                  Followers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gold rule */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
      </div>

      {/* ── Products section ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-24">
        <div className="flex items-center justify-between mb-7">
          <h2 className="font-display text-xl font-bold text-[#1A1A2E]">
            All Products
          </h2>
          <span className="text-xs font-semibold text-[#1A1A2E]/35 tracking-wide uppercase">
            {products.length} item{products.length !== 1 ? "s" : ""}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#1A1A2E]/5 flex items-center justify-center">
              <Inventory2OutlinedIcon
                sx={{ fontSize: 24, color: "#1A1A2E", opacity: 0.2 }}
              />
            </div>
            <p className="text-[#1A1A2E]/40 text-sm">
              This seller has no products yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 35} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
