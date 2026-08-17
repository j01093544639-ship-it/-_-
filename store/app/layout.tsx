import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "참신한하루 · 정직한 원료로 채우는 건강한 하루",
    template: "%s · 참신한하루",
  },
  description:
    "원료의 종류와 함량을 투명하게 공개하는 건강식품 브랜드 참신한하루. 다이어트·장건강·비타민·뷰티·컨디션·키즈 라인업을 정기배송으로 편하게 받아보세요.",
  keywords: ["건강식품", "참신한하루", "식이섬유", "콜라겐", "유산균", "비타민C", "정기배송"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "참신한하루",
    title: "참신한하루 · 정직한 원료로 채우는 건강한 하루",
    description:
      "정직한 원료로 채우는 건강한 하루. 참신한하루의 건강식품을 정기배송으로 편하게 받아보세요.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
