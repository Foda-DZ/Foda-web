import type { Product } from "../types";
import type { ApiProduct } from "../types/api";

/** Map a raw API product to the frontend Product shape */
export function apiProductToProduct(p: ApiProduct): Product {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const apiImages = Array.isArray(p.images) ? p.images : [];
  return {
    id: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    images: apiImages.map((img) => img.url),
    sizes: typeof p.size === "string" && p.size
      ? p.size.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    description: p.description ?? "",
    stock: p.stock ?? 0,
    isNew: new Date(p.createdAt).getTime() > sevenDaysAgo,
    sellerId: p.sellerId,
  };
}
