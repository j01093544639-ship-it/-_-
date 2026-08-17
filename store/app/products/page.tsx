import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "전체 상품",
  description: "온담의 건강식품 전체 상품 — 유산균, 오메가3, 비타민, 발효홍삼, 단백질, 수면·이완.",
};

const SORTS = [
  { key: "popular", label: "인기순" },
  { key: "price-asc", label: "낮은 가격순" },
  { key: "price-desc", label: "높은 가격순" },
  { key: "subscription", label: "정기배송" },
];

function effectivePrice(p: { price: number; salePrice?: number }) {
  return typeof p.salePrice === "number" ? p.salePrice : p.price;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;
  const categories = getCategories();

  let list = getAllProducts();
  if (category) list = list.filter((p) => p.category === category);
  if (sort === "subscription") list = list.filter((p) => p.subscription.enabled);

  list = [...list].sort((a, b) => {
    if (sort === "price-asc") return effectivePrice(a) - effectivePrice(b);
    if (sort === "price-desc") return effectivePrice(b) - effectivePrice(a);
    return b.rating - a.rating; // popular / default
  });

  const buildHref = (next: { category?: string | null; sort?: string | null }) => {
    const params = new URLSearchParams();
    const c = next.category === undefined ? category : next.category;
    const s = next.sort === undefined ? sort : next.sort;
    if (c) params.set("category", c);
    if (s) params.set("sort", s);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-sage text-cream"
        : "border border-line bg-cream text-ink hover:bg-sage-tint"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <header className="reveal">
        <h1 className="font-display text-4xl font-extrabold text-ink">전체 상품</h1>
        <p className="mt-3 text-muted">
          매일 챙기기 좋은 온담의 건강식품을 만나보세요. 총 {getAllProducts().length}종.
        </p>
      </header>

      {/* 카테고리 필터 */}
      <div className="mt-8 flex flex-wrap gap-2.5">
        <Link href={buildHref({ category: null })} className={chip(!category)}>
          전체
        </Link>
        {categories.map((c) => (
          <Link key={c} href={buildHref({ category: c })} className={chip(category === c)}>
            {c}
          </Link>
        ))}
      </div>

      {/* 정렬 */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="text-muted">정렬</span>
        {SORTS.map((s) => {
          const active = (sort ?? "popular") === s.key;
          return (
            <Link
              key={s.key}
              href={buildHref({ sort: s.key })}
              className={active ? "font-semibold text-sage-dark" : "text-muted hover:text-sage"}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      {list.length === 0 ? (
        <p className="mt-16 text-center text-muted">해당 조건의 상품이 없습니다.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
