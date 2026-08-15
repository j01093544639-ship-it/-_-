// Supabase Edge Function — 토스페이먼츠 결제 승인 + 청첩장 결제완료 처리
//
// 배포 (키 준비 후):
//   supabase functions deploy confirm-payment
//   supabase secrets set TOSS_SECRET_KEY=test_sk_xxx   # 토스페이먼츠 시크릿 키
//   (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 는 자동 주입됩니다)
//
// 프론트 결제창(토스 SDK)에서 성공 콜백으로 받은
// paymentKey / orderId / amount 와, 저장한 청첩장 slug 를 이 함수로 POST 하면
// 토스 서버에 결제를 최종 승인하고 invitations.paid = true 로 표시합니다.
//
// ⚠️ 활성화에는 본인 명의의 토스페이먼츠 가맹점 등록(사업자)이 필요합니다.
//    테스트 키(test_sk_...)로 먼저 흐름을 검증한 뒤 라이브 키로 교체하세요.

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

  const TOSS_SECRET = Deno.env.get("TOSS_SECRET_KEY");
  if (!TOSS_SECRET) return json({ error: "TOSS_SECRET_KEY 미설정" }, 500);

  const { paymentKey, orderId, amount, slug } = await req.json();
  if (!paymentKey || !orderId || !amount || !slug) return json({ error: "필수 값 누락" }, 400);

  // 1) 토스페이먼츠에 결제 최종 승인 요청
  const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(TOSS_SECRET + ":"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
  const tossData = await tossRes.json();
  if (!tossRes.ok) return json({ error: "결제 승인 실패", detail: tossData }, 402);

  // 2) 결제완료 표시 (service role → RLS 우회)
  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { error } = await sb.from("invitations").update({ paid: true }).eq("slug", slug);
  if (error) return json({ error: "DB 업데이트 실패", detail: error.message }, 500);

  return json({ ok: true, orderId });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
