import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PrivacyPolicyArticle } from "./PrivacyPolicyArticle";

export const metadata: Metadata = {
  title: "隐私政策",
  description:
    "CrowVPN 隐私政策：说明我们收集哪些个人数据、用途、存储与共享方式、跨境传输、您的权利与联系方式，以及 Cookie 与第三方服务相关说明。",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "CrowVPN 隐私政策",
    description: "个人数据处理规则、权利行使方式与联系方式。",
    url: "https://crowvpn.com/privacy",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)]">
      <SiteHeader />
      <main className="flex-1">
        {/* 顶栏 h-8 + 导航 h-[4.25rem] 为 fixed，需预留高度后再加与导航的间距 */}
        <div className="mx-auto w-full max-w-[var(--page-max)] px-6 pb-12 pt-[calc(2rem+4.25rem+2rem)] lg:px-10 lg:pb-16 lg:pt-[calc(2rem+4.25rem+2.5rem)]">
          <PrivacyPolicyArticle />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
