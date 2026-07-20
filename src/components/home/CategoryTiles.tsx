import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";

interface Tile {
  key: "women" | "men" | "kids" | "accessories";
  route: string;
  image: string;
}

const TILES: Tile[] = [
  {
    key: "women",
    route: "/shop?category=Women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80",
  },
  {
    key: "men",
    route: "/shop?category=Men",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80",
  },
  {
    key: "kids",
    route: "/shop?category=Kids",
    image:
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=700&q=80",
  },
  {
    key: "accessories",
    route: "/shop?category=Accessories",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80",
  },
];

/**
 * Simple, flat category tiles — a photo, a label, and a subtle hover.
 * Clean and product-first, in the Zalando style.
 */
export default function CategoryTiles() {
  const navigate = useNavigate();
  const { tr } = useLang();

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-12 lg:py-20">
      <h2 className="mb-6 text-xl font-bold tracking-tight text-black sm:text-2xl">
        {tr.home.shopByCategory}
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {TILES.map((tile) => (
          <button
            key={tile.key}
            onClick={() => navigate(tile.route)}
            className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100 text-start"
          >
            <img
              src={tile.image}
              alt={tr.categories.items[tile.key].name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            <span className="absolute bottom-4 start-4 text-lg font-semibold text-white">
              {tr.categories.items[tile.key].name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
