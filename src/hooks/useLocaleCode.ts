"use client";

import { useEffect, useState } from "react";
import { defaultLocale, isLocaleCode, type LocaleCode } from "@/i18n/locales";

export function readStoredLocale(): LocaleCode {
  if (typeof window === "undefined") return defaultLocale;
  const stored = window.localStorage?.getItem("crowvpn-language");
  return isLocaleCode(stored) ? stored : defaultLocale;
}

export function readLocaleFromEvent(event: Event): LocaleCode | null {
  const detail = (event as CustomEvent<LocaleCode | { locale?: string }>).detail;
  const nextLocale = typeof detail === "string" ? detail : detail?.locale;
  return nextLocale && isLocaleCode(nextLocale) ? nextLocale : null;
}

export function useLocaleCode() {
  const [locale, setLocale] = useState<LocaleCode>(readStoredLocale);

  useEffect(() => {
    const handleLocaleChange = (event: Event) => {
      const nextLocale = readLocaleFromEvent(event);
      if (nextLocale) setLocale(nextLocale);
    };

    window.addEventListener("crowvpn:locale-change", handleLocaleChange);
    return () => window.removeEventListener("crowvpn:locale-change", handleLocaleChange);
  }, []);

  return locale;
}
