import Hero from '../components/Hero.jsx'
import TrustBar from '../components/TrustBar.jsx'
import ChatConsult from '../components/ChatConsult.jsx'
import Pains from '../components/Pains.jsx'
import Services from '../components/Services.jsx'
import Paths from '../components/Paths.jsx'
import WhyUs from '../components/WhyUs.jsx'
import Process from '../components/Process.jsx'
import Cases from '../components/Cases.jsx'
import Faq from '../components/Faq.jsx'
import CtaForm from '../components/CtaForm.jsx'

export default function HomePage({ tweaks }) {
  return (
    <>
      <Hero variantId={tweaks.hero} showRings={tweaks.rings} />
      {/* TrustBar 已是真实客户内容，不再受「隐藏待填模块」影响 */}
      <TrustBar />
      <ChatConsult />
      <Pains />
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
