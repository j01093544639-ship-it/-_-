import type { Metadata } from "next";
import { LegalDoc, Section } from "@/components/LegalDoc";

export const metadata: Metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <LegalDoc title="개인정보처리방침" updated="2026년 8월 1일">
      <Section no={1} title="수집하는 개인정보 항목">
        <p>
          회사는 회원가입, 주문·배송, 고객상담을 위해 다음 정보를 수집합니다: 이름, 연락처,
          배송지 주소, 주문내역. 결제정보는 결제대행사(토스페이먼츠)를 통해 처리되며 회사는
          카드번호 등 민감한 결제정보를 저장하지 않습니다.
        </p>
      </Section>
      <Section no={2} title="개인정보의 이용 목적">
        <p>
          수집한 정보는 상품 배송, 주문·정기배송 관리, 고객 문의 대응, 서비스 개선을 위해
          이용합니다.
        </p>
      </Section>
      <Section no={3} title="개인정보의 보유 및 이용기간">
        <p>
          관계 법령에 따라 계약·청약철회 기록은 5년, 대금결제 기록은 5년, 소비자 불만·분쟁
          처리 기록은 3년간 보관합니다. 목적 달성 후에는 지체 없이 파기합니다.
        </p>
      </Section>
      <Section no={4} title="개인정보의 제3자 제공">
        <p>
          회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만 배송을 위해
          배송업체에 최소한의 정보(수령인, 연락처, 주소)를 제공할 수 있습니다.
        </p>
      </Section>
      <Section no={5} title="처리 위탁">
        <p>
          원활한 서비스 제공을 위해 결제처리(토스페이먼츠), 데이터 보관(Supabase) 등의 업무를
          위탁할 수 있으며, 위탁 시 관련 법령에 따라 개인정보가 안전하게 관리되도록 합니다.
        </p>
      </Section>
      <Section no={6} title="이용자의 권리">
        <p>
          이용자는 언제든지 자신의 개인정보를 조회·수정·삭제하거나 처리 정지를 요청할 수
          있습니다. 요청은 고객센터를 통해 접수합니다.
        </p>
      </Section>
      <Section no={7} title="개인정보 보호책임자">
        <p>
          성명 000 · 이메일 privacy@chamshinhan.example · 연락처 1600-0000 (예시 정보, 실제
          정보로 교체 필요)
        </p>
      </Section>
    </LegalDoc>
  );
}
