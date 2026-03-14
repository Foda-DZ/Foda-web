import { useState, useRef, useCallback } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const src = images[current] ?? "";

  const go = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, images.length - 1));
      setCurrent(clamped);
      // scroll thumbnail into view
      scrollRef.current
        ?.querySelectorAll("[data-thumb]")
        ?.[
          clamped
        ]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
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

  // Touch swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      go(current + (diff > 0 ? 1 : -1));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        ref={mainRef}
        className="relative overflow-hidden bg-[#F0EBE3] aspect-[3/4] lg:aspect-[4/5] max-h-[70vh] cursor-zoom-in group"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-300"
          style={
            zoomed
              ? {
                  transform: "scale(2)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }
              : undefined
          }
          draggable={false}
        />

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                go(current - 1);
              }}
              disabled={current === 0}
              sx={{
                position: "absolute",
                top: "50%",
                left: 8,
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.85)",
                borderRadius: 0,
                width: 36,
                height: 36,
                opacity: 0,
                transition: "opacity 0.2s",
                ".group:hover &": { opacity: 1 },
                "&:hover": { bgcolor: "#fff" },
                "&.Mui-disabled": { opacity: 0 },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 20, color: "#1A1A2E" }} />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                go(current + 1);
              }}
              disabled={current === images.length - 1}
              sx={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.85)",
                borderRadius: 0,
                width: 36,
                height: 36,
                opacity: 0,
                transition: "opacity 0.2s",
                ".group:hover &": { opacity: 1 },
                "&:hover": { bgcolor: "#fff" },
                "&.Mui-disabled": { opacity: 0 },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 20, color: "#1A1A2E" }} />
            </IconButton>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 text-[10px] font-semibold tracking-wider text-white bg-[#1A1A2E]/60 px-2.5 py-1">
            {current + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
        >
          {images.map((img, i) => (
            <button
              key={i}
              data-thumb
              onClick={() => go(i)}
              className={`flex-shrink-0 w-16 h-20 overflow-hidden border-2 transition-all duration-200 ${
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
      )}
    </div>
  );
}
