const SUPPORT_CHAT_URL =
  "https://salesiq.zohopublic.com/signaturesupport.ls?widgetcode=dbde6ec4b7a80e04beb5f35811b2e9df7b8d535222fe185d2d3b4d7f95fbeb0f";

/**
 * 安全页底部：浅灰圆角卡片 + 说明 +「联系我们」外链（Zoho SalesIQ）。
 */
export function SupportCtaSection() {
  return (
    <section id="support" className="scroll-mt-24 bg-[var(--background)] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
        <div className="rounded-[28px] bg-[#eceef1] px-8 py-10 sm:rounded-[32px] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">全天候客户支持</h2>
          <p className="mt-4 max-w-none text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            连接异常、套餐或配置有疑问时，CrowVPN 支持团队可协助你排查与处理。
          </p>
          <a
            href={SUPPORT_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-[#171717] bg-transparent px-7 py-2.5 text-sm font-semibold text-[#171717] transition hover:bg-black/[0.06] sm:mt-10 sm:px-8 sm:py-3"
          >
            联系我们
          </a>
        </div>
      </div>
    </section>
  );
}
