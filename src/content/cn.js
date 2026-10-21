/**
 * 首页文案 —— 逐字取自 docs/design/copy/01-首页.txt 与 11-全站通用组件.txt
 * 改文案请优先改这里，组件只负责排版。
 * 【待填：xxx】为占位符，上线前必须替换或删除，清单见 00-文案总纲.txt
 */

import jwFabric from '../assets/trust-bar/jw-fabric-logo.png'
import raidenAntiques from '../assets/trust-bar/raiden-antiques-logo.png'
import cesasc from '../assets/trust-bar/cesasc-logo.png'
import seren from '../assets/trust-bar/seren-logo.png'
import boxOfFun from '../assets/trust-bar/box-of-fun-logo.png'
import sindyFish from '../assets/trust-bar/sindy-fish-logo.png'
import chest from '../assets/trust-bar/chest-logo.png'
import posterClinic from '../assets/hero/case-01.png'
import posterEcommerce from '../assets/hero/case-02.jpg'
import posterCrespan from '../assets/hero/case-03.jpg'
import posterEva from '../assets/hero/case-04.png'
import clinicLogo from '../assets/cases/clinic/pms-logo.jpg'
import clinicShot from '../assets/cases/clinic/medplum-01.png'
import shopifyLogo from '../assets/work-in/shopify-logo.png'
import wooCommerceLogo from '../assets/work-in/woo-commerce-logo.png'
import drupalLogo from '../assets/work-in/drupal-logo.png'
import awsLogo from '../assets/work-in/aws-logo.png'
import openaiLogo from '../assets/work-in/openai-logo.png'
import aemLogo from '../assets/work-in/aem-logo.png'
import rednoteCode from '../assets/contact/rednote-code.jpg'
import wechatCode from '../assets/contact/wechat-code.jpg'

export const BRAND = '36 Tech'

/* 已服务的出海品牌。顺序即展示顺序。
   url / blurb 供 TrustBar 点开后的详情面板使用：
   url 留空时详情里的「访问网站」按钮会置灰，不会渲染成坏链接。
   【待填：xxx】为占位符，上线前必须替换，清单见 00-文案总纲.txt */
export const CLIENTS = [
  {
    name: 'JW 防火科技',
    logo: jwFabric,
    url: 'https://jm.36techfreedom.com',
    blurb: 'JW 防火材料的 WooCommerce 站。',
  },
  {
    name: '雷记古物',
    logo: raidenAntiques,
    url: 'https://lei.36tech.info',
    blurb: '雷记古物的 Shopify 古玩店。',
  },
  {
    name: '南加州科工会',
    logo: cesasc,
    url: 'https://cesasc.org',
    blurb: '【待填：一句话简介】',
  },
  {
    name: '宁境客栈',
    logo: seren,
    url: 'https://isamuyun.github.io/seren-site/',
    blurb: '【待填：一句话简介】',
  },
  {
    name: '乐盒包装物',
    logo: boxOfFun,
    url: 'https://www.newbeelink.com/',
    blurb:
      '乐盒包装物是面向美国市场的包装供应商。他们的 Shopify 店铺向小商家出售定制纸盒、包装袋与标签。站点从零搭建，主题定制，商品选项做全。',
  },
  {
    name: '云端之燏',
    logo: sindyFish,
    url: 'https://sindyfish.cloud',
    blurb: '国内的心理咨询工作室。站点是一份带预约表单的介绍页。',
  },
]

/* WorkInBar 的技术栈图标。顺序即展示顺序，名称是品牌名，两种语言相同。 */
export const WORK_IN = [
  { name: 'Shopify', logo: shopifyLogo },
  { name: 'WooCommerce', logo: wooCommerceLogo },
  { name: 'Drupal', logo: drupalLogo },
  { name: 'AWS', logo: awsLogo },
  { name: 'OpenAI', logo: openaiLogo },
  { name: 'AEM', logo: aemLogo },
]

// 四个能力域 —— 全站信息架构的骨架，Hero 主标题与服务分组共用同一套表述
export const DOMAINS = ['接得上', '跑得稳', '管得住', '算得清']

/* lines 的每一项可以是字符串，也可以是字符串数组。
   数组表示「短句组」：每句独立 nowrap（中文没有词边界，不控制会从句中断行），
   并在 Hero 里获得逐字翻起动画 + 下划线 + 句末方块的处理。 */
export const HERO_VARIANTS = [
  {
    id: 'main',
    label: '主推',
    lines: ['品牌的出海网站，应该', DOMAINS],
  },
  { id: 'a', label: '备选 A', lines: ['你的海外站点，', '值得一个真正懂技术的团队。'] },
  { id: 'b', label: '备选 B', lines: ['出海站点的全部技术环节，', '一个团队全包。'] },
  { id: 'c', label: '备选 C', lines: ['别让一个跑不动的网站，', '拖累你的海外生意。'] },
]

