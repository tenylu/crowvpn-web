import { NextResponse } from "next/server";
import { fetchLatestDownloadLinks } from "@/lib/downloads/latest";

export async function GET() {
  try {
    return NextResponse.json(await fetchLatestDownloadLinks());
  } catch {
    return NextResponse.json({ error: "latest download links unavailable" }, { status: 502 });
  }
}
