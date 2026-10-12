"use client";

import { useEffect, useRef } from "react";
import styles from "./auth.module.css";

/** Translucent eyelids retain the feather/light colour beneath them. */
function ClosedEye({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(9)`}>
      {/* Upper lid volume, a fine fold, and a tapered closure follow the drawing. */}
      <path d="M-21-1 C-20-14-9-20 3-17 C14-16 21-8 22 1 C10 14-10 14-21-1Z" fill="#101513" fillOpacity="0.16" />
      <path d="M-16-8 C-7-13 6-13 15-7" fill="none" stroke="#131916" strokeOpacity="0.32" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M-22-1 C-12 7 6 12 22 1 C14 14-9 16-22-1Z" fill="#111713" />
      <path d="M-15 8 C-5 14 6 15 15 10" fill="none" stroke="#e4e8da" strokeOpacity="0.17" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M-21-1-24-4 M21 2 24-1" fill="none" stroke="#171d18" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/**
 * Two independent clocks:
 * - native video playback loops the TV light without JS frame rendering;
 * - pointer input updates SVG pupils via a short, on-demand lerp loop.
 * The source video's baked-in eyes were removed offline. No time seeking can
 * accidentally blink or move the eyes when the user stops moving the pointer.
 */
export function PointerVideo({ eyesClosed = false }: { eyesClosed?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const stage = stageRef.current;
    const pupils = pupilsRef.current;
    if (!container || !video || !stage || !pupils) return;
    let visible = false;
    let destroyed = false;
    let attached = false;
    let failed = false;
    let raf = 0;
    let lastTimestamp = 0;
    let activePointer: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastPointer: { x: number; y: number } | null = null;
    let bounds = container.getBoundingClientRect();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const active = () => visible && !document.hidden && !destroyed;

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
      lastTimestamp = 0;
    }
    function wake() {
      if (!raf && active()) raf = requestAnimationFrame(tick);
    }
    function tick(timestamp: number) {
      raf = 0;
      if (!active()) return;
      const delta = lastTimestamp ? Math.min(timestamp - lastTimestamp, 64) : 1000 / 60;
      lastTimestamp = timestamp;
      const alpha = motion.matches ? 1 : 1 - Math.pow(0.85, delta / (1000 / 60));
      currentX += (targetX - currentX) * alpha;
      currentY += (targetY - currentY) * alpha;
      if (Math.hypot(targetX - currentX, targetY - currentY) < 0.015) {
        currentX = targetX;
        currentY = targetY;
      }
      pupils!.setAttribute("transform", `translate(${currentX.toFixed(3)} ${currentY.toFixed(3)})`);
      // Once settled there is zero eye animation work. The light video continues.
      if (currentX !== targetX || currentY !== targetY) wake();
      else lastTimestamp = 0;
    }
    function aim(x: number, y: number) {
      if (!bounds.width || !bounds.height || window.innerWidth <= 0) return;
      // Match object-fit: cover exactly. Both video and SVG share one sized stage.
      const scale = Math.max(bounds.width / 720, bounds.height / 950);
      const positionY = window.innerWidth <= 760 ? 0.35 : 0.5;
      const eyeX = bounds.left + (bounds.width - 720 * scale) / 2 + 497 * scale;
      const eyeY = bounds.top + (bounds.height - 950 * scale) * positionY + 296 * scale;
      const dx = (x - eyeX) / Math.max(160, window.innerWidth * 0.35);
      const dy = (y - eyeY) / Math.max(120, window.innerHeight * 0.35);
      // Constrain pupils to an ellipse inside the eye whites at every direction.
      const divisor = Math.max(1, Math.hypot(dx, dy));
      targetX = dx / divisor * 10;
      targetY = dy / divisor * 9;
      wake();
    }
    function measure() {
      bounds = container!.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;
      const scale = Math.max(bounds.width / 720, bounds.height / 950);
      const positionY = window.innerWidth <= 760 ? 0.35 : 0.5;
      stage!.style.width = `${720 * scale}px`;
      stage!.style.height = `${950 * scale}px`;
      stage!.style.left = `${(bounds.width - 720 * scale) / 2}px`;
      stage!.style.top = `${(bounds.height - 950 * scale) * positionY}px`;
      if (lastPointer) aim(lastPointer.x, lastPointer.y);
    }
    function move(event: PointerEvent) {
      if (!event.isPrimary || (activePointer !== null && activePointer !== event.pointerId)) return;
      if (event.pointerType === "touch" && activePointer === null) return;
      lastPointer = { x: event.clientX, y: event.clientY };
      // Pointer handlers update only target values, never video.currentTime.
      aim(event.clientX, event.clientY);
    }
    function playLight() {
      if (!active() || failed || motion.matches || !video!.paused) return;
      // Autoplay rejection is harmless. A later pointerdown retries after a user
      // gesture; the poster and independently controlled eyes remain available.
      void video!.play().then(() => {
        if (!active() || motion.matches) video!.pause();
      }).catch(() => {});
    }
    function down(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0) return;
      activePointer = event.pointerId;
      move(event);
      playLight();
      // Capture only gestures started on the illustration. Global input listeners
      // must never capture clicks on the form, steal focus, or prevent scrolling.
      if (container!.contains(event.target as Node)) container!.setPointerCapture(event.pointerId);
    }
    function release() {
      const id = activePointer;
      activePointer = null;
      if (id !== null && container!.hasPointerCapture(id)) container!.releasePointerCapture(id);
      // Do not recenter: retain the last gaze while the light keeps playing.
    }
    function leave(event: PointerEvent) { if (!event.relatedTarget) release(); }
    function keyboard(event: KeyboardEvent) {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
      event.preventDefault();
      lastPointer = null;
      if (event.key === "Home") { targetX = 0; targetY = 0; }
      else if (event.key === "ArrowLeft") targetX -= 2;
      else if (event.key === "ArrowRight") targetX += 2;
      else if (event.key === "ArrowUp") targetY -= 2;
      else targetY += 2;
      const divisor = Math.max(1, Math.hypot(targetX / 10, targetY / 9));
      targetX /= divisor;
      targetY /= divisor;
      wake();
    }
    function attach() {
      if (attached) return;
      attached = true;
      measure();
      // Capture phase observes the entire webpage, including the form and its
      // whitespace, even if a descendant stops bubbling. All are passive.
      window.addEventListener("pointermove", move, { passive: true, capture: true });
      window.addEventListener("pointerdown", down, { passive: true, capture: true });
      window.addEventListener("pointerup", release, true);
      window.addEventListener("pointercancel", release, true);
      document.documentElement.addEventListener("pointerleave", leave);
      container!.addEventListener("lostpointercapture", release);
      container!.addEventListener("keydown", keyboard);
      window.addEventListener("resize", measure, { passive: true });
      window.addEventListener("scroll", measure, { passive: true, capture: true });
    }
    function detach() {
      attached = false;
      release();
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointerup", release, true);
      window.removeEventListener("pointercancel", release, true);
      document.documentElement.removeEventListener("pointerleave", leave);
      container!.removeEventListener("lostpointercapture", release);
      container!.removeEventListener("keydown", keyboard);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      stop();
      video!.pause();
    }
    function sync() {
      if (active()) {
        attach();
        wake();
        if (motion.matches) video!.pause();
        else playLight();
      } else detach();
    }
    function metadata() {
      const duration = video!.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      if (!video!.seeking && video!.currentTime === 0) {
        try { video!.currentTime = Math.min(0.02, duration / 2); } catch { /* poster covers decode startup */ }
      }
      playLight();
    }
    function decoded() { if (!failed && video!.readyState >= 2) video!.style.opacity = "1"; }
    function fail() { failed = true; video!.style.opacity = "0"; video!.pause(); }
    video.addEventListener("loadedmetadata", metadata);
    video.addEventListener("loadeddata", decoded);
    video.addEventListener("seeked", decoded);
    video.addEventListener("canplay", playLight);
    video.addEventListener("error", fail);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(container);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    measure();
    if (video.readyState >= 1) metadata();
    if (video.readyState >= 2) decoded();
    return () => {
      destroyed = true;
      detach();
      observer.disconnect();
      resizeObserver.disconnect();
      video.removeEventListener("loadedmetadata", metadata);
      video.removeEventListener("loadeddata", decoded);
      video.removeEventListener("seeked", decoded);
      video.removeEventListener("canplay", playLight);
      video.removeEventListener("error", fail);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.visual} tabIndex={0} role="group" aria-label="互动乌鸦：在整个页面移动鼠标或拖动，眼睛跟随方向，电视光线自动循环">
      <div ref={stageRef} className={styles.animationStage}>
        <video ref={videoRef} className={styles.video} src="/media/crow-light-blended.mp4" poster="/media/crow-light-blended-poster.jpg" muted playsInline preload="auto" loop disablePictureInPicture aria-hidden="true" />
        <svg className={styles.eyes} viewBox="0 0 720 950" aria-hidden="true" data-eyes-closed={eyesClosed}>
          {/* Keep the pupil nodes mounted so focus changes never restart the video
              or pointer effect. Hidden pupils retain the latest pointer direction. */}
          <g visibility={eyesClosed ? "hidden" : "visible"}>
          <ellipse cx="460" cy="290" rx="21" ry="23" fill="#f5f5e9" stroke="#18201a" strokeOpacity="0.24" strokeWidth="1.3" transform="rotate(14 460 290)" />
          <ellipse cx="534" cy="302" rx="22" ry="23" fill="#f5f5e9" stroke="#18201a" strokeOpacity="0.24" strokeWidth="1.3" transform="rotate(12 534 302)" />
          <g ref={pupilsRef} fill="#111510">
            <circle cx="460" cy="290" r="9" /><circle cx="534" cy="302" r="9" />
            <g fill="#fffef2" fillOpacity="0.75"><circle cx="457.5" cy="287" r="1.8" /><circle cx="531.5" cy="299" r="1.8" /></g>
          </g>
          </g>
          <g visibility={eyesClosed ? "visible" : "hidden"}>
            <ClosedEye x={460} y={290} />
            <ClosedEye x={534} y={302} />
          </g>
        </svg>
      </div>
    </div>
  );
}
