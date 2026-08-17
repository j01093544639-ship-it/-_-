import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-lg place-items-center px-5 py-28 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-sage-tint text-sage">
        <Leaf size={24} strokeWidth={2} />
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold text-ink">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-2 text-muted">주소가 바뀌었거나 사라진 페이지예요.</p>
      <Link
        href="/"
        className="mt-7 rounded-full bg-sage px-6 py-3.5 text-[15px] font-semibold text-cream hover:bg-sage-dark"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
