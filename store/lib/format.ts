export function won(value: number): string {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function discountRate(list: number, sale: number): number {
  if (!list || sale >= list) return 0;
  return Math.round(((list - sale) / list) * 100);
}

/** 정기배송 단가(단건가 기준 할인율 적용) */
export function subscriptionPrice(base: number, discountPercent: number): number {
  return Math.round((base * (100 - discountPercent)) / 100 / 10) * 10;
}

export function orderNumber(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(16).slice(2, 10);
  return `ORD-${Date.now()}-${rand}`;
}

export const FREE_SHIPPING_THRESHOLD = 30000;
export const BASE_SHIPPING_FEE = 3000;

/** 3만원 이상 무료배송, 그 외 3,000원. 빈 장바구니는 0원. */
export function shippingFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_FEE;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}
