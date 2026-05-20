"use client";

import Image from "next/image";
import { getBrandLogoSrc, getTrustPack } from "@/data/localizedTrust";
import { useLocaleCode } from "@/hooks/useLocaleCode";

type BrandLogoStripProps = {
  itemClassName?: string;
  imageClassName?: string;
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
        <span key={logo.slug} className={itemClassName} data-no-translate>
          <Image
            src={getBrandLogoSrc(logo.slug)}
            alt={logo.alt}
            width={logo.width ?? 126}
            height={34}
            className={imageClassName}
            unoptimized
          />
        </span>
      ))}
    </>
  );
}
