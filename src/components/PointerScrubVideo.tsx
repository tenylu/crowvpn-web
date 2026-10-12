"use client";

import { useEffect, useRef } from "react";
import styles from "./PointerScrubVideo.module.css";

type SeekVideo = HTMLVideoElement & { fastSeek?: (time: number) => void };

export type PointerScrubVideoProps = {
  src: string;
  /** 必须是与视频构图一致的静态图；加载、解码失败时仍然可见。 */
  poster: string;
  label?: string;
  className?: string;
  /** 默认为 0.5：素材时间轴中间应当对应眼睛直视前方。 */
  initialProgress?: number;
  /** 60Hz 下每帧的追随比例；会按实际帧间隔换算，避免高刷屏变快。 */
  smoothing?: number;
  /** 素材实际帧率，用于限制无意义的亚帧 seek。 */
  fps?: number;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * 横向指针位置 → MP4 时间轴。该视频始终暂停，只有 rAF 可以发起 seek。
 * 鼠标/笔悬停即跟随；触屏按下后拖动。容器之外仍可正常纵向滚动。
 *
 * 素材合同：起点看左、终点看右；本组件不会给任意 MP4 生成新的眼球动作。
 * 持续扇翅必须由另一个独立图层承担：一个视频不能同时自由播放和按位置 seek。
 * fastSeek 是关键帧近似定位，结尾使用精确 seek 校正；建议输入全 I 帧 MP4。
 */
export function PointerScrubVideo({
  src,
  poster,
  label = "左右移动或拖动，让乌鸦看向你",
  className = "",
  initialProgress = 0.5,
  smoothing = 0.15,
  fps = 30,
}: PointerScrubVideoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current as SeekVideo | null;
    if (!root || !video) return;

    const start = Number.isFinite(initialProgress) ? clamp(initialProgress) : 0.5;
    const alpha = Number.isFinite(smoothing) ? Math.min(.95, Math.max(.01, smoothing)) : .15;
    const frameStep = 1 / (Number.isFinite(fps) && fps > 0 ? fps : 30);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let target = start;
    let progress = start;
    let duration = 0;
    let minTime = 0;
    let maxTime = 0;
    let raf = 0;
    let lastFrame = 0;
    let lastIssuedTime = NaN;
    let lastExactTime = NaN;
    let primed = false;
    let failed = false;
    let destroyed = false;
    let intersecting = false;
    let active = false;
    let capturedPointer: number | null = null;
    let rect = root.getBoundingClientRect();
    root.dataset.ready = "false";
    video.muted = true;
    video.pause();

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
    };
    const wake = () => {
      if (!destroyed && active && duration > 0 && !failed && !raf) {
        raf = requestAnimationFrame(render);
      }
    };

    // 唯一的解码入口，仅由 render 调用；pointermove 只改 target。
    const seek = (time: number, exact: boolean) => {
      if (video.seeking || !Number.isFinite(time)) return;
      try {
        if (!exact && typeof video.fastSeek === "function") {
          video.fastSeek(time);
        } else {
          video.currentTime = time;
        }
        lastIssuedTime = time;
        if (exact) lastExactTime = time;
      } catch {
        // 某些 Safari 在元数据已到但还不可 seek 时抛异常。
        // 保留 poster，等待 loadeddata/canplay 重新唤醒，而不是忙循环。
        lastIssuedTime = NaN;
      }
    };

    const render = (now: number) => {
      raf = 0;
      if (!active || failed || duration <= 0) return;
      // 解码背压：上一次 seek 尚未结束时休眠，由 seeked 唤醒。
      if (video.seeking) { lastFrame = 0; return; }
      if (!primed) {
        primed = true;
        seek(minTime, true); // 0.02s 首帧预热；极短视频自动缩短。
        wake();
        return;
      }

      const elapsed = lastFrame ? Math.min(64, now - lastFrame) : 1000 / 60;
      lastFrame = now;
      const factor = reducedMotion.matches ? 1 : 1 - Math.pow(1 - alpha, elapsed / (1000 / 60));
      progress += (target - progress) * factor;
      const span = maxTime - minTime;
      const settled = Math.abs(target - progress) * span <= frameStep * .25;
      if (settled) progress = target;
      const time = minTime + progress * span;

      // 接近目标后做一次精确定位，消除 fastSeek 的关键帧吸附误差。
      // 单独记录 exact，避免粗定位碰巧用了相同时间便跳过最后一帧。
      if (settled) {
        if (!Number.isFinite(lastExactTime) || Math.abs(time - lastExactTime) > .001) seek(time, true);
        lastFrame = 0;
        return;
      }
      if (!Number.isFinite(lastIssuedTime) || Math.abs(time - lastIssuedTime) >= frameStep * .5) {
        seek(time, false);
      }
      wake(); // 稳定后不再持续运行；下次输入或 seeked 再唤醒。
    };

    const measure = () => { rect = root.getBoundingClientRect(); };
    const point = (event: PointerEvent) => {
      if (!event.isPrimary || (capturedPointer !== null && event.pointerId !== capturedPointer)) return;
      // 读取实时位置，应对 sticky 舞台及滚动缩放；不写 DOM，不发起解码。
      measure();
      if (root.clientWidth <= 0 || rect.width <= 0 || !Number.isFinite(event.clientX)) return;
      target = clamp((event.clientX - rect.left) / rect.width);
      wake();
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      capturedPointer = event.pointerId;
      try { root.setPointerCapture(event.pointerId); } catch { /* 指针可能已经取消。 */ }
      point(event);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" && capturedPointer !== event.pointerId) return;
      point(event);
    };
    const release = () => {
      const id = capturedPointer;
      capturedPointer = null;
      if (id !== null && root.hasPointerCapture(id)) root.releasePointerCapture(id);
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId !== capturedPointer) return;
      point(event);
      release();
    };
    const leave = () => {
      // 停在最后目标，不突然弹回中间；捕获中的手势仍可拖到容器之外。
      if (capturedPointer === null) lastFrame = 0;
    };
    const cancel = (event: PointerEvent) => {
      if (event.pointerId !== capturedPointer) return;
      target = progress;
      release();
      wake();
    };
    const lostCapture = () => { capturedPointer = null; };
    const key = (event: KeyboardEvent) => {
      const changes: Record<string, number> = { ArrowLeft: target - .05, ArrowRight: target + .05, Home: 0, End: 1 };
      if (!(event.key in changes)) return;
      event.preventDefault();
      target = clamp(changes[event.key]);
      wake();
    };
    const resize = () => { measure(); wake(); };

    const attach = () => {
      root.addEventListener("pointerdown", down);
      root.addEventListener("pointermove", move);
      root.addEventListener("pointerup", up);
      root.addEventListener("pointerleave", leave);
      root.addEventListener("pointercancel", cancel);
      root.addEventListener("lostpointercapture", lostCapture);
      root.addEventListener("keydown", key);
      window.addEventListener("resize", resize, { passive: true });
    };
    const detach = () => {
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("pointercancel", cancel);
      root.removeEventListener("lostpointercapture", lostCapture);
      root.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
      release();
    };
    const updateVisibility = () => {
      const next = intersecting && !document.hidden && !failed;
      if (next === active) return;
      active = next;
      if (active) { measure(); attach(); wake(); }
      else { detach(); stop(); video.pause(); }
    };
    const metadata = () => {
      // live/损坏视频的 Infinity、NaN 和零长度不能参与时间轴计算。
      const value = video.duration;
      if (!Number.isFinite(value) || value <= 0) { duration = 0; stop(); return; }
      duration = value;
      minTime = Math.min(.02, duration / 4);
      maxTime = Math.max(minTime, duration - Math.min(frameStep, duration / 4));
      wake();
    };
    const decoded = () => {
      if (primed && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) root.dataset.ready = "true";
      wake();
    };
    const error = () => {
      failed = true;
      root.dataset.ready = "false";
      updateVisibility();
      stop();
    };

    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      updateVisibility();
    });
    observer.observe(root);
    video.addEventListener("loadedmetadata", metadata);
    video.addEventListener("durationchange", metadata);
    video.addEventListener("loadeddata", decoded);
    video.addEventListener("canplay", decoded);
    video.addEventListener("seeked", decoded);
    video.addEventListener("error", error);
    document.addEventListener("visibilitychange", updateVisibility);
    reducedMotion.addEventListener("change", wake);
    // 缓存命中时 loadedmetadata 可能在 effect 执行前就已触发。
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) metadata();
    if (video.error) error();

    return () => {
      destroyed = true;
      active = false;
      stop();
      detach();
      observer.disconnect();
      video.pause();
      video.removeEventListener("loadedmetadata", metadata);
      video.removeEventListener("durationchange", metadata);
      video.removeEventListener("loadeddata", decoded);
      video.removeEventListener("canplay", decoded);
      video.removeEventListener("seeked", decoded);
      video.removeEventListener("error", error);
      document.removeEventListener("visibilitychange", updateVisibility);
      reducedMotion.removeEventListener("change", wake);
    };
  }, [src, initialProgress, smoothing, fps]);

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`} tabIndex={0} role="group" aria-label={label}>
      {/* 独立 poster 图层不会被 video 的空白解码帧覆盖。 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.poster} src={poster} alt="" aria-hidden="true" draggable={false} />
      <video ref={videoRef} className={styles.video} src={src} poster={poster} muted playsInline preload="auto" autoPlay={false} controls={false} disablePictureInPicture aria-hidden="true" />
    </div>
  );
}
