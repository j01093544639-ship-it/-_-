"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, RefreshCw, ArrowRight } from "lucide-react";
import { listOrders, type LocalOrder } from "@/lib/orders-store";
import { won, formatDate } from "@/lib/format";

const STATUS_LABEL: Record<LocalOrder["status"], { text: string; cls: string }> = {
  pending: { text: "결제 대기", cls: "bg-oat text-muted" },
  paid: { text: "결제 완료", cls: "bg-sage-tint text-sage-dark" },
  failed: { text: "결제 실패", cls: "bg-clay-tint text-clay" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<LocalOrder[] | null>(null);

  useEffect(() => {
    setOrders(listOrders());
  }, []);

  if (orders === null) {
    return <div className="mx-auto max-w-4xl px-5 py-24 text-center text-muted">불러오는 중…</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto grid max-w-4xl place-items-center px-5 py-28 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-sage-tint text-sage">
          <Package size={28} strokeWidth={1.6} />
        </span>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">
          주문 내역이 없어요
        </h1>
        <p className="mt-2 text-muted">첫 주문을 시작해보세요.</p>
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
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-4xl font-extrabold text-ink">주문 내역</h1>
      <p className="mt-3 text-sm text-muted">
        이 기기에 저장된 주문입니다. 회원 로그인 시 계정과 연동됩니다.
      </p>

      <ul className="mt-8 space-y-5">
        {orders.map((o) => {
          const status = STATUS_LABEL[o.status];
          return (
            <li key={o.orderNumber} className="rounded-2xl border border-line bg-cream p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
                <div>
                  <p className="text-xs text-muted">{formatDate(o.createdAt)}</p>
                  <p className="mt-0.5 font-semibold text-ink">{o.orderNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  {o.mode === "subscription" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sage-tint px-2.5 py-1 text-xs font-semibold text-sage-dark">
                      <RefreshCw size={11} /> 정기배송
                    </span>
                  )}
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.cls}`}>
                    {status.text}
                  </span>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {o.items.map((line) => (
                  <li
                    key={`${line.productId}:${line.orderType}`}
                    className="flex items-center justify-between"
                  >
                    <span className="text-ink">
                      {line.name} <span className="text-muted">× {line.qty}</span>
                    </span>
                    <span className="text-muted">{won(line.price * line.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="text-sm text-muted">
                  {o.receiverName} · {o.address}
                  {o.addressDetail ? ` ${o.addressDetail}` : ""}
                </span>
                <span className="font-bold text-ink">{won(o.total)}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
