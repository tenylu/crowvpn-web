import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CookiePolicyArticle } from "./CookiePolicyArticle";

export const metadata: Metadata = {
  title: "Cookie 政策",
  description:
    "CrowVPN Cookie 政策：说明本站使用的必要型、功能型、分析型与广告型 Cookie，第三方服务（如统计与客服）可能设置的 Cookie，以及如何通过偏好设置管理同意。",
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: "CrowVPN Cookie 政策",
    description: "Cookie 类型、用途与管理方式说明。",
    url: "https://crowvpn.com/cookies",
  },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)]">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[var(--page-max)] px-6 pb-12 pt-[calc(2rem+4.25rem+2rem)] lg:px-10 lg:pb-16 lg:pt-[calc(2rem+4.25rem+2.5rem)]">
          <CookiePolicyArticle />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
