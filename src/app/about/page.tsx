import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "关于我们",
  description:
    "认识 CrowVPN：团队使命、产品价值观、文化与里程碑，了解我们如何通过可靠节点与清晰产品体验服务全球用户。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "关于 CrowVPN | 团队与使命",
    description: "CrowVPN 团队、文化与成长历程，以及我们对隐私与连接体验的坚持。",
    url: "https://crowvpn.com/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "关于 CrowVPN",
    description: "团队、使命与价值观，了解 CrowVPN 背后的故事。",
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)] overflow-x-hidden">
      <SiteHeader solidNavBarUntilScroll />
      <main className="flex-1">
        <AboutPageContent />
      </main>
      <SiteFooter />
    </div>
  );
}
