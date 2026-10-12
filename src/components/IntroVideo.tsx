"use client";

import { useEffect, useRef } from "react";

export function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultPlaybackRate = 0.75;
    video.playbackRate = 0.75;
    const intro = video.closest("#vpn-intro");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    let visible = false;
    const play = () => {
      if (visible && video.paused) void video.play().catch(() => {});
    };
    const syncVisibility = () => {
      // Once revealed, transient cabin updates must never hide the video again.
      if (visible) {
        play();
        return;
      }
      const ready = intro?.getAttribute("data-cabin-ready") !== "false";
      if (!ready) return;
      visible = true;
      animation?.cancel();
      video.style.opacity = "1";
      play();
        if (!preference.matches) {
          animation = video.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 900,
            easing: "ease-out",
          });
        }
    };
    const reset = () => {
      visible = false;
      animation?.cancel();
      video.style.opacity = "0";
      video.pause();
    };
    const onMediaReady = () => {
      video.playbackRate = 0.75;
      syncVisibility();
    };
    const observer = new MutationObserver(syncVisibility);
    if (intro) observer.observe(intro, { attributes: true, attributeFilter: ["data-cabin-ready"] });
    if (intro?.getAttribute("data-cabin-ready") === "false") reset();
    syncVisibility();
    window.addEventListener("crowvpn:cabin-visibility", syncVisibility);
    window.addEventListener("crowvpn:restart-home", reset);
    window.addEventListener("pageshow", syncVisibility);
    video.addEventListener("loadeddata", onMediaReady);
    video.addEventListener("canplay", onMediaReady);
    return () => {
      animation?.cancel();
      observer.disconnect();
      window.removeEventListener("crowvpn:cabin-visibility", syncVisibility);
      window.removeEventListener("crowvpn:restart-home", reset);
      window.removeEventListener("pageshow", syncVisibility);
      video.removeEventListener("loadeddata", onMediaReady);
      video.removeEventListener("canplay", onMediaReady);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="/media/crowvpn-intro-v5.mp4"
      poster="/media/crowvpn-intro-v5-poster.jpg"
      aria-label="CrowVPN 产品展示动画"
      width={1940}
      height={1068}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onLoadedMetadata={(event) => {
        event.currentTarget.playbackRate = 0.75;
      }}
      className="block h-auto w-full rounded-[24px] object-contain max-[720px]:rounded-[20px]"
    />
  );
}
