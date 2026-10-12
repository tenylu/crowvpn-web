"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./WindowJourney.module.css";
import { FlyingCrow } from "./FlyingCrow";
import { BrandLogoStrip } from "./BrandLogoStrip";
import { TextReveal } from "./ui/cascade-text";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (a: number, b: number, p: number) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function WindowJourney() {
  const root = useRef<HTMLElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const positionKey = "crowvpn:home-scroll";
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type === "reload" && !location.hash) {
      try {
        const saved = Number(sessionStorage.getItem(positionKey));
        if (Number.isFinite(saved) && saved > 0) window.scrollTo({ top: saved, behavior: "instant" });
      } catch { /* Native scroll restoration still works when storage is unavailable. */ }
    }
    let restoring = true;
    let restoredBeyondIntro = false;
    const intro = document.getElementById("vpn-intro");
    let handoffArmed = window.scrollY < element.offsetHeight * .5 && !location.hash;
    let holdingIntro = false;
    let releaseTimer = 0;
    let lastWheel = 0;
    const introTop = () => intro ? intro.getBoundingClientRect().top + window.scrollY - 72 : element.offsetHeight;
    const pinIntro = () => window.scrollTo({ top: Math.max(0, introTop()), behavior: "instant" });
    const guardScroll = () => {
      if (restoring) return;
      if (window.scrollY < element.offsetHeight * .15) handoffArmed = true;
      if (holdingIntro) { pinIntro(); return; }
      if (handoffArmed && intro && window.scrollY >= introTop()) {
        handoffArmed = false;
        holdingIntro = true;
        pinIntro();
      }
    };
    const guardWheel = (event: WheelEvent) => {
      restoring = false;
      lastWheel = performance.now();
      if (holdingIntro && !event.ctrlKey) event.preventDefault();
    };
    const savePosition = () => {
      try { sessionStorage.setItem(positionKey, String(window.scrollY)); } catch { /* Optional persistence. */ }
    };
    const interact = () => { restoring = false; };
    const trust = document.getElementById("home-trust");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visualProgress = 0;
    let lastFrame = 0;
    let skyProgress = 0;
    let previousCrow = -1;
    let crowUpdatedAt = performance.now();
    const render = () => {
      frame = 0;
      const stage = element.firstElementChild as HTMLElement;
      // The fixed scene never inherits the spacer's bottom edge. The spacer
      // measures only the journey, so content is already in view at handoff.
      const distance = element.offsetHeight;
      const p = reduce.matches || distance <= 0 ? 0 : clamp(-element.getBoundingClientRect().top / distance);
      if (restoring && p >= .762) restoredBeyondIntro = true;
      if (!restoring && p < .762) restoredBeyondIntro = false;
      const now = performance.now();
      const dt = lastFrame ? Math.min(50, now-lastFrame) : 16.67;
      lastFrame = now;
      const blend = 1-Math.pow(.82,dt/16.67);
      const crowProgress = Number(element.dataset.crowProgress ?? 0);
      if (crowProgress !== previousCrow) {
        previousCrow = crowProgress;
        crowUpdatedAt = now;
      }
      const waitingForCrow = !restoring && !restoredBeyondIntro && p > .012 && crowProgress < .995 && now-crowUpdatedAt < 2500;
      // Use the crow's decoded timeline for the window too. A fast wheel
      // event must not advance the opaque cabin ahead of the retiring bird.
      const visualTarget = restoring || reduce.matches || element.dataset.crowProgress === undefined || (!waitingForCrow && p > .762) || (p===0 && crowProgress===0) ? p : p <= .762
        ? .012+.75*crowProgress
        : crowProgress < .995 ? .012+.75*crowProgress : p;
      visualProgress = restoring ? visualTarget : visualProgress + (visualTarget-visualProgress)*blend;
      // Hold the sill through preparation on the compact entrance timeline.
      // Zoom begins after release, so planted feet do not slide off the ledge.
      const travel = smooth(.20, .74, visualProgress);
      const zoom = 1 / (1 - .87 * travel);
      element.style.setProperty("--zoom", String(zoom));
      // Start the handoff during the final part of the decoded retreat, so
      // the heading is already emerging when the crow clears the viewport.
      const reveal = smooth(.58, .74, visualProgress);
      const introReady = reduce.matches || reveal >= .999;
      if (intro && intro.dataset.cabinReady !== String(introReady)) {
        intro.dataset.cabinReady = String(introReady);
        window.dispatchEvent(new Event("crowvpn:cabin-visibility"));
      }
      if (holdingIntro && reveal >= .999 && !releaseTimer) {
        const readyAt = performance.now();
        const release = () => {
          // Absorb the wheel gesture that crossed the cabin, then resume normal scrolling.
          const elapsed = performance.now() - readyAt;
          if (elapsed < 550 || (performance.now() - lastWheel < 160 && elapsed < 1800)) {
            releaseTimer = window.setTimeout(release, 80);
            return;
          }
          holdingIntro = false;
          releaseTimer = 0;
        };
        releaseTimer = window.setTimeout(release, 550);
      }
      const trustTitle = reduce.matches ? 1 : smooth(.56, .68, visualProgress);
      const trustLogos = reduce.matches ? 1 : smooth(.60, .73, visualProgress);
      trust?.style.setProperty("--trust-title", String(trustTitle));
      trust?.style.setProperty("--trust-logos", String(trustLogos));
      element.style.setProperty("--scene-opacity", String(1-reveal));
      // Keep the foreground clouds until the scene crossfades into the sky's
      // edge clouds. Clearing them before handoff leaves an empty blue frame.
      element.style.setProperty("--window-cloud-opacity", "1");
      element.style.setProperty("--window-cloud-spread", `${12*travel}vw`);
      stage.style.visibility = !reduce.matches && reveal >= .999 ? "hidden" : "visible";
      stage.style.pointerEvents = visualProgress > .08 ? "none" : "";
      stage.inert = !reduce.matches && visualProgress > .08;
      const contentProgress = clamp((window.scrollY-distance)/Math.max(1, document.documentElement.scrollHeight-window.innerHeight-distance));
      // Anchor sunset to the actual module, including responsive layout and
      // translated content heights, instead of a percentage of the whole page.
      const sunsetSection = document.getElementById("instant-connect");
      let skyTarget = contentProgress;
      if (sunsetSection) {
        const top = sunsetSection.getBoundingClientRect().top + window.scrollY;
        const start = Math.max(distance, top-window.innerHeight*.85);
        const end = Math.max(start+1, top-window.innerHeight*.20);
        const bottom = Math.max(end+1, document.documentElement.scrollHeight-window.innerHeight);
        skyTarget = window.scrollY < start
          ? .5*clamp((window.scrollY-distance)/Math.max(1,start-distance))
          : window.scrollY <= end
            ? .5+.18*clamp((window.scrollY-start)/(end-start))
            : .68+.32*clamp((window.scrollY-end)/(bottom-end));
      }
      skyProgress = restoring ? skyTarget : skyProgress + (skyTarget-skyProgress)*blend;
      const warmth = smooth(.50, .64, skyProgress);
      const mix = (a: number[], b: number[], t: number) => a.map((v,i)=>Math.round(v+(b[i]-v)*t));
      const stops = [[67,143,204],[110,181,225],[184,219,240]];
      const dusk = [[77,106,152],[136,133,160],[242,209,186]];
      const evening = [[67,82,125],[136,113,134],[237,204,174]];
      const night = [[4,7,18],[10,16,35],[42,48,80]];
      const sunset = smooth(.58, .68, skyProgress);
      const darkness = smooth(.68, .88, skyProgress);
      const colors = stops.map((color,i)=>`rgb(${mix(color,mix(mix(dusk[i],evening[i],sunset),night[i],darkness),warmth).join(' ')})`);
      sky.current?.style.setProperty("--sky-top",colors[0]);
      sky.current?.style.setProperty("--sky-mid",colors[1]);
      sky.current?.style.setProperty("--sky-bottom",colors[2]);
      element.style.setProperty("--sky-top",colors[0]);
      element.style.setProperty("--sky-mid",colors[1]);
      element.style.setProperty("--sky-bottom",colors[2]);
      sky.current?.style.setProperty("--night",String(darkness));
      sky.current?.style.setProperty("--cloud-shift", `${-110*travel-90*contentProgress}px`);
      sky.current?.style.setProperty("--cloud-spread", `${5*travel}vw`);
      element.style.setProperty("--exit", `${70 * travel}vw`);
      element.style.setProperty("--copy", String(1 - smooth(.08, .28, visualProgress)));
      element.style.setProperty("--brand", String(1 - smooth(.23, .44, visualProgress)));
      element.dataset.sceneReady = "true";
      if (!document.hidden && (waitingForCrow || Math.abs(visualProgress-visualTarget)>.001 || Math.abs(skyProgress-skyTarget)>.001)) frame=requestAnimationFrame(render);
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(render); };
    const restartHome = () => {
      clearTimeout(releaseTimer);
      releaseTimer = 0;
      holdingIntro = false;
      handoffArmed = true;
      restoring = false;
      restoredBeyondIntro = false;
      visualProgress = 0;
      skyProgress = 0;
      try { sessionStorage.removeItem(positionKey); } catch { /* Optional persistence. */ }
      update();
    };
    window.addEventListener("crowvpn:restart-home", restartHome);
    let visible = true;
    const pause = () => {
      element.dataset.paused = String(!visible || document.hidden);
      if (sky.current) sky.current.dataset.paused = String(document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; pause(); });
    observer.observe(element.firstElementChild!);
    document.addEventListener("visibilitychange", pause);
    render();
    addEventListener("scroll", update, { passive: true });
    addEventListener("scroll", guardScroll, { passive: true });
    addEventListener("wheel", guardWheel, { passive: false });
    addEventListener("resize", update);
    addEventListener("pageshow", update);
    addEventListener("pagehide", savePosition);
    addEventListener("wheel", interact, { passive: true });
    addEventListener("touchstart", interact, { passive: true });
    addEventListener("keydown", interact);
    addEventListener("pointerdown", interact);
    element.addEventListener("crow-progress", update);
    reduce.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(releaseTimer);
      removeEventListener("scroll", guardScroll);
      window.removeEventListener("crowvpn:restart-home", restartHome);
      removeEventListener("wheel", guardWheel);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      removeEventListener("pageshow", update);
      removeEventListener("pagehide", savePosition);
      removeEventListener("wheel", interact);
      removeEventListener("touchstart", interact);
      removeEventListener("keydown", interact);
      removeEventListener("pointerdown", interact);
      element.removeEventListener("crow-progress", update);
      reduce.removeEventListener("change", update);
      observer.disconnect();
      document.removeEventListener("visibilitychange", pause);
    };
  }, []);

  return <>
      <div ref={sky} className={styles.sky} aria-hidden="true">
        <svg className={styles.stars} viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {Array.from({length:90},(_,i)=><circle key={i} cx={(i*347+71)%1440} cy={(i*193+37)%1000} r={i%7===0 ? 1.1 : .65} fill="white" opacity={.25+(i%5)*.14} />)}
        </svg>
        <div className={`${styles.cloudLayer} ${styles.cloudLeft}`}><Image src="/images/zen-cloud-left.webp" alt="" fill sizes="60vw" preload unoptimized /></div>
        <div className={`${styles.cloudLayer} ${styles.cloudRight}`}><Image src="/images/zen-cloud-right.webp" alt="" fill sizes="60vw" preload unoptimized /></div>
        <div className={`${styles.cloudLayer} ${styles.cloudBack}`}><Image src="/images/zen-cloud-small.webp" alt="" fill sizes="22vw" unoptimized /></div>
        <div className={`${styles.cloudLayer} ${styles.cloudLowerLeft}`}><Image src="/images/zen-cloud-right.webp" alt="" fill sizes="65vw" unoptimized /></div>
        <div className={`${styles.cloudLayer} ${styles.cloudLowerRight}`}><Image src="/images/zen-cloud-left.webp" alt="" fill sizes="65vw" unoptimized /></div>
      </div>
    <section ref={root} className={styles.journey} aria-label="穿过舷窗，进入云端">
    <div className={styles.stage}>
      <div className={styles.windowClouds} aria-hidden="true">
        <div className={styles.windowCloudLeft}><Image src="/images/zen-cloud-left.webp" alt="" fill sizes="28vw" unoptimized /></div>
        <div className={styles.windowCloudRight}><Image src="/images/zen-cloud-right.webp" alt="" fill sizes="22vw" unoptimized /></div>
      </div>
      <div className={styles.crowScene} aria-hidden="true"><div className={styles.crowPosition}><FlyingCrow /></div></div>
      <div className={styles.cabin} aria-hidden="true"><Image src="/images/cabin-silver.svg" alt="" fill unoptimized preload /></div>
      <h1 className={styles.title}><span><TextReveal text="随时随地" /></span><span><TextReveal text="连接世界" delay={430} /></span></h1>
      <p className={styles.description}>经济实惠，<br />适合国际旅行的网络服务</p>
      <a className={styles.skip} href="#vpn-intro">
        <svg className={styles.scrollArrow} width="18" height="26" viewBox="0 0 18 26" fill="none" aria-hidden="true">
          <path d="m4 5 5 5 5-5" />
          <path d="m4 11 5 5 5-5" />
          <path d="m4 17 5 5 5-5" />
        </svg>
        <span>向下滚动，穿过舷窗</span>
      </a>
    </div>
  </section>
    <nav className={styles.actions} aria-label="快捷操作">
      <Link href="/pricing" aria-label="选购套餐">
        <span className={styles.purchaseLabel} aria-hidden="true" data-no-translate>
          {[0, 1].map((copy) => (
            <span className={styles.purchaseLine} key={copy}>
              {Array.from("选购套餐").map((letter, index) => (
                <span key={index} style={{ transitionDuration: `${.2 + index * .1}s` }}>{letter}</span>
              ))}
            </span>
          ))}
        </span>
      </Link>
      <Link href="/download" aria-label="下载客户端">
        <span className={styles.purchaseLabel} aria-hidden="true" data-no-translate>
          {[0, 1].map((copy) => (
            <span className={styles.purchaseLine} key={copy}>
              {Array.from("下载客户端").map((letter, index) => (
                <span key={index} style={{ transitionDuration: `${.2 + index * .1}s` }}>{letter}</span>
              ))}
            </span>
          ))}
        </span>
      </Link>
    </nav>
  </>;
}

