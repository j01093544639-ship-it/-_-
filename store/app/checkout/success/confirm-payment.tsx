"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, RefreshCw, Loader2, XCircle, Package } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { getOrder, setOrderStatus, type LocalOrder } from "@/lib/orders-store";
import { won, formatDate } from "@/lib/format";
import type { OrderType } from "@/lib/types";

type Status = "loading" | "success" | "fail";

export function ConfirmPayment({
  mode,
  orderId,
  amount,
  paymentKey,
  authKey,
  customerKey,
}: {
  mode: OrderType;
  orderId: string;
  amount: number;
  paymentKey?: string;
  authKey?: string;
  customerKey?: string;
}) {
  const { clear } = useCart();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<LocalOrder | undefined>();
  const [nextChargeAt, setNextChargeAt] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // Strict Mode 이중 실행 방지
    ran.current = true;
    const ord = getOrder(orderId);
    setOrder(ord);

    async function confirm() {
      try {
        const endpoint =
          mode === "subscription"
            ? "/api/subscriptions/confirm"
            : "/api/payments/confirm";
        const subLines = (ord?.items ?? [])
          .filter((i) => i.orderType === "subscription")
          .map((i) => ({
            productId: i.productId,
            qty: i.qty,
            unitPrice: i.price,
            intervalDays: i.intervalDays ?? 30,
          }));
        const body =
          mode === "subscription"
            ? { authKey, customerKey, orderId, amount, subscriptions: subLines }
            : { paymentKey, orderId, amount };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message ?? data.error ?? "결제 승인에 실패했어요.");
          setStatus("fail");
          setOrderStatus(orderId, "failed");
          return;
        }
        if (data.nextChargeAt) setNextChargeAt(data.nextChargeAt);
        setOrderStatus(orderId, "paid");
        setStatus("success");
        clear();
      } catch {
        setError("네트워크 오류가 발생했어요.");
        setStatus("fail");
      }
    }
    confirm();
  }, [mode, orderId, amount, paymentKey, authKey, customerKey, clear]);

  if (status === "loading") {
    return (
      <div className="mx-auto grid max-w-lg place-items-center px-5 py-28 text-center">
        <Loader2 size={40} className="animate-spin text-sage" />
        <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">
          결제를 승인하고 있어요
        </h1>
        <p className="mt-2 text-muted">잠시만 기다려주세요…</p>
      </div>
    );
  }

  if (status === "fail") {
    return (
      <div className="mx-auto grid max-w-lg place-items-center px-5 py-24 text-center">
        <XCircle size={44} className="text-clay" />
        <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">
          결제 승인에 실패했어요
        </h1>
        <p className="mt-2 text-muted">{error}</p>
        <Link
          href="/cart"
          className="mt-7 rounded-full bg-sage px-6 py-3.5 text-[15px] font-semibold text-cream hover:bg-sage-dark"
        >
          장바구니로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <div className="grid place-items-center text-center">
        <CheckCircle2 size={52} className="text-sage" />
        <h1 className="mt-5 font-display text-3xl font-extrabold text-ink">
          주문이 완료되었어요
        </h1>
        <p className="mt-2 text-muted">참신한하루를 선택해주셔서 감사합니다.</p>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-cream p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">주문번호</span>
          <span className="font-semibold text-ink">{orderId}</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-sm">
          <span className="text-muted">결제금액</span>
          <span className="font-semibold text-ink">{won(amount)}</span>
        </div>

        {mode === "subscription" && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-sage-tint px-4 py-3 text-sm text-sage-dark">
            <RefreshCw size={15} className="mt-0.5" />
            <span>
              정기배송이 시작되었어요.
              {nextChargeAt && (
                <>
                  {" "}
                  다음 결제 예정일은 <b>{formatDate(nextChargeAt)}</b> 입니다.
                </>
              )}{" "}
              마이페이지에서 언제든 주기 변경·해지할 수 있어요.
            </span>
          </div>
        )}

        {order && (
          <ul className="mt-5 divide-y divide-line border-t border-line pt-4 text-sm">
            {order.items.map((line) => (
              <li key={`${line.productId}:${line.orderType}`} className="flex justify-between py-2">
                <span className="text-ink">
                  {line.name} <span className="text-muted">× {line.qty}</span>
                </span>
                <span className="text-muted">{won(line.price * line.qty)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/orders"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-sage px-6 py-3.5 text-[15px] font-semibold text-sage-dark hover:bg-sage-tint"
        >
          <Package size={17} /> 주문 내역 보기
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full bg-sage px-6 py-3.5 text-[15px] font-semibold text-cream hover:bg-sage-dark"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
