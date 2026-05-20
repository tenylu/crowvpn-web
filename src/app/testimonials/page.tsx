import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TestimonialsPageContent } from "@/components/testimonials/TestimonialsPageContent";

export const metadata: Metadata = {
  title: "用户评价",
  description:
    "阅读 CrowVPN 用户评价与使用场景：跨境办公、流媒体、协作工具与差旅网络等真实反馈，帮助你判断 CrowVPN 是否适合你的需求。",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: "CrowVPN 用户评价 | 真实使用反馈",
    description: "来自不同行业与地区的用户对 CrowVPN 连接稳定性与易用性的评价摘录。",
    url: "https://crowvpn.com/testimonials",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowVPN 用户评价",
    description: "真实用户反馈与使用场景分享。",
  },
};

export default function TestimonialsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col overflow-x-hidden bg-[var(--background)]">
      <SiteHeader />
      <main className="flex-1">
        <TestimonialsPageContent />
      </main>
      <SiteFooter />
    </div>
  );
}
