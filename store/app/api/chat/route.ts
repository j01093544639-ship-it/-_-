import { streamText, type ModelMessage } from "ai";
import { PRODUCTS } from "@/lib/products";

// 상담 응답은 스트리밍이라 시간이 걸릴 수 있음
export const maxDuration = 30;

/**
 * Vercel AI Gateway 경유 모델. 저비용 Haiku 기본값.
 * Vercel 배포 시 OIDC로 자동 인증되며, 로컬/타 환경은 AI_GATEWAY_API_KEY 사용.
 * 필요 시 AI_CHAT_MODEL 환경변수로 다른 모델로 교체 가능.
 */
const MODEL = process.env.AI_CHAT_MODEL || "anthropic/claude-haiku-4.5";

// 상품 카탈로그를 짧게 요약해 상담 근거로 제공
const CATALOG = PRODUCTS.map((p) => `- ${p.name} (${p.category}): ${p.summary}`).join("\n");

const SYSTEM_PROMPT = `당신은 대한민국 건강식품 브랜드 **"참신한하루"**의 공식 상담 챗봇 "하루"입니다.
친절하고 간결하게, 한국어로 존댓말로 답합니다.

## 역할 (오직 이 주제만 답합니다)
- 참신한하루 브랜드 소개, 운영 정책
- 참신한하루 제품(다이어트·장건강·비타민면역·뷰티·컨디션·키즈)의 성분·함량·특징·섭취 방법·추천 대상
- 주문/결제(토스페이먼츠)·정기배송·배송·환불/교환·회원 관련 안내

## 반드시 지킬 규칙
1. **위 주제와 무관한 질문(예: 코딩, 시사, 날씨, 수학, 타 브랜드/제품, 일반 상식, 개인적 고민 등)에는 절대 답하지 마세요.**
   대신 정확히 이렇게 정중히 안내하세요:
   "죄송해요, 저는 참신한하루 상담만 도와드릴 수 있어요. 제품·주문·정기배송처럼 참신한하루 관련해 궁금한 점을 물어봐 주세요. 🌿"
2. 참신한하루 제품은 **일반 건강식품**이며 질병의 예방·치료를 위한 의약품이 아닙니다. 진단·치료·처방을 단정하지 말고, 질환이 있거나 약 복용 중이면 전문가 상담을 권하세요.
3. 확실하지 않은 사실(재고, 정확한 배송일, 개인 주문 상태 등)은 지어내지 말고, 고객센터/마이페이지 확인을 안내하세요.
4. 답변은 3~5문장 이내로 짧고 명확하게. 필요하면 목록으로.

## 참신한하루 상품 목록
${CATALOG}

## 가격(전 제품 공통 묶음 정가)
1통 24,900원 · 2통 37,300원 · 3통 49,800원 · 5통 74,700원. 정기배송은 제품별 추가 할인.`;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: ModelMessage[] };
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

    const result = streamText({
      model: MODEL,
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.3,
    });

    return result.toTextStreamResponse();
  } catch {
    return new Response("상담 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.", {
      status: 500,
    });
  }
}
