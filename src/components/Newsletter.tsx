import { useState, useRef, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MailIcon from "@mui/icons-material/Mail";
import { useLang } from "../context/LangContext";

export default function Newsletter() {
  const { tr } = useLang();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const trustBadges = [
    { num: tr.newsletter.statCustomers, label: tr.newsletter.labelCustomers },
    { num: tr.newsletter.statBrands, label: tr.newsletter.labelBrands },
    { num: tr.newsletter.statDelivery, label: tr.newsletter.labelDelivery },
    { num: tr.newsletter.statRating, label: tr.newsletter.labelRating },
  ];

  return (
    <section
      ref={ref}
      className="py-24 px-6 lg:px-12 bg-[#FAF7F2] relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 start-10 w-72 h-72 rounded-full bg-[#C9A84C]/5 blur-3xl" />
        <div className="absolute bottom-10 end-10 w-60 h-60 rounded-full bg-[#722F37]/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#1A1A2E 1px, transparent 1px), linear-gradient(90deg, #1A1A2E 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div
        className={`max-w-5xl mx-auto relative opacity-0-start ${visible ? "anim-scale-in" : ""}`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {trustBadges.map((b, i) => (
            <div
              key={i}
              className="text-center p-6 border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 transition-colors duration-300 group"
            >
              <div className="gold-text font-display text-4xl font-black mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">
                {b.num}
              </div>
              <p className="text-[#1A1A2E]/50 text-sm tracking-wider uppercase">
                {b.label}
              </p>
            </div>
          ))}
        </div>

        <div className="dark-gradient rounded-3xl p-10 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent pointer-events-none" />
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 gold-gradient rounded-2xl mb-6">
              <MailIcon sx={{ fontSize: 22, color: "#1A1A2E" }} />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              {tr.newsletter.stayIn}
              <br />
              <span className="animated-gold-text">{tr.newsletter.fashionLoop}</span>
            </h2>
            <p className="text-white/50 font-light max-w-md mx-auto mb-10">
              {tr.newsletter.subtitle}
            </p>
            {submitted ? (
              <div className="flex items-center justify-center gap-3 py-6">
                <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center">
                  <ArrowForwardIcon sx={{ fontSize: 20, color: "#1A1A2E" }} />
                </div>
                <div className="text-start">
                  <p className="text-white font-semibold">{tr.newsletter.successTitle}</p>
                  <p className="text-white/50 text-sm">
                    {tr.newsletter.successSub}
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tr.newsletter.placeholder}
                  required
                  className="flex-1 bg-white/8 border border-white/10 text-white placeholder-white/30 px-5 py-4 outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 text-sm"
                />
                <button
                  type="submit"
                  className="btn-gold flex items-center gap-2 group whitespace-nowrap"
                >
                  {tr.newsletter.subscribe}{" "}
                  <ArrowForwardIcon
                    sx={{ fontSize: 14 }}
                    className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  />
                </button>
              </form>
            )}
            <p className="text-white/25 text-xs mt-4">
              {tr.newsletter.privacy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
