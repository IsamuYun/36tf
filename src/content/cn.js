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
import heroPoster1 from '../assets/hero/hero-01.jpg'
import heroPoster2 from '../assets/hero/hero-02.jpg'
import heroPoster3 from '../assets/hero/hero-03.jpg'
import heroPoster4 from '../assets/hero/hero-04.jpg'
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

/* 首页 Hero 右侧轮播的四张网站海报，与英文版同一组图。
   顺序即展示顺序；label 用作缩略图按钮的无障碍名称。
   都是设计稿本身，alt 描述画面，不声称是谁的项目。 */
export const HERO_POSTERS = [
  {
    src: heroPoster1,
    label: '阻燃面料电商站',
    alt: '阻燃面料供应商的首页设计：超大「Fabric」字样压在一摞彩色面料上',
  },
  {
    src: heroPoster2,
    label: '旅游目的地站点',
    alt: '旅游站点设计：阿尔卑斯湖景、超大「Travel」字样，下方一排目的地卡片',
  },
  {
    src: heroPoster3,
    label: 'Web 3D 落地页',
    alt: '沉浸式 Web 3D 服务的落地页设计：左侧插画面板，右侧五张价值点卡片',
  },
  {
    src: heroPoster4,
    label: '心理咨询站点',
    alt: '心理咨询机构的三段式版面设计：静谧海景配图与「咨询如何进行」的说明网格',
  },
]

export const PAINS = [
  {
    n: '01',
    title: '当初做站的人不见了。',
    body: '没有文档，没有交接，唯一搞得懂这套东西的人不再回消息。现在你哪儿都不敢动。',
  },
  {
    n: '02',
    title: '一份迁移报价把你劝退了。',
    body: '有人告诉你换平台就等于丢掉排名、一切从头再来。这通常说明对方不会做，而不是这件事本来就该如此。',
  },
  {
    n: '03',
    title: '东西全在服务商手里。',
    body: '主机、域名、代码仓库、统计后台——全挂在他们的账号下。想换人就等于从零开始，他们也清楚这一点。',
  },
  {
    n: '04',
    title: '没有人对它负责。',
    body: '不是故意不管。只是没有任何人的职责是去发现插件坏了、证书过期了、订单悄悄进不来了。',
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

/* ------------------------------------------------------------------
   界面文案 —— 组件里除内容数据之外的所有可见字符串。
   放这里而不是散在组件中，是为了让中英两版各自独立可改。
------------------------------------------------------------------ */

export const UI = {
  nav: {
    services: '服务',
    links: [
      { label: '出海一站式', to: '/#services' },
      { label: '关于我们', to: '/about' },
    ],
    cta: '免费诊断',
    tagline: '中文沟通 · 海外标准',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    // 指向另一种语言的首页；两个文件各写各的，不做自动推导
    lang: { label: 'EN', href: '/en', aria: 'Switch to English' },
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

  /* 首页 Hero：左文右图，与英文版同一套版式，文案是原来那版 Hero 的原文。
     title 的数组项 = 逐字翻起的短句轮播，这里轮播四个能力域。
     dwellMs 为每张海报的停留时长。 */
  heroShowcase: {
    eyebrow: '为中国出海品牌打造的海外站点技术团队',
    title: ['品牌的出海网站，应该', DOMAINS],
    lead:
      '从电商建站、平台迁移到 AI 客服与数据分析，36 Tech 用一个团队承接你海外站点的全部技术环节——中文沟通，海外标准。',
    cta: '获取免费站点诊断',
    posterHint: '近期作品',
    dwellMs: 8000,
    // 轮播短句的句末标点与读屏用的连接符
    period: '。',
    joiner: '、',
    // 全角句号占满 1em 但字形只在左半，需要负边距吃掉右侧空白
    tightPeriod: true,
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
    sub: '不确定该从哪一步入手？直接描述你的情况，Eva 会告诉你优先级。',
    advisor: { name: 'Eva', role: '36 Tech 出海顾问', avatarAlt: 'Eva 头像' },
    online: '在线',
    disclaimer: 'AI 生成内容，仅供初步判断参考，不构成正式方案或报价。',
    opening:
      '你好，我是 Eva。想聊聊你的海外站点吗？说说现在最头疼的问题——站点慢、想换平台、搜不到、还是数据对不上，我来判断该从哪一步入手。',
    suggestions: [
      '我的 Shopify 站首屏要 6 秒，怎么办？',
      '想从 Magento 迁到 Shopify，会丢排名吗？',
      '什么是 GEO？和 SEO 有什么区别？',
      'AI 客服能接住多少比例的咨询？',
    ],
    thinking: '正在思考…',
    placeholder: '描述你的站点情况，Enter 发送，Shift+Enter 换行',
    send: '发送',
    errNotConfigured: '聊天顾问还没接上模型。',
    errPrefix: '出了点问题：',
    errEmpty: '模型没有返回内容，请重试。',
    errRequest: (status) => `请求失败（${status}）`,
  },

  pains: {
    num: '01',
    title: '是不是很熟悉？',
    // 这一节的四张卡自己就说清楚了，不再加副标题
    closingLead: '这些其实是同一个问题：',
    closingStrong: '站点一直被当成一个项目，而不是一项资产。',
  },

  services: {
    num: '02',
    title: '一站式服务，四个能力域',
    sub: '你可以只用其中一项，也可以把整条链路交给我们。服务之间彼此打通，不必在多个供应商之间来回传话。',
  },

  paths: { num: '03', title: '你现在处在哪个阶段？' },

  whyUs: { num: '04', title: '海外供应商懂标准，国内供应商懂你。我们两样都要。' },

  process: { num: '05', title: '四步开始', sub: '每一步都有明确产出，你随时知道进展到哪。' },

  cases: { num: '06', title: '做过的事', sub: '两个刚交付完的项目。' },

  faq: { num: '07', title: '常见问题' },

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
    blurb: '出海品牌的网站，跑得快、找得到、答得上、算得清。',
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


/* 文档级元信息：<html lang> 与标签页标题、描述 */
export const META = {
  lang: 'zh-CN',
  title: '出海品牌的海外站点技术团队 | 36 Tech',
  description:
    '为中国出海品牌提供海外站点一站式技术服务：电商建站、平台迁移、网站现代化、AI 客服与知识库、SEO/GEO、数据分析。中文沟通，海外标准。免费站点诊断，3 个工作日出报告。',
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
  CONTACT_INFO,
  CONTACT_CODES,
  MARKETS,
  STAGES,
}
