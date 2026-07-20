import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { useLang } from "../../context/LangContext";

const ITEMS = [
  { icon: LocalShippingOutlinedIcon, en: "Delivery to all 58 wilayas", ar: "توصيل لكل 58 ولاية" },
  { icon: PaymentsOutlinedIcon, en: "Cash on delivery", ar: "الدفع عند الاستلام" },
  { icon: VerifiedOutlinedIcon, en: "100% verified sellers", ar: "بائعون موثقون 100%" },
  { icon: SupportAgentOutlinedIcon, en: "7-day support", ar: "دعم 7 أيام" },
];

/** Light, minimal reassurance strip — icons + short labels, plenty of air. */
export default function TrustStrip() {
  const { isRTL } = useLang();

  return (
    <div className="border-y border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-6 sm:grid-cols-4 lg:px-12">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center justify-center gap-2.5">
              <Icon sx={{ fontSize: 20, color: "#1A1A2E" }} />
              <span className="text-xs font-medium text-neutral-700 sm:text-sm">
                {isRTL ? item.ar : item.en}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
