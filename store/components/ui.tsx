import { Star } from "lucide-react";
import { won, discountRate } from "@/lib/format";

export function Badge({
  children,
  tone = "sage",
}: {
  children: React.ReactNode;
  tone?: "sage" | "clay" | "line";
}) {
  const tones = {
    sage: "bg-sage-tint text-sage-dark",
    clay: "bg-clay-tint text-clay",
    line: "border border-line text-muted",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function StarRating({
  rating,
  count,
  size = 14,
}: {
  rating: number;
  count?: number;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted">
      <Star size={size} className="fill-clay text-clay" strokeWidth={0} />
      <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
      {typeof count === "number" && <span className="text-muted">({count})</span>}
    </span>
  );
}

export function Price({
  price,
  salePrice,
  className = "",
}: {
  price: number;
  salePrice?: number;
  className?: string;
}) {
  const has = typeof salePrice === "number" && salePrice < price;
  return (
    <span className={`flex items-baseline gap-2 ${className}`}>
      {has && (
        <span className="text-sm font-bold text-clay">{discountRate(price, salePrice!)}%</span>
      )}
      <span className="text-lg font-bold text-ink">{won(has ? salePrice! : price)}</span>
      {has && <span className="text-sm text-muted line-through">{won(price)}</span>}
    </span>
  );
}
