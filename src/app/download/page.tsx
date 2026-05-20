import type { Metadata } from "next";
import { DownloadPageContent } from "@/components/DownloadPageContent";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "下载",
  description:
    "从 CrowVPN 官网下载官方客户端：支持 Windows、macOS、Linux、Android 与 iOS，获取安装说明、APK 与版本更新入口，快速完成配置并连接加密节点。",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "下载 CrowVPN 客户端 | Windows / macOS / Linux / Android / iOS",
    description: "一站式获取各平台安装包与使用指引，安全下载官方 CrowVPN 应用。",
    url: "https://crowvpn.com/download",
  },
  twitter: {
    card: "summary_large_image",
    title: "下载 CrowVPN",
    description: "Windows、macOS、Linux、Android、iOS 官方客户端下载与说明。",
  },
};

export default function DownloadPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)] overflow-x-hidden">
      <SiteHeader solidNavBarUntilScroll />
      <main className="flex-1">
        <DownloadPageContent />
      </main>
      <SiteFooter />
    </div>
  );
}
