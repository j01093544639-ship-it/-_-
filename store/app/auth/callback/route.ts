import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth(카카오·구글) 로그인 콜백.
 * Supabase가 붙여 보낸 `?code`를 세션으로 교환(PKCE)한 뒤 `next`(기본 홈)로 이동한다.
 * 이 라우트가 있어야 로그인이 "완료"되어 세션 쿠키가 심어진다.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // 프록시/로드밸런서 뒤에서도 올바른 호스트로 리다이렉트
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocal = process.env.NODE_ENV === "development";
        if (!isLocal && forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        }
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // 코드 누락·교환 실패 시 로그인 화면으로
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
