import { useState, useRef, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLang } from "../context/LangContext";

const INTEREST_TAGS_EN = ["Women", "Men", "Kids", "Accessories", "New Drops", "Sales"];
const INTEREST_TAGS_AR = ["نساء", "رجال", "أطفال", "إكسسوارات", "وصل حديثاً", "تخفيضات"];

export default function Newsletter() {
  const { tr, isRTL } = useLang();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(""); }
  };

  const toggleTag = (i: number) =>
    setSelectedTags((prev) => prev.includes(i) ? prev.filter((t) => t !== i) : [...prev, i]);

  const tags = isRTL ? INTEREST_TAGS_AR : INTEREST_TAGS_EN;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-cream py-20"
    >
      {/* Background decorations */}
      <div className="absolute top-0 start-0 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-0 w-64 h-64 rounded-full bg-burgundy/5 blur-3xl pointer-events-none" />

      <div
        className={`max-w-3xl mx-auto px-6 lg:px-0 relative z-10 opacity-0-start ${
          visible ? "anim-scale-in" : ""
        }`}
      >
        <div className="dark-gradient rounded-3xl p-10 lg:p-14 relative overflow-hidden shadow-2xl">
          {/* Top gold line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          {/* Corner accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 gold-gradient rounded-2xl mb-6 shadow-lg">
              <MailOutlineIcon sx={{ fontSize: 22, color: "#1A1A2E" }} />
            </div>

            <h2 className="font-display text-3xl lg:text-4xl font-black text-white mb-3">
              {tr.newsletter.stayIn}
              <br />
              <span className="animated-gold-text">{tr.newsletter.fashionLoop}</span>
            </h2>

            <p className="text-white/50 font-light text-sm max-w-sm mx-auto mb-8">
              {tr.newsletter.subtitle}
            </p>

            {/* Interest tags */}
            {!submitted && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {tags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => toggleTag(i)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                      selectedTags.includes(i)
                        ? "gold-gradient text-charcoal border-transparent shadow-md"
                        : "border-white/15 text-white/50 hover:border-gold/40 hover:text-white/80"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {submitted ? (
              <div className="flex items-center justify-center gap-3 py-6">
                <CheckCircleOutlineIcon sx={{ fontSize: 36, color: "#C9A84C" }} />
                <div className="text-start">
                  <p className="text-white font-bold">{tr.newsletter.successTitle}</p>
                  <p className="text-white/45 text-sm">{tr.newsletter.successSub}</p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tr.newsletter.placeholder}
                  required
                  className="flex-1 bg-white/8 border border-white/10 text-white placeholder-white/30 px-5 py-3.5 rounded-lg outline-none focus:border-gold/60 transition-colors duration-300 text-sm"
                />
                <button
                  type="submit"
                  className="btn-gold flex items-center justify-center gap-2 group whitespace-nowrap rounded-lg"
                >
                  {tr.newsletter.subscribe}
                  <ArrowForwardIcon
                    sx={{ fontSize: 14 }}
                    className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
                  />
                </button>
              </form>
            )}

            <p className="text-white/20 text-xs mt-5">{tr.newsletter.privacy}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
