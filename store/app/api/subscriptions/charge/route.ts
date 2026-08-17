import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { orderNumber } from "@/lib/format";

const TOSS = "https://api.tosspayments.com/v1";

/**
 * 정기결제 스케줄러(스캐폴딩).
 * next_charge_at이 도래한 active 구독을 찾아 빌링키로 결제하고 다음 주기를 예약한다.
 *
 * 스케줄 방법(둘 중 하나):
 *  - Vercel Cron: vercel.json crons에 등록(GET 호출). CRON_SECRET 설정 시 Vercel이
 *    Authorization: Bearer <CRON_SECRET> 헤더를 자동 첨부한다.
 *  - Supabase pg_cron / 외부 스케줄러: POST + x-cron-secret 헤더로 호출.
 */
function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // 미설정 시 개발 편의상 허용
  const bearer = request.headers.get("authorization");
  const custom = request.headers.get("x-cron-secret");
  return bearer === `Bearer ${secret}` || custom === secret;
}

async function runCharges() {
  const tossSecret = process.env.TOSS_SECRET_KEY;
  const supabase = createSupabaseAdminClient();
  if (!supabase || !tossSecret) {
    return NextResponse.json(
      { error: "NOT_CONFIGURED", note: "Supabase/TOSS 환경변수가 필요합니다." },
      { status: 503 },
    );
  }
  const auth = "Basic " + Buffer.from(tossSecret + ":").toString("base64");
  const nowIso = new Date().toISOString();

  const { data: due, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("status", "active")
    .lte("next_charge_at", nowIso)
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let charged = 0;
  const failures: string[] = [];

  for (const sub of due ?? []) {
    try {
      const res = await fetch(`${TOSS}/billing/${sub.billing_key}`, {
        method: "POST",
        headers: { Authorization: auth, "Content-Type": "application/json" },
        body: JSON.stringify({
          customerKey: sub.customer_key,
          amount: sub.unit_price * sub.qty,
          orderId: orderNumber(),
          orderName: "정기배송 정기결제",
        }),
      });
      if (!res.ok) {
        failures.push(sub.id);
        continue;
      }
      const next = new Date(
        Date.now() + sub.interval_days * 24 * 60 * 60 * 1000,
      ).toISOString();
      await supabase.from("subscriptions").update({ next_charge_at: next }).eq("id", sub.id);
      charged += 1;
    } catch {
      failures.push(sub.id);
    }
  }

  return NextResponse.json({ processed: due?.length ?? 0, charged, failures });
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return runCharges();
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return runCharges();
}
