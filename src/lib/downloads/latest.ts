const DOWNLOAD_BASE_URL = "https://cloud.crowmesh.com";
const LATEST_YML_URL = `${DOWNLOAD_BASE_URL}/latest.yml`;
const ANDROID_DOWNLOAD_BASE_URL = `${DOWNLOAD_BASE_URL}/android`;
const ANDROID_VERSION_JSON_URL = `${ANDROID_DOWNLOAD_BASE_URL}/version.json`;
const FALLBACK_ANDROID_APK_URL = `${ANDROID_DOWNLOAD_BASE_URL}/crowvpn-1.1.apk`;

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
};

function buildAndroidDownloadUrl(manifest: AndroidVersionManifest): string {
  if (typeof manifest.file === "string" && manifest.file.trim()) {
    const file = manifest.file.trim();
    return file.startsWith("http") ? file : `${ANDROID_DOWNLOAD_BASE_URL}/${file}`;
  }

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
    fetch(LATEST_YML_URL, {
      next: { revalidate: 300 },
    }),
    fetch(ANDROID_VERSION_JSON_URL, {
      next: { revalidate: 300 },
    }).catch(() => null),
  ]);

  if (!desktopResponse.ok) {
    throw new Error(`latest.yml request failed: ${desktopResponse.status}`);
  }

  const yaml = await desktopResponse.text();
  const version = yaml.match(/^version:\s*([^\s]+)\s*$/m)?.[1];

  if (!version) {
    throw new Error("latest.yml is missing version");
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
