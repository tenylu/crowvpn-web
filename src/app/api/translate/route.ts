import { NextResponse } from "next/server";
import { isLocaleCode, type LocaleCode } from "@/i18n/locales";

const targetLocales: Partial<Record<LocaleCode, string>> = {
  en: "en",
  cs: "cs",
  de: "de",
  es: "es",
  "es-419": "es",
  fr: "fr",
  lt: "lt",
  ja: "ja",
  ko: "ko",
  it: "it",
  pl: "pl",
  nl: "nl",
  pt: "pt",
  sv: "sv",
  "zh-HK": "zh-TW",
};

const translationCache = new Map<string, string>();
const currencyPattern =
  /\b(?:CNY|USD|EUR|GBP|JPY|HKD|TWD|AUD|CAD|SGD|KRW)\b|[¥$€£₩]|(?:\b(?:CNY|USD|EUR|GBP|JPY|HKD|TWD|AUD|CAD|SGD|KRW)\s*)?[¥$€£₩]\s?[\d,]+(?:\.\d+)?/gi;

type TranslateRequest = {
  locale?: string;
  texts?: unknown;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function protectCurrencyUnits(text: string) {
  const tokens: string[] = [];
  const protectedText = text.replace(currencyPattern, (match) => {
    const token = `__CROWVPN_CURRENCY_${tokens.length}__`;
    tokens.push(match);
    return token;
  });

  return { protectedText, tokens };
}

function restoreCurrencyUnits(text: string, tokens: string[]) {
  return tokens.reduce(
    (result, token, index) => result.replaceAll(`__CROWVPN_CURRENCY_${index}__`, token),
    text,
  );
}

async function translateText(text: string, target: string) {
  const cacheKey = `${target}:${text}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;
  const { protectedText, tokens } = protectCurrencyUnits(text);

  const params = new URLSearchParams({
    client: "gtx",
    sl: "auto",
    tl: target,
    dt: "t",
    q: protectedText,
  });
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`, {
    headers: { "User-Agent": "CrowVPN-Web/1.0" },
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!response.ok) throw new Error("translation request failed");

  const payload = (await response.json()) as Array<Array<Array<string>>>;
  const translated = payload[0]?.map((part) => part[0]).join("").trim();
  const result = translated ? restoreCurrencyUnits(translated, tokens) : text;
  translationCache.set(cacheKey, result);
  return result;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TranslateRequest;
    const locale = body.locale;
    if (locale == null || !isLocaleCode(locale)) {
      return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
    }

    const target = targetLocales[locale];
    if (!target) {
      return NextResponse.json({ translations: {} });
    }

    const texts = Array.isArray(body.texts)
      ? [...new Set(body.texts.map(cleanText).filter((text) => text.length > 0 && text.length <= 1200))]
      : [];

    const limitedTexts = texts.slice(0, 80);
    const pairs = await Promise.all(
      limitedTexts.map(async (text) => {
        try {
          return [text, await translateText(text, target)] as const;
        } catch {
          return [text, text] as const;
        }
      }),
    );

    return NextResponse.json({ translations: Object.fromEntries(pairs) });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
