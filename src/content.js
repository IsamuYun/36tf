/**
 * 首页文案 —— 逐字取自 docs/design/copy/01-首页.txt 与 11-全站通用组件.txt
 * 改文案请优先改这里，组件只负责排版。
 * 【待填：xxx】为占位符，上线前必须替换或删除，清单见 00-文案总纲.txt
 */

import jwFabric from './assets/trust-bar/jw-fabric-logo.png'
import raidenAntiques from './assets/trust-bar/raiden-antiques-logo.png'
import cesasc from './assets/trust-bar/cesasc-logo.png'
import seren from './assets/trust-bar/seren-logo.png'
import boxOfFun from './assets/trust-bar/box-of-fun-logo.png'
import sindyFish from './assets/trust-bar/sindy-fish-logo.png'
import chest from './assets/trust-bar/chest-logo.png'
import rednoteCode from './assets/contact/rednote-code.jpg'
import wechatCode from './assets/contact/wechat-code.jpg'

export const BRAND = '36 Tech'

// 已服务的出海品牌。顺序即展示顺序。
export const CLIENTS = [
  { name: 'JW 防火科技', logo: jwFabric },
  { name: '雷记古物', logo: raidenAntiques },
  { name: '南加州科工会', logo: cesasc },
  { name: '宁境客栈', logo: seren },
  { name: '乐盒包装物', logo: boxOfFun },
  { name: '云端之燏', logo: sindyFish },
  { name: '云雷斋', logo: chest },
]

// 四个能力域 —— 全站信息架构的骨架，Hero 主标题与服务分组共用同一套表述
export const DOMAINS = ['打开的快', '客户找得到', '真AI智能客服', '流量看得清']

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

export const PAINS = [
  {
    n: '01',
    title: '站点跑不动',
    body: '首屏加载五六秒，海外用户还没看到商品就关掉了。主题被改得面目全非，平台一升级就出问题。',
  },
  {
    n: '02',
    title: '想迁移不敢迁',
    body: '旧平台限制越来越多，但一想到 SEO 权重、历史订单、迁移期间的停摆风险，就一直拖着。',
  },
  {
    n: '03',
    title: '搜不到你',
    body: 'Google 自然排名上不去，全靠广告买流量。而客户现在直接问 AI，你的品牌不在答案里。',
  },
  {
    n: '04',
    title: '数据看不懂',
    body: 'GA4、广告后台、店铺后台三套数字对不上，每个月的投放预算只能靠感觉分配。',
  },
]

export const SERVICE_GROUPS = [
  {
    domain: '打开的快',
    note: '性能、稳定性、可维护性',
    items: [
      {
        no: '01',
        zh: '电商站点建设与治理',
        en: 'E-commerce Build & Cleanup',
        body: '从零搭建能转化的电商站，或接手一个被改乱的站做彻底治理。',
      },
      {
        no: '02',
        zh: '企业级平台迁移',
        en: 'Enterprise Platform Migration',
        body: '换平台不丢 SEO 权重、不丢历史数据、不停摆。',
      },
      {
        no: '03',
        zh: '网站现代化改造',
        en: 'Website Modernization',
        body: '不推倒重来，把老站的性能、架构与可维护性逐步拉回正轨。',
      },
    ],
  },
  {
    domain: '真AI智能客服',
    note: '多语言、多时区自动应答',
    items: [
      {
        no: '04',
        zh: 'AI 客服',
        en: 'AI Customer Service',
        body: '多语言、7×24 自动应答，让时差不再是丢单的理由。',
      },
      {
        no: '05',
        zh: 'AI 知识库',
        en: 'AI Knowledge Base',
        body: '把散落在文档、工单和员工脑子里的知识，变成可检索的资产。',
      },
    ],
  },
  {
    domain: '客户找得到',
    note: 'Google 排名 + AI 搜索可见度',
    items: [
      {
        no: '06',
        zh: 'SEO / GEO',
        en: 'Search & AI Visibility',
        body: '既做 Google 自然排名，也做 AI 搜索里的品牌可见度。',
      },
    ],
  },
  {
    domain: '流量看得清',
    note: '口径统一，决策有依据',
    items: [
      {
        no: '07',
        zh: '数据分析',
        en: 'Data Analytics',
        body: '统一口径，把分散的数据变成能支撑决策的一张报表。',
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
    title: '免费诊断',
    body: '你提供站点地址与后台只读权限，我们在 3 个工作日内出具一份书面报告：现状、风险、优先级建议。',
  },
  {
    n: '02',
    title: '方案与报价',
    body: '基于诊断结果给出分阶段方案，明确范围、周期与价格。不打包销售你不需要的部分。',
  },
  {
    n: '03',
    title: '分阶段交付',
    body: '每个阶段都有可验收的产出，你随时能看到进展。关键节点前不动线上环境。',
  },
  {
    n: '04',
    title: '持续运营',
    body: '上线不是终点。按月维护、监控与迭代，可选。',
  },
]

export const FAQS = [
  {
    q: '我们已经有外包团队了，还需要你们吗？',
    a: '很多客户是这样开始的：先让我们做一次诊断，拿到一份中立的现状报告，再决定原团队继续做什么、哪部分交给我们。诊断本身不绑定后续合作。',
  },
  {
    q: '项目一般多久？',
    a: '取决于范围。站点诊断 3 个工作日；一个中等规模的电商站从零上线通常【待填：周期区间】；平台迁移视数据量与定制程度而定。方案阶段会给出明确排期。',
  },
  {
    q: '你们只做 Shopify 吗？',
    a: '不是。Shopify 是出海品牌最常用的选择之一，我们也做 WooCommerce、Magento、以及基于无头（Headless）架构的自建站。选型建议在诊断阶段给出，我们不会为了省事把你推向某一个平台。',
  },
  {
    q: '上线之后出问题谁负责？',
    a: '交付后有质保期，期内因我们实现导致的问题免费修复。也可以签持续维护，按月响应。',
  },
  {
    q: '数据和源码归谁？',
    a: '归你。代码仓库、服务器、各类账号的所有权始终在客户名下，我们只在授权范围内访问。合作结束时完整移交。',
  },
]

export const NAV_SERVICES = SERVICE_GROUPS.flatMap((g) =>
  g.items.map((i) => ({ ...i, domain: g.domain })),
)

export const FOOTER_COLUMNS = [
  {
    title: '服务',
    links: [
      '电商站点建设与治理',
      '企业级平台迁移',
      '网站现代化改造',
      'AI 客服',
      'AI 知识库',
      'SEO / GEO',
      '数据分析',
    ],
  },
  { title: '方案', links: ['出海一站式', '从零出海', '存量站点改造'] },
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
