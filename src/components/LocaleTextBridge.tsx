"use client";

import { useEffect } from "react";
import { defaultLocale, getLocaleMeta, isLocaleCode, type LocaleCode } from "@/i18n/locales";
import { getMessage } from "@/i18n/messages";

const ORIGINAL_TEXT = Symbol("crowvpnOriginalText");
const ORIGINAL_ATTR_PREFIX = "data-crowvpn-original-";
const TEXT_ATTRIBUTES = ["placeholder", "aria-label", "alt", "title"] as const;
const translationCache = new Map<string, string>();
const pendingTranslations = new Map<LocaleCode, Set<string>>();
let pendingTimer = 0;

type TranslatableText = Text & {
  [ORIGINAL_TEXT]?: string;
};

function normalizeText(value: string) {
  return value.replace(/\s+/g, "").replace(/[：:，,。.!！？?、·\-"“”‘’（）()]/g, "");
}

function hasCjkText(value: string) {
  return /[\u3400-\u9fff]/.test(value);
}

function needsMachineTranslation(source: string, translated: string, locale: LocaleCode) {
  if (locale === defaultLocale || locale === "zh-HK") return false;
  if (!source.trim()) return false;
  if (translated === source) return true;
  if (hasCjkText(translated)) return true;
  return false;
}

function cacheKey(locale: LocaleCode, source: string) {
  return `${locale}:${source}`;
}

function queueMachineTranslation(source: string, locale: LocaleCode) {
  if (locale === defaultLocale || locale === "zh-HK") return;
  if (!source || source.length > 1200) return;
  if (translationCache.has(cacheKey(locale, source))) return;

  const bucket = pendingTranslations.get(locale) ?? new Set<string>();
  bucket.add(source);
  pendingTranslations.set(locale, bucket);

  if (pendingTimer) return;
  pendingTimer = window.setTimeout(flushMachineTranslations, 120);
}

async function flushMachineTranslations() {
  pendingTimer = 0;
  const batches = [...pendingTranslations.entries()].map(([locale, texts]) => [locale, [...texts]] as const);
  pendingTranslations.clear();

  await Promise.all(
    batches.map(async ([locale, texts]) => {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, texts }),
        });
        if (!response.ok) return;
        const payload = (await response.json()) as { translations?: Record<string, string> };
        Object.entries(payload.translations ?? {}).forEach(([source, translated]) => {
          translationCache.set(cacheKey(locale, source), translated);
        });
      } catch {
        return;
      }
    }),
  );

  const latestLocale = window.localStorage.getItem("crowvpn-language");
  if (isLocaleCode(latestLocale)) {
    translateDocument(latestLocale);
  }
}

function translateValue(value: string, locale: LocaleCode) {
  if (locale === defaultLocale) return value;

  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const source = value.trim();
  if (!source) return value;

  const cached = translationCache.get(cacheKey(locale, source));
  if (cached) return `${leading}${cached}${trailing}`;

  const direct = getMessage(locale, source);
  if (direct !== source) {
    if (needsMachineTranslation(source, direct, locale)) {
      queueMachineTranslation(source, locale);
    }
    return `${leading}${direct}${trailing}`;
  }

  const normalizedSource = normalizeText(source);
  const normalized = getMessage(locale, normalizedSource);
  if (normalized !== normalizedSource) {
    if (needsMachineTranslation(source, normalized, locale)) {
      queueMachineTranslation(source, locale);
    }
    return `${leading}${normalized}${trailing}`;
  }

  queueMachineTranslation(source, locale);
  return value;
}

function shouldSkipElement(element: Element | null) {
  if (!element) return true;
  if (element.closest("[data-no-translate], .notranslate")) return true;
  if (element.closest("select")) return true;

  const tagName = element.tagName.toLowerCase();
  return ["script", "style", "noscript", "code", "pre", "textarea", "select"].includes(tagName);
}

function translateTextNode(node: Text, locale: LocaleCode) {
  const textNode = node as TranslatableText;
  if (shouldSkipElement(textNode.parentElement)) return;

  const current = textNode.nodeValue ?? "";
  if (!textNode[ORIGINAL_TEXT]) {
    textNode[ORIGINAL_TEXT] = current;
  }

  const translated = translateValue(textNode[ORIGINAL_TEXT], locale);
  if (textNode.nodeValue !== translated) {
    textNode.nodeValue = translated;
  }
}

function translateElementAttributes(element: Element, locale: LocaleCode) {
  if (shouldSkipElement(element)) return;

  TEXT_ATTRIBUTES.forEach((attribute) => {
    const value = element.getAttribute(attribute);
    if (!value) return;

    const originalAttribute = `${ORIGINAL_ATTR_PREFIX}${attribute}`;
    const original = element.getAttribute(originalAttribute) ?? value;
    if (!element.hasAttribute(originalAttribute)) {
      element.setAttribute(originalAttribute, original);
    }

    element.setAttribute(attribute, translateValue(original, locale));
  });
}

function translateDocument(locale: LocaleCode) {
  document.documentElement.lang = getLocaleMeta(locale).htmlLang;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    translateTextNode(node as Text, locale);
    node = walker.nextNode();
  }

  document.querySelectorAll("*").forEach((element) => translateElementAttributes(element, locale));
}

export function applyLocale(locale: LocaleCode) {
  window.localStorage.setItem("crowvpn-language", locale);
  window.dispatchEvent(new CustomEvent("crowvpn:locale-change", { detail: locale }));
  translateDocument(locale);
}

export function LocaleTextBridge() {
  useEffect(() => {
    const storedLocale = window.localStorage.getItem("crowvpn-language");
    const locale = isLocaleCode(storedLocale) ? storedLocale : defaultLocale;

    translateDocument(locale);

    const onLocaleChange = (event: Event) => {
      const nextLocale = (event as CustomEvent<LocaleCode>).detail;
      if (isLocaleCode(nextLocale)) {
        translateDocument(nextLocale);
      }
    };

    let animationFrame = 0;
    const translateLatest = () => {
      animationFrame = 0;
      const latestLocale = window.localStorage.getItem("crowvpn-language");
      translateDocument(isLocaleCode(latestLocale) ? latestLocale : defaultLocale);
    };

    const observer = new MutationObserver(() => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(translateLatest);
    });

    window.addEventListener("crowvpn:locale-change", onLocaleChange);
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });

    return () => {
      window.removeEventListener("crowvpn:locale-change", onLocaleChange);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, []);

  return null;
}
