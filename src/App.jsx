import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Tweaks from './components/Tweaks.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'

/**
 * 换页时回到顶部；带 #hash 时滚到对应锚点。
 * 用 window.scrollTo 而非 scrollIntoView——后者在 iframe 预览环境里会打乱外层滚动。
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    // 等一帧，确保目标节点已挂载
    const id = requestAnimationFrame(() => {
      const el = document.querySelector(hash)
      if (!el) return
      const NAV_H = 72
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - NAV_H,
        behavior: 'smooth',
      })
    })
    return () => cancelAnimationFrame(id)
  }, [pathname, hash])

  return null
}

export default function App() {
  const [tweaks, setTweaks] = useState({
    hero: 'main',
    rings: true,
  })

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage tweaks={tweaks} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* 未知路径退回首页，避免原型阶段出现空白页 */}
          <Route path="*" element={<HomePage tweaks={tweaks} />} />
        </Routes>
      </main>
      <Footer />
      <Tweaks state={tweaks} setState={setTweaks} />
    </BrowserRouter>
  )
}
