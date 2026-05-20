import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookiePreferencesProvider } from "@/components/cookie/CookiePreferencesContext";
import { LocaleTextBridge } from "@/components/LocaleTextBridge";
import { ZohoSalesIQ } from "@/components/ZohoSalesIQ";
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
  metadataBase: new URL("https://crowvpn.com"),
  applicationName: "CrowVPN",
  title: {
    default: "CrowVPN — VPN 官方网站：套餐、下载与加密安全上网",
    template: "%s | CrowVPN",
  },
  description:
    "CrowVPN 官方网站：提供 VPN 加密隧道、多地区节点、Windows / macOS / Linux / Android / iOS 客户端下载与透明套餐定价，注重隐私与稳定连接，适合日常安全上网与跨境访问场景。",
  keywords: [
    "CrowVPN",
    "CrowVPN 官网",
    "VPN",
    "VPN 下载",
    "VPN 套餐",
    "VPN 价格",
    "加密上网",
    "VPN 推荐",
    "科学上网",
    "隐私保护",
    "Windows VPN",
    "macOS VPN",
    "Linux VPN",
    "Android VPN",
    "iOS VPN",
  ],
  authors: [{ name: "CrowVPN", url: "https://crowvpn.com" }],
  creator: "CrowVPN",
  publisher: "CrowVPN",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon1.png", sizes: "16x16", type: "image/png" },
      { url: "/icon2.png", sizes: "32x32", type: "image/png" },
      { url: "/icon3.png", sizes: "192x192", type: "image/png" },
      { url: "/icon4.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "CrowVPN — VPN 官方网站：套餐、下载与加密连接",
    description:
      "加密隧道、多平台客户端、清晰套餐与隐私边界，为日常上网与跨境访问而设计。访问 crowvpn.com 了解详情。",
    url: "https://crowvpn.com",
    siteName: "CrowVPN",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/images/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "CrowVPN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowVPN — VPN 官方网站",
    description:
      "CrowVPN：加密 VPN、多平台客户端与套餐定价。安全、顺畅的网络访问体验。",
    images: ["/images/hero-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <CookiePreferencesProvider>
          <LocaleTextBridge />
          {children}
        </CookiePreferencesProvider>
        <ZohoSalesIQ />
      </body>
    </html>
  );
}
