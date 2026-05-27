import { NextResponse } from "next/server";
import { fetchLatestDownloadLinks } from "@/lib/downloads/latest";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const links = await fetchLatestDownloadLinks();
    return NextResponse.json(links, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json({ error: "latest download links unavailable" }, { status: 502 });
  }
}
