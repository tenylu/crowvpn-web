"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motionPreference";
import styles from "./FlyingCrow.module.css";

/**
 * MP4 左半为颜色，右半为离线生成的遮罩。
 * 在 canvas 合成透明帧，兼容不支持透明 WebM 的浏览器，并保留眼白。
 * 此素材只包含扇翅，不能用于独立的左右眼球时间轴。
 */
export function FlyingCrow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const idleRef = useRef<HTMLVideoElement>(null);
  const takeoffRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const intro = videoRef.current;
    const idle = idleRef.current;
    const takeoff = takeoffRef.current;
    if (!root || !canvas || !intro || !idle || !takeoff) return;
    let video = intro;
    const context = canvas.getContext("2d");
    const buffer = document.createElement("canvas");
    const resolution = 960;
    buffer.width = resolution*2;
    buffer.height = resolution;
    const decode = buffer.getContext("2d", { willReadFrequently: true });
    if (!context || !decode) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => prefersReducedMotion(reduce);
    let visible = false;
    let disposed = false;
    let blocked = false;
    let frame = 0;
    let usesVideoCallback = false;
    let lastTime = -1;
    const poster = root.querySelector("img");
    let following = false;
    let targetX = 0, targetY = 0, gazeX = 0, gazeY = 0;
    let idleTimer = 0;
    let lastGazeFrame = 0;
    let inputAttached = false;
    let departure = 0;
    let seekProgress = 0;
    let lastSeekFrame = 0;
    let paintedProgress = 0;
    const journey = root.closest("section");
    const publishProgress = () => {
      if (!journey) return;
      journey.dataset.crowProgress = String(seekProgress);
      journey.dispatchEvent(new Event("crow-progress"));
    };

    // Eye geometry stays in 480-unit design coordinates, rasterized at native
    // 960px resolution (2x supersampling) for smooth pupils and circular edges.
    const paintEyes = () => {
      context.save();
      context.scale(resolution/480, resolution/480);
      // Match the source eye whites (~40–42 design pixels across); the old
      // 46–48px circles visibly enlarged both eyes at the landing handoff.
      for (const [x, y, radius] of [[230, 156, 20], [306, 182, 21]]) {
        context.save();
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI*2);
        context.clip();
        const white = context.createRadialGradient(x-6, y-8, 2, x, y, 26);
        white.addColorStop(0, "#fff"); white.addColorStop(.65, "#f2f3f2"); white.addColorStop(1, "#afb6b8");
        context.fillStyle = white; context.fillRect(x-26, y-27, 52, 54);
        const px = x+gazeX*7, py = y+3+gazeY*6;
        const iris = context.createRadialGradient(px-2, py-3, 1, px, py, 10);
        iris.addColorStop(0, "#596168"); iris.addColorStop(.7, "#252c30"); iris.addColorStop(1, "#111619");
        context.fillStyle = iris; context.beginPath(); context.arc(px, py, 10, 0, Math.PI*2); context.fill();
        context.fillStyle = "#06090b"; context.beginPath(); context.arc(px, py, 6, 0, Math.PI*2); context.fill();
        context.fillStyle = "rgba(255,255,255,.92)"; context.beginPath(); context.arc(px-3, py-4, 2.7, 0, Math.PI*2); context.fill();
        context.restore();
      }
      context.restore();
    };

    const stop = () => {
      if (usesVideoCallback) video.cancelVideoFrameCallback(frame);
      else cancelAnimationFrame(frame);
      frame = 0;
      video.pause();
    };
    const isActive = () => visible && !document.hidden && !reduced() && !disposed && !blocked;
    const position = () => {
      if (video === takeoff) {
        // Smooth the spatial path at display refresh rate; the video follows
        // this same progress, while its decoder remains guarded against overlap.
        const progress = seekProgress;
        // Reserve the first quarter for unfolding and a small lift. Squared
        // sine gives zero velocity at both ends of the preparation gesture.
        const preparation = Math.min(1, progress/.34);
        const lift = -3*Math.pow(Math.sin(Math.PI*preparation), 2);
        const flight = Math.max(0, Math.min(1, (progress-.24)/.72));
        // Ease IN only: accelerate beyond the sill rather than braking just
        // before occlusion. At the final clamp the crow is already offscreen.
        const travel = flight*flight;
        const bank = Math.min(1, progress/.38);
        const tilt = -4*bank*bank*(3-2*bank);
        root.style.transform = `translate(${-28*travel}%, ${140*travel+lift}%) rotate(${tilt}deg)`;
        return;
      }
      // Drive the approach with decoded media time, not a separate CSS timer:
      // buffering, backgrounding and pause/resume keep movement and wings in sync.
      const p = video === intro && Number.isFinite(intro.duration) && intro.duration > 0
        ? Math.min(1, intro.currentTime / intro.duration) : 1;
      const remaining = Math.pow(1-p, 3);
      const x = -65*remaining;
      const contact = Math.max(0, (p-.72)/.28);
      const settle = .7*Math.pow(Math.sin(Math.PI*contact), 2);
      const y = 45*remaining - 2*Math.pow(Math.sin(Math.PI*p), 2) + settle;
      root.style.transform = `translate(${x}%, ${y}%) scale(${1-.12*remaining}) rotate(${-7*remaining}deg)`;
    };
    const schedule = () => {
      if (!isActive() || frame) return;
      usesVideoCallback = video !== takeoff && !following && Math.abs(gazeX)+Math.abs(gazeY)<.01 && typeof video.requestVideoFrameCallback === "function";
      frame = usesVideoCallback ? video.requestVideoFrameCallback(draw) : requestAnimationFrame(draw);
    };
    const draw = () => {
      frame = 0;
      if (!isActive()) return;
      // loadeddata wakes this loop. Do not move a frozen crow while loading.
      if (video === takeoff && takeoff.readyState < 2) return;
      if (video === takeoff) {
        const now = performance.now();
        const dt = lastSeekFrame ? Math.min(50, now-lastSeekFrame) : 16.67;
        lastSeekFrame = now;
        const next = seekProgress+(departure-seekProgress)*(1-Math.pow(.82, dt/16.67));
        // Let motion interpolate between decoded poses, but never outrun the
        // wings by more than two frames if the decoder/network stalls.
        const span = Number.isFinite(takeoff.duration) && takeoff.duration > 0
          ? 2/(30*takeoff.duration) : 0;
        seekProgress = Math.max(0, Math.min(1,
          Math.max(paintedProgress-span, Math.min(paintedProgress+span, next))));
        publishProgress();
        position();
      }
      const gazeActive = video === idle && (following || Math.abs(gazeX)+Math.abs(gazeY) >= .01);
      if (gazeActive && poster?.complete && poster.naturalWidth) {
        const now = performance.now();
        const dt = lastGazeFrame ? Math.min(50, now-lastGazeFrame) : 16.67;
        lastGazeFrame = now;
        const blend = 1-Math.pow(.85, dt/16.67);
        gazeX += (targetX-gazeX)*blend;
        gazeY += (targetY-gazeY)*blend;
        context.clearRect(0, 0, resolution, resolution);
        context.drawImage(poster, 0, 0, resolution, resolution);
        paintEyes();
        root.dataset.ready = "true";
        lastTime = -1;
        schedule();
        return;
      }
      // 解码每一新帧一次，不在 120Hz 显示屏重复拷贝同一张视频帧。
      if (video.readyState >= 2 && !video.seeking && video.currentTime !== lastTime) {
        try {
          decode.drawImage(video, 0, 0, resolution*2, resolution);
          const rgba = decode.getImageData(0, 0, resolution, resolution);
          const mask = decode.getImageData(resolution, 0, resolution, resolution).data;
          for (let i = 0; i < rgba.data.length; i += 4) {
            // Preserve fractional edge coverage instead of thresholding the
            // silhouette: hard alpha cutoffs produce visible stair-stepping.
            rgba.data[i + 3] = mask[i] <= 1 ? 0 : mask[i];
          }
          context.putImageData(rgba, 0, 0);
          if (video === takeoff && Number.isFinite(takeoff.duration) && takeoff.duration > 1/30) {
            paintedProgress = takeoff.currentTime/(takeoff.duration-1/30);
          }
          // At landing/rest retain the actual video eyes. Only pointer tracking
          // paints pupils/eye interiors, at the source dimensions above.
          position();
          root.dataset.ready = "true";
          lastTime = video.currentTime;
        } catch {
          blocked = true;
          root.dataset.ready = "false";
          stop();
          return;
        }
      }
      if (video === takeoff) {
        // Composite the completed seek BEFORE requesting another one; doing
        // this in the opposite order can starve painting during rapid scroll.
        if (departure === 0 && seekProgress < .003 && paintedProgress < .02) {
          seekProgress = paintedProgress = 0;
          publishProgress();
          startIdle();
          return;
        }
        if (Number.isFinite(takeoff.duration) && takeoff.duration > 1/30 && !takeoff.seeking) {
          const wanted = Math.max(.001, Math.min(takeoff.duration-1/30, seekProgress*(takeoff.duration-1/30)));
          if (Math.abs(takeoff.currentTime-wanted)>1/90) takeoff.currentTime = wanted;
        }
      }
      if (video !== takeoff || takeoff.seeking || Math.abs(departure-seekProgress)>.001) schedule();
    };
    const update = () => {
      const shouldListen = isActive() && video === idle;
      if (shouldListen !== inputAttached) {
        inputAttached = shouldListen;
        if (shouldListen) window.addEventListener("pointermove", track, { passive:true });
        else window.removeEventListener("pointermove", track);
      }
      if (!isActive()) { stop(); return; }
      if (video === takeoff) { video.pause(); schedule(); return; }
      if (following && video === idle) { video.pause(); schedule(); return; }
      video.play().then(() => {
        if (isActive()) schedule();
        else video.pause();
      }).catch(() => {
        // 自动播放被系统禁止时保留透明静态乌鸦，不显示黑色矩形。
        if (!disposed) {
          root.dataset.ready = "false";
          root.style.transform = "none";
        }
      });
    };
    const restEyes = () => {
      following = false;
      targetX = targetY = 0;
      root.dataset.gaze = "rest";
      // Start the quiet interval again; do not resume half of an interrupted blink.
      idle.currentTime = 0;
      update();
    };
    const track = (event: PointerEvent) => {
      if (!isActive() || video !== idle || !event.isPrimary) return;
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const eyeX = rect.left+rect.width*.56, eyeY = rect.top+rect.height*.35;
      targetX = Math.max(-1, Math.min(1, (event.clientX-eyeX)/(window.innerWidth*.35)));
      targetY = Math.max(-1, Math.min(1, (event.clientY-eyeY)/(window.innerHeight*.35)));
      if (!following) { stop(); lastGazeFrame = 0; }
      following = true;
      root.dataset.gaze = "following";
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(restEyes, 1200);
      schedule();
    };
    const error = () => {
      blocked = true;
      root.dataset.ready = "false";
      root.style.transform = "none";
      stop();
    };
    const startIdle = () => {
      // Hold the last composited frame during the handoff. The idle starts at
      // that same pose, so there is no poster flash or return to the entrance.
      stop();
      video = idle;
      idle.currentTime = 0;
      lastTime = -1;
      root.dataset.phase = "idle";
      position();
      update();
    };
    const takeoffError = () => {
      // Preserve the last composited pose at its current position. Restoring
      // the default poster here would teleport an exiting crow to the sill.
      blocked = true;
      stop();
      if (journey) {
        delete journey.dataset.crowProgress;
        journey.dispatchEvent(new Event("crow-progress"));
      }
    };
    const onJourney = () => {
      if (!journey || reduced()) return;
      const distance = journey.offsetHeight;
      const p = distance > 0 ? -journey.getBoundingClientRect().top/distance : 0;
      departure = Math.max(0, Math.min(1, (p-.012)/.75));
      if (departure > 0 && video !== takeoff) {
        stop();
        window.clearTimeout(idleTimer);
        following = false;
        gazeX = gazeY = targetX = targetY = 0;
        video = takeoff;
        seekProgress = paintedProgress = 0;
        publishProgress();
        if (takeoff.readyState >= 1) takeoff.currentTime = .001;
        lastSeekFrame = 0;
        lastTime = -1;
        root.dataset.phase = "takeoff";
      }
      if (video === takeoff) update();
    };
    // 观察实际乌鸦元素，穿过窗户、离屏或后台时停止视频与合成。
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    // Observe the fixed stage: fast scrolling can move its spacer offscreen
    // while the decoded retreat is still completing on screen.
    observer.observe(journey?.firstElementChild || root);
    root.dataset.phase = "intro";
    intro.muted = idle.muted = true;
    intro.addEventListener("ended", startIdle);
    intro.addEventListener("canplay", update);
    idle.addEventListener("canplay", update);
    intro.addEventListener("error", error);
    idle.addEventListener("error", error);
    takeoff.addEventListener("loadeddata", update);
    takeoff.addEventListener("seeked", update);
    takeoff.addEventListener("error", takeoffError);
    window.addEventListener("scroll", onJourney, { passive:true });
    window.addEventListener("resize", onJourney);
    onJourney();
    document.addEventListener("visibilitychange", update);
    reduce.addEventListener("change", update);
    return () => {
      disposed = true;
      stop();
      window.clearTimeout(idleTimer);
      window.removeEventListener("pointermove", track);
      observer.disconnect();
      if (journey) delete journey.dataset.crowProgress;
      intro.pause();
      idle.pause();
      takeoff.pause();
      takeoff.removeEventListener("loadeddata", update);
      takeoff.removeEventListener("seeked", update);
      takeoff.removeEventListener("error", takeoffError);
      window.removeEventListener("scroll", onJourney);
      window.removeEventListener("resize", onJourney);
      intro.removeEventListener("ended", startIdle);
      intro.removeEventListener("canplay", update);
      idle.removeEventListener("canplay", update);
      intro.removeEventListener("error", error);
      idle.removeEventListener("error", error);
      document.removeEventListener("visibilitychange", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  return <div ref={rootRef} className={styles.crow} aria-hidden="true">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/media/flying-crow-poster-hd.png" alt="" className={styles.poster} />
    <canvas ref={canvasRef} width={960} height={960} className={styles.canvas} />
    <video ref={videoRef} src="/media/flying-crow-arrive-hd.mp4" muted playsInline preload="auto" className={styles.source} />
    <video ref={idleRef} src="/media/flying-crow-rest-hd.mp4" muted playsInline loop preload="auto" className={styles.source} />
    <video ref={takeoffRef} src="/media/crow-retreat-hd.mp4" muted playsInline preload="auto" className={styles.source} />
  </div>;
}
