"use client";

import { useCookiePreferences } from "@/components/cookie/CookiePreferencesContext";

export function CookiePreferenceFooterButton({ className }: { className?: string }) {
  const { openModal } = useCookiePreferences();
  return (
    <button type="button" className={className} onClick={openModal}>
      Cookie 偏好
    </button>
  );
}
