import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "每日精选 | Daily Digest",
  description: "AI 智能筛选，每天为你精选 5 篇最值得阅读的创新创业、科技、营销、品牌资讯",
  keywords: "每日精选, AI, 创新, 创业, 科技, 营销, 品牌, daily digest",
  openGraph: {
    title: "每日精选 | Daily Digest",
    description: "AI 智能筛选，每天精选 5 篇好文章",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  )
}
