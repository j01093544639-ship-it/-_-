import type { Metadata } from "next";
import { LegalDoc, Section } from "@/components/LegalDoc";

export const metadata: Metadata = { title: "교환·환불·청약철회" };

export default function RefundPage() {
  return (
    <LegalDoc title="교환 · 환불 · 청약철회 안내" updated="2026년 8월 1일">
      <Section no={1} title="청약철회">
        <p>
          이용자는 상품을 수령한 날부터 7일 이내에 청약철회를 할 수 있습니다. 다만 아래의
          경우에는 청약철회가 제한될 수 있습니다.
        </p>
        <ul className="ml-4 list-disc space-y-1">
          <li>이용자의 책임으로 상품이 훼손된 경우</li>
          <li>개봉 시 재판매가 곤란한 식품으로서 포장을 개봉한 경우</li>
          <li>시간의 경과로 재판매가 곤란할 정도로 상품 가치가 현저히 감소한 경우</li>
        </ul>
      </Section>
      <Section no={2} title="교환 및 반품 비용">
        <p>
          상품 하자·오배송의 경우 배송비는 회사가 부담합니다. 단순 변심에 의한 교환·반품
          배송비는 이용자가 부담합니다.
        </p>
      </Section>
      <Section no={3} title="환불 절차">
        <p>
          반품 상품이 회사에 도착하고 확인이 완료되면 3영업일 이내에 결제수단으로 환불합니다.
          카드 결제의 경우 카드사 정책에 따라 취소 반영에 시일이 걸릴 수 있습니다.
        </p>
      </Section>
      <Section no={4} title="정기배송 해지 및 환불">
        <p>
          정기배송은 다음 결제일 전까지 해지 시 추가 결제 없이 종료됩니다. 이미 출고된
          회차는 일반 반품 규정을 따릅니다.
        </p>
      </Section>
      <Section no={5} title="문의">
        <p>
          교환·환불 문의는 고객센터 1600-0000 (평일 10:00–17:00) 또는 jjun1139@naver.com로
          접수해주세요. (예시 정보, 실제 정보로 교체 필요)
        </p>
      </Section>
    </LegalDoc>
  );
}
