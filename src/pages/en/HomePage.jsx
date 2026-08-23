import HeroShowcase from '../../components/HeroShowcase.jsx'
import TrustBar from '../../components/TrustBar.jsx'
import WorkInBar from '../../components/WorkInBar.jsx'
import ChatConsult from '../../components/ChatConsult.jsx'
import Pains from '../../components/Pains.jsx'
import Services from '../../components/Services.jsx'
import Paths from '../../components/Paths.jsx'
import WhyUs from '../../components/WhyUs.jsx'
import Process from '../../components/Process.jsx'
import Cases from '../../components/Cases.jsx'
import Faq from '../../components/Faq.jsx'
import CtaForm from '../../components/CtaForm.jsx'

/**
 * 英文首页。这是一个独立文件：调整英文版的板块顺序、增删板块，
 * 都不会碰到 pages/HomePage.jsx。文案来自 content/en.js，
 * 由路由层的 ContentProvider 注入。
 *
 * Hero 用 HeroShowcase（左文右图，中英共用同一套版式，文案各取各的内容层），
 * 不再吃 Tweaks 面板里的 Hero 变体与圆环开关。
 */
export default function HomePage() {
  return (
    <>
      <HeroShowcase />
      <WorkInBar />
      <Pains />
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
