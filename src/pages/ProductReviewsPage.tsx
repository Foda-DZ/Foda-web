import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarBorderOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Footer from "../components/Footer";
import { productsService } from "../services/productsService";
import { apiProductToProduct } from "../lib/mappers";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import type { Product } from "../types";
import type { ApiProductReview } from "../types/api";

function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-px">
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={`f${i}`} sx={{ fontSize: size, color: "#C9A84C" }} />
      ))}
      {half && <StarHalfIcon sx={{ fontSize: size, color: "#C9A84C" }} />}
      {Array.from({ length: empty }).map((_, i) => (
        <StarOutlineIcon key={`e${i}`} sx={{ fontSize: size, color: "#C9A84C33" }} />
      ))}
    </div>
  );
}

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

export default function ProductReviewsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();
  const { isRTL } = useLang();
  const isCustomer = user?.role === "customer";
  const locale = isRTL ? "ar-DZ" : "en-GB";

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ApiProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!id) return;
    productsService.getById(id)
      .then((ap) => setProduct(apiProductToProduct(ap)))
      .catch(() => {})
      .finally(() => setLoading(false));

    productsService.getProductReviews(id)
      .then((data) => setReviews(data.reviews))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [id]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const average = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const breakdown = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => r.rating === star).length;
      return { star, count, percent: total ? (count / total) * 100 : 0 };
    });
    return { total, average, breakdown };
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { openLogin(); return; }
    if (rating < 1) { setSubmitError(isRTL ? "اختر تقييماً." : "Please select a rating."); return; }
    if (!comment.trim()) { setSubmitError(isRTL ? "اكتب تعليقاً." : "Please write a comment."); return; }
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      await productsService.reviewProduct(id!, { rating, comment });
      setSubmitSuccess(isRTL ? "تم إرسال تقييمك بنجاح!" : "Your review was submitted successfully!");
      setRating(0);
      setComment("");
      const refreshed = await productsService.getProductReviews(id!);
      setReviews(refreshed.reviews);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || (isRTL ? "فشل إرسال التقييم." : "Failed to submit review."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#FAF8F5] min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20">

          {/* Back */}
          <button
            onClick={() => navigate(`/products/${id}`)}
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#1A1A2E]/45 hover:text-[#C9A84C] transition-colors mb-6 group"
          >
            <ArrowBackIosNewIcon
              sx={{ fontSize: 11 }}
              className={`transition-transform duration-200 group-hover:${isRTL ? "translate-x-1" : "-translate-x-1"} ${isRTL ? "rotate-180" : ""}`}
            />
            {loading ? "..." : product?.name}
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#1A1A2E]">
              {isRTL ? "تقييمات العملاء" : "Customer Reviews"}
            </h1>
            {!loading && product && (
              <p className="text-sm text-[#1A1A2E]/45 mt-1">{product.name}</p>
            )}
          </div>

          {/* ── Rating summary ── */}
          <div className="bg-white border border-[#1A1A2E]/8 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-5 flex-wrap">
              {/* Big score */}
              <div className="text-center min-w-[80px]">
                <p className="font-display text-5xl font-black text-[#1A1A2E] leading-none">
                  {stats.average ? stats.average.toFixed(1) : "—"}
                </p>
                <RatingStars rating={stats.average} size={16} />
                <p className="text-[11px] text-[#1A1A2E]/40 mt-1">
                  {stats.total} {isRTL ? "تقييم" : stats.total === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Breakdown bars */}
              <div className="flex-1 min-w-[160px] space-y-1.5">
                {stats.breakdown.map(({ star, count, percent }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#1A1A2E]/50 w-3">{star}</span>
                    <StarIcon sx={{ fontSize: 11, color: "#C9A84C" }} />
                    <div className="flex-1 h-1.5 bg-[#1A1A2E]/8 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C9A84C] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#1A1A2E]/35 w-4 text-end">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Write a review ── */}
          {isCustomer && (
            <div className="bg-white border border-[#1A1A2E]/8 rounded-2xl p-5 mb-6">
              <h2 className="text-[15px] font-bold text-[#1A1A2E] mb-4">
                {isRTL ? "اكتب تقييماً" : "Write a Review"}
              </h2>

              {submitSuccess ? (
                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm font-medium text-[#b8943d]">
                  {submitSuccess}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Star picker */}
                  <div>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#1A1A2E]/45 mb-2">
                      {isRTL ? "تقييمك" : "Your rating"}
                    </p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          {(hoverRating || rating) >= star ? (
                            <StarIcon sx={{ fontSize: 28, color: "#C9A84C" }} />
                          ) : (
                            <StarOutlineIcon sx={{ fontSize: 28, color: "#C9A84C33" }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#1A1A2E]/45 mb-2">
                      {isRTL ? "تعليقك" : "Your comment"}
                    </p>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={isRTL ? "شاركنا رأيك في هذا المنتج..." : "Share your thoughts about this product..."}
                      rows={4}
                      className="w-full bg-[#FAF8F5] border border-[#1A1A2E]/12 rounded-xl px-4 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/30 focus:outline-none focus:border-[#C9A84C]/60 transition-colors resize-none"
                    />
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-500">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="gold-gradient text-[#1A1A2E] font-bold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting
                      ? (isRTL ? "جارٍ الإرسال..." : "Submitting...")
                      : (isRTL ? "إرسال التقييم" : "Submit Review")}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── Reviews list ── */}
          <div className="space-y-3">
            {reviewsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-[#1A1A2E]/8 rounded-2xl p-5 animate-pulse space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1A1A2E]/8" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-28 bg-[#1A1A2E]/8 rounded" />
                      <div className="h-2.5 w-20 bg-[#1A1A2E]/6 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-full bg-[#1A1A2E]/6 rounded" />
                  <div className="h-3 w-4/5 bg-[#1A1A2E]/6 rounded" />
                </div>
              ))
            ) : reviews.length === 0 ? (
              <div className="bg-white border border-[#1A1A2E]/8 rounded-2xl py-14 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A84C]/10 flex items-center justify-center mb-3">
                  <StarOutlineIcon sx={{ fontSize: 22, color: "#C9A84C" }} />
                </div>
                <p className="font-semibold text-[#1A1A2E]">
                  {isRTL ? "لا توجد تقييمات بعد" : "No reviews yet"}
                </p>
                <p className="text-sm text-[#1A1A2E]/45 mt-1">
                  {isRTL ? "كن أول من يشارك رأيه." : "Be the first to share your feedback."}
                </p>
              </div>
            ) : (
              reviews.map((review) => {
                const initials = review.customerId.fullName
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <article
                    key={review._id}
                    className="bg-white border border-[#1A1A2E]/8 rounded-2xl p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full gold-gradient text-[#1A1A2E] flex items-center justify-center font-black text-sm shrink-0 select-none">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-[14px] font-bold text-[#1A1A2E] truncate">
                            {review.customerId.fullName}
                          </p>
                          <span className="text-[11px] text-[#1A1A2E]/35">
                            {formatDate(review.createdAt, locale)}
                          </span>
                        </div>
                        <RatingStars rating={review.rating} size={13} />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[#1A1A2E]/70 leading-relaxed">
                      {review.comment}
                    </p>
                  </article>
                );
              })
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