/* 首页 Hero 右侧轮播：四个 AI 核心案例，与英文版同一组图。
   图片在 src/assets/hero/case-0*.{png,jpg}，顺序 01–04 对应下面四项。
   顺序即展示顺序；label 用作缩略图按钮的无障碍名称；to 为案例页路径（不带语言前缀）。
   文案见 docs/homepage-plan.txt 第二节。 */
export const HERO_POSTERS = [
  {
    src: posterClinic,
    label: '心理诊所 · 报告核心',
    alt: 'Medplum 病历里 AI 生成的报告初稿，待咨询师审阅',
    to: '/cases/clinic',
  },
  {
    src: posterEcommerce,
    label: '电商公司 · 运营核心',
    alt: '一块看板：TikTok 与 Instagram 趋势、选品建议、批量处理中的产品图、订单与包裹状态',
    to: '/cases/ecommerce',
  },
  {
    src: posterCrespan,
    label: 'CRESpan · 商业地产检索核心',
    alt: '一句话提问，左侧列出邮编范围内的物业卡片',
    to: '/cases/crespan',
  },
  {
    src: posterEva,
    label: 'Eva · 站内顾问核心',
    alt: '站内顾问对话，回答带服务范围边界',
    to: '/cases/eva',
  },
]

export const PAINS = [
  {
    n: '01',
    title: 'ChatGPT仅在浏览器里',
    body: '工具买了，流程没变。AI 没有接进系统，只停留在浏览器，复制粘贴后就被丢存档了',
  },
  {
    n: '02',
    title: '数据不敢外传',
    body: '客户名单、病历、报价单、合同，丢进公开模型，老板睡不着。于是 AI 只能用来写写邮件，无法处理真正有价值的业务',
  },
  {
    n: '03',
    title: '做了个 Demo，却不能上线',
    body: '演示时很惊艳，接到真实业务上就乱答、乱承诺。没有红线、没有人工审阅、没有回退，没人敢对结果负责',
  },
  {
    n: '04',
    title: '每月账单看不懂',
    body: '模型调用费一个月比一个月高，没人知道如何控制成本，AI 生成的内容也没有被量化，无法评估 ROI',
  },
]

export const SERVICE_GROUPS = [
  {
    domain: '接得上',
    note: '接进现有系统，不推倒重来',
    items: [
      {
        no: '01',
        zh: 'AI 核心诊断',
        en: 'AI Engine Audit',
        body: '两周内出书面报告：哪些环节值得接 AI、接在哪一层、云端还是本地、成本区间。',
      },
      {
        no: '02',
        zh: 'AI 工作流搭建',
        en: 'AI Workflow Build',
        body: '把大模型接进 Medplum、Shopify、ERP、CRM，交付一条在跑的流程，不是一个演示。',
      },
      {
        no: '03',
        zh: '站点与系统基础',
        en: 'Site & System Foundations',
        body: '建站、迁移、现代化改造、SEO/GEO。AI 要落地，先得有一个接得上的系统。',
      },
    ],
  },
  {
    domain: '跑得稳',
    note: '多模型分流，稳定可维护',
    items: [
      {
        no: '04',
        zh: '对话式业务助手',
        en: 'Conversational Assistants',
        body: '面向客户的 AI 客服，面向内部的 AI 助手，用一句话代替查询界面，7×24 在线。',
      },
      {
        no: '05',
        zh: '多模型架构与成本治理',
        en: 'Multi-model Architecture',
        body: '按任务分流不同模型，自动降级，用量监控。一家挂了不停摆，账单看得懂。',
      },
    ],
  },
  {
    domain: '管得住',
    note: '数据不出门，人工审阅，可追溯',
    items: [
      {
        no: '06',
        zh: '本地化 AI 部署',
        en: 'On-premise AI',
        body: '在你自己的服务器上跑开源模型，数据不出公司。说清哪些任务本地够用、哪些要上云端。',
      },
      {
        no: '07',
        zh: 'AI 知识库与红线',
        en: 'Knowledge Base & Guardrails',
        body: '文档、工单、员工经验变成可问答的资产，答案有出处。上线前写清红线、人工审阅与回退。',
      },
    ],
  },
  {
    domain: '算得清',
    note: '耗时、采纳率、成本都有数',
    items: [
      {
        no: '08',
        zh: '效果量化与数据分析',
        en: 'Measurement & Analytics',
        body: '上线前定口径，上线后看数字：省下的工时、初稿采纳率、每次调用的成本。AI 是不是生产力，用数说话。',
      },
    ],
  },
]

