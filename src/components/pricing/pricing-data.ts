export type BillingPeriod = "1" | "3" | "6" | "12" | "24";

export type PlanId = "entry" | "standard" | "flagship" | "premium";

export type CrowmeshCheckoutPeriod = "month" | "quarter" | "half_year" | "year" | "two_year";

export type FeatureValue = boolean | "dash";

export type PlanHighlight = {
  label: string;
  included: boolean;
  /** 若有值：在文案下显示流量参考条（共 18 段，点亮数为该字段；尊享档预留 6 段不点亮） */
  trafficBarSegments?: number;
};

export type FeatureRow = {
  id: string;
  label: string;
  /** 无 cellText 时用于套餐列勾选 */
  values: Record<PlanId, FeatureValue>;
  /** 若有：套餐列显示数量/规格文案，不显示勾选 */
  cellText?: Record<PlanId, string>;
};

export type FeatureCategory = {
  id: string;
  label: string;
  features: FeatureRow[];
};

export const billingOptions: { id: BillingPeriod; label: string; months: number }[] = [
  { id: "1", label: "月付", months: 1 },
  { id: "3", label: "季付", months: 3 },
  { id: "6", label: "半年付", months: 6 },
  { id: "12", label: "年付", months: 12 },
  { id: "24", label: "两年付", months: 24 },
];

/** 定价页周期切换器仅展示这三档（总价数据仍保留季付、半年付等 key 供扩展） */
export const billingToggleOptions: { id: BillingPeriod; label: string; months: number }[] = [
  { id: "1", label: "月付", months: 1 },
  { id: "12", label: "年付", months: 12 },
  { id: "24", label: "两年付", months: 24 },
];

/** 各周期套餐总价（人民币，与后台定价一致） */
export const pricingPlans = [
  {
    id: "entry" as const,
    checkoutPlanId: 1,
    productName: "C15Mini",
    shortLabel: "入门C15",
    tierName: "入门",
    popular: false,
    pricesCny: { "1": 10, "3": 28, "6": 54, "12": 96, "24": 168 },
    cta: "获取 C15Mini",
    highlights: [
      { label: "每月50G流量", included: true, trafficBarSegments: 2 },
      { label: "2台设备同时在线", included: true },
      { label: "20M网络带宽", included: true },
      { label: "12条入门级节点", included: true },
      { label: "4条高级节点", included: true },
      { label: "访问所有海外网站", included: true },
      { label: "VPN网络保护", included: true },
    ],
  },
  {
    id: "standard" as const,
    checkoutPlanId: 2,
    productName: "C50G",
    shortLabel: "标准G50",
    tierName: "标准",
    popular: true,
    pricesCny: { "1": 15, "3": 42, "6": 80, "12": 144, "24": 250 },
    cta: "获取 C50G",
    highlights: [
      { label: "每月120G流量", included: true, trafficBarSegments: 4 },
      { label: "5台设备同时在线", included: true },
      { label: "50M网络带宽", included: true },
      { label: "5条入门级节点", included: true },
      { label: "20条高级节点", included: true },
      { label: "2条旗舰级节点", included: true },
      { label: "访问所有海外网站", included: true },
      { label: "VPN网络保护", included: true },
      { label: "流氓广告拦截", included: true },
      { label: "访问视频网站加速", included: true },
    ],
  },
  {
    id: "flagship" as const,
    checkoutPlanId: 3,
    productName: "C120Pro",
    shortLabel: "旗舰G120",
    tierName: "旗舰",
    popular: false,
    pricesCny: { "1": 30, "3": 85, "6": 162, "12": 288, "24": 500 },
    cta: "获取 C120Pro",
    highlights: [
      { label: "每月250G流量", included: true, trafficBarSegments: 8 },
      { label: "8台设备同时在线", included: true },
      { label: "500M网络带宽", included: true },
      { label: "5条高级节点", included: true },
      { label: "14条旗舰级节点", included: true },
      { label: "2条尊享级节点", included: true },
      { label: "访问所有海外网站", included: true },
      { label: "VPN网络保护", included: true },
      { label: "流氓广告拦截", included: true },
      { label: "访问视频网站加速", included: true },
      { label: "访问大模型加速", included: true },
    ],
  },
  {
    id: "premium" as const,
    checkoutPlanId: 10,
    productName: "C200Ultra",
    shortLabel: "尊享C200",
    tierName: "尊享",
    popular: false,
    pricesCny: { "1": 60, "3": 177, "6": 350, "12": 576, "24": 1000 },
    cta: "获取 C200Ultra",
    highlights: [
      { label: "每月600G流量", included: true, trafficBarSegments: 12 },
      { label: "20台设备同时在线", included: true },
      { label: "1000M网络带宽", included: true },
      { label: "14条旗舰级节点", included: true },
      { label: "8条尊享级节点", included: true },
      { label: "4条ISP专线节点", included: true },
      { label: "访问所有海外网站", included: true },
      { label: "VPN网络保护", included: true },
      { label: "流氓广告拦截", included: true },
      { label: "访问视频网站加速", included: true },
      { label: "访问大模型加速", included: true },
      { label: "白名单IP", included: true },
    ],
  },
] as const;

export const planOrder: PlanId[] = pricingPlans.map((plan) => plan.id);

export function periodMonths(period: BillingPeriod): number {
  return billingOptions.find((o) => o.id === period)?.months ?? 1;
}

