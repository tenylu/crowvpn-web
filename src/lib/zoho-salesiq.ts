type ZohoSalesiq = {
  floatwindow?: { open?: () => void };
  ready?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    $zoho?: { salesiq?: ZohoSalesiq };
  }
}

/** Open the site-wide Zoho SalesIQ chat float (bottom-right widget). */
export function openZohoSalesiqChat() {
  if (typeof window === "undefined") return;

  const open = () => {
    window.$zoho?.salesiq?.floatwindow?.open?.();
  };

  const salesiq = window.$zoho?.salesiq;
  if (salesiq?.floatwindow?.open) {
    open();
    return;
  }

  window.$zoho = window.$zoho || {};
  window.$zoho.salesiq = window.$zoho.salesiq || {};
  const previousReady = window.$zoho.salesiq.ready;
  window.$zoho.salesiq.ready = (...args: unknown[]) => {
    previousReady?.(...args);
    open();
  };

  // Widget already loaded but API not ready yet — also try clicking the float.
  document.getElementById("zsiq_float")?.click();
}
