import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * 인증 세션 갱신 미들웨어.
 * 요청마다 Supabase 세션 쿠키를 최신으로 유지해 로그인 상태가 끊기지 않게 한다.
 * Supabase 환경변수가 없으면(미설정 데모 상태) 아무 것도 하지 않고 그대로 통과시킨다.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() 호출이 만료 임박 토큰을 자동 갱신하고 쿠키를 다시 심는다.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // 정적 자원·이미지·favicon·OAuth 콜백은 미들웨어에서 제외.
  // (auth/callback은 PKCE code_verifier 쿠키를 콜백 라우트가 직접 읽어야 하므로 반드시 제외)
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
