import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useLang } from "../context/LangContext";

export default function PrivacyPage() {
  const { tr } = useLang();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<number | null>(0);

  const { badge, title, subtitle, sections } = tr.legal.privacy;

  return (
    <main className="min-h-screen bg-[#0d0d1a]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-linear-to-b from-[#1A1A2E] to-[#0d0d1a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase mb-6">
              <Shield size={12} />
              {badge}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              {title}
            </h1>
            <p className="text-white/45 text-base leading-relaxed max-w-xl mx-auto mb-8">
              {subtitle}
            </p>
            <p className="text-white/25 text-sm">
              {tr.legal.lastUpdated}: June 1, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 bg-white/3 border border-white/8 rounded-2xl p-5">
              <p className="text-white/35 text-[11px] font-semibold tracking-widest uppercase mb-4">
                {tr.legal.tableOfContents}
              </p>
              <nav className="space-y-1">
                {sections.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setExpanded(i);
                      document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`w-full text-start text-xs py-2 px-3 rounded-lg transition-colors duration-150 ${
                      expanded === i
                        ? "text-gold bg-gold/10"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-white/20 me-1.5">{String(i + 1).padStart(2, "0")}.</span>
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Accordion sections */}
          <div className="space-y-3">
            {sections.map((s, i) => (
              <motion.div
                key={i}
                id={`section-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className={`rounded-2xl border transition-colors duration-200 ${
                  expanded === i
                    ? "border-gold/25 bg-white/4"
                    : "border-white/7 bg-white/2 hover:border-white/12"
                }`}
              >
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gold/50 text-xs font-mono font-bold tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`font-semibold text-sm transition-colors ${expanded === i ? "text-white" : "text-white/70"}`}>
                      {s.title}
                    </span>
                  </div>
                  {expanded === i ? (
                    <ChevronDown size={16} className="text-gold shrink-0" />
                  ) : (
                    <ChevronRight size={16} className="text-white/25 shrink-0" />
                  )}
                </button>

                {expanded === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-6"
                  >
                    <div className="h-px bg-white/6 mb-5" />
                    <p className="text-white/55 text-sm leading-relaxed">{s.body}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-white/35 text-sm hover:text-gold transition-colors duration-200"
          >
            <ArrowLeft size={14} className="rtl:rotate-180" />
            {tr.legal.backHome}
          </button>
        </div>
      </section>
    </main>
  );
}
