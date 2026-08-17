"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, RefreshCw, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import { won, subscriptionPrice } from "@/lib/format";
import type { OrderType } from "@/lib/types";

interface Props {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  stock: number;
  intervalDays: number;
  discountPercent: number;
  subscriptionEnabled: boolean;
}

export function PurchaseOptions(props: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const base = props.salePrice ?? props.price;
  const [orderType, setOrderType] = useState<OrderType>("single");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const subPrice = useMemo(
    () => subscriptionPrice(base, props.discountPercent),
    [base, props.discountPercent],
  );
  const unit = orderType === "subscription" ? subPrice : base;
  const soldOut = props.stock <= 0;

  const buildLine = () => ({
    productId: props.id,
    slug: props.slug,
    name: props.name,
    price: unit,
    listPrice: props.price,
    qty,
    image: props.image,
    orderType,
    intervalDays: orderType === "subscription" ? props.intervalDays : undefined,
  });

  const onAdd = () => {
    addItem(buildLine());
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const onBuy = () => {
    addItem(buildLine());
    router.push("/checkout");
  };

  const optionClass = (active: boolean) =>
    `w-full rounded-xl border p-4 text-left transition-colors ${
      active ? "border-sage bg-sage-tint" : "border-line bg-cream hover:border-sage-light"
    }`;

  return (
    <div>
      {/* 구매 방식 */}
      {props.subscriptionEnabled ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => setOrderType("single")} className={optionClass(orderType === "single")}>
            <span className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">한 번만 구매</span>
              {orderType === "single" && <Check size={16} className="text-sage" />}
            </span>
            <span className="mt-1 block text-lg font-bold text-ink">{won(base)}</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType("subscription")}
            className={optionClass(orderType === "subscription")}
          >
            <span className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-sage-dark">
                <RefreshCw size={13} /> 정기배송
              </span>
              {orderType === "subscription" && <Check size={16} className="text-sage" />}
            </span>
            <span className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-ink">{won(subPrice)}</span>
              <span className="text-xs font-semibold text-clay">
                {props.discountPercent}% 할인
              </span>
            </span>
            <span className="mt-0.5 block text-xs text-muted">
              {props.intervalDays}일마다 배송 · 언제든 변경·해지
            </span>
          </button>
        </div>
      ) : (
        <p className="text-2xl font-bold text-ink">{won(base)}</p>
      )}

      {/* 수량 */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm font-medium text-muted">수량</span>
        <div className="flex items-center gap-3 rounded-full border border-line bg-cream px-2 py-1.5">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-7 w-7 place-items-center rounded-full text-ink hover:bg-sage-tint disabled:opacity-40"
            disabled={qty <= 1}
            aria-label="수량 감소"
          >
            <Minus size={15} />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(props.stock || 99, q + 1))}
            className="grid h-7 w-7 place-items-center rounded-full text-ink hover:bg-sage-tint"
            aria-label="수량 증가"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* 합계 */}
      <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
        <span className="text-sm text-muted">
          {orderType === "subscription" ? "정기배송 결제 금액" : "결제 금액"}
        </span>
        <span className="text-2xl font-bold text-ink">{won(unit * qty)}</span>
      </div>

      {/* CTA */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onAdd}
          disabled={soldOut}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-sage px-6 py-3.5 text-[15px] font-semibold text-sage-dark transition-colors hover:bg-sage-tint disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          {added ? "담았어요" : "장바구니"}
        </button>
        <button
          type="button"
          onClick={onBuy}
          disabled={soldOut}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sage px-6 py-3.5 text-[15px] font-semibold text-cream transition-colors hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {soldOut ? "품절" : "바로 구매"}
        </button>
      </div>
    </div>
  );
}
