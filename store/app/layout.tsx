import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "온담 · 매일의 컨디션을 담백하게",
    template: "%s · 온담",
  },
  description:
    "매일의 컨디션을 자연스럽게 챙기는 건강식품 브랜드 온담. 유산균, 오메가3, 비타민, 발효홍삼을 정기배송으로 편하게 받아보세요.",
  keywords: ["건강식품", "유산균", "오메가3", "비타민", "정기배송", "온담"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "온담",
    title: "온담 · 매일의 컨디션을 담백하게",
    description:
      "필요한 만큼, 자연스럽게. 온담의 건강식품을 정기배송으로 편하게 받아보세요.",
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
