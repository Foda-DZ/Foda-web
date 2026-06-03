import { useState, useRef, useCallback } from "react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  isRTL?: boolean;
}

export default function ImageGallery({ images, alt, isRTL = false }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const src = images[current] ?? "";

  const go = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, images.length - 1));
      setCurrent(clamped);
      thumbsRef.current
        ?.querySelectorAll("[data-thumb]")
        ?.[clamped]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    },
    [images.length],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(current + (diff > 0 ? 1 : -1));
  };

  // Thumbnail column — left in LTR, right in RTL; desktop only
  const thumbsColumn = images.length > 1 && (
    <div
      ref={thumbsRef}
      className="hidden lg:flex flex-col gap-2 overflow-y-auto max-h-[70vh]"
      style={{ scrollbarWidth: "none", width: 72 }}
    >
      {images.map((img, i) => (
        <button
          key={i}
          data-thumb
          onClick={() => go(i)}
          className={`shrink-0 w-[72px] aspect-[3/4] overflow-hidden border-2 transition-all duration-200 ${
            i === current
              ? "border-[#C9A84C] opacity-100"
              : "border-transparent opacity-50 hover:opacity-80"
          }`}
        >
          <img
            src={img}
            alt={`${alt} ${i + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
      {/* Thumbnail column */}
      {thumbsColumn}

      {/* Main image */}
      <div
        ref={mainRef}
        className="relative flex-1 overflow-hidden bg-[#F4F2EF] aspect-[3/4] max-h-[70vh] cursor-zoom-in"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
          style={
            zoomed
              ? { transform: "scale(2)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : undefined
          }
          draggable={false}
        />

        {/* Dot indicators — mobile only */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === current ? "w-5 h-1.5 bg-[#C9A84C]" : "w-1.5 h-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
