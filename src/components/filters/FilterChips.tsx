import CloseIcon from "@mui/icons-material/Close";
import type { Filters } from "./FilterPanel";
import { defaultFilters } from "./FilterPanel";

interface FilterChipsProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function FilterChips({ filters, onChange }: FilterChipsProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.priceRange[1] < 40000) {
    chips.push({
      label: `Up to ${filters.priceRange[1].toLocaleString()} DZD`,
      onRemove: () => onChange({ ...filters, priceRange: [0, 40000] }),
    });
  }

  for (const size of filters.sizes) {
    chips.push({
      label: `Size: ${size}`,
      onRemove: () =>
        onChange({
          ...filters,
          sizes: filters.sizes.filter((s) => s !== size),
        }),
    });
  }

  for (const color of filters.colors) {
    chips.push({
      label: `Color: ${color}`,
      onRemove: () =>
        onChange({
          ...filters,
          colors: filters.colors.filter((c) => c !== color),
        }),
    });
  }

  for (const seller of filters.sellers) {
    chips.push({
      label: `Seller: ${seller}`,
      onRemove: () =>
        onChange({
          ...filters,
          sellers: filters.sellers.filter((s) => s !== seller),
        }),
    });
  }

  if (filters.rating > 0) {
    chips.push({
      label: `${filters.rating}+ Stars`,
      onRemove: () => onChange({ ...filters, rating: 0 }),
    });
  }

  if (filters.availability === "instock") {
    chips.push({
      label: "In Stock Only",
      onRemove: () => onChange({ ...filters, availability: "all" }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={chip.onRemove}
          className="flex items-center gap-1 px-2.5 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-xs font-medium text-[#C9A84C] hover:bg-[#C9A84C]/20 transition-colors duration-150"
        >
          {chip.label}
          <CloseIcon sx={{ fontSize: 12 }} />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={() => onChange(defaultFilters)}
          className="text-xs font-semibold text-[#1A1A2E]/40 hover:text-red-500 transition-colors duration-150"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
