# 온담 스토어 — 건강식품 이커머스 (MVP)

내추럴·오가닉 톤의 한국어 건강식품 쇼핑몰. `homepage-builder-kr` 스킬 가이드에 따라
상품 목록 · 상세 · 장바구니 · 결제(토스페이먼츠) · 정기배송 · 리뷰 · 법적 페이지를 갖춘
프로덕션급 MVP입니다.

## 스택
- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4
- 토스페이먼츠 결제(단건 + 정기 빌링) · Supabase(선택) · lucide-react 아이콘
- 폰트: Pretendard(본문) + Nanum Myeongjo(디스플레이)

## 빠르게 실행
```bash
cp .env.local.example .env.local   # 토스 테스트 키가 이미 채워져 있음
npm install
npm run dev                        # http://localhost:3000
```
> Supabase 값을 비워두면 **시드 상품 데이터**로 동작합니다. 결제는 토스 **테스트 키**로
> 실제 청구 없이 전체 흐름을 검증할 수 있습니다.

## 주요 경로
| 경로 | 설명 |
|------|------|
| `/` | 홈(히어로·베스트·스토리·신상품·후기·CTA) |
| `/products` | 상품 목록(카테고리 필터·정렬) |
| `/products/[slug]` | 상세(성분·섭취법·주의·구독옵션·리뷰·JSON-LD) |
| `/cart` · `/checkout` | 장바구니 · 주문/결제 |
| `/checkout/success` · `/fail` | 결제 승인 결과 |
| `/orders` | 주문 내역 |
| `/login` | 카카오 로그인 + 비회원 주문 |
| `/policy/*` | 이용약관 · 개인정보 · 환불 |

## 결제 흐름
- **단건**: 결제창(`requestPayment`) → `successUrl` → `/api/payments/confirm`(서버 승인)
- **정기배송**: 자동결제 카드 등록(`requestBillingAuth`) → 빌링키 발급 + 첫 결제
  (`/api/subscriptions/confirm`) → 정기 결제는 `/api/subscriptions/charge`(Vercel Cron)

## Supabase 연동(운영)
1. `supabase/schema.sql`을 SQL Editor에서 실행(테이블 + RLS + 시드)
2. `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` 입력
3. Authentication → Providers → **Kakao** 활성화(카카오 개발자 앱 필요)

## 운영 전환 체크
- 토스 라이브 키로 교체(`NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`)
- Footer·정책 페이지의 **사업자 정보/통신판매업 신고번호**를 실제 값으로 교체
- `CRON_SECRET` 설정 후 정기결제 스케줄 확인
- 실제 상품 사진으로 `ProductArt` 대체

> 본 사이트의 상품은 일반 식품이며 질병의 예방·치료를 위한 의약품이 아닙니다.
