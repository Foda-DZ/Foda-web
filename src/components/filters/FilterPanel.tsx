// Shared filter types & constants

export const COLOR_HEX: Record<string, string> = {
  black: "#1a1a1a", white: "#f5f5f5", beige: "#f5ead1", gray: "#9ca3af",
  grey: "#9ca3af", brown: "#7c3f1a", navy: "#1e3a5f", red: "#dc2626",
  burgundy: "#7f1d1d", pink: "#f9a8d4", orange: "#f97316", yellow: "#fde047",
  green: "#16a34a", olive: "#6b7c2d", blue: "#2563eb", teal: "#0d9488",
  purple: "#7c3aed", gold: "#C9A84C", khaki: "#c3b091", ivory: "#fffff0",
  cream: "#fffdd0", rose: "#fb7185", lavender: "#c4b5fd", sage: "#84a98c",
  silver: "#c0c0c0",
};

export const SUB_CATEGORIES = [
  "Shirts", "Pants", "Dresses", "Shoes", "Jackets",
  "Hoodies", "Jeans", "Shorts", "T-Shirts", "Sweaters",
  "Coats", "Bags", "Hats", "Other",
] as const;

export type SubCategory = typeof SUB_CATEGORIES[number];

export interface Filters {
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  subCategory: string;
}

export const defaultFilters: Filters = {
  priceRange: [0, 40000],
  sizes: [],
  colors: [],
  subCategory: "",
};

// Stub default export so stale imports don't break
export default function FilterPanel() { return null; }
