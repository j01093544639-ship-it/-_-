import Link from "next/link";
import type { Product } from "@/lib/types";
import { won } from "@/lib/format";
import { LOWEST_PER_BOTTLE } from "@/lib/pricing";
import { ProductImage } from "./ProductImage";
import { Badge, StarRating } from "./ui";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-cream transition-all hover:-translate-y-1 hover:border-sage-light hover:shadow-[0_18px_40px_-24px_rgba(69,78,59,0.45)]"
    >
      <div className="relative aspect-square overflow-hidden bg-sand">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isBest && <Badge tone="clay">BEST</Badge>}
          {product.isNew && <Badge tone="sage">NEW</Badge>}
          {product.stock === 0 && <Badge tone="line">품절</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-sage">{product.category}</span>
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>
        <h3 className="text-[15px] font-semibold leading-snug text-ink">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted">{product.summary}</p>
        <div className="mt-auto pt-2">
          <p className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-ink">{won(product.price)}</span>
            <span className="text-xs text-muted">/ 1통</span>
          </p>
          <p className="mt-1 text-xs text-sage-dark">
            묶음 구매 시 통당 최저 {won(LOWEST_PER_BOTTLE)}
          </p>
        </div>
      </div>
    </Link>
  );
}
