import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ContentProvider, useContent } from './content/index.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Tweaks from './components/Tweaks.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import HomePageEn from './pages/en/HomePage.jsx'

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

/**
 * 按当前语言设置 <html lang> 与标签页标题、描述。
 * 站点是纯客户端渲染的单页应用，index.html 只有一份，
 * 所以这些只能在挂载后改；要给爬虫看的正确 lang/title，
 * 需要预渲染或 SSR，那是另一件事。
 */
function DocumentMeta() {
  const { META } = useContent()

  useEffect(() => {
    document.documentElement.lang = META.lang
    document.title = META.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', META.description)
  }, [META])

  return null
}

/**
 * 一种语言的整站：内容上下文 + 导航 + 页面 + 页脚。
 *
 * 两种语言各挂一棵独立的路由树，首页也是各自独立的文件
 * （HomePage.jsx / en/HomePage.jsx），这样以后改英文版的
 * 板块顺序或增删板块，不会影响中文版。
 */
function Site({ locale, home: Home, tweaks, setTweaks }) {
  return (
    <ContentProvider locale={locale}>
      <DocumentMeta />
      <Nav />
      <main>
        <Routes>
          <Route index element={<Home tweaks={tweaks} />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          {/* 未知路径退回本语言首页，避免原型阶段出现空白页 */}
          <Route path="*" element={<Home tweaks={tweaks} />} />
        </Routes>
      </main>
      <Footer />
      <Tweaks state={tweaks} setState={setTweaks} />
    </ContentProvider>
  )
}

export default function App() {
  const [tweaks, setTweaks] = useState({
    hero: 'main',
    rings: true,
  })

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/cn/*"
          element={<Site locale="cn" home={HomePage} tweaks={tweaks} setTweaks={setTweaks} />}
        />
        {/* 兜底的 /* 必须留在最后：英文是默认语言，占根路径 */}
        <Route
          path="/*"
          element={
            <Site locale="en" home={HomePageEn} tweaks={tweaks} setTweaks={setTweaks} />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
