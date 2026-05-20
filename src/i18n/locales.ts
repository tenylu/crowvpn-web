export const localeOptions = [
  { value: "en", label: "English", htmlLang: "en" },
  { value: "cs", label: "Čeština", htmlLang: "cs" },
  { value: "de", label: "Deutsch", htmlLang: "de" },
  { value: "es", label: "Español", htmlLang: "es" },
  { value: "es-419", label: "Español (LATAM)", htmlLang: "es-419" },
  { value: "fr", label: "Français", htmlLang: "fr" },
  { value: "lt", label: "Lietuvių", htmlLang: "lt" },
  { value: "ja", label: "日本語", htmlLang: "ja" },
  { value: "ko", label: "한국어", htmlLang: "ko" },
  { value: "it", label: "Italiano", htmlLang: "it" },
  { value: "pl", label: "Polski", htmlLang: "pl" },
  { value: "nl", label: "Nederlands", htmlLang: "nl" },
  { value: "pt", label: "Português", htmlLang: "pt" },
  { value: "sv", label: "Svenska", htmlLang: "sv" },
  { value: "zh-CN", label: "简体中文", htmlLang: "zh-CN" },
  { value: "zh-HK", label: "繁體中文 (香港)", htmlLang: "zh-HK" },
] as const;

export type LocaleCode = (typeof localeOptions)[number]["value"];

export const defaultLocale: LocaleCode = "zh-CN";

export function isLocaleCode(value: string | null): value is LocaleCode {
  return localeOptions.some((locale) => locale.value === value);
}

export function getLocaleMeta(locale: LocaleCode) {
  return localeOptions.find((item) => item.value === locale) ?? localeOptions[localeOptions.length - 2];
}
