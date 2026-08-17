/**
 * 묶음(통) 단위 정가. 모든 제품 공통 적용.
 * 1통 24,900 · 2통 37,300 · 3통 49,800 · 5통 74,700원
 */
export interface BundleTier {
  bottles: number;
  price: number;
  label: string;
}

export const SINGLE_BOTTLE_PRICE = 24900;

export const BUNDLE_TIERS: BundleTier[] = [
  { bottles: 1, price: 24900, label: "1통" },
  { bottles: 2, price: 37300, label: "2통" },
  { bottles: 3, price: 49800, label: "3통" },
  { bottles: 5, price: 74700, label: "5통" },
];

export function tierByBottles(bottles: number): BundleTier {
  return BUNDLE_TIERS.find((t) => t.bottles === bottles) ?? BUNDLE_TIERS[0];
}

/** 정기배송 할인율을 묶음가에 적용(10원 단위 반올림) */
export function subBundlePrice(price: number, discountPercent: number): number {
  return Math.round((price * (100 - discountPercent)) / 100 / 10) * 10;
}

/** 통당 가격 */
export function perBottle(price: number, bottles: number): number {
  return Math.round(price / bottles);
}

/** 1통씩 낱개로 살 때 대비 절약액 (묶음 할인폭) */
export function bundleSaving(bottles: number, price: number): number {
  return Math.max(0, bottles * SINGLE_BOTTLE_PRICE - price);
}

/** 전체 묶음 중 최저 통당가 (예: 5통 → 14,940원) */
export const LOWEST_PER_BOTTLE = Math.min(
  ...BUNDLE_TIERS.map((t) => Math.round(t.price / t.bottles)),
);
