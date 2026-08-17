"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, MessageCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginWithKakao = async () => {
    setNotice(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setNotice(
        "데모 환경이에요. Supabase에 카카오 Provider를 연결하면 실제 로그인이 동작합니다.",
      );
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${window.location.origin}` },
    });
    if (error) {
      setLoading(false);
      setNotice("로그인을 시작하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="mx-auto grid max-w-md place-items-center px-5 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-sage text-cream">
        <Leaf size={24} strokeWidth={2.1} />
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold text-ink">참신한하루 로그인</h1>
      <p className="mt-2 text-muted">
        카카오로 간편하게 시작하고 주문·정기배송을 한 곳에서 관리하세요.
      </p>

      <button
        type="button"
        onClick={loginWithKakao}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 py-3.5 text-[15px] font-bold text-[#191600] transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        <MessageCircle size={18} className="fill-[#191600]" strokeWidth={0} />
        {loading ? "이동 중…" : "카카오로 3초 만에 시작하기"}
      </button>

      {notice && (
        <p className="mt-4 rounded-xl bg-sand/70 px-4 py-3 text-sm text-muted">{notice}</p>
      )}

      <div className="mt-8 w-full border-t border-line pt-6">
        <p className="text-sm text-muted">회원가입 없이도 주문할 수 있어요.</p>
        <Link
          href="/products"
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-line px-6 py-3.5 text-[15px] font-semibold text-ink hover:bg-sage-tint"
        >
          비회원으로 주문하기
        </Link>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted/80">
        로그인 시{" "}
        <Link href="/policy/terms" className="underline">
          이용약관
        </Link>{" "}
        및{" "}
        <Link href="/policy/privacy" className="underline">
          개인정보처리방침
        </Link>
        에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  );
}
