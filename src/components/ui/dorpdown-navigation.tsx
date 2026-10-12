"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import styles from "./dropdown-navigation.module.css";

const NavigationContext = createContext<{
  active: string | null;
  activate: (id: string | null) => void;
  close: (id: string) => void;
}>({ active: null, activate: () => {}, close: () => {} });

/** One shared layout scope lets the highlight and panel move between triggers. */
export function DropdownNavigation({ children }: { children: ReactNode }) {
  const [active, activate] = useState<string | null>(null);
  const close = useCallback((id: string) => activate(current => current === id ? null : current), []);
  const id = useId();
  return <NavigationContext.Provider value={{ active, activate, close }}>
    <LayoutGroup id={id}>{children}</LayoutGroup>
  </NavigationContext.Provider>;
}

export function DropdownNavigationItem({ label, children, href, external, className = "", panelClassName = "", ariaLabel }: {
  label: ReactNode;
  children?: ReactNode;
  href?: string;
  external?: boolean;
  className?: string;
  panelClassName?: string;
  ariaLabel?: string;
}) {
  const id = useId();
  const { active, activate, close } = useContext(NavigationContext);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  const selected = active === id;
  const open = selected && !!children;
  const cancelClose = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!selected) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) activate(null);
    };
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [selected, activate]);

  const content = <>
    {selected && <motion.span aria-hidden className={styles.highlight} layoutId="nav-hover"
      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 36 }} />}
    <span className={styles.label}>{label}</span>
    {children && <ChevronDown aria-hidden size={15} className={styles.chevron} style={{ transform: open ? "rotate(180deg)" : undefined }} />}
  </>;

  return <div ref={root} className={`${styles.item} ${className}`}
    onPointerEnter={(event) => { if (event.pointerType !== "touch") { cancelClose(); activate(id); } }}
    onPointerLeave={(event) => {
      if (event.pointerType === "touch" || root.current?.contains(document.activeElement)) return;
      cancelClose();
      timer.current = setTimeout(() => close(id), 180);
    }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) { cancelClose(); close(id); } }}
    onKeyDown={(event) => {
      if (event.key === "Escape") { cancelClose(); activate(null); trigger.current?.focus(); }
      if (event.key === "ArrowDown" && event.target === trigger.current) {
        event.preventDefault(); activate(id);
        requestAnimationFrame(() => root.current?.querySelector<HTMLElement>("[data-dropdown-panel] a, [data-dropdown-panel] button")?.focus());
      }
    }}>
    {href ? <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
      className={styles.trigger} onFocus={() => activate(id)} onClick={() => activate(null)}>{content}</Link>
      : <button ref={trigger} type="button" className={styles.trigger} aria-label={ariaLabel}
        aria-expanded={open} aria-controls={open ? `${id}-panel` : undefined}
        onClick={() => { cancelClose(); activate(open ? null : id); }}>{content}</button>}
    <AnimatePresence initial={false}>
      {open && <motion.div key="panel" id={`${id}-panel`} data-dropdown-panel className={styles.bridge}
        initial={{ opacity: 0, y: reduced ? 0 : 4 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, pointerEvents: "none", transition: { duration: reduced ? 0 : .08 } }}
        transition={{ duration: reduced ? 0 : .18, ease: [.22, 1, .36, 1] }}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a,button")) { activate(null); trigger.current?.focus(); }
        }}>
        <div className={`${styles.panel} ${panelClassName}`}>
          <div className={styles.panelContent}>{children}</div>
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