export const PATHS = [
  {
    tag: '路径 A',
    title: '我要从零做一个海外站',
    body: '适合还没有海外站点，或现有站点已经无法继续使用的品牌。我们从选型开始，陪你走完建站、上线到持续运营。',
    cta: '查看建站方案',
  },
  {
    tag: '路径 B',
    title: '我的站点需要救',
    body: '适合已有站点，但速度慢、改不动、搜不到、数据乱的品牌。我们先诊断再动手，优先解决最影响生意的那几个问题。',
    cta: '预约站点诊断',
  },
]

export const WHY_US = [
  {
    title: '中文沟通，海外标准',
    body: '需求用中文讲清楚，不用翻译、不用熬夜开会。交付物按海外市场的合规、性能与可访问性标准来做。',
  },
  {
    title: '一个团队，全部环节',
    body: '建站、迁移、AI、SEO、数据在同一个团队内闭合。不会出现「建站方说是 SEO 的问题、SEO 方说是建站的问题」。',
  },
  {
    title: '先诊断，再动手',
    body: '我们不会一上来就劝你推倒重来。先出诊断报告，讲清楚哪些能救、哪些不值得救、优先级怎么排。',
  },
]

export const PROCESS = [
  {
    n: '01',
    title: 'AI 核心诊断',
    body: '说说你在用的系统、哪个环节最耗人、数据能不能出公司。两周内出书面报告：值不值得接、接在哪一层、云端还是本地、成本区间。',
  },
  {
    n: '02',
    title: '挑一条流程先做',
    body: '不做大而全。从报告里挑收益最大、风险最小的一条流程，写清范围、红线、人工审阅在哪一步，再报价。',
  },
  {
    n: '03',
    title: '接进系统，上线看数',
    body: '核心装进你现有的系统，先小范围试跑。上线前定好口径，上线后看数字：省下的工时、初稿采纳率、每次调用的成本。',
  },
  {
    n: '04',
    title: '按月迭代，逐步扩面',
    body: '第一条流程跑稳了，再接第二条。模型升级、知识库更新、成本优化按月做，可选。',
  },
]

export const FAQS = [
  {
    q: '我们的系统比较老，也能接 AI 吗？',
    a: '能。AI 核心是接在现有系统外面的一层，不要求换系统。只要系统有接口、数据库或导出口，就能接进去。诊所那套是基于 Medplum 的开源病历，电商那套是自建平台，都没有推倒重来。诊断阶段会先看清接口情况，再告诉你能接到什么程度。',
  },
  {
    q: '数据不能出公司，还能用大模型吗？',
    a: '可以，用本地化部署。模型跑在你自己的服务器上，数据不经过任何第三方。诊所案例用的是本地部署的 Qwen3 8B，报告全程没有离开诊所。哪些任务用本地模型、哪些可以走云端，诊断时按数据敏感度分清楚。',
  },
  {
    q: '和直接用 ChatGPT 有什么区别？',
    a: 'ChatGPT 是个聊天窗口，不认识你的业务、你的数据和你的系统。AI 核心把大模型、你的知识库和业务规则接在一起，结果直接写回系统，员工不用复制粘贴，也不用自己想提示词。能聊和能干活，差的就是这一层。',
  },
  {
    q: 'AI 的答案不靠谱怎么办？',
    a: '不让它直接对外。每条流程都设人工审阅节点，AI 出初稿，人来放行；回答必须基于你的知识库，查不到就说查不到；不能碰的红线写进规则。上线后持续看采纳率，低于预期就回头调。',
  },
  {
    q: '多久能看到效果？费用怎么算？',
    a: '诊断 5 个工作日出报告。第一条流程通常 4 到 8 周上线，上线当天就开始记耗时和采纳率，能不能用数据说话。费用分两段：第一条流程按项目报价，之后按月迭代。模型调用成本单独列出，云端还是本地、用大模型还是小模型，都会提前算清。',
  },
]

export const NAV_SERVICES = SERVICE_GROUPS.flatMap((g) =>
  g.items.map((i) => ({ ...i, domain: g.domain })),
)

export const FOOTER_COLUMNS = [
  {
    title: '服务',
    links: [
      'AI 核心诊断',
      'AI 工作流搭建',
      '对话式业务助手',
      '本地化 AI 部署',
      'AI 知识库与红线',
      '效果量化与数据分析',
      '站点与系统基础',
    ],
  },
  { title: '方案', links: ['打造 AI 核心', '还没开始接 AI', '试过但没落地', '数据不能出门'] },
  {
    title: '关于',
    // 字符串 = 暂无对应页面；对象 = 已有路由
    links: [{ label: '关于我们', to: '/about' }, '案例', { label: '联系我们', to: '/contact' }],
  },
]

/* ------------------------------------------------------------------
   关于我们 —— 逐字取自 docs/design/copy/10-关于我们.txt
------------------------------------------------------------------ */

