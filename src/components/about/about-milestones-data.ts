/** 当前时间轴封面 PNG 统一为 16:9，与卡片头图 `aspect-ratio` 一致可避免 object-cover 裁切。 */
export const aboutTimelineCoverAspectRatio = "16 / 9" as const;

/** 关于我们页「使命与历程」时间轴：自 2014 起按时间排序至今年。封面图位于 public/images/about/，英文文件名便于引用。 */
export const aboutMilestones = [
  {
    date: "2014 年",
    title: "起源",
    body: "由公司内部员工从真实办公与差旅场景起步：先解决自家团队的跨境与公共网络连接，为后续产品化埋下种子。",
    cover: "/images/about/timeline-2014-v7.png",
  },
  {
    date: "2016 年",
    title: "内部验证",
    body: "在小范围团队内长期试用，迭代加密隧道与基础节点调度，验证「连得上、连得稳」这一底线。",
    cover: "/images/about/timeline-2016-v7.png",
  },
  {
    date: "2018 年",
    title: "架构定型",
    body: "把分散脚本收拢为可维护的服务与配置体系，明确故障隔离与回滚路径，为规模化做准备。",
    cover: "/images/about/timeline-2018-v7.png",
  },
  {
    date: "2020 年",
    title: "多端统一",
    body: "桌面与移动端体验对齐：统一账号、连接状态与基础诊断，降低不同设备上的使用心智负担。",
    cover: "/images/about/timeline-2020-v7.png",
  },
  {
    date: "2022 年",
    title: "全球线路",
    body: "扩充多地区出口与策略路由，让不同网络环境下都能更快匹配到合适线路。",
    cover: "/images/about/timeline-2022-v7.png",
  },
  {
    date: "2023 年",
    title: "可视化管理",
    body: "把用量、连接时长与节点健康度做成看得见的面板，问题定位从「猜」变成「有据可查」。",
    cover: "/images/about/timeline-2023-v7.png",
  },
  {
    date: "2024 年 3 月",
    title: "公开亮相",
    body: "客户端面向更多用户开放，多地区线路组合与一键连接成为默认体验。",
    cover: "/images/about/timeline-2024-03-v7.png",
  },
  {
    date: "2024 年 12 月",
    title: "安全加固",
    body: "补齐 DNS 与常见跟踪拦截能力，把公共网络风险尽量挡在应用侧第一道门外。",
    cover: "/images/about/timeline-2024-12-v7.png",
  },
  {
    date: "2025 年",
    title: "策略与扩展",
    body: "持续扩充线路与策略模板，针对不同场景提供更省心的默认方案与更新节奏。",
    cover: "/images/about/timeline-2025-v7.png",
  },
  {
    date: "2026 年（今年）",
    title: "持续进化",
    body: "聚焦稳定性、隐私边界与合规沟通，把同事自用的严谨态度延续到每一次发版与运维。",
    cover: "/images/about/timeline-2026-v7.png",
  },
] as const;

export type AboutMilestone = (typeof aboutMilestones)[number];
