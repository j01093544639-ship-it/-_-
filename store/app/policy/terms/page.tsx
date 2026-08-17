import type { Metadata } from "next";
import { LegalDoc, Section } from "@/components/LegalDoc";

export const metadata: Metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <LegalDoc title="이용약관" updated="2026년 8월 1일">
      <Section no={1} title="목적">
        <p>
          본 약관은 온담(이하 &ldquo;회사&rdquo;)이 운영하는 온라인 쇼핑몰에서 제공하는
          서비스의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을
          목적으로 합니다.
        </p>
      </Section>
      <Section no={2} title="정의">
        <p>
          &ldquo;이용자&rdquo;란 회사의 서비스에 접속하여 본 약관에 따라 회사가 제공하는
          서비스를 이용하는 회원 및 비회원을 말합니다.
        </p>
      </Section>
      <Section no={3} title="약관의 효력 및 변경">
        <p>
          본 약관은 서비스 화면에 게시하여 효력이 발생합니다. 회사는 관련 법령을 위배하지
          않는 범위에서 약관을 변경할 수 있으며, 변경 시 적용일자와 사유를 명시하여 사전에
          공지합니다.
        </p>
      </Section>
      <Section no={4} title="서비스의 제공">
        <p>
          회사는 상품 정보 제공 및 구매계약의 체결, 배송, 기타 회사가 정하는 업무를
          수행합니다. 상품의 품절 또는 사양 변경 등의 경우 제공 내용이 변경될 수 있습니다.
        </p>
      </Section>
      <Section no={5} title="구매 신청 및 계약의 성립">
        <p>
          이용자는 회사가 정한 절차에 따라 구매를 신청하며, 회사가 이를 승낙함으로써
          구매계약이 성립합니다. 결제 수단은 토스페이먼츠를 통한 신용카드 등 회사가 정한
          방법에 따릅니다.
        </p>
      </Section>
      <Section no={6} title="정기배송">
        <p>
          정기배송 상품은 이용자가 선택한 주기에 따라 자동으로 결제·배송됩니다. 이용자는
          다음 결제일 전까지 주기 변경 또는 해지를 신청할 수 있습니다.
        </p>
      </Section>
      <Section no={7} title="상품 정보의 표시">
        <p>
          본 쇼핑몰에서 판매하는 상품은 일반 식품이며, 특정 질병의 예방·치료를 위한 의약품이
          아닙니다. 회사는 원료·함량·섭취방법·주의사항을 상품 상세페이지에 표시합니다.
        </p>
      </Section>
    </LegalDoc>
  );
}
