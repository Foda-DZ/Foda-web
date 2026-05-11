/**
 * Size Options Utility
 * Maps product sub-categories to their appropriate size options
 * Optimized for performance with minimal re-renders
 */

export type SizeOption = string;

// Shoe sizes (European standard: 36-48)
export const SHOE_SIZES: SizeOption[] = [
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
];

// Clothing sizes
export const CLOTHING_SIZES: SizeOption[] = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
];

// One size (for accessories, hats, bags, etc.)
export const ONE_SIZE: SizeOption[] = ["One Size"];

// Sub-categories that use shoe sizes
const SHOE_CATEGORIES = new Set([
    "Shoes",
]);

// Sub-categories that use one size
const ONE_SIZE_CATEGORIES = new Set([
    "Bags",
    "Hats",
    "Accessories",
]);

// Sub-categories that use clothing sizes (default)
const CLOTHING_CATEGORIES = new Set([
    "Shirts",
    "Pants",
    "Dresses",
    "Jackets",
    "Hoodies",
    "Jeans",
    "Shorts",
    "T-Shirts",
    "Sweaters",
    "Coats",
    "Other",
]);

/**
 * Get available sizes for a given sub-category
 * @param subCategory - Product sub-category
 * @returns Array of size options
 */
export const getSizesByCategory = (subCategory: string): SizeOption[] => {
    if (SHOE_CATEGORIES.has(subCategory)) {
        return SHOE_SIZES;
    }
    if (ONE_SIZE_CATEGORIES.has(subCategory)) {
        return ONE_SIZE;
    }
    return CLOTHING_SIZES;
};

/**
 * Check if category uses numeric sizes
 * @param subCategory - Product sub-category
 * @returns true if numeric sizes are used
 */
export const isNumericSizes = (subCategory: string): boolean => {
    return SHOE_CATEGORIES.has(subCategory);
};

/**
 * Check if category uses one size only
 * @param subCategory - Product sub-category
 * @returns true if one size only
 */
export const isOneSizeOnly = (subCategory: string): boolean => {
    return ONE_SIZE_CATEGORIES.has(subCategory);
};
