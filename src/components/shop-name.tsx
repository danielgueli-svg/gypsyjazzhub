import { Link } from "@tanstack/react-router";
import type { Shop } from "@/lib/shops";

export function ShopName({ shop }: { shop: Shop }) {
  return (
    <Link
      to="/shops/$slug"
      params={{ slug: shop.slug }}
      className="font-display text-xl font-semibold hover:underline"
    >
      {shop.name}
    </Link>
  );
}
