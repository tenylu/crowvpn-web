import { NextResponse } from "next/server";

type NetworkInfo = {
  ip: string | null;
  isp: string | null;
};

type IpApiResponse = {
  ip?: string;
  org?: string;
  asn?: string;
};

type IpWhoResponse = {
  success?: boolean;
  ip?: string;
  connection?: {
    isp?: string;
    org?: string;
    asn?: string;
  };
};

type IpInfoResponse = {
  ip?: string;
  org?: string;
};

type IpifyResponse = {
  ip?: string;
};

async function fetchWithTimeout(url: string, timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function firstForwardedIp(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function isPublicIp(value: string | null | undefined) {
  if (!value) return false;
  const ip = value.trim().toLowerCase();
  if (!ip) return false;

  if (ip === "::1" || ip === "localhost") return false;
  if (ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) return false;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return false;
  if (ip.startsWith("169.254.")) return false;
  if (ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80:")) return false;

  return true;
}

function publicIp(value: string | null | undefined) {
  return isPublicIp(value) ? value!.trim() : null;
}

function cleanIsp(value: string | null | undefined) {
  return value?.replace(/^AS\d+\s+/i, "").trim() || null;
}

function getIpFromHeaders(request: Request) {
  return publicIp(
    request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      firstForwardedIp(request.headers.get("x-forwarded-for")),
  );
}

async function fetchFromIpApi(): Promise<NetworkInfo | null> {
  const response = await fetchWithTimeout("https://ipapi.co/json/");
  if (!response.ok) return null;

  const data = (await response.json()) as IpApiResponse;
  const isp = [data.org, data.asn].filter(Boolean).join(" ");
  return {
    ip: publicIp(data.ip),
    isp: isp || null,
  };
}

async function fetchFromIpInfo(): Promise<NetworkInfo | null> {
  const response = await fetchWithTimeout("https://ipinfo.io/json");
  if (!response.ok) return null;

  const data = (await response.json()) as IpInfoResponse;
  return {
    ip: publicIp(data.ip),
    isp: cleanIsp(data.org),
  };
}

async function fetchFromIpWho(): Promise<NetworkInfo | null> {
  const response = await fetchWithTimeout("https://ipwho.is/");
  if (!response.ok) return null;

  const data = (await response.json()) as IpWhoResponse;
  if (data.success === false) return null;

  const isp = [data.connection?.isp, data.connection?.org, data.connection?.asn]
    .filter(Boolean)
    .join(" ");
  return {
    ip: publicIp(data.ip),
    isp: isp || null,
  };
}

async function fetchIpOnly(): Promise<string | null> {
  const response = await fetchWithTimeout("https://api.ipify.org?format=json");
  if (!response.ok) return null;

  const data = (await response.json()) as IpifyResponse;
  return publicIp(data.ip);
}

export async function GET(request: Request) {
  const headerIp = getIpFromHeaders(request);
  let resolvedIp: string | null = headerIp;
  let resolvedIsp: string | null = null;

  try {
    const primary = await fetchFromIpApi();
    resolvedIp = primary?.ip ?? resolvedIp;
    resolvedIsp = primary?.isp ?? resolvedIsp;
  } catch {
    // Try the fallback provider below.
  }

  if (!resolvedIp) {
    try {
      resolvedIp = await fetchIpOnly();
    } catch {
      // Continue to ISP fallback.
    }
  }

  if (!resolvedIp || !resolvedIsp) {
    try {
      const fallback = await fetchFromIpInfo();
      resolvedIp = resolvedIp ?? fallback?.ip ?? null;
      resolvedIsp = resolvedIsp ?? fallback?.isp ?? null;
    } catch {
      // Try the final fallback provider below.
    }
  }

  if (!resolvedIp || !resolvedIsp) {
    try {
      const fallback = await fetchFromIpWho();
      resolvedIp = resolvedIp ?? fallback?.ip ?? null;
      resolvedIsp = resolvedIsp ?? fallback?.isp ?? null;
    } catch {
      // Fall through to the best data collected so far.
    }
  }

  return NextResponse.json({
    ip: resolvedIp,
    isp: resolvedIsp,
  });
}
