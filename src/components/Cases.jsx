import { Reveal, SectionHead } from './ui.jsx'
import { useContent } from '../content/index.jsx'
import Band from './Band.jsx'
import CaseCard from './CaseCard.jsx'

import hikMain from '../assets/works/hikvision/works-hikvision-main.jpg'
import hikLogo from '../assets/works/hikvision/hikvision-logo.jpg'
import migrationLogo from '../assets/works/hikvision/migration-logo.avif'
import planLogo from '../assets/works/hikvision/plan-logo.png'
import securityLogo from '../assets/works/hikvision/security-logo.jpg'

import cesascMain from '../assets/works/cesasc/works-cesasc-main.jpg'
import cesascLogo from '../assets/works/cesasc/cesasc-logo.png'
import j2019 from '../assets/works/cesasc/2019-journal.jpg'
import j2021 from '../assets/works/cesasc/2021-journal.png'
import j2026 from '../assets/works/cesasc/2026-journal.png'

/* 渐变一律「底深顶浅」，配合自下而上的揭开方向 */
const ICE_BLUE = 'linear-gradient(0deg, #A9D3F4 0%, #C2E0F8 32%, #DCEDFC 66%, #F2F9FF 100%)'
const EMERALD = 'linear-gradient(0deg, #7FCFB4 0%, #A5DFC8 32%, #CFEEE0 66%, #F0FAF5 100%)'

const CASES = [
  {
    title: 'Hikvision Migration',
    subtitle: '10,000 Pages, Zero Traffic Loss',
    tags: ['Drupal 7 → AEM', 'Platform Migration', 'Zero Traffics Loss'],
    mainShot: hikMain,
    gradient: ICE_BLUE,
    icons: [
      {
        src: hikLogo,
        alt: 'Hikvision',
        pos: 'left-[1%] top-[44%]',
        width: 'w-[86px] md:w-24', // 原始 96×54
        flyX: '-58px',
        flyY: '-14px',
        rotFrom: '-52deg',
        rotTo: '-23deg',
        delay: 0,
      },
      {
        src: migrationLogo,
        alt: '平台迁移',
        pos: 'right-[1%] top-[40%]',
        width: 'w-[68px] md:w-20', // 原始 512×512
        flyX: '58px',
        flyY: '-16px',
        rotFrom: '46deg',
        rotTo: '18deg',
        delay: 70,
      },
      {
        src: planLogo,
        alt: '迁移方案',
        pos: 'bottom-[8%] left-[6%]',
        width: 'w-[60px] md:w-[72px]', // 原始 80×80
        flyX: '-50px',
        flyY: '30px',
        rotFrom: '50deg',
        rotTo: '23deg',
        delay: 140,
        hideOnSm: true,
      },
      {
        src: securityLogo,
        alt: '权重与安全',
        pos: 'bottom-[10%] right-[6%]',
        width: 'w-[132px] md:w-[180px]', // 原始 240×160，等比缩到 180×120
        flyX: '50px',
        flyY: '28px',
        rotFrom: '-56deg',
        rotTo: '-27deg',
        delay: 210,
        hideOnSm: true,
      },
    ],
  },
  {
    title: 'CESASC.org Upgrade',
    subtitle: 'Drupal 7 EOL → Drupal 11 Modernization',
    tags: ['Drupal 7 → Drupal 11', 'Drupal Upgrade', 'UI/UX Design'],
    mainShot: cesascMain,
    gradient: EMERALD,
    icons: [
      {
        src: cesascLogo,
        alt: 'CESASC',
        pos: 'left-[2%] top-[42%]',
        width: 'w-[72px] md:w-[88px]', // 原始 128×128
        flyX: '-58px',
        flyY: '-14px',
        rotFrom: '-50deg',
        rotTo: '-21deg',
        delay: 0,
      },
      {
        src: j2019,
        alt: '2019 年刊',
        pos: 'bottom-[12%] left-[7%]',
        width: 'w-[58px] md:w-[70px]', // 竖版 96×124
        flyX: '-50px',
        flyY: '30px',
        rotFrom: '48deg',
        rotTo: '19deg',
        delay: 90,
        hideOnSm: true,
      },
      {
        src: j2021,
        alt: '2021 年刊',
        pos: 'right-[2%] top-[36%]',
        width: 'w-[58px] md:w-[70px]', // 竖版 96×126
        flyX: '58px',
        flyY: '-18px',
        rotFrom: '44deg',
        rotTo: '16deg',
        delay: 170,
      },
      {
        src: j2026,
        alt: '2026 年刊',
        pos: 'bottom-[9%] right-[6%]',
        width: 'w-[66px] md:w-[82px]', // 竖版 96×124，最新一期略大
        flyX: '50px',
        flyY: '28px',
        rotFrom: '-54deg',
        rotTo: '-24deg',
        delay: 250,
        hideOnSm: true,
      },
    ],
  },
]

export default function Cases() {
  const { UI } = useContent()
  return (
    <Band tone="white">
      <div>
        <Reveal>
          <SectionHead num={UI.cases.num} title={UI.cases.title} zh={UI.cases.sub} />
        </Reveal>

        <div className="space-y-6">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <CaseCard data={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  )
}
