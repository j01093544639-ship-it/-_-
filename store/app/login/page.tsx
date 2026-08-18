"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, MessageCircle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Provider = "kakao" | "google";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState<Provider | null>(null);

  const loginWith = async (provider: Provider, label: string) => {
    setNotice(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setNotice(
        `데모 환경이에요. Supabase에서 ${label} 로그인 Provider를 켜면 바로 동작합니다.`,
      );
      return;
    }
    setLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setLoading(null);
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
        카카오·구글로 간편하게 시작하고 주문·정기배송을 한 곳에서 관리하세요.
      </p>

      <div className="mt-8 w-full space-y-3">
        <button
          type="button"
          onClick={() => loginWith("kakao", "카카오")}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 py-3.5 text-[15px] font-bold text-[#191600] transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          <MessageCircle size={18} className="fill-[#191600]" strokeWidth={0} />
          {loading === "kakao" ? "이동 중…" : "카카오로 시작하기"}
        </button>

        <button
          type="button"
          onClick={() => loginWith("google", "구글")}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-cream px-6 py-3.5 text-[15px] font-semibold text-ink transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          <GoogleIcon />
          {loading === "google" ? "이동 중…" : "구글로 시작하기"}
        </button>
      </div>

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
