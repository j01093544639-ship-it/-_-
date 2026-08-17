import { ConfirmPayment } from "./confirm-payment";

export const metadata = { title: "주문 완료" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string;
    paymentKey?: string;
    orderId?: string;
    amount?: string;
    authKey?: string;
    customerKey?: string;
  }>;
}) {
  const sp = await searchParams;
  const mode = sp.mode === "subscription" ? "subscription" : "single";

  const orderId = sp.orderId;
  const amount = sp.amount;

  if (!orderId || !amount) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-extrabold text-ink">잘못된 접근이에요</h1>
        <p className="mt-3 text-muted">결제 정보가 누락되었습니다.</p>
      </div>
    );
  }

  return (
    <ConfirmPayment
      mode={mode}
      orderId={orderId}
      amount={Number(amount)}
      paymentKey={sp.paymentKey}
      authKey={sp.authKey}
      customerKey={sp.customerKey}
    />
  );
}
