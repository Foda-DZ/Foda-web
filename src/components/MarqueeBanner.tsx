const items = [
  "New Arrivals",
  "★",
  "Algerian Designers",
  "★",
  "Summer 2024",
  "★",
  "Free Shipping",
  "★",
  "Exclusive Drops",
  "★",
  "صيف ٢٠٢٤",
  "★",
  "New Arrivals",
  "★",
  "Algerian Designers",
  "★",
  "Summer 2024",
  "★",
  "Free Shipping",
  "★",
  "Exclusive Drops",
  "★",
  "صيف ٢٠٢٤",
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
