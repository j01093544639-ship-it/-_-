import { test, expect } from "@playwright/test";

/**
 * 핵심 구매 흐름 스모크 테스트.
 * 상품 목록 → 상세 → 구성(통) 선택 → 장바구니 담기 → 장바구니 확인 → 체크아웃 진입.
 * "돈이 새는" 핵심 경로가 깨지면 배포 전에 빨간불이 켜지도록 하는 최소 안전망이다.
 * (실제 토스 결제 승인까지는 외부 결제창이라 스모크 범위에서 제외)
 */
test("핵심 구매 흐름: 상품 → 상세 → 장바구니 → 체크아웃", async ({ page }) => {
  // 1) 상품 목록
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "전체 상품" })).toBeVisible();

  // 2) 대표 상품 상세 진입
  await page.goto("/products/triella-collagen-biotin");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("트리엘라");

  // 3) 구성(3통) 선택 후 장바구니 담기
  await page.getByRole("button", { name: /3통/ }).click();
  await page.getByRole("button", { name: "장바구니" }).click();

  // 4) 장바구니에 담겼는지 확인
  await page.goto("/cart");
  await expect(page.getByRole("link", { name: /트리엘라/ }).first()).toBeVisible();
  await expect(page.getByText("3통 구성")).toBeVisible();
  await expect(page.getByText("결제 예정 금액")).toBeVisible();

  // 5) 체크아웃 진입 + 결제 버튼 노출 확인
  await page.getByRole("link", { name: /주문하기/ }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByRole("heading", { name: "주문/결제" })).toBeVisible();
  await expect(page.getByRole("button", { name: /결제하기/ })).toBeVisible();
});
