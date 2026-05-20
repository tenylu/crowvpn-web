/** 与首页「他们都在使用」条一致，供信任背书与评价模块复用 */
export const PRESS_LOGOS = [
  { src: "/images/logo/dji.svg", alt: "DJI", width: 96, height: 28 },
  { src: "/images/logo/nio.svg", alt: "NIO", width: 96, height: 28 },
  { src: "/images/logo/lark.svg", alt: "Lark", width: 108, height: 28 },
  { src: "/images/logo/peng.svg", alt: "小鹏", width: 110, height: 28 },
  { src: "/images/logo/wechat.svg", alt: "微信", width: 120, height: 28 },
  { src: "/images/logo/xiaomi.svg", alt: "小米", width: 108, height: 28 },
  { src: "/images/logo/Li_Auto.svg", alt: "理想汽车", width: 118, height: 28 },
] as const;

export type PressLogo = (typeof PRESS_LOGOS)[number];
