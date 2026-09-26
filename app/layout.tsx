import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WritingProvider } from "@/lib/writing-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luyện viết tiếng Việt",
  description: "Ứng dụng luyện viết tiếng Việt với gợi ý sửa lỗi từ AI",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WritingProvider>{children}</WritingProvider>
      </body>
    </html>
  );
}