export const ABOUT_HERO = {
  eyebrow: '关于 36 Tech',
  title: ['海外的标准，', '中文的沟通。'],
  lead: '我们是一支为中国出海品牌做海外站点技术的小团队。不大，但每个项目都有人真正对结果负责。',
}

export const ABOUT_GAP = {
  eyebrow: '我们为什么做这件事',
  title: '中间那道缝',
  paragraphs: [
    '做出海的品牌方常常卡在一个尴尬的位置。',
    '找海外服务商，标准专业，但时差大、沟通贵，对方也不理解中国团队的节奏和决策方式，一个需求来回确认要一周。',
    '找国内服务商，沟通顺畅、价格合理，但很多团队没真正做过海外市场——不熟悉当地的支付习惯、合规要求，也不了解海外的搜索生态和用户行为。',
  ],
  closing: '36 Tech 想补的就是中间这道缝：用中文和你沟通，用海外市场的标准交付。',
}

export const ABOUT_PRINCIPLES = [
  {
    n: '01',
    title: '先诊断，再动手',
    body: '我们不会在没看清现状之前给报价，也不会一上来就劝你推倒重来。很多时候，最省钱的方案是只改三个地方。',
  },
  {
    n: '02',
    title: '说得清为什么',
    body: '每一项建议都能说明理由和预期影响。如果我们讲不清一件事为什么值得做，那它大概就不值得做。',
  },
  {
    n: '03',
    title: '承认边界',
    body: '做不了的直说，不建议做的也直说。有些客户的问题不需要买我们的服务就能解决，我们会告诉他们怎么自己解决。',
  },
  {
    n: '04',
    title: '交付可维护的东西',
    body: '代码、文档、账号所有权全部归你。我们的目标是让你有一天不需要我们——如果客户被技术绑架才留得住，那是我们的失败。',
  },
]

export const ABOUT_CONCERNS = [
  {
    q: '你们团队这么小，项目做到一半跑了怎么办？',
    a: '合理的担心。我们的做法是分阶段交付、分阶段付款，每个阶段结束你都拿到可用的产出和完整的代码所有权。即使合作中止，你手上的东西也是完整的、别人能接手的。',
  },
  {
    q: '怎么证明你们的专业度？',
    a: '最直接的方式是先做一次免费诊断。报告的质量会告诉你我们是不是真的懂——这比任何自我介绍都可靠。',
  },
  {
    q: '能签保密协议吗？',
    a: '可以。涉及商业数据的项目我们主动提出签署。',
  },
  {
    q: '收费方式？',
    a: '按项目报价，分阶段付款；持续服务按月。报价单会写清范围，超出范围的需求另行确认，不做那种先低价接单再不断加价的事。',
  },
]

/* 联系区 —— 结构参考 docs/design/36-tech-info/.../contact/ContactSection.jsx */
export const CONTACT_INFO = {
  phone: '(626) 366-7032',
  email: 'yun@36tech.info',
  hours: [
    { label: '周一至周五', value: '太平洋时间 9:00 – 17:00' },
    { label: '周六', value: '太平洋时间 10:00 – 14:00' },
  ],
}

export const CONTACT_CODES = [
  { key: 'rednote', image: rednoteCode, alt: '36 Tech 小红书二维码', caption: '小红书' },
  { key: 'wechat', image: wechatCode, alt: '36 Tech 微信二维码', caption: '微信' },
]

export const MARKETS = ['北美', '欧洲', '日韩', '东南亚', '中东', '其他']

export const STAGES = ['还没有海外站点', '已有站点需要改造', '只是先了解一下']

/* ------------------------------------------------------------------
   界面文案 —— 组件里除内容数据之外的所有可见字符串。
   放这里而不是散在组件中，是为了让中英两版各自独立可改。
------------------------------------------------------------------ */

