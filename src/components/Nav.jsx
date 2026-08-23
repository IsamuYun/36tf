import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Arrow } from './ui.jsx'
import { useContent, useHref } from '../content/index.jsx'

export default function Nav() {
  const { BRAND, SERVICE_GROUPS, UI } = useContent()
  const href = useHref()
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState(false) // 桌面端「服务」下拉
  const [openMobile, setOpenMobile] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Esc 关闭所有浮层
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(false)
        setOpenMobile(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // 独立占位的导航条：自身撑开 72px 高度，Hero 紧接其后，不做叠压
  return (
    <header
      className={`sticky top-0 z-50 w-full bg-cloud transition-all duration-300 ease-[var(--ease-brand)] ${
        scrolled
          ? 'border-b border-ink/[0.07] bg-cloud/85 backdrop-blur-xl'
          : 'border-b border-ink/[0.06]'
      }`}
    >
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        {/* 品牌 */}
        <Link to={href('/')} className="flex shrink-0 items-center gap-2.5">
          <img
            src="/36-tech-logo.png"
            alt=""
            width="34"
            height="34"
            className="h-[34px] w-[34px] object-contain"
          />
          <span className="font-display text-[17px] font-bold tracking-tight text-ink">
            {BRAND}
          </span>
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu(true)}
            onMouseLeave={() => setOpenMenu(false)}
          >
            <button
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[14.5px] font-medium text-ink/75 transition-colors hover:text-ink"
              aria-expanded={openMenu}
              aria-haspopup="true"
              onClick={() => setOpenMenu((v) => !v)}
            >
              {UI.nav.services}
              <svg
                viewBox="0 0 10 6"
                width="9"
                height="6"
                fill="none"
                aria-hidden="true"
                className={`transition-transform duration-200 ${openMenu ? 'rotate-180' : ''}`}
              >
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* 下拉：按四个能力域分组 */}
            <div
              className={`absolute left-1/2 top-full w-[620px] -translate-x-1/2 pt-3 transition-all duration-200 ease-[var(--ease-brand)] ${
                openMenu
                  ? 'pointer-events-auto translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-1 opacity-0'
              }`}
            >
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 rounded-2xl border border-ink/[0.07] bg-white p-4 shadow-[0_28px_70px_-24px_rgba(13,27,46,0.28)]">
                {SERVICE_GROUPS.map((g) => (
                  <div key={g.domain} className="p-2">
                    <div className="eyebrow mb-2 px-2 text-fox">{g.domain}</div>
                    {g.items.map((it) => (
                      <a
                        key={it.no}
                        href={href('/#services')}
                        className="group block rounded-lg px-2 py-2 transition-colors hover:bg-cloud"
                        onClick={() => setOpenMenu(false)}
                      >
                        <div className="font-display text-[14px] font-semibold group-hover:text-fox">
                          {it.zh}
                        </div>
                        <div className="font-mono text-[10.5px] text-ink/40">{it.en}</div>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {UI.nav.links.map((item) => (
            <Link
              key={item.label}
              to={href(item.to)}
              className="rounded-full px-4 py-2 text-[14.5px] font-medium text-ink/75 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          {/* 「案例」在有真实案例前隐藏 —— 见 11-全站通用组件.txt */}
        </nav>

        <div className="flex items-center gap-2">
          {/* 语言切换：直接指向另一种语言的首页，不做路径映射——
              两版页面结构可以各自演化，逐页对应迟早会失效。 */}
          <Link
            to={UI.nav.lang.href}
            aria-label={UI.nav.lang.aria}
            className="rounded-full border border-ink/12 px-3 py-1.5 font-mono text-[12px] tracking-wide text-ink/60 transition-colors hover:border-fox hover:text-fox"
          >
            {UI.nav.lang.label}
          </Link>

          {/* 显隐必须放在外层：Button 基础样式含 inline-flex，与 hidden 同为 display
              工具类，胜负取决于 Tailwind 生成顺序而非 class 字符串顺序。 */}
          <span className="hidden sm:block">
            <Button
              as="a"
              href={href('/#diagnose')}
              variant="amber"
              className="!px-6 !py-2.5 !text-[14px]"
            >
              {UI.nav.cta}
            </Button>
          </span>

          {/* 汉堡 */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/12 lg:hidden"
            aria-label={openMobile ? UI.nav.closeMenu : UI.nav.openMenu}
            aria-expanded={openMobile}
            onClick={() => setOpenMobile((v) => !v)}
          >
            <div className="flex w-4 flex-col gap-[3px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-[1.5px] w-full bg-ink transition-all duration-200 ${
                    openMobile && i === 0
                      ? 'translate-y-[4.5px] rotate-45'
                      : openMobile && i === 1
                        ? 'opacity-0'
                        : openMobile && i === 2
                          ? '-translate-y-[4.5px] -rotate-45'
                          : ''
                  }`}
                />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* 移动端抽屉 */}
      <div
        className={`overflow-hidden border-t border-ink/[0.07] bg-cloud/95 backdrop-blur-xl transition-[max-height] duration-400 ease-[var(--ease-brand)] lg:hidden ${
          openMobile ? 'max-h-[560px]' : 'max-h-0 border-t-transparent'
        }`}
      >
        <div className="wrap space-y-5 py-6">
          <p className="eyebrow text-ink/40">{UI.nav.tagline}</p>
          {SERVICE_GROUPS.map((g) => (
            <div key={g.domain}>
              <div className="eyebrow mb-1.5 text-fox">{g.domain}</div>
              {g.items.map((it) => (
                <a
                  key={it.no}
                  href={href('/#services')}
                  onClick={() => setOpenMobile(false)}
                  className="block py-1.5 font-display text-[15px] font-semibold"
                >
                  {it.zh}
                </a>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-2 border-t border-ink/10 pt-4">
            {UI.nav.links.map((item) => (
              <Link
                key={item.label}
                to={href(item.to)}
                onClick={() => setOpenMobile(false)}
                className="py-1 text-[15px] text-ink/75"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Button
            as="a"
            href={href('/#diagnose')}
            variant="amber"
            className="w-full"
            onClick={() => setOpenMobile(false)}
          >
            {UI.nav.cta} <Arrow />
          </Button>
        </div>
      </div>
    </header>
  )
}
