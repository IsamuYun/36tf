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
export const DOMAINS = ['Plugs In', 'Stays Up', 'Stays Yours', 'Adds Up']

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

/* Hero carousel: four AI-engine case studies, same images as the Chinese site.
   Images live in src/assets/hero/case-0*.{png,jpg}; 01–04 match the four entries below.
   Order is display order; label names the thumbnail button; to is the case page path. */
export const HERO_POSTERS = [
  {
    src: posterClinic,
    label: 'Clinic · report engine',
    alt: 'An AI-drafted session report inside a Medplum record, waiting for therapist review',
    to: '/cases/clinic',
  },
  {
    src: posterEcommerce,
    label: 'E-commerce · operations engine',
    alt: 'One dashboard: TikTok and Instagram trends, product picks, images in batch processing, order and parcel status',
    to: '/cases/ecommerce',
  },
  {
    src: posterCrespan,
    label: 'CRESpan · property search engine',
    alt: 'A one-line question, with matching commercial properties listed by zip code on the left',
    to: '/cases/crespan',
  },
  {
    src: posterEva,
    label: 'Eva · advisor engine',
    alt: 'A chat with the on-site advisor, whose answers stay within the service scope',
    to: '/cases/eva',
  },
]

export const PAINS = [
  {
    n: '01',
    title: 'You tried ChatGPT. Nobody at work actually uses it.',
    body: 'The tool got bought, the workflow never changed. Everyone still copies and pastes, then forgets. AI that is not wired into your systems is just one more open tab.',
  },
  {
    n: '02',
    title: 'The data cannot leave the building.',
    body: 'Customer lists, clinical records, quotes, contracts. Dropping them into a public model keeps the owner up at night. So AI gets to write emails and never touches the work that matters.',
  },
  {
    n: '03',
    title: 'The demo was great. Nobody dares ship it.',
    body: 'Impressive on stage, unreliable on real business: wrong answers, promises nobody approved. No hard limits, no human review, no fallback, and no one willing to own the result.',
  },
  {
    n: '04',
    title: 'The monthly bill makes no sense.',
    body: 'Model usage costs climb every month and nobody knows where the money goes, or which tasks a local model could handle for free. AI became a cost line with no output attached.',
  },
]

