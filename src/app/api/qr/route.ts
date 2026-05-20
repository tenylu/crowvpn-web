import { NextResponse } from "next/server";

const QR_SERVICE_URL = "https://api.qrserver.com/v1/create-qr-code/";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("data");

  if (!data) {
    return NextResponse.json({ error: "missing qr data" }, { status: 400 });
  }

  const response = await fetch(
    `${QR_SERVICE_URL}?size=220x220&margin=12&data=${encodeURIComponent(data)}`,
    { next: { revalidate: 300 } },
  );

  if (!response.ok) {
    return NextResponse.json({ error: "qr generation failed" }, { status: 502 });
  }

  return new NextResponse(await response.arrayBuffer(), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": response.headers.get("content-type") ?? "image/png",
    },
  });
}
