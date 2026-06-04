import { useRef, useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { useLang } from "../context/LangContext";

type Tab = "buyer" | "seller";

const BUYER_STEPS = [
  {
    icon: SearchOutlinedIcon,
    en: { title: "Browse & Discover", desc: "Explore hundreds of verified Algerian fashion sellers across every category — women, men, kids & accessories." },
    ar: { title: "تصفح واكتشف", desc: "استكشف مئات البائعين الجزائريين الموثقين في كل الفئات — نساء، رجال، أطفال وإكسسوارات." },
  },
  {
    icon: ShoppingBagOutlinedIcon,
    en: { title: "Add to Cart & Checkout", desc: "Pick your favourites, choose your size and colour, then check out securely in seconds." },
    ar: { title: "أضف للسلة وأتمم الشراء", desc: "اختر ما يعجبك، حدد المقاس واللون، ثم أتمم الشراء بأمان في ثوانٍ." },
  },
  {
    icon: LocalShippingOutlinedIcon,
    en: { title: "Receive Anywhere in Algeria", desc: "Fast delivery to all 58 wilayas. Track your order in real time and enjoy hassle-free returns." },
    ar: { title: "استقبل طلبك في أي مكان", desc: "توصيل سريع لكل 58 ولاية. تتبع طلبك في الوقت الحقيقي واستمتع بإرجاع بدون متاعب." },
  },
];

const SELLER_STEPS = [
  {
    icon: StoreOutlinedIcon,
    en: { title: "Create Your Store", desc: "Sign up, set up your shop profile, upload your logo and start listing products in minutes." },
    ar: { title: "أنشئ متجرك", desc: "سجّل، أنشئ ملف متجرك، ارفع شعارك وابدأ في إضافة منتجاتك في دقائق." },
  },
  {
    icon: InventoryOutlinedIcon,
    en: { title: "List & Manage Products", desc: "Add unlimited products with sizes, colours and stock levels. Run promotions and manage orders from your dashboard." },
    ar: { title: "أضف وأدر منتجاتك", desc: "أضف منتجات غير محدودة بالمقاسات والألوان والمخزون. أدر الطلبات وشغّل العروض من لوحة التحكم." },
  },
  {
    icon: AttachMoneyOutlinedIcon,
    en: { title: "Sell & Get Paid Fast", desc: "Receive orders from buyers across Algeria. Payouts processed within 48 hours — zero hidden fees." },
    ar: { title: "بع واستلم أرباحك بسرعة", desc: "استقبل طلبات من مشترين عبر الجزائر. يتم صرف الأرباح خلال 48 ساعة — بدون رسوم خفية." },
  },
];

export default function HowItWorks() {
  const { isRTL } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>("buyer");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const steps = activeTab === "buyer" ? BUYER_STEPS : SELLER_STEPS;

  return (
    <section ref={ref} className="py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className={`text-center mb-12 opacity-0-start ${visible ? "anim-scale-in" : ""}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px gold-gradient" />
            <span className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase">
              {isRTL ? "كيف يعمل؟" : "How It Works"}
            </span>
            <span className="w-8 h-px gold-gradient" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-charcoal leading-none mb-4">
            {isRTL ? (
              <>سهل ومباشر — <span className="gold-text">للجميع</span></>
            ) : (
              <>Simple by Design — <span className="gold-text">For Everyone</span></>
            )}
          </h2>
          <p className="text-charcoal/50 text-sm font-light max-w-lg mx-auto">
            {isRTL
              ? "سواء كنت مشترياً يبحث عن أفضل الأزياء أو بائعاً يريد توسيع أعماله، فودا يجعل الأمر بسيطاً."
              : "Whether you're a buyer hunting the best fashion or a seller ready to grow — Foda makes it effortless."}
          </p>
        </div>

        {/* Tab switcher */}
        <div
          className={`flex justify-center mb-12 opacity-0-start ${visible ? "anim-fade-up delay-100" : ""}`}
        >
          <div className="inline-flex bg-white border border-charcoal/8 rounded-full p-1 gap-1 shadow-sm">
            {(["buyer", "seller"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? "gold-gradient text-charcoal shadow-md"
                    : "text-charcoal/50 hover:text-charcoal"
                }`}
              >
                {tab === "buyer"
                  ? isRTL ? "للمشترين" : "I'm a Buyer"
                  : isRTL ? "للبائعين" : "I'm a Seller"}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            const content = isRTL ? step.ar : step.en;
            return (
              <div
                key={i}
                className={`relative flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-charcoal/6 hover:border-gold/30 hover:shadow-lg transition-all duration-300 opacity-0-start ${
                  visible ? `anim-fade-up delay-${(i + 2) * 100}` : ""
                }`}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 gold-gradient rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-charcoal text-xs font-black">{i + 1}</span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-[#F5F0E8] flex items-center justify-center mb-5 mt-4">
                  <Icon sx={{ fontSize: 28, color: "#C9A84C" }} />
                </div>

                <h3 className="font-display text-lg font-black text-charcoal mb-3 leading-tight">
                  {content.title}
                </h3>
                <p className="text-charcoal/50 text-sm font-light leading-relaxed">
                  {content.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
