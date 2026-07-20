import type { Product, Variant, Collection, CollectionProduct } from "../types";
import type { ApiProduct, ApiVariant, ApiCollection, ApiCollectionProduct } from "../types/api";

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

  const apiVariants: ApiVariant[] = Array.isArray(p.variants) ? p.variants : [];
  const variants: Variant[] = apiVariants.map((v) => ({
    variantId: v._id,
    size: v.size,
    color: v.color,
    stock: Number(v.stock) || 0,
    sku: v.sku,
  }));
  const totalStock =
    typeof p.totalStock === "number"
      ? p.totalStock
      : variants.reduce((sum, v) => sum + v.stock, 0);

  return {
    id: p._id,
    name: p.name,
    brand: p.brand ?? "",
    category: p.mainCategory,
    subCategory: p.subCategory,
    price: p.price,
    originalPrice: (p as Record<string, unknown>).originalPrice as number | undefined,
    images: apiImages.map((img) => img.url),
    sizes: normArr(p.sizes),
    colors: normArr(p.colors),
    variants,
    totalStock,
    inStock: typeof p.inStock === "boolean" ? p.inStock : totalStock > 0,
    description: p.description ?? "",
    isNew: new Date(p.createdAt).getTime() > sevenDaysAgo,
    createdAt: p.createdAt,
    sellerId: p.sellerId,
    sellerName: (p as Record<string, unknown>).sellerName as string | undefined,
    rating: (p as Record<string, unknown>).rating as number | undefined,
    promotion: p.promotion,
  };
}

export function apiCollectionToCollection(c: ApiCollection): Collection {
  const rawProducts = Array.isArray(c.products) ? c.products : [];

  const products: CollectionProduct[] = rawProducts
    .filter((p): p is ApiCollectionProduct => typeof p === "object" && p !== null && "_id" in p)
    .map((p) => ({
      id: p._id,
      name: p.name,
      brand: p.brand ?? "",
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0].url : null,
      price: p.price,
      totalStock: p.totalStock,
      inStock: p.inStock,
    }));

  return {
    id: c._id,
    name: c.name,
    description: c.description ?? "",
    coverImage: c.coverImage?.url ?? null,
    productCount: rawProducts.length,
    products,
    createdAt: c.createdAt,
  };
}
