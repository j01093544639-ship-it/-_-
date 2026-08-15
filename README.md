# 모청 메이커 — 모바일 청첩장 제작 & 수익화 키트

문구와 사진만 넣으면 모바일 청첩장이 완성되는 도구. 바이브 코딩 수익화의
①외주 → ②직접판매를 하나로 잇는 프로젝트입니다.

## 구성 파일

| 파일 | 역할 |
|------|------|
| `index.html` | **메이커** — 폼에 입력 → 실시간 미리보기 → 링크/HTML/클라우드로 내보내기 |
| `viewer.html` | **뷰어** — 클라우드에 저장된 청첩장을 `viewer.html?s=slug` 로 표시 |
| `functions/confirm-payment/index.ts` | **결제 승인** 엣지 함수(토스페이먼츠) — 셀프서비스 유료화용 스켈레톤 |

## 기능

- **디자인 테마 6종**: 세이지 · 블러쉬 · 모던블랙 · 한지 · 클래식 · 보태니컬
- **입력만으로 완성**: 표지/인사말/혼주/예식정보/갤러리/오시는길(카카오맵)/계좌
- **연출**: 배경음악, 떨어지는 효과(꽃잎·눈·하트), 예식까지 실시간 카운트다운
- **방명록**: 하객 축하 메시지 — Supabase로 실시간 공유 (청첩장별 slug 구분)
- **내보내기 3가지**
  - 🔗 링크 복사 — 글자 정보만 담긴 빠른 시안 링크
  - HTML 저장 — 사진까지 박힌 독립 파일 (개별 배포용)
  - ☁ 클라우드 링크 — Supabase에 저장하고 `viewer.html` 호스팅 링크 발급

## 데이터베이스 (Supabase)

프로젝트: `emqkhunzbbcanprikbaz` (ap-northeast-1)

- `guestbook(slug, name, message, created_at)` — RLS: 공개 읽기/쓰기(길이 제한)
- `invitations(slug, html, paid, created_at)` — RLS: 공개 읽기, 공개 쓰기(MVP)

publishable(anon) 키는 공개되어도 안전하며 RLS로 보호됩니다.

## 배포

`index.html` 과 `viewer.html` 을 같은 정적 호스팅에 올리면 클라우드 링크가 동작합니다.
- Vercel/Netlify에 폴더 드래그, 또는 GitHub 저장소 연결
- 두 파일이 같은 origin에 있어야 `viewer.html?s=...` 링크가 자동 생성됩니다

## 유료 셀프서비스로 확장하기 (②단계)

현재는 **내가 쓰는 제작 도구**입니다. 고객이 직접 만들고 결제하게 하려면:

1. **토스페이먼츠 가맹점 등록** (사업자등록 필요) → 클라이언트 키 / 시크릿 키 발급
2. 메이커에 토스 결제창 SDK를 붙이고, 저장 전 결제를 요구
3. 결제 성공 콜백 → `functions/confirm-payment` 엣지 함수로 최종 승인
   ```
   supabase functions deploy confirm-payment
   supabase secrets set TOSS_SECRET_KEY=test_sk_xxx
   ```
4. `viewer.html` 에서 `invitations.paid` 가 `false` 면 워터마크/미리보기만 노출
5. `invitations` insert 정책을 결제 검증 기반으로 강화 (엣지 함수 경유 쓰기)

> 결제 활성화는 본인 명의의 사업자·가맹점 심사가 필요합니다. 그 전까지는
> 테스트 키로 흐름을 검증하고, 외주(①)로 매출을 만들며 수요를 확인하세요.
