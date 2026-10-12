"use client";

import Image from "next/image";
import { getBrandLogoSrc, getTrustPack } from "@/data/localizedTrust";
import { useLocaleCode } from "@/hooks/useLocaleCode";

type BrandLogoStripProps = {
  itemClassName?: string;
  imageClassName?: string;
};

const wordmarkSources: Record<string, string> = {
  xiaomi: "/images/brand-logos/xiaomi-wordmark-soft.png",
  wechat: "/images/brand-logos/wechat-app.png",
  dji: "/images/brand-logos/dji-blue.png",
  "li-auto": "/images/brand-logos/li-auto-green.png",
  xpeng: "/images/brand-logos/xpeng-wordmark-soft.png",
  nio: "/images/brand-logos/nio-app-rounded.png",
};

export function BrandLogoStrip({
  itemClassName = "",
  imageClassName = "h-6 w-auto object-contain",
}: BrandLogoStripProps) {
  const locale = useLocaleCode();
  const { brands } = getTrustPack(locale);

  return (
    <>
      {brands.map((logo) => (
        <span key={logo.slug} className={itemClassName} data-brand={logo.slug} data-no-translate>
          <Image
            src={logo.slug === "xiaomi" ? getBrandLogoSrc(logo.slug) : wordmarkSources[logo.slug] ?? getBrandLogoSrc(logo.slug)}
            alt={logo.alt}
            width={logo.width ?? 126}
            height={34}
            className={`${imageClassName}${logo.slug === "li-auto" ? " rounded-[8px]" : ""}`}
            unoptimized
          />
          {logo.slug === "xiaomi" && <Image src="/images/brand-logos/xiaomi-text-gray.png" alt="" width={86} height={16} className="h-auto w-[86px] shrink-0" unoptimized />}
        </span>
      ))}
    </>
  );
}
