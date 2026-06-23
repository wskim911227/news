import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "아침 브리핑 | Morning Briefing",
  description: "매일 아침 9시, 어제 핫이슈·날씨·KBO 경기를 카드뉴스로 정리합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-100 antialiased">{children}</body>
    </html>
  );
}
