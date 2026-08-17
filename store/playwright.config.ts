import { defineConfig, devices } from "@playwright/test";

/**
 * 핵심 구매 흐름 스모크 테스트용 최소 설정.
 * - 로컬/CI에서는 `npx playwright install chromium` 후 `npm run test:e2e`
 * - 이미 브라우저가 설치된 환경이면 PW_CHROMIUM_PATH로 실행 파일 경로를 넘길 수 있음(선택)
 */
const localExecutable = process.env.PW_CHROMIUM_PATH;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    ...(localExecutable ? { launchOptions: { executablePath: localExecutable } } : {}),
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
