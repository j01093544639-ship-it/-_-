import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = { title: "결제 실패" };

export default async function FailPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; message?: string }>;
}) {
  const { code, message } = await searchParams;
  return (
    <div className="mx-auto grid max-w-lg place-items-center px-5 py-24 text-center">
      <XCircle size={44} className="text-clay" />
      <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">
        결제가 완료되지 못했어요
      </h1>
      <p className="mt-3 text-muted">{message ?? "다시 시도해주세요."}</p>
      {code && <p className="mt-1 text-xs text-muted/70">에러 코드: {code}</p>}
      <div className="mt-8 flex gap-3">
        <Link
          href="/cart"
          className="rounded-full border border-sage px-6 py-3.5 text-[15px] font-semibold text-sage-dark hover:bg-sage-tint"
        >
          장바구니로
        </Link>
        <Link
          href="/products"
          className="rounded-full bg-sage px-6 py-3.5 text-[15px] font-semibold text-cream hover:bg-sage-dark"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
