const DOWNLOAD_BASE_URL = "https://cloud.crowmesh.com";
const LATEST_YML_URL = `${DOWNLOAD_BASE_URL}/latest.yml`;
const ANDROID_DOWNLOAD_BASE_URL = `${DOWNLOAD_BASE_URL}/android`;
const ANDROID_VERSION_JSON_URL = `${ANDROID_DOWNLOAD_BASE_URL}/version.json`;
const FALLBACK_ANDROID_APK_URL = `${ANDROID_DOWNLOAD_BASE_URL}/crowvpn-2.0.apk`;
const FALLBACK_ANDROID_VERSION = "2.0";

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
  build_time?: unknown;
  file?: unknown;
  body?: unknown;
  url?: unknown;
  apk_url?: unknown;
  download_url?: unknown;
  apk?: unknown;
  apkFile?: unknown;
  package_url?: unknown;
};

async function fetchRemote(url: string, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json, text/yaml, text/plain, */*",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

function parseAndroidManifest(raw: unknown): AndroidVersionManifest {
  if (!raw || typeof raw !== "object") return {};

  const record = raw as Record<string, unknown>;
  if (record.data && typeof record.data === "object") {
    return record.data as AndroidVersionManifest;
  }

  return record as AndroidVersionManifest;
}

function normalizeAndroidFileUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;

  const file = value.trim();
  return file.startsWith("http") ? file : `${ANDROID_DOWNLOAD_BASE_URL}/${file.replace(/^\/+/, "")}`;
}

function pickAndroidFileName(manifest: AndroidVersionManifest): string | null {
  const candidates = [manifest.file, manifest.apk, manifest.apkFile];
  for (const candidate of candidates) {
    if (typeof candidate !== "string" || !candidate.trim()) continue;
    const name = candidate.trim();
    if (name.endsWith(".apk")) return name.replace(/^\/+/, "");
  }
  return null;
}

async function verifyApkExists(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export function buildAndroidDownloadUrl(manifest: AndroidVersionManifest): string {
  const explicitUrl =
    normalizeAndroidFileUrl(manifest.download_url) ??
    normalizeAndroidFileUrl(manifest.apk_url) ??
    normalizeAndroidFileUrl(manifest.url) ??
    normalizeAndroidFileUrl(manifest.package_url) ??
    normalizeAndroidFileUrl(manifest.file) ??
    normalizeAndroidFileUrl(manifest.apk) ??
    normalizeAndroidFileUrl(manifest.apkFile);

  if (explicitUrl) return explicitUrl;

  const fileName = pickAndroidFileName(manifest);
  if (fileName) return `${ANDROID_DOWNLOAD_BASE_URL}/${fileName}`;

  if (typeof manifest.version === "string" && manifest.version.trim()) {
    return `${ANDROID_DOWNLOAD_BASE_URL}/crowvpn-${manifest.version.trim()}.apk`;
  }

  return FALLBACK_ANDROID_APK_URL;
}

export async function resolveAndroidDownloadUrl(manifest: AndroidVersionManifest): Promise<string> {
  const primary = buildAndroidDownloadUrl(manifest);
  if (await verifyApkExists(primary)) return primary;

  if (typeof manifest.version === "string" && manifest.version.trim()) {
    const byVersion = `${ANDROID_DOWNLOAD_BASE_URL}/crowvpn-${manifest.version.trim()}.apk`;
    if (byVersion !== primary && (await verifyApkExists(byVersion))) return byVersion;
  }

  if (primary !== FALLBACK_ANDROID_APK_URL && (await verifyApkExists(FALLBACK_ANDROID_APK_URL))) {
    return FALLBACK_ANDROID_APK_URL;
  }

  return primary;
}

export function buildLatestDownloadLinks(
  version: string,
  androidManifest: AndroidVersionManifest = {},
  androidApk = buildAndroidDownloadUrl(androidManifest),
): LatestDownloadLinks {
  const androidVersion =
    typeof androidManifest.version === "string" && androidManifest.version.trim()
      ? androidManifest.version.trim()
      : FALLBACK_ANDROID_VERSION;

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
    androidApk,
    androidVersion,
  };
}

export async function fetchLatestDownloadLinks(): Promise<LatestDownloadLinks> {
  const [desktopResponse, androidResponse] = await Promise.all([
    fetchRemote(LATEST_YML_URL).catch(() => null),
    fetchRemote(ANDROID_VERSION_JSON_URL).catch(() => null),
  ]);

  let version = "2.2.2";

  if (desktopResponse?.ok) {
    const yaml = await desktopResponse.text();
    version = yaml.match(/^version:\s*([^\s]+)\s*$/m)?.[1] ?? version;
  }

  let androidManifest: AndroidVersionManifest = {};

  if (androidResponse?.ok) {
    try {
      androidManifest = parseAndroidManifest(await androidResponse.json());
    } catch {
      androidManifest = {};
    }
  }

  const androidApk = await resolveAndroidDownloadUrl(androidManifest);
  return buildLatestDownloadLinks(version, androidManifest, androidApk);
}
