"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BASE_CURRENCY,
  convertCnyToLocal,
  fetchCnyExchangeRates,
  formatLocalMoney,
  resolveDisplayCurrency,
  type ExchangeRates,
} from "@/lib/pricing/currency";
import { fetchPricingGeo, type PricingGeo } from "@/lib/pricing/geo";

export type PricingLocaleState = {
  status: "loading" | "ready";
  geo: PricingGeo;
  currency: string;
  rates: ExchangeRates;
  formatPrice: (cny: number) => string;
};

const DEFAULT_GEO: PricingGeo = {
  countryCode: "CN",
  countryName: "中国",
  currency: BASE_CURRENCY,
};

export function usePricingLocale(): PricingLocaleState {
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [geo, setGeo] = useState<PricingGeo>(DEFAULT_GEO);
  const [rates, setRates] = useState<ExchangeRates>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [geoResult, ratesResult] = await Promise.all([fetchPricingGeo(), fetchCnyExchangeRates()]);
        if (cancelled) return;
        setGeo(geoResult);
        setRates(ratesResult);
      } catch {
        if (!cancelled) {
          setGeo(DEFAULT_GEO);
          setRates({});
        }
      } finally {
        if (!cancelled) setStatus("ready");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const currency = resolveDisplayCurrency(geo.currency, rates);

  const formatPrice = useMemo(() => {
    return (cny: number) => {
      const local = convertCnyToLocal(cny, currency, rates);
      return formatLocalMoney(local, currency);
    };
  }, [currency, rates]);

  return {
    status,
    geo,
    currency,
    rates,
    formatPrice,
  };
}
