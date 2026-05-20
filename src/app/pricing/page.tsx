import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingFaqSection } from "@/components/pricing/PricingFaqSection";
import { PricingPageContent } from "@/components/pricing/PricingPageContent";

export const metadata: Metadata = {
  title: "定价",
  description:
    "在 CrowVPN 官网比较 VPN 套餐与价格：查看 C15Mini、C50G、C120Pro、C200Ultra 等档位的月付/年付/两年付、流量、设备数、节点与带宽，并了解 30 天退款保证与常见问题。",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "CrowVPN 套餐定价 | 比较 VPN 方案",
    description:
      "在线比较 CrowVPN 各档套餐、计费周期与功能差异，选择适合你的加密 VPN 方案。",
    url: "https://crowvpn.com/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowVPN 套餐定价",
    description: "比较 VPN 套餐、价格与功能，含多周期计费与退款说明。",
  },
};

export default function PricingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)] overflow-x-hidden">
      <SiteHeader />
      <main className="flex-1">
        <PricingPageContent />
        <TestimonialsSection />
        <PricingFaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}
