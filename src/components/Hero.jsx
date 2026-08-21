import { useEffect, useState } from 'react'
import { Button, Arrow, RingMotif } from './ui.jsx'
import { HERO_VARIANTS } from '../content.js'

const CHAR_STEP = 34 // 每字符错开毫秒数
const DWELL = 4000 // 每句停留时长

/**
 * Hero 主标题里的一个短句：
 * 逐字符绕底边 3D 翻起 + 下方细下划线 + 句末 4×4px 品牌蓝方块。
 * 整句 nowrap，避免中文从句中断行。
 */
function HeroPhrase({ text, delay = 0, className = '' }) {
  const chars = Array.from(text)
  const tail = delay + chars.length * CHAR_STEP

  return (
    <span className={`relative inline-block whitespace-nowrap pb-[0.3em] ${className}`}>
      {chars.map((ch, i) => (
        <span key={i} className="hero-char-outer">
          <span className="hero-char" style={{ animationDelay: `${delay + i * CHAR_STEP}ms` }}>
            {ch}
          </span>
        </span>
      ))}

      {/* 句末句号，品牌蓝。
          -mr 用来吃掉全角句号右侧的空白——中文句号占满 1em 但字形只在左半，
          不修的话下划线会比可见的句号多出一截。 */}
      <span
        className="hero-dot -mr-[0.45em] inline-block text-fox"
        style={{ animationDelay: `${tail + 60}ms` }}
      >
        。
      </span>

      {/* 下划线：8px 高 */}
      <span
        aria-hidden="true"
        className="hero-rule absolute bottom-0 left-0 h-2 w-full bg-white/30"
        style={{ animationDelay: `${delay + 120}ms` }}
      />
    </span>
  )
}

/**
 * 短句轮播：一次只显示一句，每句停留 DWELL 毫秒后切换。
 * - 用 inline-grid 把四句叠在同一格并全部占位（其中三句 invisible），
 *   容器自动等于最宽一句的宽度，切换时不会左右跳动。
 * - key={index} 让 React 重新挂载，CSS 动画随之重播。
 * - 视觉层对读屏隐藏，另给一份完整的四句文本，保证语义与 SEO 不因轮播而残缺。
 * - 系统开启「减少动效」时不轮播，四句静态并排显示。
 */
function PhraseRotator({ phrases }) {
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced) return
    const timer = setInterval(() => setActive((i) => (i + 1) % phrases.length), DWELL)
    return () => clearInterval(timer)
  }, [reduced, phrases.length])

  if (reduced) {
    return (
      <span className="mt-2 block">
        {phrases.map((p) => (
          <HeroPhrase key={p} text={p} className="mr-[0.5em] last:mr-0" />
        ))}
      </span>
    )
  }

  return (
    <span className="mt-2 block">
      <span className="inline-grid align-bottom" aria-hidden="true">
        {/* 撑宽用的隐形副本，保证容器宽度 = 最宽的一句 */}
        {phrases.map((p) => (
          <span
            key={p}
            className="invisible col-start-1 row-start-1 justify-self-start whitespace-nowrap pb-[0.3em]"
          >
            {p}。
          </span>
        ))}
        {/* justify-self-start：grid 子项默认拉伸，不加的话下划线会跟着最宽一句的宽度走 */}
        <HeroPhrase
          key={active}
          text={phrases[active]}
          className="col-start-1 row-start-1 justify-self-start"
        />
      </span>
      <span className="sr-only">{phrases.join('、')}。</span>
    </span>
  )
}

export default function Hero({ variantId = 'main', showRings = true }) {
  const variant = HERO_VARIANTS.find((v) => v.id === variantId) ?? HERO_VARIANTS[0]

  // 全宽通栏深色区，紧接在导航之后（导航自身占位，不叠压）。
  // aspect-ratio 24/9 = 24 列 ÷ 9 行，是背景格子成为正方形的前提。
  // min-h 是内容保护下限：24:9 是很扁的比例，只有视口足够宽时算出的高度才装得下
  // Hero 内容；更窄时下限接管，盒子仍是 24×9 格但格子变高——好过内容被裁掉。
  // 540 = 1440 × 9/24，即 1440px 视口下格子恰好是 60×60 正方形。
  return (
    <section
      id="top"
      className="relative flex min-h-[540px] w-full items-center overflow-hidden bg-ink [aspect-ratio:24/9]"
    >
      <div className="w-full">
        {showRings && (
          <>
            <RingMotif
              size={720}
              className="-right-56 -top-60 hidden md:block"
              opacity={0.9}
              blur={2}
            />
            <RingMotif size={520} className="-bottom-64 -left-40" opacity={0.42} />
            <RingMotif
              size={300}
              className="-right-20 -top-28 md:hidden"
              opacity={0.7}
              blur={1}
            />
          </>
        )}

        {/* 背景网格：横向 24 格、纵向 9 格。用百分比切分而非固定 px，
            格数才不随视口宽度变化。 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: 'calc(100% / 24) calc(100% / 9)',
          }}
        />

        <div className="wrap relative z-10 py-16 md:py-20">
          <div className="max-w-[1000px]">
            <div className="mb-7 flex items-center gap-3.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glint opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-glint" />
              </span>
              <span className="eyebrow text-glint">
                为中国出海品牌打造的海外站点技术团队
              </span>
            </div>

            <h1 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.28] tracking-tight text-white">
              {variant.lines.map((line, i) =>
                Array.isArray(line) ? (
                  <PhraseRotator key={i} phrases={line} />
                ) : (
                  <span key={i} className="block">
                    {line}
                  </span>
                ),
              )}
            </h1>

            <p className="mt-7 max-w-[600px] text-[16px] leading-[1.75] text-white/72 md:text-[17px]">
              从电商建站、平台迁移到 AI 客服与数据分析，36 Tech
              用一个团队承接你海外站点的全部技术环节——
              <span className="font-semibold text-white">中文沟通，海外标准。</span>
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button as="a" href="#diagnose" variant="amber" className="group">
                获取免费站点诊断
                <Arrow className="group-hover:translate-x-1" />
              </Button>
              <Button as="a" href="#services" variant="ghostLight" className="group">
                查看服务全景
              </Button>
            </div>

            <p className="mt-6 font-mono text-[11.5px] tracking-wide text-white/45">
              免费诊断 · 3 个工作日出具报告 · 不满意不推进下一步
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
