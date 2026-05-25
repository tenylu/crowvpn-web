const DOWNLOAD_BASE_URL = "https://cloud.crowmesh.com";
const LATEST_YML_URL = `${DOWNLOAD_BASE_URL}/latest.yml`;
const ANDROID_DOWNLOAD_BASE_URL = `${DOWNLOAD_BASE_URL}/android`;
const ANDROID_VERSION_JSON_URL = `${ANDROID_DOWNLOAD_BASE_URL}/version.json`;
const FALLBACK_ANDROID_APK_URL = `${ANDROID_DOWNLOAD_BASE_URL}/crowvpn-1.1.apk`;

export const ANDROID_LATEST_DOWNLOAD_PATH = "/download/android";

export type LatestDownloadLinks = {
  version: string;
  macApple: string;
  macIntel: string;
  windowsX64: string;
  windowsArm64: string;
  linuxAmd64Deb: string;
  linuxX8664Rpm: string;
  linuxAarch64Rpm: string;
  linuxArm64Deb: string;
  androidApk: string;
  androidVersion: string;
};

type AndroidVersionManifest = {
  version?: unknown;
  file?: unknown;
  url?: unknown;
  apk_url?: unknown;
  download_url?: unknown;
};

async function fetchWithTimeout(url: string, timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function normalizeAndroidFileUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;

  const file = value.trim();
  return file.startsWith("http") ? file : `${ANDROID_DOWNLOAD_BASE_URL}/${file.replace(/^\/+/, "")}`;
}

function buildAndroidDownloadUrl(manifest: AndroidVersionManifest): string {
  const explicitUrl =
    normalizeAndroidFileUrl(manifest.download_url) ??
    normalizeAndroidFileUrl(manifest.apk_url) ??
    normalizeAndroidFileUrl(manifest.url) ??
    normalizeAndroidFileUrl(manifest.file);

  if (explicitUrl) return explicitUrl;

  if (typeof manifest.version === "string" && manifest.version.trim()) {
    return `${ANDROID_DOWNLOAD_BASE_URL}/crowvpn-${manifest.version.trim()}.apk`;
  }

  return FALLBACK_ANDROID_APK_URL;
}

export function buildLatestDownloadLinks(version: string, androidManifest: AndroidVersionManifest = {}): LatestDownloadLinks {
  return {
    version,
    macApple: `${DOWNLOAD_BASE_URL}/crowvpn-apple-${version}.dmg`,
    macIntel: `${DOWNLOAD_BASE_URL}/crowvpn-intel-${version}.dmg`,
    windowsX64: `${DOWNLOAD_BASE_URL}/crowvpn-windows-${version}-x64-setup.exe`,
    windowsArm64: `${DOWNLOAD_BASE_URL}/crowvpn-windows-${version}-arm64-setup.exe`,
    linuxAmd64Deb: `${DOWNLOAD_BASE_URL}/crowvpn-linux-${version}-amd64.deb`,
    linuxX8664Rpm: `${DOWNLOAD_BASE_URL}/crowvpn-linux-${version}-x86_64.rpm`,
    linuxAarch64Rpm: `${DOWNLOAD_BASE_URL}/crowvpn-linux-${version}-aarch64.rpm`,
    linuxArm64Deb: `${DOWNLOAD_BASE_URL}/crowvpn-linux-${version}-arm64.deb`,
    androidApk: buildAndroidDownloadUrl(androidManifest),
    androidVersion:
      typeof androidManifest.version === "string" && androidManifest.version.trim()
        ? androidManifest.version.trim()
        : "1.1",
  };
}

export async function fetchLatestDownloadLinks(): Promise<LatestDownloadLinks> {
  const [desktopResponse, androidResponse] = await Promise.all([
    fetchWithTimeout(LATEST_YML_URL).catch(() => null),
    fetchWithTimeout(ANDROID_VERSION_JSON_URL).catch(() => null),
  ]);

  let version = "2.2.0";

  if (desktopResponse?.ok) {
    const yaml = await desktopResponse.text();
    version = yaml.match(/^version:\s*([^\s]+)\s*$/m)?.[1] ?? version;
  }

  let androidManifest: AndroidVersionManifest = {};

  if (androidResponse?.ok) {
    try {
      androidManifest = (await androidResponse.json()) as AndroidVersionManifest;
    } catch {
      androidManifest = {};
    }
  }

  return buildLatestDownloadLinks(version, androidManifest);
}
