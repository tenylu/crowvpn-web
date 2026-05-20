import Link from "next/link";

const pricingFaqs = [
  {
    id: "renew",
    q: "我的订阅会自动续费吗？",
    a: "是否在到期后自动续费取决于你在结账渠道（如应用商店或合作支付页）的设定。建议在账户或订单页面确认续费开关，并在扣款前留意邮件或站内通知。",
  },
  {
    id: "refund",
    q: "如何申请退款？",
    a: "我们提供 30 天退款保证。若你在首次购买后的规定期限内符合退款条件，可通过购买时收到的订单说明或客服渠道提交申请，处理进度会以你预留的联系方式反馈。",
  },
  {
    id: "devices",
    q: "一个账号可以在多少台设备上使用？",
    a: "同时在线设备上限随套餐不同而变化，具体数量请对照定价页中的「在线设备」一行。你可以在多台设备上安装客户端，但同时保持连接的设备数请勿超过套餐说明。",
  },
  {
    id: "upgrade",
    q: "我可以升级或降级套餐吗？",
    a: "可以按当前政策在账户内调整套餐档位。升级通常会按剩余周期折算差价；降级规则以结算页或客服说明为准。若页面未展示选项，请联系支持协助处理。",
  },
  {
    id: "traffic",
    q: "流量是如何计算与重置的？",
    a: "套餐中的流量多为按月统计与重置，具体额度见各档「月度流量」说明。仅通过 VPN 转发的流量会计入用量；本地直连或局域网流量一般不计入。",
  },
  {
    id: "payment",
    q: "支持哪些支付方式？",
    a: "结账页会展示当前可用的支付方式（如银行卡、常用第三方支付等），以你结算时页面显示为准。若某种方式暂时不可用，可尝试更换渠道或联系支持。",
  },
  {
    id: "start",
    q: "购买后多久可以开始使用？",
    a: "支付成功并开通账号权限后，即可在客户端登录并选择节点连接。若遇激活延迟，请检查邮箱中的说明或刷新客户端；长时间未生效请联系客服核对订单。",
  },
  {
    id: "nodes",
    q: "节点与带宽会随套餐变化吗？",
    a: "是的。不同套餐对应不同等级的节点池与带宽上限，详见定价对比表中的「节点线路」与「峰值带宽」。升级套餐通常可获得更高规格线路与更大并发能力。",
  },
] as const;

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PricingFaqSection() {
  return (
    <section className="border-t border-[var(--border)] bg-white py-16 sm:py-20" aria-labelledby="pricing-faq-heading">
      <div className="mx-auto max-w-[var(--page-max)] px-6 lg:px-10">
        <h2 id="pricing-faq-heading" className="text-center text-2xl font-semibold text-[#171717] sm:text-3xl">
          常见问题
        </h2>

        <div className="mx-auto mt-10 max-w-3xl">
          {pricingFaqs.map((item) => (
            <details key={item.id} className="group border-b border-[var(--border)] first:border-t first:border-[var(--border)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 pr-1 text-left text-base font-normal text-[#171717] outline-none select-none [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1 leading-snug">{item.q}</span>
                <ChevronIcon className="h-5 w-5 shrink-0 text-[#171717] transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="pb-5 pl-0 pr-8 text-sm leading-relaxed text-[var(--muted)] sm:text-base sm:pr-10">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/security#support"
            className="inline-flex items-center gap-2.5 text-sm text-[var(--muted)] transition-colors hover:text-[#171717]"
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#9ca3af] text-[13px] font-semibold leading-none text-white"
              aria-hidden
            >
              ?
            </span>
            <span>查看更多常见问题</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
