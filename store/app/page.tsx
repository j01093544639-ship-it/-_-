import Link from "next/link";
import { ShieldCheck, FlaskConical, Eye, ArrowRight, Quote, Star } from "lucide-react";
import {
  getBestSellers,
  getNewArrivals,
  getCategories,
  getProductBySlug,
  getSignatureProduct,
  getFeaturedReviews,
} from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { StarRating } from "@/components/ui";
import { won } from "@/lib/format";
import { LOWEST_PER_BOTTLE } from "@/lib/pricing";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "안전관리인증 제조",
    desc: "HACCP 인증 시설에서 원료 입고부터 완제품까지 꼼꼼하게 관리합니다.",
  },
  {
    icon: FlaskConical,
    title: "주원료 고함량 설계",
    desc: "핵심 원료를 넉넉하게 담아 매일 챙기기 좋게 설계했습니다.",
  },
  {
    icon: Eye,
    title: "원료 함량 투명 공개",
    desc: "주원료의 종류와 함량(mg)을 있는 그대로 공개합니다.",
  },
];

const HERO_SLUGS = [
  "eggshell-gujeolcho",
  "green-acerola-vitamin-c",
  "alpha-cd-one-days",
  "paradise-grain-burning",
];

export default function HomePage() {
  const best = getBestSellers();
  const fresh = getNewArrivals();
  const categories = getCategories();
  const signature = getSignatureProduct();
  const reviews = getFeaturedReviews().slice(0, 3);
  const heroProducts = HERO_SLUGS.map((s) => getProductBySlug(s)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <>
      {/* Hero */}
      <section className="paper">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="reveal reveal-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-medium text-sage-dark">
              정직한 원료 · 국내 제조 · HACCP
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.2] text-ink sm:text-5xl">
              <span className="kr-block">정직한 원료로</span>{" "}
              <span className="kr-block">채우는 건강한 하루</span>
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
              눈속임 없이 원료의 종류와 함량을 공개하는 건강식품 브랜드 참신한하루. 필요에
              맞는 제품을 골라 정기배송으로 편하게 받아보세요.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-sage px-6 py-3.5 text-[15px] font-semibold text-cream transition-colors hover:bg-sage-dark"
              >
                전체 상품 보기
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/products?sort=subscription"
                className="inline-flex items-center gap-2 rounded-full border border-sage/40 px-6 py-3.5 text-[15px] font-semibold text-sage-dark transition-colors hover:bg-sage-tint"
              >
                정기배송 살펴보기
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <StarRating rating={4.8} />
              <span className="hidden h-4 w-px bg-line sm:block" />
              <span>누적 후기 1,200+</span>
              <span className="hidden h-4 w-px bg-line sm:block" />
              <span>3만원 이상 무료배송</span>
            </div>
          </div>

          <div className="reveal reveal-2 grid grid-cols-2 gap-4">
            {heroProducts.map((p, i) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className={`overflow-hidden rounded-3xl border border-line bg-cream shadow-[0_24px_60px_-40px_rgba(69,78,59,0.6)] ${
                  i % 2 === 1 ? "mt-6" : ""
                }`}
              >
                <div className="relative aspect-[4/5] bg-sand">
                  <ProductImage
                    src={p.image}
                    alt={p.name}
                    priority={i < 2}
                    sizes="(max-width: 768px) 45vw, 260px"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="grid gap-4 rounded-3xl border border-line bg-sand/50 p-6 sm:grid-cols-3 sm:p-8">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-sage">
                <b.icon size={20} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-ink">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Signature */}
      <section className="mx-auto mt-20 max-w-6xl px-5">
        <div className="grid items-center gap-8 rounded-3xl border border-line bg-sage-tint/50 p-6 md:grid-cols-2 md:p-10">
          <Link
            href={`/products/${signature.slug}`}
            className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-sand"
          >
            <ProductImage
              src={signature.image}
              alt={signature.name}
              sizes="(max-width: 768px) 100vw, 460px"
            />
            <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1 text-xs font-bold tracking-wider text-cream">
              SIGNATURE
            </span>
          </Link>
          <div>
            <p className="text-sm font-semibold text-sage-dark">대표 제품 · SIGNATURE</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold leading-snug text-ink">
              {signature.name}
            </h2>
            <p className="mt-1 text-sm text-muted">{signature.engName}</p>
            <p className="mt-4 leading-relaxed text-muted">{signature.summary}</p>
            <ul className="mt-5 space-y-1.5 text-sm text-ink/85">
              {signature.features.slice(0, 3).map((f, i) => (
                <li key={i}>· {f}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div>
                <p className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-ink">{won(signature.price)}</span>
                  <span className="text-sm text-muted">/ 1통</span>
                </p>
                <p className="text-xs text-sage-dark">묶음 통당 최저 {won(LOWEST_PER_BOTTLE)}</p>
              </div>
              <Link
                href={`/products/${signature.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-sage px-5 py-3 text-sm font-semibold text-cream hover:bg-sage-dark"
              >
                자세히 보기 <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-clay">가장 많이 담는</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-ink">베스트셀러</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-sage-dark hover:text-sage"
          >
            더보기 <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {best.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <h2 className="font-display text-3xl font-extrabold text-ink">카테고리</h2>
        <p className="mt-2 text-muted">필요에 맞는 카테고리를 골라보세요.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className="rounded-full border border-line bg-cream px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-sage-light hover:bg-sage-tint"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      {fresh.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-20">
          <div>
            <p className="text-sm font-semibold text-clay">방금 들어온</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-ink">신상품</h2>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {fresh.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-3xl font-extrabold text-ink">먼저 경험한 이야기</h2>
          <StarRating rating={4.8} />
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.id} className="rounded-2xl border border-line bg-cream p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    strokeWidth={0}
                    className={i < r.rating ? "fill-clay text-clay" : "fill-line text-line"}
                  />
                ))}
              </div>
              <Quote size={20} className="mt-3 text-sage-light" />
              <blockquote className="mt-2 leading-relaxed text-ink">{r.content}</blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                <span className="font-semibold text-ink">{r.author}</span> · {r.product}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-6xl px-5">
        <div className="overflow-hidden rounded-3xl bg-sage px-8 py-16 text-center text-cream md:py-20">
          <h2 className="font-display text-3xl font-extrabold leading-snug sm:text-4xl">
            <span className="kr-block">오늘부터,</span>{" "}
            <span className="kr-block">참신한 하루를 챙겨요</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-cream/80">
            정기배송으로 최대 15% 할인. 언제든 주기 변경·해지할 수 있어요.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-[15px] font-bold text-sage-dark transition-transform hover:scale-[1.02]"
          >
            지금 시작하기 <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
