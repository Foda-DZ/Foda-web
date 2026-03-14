import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarIcon from "@mui/icons-material/Star";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";

const COLOR_HEX: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f9f9f9",
  beige: "#f5f0e1",
  gray: "#9ca3af",
  grey: "#9ca3af",
  brown: "#7c3f1a",
  navy: "#1e3a5f",
  red: "#dc2626",
  burgundy: "#7f1d1d",
  pink: "#f9a8d4",
  orange: "#f97316",
  yellow: "#fde047",
  green: "#16a34a",
  olive: "#6b7c2d",
  blue: "#2563eb",
  teal: "#0d9488",
  purple: "#7c3aed",
  gold: "#C9A84C",
  khaki: "#c3b091",
  ivory: "#fffff0",
  cream: "#fffdd0",
  rose: "#fb7185",
  lavender: "#c4b5fd",
  sage: "#84a98c",
  silver: "#c0c0c0",
};

export interface Filters {
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  sellers: string[];
  rating: number;
  availability: "all" | "instock";
}

export const defaultFilters: Filters = {
  priceRange: [0, 40000],
  sizes: [],
  colors: [],
  sellers: [],
  rating: 0,
  availability: "all",
};

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  availableSizes: string[];
  availableColors: string[];
  availableSellers: string[];
  maxPrice: number;
}

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#1A1A2E]/8 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-3"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-[#1A1A2E]/60">
          {title}
        </p>
        <KeyboardArrowDownIcon
          sx={{ fontSize: 16, color: "rgba(26,26,46,0.3)" }}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && children}
    </div>
  );
}

function MultiCheckbox({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val],
    );
  };
  return (
    <div className="space-y-1.5 max-h-44 overflow-y-auto">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`w-full flex items-center gap-2 px-1 py-1 text-sm transition-colors duration-150 ${
              active
                ? "text-[#C9A84C]"
                : "text-[#1A1A2E]/60 hover:text-[#1A1A2E]"
            }`}
          >
            {active ? (
              <CheckBoxIcon sx={{ fontSize: 16, color: "#C9A84C" }} />
            ) : (
              <CheckBoxOutlineBlankIcon sx={{ fontSize: 16, opacity: 0.3 }} />
            )}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function FilterContent({
  filters,
  onChange,
  availableSizes,
  availableColors,
  availableSellers,
  maxPrice,
}: FilterPanelProps) {
  return (
    <div>
      {/* Price Range */}
      <FilterSection title="Price Range">
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={500}
          value={filters.priceRange[1]}
          onChange={(e) =>
            onChange({
              ...filters,
              priceRange: [filters.priceRange[0], Number(e.target.value)],
            })
          }
          className="w-full accent-[#C9A84C]"
        />
        <div className="flex justify-between text-xs text-[#1A1A2E]/50 mt-1">
          <span>0 DZD</span>
          <span className="font-semibold text-[#C9A84C]">
            {filters.priceRange[1].toLocaleString()} DZD
          </span>
        </div>
      </FilterSection>

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((size) => {
              const active = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() =>
                    onChange({
                      ...filters,
                      sizes: active
                        ? filters.sizes.filter((s) => s !== size)
                        : [...filters.sizes, size],
                    })
                  }
                  className={`px-2.5 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                    active
                      ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "border-[#1A1A2E]/15 text-[#1A1A2E]/50 hover:border-[#C9A84C]/50"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Colors */}
      {availableColors.length > 0 && (
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const active = filters.colors.includes(color);
              const hex = COLOR_HEX[color.toLowerCase()] ?? color.toLowerCase();
              return (
                <button
                  key={color}
                  onClick={() =>
                    onChange({
                      ...filters,
                      colors: active
                        ? filters.colors.filter((c) => c !== color)
                        : [...filters.colors, color],
                    })
                  }
                  title={color}
                  className={`w-7 h-7 rounded-full ring-2 ring-offset-1 transition-all duration-200 ${
                    active
                      ? "ring-[#C9A84C] scale-110"
                      : "ring-transparent hover:ring-[#1A1A2E]/20"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Seller */}
      {availableSellers.length > 0 && (
        <FilterSection title="Seller" defaultOpen={false}>
          <MultiCheckbox
            options={availableSellers}
            selected={filters.sellers}
            onChange={(sellers) => onChange({ ...filters, sellers })}
          />
        </FilterSection>
      )}

      {/* Rating */}
      <FilterSection title="Rating" defaultOpen={false}>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() =>
                onChange({ ...filters, rating: filters.rating === r ? 0 : r })
              }
              className={`w-full flex items-center gap-2 px-1 py-1.5 text-sm transition-colors duration-150 ${
                filters.rating === r
                  ? "text-[#C9A84C]"
                  : "text-[#1A1A2E]/50 hover:text-[#1A1A2E]"
              }`}
            >
              <div className="flex items-center gap-px">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon
                    key={s}
                    sx={{
                      fontSize: 14,
                      color: s <= r ? "#C9A84C" : "#1A1A2E1A",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs">& Up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" defaultOpen={false}>
        <div className="space-y-1.5">
          {[
            { value: "all" as const, label: "All Products" },
            { value: "instock" as const, label: "In Stock Only" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ ...filters, availability: value })}
              className={`w-full flex items-center gap-2 px-1 py-1.5 text-sm transition-colors duration-150 ${
                filters.availability === value
                  ? "text-[#C9A84C] font-semibold"
                  : "text-[#1A1A2E]/50 hover:text-[#1A1A2E]"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  filters.availability === value
                    ? "border-[#C9A84C]"
                    : "border-[#1A1A2E]/20"
                }`}
              >
                {filters.availability === value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                )}
              </span>
              {label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

export default function FilterPanel(
  props: FilterPanelProps & { mobileOpen: boolean; onMobileClose: () => void },
) {
  const { mobileOpen, onMobileClose, ...filterProps } = props;

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white border border-[#1A1A2E]/8 p-5">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#1A1A2E]/8">
            <TuneIcon sx={{ fontSize: 16, color: "#C9A84C" }} />
            <p className="text-sm font-bold tracking-wide text-[#1A1A2E]">
              Filters
            </p>
          </div>
          <FilterContent {...filterProps} />
        </div>
      </div>

      {/* Mobile drawer */}
      <Drawer
        anchor="bottom"
        open={mobileOpen}
        onClose={onMobileClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "85vh",
          },
        }}
      >
        <div className="px-5 pt-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TuneIcon sx={{ fontSize: 16, color: "#C9A84C" }} />
              <p className="text-base font-bold text-[#1A1A2E]">Filters</p>
            </div>
            <IconButton size="small" onClick={onMobileClose}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </div>
          <FilterContent {...filterProps} />
          <button
            onClick={onMobileClose}
            className="w-full mt-5 btn-gold text-center"
          >
            Apply Filters
          </button>
        </div>
      </Drawer>
    </>
  );
}
