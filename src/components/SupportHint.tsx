"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./SupportHint.module.css";

const dismissedKey = "crowvpn:support-hint-dismissed";

export function SupportHint() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const hint = ref.current;
    if (!hint || pathname !== "/") return;
    let dismissed = false;
    try { dismissed = sessionStorage.getItem(dismissedKey) === "1"; } catch { /* Storage is optional. */ }
    let readyAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const dismiss = () => {
      dismissed = true;
      hint.hidden = true;
      try { sessionStorage.setItem(dismissedKey, "1"); } catch { /* Storage is optional. */ }
    };
    const sync = () => {
      clearTimeout(timer);
      if (dismissed) return;
      const ready = document.getElementById("vpn-intro")?.dataset.cabinReady === "true";
      if (!ready) {
        readyAt = 0;
        hint.hidden = true;
        return;
      }
      if (!readyAt) readyAt = Date.now();
      const remaining = 2000 - (Date.now() - readyAt);
      if (remaining > 0) {
        timer = setTimeout(sync, remaining);
        return;
      }
      const avatar = document.getElementById("zsiq_float");
      const rect = avatar?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) { hint.hidden = true; return; }
      hint.style.right = `${window.innerWidth - rect.left + 12}px`;
      hint.style.maxWidth = `${Math.max(0, rect.left - 24)}px`;
      hint.style.bottom = `${window.innerHeight - rect.top - rect.height / 2}px`;
      hint.hidden = false;
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && (target.closest("#zsiq_float") || target.closest("[data-support-hint-close]"))) dismiss();
    };
    // The third-party avatar can arrive after the cabin has already finished.
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", onClick, true);
    window.addEventListener("crowvpn:cabin-visibility", sync);
    window.addEventListener("resize", sync);
    sync();
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("crowvpn:cabin-visibility", sync);
      window.removeEventListener("resize", sync);
      hint.hidden = true;
    };
  }, [pathname]);

  return (
    <div ref={ref} hidden className={styles.hint} role="status">
      <span>需要帮助？随时联系我们</span>
      <button type="button" data-support-hint-close aria-label="关闭客服提示" className={styles.close}>×</button>
    </div>
  );
}
