"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, RefreshCw, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { won, shippingFee, FREE_SHIPPING_THRESHOLD } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem, ready } = useCart();
  const fee = shippingFee(subtotal);
  const total = subtotal + fee;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (ready && items.length === 0) {
    return (
      <div className="mx-auto grid max-w-6xl place-items-center px-5 py-28 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-sage-tint text-sage">
          <ShoppingBag size={28} strokeWidth={1.6} />
        </span>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">
          장바구니가 비어 있어요
        </h1>
        <p className="mt-2 text-muted">마음에 드는 제품을 담아보세요.</p>
        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-sage px-6 py-3.5 text-[15px] font-semibold text-cream hover:bg-sage-dark"
        >
          쇼핑하러 가기 <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl font-extrabold text-ink">장바구니</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* 아이템 목록 */}
        <ul className="space-y-4">
          {items.map((line) => (
            <li
              key={`${line.productId}:${line.orderType}`}
              className="flex gap-4 rounded-2xl border border-line bg-cream p-4"
            >
              <Link
                href={`/products/${line.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-sand"
              >
                <ProductImage src={line.image} alt={line.name} sizes="96px" />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/products/${line.slug}`}
                      className="text-[15px] font-semibold text-ink hover:text-sage"
                    >
                      {line.name}
                    </Link>
                    {line.orderType === "subscription" && (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-sage-dark">
                        <RefreshCw size={11} /> 정기배송 {line.intervalDays}일 주기
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.productId, line.orderType)}
                    className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-clay-tint hover:text-clay"
                    aria-label="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between pt-3">
                  <div className="flex items-center gap-2.5 rounded-full border border-line px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQty(line.productId, line.orderType, line.qty - 1)}
                      className="grid h-6 w-6 place-items-center rounded-full hover:bg-sage-tint disabled:opacity-40"
                      disabled={line.qty <= 1}
                      aria-label="수량 감소"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(line.productId, line.orderType, line.qty + 1)}
                      className="grid h-6 w-6 place-items-center rounded-full hover:bg-sage-tint"
                      aria-label="수량 증가"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-[15px] font-bold text-ink">
                    {won(line.price * line.qty)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* 요약 */}
        <aside className="h-fit rounded-2xl border border-line bg-sand/50 p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-ink">주문 요약</h2>
          {remaining > 0 && (
            <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-xs text-sage-dark">
              {won(remaining)} 더 담으면 무료배송이에요.
            </p>
          )}
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">상품 금액</dt>
              <dd className="font-medium text-ink">{won(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">배송비</dt>
              <dd className="font-medium text-ink">{fee === 0 ? "무료" : won(fee)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="font-semibold text-ink">결제 예정 금액</span>
            <span className="text-xl font-bold text-ink">{won(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-sage px-6 py-3.5 text-[15px] font-semibold text-cream hover:bg-sage-dark"
          >
            주문하기 <ArrowRight size={17} />
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm text-muted hover:text-sage"
          >
            계속 쇼핑하기
          </Link>
        </aside>
      </div>
    </div>
  );
}
