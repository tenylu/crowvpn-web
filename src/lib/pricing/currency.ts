export type ExchangeRates = Record<string, number>;

const ZERO_DECIMAL_CURRENCIES = new Set(["JPY", "KRW", "VND", "IDR", "CLP"]);

/** 官方定价基准货币（人民币） */
export const BASE_CURRENCY = "CNY";

const CURRENCY_LOCALES: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  CNY: "zh-CN",
  JPY: "ja-JP",
  KRW: "ko-KR",
  TWD: "zh-TW",
  HKD: "zh-HK",
  SGD: "en-SG",
  AUD: "en-AU",
  CAD: "en-CA",
  INR: "en-IN",
  BRL: "pt-BR",
  MXN: "es-MX",
  THB: "th-TH",
  MYR: "ms-MY",
  PHP: "en-PH",
  IDR: "id-ID",
  VND: "vi-VN",
  CHF: "de-CH",
  SEK: "sv-SE",
  NOK: "nb-NO",
  DKK: "da-DK",
  PLN: "pl-PL",
  CZK: "cs-CZ",
  HUF: "hu-HU",
  TRY: "tr-TR",
  AED: "ar-AE",
  SAR: "ar-SA",
  ILS: "he-IL",
  ZAR: "en-ZA",
  NZD: "en-NZ",
  RUB: "ru-RU",
};

/** Frankfurter 不可用时的近似汇率：1 CNY → 目标货币 */
export const FALLBACK_RATES_FROM_CNY: ExchangeRates = {
  USD: 0.14,
  EUR: 0.13,
  GBP: 0.11,
  SGD: 0.19,
  HKD: 1.08,
  TWD: 4.35,
  JPY: 21,
  KRW: 190,
  AUD: 0.21,
  CAD: 0.19,
  MYR: 0.65,
  THB: 4.9,
  PHP: 7.9,
  INR: 11.6,
  BRL: 0.78,
  MXN: 2.4,
  VND: 3500,
  IDR: 2200,
};

export function localeForCurrency(currency: string): string {
  return CURRENCY_LOCALES[currency] ?? "en-US";
}

export function convertCnyToLocal(cny: number, currency: string, rates: ExchangeRates): number {
  if (currency === BASE_CURRENCY) return cny;
  const rate = rates[currency] ?? FALLBACK_RATES_FROM_CNY[currency];
  if (!rate || rate <= 0) return cny;
  return cny * rate;
}

export function formatLocalMoney(amount: number, currency: string): string {
  const locale = localeForCurrency(currency);
  const zeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency);
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: zeroDecimal ? 0 : 2,
    maximumFractionDigits: zeroDecimal ? 0 : 2,
  }).format(amount);
  return `${currency} ${formatted}`;
}

export async function fetchCnyExchangeRates(): Promise<ExchangeRates> {
  const res = await fetch("https://api.frankfurter.app/latest?from=CNY", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("exchange rates fetch failed");
  const data = (await res.json()) as { rates?: ExchangeRates };
  return { ...FALLBACK_RATES_FROM_CNY, ...data.rates };
}

export function resolveDisplayCurrency(geoCurrency: string, rates: ExchangeRates): string {
  if (geoCurrency === BASE_CURRENCY) return BASE_CURRENCY;
  if (rates[geoCurrency] || FALLBACK_RATES_FROM_CNY[geoCurrency]) return geoCurrency;
  return BASE_CURRENCY;
}
