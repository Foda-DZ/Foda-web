import { useState, useEffect, useCallback } from "react";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Dialog from "@mui/material/Dialog";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";
import type { ApiConfirmator } from "../../types/api";

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Invite modal ─────────────────────────────────────────────────────────────
function InviteModal({
  open,
  onClose,
  onInvited,
}: {
  open: boolean;
  onClose: () => void;
  onInvited: (c: ApiConfirmator) => void;
}) {
  const { tr, isRTL } = useLang();
  const t = tr.seller.confirmatorsPage;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => { setFullName(""); setEmail(""); setError(""); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) { setError(t.fieldsRequired); return; }
    setLoading(true);
    setError("");
    try {
      const { confirmator } = await sellerService.inviteConfirmator(email.trim(), fullName.trim());
      onInvited(confirmator);
      handleClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.failedInvite);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: "1.5rem",
          maxWidth: 460,
          width: "100%",
          bgcolor: "#fff",
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
        },
      }}
    >
      <div dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-[#1A1A2E]/8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gold-gradient flex items-center justify-center shrink-0">
              <PersonAddOutlinedIcon sx={{ fontSize: 20, color: "#1A1A2E" }} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#1A1A2E]">
                {t.inviteModalTitle}
              </h3>
              <p className="text-[11px] text-[#1A1A2E]/45 mt-0.5">{t.inviteModalSub}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A2E]/30 hover:text-[#1A1A2E] hover:bg-[#1A1A2E]/5 transition-colors shrink-0"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        {/* Info hint */}
        <div className="mx-6 mt-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-[#C9A84C]/8 border border-[#C9A84C]/20">
          <InfoOutlinedIcon sx={{ fontSize: 15, color: "#C9A84C", flexShrink: 0, mt: 0.1 }} />
          <p className="text-[11px] text-[#1A1A2E]/60 leading-relaxed">{t.inviteHint}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A2E]/50 mb-1.5">
              {t.fullNameLabel}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              autoFocus
              className="w-full rounded-xl border border-[#1A1A2E]/12 px-4 py-2.5 text-sm text-[#1A1A2E] bg-[#FBF9F5] focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A2E]/50 mb-1.5">
              {t.emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full rounded-xl border border-[#1A1A2E]/12 px-4 py-2.5 text-sm text-[#1A1A2E] bg-[#FBF9F5] focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/10 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-full border border-[#1A1A2E]/12 text-sm font-semibold text-[#1A1A2E]/60 hover:text-[#1A1A2E] hover:border-[#1A1A2E]/25 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-full gold-gradient text-sm font-bold text-[#1A1A2E] shadow-sm hover:shadow-md disabled:opacity-50 transition-shadow inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-[#1A1A2E]/30 border-t-[#1A1A2E] rounded-full animate-spin" />
              ) : (
                <PersonAddOutlinedIcon sx={{ fontSize: 15 }} />
              )}
              {loading ? t.sending : t.sendInvitation}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

