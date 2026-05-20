export type CultureIconKey = "growth" | "balance" | "culture" | "together" | "office";

export type AboutCultureTextItem = {
  id: string;
  kind: "text";
  icon: CultureIconKey;
  title: string;
  body: string;
  badge?: boolean;
};

export type AboutCultureImageItem = {
  id: string;
  kind: "image";
  photo: string;
  alt: string;
  aspect: "landscape" | "portrait" | "tall";
};

export type AboutCultureColumn = {
  id: string;
  width: "title" | "narrow" | "medium" | "wide";
  top?: AboutCultureTextItem | AboutCultureImageItem;
  bottom?: AboutCultureTextItem | AboutCultureImageItem;
};

/** 横向滚动：双格列等高对齐，竖图单列随同行拉伸 */
export const aboutCultureColumns: AboutCultureColumn[] = [
  {
    id: "growth",
    width: "narrow",
    top: {
      id: "growth",
      kind: "text",
      icon: "growth",
      title: "成长机遇",
      body: "鼓励在真实问题里成长：从事故复盘、性能优化到用户反馈闭环，让贡献可被看见。",
    },
    bottom: {
      id: "growth-photo",
      kind: "image",
      photo: "/images/about/culture-01.png",
      alt: "CrowVPN 团队学习与成长",
      aspect: "landscape",
    },
  },
  {
    id: "office",
    width: "narrow",
    top: {
      id: "trust-photo",
      kind: "image",
      photo: "/images/about/culture-02.png",
      alt: "CrowVPN 职场信任与协作",
      aspect: "landscape",
    },
    bottom: {
      id: "office",
      kind: "text",
      icon: "office",
      title: "办公室里的节奏",
      body: "远程与线下交替，白板、咖啡和一段能说完的会议，构成我们习惯的协作方式。",
    },
  },
  {
    id: "team-photo",
    width: "narrow",
    top: {
      id: "team-photo",
      kind: "image",
      photo: "/images/about/culture-03.png",
      alt: "CrowVPN 团队协作",
      aspect: "tall",
    },
  },
  {
    id: "balance",
    width: "narrow",
    top: {
      id: "balance",
      kind: "text",
      icon: "balance",
      title: "工作与生活平衡",
      body: "以清晰目标与文档协作减少无效会议，尊重不同时区与生活方式。",
      badge: true,
    },
    bottom: {
      id: "together-photo",
      kind: "image",
      photo: "/images/about/culture-04.png",
      alt: "CrowVPN 团队活动",
      aspect: "landscape",
    },
  },
  {
    id: "culture",
    width: "narrow",
    top: {
      id: "culture",
      kind: "text",
      icon: "culture",
      title: "文化与社区",
      body: "对事不对人，欢迎质疑与数据；把每一次上线都当作与用户之间的承诺。",
    },
    bottom: {
      id: "together",
      kind: "text",
      icon: "together",
      title: "一起鼓掌的时刻",
      body: "复盘、发布、突破之后，我们习惯用一次真诚的回应，肯定彼此付出的那一程。",
    },
  },
  {
    id: "daily-photo",
    width: "narrow",
    top: {
      id: "daily-photo",
      kind: "image",
      photo: "/images/about/culture-05.png",
      alt: "CrowVPN 团队日常",
      aspect: "portrait",
    },
  },
] as const;

export const cultureSectionCopy = {
  title: "我们的职场氛围",
  subtitle: "远程与办公室协作结合，重视信任、节奏与可复盘的结果。",
} as const;
