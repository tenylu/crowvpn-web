"use client";

import { usePathname } from "next/navigation";
import { CookiePreferencesProvider } from "@/components/cookie/CookiePreferencesContext";
import { LocaleTextBridge } from "@/components/LocaleTextBridge";
import { ZohoSalesIQ } from "@/components/ZohoSalesIQ";

/** The standalone auth demo does not load marketing widgets or cookie overlays. */
export function SiteExperience({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return <>{children}</>;
  return <CookiePreferencesProvider><LocaleTextBridge />{children}<ZohoSalesIQ /></CookiePreferencesProvider>;
}
