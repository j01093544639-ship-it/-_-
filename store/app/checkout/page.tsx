"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { RefreshCw, Lock } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { won, shippingFee, orderNumber } from "@/lib/format";
import { savePendingOrder } from "@/lib/orders-store";

interface Form {
  receiverName: string;
  phone: string;
  postcode: string;
  address: string;
  addressDetail: string;
  memo: string;
}

const EMPTY: Form = {
  receiverName: "",
  phone: "",
  postcode: "",
  address: "",
  addressDetail: "",
  memo: "",
};

export default function CheckoutPage() {
  const { items, subtotal, ready } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fee = shippingFee(subtotal);
  const total = subtotal + fee;
  const hasSubscription = useMemo(
    () => items.some((i) => i.orderType === "subscription"),
    [items],
  );
  const mode = hasSubscription ? "subscription" : "single";
  const subInterval = items.find((i) => i.orderType === "subscription")?.intervalDays;

  useEffect(() => {
    if (ready && items.length === 0) router.replace("/cart");
  }, [ready, items.length, router]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const orderName =
    items.length === 0
      ? ""
      : items.length === 1
        ? items[0].name
        : `${items[0].name} 외 ${items.length - 1}건`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.receiverName.trim()) return setError("받는 분 이름을 입력해주세요.");
    if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(form.phone.replace(/\s/g, "")))
      return setError("올바른 휴대폰 번호를 입력해주세요.");
    if (!form.address.trim()) return setError("배송지 주소를 입력해주세요.");

    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey) return setError("결제 설정이 필요합니다. (NEXT_PUBLIC_TOSS_CLIENT_KEY)");

    setLoading(true);
    const orderId = orderNumber();

    savePendingOrder({
      orderNumber: orderId,
      createdAt: new Date().toISOString(),
      mode,
      items,
      ...form,
      subtotal,
      shippingFee: fee,
      total,
      status: "pending",
      intervalDays: subInterval,
    });

    try {
      const toss = await loadTossPayments(clientKey);
      const origin = window.location.origin;

      if (mode === "subscription") {
        // 정기배송: 자동결제(빌링) 카드 등록 → 성공 페이지에서 빌링키 발급 + 첫 결제
        const customerKey = `CUST-${orderId}`;
        await toss.requestBillingAuth("카드", {
          customerKey,
          successUrl: `${origin}/checkout/success?mode=subscription&orderId=${orderId}&amount=${total}`,
          failUrl: `${origin}/checkout/fail`,
        });
      } else {
        // 단건 결제
        await toss.requestPayment("카드", {
          amount: total,
          orderId,
          orderName,
          customerName: form.receiverName,
          successUrl: `${origin}/checkout/success?mode=single`,
          failUrl: `${origin}/checkout/fail`,
        });
      }
    } catch (err) {
      // 사용자가 결제창을 닫으면 여기로 온다
      setLoading(false);
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "결제가 취소되었어요.";
      setError(message);
    }
    // 성공 시 successUrl로 리다이렉트되며, 장바구니 비우기는 성공 페이지에서 처리한다.
  };

  if (!ready || items.length === 0) {
    return <div className="mx-auto max-w-6xl px-5 py-28 text-center text-muted">불러오는 중…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl font-extrabold text-ink">주문/결제</h1>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* 배송지 */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-cream p-6">
            <h2 className="text-lg font-bold text-ink">배송지 정보</h2>
            <div className="mt-5 grid gap-4">
              <Field label="받는 분" required>
                <input
                  value={form.receiverName}
                  onChange={set("receiverName")}
                  className="input"
                  placeholder="이름"
                  autoComplete="name"
                />
              </Field>
              <Field label="휴대폰 번호" required>
                <input
                  value={form.phone}
                  onChange={set("phone")}
                  className="input"
                  placeholder="010-0000-0000"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <Field label="우편번호">
                  <input
                    value={form.postcode}
                    onChange={set("postcode")}
                    className="input"
                    placeholder="00000"
                    inputMode="numeric"
                  />
                </Field>
                <div className="flex items-end">
                  <span className="rounded-xl border border-line px-4 py-3 text-sm text-muted">
                    주소 검색은 운영 시 연동
                  </span>
                </div>
              </div>
              <Field label="주소" required>
                <input
                  value={form.address}
                  onChange={set("address")}
                  className="input"
                  placeholder="도로명 주소"
                  autoComplete="street-address"
                />
              </Field>
              <Field label="상세 주소">
                <input
                  value={form.addressDetail}
                  onChange={set("addressDetail")}
                  className="input"
                  placeholder="동/호수 등"
                />
              </Field>
              <Field label="배송 메모">
                <input
                  value={form.memo}
                  onChange={set("memo")}
                  className="input"
                  placeholder="예: 문 앞에 놓아주세요"
                />
              </Field>
            </div>
          </section>

          {/* 주문 상품 */}
          <section className="rounded-2xl border border-line bg-cream p-6">
            <h2 className="text-lg font-bold text-ink">주문 상품</h2>
            <ul className="mt-4 divide-y divide-line">
              {items.map((line) => (
                <li
                  key={`${line.productId}:${line.orderType}`}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="text-ink">
                    {line.name}
                    {line.orderType === "subscription" && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-sage-dark">
                        <RefreshCw size={11} /> 정기 {line.intervalDays}일
                      </span>
                    )}
                    <span className="ml-1 text-muted">× {line.qty}</span>
                  </span>
                  <span className="font-medium text-ink">{won(line.price * line.qty)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 결제 요약 */}
        <aside className="h-fit rounded-2xl border border-line bg-sand/50 p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-ink">결제 정보</h2>
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
            <span className="font-semibold text-ink">최종 결제 금액</span>
            <span className="text-xl font-bold text-ink">{won(total)}</span>
          </div>

          {hasSubscription && (
            <p className="mt-4 rounded-lg bg-sage-tint px-3 py-2.5 text-xs leading-relaxed text-sage-dark">
              <RefreshCw size={11} className="mb-0.5 mr-1 inline" />
              정기배송 상품이 포함되어 자동결제 카드로 등록됩니다. 다음 결제일부터{" "}
              {subInterval}일 주기로 결제되며 언제든 해지할 수 있어요.
            </p>
          )}

          {error && <p className="mt-4 text-sm text-clay">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-sage px-6 py-3.5 text-[15px] font-semibold text-cream hover:bg-sage-dark disabled:opacity-60"
          >
            <Lock size={16} />
            {loading ? "결제창 여는 중…" : `${won(total)} 결제하기`}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            결제 진행 시{" "}
            <Link href="/policy/terms" className="underline hover:text-sage">
              이용약관
            </Link>{" "}
            및{" "}
            <Link href="/policy/refund" className="underline hover:text-sage">
              환불정책
            </Link>
            에 동의하게 됩니다.
          </p>
          <p className="mt-2 text-center text-[11px] text-muted/80">
            토스페이먼츠 테스트 결제 · 실제 청구되지 않습니다
          </p>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-clay">*</span>}
      </span>
      {children}
    </label>
  );
}
