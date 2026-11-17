import { NextResponse } from "next/server";
import { getCrowmeshBuyUrl } from "@/lib/crowmesh-user-url";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const url = new URL(request.url);
  const planId = url.searchParams.get("planId") ?? "";
  const period = url.searchParams.get("period") ?? "month";
  const seatsRaw = url.searchParams.get("seats");
  const seats = seatsRaw ? Number(seatsRaw) : undefined;
  const team = url.searchParams.get("team") === "1";

  return NextResponse.redirect(
    getCrowmeshBuyUrl(planId, period, {
      team,
      seats: Number.isFinite(seats) ? seats : undefined,
    }),
  );
}
