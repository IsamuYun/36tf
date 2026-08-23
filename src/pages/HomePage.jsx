import HeroShowcase from '../components/HeroShowcase.jsx'
import TrustBar from '../components/TrustBar.jsx'
import WorkInBar from '../components/WorkInBar.jsx'
import ChatConsult from '../components/ChatConsult.jsx'
import Pains from '../components/Pains.jsx'
import Services from '../components/Services.jsx'
import Paths from '../components/Paths.jsx'
import WhyUs from '../components/WhyUs.jsx'
import Process from '../components/Process.jsx'
import Cases from '../components/Cases.jsx'
import Faq from '../components/Faq.jsx'
import CtaForm from '../components/CtaForm.jsx'

/**
 * 中文首页。除 Hero 文案外，板块顺序与内容都对齐 pages/en/HomePage.jsx；
 * 两边仍是各自独立的文件，改一边不会牵动另一边。
 *
 * Hero 用 HeroShowcase（左文右图，与英文版同一套版式，文案各取各的内容层），
 * 不再吃 Tweaks 面板里的 Hero 变体与圆环开关。
 * 原来那版深色通栏 Hero 仍留在 components/Hero.jsx，没有页面在用。
 */
export default function HomePage() {
  return (
    <>
      <HeroShowcase />
      <WorkInBar />
      <Pains />
      {/* TrustBar 已是真实客户内容，不再受「隐藏待填模块」影响 */}
      <TrustBar />
      <ChatConsult />
      <Services />
      <Paths />
      <WhyUs />
      <Process />
      <Cases />
      <Faq />
      <CtaForm />
    </>
  )
}
