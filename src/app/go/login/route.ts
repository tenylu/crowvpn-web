import { NextResponse } from "next/server";
import { getCrowmeshLoginUrl } from "@/lib/crowmesh-user-url";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const url = new URL(request.url);
  const redirectPath = url.searchParams.get("redirect");

  return NextResponse.redirect(getCrowmeshLoginUrl(redirectPath));
}