export const UI = {
  nav: {
    services: '服务',
    links: [
      { label: '打造 AI 核心', to: '/#services' },
      { label: '关于我们', to: '/about' },
    ],
    cta: '免费咨询',
    tagline: '打造你的 AI 核心',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    // 指向另一种语言的首页；两个文件各写各的，不做自动推导
    lang: { label: 'EN', href: '/', aria: 'Switch to English' },
  },

  hero: {
    eyebrow: '为中国出海品牌打造的海外站点技术团队',
    leadBefore:
      '从电商建站、平台迁移到 AI 客服与数据分析，36 Tech 用一个团队承接你海外站点的全部技术环节——',
    leadStrong: '中文沟通，海外标准。',
    ctaPrimary: '获取免费站点诊断',
    ctaSecondary: '查看服务全景',
    note: '免费诊断 · 3 个工作日出具报告 · 不满意不推进下一步',
    // 轮播短句的句末标点与读屏用的连接符
    period: '。',
    joiner: '、',
    // 全角句号占满 1em 但字形只在左半，需要负边距吃掉右侧空白
    tightPeriod: true,
  },

  /* 首页 Hero：左文右图，与英文版同一套版式。文案定稿见 docs/homepage-plan.txt 第二节。
     title 的数组项 = 逐字翻起的短句轮播，每句不超过 6 字、不带标点。
     dwellMs 为每张海报的停留时长。 */
  heroShowcase: {
    eyebrow: '',
    title: ['打造你的 AI 核心，让现有系统', ['写报告', '出方案', '分析数据', '批量出图']],
    lead:
      '告别"能聊不能干"，为您的系统注入真正的 AI 生产力',
    // 证据行：数字已获诊所授权（2026-10-20），只用这三个
    proof: ['AI核心让产出更高效', '精准', '稳定'],
    //proof: ['咨询报告 240 分钟 → 5 分钟', '咨询师采纳率 90%+', '数据全程不出诊所'],
    cta: '预约诊断',
    posterHint: '近期打造的 AI 核心',
    dwellMs: 8000,
    // 轮播短句的句末标点与读屏用的连接符
    period: '',
    joiner: '、',
    // 全角句号占满 1em 但字形只在左半，需要负边距吃掉右侧空白
    tightPeriod: false,
  },
  trust: {
    before: '已服务',
    after: '个品牌',
    // 点开后的详情面板
    toggle: (name) => `查看 ${name} 的站点信息`,
    visit: '访问网站',
    noUrl: '【待填：网址】',
    close: '收起',
  },

  workIn: { title: '我们常用的技术栈' },

  chat: {
    title: '先问问顾问',
    sub: '不确定你的系统该从哪一步接入 AI？说说你在用什么系统、哪个环节最耗人，让 Eva 帮你判断。',
    advisor: { name: 'Eva', role: '36 Tech AI 核心顾问', avatarAlt: 'Eva 头像' },
    online: '在线',
    disclaimer: 'AI 生成内容，仅供初步判断参考，不构成正式方案或报价。',
    opening:
      '你好，我是 Eva。说说你现在在用的系统，还有哪个环节最耗人：写报告、出方案、处理图片、回客户？我来判断 AI 核心该接在哪一层、云端还是本地部署。',
    suggestions: [
      '我们的 ERP 里每天要手工录几百张单据，AI 能接手吗？',
      '客户资料不能出公司，本地模型够用吗？',
      '已经在用 ChatGPT，怎么接进现有系统？',
      'AI 答错了怎么办？人工审阅在哪一步？',
    ],
    thinking: '正在思考…',
    placeholder: '说说你在用的系统和最耗人的环节，Enter 发送，Shift+Enter 换行',
    send: '发送',
    errNotConfigured: '聊天顾问还没接上模型。',
    errPrefix: '出了点问题：',
    errEmpty: '模型没有返回内容，请重试。',
    errRequest: (status) => `请求失败（${status}）`,
  },

  pains: {
    num: '01',
    title: '为什么 AI 没能形成生产力？',
    // 这一节的四张卡自己就说清楚了，不再加副标题
    closingLead: '这些其实是同一个问题：',
    closingStrong: 'AI 仅停在聊天框里，还没能以核心迸发出生产力',
  },

  services: {
    num: '02',
    title: '打造 AI 核心，要做对四件事',
    sub: 'AI 生产力不是多开一个聊天窗口，而是你的系统自己会干活。接得上、跑得稳、管得住、算得清，缺一项都落不了地。你可以只要其中一项，也可以整条交给我们。',
  },

  paths: { num: '03', title: '你现在处在哪个阶段？' },

  whyUs: { num: '04', title: '海外供应商懂标准，国内供应商懂你。我们两样都占' },

  process: { num: '05', title: '四步，把 AI 接进你的系统', sub: '先诊断再动手，先一条流程再扩面。每一步都有可验收的产出和可引用的数字。' },

  cases: { num: '06', title: '做过的事', sub: '两个刚交付完的项目。' },

  faq: { num: '07', title: '关于打造 AI 核心，常被问到的' },

  form: {
    eyebrow: '免费诊断',
    title: ['先看看你的站点', '现在什么状况'],
    leadBefore: '提交站点地址，3 个工作日内收到一份书面诊断报告。',
    leadStrong: '免费，且不绑定任何后续合作。',
    bullets: ['站点性能与技术债现状', 'Google 与 AI 搜索的可见度', '数据口径是否可信'],
    fields: [
      { k: 'site', label: '站点地址', ph: 'https://your-brand.com', hint: '还没有站点可填「暂无」' },
      { k: 'name', label: '你的称呼', ph: '怎么称呼您' },
      { k: 'contact', label: '联系方式', ph: '邮箱或微信号', hint: '我们优先用你填写的方式联系' },
    ],
    // 站点地址一栏允许的「我没有站点」写法，跳过网址校验
    noSite: '暂无',
    marketsLabel: '目标市场',
    stageLabel: '你所处的阶段',
    problemLabel: '你现在最头疼的问题',
    optional: '选填',
    problemPh: '比如：站点很慢、想换平台但怕丢排名、海外客服跟不上、数据对不上……',
    submit: '提交，获取诊断',
    submitting: '正在提交…',
    privacy:
      '提交即表示同意我们通过你留下的方式与你联系。信息仅用于本次沟通，不会用于其他用途，也不会提供给第三方。',
    doneTitle: '收到了',
    doneBefore: '我们通常在 1 个工作日内回复。如果超过 2 个工作日没收到消息，可以直接发邮件到',
    doneEmail: 'yun@36tech.info',
    doneAfter: '。',
    resubmit: '再提交一次（原型演示）',
    errors: {
      required: '这项是必填的',
      url: '看起来不像一个网址，检查一下？',
      contact: '留个能联系上你的邮箱或微信号',
    },
  },

  footer: {
    blurb: '告别「能聊不能干」，为你的系统注入真正的 AI 生产力',
    meta: [
      ['城市', 'Irvine, CA'],
      ['邮箱', 'yun@36tech.info'],
      ['微信', 'IsamuYun'],
    ],
    privacy: '隐私政策',
    terms: '服务条款',
  },

  about: {
    principlesEyebrow: '我们怎么做事',
    principlesTitle: '四条准则',
    principlesLead: '写下来是为了让你可以拿它要求我们。',
    teamEyebrow: '团队',
    teamTitle: '做这些事的人',
    teamLead: '真实信息填充后上线。在此之前本模块不对外展示——虚构的团队介绍经不起核实。',
    teamMeta: '【待填：团队规模】·【待填：成立年份】·【待填：所在城市】',
    teamBadge: '待补内容',
    teamPlaceholders: { avatar: 'avatar', name: '姓名', role: '职责', bio: '一句话背景' },
    teamNote:
      '团队人数少不必回避——写「一支 X 人的小团队」，并说明为什么小是优势：同时只接有限项目、每个项目由资深成员直接负责、没有层层转包。',
    concernsEyebrow: '你可能想问',
    concernsTitle: '常见顾虑',
  },

  contact: {
    aria: '联系我们',
    title: '欢迎联系',
    infoTitle: '联系信息',
    phoneLabel: '电话',
    emailLabel: '邮箱',
    hoursTitle: '办公时间',
    formEyebrow: '写点什么',
    formTitle: '发送消息',
    formLead: '不用准备材料。把站点地址和你最头疼的问题写下来就行，我们看完再回你。',
    nameLabel: '姓名',
    namePh: '请输入姓名',
    emailPh: '请输入邮箱地址',
    messageLabel: '留言',
    messagePh: '请告诉我们需要什么帮助',
    companyLabel: '公司',
    send: '发送',
    sending: '发送中…',
    errRequired: '请填写姓名、邮箱和留言。',
    errRequest: (status) => `请求失败，状态码：${status}`,
    errGeneric: '发送时出现问题，请稍后再试。',
    success: (name) => `${name}，感谢留言。我们已收到你的信息。`,
    privacy: '信息仅用于本次沟通，不会用于其他用途，也不会提供给第三方。',
  },
}


