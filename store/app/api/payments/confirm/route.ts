import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * 단건 결제 승인.
 * successUrl로 전달된 paymentKey/orderId/amount로 토스 승인 API를 호출한다.
 * 멱등성: 토스가 동일 paymentKey 중복 승인을 거부하고, Supabase 업데이트도 이미 paid면 스킵.
 */
export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });
    }

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "TOSS_SECRET_KEY_MISSING" }, { status: 500 });
    }

    const auth = "Basic " + Buffer.from(secretKey + ":").toString("base64");
    const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Supabase 연결 시 주문 상태 업데이트(이미 paid면 스킵)
    const supabase = createSupabaseAdminClient();
    if (supabase) {
      const { data: existing } = await supabase
        .from("orders")
        .select("status")
        .eq("order_number", orderId)
        .maybeSingle();
      if (existing && existing.status !== "paid") {
        await supabase
          .from("orders")
          .update({ status: "paid", toss_payment_key: paymentKey })
          .eq("order_number", orderId);
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[payments/confirm]", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
