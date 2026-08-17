import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const TOSS = "https://api.tosspayments.com/v1";

interface SubLine {
  productId: string;
  qty: number;
  unitPrice: number;
  intervalDays: number;
}

/**
 * 정기배송 승인.
 * 1) authKey + customerKey로 빌링키 발급
 * 2) 빌링키로 첫 회차 결제 승인
 * 3) (Supabase 연결 시) subscriptions 저장 + 다음 결제일 계산
 */
export async function POST(request: Request) {
  try {
    const { authKey, customerKey, orderId, amount, subscriptions } =
      (await request.json()) as {
        authKey?: string;
        customerKey?: string;
        orderId?: string;
        amount?: number;
        subscriptions?: SubLine[];
      };

    if (!authKey || !customerKey || !orderId || !amount) {
      return NextResponse.json({ error: "INVALID_PARAMS" }, { status: 400 });
    }

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "TOSS_SECRET_KEY_MISSING" }, { status: 500 });
    }
    const auth = "Basic " + Buffer.from(secretKey + ":").toString("base64");

    // 1) 빌링키 발급
    const issueRes = await fetch(`${TOSS}/billing/authorizations/issue`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ authKey, customerKey }),
    });
    const issueData = await issueRes.json();
    if (!issueRes.ok) {
      return NextResponse.json(issueData, { status: issueRes.status });
    }
    const billingKey: string = issueData.billingKey;

    // 2) 첫 회차 결제
    const chargeRes = await fetch(`${TOSS}/billing/${billingKey}`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        customerKey,
        amount: Number(amount),
        orderId,
        orderName: "정기배송 첫 회차",
      }),
    });
    const chargeData = await chargeRes.json();
    if (!chargeRes.ok) {
      return NextResponse.json(chargeData, { status: chargeRes.status });
    }

    // 3) 다음 결제일 + 구독 저장
    const intervalDays = subscriptions?.[0]?.intervalDays ?? 30;
    const nextChargeAt = new Date(
      Date.now() + intervalDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    const supabase = createSupabaseAdminClient();
    if (supabase) {
      if (subscriptions?.length) {
        await supabase.from("subscriptions").insert(
          subscriptions.map((s) => ({
            product_id: s.productId,
            qty: s.qty,
            interval_days: s.intervalDays,
            unit_price: s.unitPrice,
            billing_key: billingKey,
            customer_key: customerKey,
            next_charge_at: new Date(
              Date.now() + s.intervalDays * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "active",
          })),
        );
      }
      await supabase
        .from("orders")
        .update({ status: "paid", toss_payment_key: chargeData.paymentKey })
        .eq("order_number", orderId);
    }

    return NextResponse.json({ ...chargeData, nextChargeAt });
  } catch (err) {
    console.error("[subscriptions/confirm]", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