export function monthlyEquivalentCny(totalCny: number, period: BillingPeriod): number {
  return totalCny / periodMonths(period);
}

export function savingsPercent(plan: (typeof pricingPlans)[number], period: BillingPeriod): number {
  if (period === "1") return 0;
  const monthly = monthlyEquivalentCny(plan.pricesCny[period], period);
  const monthlyPay = plan.pricesCny["1"];
  return Math.max(0, Math.round((1 - monthly / monthlyPay) * 100));
}

export function formatPeriodNote(
  period: BillingPeriod,
  totalCny: number,
  formatPrice: (cny: number) => string,
): string {
  const opt = billingOptions.find((o) => o.id === period);
  if (period === "1") return "按月计费，随时可取消";
  return `${opt?.label ?? ""}总计 ${formatPrice(totalCny)}`;
}

const allPlans: Record<PlanId, true> = { entry: true, standard: true, flagship: true, premium: true };

export const featureCategories: FeatureCategory[] = [
  {
    id: "specs",
    label: "套餐规格",
    features: [
      {
        id: "spec-traffic",
        label: "月度流量",
        values: { entry: true, standard: true, flagship: true, premium: true },
        cellText: {
          entry: "50G/月",
          standard: "120G/月",
          flagship: "250G/月",
          premium: "600G/月",
        },
      },
      {
        id: "spec-devices",
        label: "在线设备",
        values: { entry: true, standard: true, flagship: true, premium: true },
        cellText: {
          entry: "2台",
          standard: "5台",
          flagship: "8台",
          premium: "20台",
        },
      },
      {
        id: "spec-bandwidth",
        label: "峰值带宽",
        values: { entry: true, standard: true, flagship: true, premium: true },
        cellText: {
          entry: "20M",
          standard: "50M",
          flagship: "500M",
          premium: "1000M",
        },
      },
    ],
  },
  {
    id: "nodes-module",
    label: "节点线路",
    features: [
      {
        id: "nodes-entry-tier",
        label: "入门节点",
        values: { entry: true, standard: true, flagship: true, premium: true },
        cellText: {
          entry: "12条",
          standard: "5条",
          flagship: "—",
          premium: "—",
        },
      },
      {
        id: "nodes-advanced-tier",
        label: "高级节点",
        values: { entry: true, standard: true, flagship: true, premium: true },
        cellText: {
          entry: "4条",
          standard: "20条",
          flagship: "5条",
          premium: "—",
        },
      },
      {
        id: "nodes-flagship-tier",
        label: "旗舰节点",
        values: { entry: true, standard: true, flagship: true, premium: true },
        cellText: {
          entry: "—",
          standard: "2条",
          flagship: "14条",
          premium: "14条",
        },
      },
      {
        id: "nodes-exclusive-tier",
        label: "尊享节点",
        values: { entry: true, standard: true, flagship: true, premium: true },
        cellText: {
          entry: "—",
          standard: "—",
          flagship: "2条",
          premium: "8条",
        },
      },
      {
        id: "nodes-isp-tier",
        label: "专线节点",
        values: { entry: true, standard: true, flagship: true, premium: true },
        cellText: {
          entry: "—",
          standard: "—",
          flagship: "—",
          premium: "4条",
        },
      },
    ],
  },
  {
    id: "services",
    label: "网络能力",
    features: [
      {
        id: "overseas",
        label: "访问所有海外网站",
        values: allPlans,
      },
      {
        id: "vpn-protect",
        label: "VPN网络保护",
        values: allPlans,
      },
      {
        id: "ad-block-rogue",
        label: "流氓广告拦截",
        values: { entry: false, standard: true, flagship: true, premium: true },
      },
      {
        id: "video-accel",
        label: "访问视频网站加速",
        values: { entry: false, standard: true, flagship: true, premium: true },
      },
      {
        id: "llm-accel",
        label: "访问大模型加速",
        values: { entry: false, standard: false, flagship: true, premium: true },
      },
      {
        id: "whitelist-ip",
        label: "白名单IP",
        values: { entry: false, standard: false, flagship: false, premium: true },
      },
    ],
  },
];

export const whyChooseItems = [
  {
    title: "30 天退款保证",
    body: "改主意了？没关系。若您觉得服务不适合，可在注册后 30 天内申请退款。",
    icon: "shield" as const,
  },
  {
    title: "服务器覆盖全球",
    body: "连接覆盖多国家/地区的优质节点，线路持续升级，跨境访问更稳定流畅。",
    icon: "server" as const,
  },
  {
    title: "经审查的无日志政策",
    body: "我们不会跟踪、记录或存储您的浏览活动，隐私由您自己掌控。",
    icon: "audit" as const,
  },
] as const;

export const checkoutPeriodByBillingPeriod: Record<BillingPeriod, CrowmeshCheckoutPeriod> = {
  "1": "month",
  "3": "quarter",
  "6": "half_year",
  "12": "year",
  "24": "two_year",
};

export function crowmeshBuyPath(planId: number, period: BillingPeriod): string {
  return `/subscription/balance/${planId}?period=${checkoutPeriodByBillingPeriod[period]}`;
}

export function crowmeshBuyUrl(planId: number, period: BillingPeriod): string {
  return `/go/buy?planId=${planId}&period=${checkoutPeriodByBillingPeriod[period]}`;
}

export function crowmeshBuyWithLoginUrl(planId: number, period: BillingPeriod): string {
  return `/go/login?redirect=${encodeURIComponent(crowmeshBuyPath(planId, period))}`;
}
