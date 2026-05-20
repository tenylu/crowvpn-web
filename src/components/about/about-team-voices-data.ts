/** 团队心声：照片位于 public/images/about/voice-*.png */
export const aboutTeamVoices = [
  {
    id: "marcus-wright",
    name: "Marcus Wright",
    role: "CrowVPN · 产品负责人",
    photo: "/images/about/voice-marcus-wright.png",
    quote:
      "我印象最深的是用户发来的那句「刚才那通会议要是断了就麻烦了」。对我们来说，产品不是功能清单，而是帮大家在关键时刻少操一份心。",
  },
  {
    id: "ryan-chen",
    name: "Ryan Chen",
    role: "CrowVPN · 首席工程师",
    photo: "/images/about/voice-ryan-chen.png",
    quote:
      "改一行路由之前，我会先问自己：如果此刻是我自己在机场赶飞机，我会不会放心连上？答案若是犹豫，就再打磨一轮。",
  },
  {
    id: "sophia-lin",
    name: "Sophia Lin",
    role: "CrowVPN · 客户支持主管",
    photo: "/images/about/voice-sophia-lin.png",
    quote:
      "用户遇到问题时，最需要的是有人认真听、快速回应。我们不只是解答疑问，更希望每次沟通都能让他们觉得——选择 CrowVPN 是对的。",
  },
  {
    id: "james-wu",
    name: "James Wu",
    role: "CrowVPN · 运维工程师",
    photo: "/images/about/voice-james-wu.png",
    quote:
      "凌晨的告警不是负担，是系统在告诉我们哪里还可以更好。每一次处理完，我都会想：下次能不能让用户完全感知不到这件事发生过。",
  },
] as const;

export type AboutTeamVoice = (typeof aboutTeamVoices)[number];