export function TrustSection() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const lines = element.querySelectorAll<HTMLElement>("[data-trust-stat]");
    const icons = element.querySelectorAll<HTMLElement>(`.${styles.trustLogo}`);
    let entered = false;
    let entrance: Animation[] = [];
    element.dataset.iconState = reduce.matches ? "ready" : "waiting";
    const measure = () => {
      icons.forEach((icon) => {
        const parent = icon.offsetParent as HTMLElement | null;
        if (!parent) return;
        // Offset coordinates ignore transforms, so scrolling cannot feed back into layout.
        icon.style.setProperty("--gather-x", `${parent.clientWidth / 2 - icon.offsetLeft - icon.offsetWidth / 2}px`);
        icon.style.setProperty("--gather-y", `${parent.clientHeight / 2 - icon.offsetTop - icon.offsetHeight / 2}px`);
      });
    };
    let frame = 0;
    const render = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const panel = element.firstElementChild as HTMLElement;
      const travel = Math.max(1, element.offsetHeight - panel.offsetHeight);
      const scrolled = 72 - rect.top;
      const progress = clamp(scrolled / travel);
      if (reduce.matches) {
        entrance.forEach(animation => animation.cancel());
        element.dataset.iconState = "ready";
      } else if (!entered && rect.top < window.innerHeight * .48 && rect.bottom > 0) {
        entered = true;
        element.dataset.iconState = "ready";
        entrance = Array.from(icons, (icon, index) => icon.animate([
          { translate: `${icon.style.getPropertyValue("--gather-x")} ${icon.style.getPropertyValue("--gather-y")}`, scale: .5, opacity: 0 },
          { translate: "0px 0px", scale: 1, opacity: 1 },
        ], { duration: 1200, delay: index * 45, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" }));
        element.querySelectorAll<HTMLElement>(`.${styles.trustTitle}`).forEach(copy => {
          entrance.push(copy.animate([{ opacity: 0, translate: "0 20px" }, { opacity: 1, translate: "0 0" }],
            { duration: 650, delay: 320, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
        });
      } else if (entered && (rect.top > window.innerHeight || rect.bottom < 0)) {
        entered = false;
        entrance.forEach(animation => animation.cancel());
        element.dataset.iconState = "waiting";
      }
      element.style.setProperty("--trust-progress", String(progress));
      lines.forEach((line, index) => {
        // Each row rises into its own permanent slot, as in the reference.
        // Completed rows stay visible; scrolling backwards reverses the reveal.
        const visibility = clamp((progress - index * .18) / .24);
        line.style.opacity = String(reduce.matches ? 1 : visibility);
        line.style.transform = reduce.matches ? "none" : `translate3d(0,${(1 - visibility) * Math.min(320, panel.offsetHeight * .48)}px,0)`;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const resize = () => { measure(); schedule(); };
    measure();
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    reduce.addEventListener("change", schedule);
    return () => {
      entrance.forEach(animation => animation.cancel());
      delete element.dataset.iconState;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      reduce.removeEventListener("change", schedule);
    };
  }, []);
  return (
    <section ref={section} id="home-trust" className={styles.trust} aria-labelledby="home-trust-title">
      <div className={styles.trustContent}>
        <h2 id="home-trust-title" className={styles.trustTitle}>十年持续运营</h2>
        <div className={styles.trustStats}>
          {["12000+ 用户", "2.5 PB+ 累计下载", "40 TB+ 月均下载"].map((stat) => (
            <p key={stat} data-trust-stat className={styles.trustStat}>{stat}</p>
          ))}
        </div>
        <div className={styles.trustConstellation} aria-hidden="true">
          <BrandLogoStrip itemClassName={styles.trustLogo} imageClassName={styles.trustLogoImage} />
        </div>
      </div>
    </section>
  );
}
