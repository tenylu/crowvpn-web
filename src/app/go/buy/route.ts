import { NextResponse } from "next/server";
import { getCrowmeshBuyUrl } from "@/lib/crowmesh-user-url";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const url = new URL(request.url);
  const planId = url.searchParams.get("planId") ?? "";
  const period = url.searchParams.get("period") ?? "month";

  return NextResponse.redirect(getCrowmeshBuyUrl(planId, period));
}
