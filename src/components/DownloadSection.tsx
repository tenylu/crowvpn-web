"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AndroidDownloadDialog,
  LinuxDownloadDialog,
  MacDownloadDialog,
  WindowsDownloadDialog,
} from "@/components/DownloadPageContent";
import { downloadItems } from "@/data/downloadPlatforms";
import {
  ANDROID_LATEST_DOWNLOAD_PATH,
  buildLatestDownloadLinks,
  type LatestDownloadLinks,
} from "@/lib/downloads/latest";

const FALLBACK_DOWNLOAD_LINKS = buildLatestDownloadLinks("2.2.2");

export function DownloadSection() {
  const [latestDownloadLinks, setLatestDownloadLinks] = useState<LatestDownloadLinks>(FALLBACK_DOWNLOAD_LINKS);
  const [windowsDialogOpen, setWindowsDialogOpen] = useState(false);
  const [macDialogOpen, setMacDialogOpen] = useState(false);
  const [linuxDialogOpen, setLinuxDialogOpen] = useState(false);
  const [androidDialogOpen, setAndroidDialogOpen] = useState(false);
  const downloadPlatforms = downloadItems.slice(0, 4).filter((item) => item.src);
  const androidDownloadHref = ANDROID_LATEST_DOWNLOAD_PATH;

  useEffect(() => {
    let cancelled = false;

    async function loadLatestDownloadLinks() {
      try {
        const response = await fetch("/api/downloads/latest", { cache: "no-store" });
        if (!response.ok) return;
        const links = (await response.json()) as LatestDownloadLinks;
        if (!cancelled) setLatestDownloadLinks(links);
      } catch {
        // Keep the bundled fallback links if the latest endpoint is unavailable.
      }
    }

    loadLatestDownloadLinks();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleAndroidDownload() {
    const target = latestDownloadLinks.androidApk || androidDownloadHref;

    if (window.matchMedia("(max-width: 639px)").matches) {
      window.location.assign(target);
      return;
    }

    setAndroidDialogOpen(true);
  }

  function handlePlatformClick(id: string) {
    if (id === "windows") {
      setWindowsDialogOpen(true);
    } else if (id === "macos") {
      setMacDialogOpen(true);
    } else if (id === "linux") {
      setLinuxDialogOpen(true);
    } else if (id === "android") {
      handleAndroidDownload();
    }
  }

  return (
    <>
      <section id="download" className="scroll-mt-24 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-[var(--page-max)] px-6 text-center lg:px-10">
          <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
            获取适用于您所有设备的 CrowVPN
          </h2>
          <p className="mt-4 text-base text-[var(--muted)] sm:text-lg">使用 CrowVPN 保护您的所有连接：</p>

          <ul className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-5">
            {downloadPlatforms.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => handlePlatformClick(p.id)}
                  className="flex w-[108px] flex-col items-center gap-3 rounded-2xl bg-[#eceef1] px-3 py-5 transition hover:bg-[#e3e6eb] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2 sm:w-[118px]"
                >
                  <span className="flex h-10 w-10 items-center justify-center">
                    <Image
                      src={p.src ?? ""}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                      unoptimized
                    />
                  </span>
                  <span className="text-xs font-semibold text-[#171717]">{p.label.replace(/ 应用程序$| APK$/, "")}</span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-12 max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            CrowVPN 为 Windows、macOS、Linux、Android 与 iOS 提供一致的加密连接体验。无论你在家、在旅途或在公共网络环境，都能用同一套账号在多终端保持更安心的上网方式。
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/download"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent-primary)] px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-primary-hover)]"
            >
              获取 CrowVPN
            </Link>
          </div>
        </div>
      </section>
      <WindowsDownloadDialog
        links={latestDownloadLinks}
        open={windowsDialogOpen}
        onClose={() => setWindowsDialogOpen(false)}
      />
      <MacDownloadDialog
        links={latestDownloadLinks}
        open={macDialogOpen}
        onClose={() => setMacDialogOpen(false)}
      />
      <LinuxDownloadDialog
        links={latestDownloadLinks}
        open={linuxDialogOpen}
        onClose={() => setLinuxDialogOpen(false)}
      />
      <AndroidDownloadDialog
        href={androidDownloadHref}
        apkUrl={latestDownloadLinks.androidApk}
        androidVersion={latestDownloadLinks.androidVersion}
        open={androidDialogOpen}
        onClose={() => setAndroidDialogOpen(false)}
      />
    </>
  );
}
