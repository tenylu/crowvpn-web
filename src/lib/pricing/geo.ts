export type PricingGeo = {
  countryCode: string;
  countryName: string;
  currency: string;
};

const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD",
  CN: "CNY",
  HK: "HKD",
  TW: "TWD",
  JP: "JPY",
  KR: "KRW",
  GB: "GBP",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  AU: "AUD",
  CA: "CAD",
  SG: "SGD",
  IN: "INR",
  BR: "BRL",
  MX: "MXN",
  TH: "THB",
  MY: "MYR",
  PH: "PHP",
  ID: "IDR",
  VN: "VND",
  CH: "CHF",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  PL: "PLN",
  RU: "RUB",
  AE: "AED",
  SA: "SAR",
  NZ: "NZD",
  IL: "ILS",
  ZA: "ZAR",
  TR: "TRY",
};

const COUNTRY_NAME_ZH: Record<string, string> = {
  US: "美国",
  CN: "中国",
  HK: "中国香港",
  TW: "中国台湾",
  JP: "日本",
  KR: "韩国",
  GB: "英国",
  SG: "新加坡",
  MY: "马来西亚",
  TH: "泰国",
  AU: "澳大利亚",
  CA: "加拿大",
  DE: "德国",
  FR: "法国",
  IN: "印度",
  ID: "印度尼西亚",
  PH: "菲律宾",
  VN: "越南",
};

export function currencyForCountry(countryCode: string): string {
  return COUNTRY_CURRENCY[countryCode.toUpperCase()] ?? "USD";
}

export function countryNameZh(countryCode: string, fallback?: string): string {
  return COUNTRY_NAME_ZH[countryCode.toUpperCase()] ?? fallback ?? countryCode;
}

export async function fetchPricingGeo(): Promise<PricingGeo> {
  const res = await fetch("/api/pricing/geo", { cache: "no-store" });
  if (!res.ok) throw new Error("geo api failed");
  return (await res.json()) as PricingGeo;
}
