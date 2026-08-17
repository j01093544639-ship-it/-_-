import {
  Leaf,
  ShieldCheck,
  FlaskConical,
  Eye,
  Sparkles,
  Clock,
  MapPin,
  Info,
  Check,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";

const TRUST = [
  { icon: ShieldCheck, title: "HACCP 안전관리인증", desc: "인증 시설에서 제조·품질관리" },
  { icon: FlaskConical, title: "주원료 고함량", desc: "핵심 원료를 넉넉하게 설계" },
  { icon: Eye, title: "원료 함량 투명공개", desc: "종류와 함량(mg)을 그대로" },
];

/**
 * 상품 상세(상세페이지) — 상품 데이터로 구성하는 긴 세로 비주얼 스토리.
 * 실제 상세 이미지가 준비되면 이 섹션을 이미지 기반으로 교체할 수 있다.
 */
export function ProductStory({ product }: { product: Product }) {
  return (
    <section className="mt-16">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold tracking-wider text-sage">DETAIL</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">상품 상세</h2>

      {/* 인트로 밴드 */}
      <div className="mt-8 grid items-center gap-8 overflow-hidden rounded-3xl border border-line bg-sand/50 p-6 md:grid-cols-2 md:p-10">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-cream">
          <ProductImage
            src={product.image}
            alt={product.name}
            sizes="(max-width: 768px) 100vw, 480px"
          />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-sage-dark">
            <Leaf size={13} strokeWidth={2.2} /> {product.category}
          </span>
          <p className="mt-4 text-sm text-muted">{product.engName}</p>
          <p className="mt-2 font-display text-2xl font-extrabold leading-snug text-ink sm:text-3xl">
            {product.summary}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cream px-4 py-2.5 text-sm text-ink">
            <Sparkles size={15} className="text-clay" />
            {product.servings}
          </div>
        </div>
      </div>

      {/* 핵심 특징 — 넘버링 에디토리얼 */}
      <div className="mt-14">
        <p className="text-sm font-semibold text-clay">WHY 참신한하루</p>
        <h3 className="mt-1 font-display text-2xl font-extrabold text-ink">이 제품의 핵심</h3>
        <div className="mt-7 space-y-4">
          {product.features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-5 rounded-2xl border border-line bg-cream p-6"
            >
              <span className="font-display text-3xl font-extrabold leading-none text-sage-light">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="pt-1 text-[17px] font-medium leading-relaxed text-ink">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 원료 하이라이트 */}
      <div className="mt-14 rounded-3xl bg-sage-tint/50 p-6 md:p-10">
        <h3 className="font-display text-2xl font-extrabold text-ink">원료 &amp; 함량</h3>
        <p className="mt-2 text-sm text-muted">
          눈속임 없이, 주원료의 종류와 함량(mg)을 있는 그대로 공개합니다.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {product.ingredients.map((ing, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 rounded-2xl border border-line bg-cream px-4 py-4 text-sm leading-relaxed text-ink"
            >
              <Check size={16} className="mt-0.5 shrink-0 text-sage" />
              <span>{ing}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-medium text-ink">
          총 내용량 · {product.servings}
        </p>
      </div>

      {/* 이런 분께 추천 */}
      <div className="mt-14">
        <h3 className="font-display text-2xl font-extrabold text-ink">이런 분께 추천해요</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {product.recommend.map((r, i) => (
            <div
              key={r}
              className="rounded-2xl border border-line bg-cream p-6 text-center"
            >
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-sage-tint font-display text-lg font-extrabold text-sage-dark">
                {i + 1}
              </span>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-ink">{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 섭취 방법 · 원산지 */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-cream p-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-sage-dark">
            <Clock size={16} /> 섭취 방법
          </span>
          <p className="mt-3 leading-relaxed text-muted">{product.intake}</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream p-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-sage-dark">
            <MapPin size={16} /> 원산지
          </span>
          <p className="mt-3 leading-relaxed text-muted">{product.origin}</p>
        </div>
      </div>

      {/* 신뢰 배지 */}
      <div className="mt-6 grid gap-4 rounded-3xl border border-line bg-sand/50 p-6 sm:grid-cols-3 sm:p-8">
        {TRUST.map((t) => (
          <div key={t.title} className="flex gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-sage">
              <t.icon size={20} strokeWidth={1.8} />
            </span>
            <div>
              <h4 className="text-[15px] font-semibold text-ink">{t.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 고지 */}
      <div className="mt-6 flex gap-3 rounded-2xl border border-line bg-clay-tint/50 p-5">
        <Info size={18} className="mt-0.5 shrink-0 text-clay" />
        <div className="text-sm leading-relaxed text-ink/80">
          <p className="font-semibold text-ink">섭취 시 주의사항</p>
          <p className="mt-1">{product.caution}</p>
          <p className="mt-2 text-muted">
            본 제품은 일반 건강식품이며, 특정 질병의 예방·치료 효과나 의약품의 대체 효능을
            표방하지 않습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
