import { BRAND_LOGO_SPECS } from "@/data/brandLogoSpecs";

export const dynamic = "force-static";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function escapeSvgText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function logoSvg(label: string, foreground: string, background: string, accent: string) {
  const compact = label.length <= 7;
  const fontSize = label.length > 12 ? 27 : label.length > 9 ? 31 : 35;
  const x = compact ? 92 : 76;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="64" viewBox="0 0 240 64" role="img" aria-label="${escapeSvgText(label)}">
  <rect width="240" height="64" rx="18" fill="${background}"/>
  <circle cx="38" cy="32" r="18" fill="${accent}" opacity="0.16"/>
  <path d="M26 38c9-17 19-22 31-17-7 5-13 13-17 23-4-6-9-7-14-6Z" fill="${accent}"/>
  <path d="M25 41c14-5 26-7 38-2" fill="none" stroke="${foreground}" stroke-width="3" stroke-linecap="round" opacity="0.82"/>
  <text x="${x}" y="41" fill="${foreground}" font-family="Inter, Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800" letter-spacing="${compact ? "-0.5" : "-0.8"}">${escapeSvgText(label)}</text>
</svg>`;
}

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  const key = slug.replace(/\.svg$/i, "") as keyof typeof BRAND_LOGO_SPECS;
  const spec = BRAND_LOGO_SPECS[key] ?? BRAND_LOGO_SPECS.apple;

  return new Response(logoSvg(spec.label, spec.foreground, spec.background, spec.accent), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
