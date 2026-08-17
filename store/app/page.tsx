import Link from "next/link";
import { Leaf, FlaskConical, RefreshCw, ArrowRight, Quote } from "lucide-react";
import { getBestSellers, getNewArrivals, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductArt } from "@/components/ProductArt";
import { StarRating } from "@/components/ui";

const BENEFITS = [
  {
    icon: Leaf,
    title: "담백한 원료",
    desc: "불필요한 향료·색소를 덜어내고 꼭 필요한 원료만 담았어요.",
  },
  {
    icon: FlaskConical,
    title: "국내 제조·검사",
    desc: "믿을 수 있는 시설에서 제조하고 원료를 확인합니다.",
  },
  {
    icon: RefreshCw,
    title: "정기배송 할인",
    desc: "매번 주문할 필요 없이, 필요한 주기에 맞춰 더 저렴하게.",
  },
];

const STORY_REVIEWS = [
  { name: "이◦은", product: "데일리 락토 19종", text: "아침마다 한 포씩. 속이 편안해요." },
  { name: "박◦진", product: "클리어 오메가3", text: "비린내가 안 나서 계속 먹게 돼요." },
  { name: "정◦라", product: "발효 홍삼 진", text: "부모님 선물로 딱. 부드럽고 맛있대요." },
];

export default function HomePage() {
  const best = getBestSellers();
  const fresh = getNewArrivals();
  const categories = getCategories();

  return (
    <>
      {/* Hero */}
      <section className="paper">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="reveal reveal-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-medium text-sage-dark">
              <Leaf size={13} strokeWidth={2.2} /> 매일의 컨디션 루틴
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.2] text-ink sm:text-5xl">
              <span className="kr-block">몸이 반기는</span>{" "}
              <span className="kr-block">담백한 건강 습관</span>
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
              유산균부터 오메가3, 발효홍삼까지. 온담이 고른 원료를 필요한 주기에 맞춰
              정기배송으로 편하게 받아보세요.
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
            <div className="mt-8 flex items-center gap-5 text-sm text-muted">
              <StarRating rating={4.8} />
              <span className="h-4 w-px bg-line" />
              <span>누적 리뷰 1,000+</span>
              <span className="h-4 w-px bg-line" />
              <span>3만원 이상 무료배송</span>
            </div>
          </div>

          <div className="reveal reveal-2 relative">
            <div className="grid grid-cols-2 gap-4">
              {best.slice(0, 2).map((p, i) => (
                <div
                  key={p.id}
                  className={`overflow-hidden rounded-3xl border border-line bg-cream shadow-[0_24px_60px_-40px_rgba(69,78,59,0.6)] ${
                    i === 1 ? "mt-8" : ""
                  }`}
                >
                  <ProductArt
                    accent={p.accent}
                    category={p.category}
                    label={p.name}
                    className="aspect-[3/4] w-full"
                  />
                  <p className="px-4 py-3 text-sm font-semibold text-ink">{p.name}</p>
                </div>
              ))}
            </div>
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

      {/* Brand story */}
      <section id="story" className="mx-auto mt-24 max-w-6xl px-5">
        <div className="grid items-center gap-10 rounded-3xl border border-line bg-sage-tint/60 p-8 md:grid-cols-2 md:p-12">
          <div className="order-2 md:order-1">
            <span className="text-sm font-semibold text-sage-dark">BRAND STORY</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-snug text-ink">
              <span className="kr-block">더하기보다</span>{" "}
              <span className="kr-block">덜어내는 방식</span>
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              온담은 화려한 성분표 대신, 매일 꾸준히 챙길 수 있는 담백함을 택했어요.
              불필요한 첨가물을 덜어내고, 원료의 출처와 함량을 투명하게 안내합니다.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              건강은 하루아침에 만들어지지 않으니까요. 오래 지킬 수 있는 습관이 되도록,
              먹기 편한 형태와 합리적인 정기배송으로 곁을 지킵니다.
            </p>
            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-sage px-5 py-3 text-sm font-semibold text-cream hover:bg-sage-dark"
            >
              온담 제품 둘러보기 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="order-1 grid grid-cols-2 gap-4 md:order-2">
            {best.slice(0, 1).concat(fresh.slice(0, 3)).map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-line bg-cream"
              >
                <ProductArt
                  accent={p.accent}
                  category={p.category}
                  label={p.name}
                  className="aspect-square w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-clay">방금 들어온</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-ink">신상품</h2>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {fresh.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <h2 className="font-display text-3xl font-extrabold text-ink">카테고리</h2>
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

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <h2 className="font-display text-3xl font-extrabold text-ink">먼저 경험한 이야기</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {STORY_REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-line bg-cream p-6">
              <Quote size={22} className="text-sage-light" />
              <blockquote className="mt-3 leading-relaxed text-ink">{r.text}</blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                <span className="font-semibold text-ink">{r.name}</span> · {r.product}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <div className="overflow-hidden rounded-3xl bg-sage px-8 py-16 text-center text-cream md:py-20">
          <h2 className="font-display text-3xl font-extrabold leading-snug sm:text-4xl">
            <span className="kr-block">오늘부터,</span>{" "}
            <span className="kr-block">담백하게 챙겨요</span>
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