/* ------------------------------------------------------------------
   案例 · 心理诊所报告助手 —— 草稿见 docs/brainstroms.txt 第六节
   数字与署名已获诊所授权（2026-10-20）。患者信息一律不出现。
   【待填：xxx】为占位符，素材到位后替换。
------------------------------------------------------------------ */

export const CASE_CLINIC = {
  eyebrow: '案例 · 医疗与心理健康',
  title: ['一份咨询报告，', '从 240 分钟到 5 分钟。'],
  lead: '一家心理诊所的 20 位咨询师，用本地部署的大模型和自建知识库生成报告初稿。病历数据全程不出诊所，咨询师审阅后签发。',
  client: { name: '聆心 心理咨询工作室', logo: clinicLogo, logoLabel: 'CLINIC LOGO', location: '加州 - Irvine' },
  tags: ['Medplum', 'Qwen3 8B · 本地部署', '自建知识库', 'FHIR 病历', '人工审阅签发'],
  stats: [
    { value: '240 → 5', unit: '分钟', label: '一份咨询报告的耗时' },
    { value: '90%+', unit: '', label: '咨询师采纳 AI 初稿的比例' },
    { value: '20', unit: '位', label: '咨询师在用，数据全程不出诊所' },
  ],
  challenge: {
    eyebrow: '之前的状况',
    title: '写报告，比做咨询还花时间。',
    paragraphs: [
      '每次咨询之后，咨询师要把谈话记录整理成一份正式报告：摘要、评估、建议、下一步计划。一份报告平均要花四个小时。',
      '诊所有二十位咨询师，报告的质量和格式却因人而异。新来的咨询师要看很久的旧报告才能写出诊所认可的样子。',
      '病历属于高度敏感的医疗数据。诊所明确要求：不能把记录发给任何公开的 AI 服务。',
    ],
  },
  solution: {
    eyebrow: '我们做了什么',
    title: '接进病历系统，而不是另开一个聊天框。',
    items: [
      {
        n: '01',
        title: '报告摘要',
        body: '咨询记录保存后，系统自动生成摘要草稿。咨询师看一遍、改几处，就能签发。',
      },
      {
        n: '02',
        title: '以优质报告为范本起草新报告',
        body: '把诊所历史上公认写得好的报告做成知识库。新报告以它们为范本生成，用的是诊所自己的写法和术语。',
      },
      {
        n: '03',
        title: '患者从初次问诊起全程在系统内',
        body: '从首次问诊开始，笔记、评估、分析都记在 Medplum 里。报告不再散落在各人的文档和纸面上。',
      },
    ],
    shot: clinicShot,
    shotLabel: 'Medplum 病历中 AI 生成的报告初稿',
  },
  flow: {
    eyebrow: '一份报告是怎么生成的',
    title: '六步，全部在诊所自己的服务器上。',
    steps: [
      { n: '01', title: '咨询记录', body: '咨询师在 Medplum 里完成本次记录。' },
      { n: '02', title: '取病历', body: '系统按 FHIR 标准读取该患者的既往记录与评估。' },
      { n: '03', title: '检索范本', body: '从知识库里找出最相近的几份优质报告作为参考。' },
      { n: '04', title: '本地模型起草', body: 'Qwen3 8B 在诊所服务器上生成初稿，数据不出内网。' },
      { n: '05', title: '咨询师审阅', body: '初稿回到 Medplum，由咨询师修改、确认。' },
      { n: '06', title: '签发归档', body: '签发后的报告进入病历，同时可以成为新的范本。' },
    ],
  },
  guardrails: {
    eyebrow: '红线',
    title: '哪些事 AI 不做。',
    items: [
      { title: '不出诊所', body: '模型与知识库都部署在诊所的服务器上。没有任何病历数据发往外部服务。' },
      { title: '不直接签发', body: 'AI 只出初稿。每一份报告都由咨询师审阅并签名，责任在人。' },
      { title: '不编造', body: '初稿只能引用本次记录与既往病历里有的内容。没有依据的判断不写。' },
      { title: '可追溯', body: '每份初稿保留生成时参考了哪几份范本、哪些记录，出问题可以查。' },
    ],
  },
  quote: {
    text: '以前每次咨询结束，最怕的就是回去写报告。现在初稿五分钟就在病历里等着我，我改的是措辞，不是从头写。更重要的是，记录一直在诊所自己的系统里，我们不用为了省时间去冒险。',
    name: '张燏',
    role: '资深心理咨询师',
  },
  stack: {
    eyebrow: '技术栈',
    items: [
      { name: 'Medplum', note: '开源医疗平台，FHIR 标准病历' },
      { name: 'Qwen3 8B', note: '开源大模型，本地部署' },
      { name: '自建知识库', note: '诊所优质报告的向量检索' },
      { name: '内网部署', note: '诊所自有服务器，不依赖公有云 AI 服务' },
    ],
  },
  cta: {
    title: '你的业务里，也有这样一份「四小时的报告」吗？',
    body: '重复、耗时、格式固定、数据又不能外传的工作，正是本地化 AI 最适合接手的。先做一次落地诊断，看看值不值得。',
    primary: '预约 AI 落地诊断',
    secondary: '看看其他案例',
  },
}

