/**
 * English content. Mirrors the key structure of cn.js exactly —
 * components read whichever object the locale context provides,
 * so both languages share one component tree.
 *
 * Copy is rewritten for an English-reading audience, not translated
 * literally. Tone rules follow docs/design/copy/00-文案总纲.txt:
 * concrete over abstract, short sentences, no jargon, no promises
 * about rankings or growth multiples, no invented numbers.
 */

import jwFabric from '../assets/trust-bar/jw-fabric-logo.png'
import raidenAntiques from '../assets/trust-bar/raiden-antiques-logo.png'
import cesascLogo from '../assets/trust-bar/cesasc-logo.png'
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

/* url / blurb feed the panel TrustBar opens when a brand is clicked.
   An empty url greys out the "Visit site" button rather than rendering a dead link.
   【TBD: …】 placeholders must be replaced before launch. */
export const CLIENTS = [
  { 
    name: 'JW Fire Block', 
    logo: jwFabric, 
    url: 'https://jm.36techfreedom.com', 
    blurb: '【TBD: one-line summary】' 
  },
  { 
    name: 'Raiden Antiques', 
    logo: raidenAntiques, 
    url: 'https://lei.36tech.info', 
    blurb: '【TBD: one-line summary】' 
  },
  {
    name: 'CESASC',
    logo: cesascLogo,
    url: 'https://cesasc.org',
    blurb: '【TBD: one-line summary】',
  },
  { 
    name: 'Seren Inn', 
    logo: seren, 
    url: 'https://isamuyun.github.io/seren-site/', 
    blurb: '【TBD: one-line summary】' },
  { 
    name: 'Box of Fun', 
    logo: boxOfFun, 
    url: 'https://www.newbeelink.com/', 
    blurb: 'Box of Fun is a packaging supplier for the US market. Their Shopify store sells custom boxes, bags and labels to small businesses. The site was built from scratch with a custom theme and a full set of product options.'
  },
  { 
    name: 'Sindy Fish', 
    logo: sindyFish, 
    url: 'https://sindyfish.cloud', 
    blurb: 'Mental health counseling practice in the CN. The site is a brochure with a booking form' 
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

// The four capability domains — the site's information architecture.
// Same wording is reused in the hero rotator and the service groups.
export const DOMAINS = ['Loads Fast', 'Gets Found', 'Answers Anytime', 'Adds Up']

export const HERO_VARIANTS = [
  {
    id: 'main',
    label: 'Primary',
    lines: ['A brand going global deserves a site that', DOMAINS],
  },
  { id: 'a', label: 'Alt A', lines: ['Your overseas site deserves', 'a team that actually builds.'] },
  { id: 'b', label: 'Alt B', lines: ['Every technical piece of going global,', 'handled by one team.'] },
  { id: 'c', label: 'Alt C', lines: ["Don't let a slow website", 'hold back your overseas business.'] },
]

/* 英文首页 Hero 右侧轮播的四张网站海报。
   顺序即展示顺序；label 用作缩略图按钮的无障碍名称。
   都是设计稿本身，alt 描述画面，不声称是谁的项目。 */
export const HERO_POSTERS = [
  {
    src: heroPoster1,
    label: 'Flame-retardant fabrics store',
    alt: 'Home page design for a flame-retardant fabrics supplier, with oversized “Fabric” type over a stack of coloured textiles',
  },
  {
    src: heroPoster2,
    label: 'Travel destination site',
    alt: 'Travel site design featuring an alpine lake, oversized “Travel” type, and a row of destination cards',
  },
  {
    src: heroPoster3,
    label: 'Web 3D landing page',
    alt: 'Landing page design for an immersive Web 3D offering, with an illustrated panel and five benefit cards',
  },
  {
    src: heroPoster4,
    label: 'Counseling practice site',
    alt: 'Three stacked section designs for a counseling practice, with calm seaside imagery and a “How counseling works” grid',
  },
]

export const PAINS = [
  {
    n: '01',
    title: 'The developer disappeared.',
    body: 'No documentation, no handoff, and the one person who understood the build stopped answering. You’re afraid to touch anything.',
  },
  {
    n: '02',
    title: 'The migration quote scared you off.',
    body: 'Someone told you a replatform means losing your rankings and starting over. That’s usually a sign they don’t know how to do it, not a law of nature.',
  },
  {
    n: '03',
    title: 'Your agency owns everything.',
    body: 'The hosting, the domain, the repository, the analytics — all in their accounts. Leaving means starting from scratch, and they know it.',
  },
  {
    n: '04',
    title: 'Nobody is responsible for it.',
    body: 'Not neglected on purpose. There’s just no one whose job it is to notice when a plugin breaks, a certificate expires, or orders quietly stop coming through.',
  },
]

export const SERVICE_GROUPS = [
  {
    domain: 'Loads Fast',
    note: 'Speed, stability, maintainability',
    items: [
      {
        no: '01',
        zh: 'E-commerce Build & Cleanup',
        en: 'Build a store that converts',
        body: 'Build a store that converts from scratch, or take over one that has been hacked apart and put it back in order.',
      },
      {
        no: '02',
        zh: 'Enterprise Platform Migration',
        en: 'Move without losing ground',
        body: 'Change platforms without losing SEO equity, without losing order history, without going dark.',
      },
      {
        no: '03',
        zh: 'Website Modernization',
        en: 'Fix it without a rewrite',
        body: 'No teardown. Bring performance, architecture and maintainability back in stages.',
      },
    ],
  },
  {
    domain: 'Answers Anytime',
    note: 'Multilingual, every time zone',
    items: [
      {
        no: '04',
        zh: 'AI Customer Service',
        en: 'Replies while you sleep',
        body: 'Multilingual answers around the clock, so a time difference stops costing you orders.',
      },
      {
        no: '05',
        zh: 'AI Knowledge Base',
        en: 'Turn know-how into an asset',
        body: 'Take what is scattered across documents, tickets and people’s heads, and make it searchable.',
      },
    ],
  },
  {
    domain: 'Gets Found',
    note: 'Google rankings and AI visibility',
    items: [
      {
        no: '06',
        zh: 'SEO / GEO',
        en: 'Search & AI Visibility',
        body: 'Rank on Google, and show up inside the answers that ChatGPT and Perplexity give.',
      },
    ],
  },
  {
    domain: 'Adds Up',
    note: 'One definition, decisions you can defend',
    items: [
      {
        no: '07',
        zh: 'Data Analytics',
        en: 'Numbers that agree',
        body: 'Align the definitions first, then turn scattered data into one report a decision can rest on.',
      },
    ],
  },
]

export const PATHS = [
  {
    tag: 'Path A',
    title: 'Starting from zero',
    body: 'For brands with no overseas site yet, or one that has run out of road. We start at platform selection and stay through launch and beyond.',
    cta: 'See build options',
  },
  {
    tag: 'Path B',
    title: 'My site needs rescuing',
    body: 'For brands with a site that is slow, brittle, invisible in search, or reporting numbers nobody trusts. We diagnose first, then fix what costs you the most.',
    cta: 'Book a site audit',
  },
]

export const WHY_US = [
  {
    title: 'Direct communication, overseas standards',
    body: 'Explain what you need in your own words. No translation layer, no midnight calls. What we ship meets the compliance, performance and accessibility bar of the markets you sell into.',
  },
  {
    title: 'One team, every piece',
    body: 'Build, migration, AI, SEO and analytics all close inside one team. You will never hear the build team blame SEO while SEO blames the build.',
  },
  {
    title: 'Diagnose before touching anything',
    body: 'We will not open by telling you to start over. First a written assessment: what can be saved, what is not worth saving, and what order to do it in.',
  },
]

export const PROCESS = [
  {
    n: '01',
    title: 'Free audit',
    body: 'Give us the URL and read-only backend access. Within three business days you get a written report: where things stand, what the risks are, what to do first.',
  },
  {
    n: '02',
    title: 'Plan and quote',
    body: 'A staged plan based on the findings, with scope, timeline and price spelled out. We will not bundle in work you do not need.',
  },
  {
    n: '03',
    title: 'Ship in stages',
    body: 'Every stage ends with something you can review. Nothing touches production before a checkpoint.',
  },
  {
    n: '04',
    title: 'Keep it running',
    body: 'Launch is not the finish line. Monthly maintenance, monitoring and iteration, if you want it.',
  },
]

export const FAQS = [
  {
    q: 'We already have an agency. Do we need you?',
    a: 'Plenty of clients start exactly there. Let us run an audit, take the neutral report, then decide what your current team keeps and what moves. The audit does not commit you to anything.',
  },
  {
    q: 'How long does a project take?',
    a: 'It depends on scope. A site audit takes three business days. A mid-sized store built from scratch usually takes 【TBD: range】. Migration depends on data volume and how much is customised. You get a firm schedule at the planning stage.',
  },
  {
    q: 'Do you only work in Shopify?',
    a: 'No. Shopify is a common choice, and we also work in WooCommerce, Magento and headless builds. The recommendation comes out of the audit — we will not push you onto one platform because it is easier for us.',
  },
  {
    q: 'Who is responsible after launch?',
    a: 'There is a warranty period. Anything broken by our implementation gets fixed at no cost. Ongoing maintenance is available on a monthly basis.',
  },
  {
    q: 'Who owns the code and the data?',
    a: 'You do. Repositories, servers and accounts stay in your name throughout. We only access what you authorise, and everything hands over cleanly when the work ends.',
  },
]

export const NAV_SERVICES = SERVICE_GROUPS.flatMap((g) =>
  g.items.map((i) => ({ ...i, domain: g.domain })),
)

export const FOOTER_COLUMNS = [
  {
    title: 'Services',
    links: [
      'E-commerce Build & Cleanup',
      'Enterprise Platform Migration',
      'Website Modernization',
      'AI Customer Service',
      'AI Knowledge Base',
      'SEO / GEO',
      'Data Analytics',
    ],
  },
  { title: 'Solutions', links: ['End-to-end', 'Starting from zero', 'Rescuing an existing site'] },
  {
    title: 'Company',
    links: [{ label: 'About', to: '/about' }, 'Work', { label: 'Contact', to: '/contact' }],
  },
]

export const ABOUT_HERO = {
  eyebrow: 'About 36 Tech',
  title: ['Overseas standards,', 'without the distance.'],
  lead: 'A small team building overseas sites for brands going global. Not big — but every project has someone genuinely accountable for the outcome.',
}

export const ABOUT_GAP = {
  eyebrow: 'Why we do this',
  title: 'The gap in the middle',
  paragraphs: [
    'Brands going global tend to get stuck in an awkward spot.',
    'Hire an overseas agency and the standards are there, but the time difference is brutal, the hours are expensive, and they do not understand how your team makes decisions. One requirement takes a week to confirm.',
    'Hire locally and communication is easy and the price is fair, but many teams have never actually worked an overseas market — unfamiliar with local payment habits, compliance requirements, and how search and buyers behave abroad.',
  ],
  closing:
    '36 Tech exists to close that gap: talk to us the way you would talk to your own team, and get work built to the standards of the markets you sell into.',
}

export const ABOUT_PRINCIPLES = [
  {
    n: '01',
    title: 'Diagnose before touching anything',
    body: 'We do not quote before seeing the state of things, and we do not open by telling you to start over. Often the cheapest fix is three specific changes.',
  },
  {
    n: '02',
    title: 'Every recommendation has a reason',
    body: 'We can explain the reasoning and expected impact behind each one. If we cannot explain why something is worth doing, it probably is not.',
  },
  {
    n: '03',
    title: 'We say what we cannot do',
    body: 'If it is outside our range we say so. If we would not recommend it we say that too. Some problems do not need us at all, and we will tell you how to handle those yourself.',
  },
  {
    n: '04',
    title: 'What we hand over is maintainable',
    body: 'Code, documentation and account ownership are all yours. The goal is a day when you do not need us — if the only thing keeping a client is technical lock-in, we have failed.',
  },
]

export const ABOUT_CONCERNS = [
  {
    q: 'You are a small team. What if you disappear mid-project?',
    a: 'Fair concern. We ship and invoice in stages, and every stage ends with usable output and full code ownership in your hands. Even if the engagement stops, what you hold is complete and someone else can pick it up.',
  },
  {
    q: 'How do we know you are any good?',
    a: 'Start with the free audit. The quality of that report will tell you whether we understand the problem — more reliably than anything we could say about ourselves.',
  },
  {
    q: 'Will you sign an NDA?',
    a: 'Yes. On projects involving commercial data we raise it ourselves.',
  },
  {
    q: 'How do you charge?',
    a: 'Fixed price per project, invoiced in stages. Ongoing work is monthly. Scope is written into the quote, and anything beyond it gets agreed separately — no low bid followed by a stream of add-ons.',
  },
]

export const CONTACT_INFO = {
  phone: '(626) 366-7032',
  email: 'yun@36tech.info',
  hours: [
    { label: 'Monday – Friday', value: '9:00 – 17:00 Pacific' },
    { label: 'Saturday', value: '10:00 – 14:00 Pacific' },
  ],
}

export const CONTACT_CODES = [
  { key: 'rednote', image: rednoteCode, alt: '36 Tech RedNote QR code', caption: 'RedNote' },
  { key: 'wechat', image: wechatCode, alt: '36 Tech WeChat QR code', caption: 'WeChat' },
]

export const MARKETS = [
  'North America',
  'Europe',
  'Japan & Korea',
  'Southeast Asia',
  'Middle East',
  'Other',
]

export const STAGES = [
  'No overseas site yet',
  'Have a site, needs work',
  'Just looking around',
]

/* ------------------------------------------------------------------
   Interface copy — every visible string the components need beyond
   the content data above. Kept here so the English wording can change
   without touching cn.js, and vice versa.
------------------------------------------------------------------ */

export const UI = {
  nav: {
    services: 'Services',
    links: [
      { label: 'End-to-end', to: '/#services' },
      { label: 'About', to: '/about' },
    ],
    cta: 'Free audit',
    tagline: 'Overseas standards · straight talk',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    // Points at the other language's home page; each file writes its own.
    lang: { label: '中文', href: '/', aria: '切换到中文' },
  },

  hero: {
    eyebrow: 'A site-engineering team for brands going global',
    leadBefore:
      'From store builds and platform migrations to AI support and analytics, 36 Tech covers every technical piece of your overseas site with one team — ',
    leadStrong: 'overseas standards, straight talk.',
    ctaPrimary: 'Get a free site audit',
    ctaSecondary: 'See what we do',
    note: 'Free audit · report in 3 business days · no obligation to continue',
    period: '.',
    joiner: ', ',
    // No negative margin: a Latin full stop has no trailing whitespace to eat.
    tightPeriod: false,
  },


  /* 英文首页专用的 Hero：左文右图，与中文版的深色 Hero 是两套设计。
     dwellMs 为每张海报的停留时长。 */
  heroShowcase: {
    eyebrow: 'BUILD | FIX | MIGRATE',
    title: ['I take over websites', 'other people left behind'],
    lead: 'Shopify, WordPress, Drupal. Migrations, cleanups, and the half-finished work your last developer walked away from. 20+ years of software development, one person accountable, written scope before anything gets touched.',
    cta: 'Get a Free Audit',
    posterHint: 'Recent work',
    dwellMs: 8000,
    /* title 里放一个字符串数组就会变成逐字翻起的轮播，例如
       title: ['A brand going global deserves a site that', DOMAINS] */
    period: '.',
    joiner: ', ',
    // 半角句点右侧没有多余留白，不需要负边距
    tightPeriod: false,
  },
  trust: {
    before: 'Trusted by',
    after: 'brands',
    // The panel that opens on click
    toggle: (name) => `See site details for ${name}`,
    visit: 'Visit site',
    noUrl: '【TBD: URL】',
    close: 'Close',
  },

  workIn: { title: 'The stack we work in' },

  chat: {
    title: 'Ask the advisor first',
    sub: 'Not sure where to start? Describe your situation and Eva will tell you what to fix first.',
    advisor: { name: 'Eva', role: '36 Tech advisor', avatarAlt: 'Eva avatar' },
    online: 'Online',
    disclaimer:
      'AI-generated. Useful as a first read, not a formal plan or a quote.',
    opening:
      "Hi, I'm Eva. Want to talk through your overseas site? Tell me what hurts most right now — slow pages, a platform you want off, nobody finding you, numbers that disagree — and I'll tell you where to start.",
    suggestions: [
      'My Shopify store takes 6 seconds to load. What now?',
      'Moving from Magento to Shopify — will I lose rankings?',
      'What is GEO, and how is it different from SEO?',
      'How much of our support volume can AI handle?',
    ],
    thinking: 'Thinking…',
    placeholder: 'Describe your site. Enter to send, Shift+Enter for a new line',
    send: 'Send',
    errNotConfigured: 'The advisor is not connected to a model yet.',
    errPrefix: 'Something went wrong: ',
    errEmpty: 'The model returned nothing. Please try again.',
    errRequest: (status) => `Request failed (${status})`,
  },

  pains: {
    num: '01',
    title: 'Sound familiar?',
    // 这一节的四张卡自己就说清楚了，不再加副标题
    closingLead: 'These are the same problem: ',
    closingStrong: 'the site was treated as a project, not as an asset.',
  },

  services: {
    num: '02',
    title: 'One team, four capability domains',
    sub: 'Take one piece or hand over the whole chain. The services connect to each other, so you are not relaying messages between vendors.',
  },

  paths: { num: '03', title: 'Where are you right now?' },

  whyUs: {
    num: '04',
    title: 'Overseas agencies know the standards. Local ones know you. We want both.',
  },

  process: {
    num: '05',
    title: 'Four steps to start',
    sub: 'Every step has a defined output, so you always know where things stand.',
  },

  cases: { num: '06', title: 'Work', sub: 'Two projects we just delivered.' },

  faq: { num: '07', title: 'Common questions' },

  form: {
    eyebrow: 'Free audit',
    title: ['Start by seeing', 'where your site stands'],
    leadBefore: 'Send us the URL and get a written audit within three business days. ',
    leadStrong: 'Free, and it commits you to nothing.',
    bullets: [
      'Performance and technical debt',
      'Visibility in Google and in AI search',
      'Whether your numbers can be trusted',
    ],
    fields: [
      { k: 'site', label: 'Site URL', ph: 'https://your-brand.com', hint: 'No site yet? Write “none”' },
      { k: 'name', label: 'Your name', ph: 'What should we call you?' },
      { k: 'contact', label: 'How to reach you', ph: 'Email or WeChat ID', hint: 'We will use whichever you give us' },
    ],
    noSite: 'none',
    marketsLabel: 'Target markets',
    stageLabel: 'Where you are',
    problemLabel: 'What is hurting most right now',
    optional: 'Optional',
    problemPh:
      'For example: the site is slow, we want to switch platforms but fear losing rankings, support cannot keep up, the numbers do not match…',
    submit: 'Send and get the audit',
    submitting: 'Sending…',
    privacy:
      'By submitting you agree to let us contact you the way you specified. We use this only for this conversation, nothing else, and never pass it to third parties.',
    doneTitle: 'Got it',
    doneBefore:
      'We usually reply within one business day. If two business days pass with nothing, email us directly at',
    doneEmail: 'yun@36tech.info',
    doneAfter: '.',
    resubmit: 'Submit again (prototype)',
    errors: {
      required: 'This one is required',
      url: 'That does not look like a URL — worth a check?',
      contact: 'Leave an email or WeChat ID we can actually reach',
    },
  },

  footer: {
    blurb: 'Sites for brands selling abroad: fast, findable, answering, and adding up.',
    meta: [
      ['City', 'Irvine, CA'],
      ['Email', 'yun@36tech.info'],
      ['WeChat', 'IsamuYun'],
    ],
    privacy: 'Privacy',
    terms: 'Terms',
  },

  about: {
    principlesEyebrow: 'How we work',
    principlesTitle: 'Four principles',
    principlesLead: 'Written down so you can hold us to them.',
    teamEyebrow: 'Team',
    teamTitle: 'The people doing the work',
    teamLead:
      'Goes live once the real details are in. Until then this section stays down — an invented team page does not survive a check.',
    teamMeta: '【TBD: team size】·【TBD: founded】·【TBD: city】',
    teamBadge: 'To be filled',
    teamPlaceholders: { avatar: 'avatar', name: 'name', role: 'role', bio: 'one-line background' },
    teamNote:
      'A small team is nothing to hide — say “a team of X” and explain why small helps: a limited number of projects at once, a senior person directly on each one, nothing subcontracted down a chain.',
    concernsEyebrow: 'You might be wondering',
    concernsTitle: 'Common concerns',
  },

  contact: {
    aria: 'Contact us',
    title: 'Get in touch',
    infoTitle: 'Contact',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    hoursTitle: 'Office hours',
    formEyebrow: 'Write something',
    formTitle: 'Send a message',
    formLead:
      'Nothing to prepare. Send the site URL and whatever is hurting most — we will read it and get back to you.',
    nameLabel: 'Name',
    namePh: 'Your name',
    emailPh: 'Your email address',
    messageLabel: 'Message',
    messagePh: 'Tell us what you need help with',
    companyLabel: 'Company',
    send: 'Send',
    sending: 'Sending…',
    errRequired: 'Please fill in your name, email and message.',
    errRequest: (status) => `Request failed with status ${status}`,
    errGeneric: 'Something went wrong sending that. Please try again shortly.',
    success: (name) => `Thanks, ${name}. Your message is with us.`,
    privacy:
      'Used only for this conversation, nothing else, and never passed to third parties.',
  },
}

/* Document-level metadata: <html lang>, tab title, description */
export const META = {
  lang: 'en',
  title: 'Site engineering for brands going global | 36 Tech',
  description:
    'One team for the full technical stack of your overseas site: e-commerce builds, platform migration, modernization, AI support and knowledge base, SEO/GEO, analytics. Free site audit, written report in three business days.',
}

export default {
  locale: 'en',
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
