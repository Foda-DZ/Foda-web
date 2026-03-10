const items = [
  "New Arrivals",
  "★",
  "500+ Sellers",
  "★",
  "Sell on Foda",
  "★",
  "Free Shipping",
  "★",
  "Exclusive Drops",
  "★",
  "بع على فودة",
  "★",
  "New Arrivals",
  "★",
  "Algerian Brands",
  "★",
  "Sell on Foda",
  "★",
  "Free Shipping",
  "★",
  "Exclusive Drops",
  "★",
  "بع على فودة",
  "★",
];

export default function MarqueeBanner() {
  return (
    <div className="gold-gradient py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-[#1A1A2E] text-xs font-bold tracking-widest uppercase mx-6"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