export const CASE_PMS = {
  eyebrow: '案例 · 地产管理',
  title: ['租客的问题、合同里的条款、', '每月的报表，系统自己答。'],
  lead: '一家地产管理公司在现有的物业管理系统上接入 AI 核心：租客常见问题自动回复、租约条款即问即答、维修工单自动分派、月度经营报表自动生成。系统没有换，员工的操作习惯也没有变。',
  client: { name: '【待填：公司名称】', logoLabel: 'CLIENT LOGO', location: '美国加州' },
  tags: ['现有物业系统接入', '租约知识库', '工单自动分派', '经营报表生成', '人工审阅'],
  stats: [
    { value: '【待填】', unit: '', label: '租客咨询由 AI 直接答复的比例' },
    { value: '【待填】', unit: '', label: '一份月度经营报表的耗时变化' },
    { value: '【待填】', unit: '', label: '在管物业数量' },
  ],
  challenge: {
    eyebrow: '之前的状况',
    title: '同样的问题，每天被问几十遍。',
    paragraphs: [
      '租客的问题大多重复：租金什么时候扣、合同哪条怎么解释、报修了什么时候来。每个问题都要人翻系统、翻合同再回复。',
      '维修工单靠人工判断类别和紧急程度，再手动派给维修人员。忙起来容易漏，闲下来又没人跟进。',
      '月底的经营报表要从几个模块里导数据，拼在一起再写说明。一个物业经理要花掉两三天。',
    ],
  },
  solution: {
    eyebrow: '我们做了什么',
    title: '接进物业系统，让它自己回答、自己分派、自己写报表。',
    items: [
      {
        n: '01',
        title: '租客问答',
        body: '把租约、物业规章和历史答复做成知识库。租客在原有渠道提问，AI 基于知识库作答，拿不准的转人工。',
      },
      {
        n: '02',
        title: '工单自动分派',
        body: '报修内容进来后，AI 判断类别和紧急程度，按规则派给对应的维修人员，并给租客一个预计时间。',
      },
      {
        n: '03',
        title: '经营报表生成',
        body: '月底系统自动汇总收租、空置、维修支出，生成带说明的报表初稿，物业经理审阅后发出。',
      },
    ],
    shotLabel: '【待填：系统界面脱敏截图】',
  },
  flow: {
    eyebrow: '一条租客咨询是怎么处理的',
    title: '五步，全部在物业系统内完成。',
    steps: [
      { n: '01', title: '租客提问', body: '租客通过原有的门户或邮件提问，进入系统。' },
      { n: '02', title: '取租客信息', body: '系统读取该租客的租约、账单和历史工单。' },
      { n: '03', title: '检索知识库', body: '从租约条款、物业规章和历史答复中找出依据。' },
      { n: '04', title: '生成答复', body: '模型基于依据起草答复，附上出处；没有依据则转人工。' },
      { n: '05', title: '记录归档', body: '答复与处理记录写回系统，成为下次的参考。' },
    ],
  },
  guardrails: {
    eyebrow: '红线',
    title: '哪些事 AI 不做。',
    items: [
      { title: '不碰钱', body: '涉及退款、减免、押金处理的问题，AI 只记录和转交，不给承诺。' },
      { title: '不编条款', body: '答复只能引用租约和规章里有的内容，查不到就说查不到。' },
      { title: '不直接发报表', body: '报表初稿必须经物业经理审阅后才对外，责任在人。' },
      { title: '可追溯', body: '每条答复保留引用的条款和记录，出争议可以查。' },
    ],
  },
  quote: {
    text: '【待填：一句客户评语】',
    name: '【待填：姓名】',
    role: '【待填：职务】',
  },
  stack: {
    eyebrow: '技术栈',
    items: [
      { name: '现有物业系统', note: '通过接口接入，不替换' },
      { name: '大模型', note: '【待填：云端或本地模型】' },
      { name: '租约知识库', note: '租约、规章、历史答复的向量检索' },
      { name: '规则引擎', note: '工单分派与红线判断' },
    ],
  },
  cta: {
    title: '你的系统里，也有每天被问几十遍的问题吗？',
    body: '重复的问答、靠人判断的分派、月底拼出来的报表，都是 AI 核心最先能接手的。先做一次 AI 核心诊断，看看值不值得。',
    primary: '预约 AI 核心诊断',
    secondary: '看看其他案例',
  },
}

/* 文档级元信息：<html lang> 与标签页标题、描述 */
export const META = {
  lang: 'zh-CN',
  title: '打造你的 AI 核心 | 36 Tech',
  description:
    '为你已经在用的系统打造 AI 核心：Medplum、Shopify、ERP、CRM 不用换。大模型、知识库、业务规则接进去，云端或本地部署，数据可以不出门。先做 AI 核心诊断，再决定值不值得。',
}

/* 聚合默认导出，供 content/index.jsx 的语言上下文使用。
   具名导出保留，个别地方仍可直接 import。 */
export default {
  locale: 'cn',
  META,
  UI,
  BRAND,
  CLIENTS,
  WORK_IN,
  DOMAINS,
  HERO_VARIANTS,
  HERO_POSTERS,
  PAINS,
  SERVICE_GROUPS,
  PATHS,
  WHY_US,
  PROCESS,
  FAQS,
  NAV_SERVICES,
  FOOTER_COLUMNS,
  ABOUT_HERO,
  ABOUT_GAP,
  ABOUT_PRINCIPLES,
  ABOUT_CONCERNS,
  CASE_CLINIC,
  CASE_PMS,
  CONTACT_INFO,
  CONTACT_CODES,
  MARKETS,
  STAGES,
}
