"use client";

import { createPortal } from "react-dom";
import type { ComponentProps } from "react";

/** Keep modal overlays outside page stacking contexts and decorative layers. */
export function ModalLayer(props: ComponentProps<"div">) {
  if (typeof document === "undefined") return null;
  return createPortal(<div {...props} style={{ ...props.style, zIndex: 2147483647 }} />, document.body);
}
