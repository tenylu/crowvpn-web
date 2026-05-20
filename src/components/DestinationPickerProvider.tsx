"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DestinationPickerContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  /** 与首页「搜索目的地」一致：打开连接节点弹窗 */
  openDestinationPicker: () => void;
};

const DestinationPickerContext = createContext<DestinationPickerContextValue | null>(null);

export function DestinationPickerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openDestinationPicker = useCallback(() => setOpen(true), []);

  const value = useMemo(
    () => ({ open, setOpen, openDestinationPicker }),
    [open],
  );

  return (
    <DestinationPickerContext.Provider value={value}>{children}</DestinationPickerContext.Provider>
  );
}

export function useDestinationPicker() {
  const ctx = useContext(DestinationPickerContext);
  if (!ctx) {
    throw new Error("useDestinationPicker must be used within DestinationPickerProvider");
  }
  return ctx;
}
