import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PhonelinkRingOutlinedIcon from "@mui/icons-material/PhonelinkRingOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import { useLang } from "../../context/LangContext";

const ICONS = [
  PlayCircleOutlineIcon,
  StorefrontOutlinedIcon,
  PhonelinkRingOutlinedIcon,
  SentimentSatisfiedAltOutlinedIcon,
];

/**
 * "Tried our app yet?" promo strip — adapted from Zalando to the Foda theme
 * (charcoal + gold). A bold title, star row, short subtitle, and a row of
 * feature icons. Dismissible for the session.
 */
export default function AppPromo() {
  const { tr } = useLang();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-6 lg:px-12">
      <div className="relative overflow-hidden rounded-2xl bg-[#F5F0E8] px-6 py-8 sm:px-10 lg:py-10">
        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-charcoal/50 transition-colors hover:bg-black/5 hover:text-charcoal"
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </button>

        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: copy */}
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              {tr.home.appPromoTitle}
            </h2>
            <div className="mt-2 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} sx={{ fontSize: 20, color: "#C9A84C" }} />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/60 sm:text-base">
              {tr.home.appPromoSubtitle}
            </p>
          </div>

          {/* Right: feature icons */}
          <div className="flex items-center gap-5 sm:gap-8">
            {ICONS.map((Icon, i) => (
              <div
                key={i}
                className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#C9A84C]/70 sm:h-16 sm:w-16"
              >
                <Icon sx={{ fontSize: 30, color: "#C9A84C" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
