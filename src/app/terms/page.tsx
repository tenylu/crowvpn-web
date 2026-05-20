import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TermsArticle } from "./TermsArticle";

export const metadata: Metadata = {
  title: "服务条款",
  description:
    "CrowVPN 服务条款与附加约定：服务范围、 acceptable use、订阅与计费、免责声明、争议解决及联系渠道，使用服务前请仔细阅读。",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "CrowVPN 服务条款",
    description: "使用 CrowVPN 服务所适用的条款、责任边界与重要约定。",
    url: "https://crowvpn.com/terms",
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)]">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[var(--page-max)] px-6 pb-12 pt-[calc(2rem+4.25rem+2rem)] lg:px-10 lg:pb-16 lg:pt-[calc(2rem+4.25rem+2.5rem)]">
          <TermsArticle />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