// ─── Remove confirm dialog ────────────────────────────────────────────────────
function RemoveDialog({
  confirmator,
  onCancel,
  onConfirm,
  loading,
}: {
  confirmator: ApiConfirmator | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  const { tr, isRTL } = useLang();
  const t = tr.seller.confirmatorsPage;

  return (
    <Dialog
      open={!!confirmator}
      onClose={onCancel}
      PaperProps={{ sx: { borderRadius: "1.5rem", maxWidth: 380, width: "100%", bgcolor: "#fff" } }}
    >
      <div className="p-6 space-y-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
          <DeleteOutlineIcon sx={{ fontSize: 26, color: "#ef4444" }} />
        </div>
        <div className="text-center">
          <h3 className="font-display font-bold text-[#1A1A2E] text-base">
            {t.removeConfirmatorTitle}
          </h3>
          <p className="text-xs text-[#1A1A2E]/50 leading-relaxed mt-1.5">
            {t.removeConfirmatorDesc.replace("{name}", confirmator?.fullName ?? "")}
          </p>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full border border-[#1A1A2E]/12 text-sm font-semibold text-[#1A1A2E]/60 hover:text-[#1A1A2E] transition-colors"
          >
            {t.keep}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {loading ? t.removing : t.remove}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// ─── Confirmator card — all key data visible without expand/collapse ───────────
function ConfirmatorCard({
  confirmator,
  onRemove,
}: {
  confirmator: ApiConfirmator;
  onRemove: (c: ApiConfirmator) => void;
}) {
  const { tr, isRTL, lang } = useLang();
  const t = tr.seller.confirmatorsPage;
  const dateLocale = lang === "ar" ? "ar-DZ" : "en-GB";

  const totalHandled = confirmator.confirmedOrders + confirmator.cancelledOrders;
  const confirmRate =
    totalHandled > 0
      ? Math.round((confirmator.confirmedOrders / totalHandled) * 100)
      : null;

  // Rate colour: ≥70% good, ≥40% warn, <40% bad
  const rateColor =
    confirmRate === null
      ? "text-[#1A1A2E]/30"
      : confirmRate >= 70
        ? "text-emerald-600"
        : confirmRate >= 40
          ? "text-amber-500"
          : "text-red-500";

  const rateBarColor =
    confirmRate === null
      ? "bg-[#1A1A2E]/10"
      : confirmRate >= 70
        ? "bg-emerald-500"
        : confirmRate >= 40
          ? "bg-amber-400"
          : "bg-red-400";

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="sl-card overflow-hidden sl-rise" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Always-visible header row ──────────────────────────────── */}
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        {/* Avatar + active dot */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-[#C9A84C] font-bold text-xs select-none">
            {confirmator.fullName.slice(0, 2).toUpperCase()}
          </div>
          <span
            className={`absolute bottom-0 end-0 w-3 h-3 rounded-full border-2 border-white ${
              confirmator.isActive ? "bg-emerald-500" : "bg-[#1A1A2E]/20"
            }`}
          />
        </div>

        {/* Name + email */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-[#1A1A2E] text-sm truncate">
              {confirmator.fullName}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                confirmator.isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-[#1A1A2E]/5 text-[#1A1A2E]/40 border-[#1A1A2E]/10"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${confirmator.isActive ? "bg-emerald-500" : "bg-[#1A1A2E]/30"}`} />
              {confirmator.isActive ? t.activeStatus : t.inactiveStatus}
            </span>
          </div>
          <p className="text-[11px] text-[#1A1A2E]/45 truncate mt-0.5">{confirmator.email}</p>
        </div>

        {/* Quick stats — always visible, compact */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className="text-xs font-bold text-emerald-600 tabular-nums">{confirmator.confirmedOrders}</span>
          <span className="text-[#1A1A2E]/20">/</span>
          <span className="text-xs font-bold text-red-500 tabular-nums">{confirmator.cancelledOrders}</span>
          {confirmRate !== null && (
            <>
              <span className="text-[#1A1A2E]/20">·</span>
              <span className={`text-xs font-bold tabular-nums ${rateColor}`}>{confirmRate}%</span>
            </>
          )}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          title={expanded ? t.collapseTitle : t.viewDetailsTitle}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A2E]/30 hover:text-[#C9A84C] hover:bg-[#C9A84C]/8 transition-all duration-200 shrink-0"
        >
          <ExpandMoreIcon
            sx={{
              fontSize: 18,
              transition: "transform 0.25s ease",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {/* Remove button */}
        <button
          onClick={() => onRemove(confirmator)}
          title={t.removeTitle2}
          aria-label={t.removeTitle2}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A2E]/20 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
        >
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
        </button>
      </div>

      {/* ── Expandable details dropdown ────────────────────────────── */}
      {expanded && (
        <div className="border-t border-[#1A1A2E]/6 bg-[#FBF9F5] px-4 py-4 space-y-4">
          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="font-display text-xl font-bold text-emerald-600">{confirmator.confirmedOrders}</p>
              <p className="text-[10px] text-[#1A1A2E]/45 mt-0.5 flex items-center gap-1 justify-center">
                <CheckCircleOutlinedIcon sx={{ fontSize: 11, color: "#10b981" }} />
                {t.confirmedLabel.replace(":", "")}
              </p>
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold text-red-500">{confirmator.cancelledOrders}</p>
              <p className="text-[10px] text-[#1A1A2E]/45 mt-0.5 flex items-center gap-1 justify-center">
                <CancelOutlinedIcon sx={{ fontSize: 11, color: "#ef4444" }} />
                {t.cancelledLabel.replace(":", "")}
              </p>
            </div>
            <div className="text-center">
              <p className={`font-display text-xl font-bold ${rateColor}`}>
                {confirmRate !== null ? `${confirmRate}%` : "—"}
              </p>
              <p className="text-[10px] text-[#1A1A2E]/45 mt-0.5 flex items-center gap-1 justify-center">
                <SpeedOutlinedIcon sx={{ fontSize: 11, color: "#C9A84C" }} />
                {t.confirmRateLabel.replace(":", "")}
              </p>
            </div>
          </div>

          {/* Confirm rate bar */}
          {totalHandled > 0 ? (
            <div className="space-y-1.5">
              <div className="h-1.5 bg-[#1A1A2E]/8 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${rateBarColor}`}
                  style={{ width: `${confirmRate ?? 0}%` }}
                />
              </div>
              <p className="text-[10px] text-[#1A1A2E]/35">{totalHandled} {t.ordersHandled}</p>
            </div>
          ) : (
            <p className="text-[11px] text-[#1A1A2E]/30 italic">{t.noActivity}</p>
          )}

          {/* Contact + join date */}
          <div className="flex items-center justify-between gap-4 flex-wrap pt-1 border-t border-[#1A1A2E]/6">
            {confirmator.phoneNumber ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#1A1A2E]/55">
                <PhoneOutlinedIcon sx={{ fontSize: 12, color: "#C9A84C" }} />
                {confirmator.phoneNumber}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#1A1A2E]/30">
                <PhoneOutlinedIcon sx={{ fontSize: 12 }} />
                {t.noPhone}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#1A1A2E]/35 shrink-0">
              <AccessTimeOutlinedIcon sx={{ fontSize: 12 }} />
              {t.joinedLabel} {formatDate(confirmator.createdAt, dateLocale)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ConfirmatorsPage() {
  const { tr, isRTL } = useLang();
  const t = tr.seller.confirmatorsPage;

  const [confirmators, setConfirmators] = useState<ApiConfirmator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<ApiConfirmator | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeError, setRemoveError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await sellerService.getConfirmators();
      setConfirmators(data);
    } catch {
      setError(t.loadError);
    } finally {
      setLoading(false);
    }
  }, [t.loadError]);

  useEffect(() => { load(); }, [load]);

  const handleInvited = (c: ApiConfirmator) => {
    setConfirmators((prev) => [c, ...prev]);
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoveLoading(true);
    setRemoveError("");
    try {
      await sellerService.removeConfirmator(removeTarget._id);
      setConfirmators((prev) => prev.filter((c) => c._id !== removeTarget._id));
      setRemoveTarget(null);
    } catch {
      setRemoveError(t.removeError);
      setRemoveLoading(false);
    }
  };

  const totalConfirmed = confirmators.reduce((s, c) => s + c.confirmedOrders, 0);
  const totalCancelled = confirmators.reduce((s, c) => s + c.cancelledOrders, 0);
  const totalHandled = totalConfirmed + totalCancelled;
  const overallRate =
    totalHandled > 0 ? Math.round((totalConfirmed / totalHandled) * 100) : null;

  return (
    <SellerLayout>
      <div
        className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-6"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 sl-rise">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sl-icon-tile-gold flex items-center justify-center shrink-0">
              <PeopleAltOutlinedIcon sx={{ fontSize: 24, color: "#C9A84C" }} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                {t.title}
              </h1>
              <p className="text-sm text-[#1A1A2E]/45 mt-0.5">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="sl-btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-sm shrink-0"
          >
            <PersonAddOutlinedIcon sx={{ fontSize: 16 }} />
            {t.invite}
          </button>
        </div>

        {/* Summary cards */}
        {!loading && confirmators.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sl-rise">
            {[
              {
                label: t.totalLabel,
                value: `${confirmators.length}`,
                Icon: PeopleAltOutlinedIcon,
                color: "#C9A84C",
                bg: "bg-[#C9A84C]/14",
              },
              {
                label: t.ordersConfirmedLabel,
                value: `${totalConfirmed}`,
                Icon: CheckCircleOutlinedIcon,
                color: "#10b981",
                bg: "bg-emerald-50",
              },
              {
                label: t.ordersCancelledLabel,
                value: `${totalCancelled}`,
                Icon: CancelOutlinedIcon,
                color: "#ef4444",
                bg: "bg-red-50",
              },
              {
                label: t.overallRate,
                value: overallRate !== null ? `${overallRate}%` : "—",
                Icon: SpeedOutlinedIcon,
                color:
                  overallRate === null
                    ? "#1A1A2E"
                    : overallRate >= 70
                      ? "#10b981"
                      : overallRate >= 40
                        ? "#f59e0b"
                        : "#ef4444",
                bg: "bg-[#1A1A2E]/5",
              },
            ].map(({ label, value, Icon, color, bg }) => (
              <div
                key={label}
                className="sl-card px-4 py-4 flex items-center gap-3"
              >
                <div
                  className="w-11 h-11 sl-chip flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}1f` }}
                >
                  <Icon sx={{ fontSize: 20, color }} />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="sl-eyebrow">{label}</p>
                  <p className="font-display text-2xl font-bold text-[#1A1A2E] leading-none mt-1">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="sl-card p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1A1A2E]/10 shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3.5 w-32 bg-[#1A1A2E]/8 rounded" />
                    <div className="h-3 w-44 bg-[#1A1A2E]/6 rounded" />
                  </div>
                </div>
                <div className="h-px bg-[#1A1A2E]/6 my-4" />
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="space-y-1.5">
                      <div className="h-6 bg-[#1A1A2E]/8 rounded w-12 mx-auto" />
                      <div className="h-2.5 bg-[#1A1A2E]/5 rounded w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        ) : confirmators.length === 0 ? (
          <div className="sl-card px-6 py-16 flex flex-col items-center gap-5 text-center sl-rise">
            <div className="w-18 h-18 sl-icon-tile-gold flex items-center justify-center p-5 rounded-2xl">
              <PeopleAltOutlinedIcon sx={{ fontSize: 32, color: "#C9A84C" }} />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-[#1A1A2E]">{t.emptyTitle}</p>
              <p className="text-sm text-[#1A1A2E]/40 mt-1.5 max-w-xs mx-auto leading-relaxed">
                {t.emptyDesc}
              </p>
            </div>
            <button
              onClick={() => setInviteOpen(true)}
              className="sl-btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              <PersonAddOutlinedIcon sx={{ fontSize: 16 }} />
              {t.inviteFirst}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {confirmators.map((c) => (
              <ConfirmatorCard
                key={c._id}
                confirmator={c}
                onRemove={setRemoveTarget}
              />
            ))}
          </div>
        )}

        {removeError && (
          <p className="text-xs text-red-500 text-center sl-rise">{removeError}</p>
        )}
      </div>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvited={handleInvited}
      />

      <RemoveDialog
        confirmator={removeTarget}
        onCancel={() => { setRemoveTarget(null); setRemoveError(""); }}
        onConfirm={handleRemove}
        loading={removeLoading}
      />
    </SellerLayout>
  );
}
