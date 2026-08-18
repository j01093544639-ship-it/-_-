import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth(구글·카카오) 로그인 콜백.
 * Supabase가 붙여 보낸 `?code`를 세션으로 교환(PKCE)한 뒤 `next`(기본 홈)로 이동한다.
 * 실패 시에는 원인 메시지를 `?error=`로 실어 로그인 화면으로 되돌린다(디버깅용).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  let reason = "missing_code";

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      reason = "no_supabase_env";
    } else {
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
      reason = error.message || "exchange_failed";
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent(reason)}`,
  );
}
