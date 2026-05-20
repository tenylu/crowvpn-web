"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { defaultLocale, isLocaleCode, type LocaleCode } from "@/i18n/locales";

type LocalizedImageProps = Omit<ImageProps, "src"> & {
  zhSrc: string;
  neutralSrc: string;
};

function readInitialLocale(): LocaleCode {
  if (typeof window === "undefined") return defaultLocale;
  const stored = window.localStorage.getItem("crowvpn-language");
  return isLocaleCode(stored) ? stored : defaultLocale;
}

function usesChineseArtwork(locale: LocaleCode) {
  return locale === "zh-CN" || locale === "zh-HK";
}

export function LocalizedImage({ zhSrc, neutralSrc, alt, ...props }: LocalizedImageProps) {
  const [locale, setLocale] = useState<LocaleCode>(readInitialLocale);

  useEffect(() => {
    const handleLocaleChange = (event: Event) => {
      const detail = (event as CustomEvent<LocaleCode | { locale?: string }>).detail;
      const nextLocale = typeof detail === "string" ? detail : detail?.locale;
      if (nextLocale && isLocaleCode(nextLocale)) {
        setLocale(nextLocale);
      }
    };

    window.addEventListener("crowvpn:locale-change", handleLocaleChange);
    return () => window.removeEventListener("crowvpn:locale-change", handleLocaleChange);
  }, []);

  return <Image {...props} alt={alt} src={usesChineseArtwork(locale) ? zhSrc : neutralSrc} />;
}
