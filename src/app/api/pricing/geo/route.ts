import { NextResponse } from "next/server";
import { currencyForCountry, countryNameZh, type PricingGeo } from "@/lib/pricing/geo";

type IpWhoResponse = {
  success?: boolean;
  country_code?: string;
  country?: string;
  currency?: { code?: string };
};

async function fetchGeoFromIpWho(): Promise<PricingGeo | null> {
  const res = await fetch("https://ipwho.is/", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as IpWhoResponse;
  if (!data.success || !data.country_code) return null;
  const countryCode = data.country_code.toUpperCase();
  return {
    countryCode,
    countryName: countryNameZh(countryCode, data.country ?? countryCode),
    currency: data.currency?.code?.toUpperCase() ?? currencyForCountry(countryCode),
  };
}

export async function GET(request: Request) {
  const countryHeader =
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("x-country-code");

  if (countryHeader && countryHeader !== "XX" && countryHeader.length === 2) {
    const countryCode = countryHeader.toUpperCase();
    const geo: PricingGeo = {
      countryCode,
      countryName: countryNameZh(countryCode),
      currency: currencyForCountry(countryCode),
    };
    return NextResponse.json(geo);
  }

  const geo = await fetchGeoFromIpWho();
  if (geo) return NextResponse.json(geo);

  return NextResponse.json({
    countryCode: "CN",
    countryName: "中国",
    currency: "CNY",
  } satisfies PricingGeo);
}
