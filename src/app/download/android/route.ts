import { NextResponse } from "next/server";
import { fetchLatestDownloadLinks } from "@/lib/downloads/latest";

async function redirectToLatestAndroidApk() {
  const links = await fetchLatestDownloadLinks();
  return NextResponse.redirect(links.androidApk, 302);
}

export async function GET() {
  return redirectToLatestAndroidApk();
}

export async function HEAD() {
  return redirectToLatestAndroidApk();
}
