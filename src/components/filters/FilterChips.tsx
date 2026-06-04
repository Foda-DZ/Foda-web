import CloseIcon from "@mui/icons-material/Close";
import type { Filters } from "./FilterPanel";
import { defaultFilters } from "./FilterPanel";

interface FilterChipsProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  maxPrice?: number;
}

export default function FilterChips({ filters, onChange, maxPrice = 40000 }: FilterChipsProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.subCategory) {
    chips.push({
      label: filters.subCategory,
      onRemove: () => onChange({ ...filters, subCategory: "" }),
    });
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) {
    chips.push({
      label: `${filters.priceRange[0].toLocaleString()} – ${filters.priceRange[1].toLocaleString()} DZD`,
      onRemove: () => onChange({ ...filters, priceRange: [0, maxPrice] }),
    });
  }

  for (const size of filters.sizes) {
    chips.push({
      label: size,
      onRemove: () => onChange({ ...filters, sizes: filters.sizes.filter((s) => s !== size) }),
    });
  }

  for (const color of filters.colors) {
    chips.push({
      label: color,
      onRemove: () => onChange({ ...filters, colors: filters.colors.filter((c) => c !== color) }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={chip.onRemove}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/8 border border-gold/25 text-[11px] font-bold text-gold hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all duration-150 capitalize"
        >
          {chip.label}
          <CloseIcon sx={{ fontSize: 10 }} className="opacity-60 group-hover:opacity-100" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={() => onChange({ ...defaultFilters, priceRange: [0, maxPrice] })}
          className="text-[11px] font-bold text-charcoal/35 hover:text-red-500 transition-colors duration-150 underline underline-offset-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
