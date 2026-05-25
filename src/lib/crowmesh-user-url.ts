const DEFAULT_USER_BASE_URL = "https://login.crowmesh.com";

const allowedPeriods = new Set(["month", "quarter", "half_year", "year", "two_year", "three_year"]);

export function getCrowmeshUserBaseUrl() {
  const configured = process.env.CROWMESH_USER_BASE_URL?.trim() || process.env.NEXT_PUBLIC_CROWMESH_USER_BASE_URL?.trim();

  if (!configured) return DEFAULT_USER_BASE_URL;

  try {
    const url = new URL(configured);
    return url.origin;
  } catch {
    return DEFAULT_USER_BASE_URL;
  }
}

export function getCrowmeshLoginUrl(redirectPath?: string | null) {
  const baseUrl = getCrowmeshUserBaseUrl();
  if (!redirectPath) return `${baseUrl}/user/login`;

  return `${baseUrl}/user/login?redirect=${encodeURIComponent(redirectPath)}`;
}

export function getCrowmeshBuyPath(planId: string | number, period: string) {
  const normalizedPlanId = String(planId).replace(/\D/g, "");
  const normalizedPeriod = allowedPeriods.has(period) ? period : "month";

  return `/subscription/balance/${normalizedPlanId || "2"}?period=${normalizedPeriod}`;
}

export function getCrowmeshBuyUrl(planId: string | number, period: string) {
  return `${getCrowmeshUserBaseUrl()}${getCrowmeshBuyPath(planId, period)}`;
}
