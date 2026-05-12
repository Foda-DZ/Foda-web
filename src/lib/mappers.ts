import type { Product } from "../types";
import type { ApiProduct } from "../types/api";

/** Map a raw API product to the frontend Product shape */
export function apiProductToProduct(p: ApiProduct): Product {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const apiImages = Array.isArray(p.images) ? p.images : [];

  // Normalize sizes/colors: split any legacy comma-separated entries
  const normArr = (arr: unknown): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr.flatMap((v: string) =>
      v.includes(",") ? v.split(",").map((s) => s.trim()).filter(Boolean) : [v],
    );
  };

  return {
    id: p._id,
    name: p.name,
    category: p.mainCategory,
    subCategory: p.subCategory,
    price: p.price,
    originalPrice: (p as Record<string, unknown>).originalPrice as number | undefined,
    images: apiImages.map((img) => img.url),
    sizes: normArr(p.sizes),
    colors: normArr(p.colors),
    description: p.description ?? "",
    stock: p.stock ?? 0,
    isNew: new Date(p.createdAt).getTime() > sevenDaysAgo,
    sellerId: p.sellerId,
    sellerName: (p as Record<string, unknown>).sellerName as string | undefined,
    brand: (p as Record<string, unknown>).brand as string | undefined,
    rating: (p as Record<string, unknown>).rating as number | undefined,
    promotion: p.promotion,
  };
}
