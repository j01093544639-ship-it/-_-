# 참신한하루 스토어 — 건강식품 이커머스 (MVP)

내추럴·오가닉 톤의 한국어 건강식품 쇼핑몰. 브랜드 **참신한하루**의 실제 16종 제품을
상품목록·상세·장바구니·결제(토스페이먼츠)·정기배송·리뷰·법적 페이지로 구성했습니다.
(제품/사진/후기는 참신한하루의 예전 브랜드 홈페이지 데이터를 기준으로 반영했습니다.)

> 본 사이트의 상품은 **일반 건강식품**이며 질병의 예방·치료를 위한 의약품이 아닙니다.

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
> Supabase 값을 비워두면 `lib/products.ts`의 **실제 16종 시드**로 동작합니다.
> 결제는 토스 **테스트 키**로 실제 청구 없이 전체 흐름을 검증할 수 있습니다.

## 주요 경로
| 경로 | 설명 |
|------|------|
| `/` | 홈(히어로·신뢰·시그니처·베스트·카테고리·후기·CTA) |
| `/products` | 상품 목록(카테고리 필터·정렬) |
| `/products/[slug]` | 상세(원료·함량, 특징, 추천, 구독옵션, 후기, JSON-LD) |
| `/cart` · `/checkout` | 장바구니 · 주문/결제 |
| `/checkout/success` · `/fail` | 결제 승인 결과 |
| `/orders` | 주문 내역 |
| `/login` | 카카오 로그인 + 비회원 주문 |
| `/policy/*` | 이용약관 · 개인정보 · 환불 |

## 상품 데이터 · 가격
- `lib/products.ts` — 참신한하루 실제 16종(다이어트·장건강·비타민면역·뷰티·컨디션·키즈)
- 사진: `public/products/product-01~16.jpg` (실제 제품 사진)
- **가격(전 제품 공통 묶음 정가)**: `lib/pricing.ts`의 `BUNDLE_TIERS`
  - 1통 24,900 · 2통 37,300 · 3통 49,800 · 5통 74,700원
  - 정기배송은 위 묶음가에 제품별 할인율을 추가 적용

## 결제 흐름
- **단건**: 결제창(`requestPayment`) → `successUrl` → `/api/payments/confirm`(서버 승인)
- **정기배송**: 자동결제 카드 등록(`requestBillingAuth`) → 빌링키 발급 + 첫 결제
  (`/api/subscriptions/confirm`) → 정기 결제는 `/api/subscriptions/charge`(Vercel Cron)

## 운영 전환 체크
1. 가격 조정이 필요하면 `lib/pricing.ts`의 `BUNDLE_TIERS`에서 수정(전 제품 공통)
2. Footer·정책 페이지의 **사업자 정보/통신판매업 신고번호**를 실제 값으로 교체
3. 토스 **라이브 키**로 교체(`NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`)
4. (선택) `supabase/schema.sql` 실행 + 환경변수 입력 + **카카오·구글 로그인 Provider 연결**, `CRON_SECRET` 설정
   - 로그인 버튼(카카오·구글)은 이미 준비돼 있습니다(`app/login/page.tsx`). Supabase Authentication → Providers에서 각 Provider를 켜고 키를 입력하면 바로 동작합니다.

## 문의 채널(브랜드 기존)
- 카카오톡 문의: https://open.kakao.com/o/sUHBXsGi
- 네이버 스토어: https://smartstore.naver.com/chamshinhan2

<!-- deploy: chamshin-store production trigger 2026-08-19 (chatbot + contact email + login fix) -->
