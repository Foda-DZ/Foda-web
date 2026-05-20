import { useState, useEffect, useCallback } from "react";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import SellerLayout from "../../components/seller/SellerLayout";
import { sellerService } from "../../services/sellerService";
import { useLang } from "../../context/LangContext";
import type { ApiConfirmator } from "../../types/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: "green" | "red" | "gray";
}) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    red: "bg-red-50 text-red-600 border border-red-200",
    gray: "bg-[#1A1A2E]/5 text-[#1A1A2E]/50 border border-[#1A1A2E]/10",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${styles[color]}`}>
      {label}
      <span className="font-bold">{value}</span>
    </span>
  );
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

  const reset = () => {
    setFullName("");
    setEmail("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError(t.fieldsRequired);
      return;
    }
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
          borderRadius: 0,
          maxWidth: 440,
          width: "100%",
          bgcolor: "#fff",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1A2E]/8" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gold-gradient flex items-center justify-center">
            <PersonAddOutlinedIcon sx={{ fontSize: 15, color: "#1A1A2E" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1A1A2E]">{t.inviteModalTitle}</h3>
            <p className="text-[10px] text-[#1A1A2E]/40 mt-0.5">{t.inviteModalSub}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center text-[#1A1A2E]/30 hover:text-[#1A1A2E] transition-colors"
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4" dir={isRTL ? "rtl" : "ltr"}>
        <div>
          <label className="block text-xs font-semibold text-[#1A1A2E]/60 uppercase tracking-wider mb-1.5">
            {t.fullNameLabel}
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t.fullNamePlaceholder}
            className="w-full border border-[#1A1A2E]/15 px-3.5 py-2.5 text-sm text-[#1A1A2E] bg-[#FAF7F2] focus:outline-none focus:border-[#C9A84C] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1A1A2E]/60 uppercase tracking-wider mb-1.5">
            {t.emailLabel}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="w-full border border-[#1A1A2E]/15 px-3.5 py-2.5 text-sm text-[#1A1A2E] bg-[#FAF7F2] focus:outline-none focus:border-[#C9A84C] transition-colors"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 border border-[#1A1A2E]/15 text-sm font-semibold text-[#1A1A2E]/60 hover:text-[#1A1A2E] hover:border-[#1A1A2E]/30 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 gold-gradient text-sm font-bold text-[#1A1A2E] hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? t.sending : t.sendInvitation}
          </button>
        </div>
      </form>
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
      PaperProps={{ sx: { borderRadius: 0, maxWidth: 400, width: "100%", bgcolor: "#fff" } }}
    >
      <div className="px-6 py-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="w-10 h-10 bg-red-50 border border-red-200 flex items-center justify-center mb-4">
          <DeleteOutlineIcon sx={{ fontSize: 18, color: "#ef4444" }} />
        </div>
        <h3 className="text-sm font-bold text-[#1A1A2E] mb-1">{t.removeConfirmatorTitle}</h3>
        <p className="text-xs text-[#1A1A2E]/55 leading-relaxed">
          {t.removeConfirmatorDesc.replace("{name}", confirmator?.fullName ?? "")}
        </p>
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-[#1A1A2E]/15 text-sm font-semibold text-[#1A1A2E]/60 hover:text-[#1A1A2E] transition-colors"
          >
            {t.keep}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold disabled:opacity-50 transition-colors"
          >
            {loading ? t.removing : t.remove}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// ─── Confirmator card ─────────────────────────────────────────────────────────
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

  const [expanded, setExpanded] = useState(false);
  const totalHandled = confirmator.confirmedOrders + confirmator.cancelledOrders;
  const confirmRate =
    totalHandled > 0
      ? Math.round((confirmator.confirmedOrders / totalHandled) * 100)
      : null;

  return (
    <div className="bg-white border border-[#1A1A2E]/8 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Main row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center text-[#C9A84C] font-bold text-sm shrink-0 select-none">
          {confirmator.fullName.slice(0, 2).toUpperCase()}
        </div>

        {/* Name + email */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-[#1A1A2E] truncate">
              {confirmator.fullName}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                confirmator.isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-[#1A1A2E]/5 text-[#1A1A2E]/40 border border-[#1A1A2E]/10"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  confirmator.isActive ? "bg-emerald-500" : "bg-[#1A1A2E]/30"
                }`}
              />
              {confirmator.isActive ? t.activeStatus : t.inactiveStatus}
            </span>
          </div>
          <p className="text-xs text-[#1A1A2E]/40 truncate mt-0.5">{confirmator.email}</p>
        </div>

        {/* Stats (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <StatPill value={confirmator.confirmedOrders} label={t.confirmedLabel.replace(":", "")} color="green" />
          <StatPill value={confirmator.cancelledOrders} label={t.cancelledLabel.replace(":", "")} color="red" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-8 h-8 flex items-center justify-center text-[#1A1A2E]/30 hover:text-[#1A1A2E]/70 hover:bg-[#1A1A2E]/5 transition-colors"
            title={expanded ? t.collapseTitle : t.viewDetailsTitle}
          >
            {expanded ? (
              <ExpandLessIcon sx={{ fontSize: 18 }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 18 }} />
            )}
          </button>
          <button
            onClick={() => onRemove(confirmator)}
            className="w-8 h-8 flex items-center justify-center text-[#1A1A2E]/25 hover:text-red-500 hover:bg-red-50 transition-colors"
            title={t.removeTitle2}
          >
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="border-t border-[#1A1A2E]/6 bg-[#FAF7F2] px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Contact info */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/40 mb-2">
                {t.contactSection}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#1A1A2E]/70">
                <EmailOutlinedIcon sx={{ fontSize: 13, color: "#C9A84C" }} />
                <span className="truncate">{confirmator.email}</span>
              </div>
              {confirmator.phoneNumber ? (
                <div className="flex items-center gap-2 text-xs text-[#1A1A2E]/70">
                  <PhoneOutlinedIcon sx={{ fontSize: 13, color: "#C9A84C" }} />
                  <span>{confirmator.phoneNumber}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-[#1A1A2E]/30">
                  <PhoneOutlinedIcon sx={{ fontSize: 13 }} />
                  <span>{t.noPhone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-[#1A1A2E]/50">
                <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: "#C9A84C" }} />
                <span>{t.joinedLabel} {formatDate(confirmator.createdAt, dateLocale)}</span>
              </div>
            </div>

            {/* Order stats */}
            <div className="sm:col-span-2 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/40 mb-2">
                {t.orderActivitySection}
              </p>

              {totalHandled === 0 ? (
                <p className="text-xs text-[#1A1A2E]/35">{t.noOrdersYet}</p>
              ) : (
                <>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <CheckCircleOutlinedIcon sx={{ fontSize: 15, color: "#10b981" }} />
                      <span className="text-xs text-[#1A1A2E]/60">
                        {t.confirmedLabel}{" "}
                        <span className="font-bold text-[#1A1A2E]">
                          {confirmator.confirmedOrders}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CancelOutlinedIcon sx={{ fontSize: 15, color: "#ef4444" }} />
                      <span className="text-xs text-[#1A1A2E]/60">
                        {t.cancelledLabel}{" "}
                        <span className="font-bold text-[#1A1A2E]">
                          {confirmator.cancelledOrders}
                        </span>
                      </span>
                    </div>
                    {confirmRate !== null && (
                      <span className="text-xs text-[#1A1A2E]/50">
                        {t.confirmRateLabel}{" "}
                        <span className="font-bold text-emerald-600">{confirmRate}%</span>
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {totalHandled > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#1A1A2E]/8 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{
                            width: `${(confirmator.confirmedOrders / totalHandled) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-[#1A1A2E]/40 shrink-0">
                        {totalHandled} {t.totalLabel2}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
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

  useEffect(() => {
    load();
  }, [load]);

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

  return (
    <SellerLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
              {t.title}
            </h1>
            <p className="text-sm text-[#1A1A2E]/45 mt-1">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 gold-gradient text-[#1A1A2E] text-sm font-bold hover:opacity-90 transition-opacity shrink-0"
          >
            <PersonAddOutlinedIcon sx={{ fontSize: 16 }} />
            {t.invite}
          </button>
        </div>

        {/* ── Summary cards ── */}
        {!loading && confirmators.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: t.totalLabel,
                value: confirmators.length,
                Icon: PeopleAltOutlinedIcon,
                color: "text-[#C9A84C]",
                bg: "bg-[#C9A84C]/10",
              },
              {
                label: t.ordersConfirmedLabel,
                value: totalConfirmed,
                Icon: CheckCircleOutlinedIcon,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: t.ordersCancelledLabel,
                value: totalCancelled,
                Icon: CancelOutlinedIcon,
                color: "text-red-500",
                bg: "bg-red-50",
              },
            ].map(({ label, value, Icon, color, bg }) => (
              <div
                key={label}
                className="bg-white border border-[#1A1A2E]/8 px-4 py-4 flex items-center gap-3"
              >
                <div className={`w-9 h-9 ${bg} flex items-center justify-center shrink-0`}>
                  <Icon sx={{ fontSize: 17 }} className={color} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1A1A2E]/40">
                    {label}
                  </p>
                  <p className="text-xl font-bold text-[#1A1A2E] leading-none mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── List ── */}
        <div>
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-[#1A1A2E]/8 px-5 py-4 flex items-center gap-4 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1A1A2E]/8 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-36 bg-[#1A1A2E]/8 rounded" />
                    <div className="h-3 w-48 bg-[#1A1A2E]/6 rounded" />
                  </div>
                  <div className="hidden md:flex gap-2">
                    <div className="h-7 w-24 bg-[#1A1A2E]/6 rounded" />
                    <div className="h-7 w-24 bg-[#1A1A2E]/6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white border border-red-200 px-5 py-4 text-sm text-red-500">
              {error}
            </div>
          ) : confirmators.length === 0 ? (
            <div className="bg-white border border-[#1A1A2E]/8 px-6 py-16 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 bg-[#1A1A2E]/5 flex items-center justify-center">
                <PeopleAltOutlinedIcon sx={{ fontSize: 24, color: "#1A1A2E", opacity: 0.25 }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]/60">{t.emptyTitle}</p>
                <p className="text-xs text-[#1A1A2E]/35 mt-1">{t.emptyDesc}</p>
              </div>
              <button
                onClick={() => setInviteOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 gold-gradient text-[#1A1A2E] text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <PersonAddOutlinedIcon sx={{ fontSize: 14 }} />
                {t.inviteFirst}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {confirmators.map((c) => (
                <ConfirmatorCard key={c._id} confirmator={c} onRemove={setRemoveTarget} />
              ))}
            </div>
          )}
        </div>

        {removeError && (
          <p className="text-xs text-red-500 text-center">{removeError}</p>
        )}
      </div>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvited={handleInvited}
      />

      <RemoveDialog
        confirmator={removeTarget}
        onCancel={() => {
          setRemoveTarget(null);
          setRemoveError("");
        }}
        onConfirm={handleRemove}
        loading={removeLoading}
      />
    </SellerLayout>
  );
}
