import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Leaf,
  Info,
  Truck,
  ShieldCheck,
  Star,
} from "lucide-react";
import {
  getAllProducts,
  getProductBySlug,
  getReviewsByProduct,
} from "@/lib/products";
import { ProductArt } from "@/components/ProductArt";
import { PurchaseOptions } from "@/components/PurchaseOptions";
import { ReviewForm } from "@/components/ReviewForm";
import { Badge, StarRating } from "@/components/ui";
import { won, formatDate } from "@/lib/format";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "상품을 찾을 수 없습니다" };
  return {
    title: product.name,
    description: product.summary,
    openGraph: { title: product.name, description: product.summary },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const reviews = getReviewsByProduct(product.id);
  const related = getAllProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      price: product.salePrice ?? product.price,
      priceCurrency: "KRW",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted" aria-label="위치">
        <Link href="/products" className="hover:text-sage">
          전체 상품
        </Link>
        <ChevronRight size={14} />
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-sage">
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-ink">{product.name}</span>
      </nav>

      {/* Main */}
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="reveal">
          <div className="overflow-hidden rounded-3xl border border-line bg-cream">
            <ProductArt
              accent={product.accent}
              category={product.category}
              label={product.name}
              className="aspect-square w-full"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <Badge key={b} tone="sage">
                {b}
              </Badge>
            ))}
          </div>
        </div>

        <div className="reveal reveal-1">
          <p className="text-sm font-semibold text-sage">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-snug text-ink">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>
          <p className="mt-4 leading-relaxed text-muted">{product.summary}</p>
          <p className="mt-2 text-sm text-muted">{product.servings}</p>

          <div className="mt-7">
            <PurchaseOptions
              id={product.id}
              slug={product.slug}
              name={product.name}
              accent={product.accent}
              category={product.category}
              price={product.price}
              salePrice={product.salePrice}
              stock={product.stock}
              intervalDays={product.subscription.intervalDays}
              discountPercent={product.subscription.discountPercent}
              subscriptionEnabled={product.subscription.enabled}
            />
          </div>

          <ul className="mt-7 space-y-2.5 rounded-2xl bg-sand/50 p-5 text-sm text-muted">
            <li className="flex items-center gap-2.5">
              <Truck size={16} className="text-sage" /> 3만원 이상 무료배송 · 오후 2시 이전
              주문 시 당일 출고
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-sage" /> 미개봉 상품 7일 이내 청약철회
              가능
            </li>
            <li className="flex items-center gap-2.5">
              <Leaf size={16} className="text-sage" /> 인공 향료·색소를 넣지 않은 담백한 원료
            </li>
          </ul>
        </div>
      </div>

      {/* 상세 설명 */}
      <section className="mt-16 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-ink">상세 설명</h2>
          <div className="mt-4 space-y-3 leading-relaxed text-muted">
            {product.description.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <h2 className="mt-10 font-display text-2xl font-extrabold text-ink">섭취 방법</h2>
          <p className="mt-3 leading-relaxed text-muted">{product.intake}</p>

          <h2 className="mt-10 font-display text-2xl font-extrabold text-ink">원산지</h2>
          <p className="mt-3 leading-relaxed text-muted">{product.origin}</p>

          {/* 일반 건강식품 고지 */}
          <div className="mt-8 flex gap-3 rounded-2xl border border-line bg-clay-tint/50 p-5">
            <Info size={18} className="mt-0.5 shrink-0 text-clay" />
            <div className="text-sm leading-relaxed text-ink/80">
              <p className="font-semibold text-ink">섭취 시 주의사항</p>
              <p className="mt-1">{product.caution}</p>
              <p className="mt-2 text-muted">
                본 제품은 일반 식품이며, 질병의 예방·치료를 위한 의약품이 아닙니다.
              </p>
            </div>
          </div>
        </div>

        {/* 성분·함량 */}
        <div>
          <h2 className="font-display text-2xl font-extrabold text-ink">성분 · 함량</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sand/60 text-left text-muted">
                  <th className="px-4 py-3 font-medium">원료</th>
                  <th className="px-4 py-3 text-right font-medium">함량</th>
                </tr>
              </thead>
              <tbody>
                {product.ingredients.map((ing) => (
                  <tr key={ing.name} className="border-t border-line">
                    <td className="px-4 py-3 text-ink">{ing.name}</td>
                    <td className="px-4 py-3 text-right text-muted">{ing.amount}</td>
                  </tr>
                ))}
                <tr className="border-t border-line">
                  <td className="px-4 py-3 text-ink">제공량</td>
                  <td className="px-4 py-3 text-right text-muted">{product.servings}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 리뷰 */}
      <section className="mt-16">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-extrabold text-ink">
            후기 <span className="text-sage">{product.reviewCount}</span>
          </h2>
          <StarRating rating={product.rating} size={16} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <ul className="space-y-4">
            {reviews.length === 0 && (
              <li className="rounded-2xl border border-line bg-cream p-6 text-sm text-muted">
                아직 등록된 후기가 없어요. 첫 후기를 남겨주세요.
              </li>
            )}
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl border border-line bg-cream p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">{r.author}</span>
                  <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
                </div>
                <div className="mt-1.5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      strokeWidth={0}
                      className={i < r.rating ? "fill-clay text-clay" : "fill-line text-line"}
                    />
                  ))}
                </div>
                <p className="mt-2.5 leading-relaxed text-ink/85">{r.content}</p>
              </li>
            ))}
          </ul>
          <ReviewForm productId={product.id} />
        </div>
      </section>

      {/* 관련 상품 */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold text-ink">함께 보면 좋은</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group overflow-hidden rounded-2xl border border-line bg-cream transition-all hover:-translate-y-1 hover:border-sage-light"
              >
                <ProductArt
                  accent={p.accent}
                  category={p.category}
                  label={p.name}
                  className="aspect-square w-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-ink">{p.name}</h3>
                  <p className="mt-1 text-sm font-bold text-ink">
                    {won(p.salePrice ?? p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
