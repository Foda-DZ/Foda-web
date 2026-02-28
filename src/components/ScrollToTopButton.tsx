import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-8 right-6 z-50 w-11 h-11 gold-gradient flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
      style={{ animation: "fadeIn .2s ease" }}
    >
      <ArrowUp size={18} className="text-[#1A1A2E]" />
    </button>
  );
}
