import Script from "next/script";

const ZOHO_WIDGET_SRC =
  "https://salesiq.zohopublic.com/widget?wc=siq661b3c690233e140e667eb2011f71bacbde8e0374600c18ca43af18d499fa838";

/**
 * Zoho SalesIQ 在线客服。使用 lazyOnload 降低对首屏的影响。
 * @see https://www.zoho.com/salesiq/help/developer-section/javascript-api.html
 */
export function ZohoSalesIQ() {
  return (
    <>
      <Script id="zoho-salesiq-init" strategy="afterInteractive">
        {`window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`}
      </Script>
      <Script id="zsiqscript" src={ZOHO_WIDGET_SRC} strategy="lazyOnload" />
    </>
  );
}
