/**
 * 安全页正文区：参考「左大标题 + 右说明」的杂志式排版，白底、层级清晰。
 */
export function SecurityContentLayout() {
  return (
    <section className="border-t border-[var(--border)]/60 bg-transparent py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0 xl:gap-x-24">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
            出行与办公，多一层加密保护
          </h2>
          <div className="max-w-xl space-y-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            <p>公共 Wi‑Fi、可疑热点里，监听与劫持并不罕见。</p>
            <p>CrowVPN 用加密隧道与清晰线路策略，减少断线与排查成本，把时间留给正事。</p>
          </div>
        </div>
      </div>
    </section>
  );
}
