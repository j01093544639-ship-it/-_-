"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, RefreshCw, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import { won } from "@/lib/format";
import {
  BUNDLE_TIERS,
  SINGLE_BOTTLE_PRICE,
  subBundlePrice,
  perBottle,
  bundleSaving,
} from "@/lib/pricing";
import type { OrderType } from "@/lib/types";

interface Props {
  id: string;
  slug: string;
  name: string;
  image: string;
  stock: number;
  intervalDays: number;
  discountPercent: number;
  subscriptionEnabled: boolean;
}

export function PurchaseOptions(props: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [orderType, setOrderType] = useState<OrderType>("single");
  const [bottles, setBottles] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = props.stock <= 0;

  const priceFor = (base: number) =>
    orderType === "subscription" ? subBundlePrice(base, props.discountPercent) : base;

  const selectedTier = BUNDLE_TIERS.find((t) => t.bottles === bottles) ?? BUNDLE_TIERS[0];
  const unit = priceFor(selectedTier.price);

  const buildLine = () => ({
    productId: props.id,
    slug: props.slug,
    name: props.name,
    price: unit,
    listPrice: bottles * SINGLE_BOTTLE_PRICE,
    qty: 1,
    bottles,
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

  return (
    <div>
      {/* 구매 방식 */}
      {props.subscriptionEnabled && (
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-sand/50 p-1">
          <button
            type="button"
            onClick={() => setOrderType("single")}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              orderType === "single" ? "bg-cream text-ink shadow-sm" : "text-muted"
            }`}
          >
            한 번만 구매
          </button>
          <button
            type="button"
            onClick={() => setOrderType("subscription")}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              orderType === "subscription" ? "bg-cream text-sage-dark shadow-sm" : "text-muted"
            }`}
          >
            <RefreshCw size={13} /> 정기배송 {props.discountPercent}%↓
          </button>
        </div>
      )}

      {/* 구성(통) 선택 */}
      <p className="mt-5 mb-2 text-sm font-medium text-muted">구성 선택</p>
      <div className="grid grid-cols-2 gap-3">
        {BUNDLE_TIERS.map((tier) => {
          const price = priceFor(tier.price);
          const active = bottles === tier.bottles;
          const saving = bundleSaving(tier.bottles, tier.price);
          return (
            <button
              key={tier.bottles}
              type="button"
              onClick={() => setBottles(tier.bottles)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                active ? "border-sage bg-sage-tint" : "border-line bg-cream hover:border-sage-light"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="text-sm font-bold text-ink">{tier.label}</span>
                {active && <Check size={16} className="text-sage" />}
              </span>
              <span className="mt-1 block text-lg font-bold text-ink">{won(price)}</span>
              <span className="mt-0.5 block text-xs text-muted">
                통당 {won(perBottle(price, tier.bottles))}
              </span>
              {saving > 0 && (
                <span className="mt-1.5 inline-block rounded-full bg-clay-tint px-2 py-0.5 text-[11px] font-semibold text-clay">
                  {won(saving)} 절약
                </span>
              )}
            </button>
          );
        })}
      </div>

      {orderType === "subscription" && (
        <p className="mt-3 rounded-lg bg-sage-tint px-3 py-2 text-xs text-sage-dark">
          <RefreshCw size={11} className="mr-1 inline" />
          {props.intervalDays}일마다 배송 · 정기배송가 적용 · 언제든 변경·해지
        </p>
      )}

      {/* 합계 */}
      <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
        <span className="text-sm text-muted">
          {selectedTier.label}
          {orderType === "subscription" ? " · 정기배송가" : ""}
        </span>
        <span className="text-2xl font-bold text-ink">{won(unit)}</span>
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
