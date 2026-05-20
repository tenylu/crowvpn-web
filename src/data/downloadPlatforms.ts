/** 客户端安装包与商店入口统一域名（与结账/官网一致） */
export const CROWVPN_CLIENT_HOME = "https://crowvpn.com";

/** 用户中心登录（与结账 redirect 同源） */
export const CROWMESH_USER_LOGIN_URL = "https://user.crowmesh.com/user/login";

export const DOWNLOAD_PLATFORMS_SECTION_ID = "download-platforms";

export type DownloadItemKind = "app" | "extension";

export type DownloadItem = {
  id: string;
  kind: DownloadItemKind;
  /** 卡片第二行展示名，如「Windows 应用程序」 */
  label: string;
  href: string;
  /** 平台 logo（应用） */
  src?: string;
  /** 扩展等无静态图时使用 IconPark 标识 */
  iconKey?: "chrome" | "firefox" | "edge";
};

export const downloadItems: DownloadItem[] = [
  {
    id: "windows",
    kind: "app",
    label: "Windows 应用程序",
    href: CROWVPN_CLIENT_HOME,
    src: "/images/win.svg",
  },
  {
    id: "macos",
    kind: "app",
    label: "macOS 应用程序",
    href: CROWVPN_CLIENT_HOME,
    src: "/images/mac.svg",
  },
  {
    id: "linux",
    kind: "app",
    label: "Linux 应用程序",
    href: CROWVPN_CLIENT_HOME,
    src: "/images/liunx.svg",
  },
  {
    id: "android",
    kind: "app",
    label: "Android APK",
    href: CROWVPN_CLIENT_HOME,
    src: "/images/android.svg",
  },
  {
    id: "ios",
    kind: "app",
    label: "iOS 应用程序",
    href: CROWVPN_CLIENT_HOME,
    src: "/images/ios.svg",
  },
  {
    id: "chrome",
    kind: "extension",
    label: "Chrome 扩展程序",
    href: CROWVPN_CLIENT_HOME,
    iconKey: "chrome",
  },
  {
    id: "firefox",
    kind: "extension",
    label: "Firefox 扩展程序",
    href: CROWVPN_CLIENT_HOME,
    iconKey: "firefox",
  },
  {
    id: "edge",
    kind: "extension",
    label: "Edge 扩展程序",
    href: CROWVPN_CLIENT_HOME,
    iconKey: "edge",
  },
];

/** 首页等平台徽标条（仅客户端应用） */
export const downloadPlatforms = downloadItems.filter((item) => item.kind === "app" && item.src) as Array<
  DownloadItem & { src: string }
>;