export const SERVICE_GROUPS = [
  {
    domain: 'Plugs In',
    note: 'Into the systems you run, no teardown',
    items: [
      {
        no: '01',
        zh: 'AI Engine Audit',
        en: 'Know before you build',
        body: 'A written report within two weeks: which steps are worth wiring to AI, at which layer, cloud or on-premise, and what it will cost.',
      },
      {
        no: '02',
        zh: 'AI Workflow Build',
        en: 'A workflow that runs, not a demo',
        body: 'Wire a language model into Medplum, Shopify, your ERP or CRM, and hand over a process that is already doing the work.',
      },
      {
        no: '03',
        zh: 'Site & System Foundations',
        en: 'Something for the engine to plug into',
        body: 'Builds, migrations, modernization, SEO/GEO. An engine needs a system that can take it.',
      },
    ],
  },
  {
    domain: 'Stays Up',
    note: 'Multi-model routing, built to maintain',
    items: [
      {
        no: '04',
        zh: 'Conversational Assistants',
        en: 'One question instead of a query screen',
        body: 'Customer-facing AI support and internal assistants, answering around the clock from your own data.',
      },
      {
        no: '05',
        zh: 'Multi-model Architecture',
        en: 'No single point of failure, no surprise bill',
        body: 'Route tasks across models, fall back automatically, monitor usage. One provider down does not stop the work.',
      },
    ],
  },
  {
    domain: 'Stays Yours',
    note: 'Data stays home, humans review, every answer traceable',
    items: [
      {
        no: '06',
        zh: 'On-premise AI',
        en: 'Data never leaves the building',
        body: 'Open-weight models on your own server. A clear line on which tasks a local model handles and which need the cloud.',
      },
      {
        no: '07',
        zh: 'Knowledge Base & Guardrails',
        en: 'Answers with sources, limits in writing',
        body: 'Docs, tickets and staff know-how become something you can ask, with citations. Hard limits, human review and fallbacks are written down before launch.',
      },
    ],
  },
  {
    domain: 'Adds Up',
    note: 'Hours, acceptance rate and cost, all measured',
    items: [
      {
        no: '08',
        zh: 'Measurement & Analytics',
        en: 'Productivity you can point to',
        body: 'Agree the metrics before launch, read them after: hours saved, draft acceptance rate, cost per call. Whether AI is doing real work is a number, not a feeling.',
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
    title: 'AI engine audit',
    body: 'Tell us which systems you run, which step eats the most hours, and whether data may leave the company. Within two weeks you get a written report: worth doing or not, at which layer, cloud or on-premise, and the cost range.',
  },
  {
    n: '02',
    title: 'Pick one workflow',
    body: 'No big bang. From the report we pick the one workflow with the biggest payoff and the least risk, write down scope, hard limits and where human review sits, then quote it.',
  },
  {
    n: '03',
    title: 'Fit, ship, measure',
    body: 'The engine goes into the system you already use and runs with a small group first. Metrics are agreed before launch and read after: hours saved, draft acceptance rate, cost per call.',
  },
  {
    n: '04',
    title: 'Iterate monthly',
    body: 'Once the first workflow is steady, the next one goes in. Model upgrades, knowledge base updates and cost tuning run monthly, if you want them.',
  },
]

export const FAQS = [
  {
    q: 'Our systems are old. Can they still take AI?',
    a: 'Yes. The engine sits as a layer on top of what you already run, so nothing gets replaced. If the system has an API, a database or an export, we can plug in. The clinic runs on Medplum, an open-source record system; the e-commerce platform was custom-built. Neither was rebuilt. The audit maps your interfaces first and tells you how far we can go.',
  },
  {
    q: 'Our data cannot leave the company. Can we still use a large model?',
    a: 'Yes, with on-premise deployment. The model runs on your own server and the data never touches a third party. The clinic case runs Qwen3 8B locally, and no report ever left the building. The audit sorts tasks by sensitivity: which stay local, which may use the cloud.',
  },
  {
    q: 'How is this different from just using ChatGPT?',
    a: 'ChatGPT is a chat window. It knows nothing about your business, your data or your systems. An engine wires the model to your knowledge base and your rules, then writes the result straight back into the system. No copy-paste, no prompt-writing for staff. That layer is the difference between talking and doing.',
  },
  {
    q: 'What if the AI gets it wrong?',
    a: 'It never goes out unchecked. Every workflow has a human review step: the AI drafts, a person approves. Answers must come from your knowledge base, and when nothing is found it says so. Hard limits go into the rules. After launch we track the acceptance rate and go back in when it drops.',
  },
  {
    q: 'How soon do we see results, and what does it cost?',
    a: 'The audit report takes five business days. The first workflow usually ships in four to eight weeks, and we log time saved and acceptance rate from day one, so the numbers speak for themselves. Pricing comes in two parts: a fixed quote for the first workflow, then a monthly retainer for iteration. Model costs are itemised separately, cloud or local, large model or small, and settled before we start.',
  },
]

export const NAV_SERVICES = SERVICE_GROUPS.flatMap((g) =>
  g.items.map((i) => ({ ...i, domain: g.domain })),
)

export const FOOTER_COLUMNS = [
  {
    title: 'Services',
    links: [
      'AI Engine Audit',
      'AI Workflow Build',
      'Conversational Assistants',
      'On-premise AI',
      'Knowledge Base & Guardrails',
      'Measurement & Analytics',
      'Site & System Foundations',
    ],
  },
  { title: 'Solutions', links: ['Craft your AI Engine', 'Not started yet', 'Tried, never shipped', 'Data cannot leave'] },
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
      { label: 'Craft your AI Engine', to: '/#services' },
      { label: 'About', to: '/about' },
    ],
    cta: 'Free audit',
    tagline: 'Craft your AI Engine',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    // Points at the other language's home page; each file writes its own.
    lang: { label: '中文', href: '/cn', aria: '切换到中文' },
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
  /* Home hero. Translated from the Chinese copy in docs/homepage-plan.txt §3;
     an array inside title becomes the letter-flip phrase rotator. */
  heroShowcase: {
    eyebrow: 'We craft AI engines for the software you already run',
    title: ['Craft your AI engine, and let your systems', ['write reports', 'draft proposals', 'analyze data', 'batch-produce images']],
    lead:
      'An AI engine is the layer we fit into the systems you already use: a language model, a knowledge base, your business rules. Keep Medplum, Shopify or your ERP. Fit the engine, and the system starts doing the work. Cloud or on your own server.',
    // Proof line: figures approved by the clinic (2026-10-20); use only these three
    proof: ['Clinical report: 240 → 5 min', '90%+ drafts accepted', 'Records stayed in the clinic'],
    cta: 'Book an AI engine audit',
    posterHint: 'Engines we built recently',
    dwellMs: 8000,
    period: '.',
    joiner: ', ',
    // A half-width period has no trailing gap, so no negative margin
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
    sub: 'Not sure where AI fits into your systems? Tell Eva what you run and which step eats the most hours.',
    advisor: { name: 'Eva', role: '36 Tech AI engine advisor', avatarAlt: 'Eva avatar' },
    online: 'Online',
    disclaimer:
      'AI-generated. Useful as a first read, not a formal plan or a quote.',
    opening:
      "Hi, I'm Eva. Tell me which systems you run and which step eats the most hours: writing reports, drafting proposals, processing images, answering customers. I'll tell you where an AI engine would fit, and whether it belongs in the cloud or on your own server.",
    suggestions: [
      'Our ERP needs hundreds of records keyed in by hand every day. Can AI take that over?',
      'Customer data cannot leave the company. Is a local model good enough?',
      'We already use ChatGPT. How do we wire it into our existing systems?',
      'What happens when the AI gets it wrong? Where does human review sit?',
    ],
    thinking: 'Thinking…',
    placeholder: 'Tell me what you run and where the hours go. Enter to send, Shift+Enter for a new line',
    send: 'Send',
    errNotConfigured: 'The advisor is not connected to a model yet.',
    errPrefix: 'Something went wrong: ',
    errEmpty: 'The model returned nothing. Please try again.',
    errRequest: (status) => `Request failed (${status})`,
  },

  pains: {
    num: '01',
    title: 'Why is AI still not doing real work?',
    // 这一节的四张卡自己就说清楚了，不再加副标题
    closingLead: 'These are the same problem: ',
    closingStrong: 'AI is stuck in a chat window, not wired into your systems and workflows.',
  },

  services: {
    num: '02',
    title: 'Four things an AI engine has to get right',
    sub: 'AI productivity is not one more chat tab. It is your own systems doing the work. It has to plug in, stay up, stay yours and add up; miss one and it never ships. Take one piece or hand over the whole thing.',
  },

  paths: { num: '03', title: 'Where are you right now?' },

  whyUs: {
    num: '04',
    title: 'Overseas agencies know the standards. Local ones know you. We want both.',
  },

  process: { num: '05', title: 'Four steps to an AI engine in your systems', sub: 'Audit before building, one workflow before many. Every step ends with something you can review and a number you can quote.' },

  cases: { num: '06', title: 'Work', sub: 'Two projects we just delivered.' },

  faq: { num: '07', title: 'Questions we hear about AI engines' },

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
    blurb: 'AI that does the work, not just the talking: engines for the systems you already run.',
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

/* ------------------------------------------------------------------
   Case study: clinic report assistant. Draft in docs/brainstroms.txt §6.
   Numbers and naming approved by the clinic (2026-10-20). No patient data.
   [TBD: xxx] marks placeholders to replace when assets arrive.
------------------------------------------------------------------ */

export const CASE_CLINIC = {
  eyebrow: 'Case study · Mental health',
  title: ['One session report,', 'from 240 minutes to 5.'],
  lead: 'Twenty therapists at a mental health clinic draft their reports with a locally hosted LLM and a knowledge base built from their own best work. Patient records never leave the clinic. Every report is reviewed and signed by a therapist.',
  client: { name: '[TBD: clinic name]', logo: clinicLogo, logoLabel: 'CLINIC LOGO', location: 'California, USA' },
  tags: ['Medplum', 'Qwen3 8B · on-premise', 'Custom knowledge base', 'FHIR records', 'Human sign-off'],
  stats: [
    { value: '240 → 5', unit: 'min', label: 'Time to produce one session report' },
    { value: '90%+', unit: '', label: 'AI drafts accepted by therapists' },
    { value: '20', unit: '', label: 'Therapists on the system, data never leaves the clinic' },
  ],
  challenge: {
    eyebrow: 'Before',
    title: 'Writing the report took longer than the session.',
    paragraphs: [
      'After every session a therapist turns their notes into a formal report: summary, assessment, recommendations, next steps. One report took about four hours.',
      'With twenty therapists, quality and format varied from person to person. New hires spent weeks reading old reports to learn what the clinic expected.',
      'Clinical records are highly sensitive. The clinic was clear: nothing goes to a public AI service.',
    ],
  },
  solution: {
    eyebrow: 'What we built',
    title: 'Wired into the medical record, not a separate chat window.',
    items: [
      {
        n: '01',
        title: 'Report summaries',
        body: 'When session notes are saved, the system drafts a summary. The therapist reads it, edits a few lines, and signs.',
      },
      {
        n: '02',
        title: 'New reports modeled on the best old ones',
        body: 'The clinic\'s strongest historical reports became a knowledge base. New drafts follow their structure, wording and terminology.',
      },
      {
        n: '03',
        title: 'Every patient in the system from intake',
        body: 'From the first visit, notes, assessments and analysis live in Medplum. Nothing is scattered across personal documents or paper.',
      },
    ],
    shotLabel: '[TBD: redacted screenshot of the system]',
  },
  flow: {
    eyebrow: 'How a report gets made',
    title: 'Six steps, all on the clinic\'s own server.',
    steps: [
      { n: '01', title: 'Session notes', body: 'The therapist completes the session record in Medplum.' },
      { n: '02', title: 'Pull the record', body: 'The system reads the patient\'s history and assessments via FHIR.' },
      { n: '03', title: 'Retrieve exemplars', body: 'The knowledge base returns the closest matching high-quality reports.' },
      { n: '04', title: 'Draft locally', body: 'Qwen3 8B drafts the report on the clinic server. Nothing leaves the network.' },
      { n: '05', title: 'Therapist review', body: 'The draft returns to Medplum for editing and confirmation.' },
      { n: '06', title: 'Sign and file', body: 'The signed report joins the record, and can become a new exemplar.' },
    ],
  },
  guardrails: {
    eyebrow: 'Hard limits',
    title: 'What the AI does not do.',
    items: [
      { title: 'Never leaves the clinic', body: 'Model and knowledge base run on the clinic\'s servers. No record is sent to an outside service.' },
      { title: 'Never signs', body: 'The AI produces drafts only. Every report is reviewed and signed by a therapist. The person is accountable.' },
      { title: 'Never invents', body: 'Drafts may only cite what is in the session notes and the patient history. Unsupported judgments are left out.' },
      { title: 'Always traceable', body: 'Each draft keeps a record of which exemplars and notes it drew on, so any issue can be investigated.' },
    ],
  },
  quote: {
    text: 'The part I used to dread after every session was going back to write the report. Now a draft is waiting in the record within five minutes, and I am editing wording instead of starting from a blank page. Just as important, the notes never leave our own system. We did not have to trade safety for time.',
    name: 'Yu Zhang',
    role: 'Senior Therapist',
  },
  stack: {
    eyebrow: 'Stack',
    items: [
      { name: 'Medplum', note: 'Open-source healthcare platform, FHIR records' },
      { name: 'Qwen3 8B', note: 'Open-weight LLM, hosted on-premise' },
      { name: 'Custom knowledge base', note: 'Vector retrieval over the clinic\'s best reports' },
      { name: 'On-premise', note: 'Clinic-owned server, no public cloud AI service' },
    ],
  },
  cta: {
    title: 'Is there a "four-hour report" in your business too?',
    body: 'Repetitive, time-consuming, fixed-format work on data that cannot leave the building is exactly where on-premise AI fits. Start with an AI readiness audit and find out whether it is worth doing.',
    primary: 'Book an AI readiness audit',
    secondary: 'See other work',
  },
}

export const CASE_PMS = {
  eyebrow: 'Case study · Property management',
  title: ['Tenant questions, lease clauses,', 'monthly reports: the system answers.'],
  lead: 'A property management company added an AI engine to the system it already runs: tenant questions answered automatically, lease clauses explained on demand, maintenance tickets routed without a dispatcher, monthly reports drafted by the system. Nothing was replaced and nobody had to relearn their tools.',
  client: { name: '[TBD: company name]', logoLabel: 'CLIENT LOGO', location: 'California, USA' },
  tags: ['Existing PMS integration', 'Lease knowledge base', 'Ticket routing', 'Report generation', 'Human review'],
  stats: [
    { value: '[TBD]', unit: '', label: 'Tenant enquiries answered directly by AI' },
    { value: '[TBD]', unit: '', label: 'Time to produce a monthly report' },
    { value: '[TBD]', unit: '', label: 'Units under management' },
  ],
  challenge: {
    eyebrow: 'Before',
    title: 'The same questions, dozens of times a day.',
    paragraphs: [
      'Most tenant questions repeat: when rent is charged, what a clause means, when the repair is coming. Each one meant someone opening the system, opening the lease, then writing a reply.',
      'Maintenance tickets were categorised and prioritised by hand, then assigned by hand. Busy weeks dropped tickets; quiet weeks nobody followed up.',
      "The month-end report meant exporting from several modules, stitching the data together and writing the commentary. Two or three days of a property manager's time.",
    ],
  },
  solution: {
    eyebrow: 'What we did',
    title: 'Plugged into the PMS so it answers, routes and reports on its own.',
    items: [
      {
        n: '01',
        title: 'Tenant Q&A',
        body: 'Leases, house rules and past replies became a knowledge base. Tenants ask through the channels they already use; the AI answers from the knowledge base and hands off anything it cannot ground.',
      },
      {
        n: '02',
        title: 'Ticket routing',
        body: 'When a repair request comes in, the AI classifies it, sets the urgency, assigns it by rule to the right technician and gives the tenant an estimated time.',
      },
      {
        n: '03',
        title: 'Report generation',
        body: 'At month end the system pulls rent collected, vacancies and maintenance spend into a draft report with commentary. The property manager reviews and sends.',
      },
    ],
    shot: clinicShot,
    shotLabel: 'AI-drafted report inside the Medplum record',
  },
  flow: {
    eyebrow: 'How a tenant enquiry is handled',
    title: 'Five steps, all inside the property system.',
    steps: [
      { n: '01', title: 'Tenant asks', body: 'The question arrives through the existing portal or email.' },
      { n: '02', title: 'Fetch context', body: "The system loads the tenant's lease, ledger and ticket history." },
      { n: '03', title: 'Search the knowledge base', body: 'Lease clauses, house rules and past replies are retrieved as evidence.' },
      { n: '04', title: 'Draft the reply', body: 'The model answers from that evidence and cites it. No evidence, no answer: it goes to a person.' },
      { n: '05', title: 'Log it', body: 'The reply and its handling are written back to the system for next time.' },
    ],
  },
  guardrails: {
    eyebrow: 'Hard limits',
    title: 'What the AI does not do.',
    items: [
      { title: 'No money', body: 'Refunds, waivers and deposits: the AI records and forwards, never promises.' },
      { title: 'No invented clauses', body: 'Replies cite only what is in the lease and the rules. If it is not there, it says so.' },
      { title: 'No unreviewed reports', body: 'Every report is approved by the property manager before it goes out.' },
      { title: 'Traceable', body: 'Each reply keeps the clauses and records it relied on, so disputes can be checked.' },
    ],
  },
  quote: {
    text: '[TBD: one line from the client]',
    name: '[TBD: name]',
    role: '[TBD: role]',
  },
  stack: {
    eyebrow: 'Stack',
    items: [
      { name: 'Existing PMS', note: 'Integrated through its API, not replaced' },
      { name: 'LLM', note: '[TBD: cloud or on-premise model]' },
      { name: 'Lease knowledge base', note: 'Vector search over leases, rules and past replies' },
      { name: 'Rules engine', note: 'Ticket routing and hard-limit checks' },
    ],
  },
  cta: {
    title: 'Does your system get asked the same question dozens of times a day?',
    body: 'Repeated questions, hand-routed tickets and reports stitched together at month end are the first things an AI engine takes over. Start with an AI engine audit and find out whether it is worth doing.',
    primary: 'Book an AI engine audit',
    secondary: 'See other work',
  },
}

/* Document-level metadata: <html lang>, tab title, description */
export const META = {
  lang: 'en',
  title: 'Craft your AI Engine | 36 Tech',
  description:
    'We fit an AI engine into the software you already run: language model, knowledge base and business rules, cloud or on-premise. One clinic cut report time from 240 minutes to 5. Start with an AI engine audit.',
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
  CASE_CLINIC,
  CASE_PMS,
  CONTACT_INFO,
  CONTACT_CODES,
  MARKETS,
  STAGES,
}
