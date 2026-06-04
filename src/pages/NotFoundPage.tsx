import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useLang } from "../context/LangContext";

const floatVariants = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
  },
};

const dotVariants = {
  animate: (i: number) => ({
    scale: [1, 1.5, 1],
    opacity: [0.3, 1, 0.3],
    transition: { duration: 1.6, repeat: Infinity, delay: i * 0.25 },
  }),
};

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { tr } = useLang();

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-16 overflow-hidden relative">

      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-[#1A1A2E]/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">

        {/* Floating icon */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          className="mb-8"
        >
          <div className="relative">
            {/* Outer glow ring */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gold/30 blur-xl"
            />
            <div className="relative w-28 h-28 bg-white border border-charcoal/8 rounded-full flex items-center justify-center shadow-xl shadow-charcoal/6">
              <SearchOffIcon sx={{ fontSize: 52, color: "#C9A84C" }} />
            </div>
          </div>
        </motion.div>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative mb-4 select-none"
        >
          <span
            className="font-display font-black text-[7rem] sm:text-[9rem] leading-none tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #e5c96d 40%, #a07828 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {tr.notFound.code}
          </span>
          {/* Subtle underline dash */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto origin-center"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-3"
        >
          {tr.notFound.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-charcoal/50 text-sm sm:text-base leading-relaxed mb-10 max-w-sm"
        >
          {tr.notFound.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate("/")}
            className="btn-dark flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 text-sm font-semibold tracking-wide group"
          >
            <HomeIcon sx={{ fontSize: 17 }} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
            {tr.notFound.goHome}
          </button>

          <button
            onClick={() => navigate("/shop")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 text-sm font-semibold tracking-wide border-2 border-charcoal/15 text-charcoal hover:border-gold hover:text-gold transition-all duration-200 group"
          >
            <StorefrontIcon sx={{ fontSize: 17 }} className="transition-transform duration-200 group-hover:scale-110" />
            {tr.notFound.goShop}
          </button>
        </motion.div>

        {/* Hint text with animated dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex items-center gap-2 mt-8 text-charcoal/30 text-xs"
        >
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                custom={i}
                variants={dotVariants}
                animate="animate"
                className="w-1 h-1 rounded-full bg-gold inline-block"
              />
            ))}
          </div>
          <span>{tr.notFound.hint}</span>
        </motion.div>
      </div>
    </div>
  );
}
