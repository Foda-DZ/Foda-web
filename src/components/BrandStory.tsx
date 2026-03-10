import { useRef, useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useLang } from "../context/LangContext";

export default function BrandStory() {
  const { tr } = useLang();
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
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const values = [
    { title: tr.brandStory.val1Title, desc: tr.brandStory.val1Sub },
    { title: tr.brandStory.val2Title, desc: tr.brandStory.val2Sub },
    { title: tr.brandStory.val3Title, desc: tr.brandStory.val3Sub },
    { title: tr.brandStory.val4Title, desc: tr.brandStory.val4Sub },
  ];

  return (
    <section ref={ref} className="py-28 overflow-hidden dark-gradient relative">
      <div className="absolute top-0 start-0 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 end-0 w-80 h-80 bg-[#722F37]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Image collage */}
          <div className={`relative opacity-0-start ${visible ? "anim-fade-left" : ""}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl h-52">
                  <img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                    alt="brand1"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="overflow-hidden rounded-xl h-36">
                  <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80"
                    alt="brand2"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-10">
                <div className="overflow-hidden rounded-xl h-36">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80"
                    alt="brand3"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="overflow-hidden rounded-xl h-52">
                  <img
                    src="https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=400&q=80"
                    alt="brand4"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -end-4 lg:end-0 glass rounded-2xl p-5 border border-[#C9A84C]/20 animate-pulse-glow">
              <div className="gold-text font-display text-4xl font-black">
                {tr.brandStory.badgeYears}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {tr.brandStory.badgeLine1}
                <br />
                {tr.brandStory.badgeLine2}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`opacity-0-start ${visible ? "anim-fade-right delay-200" : ""}`}>
            <span className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase">
              {tr.brandStory.ourStory}
            </span>
            <div className="divider-gold" style={{ margin: "0.75rem 0" }} />
            <h2 className="font-display text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {tr.brandStory.bornFrom}
              <br />
              <span className="animated-gold-text">{tr.brandStory.algerianPride}</span>
            </h2>
            <p className="text-white/55 font-light leading-relaxed mb-4">
              {tr.brandStory.para1}
            </p>
            <p className="text-white/55 font-light leading-relaxed mb-10">
              {tr.brandStory.para2}
            </p>
            <div className="space-y-4 mb-10">
              {values.map((v, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <CheckCircleIcon
                    sx={{ fontSize: 18, color: "#C9A84C", mt: "2px", flexShrink: 0 }}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{v.title}</p>
                    <p className="text-white/45 text-sm font-light">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-gold flex items-center gap-2 group">
              {tr.brandStory.discoverBtn}{" "}
              <ArrowForwardIcon
                sx={{ fontSize: 15 }}
                className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
