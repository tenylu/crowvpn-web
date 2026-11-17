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

export function getCrowmeshBuyPath(
  planId: string | number,
  period: string,
  options?: { seats?: number; team?: boolean },
) {
  const normalizedPlanId = String(planId).replace(/\D/g, "");
  const normalizedPeriod = allowedPeriods.has(period) ? period : "month";
  const query = new URLSearchParams({ period: normalizedPeriod });

  if (options?.team) query.set("team", "1");
  if (options?.seats && options.seats > 0) query.set("seats", String(options.seats));

  return `/subscription/balance/${normalizedPlanId || "2"}?${query.toString()}`;
}

export function getCrowmeshBuyUrl(
  planId: string | number,
  period: string,
  options?: { seats?: number; team?: boolean },
) {
  return `${getCrowmeshUserBaseUrl()}${getCrowmeshBuyPath(planId, period, options)}`;
}
