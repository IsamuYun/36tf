import { useEffect, useState } from 'react'

/**
 * Hero 主标题里的短句轮播 —— 逐字符 3D 翻起。
 * 中英两版 Hero 共用这一份实现（HeroShowcase 与旧的 Hero）。
 *
 * 动画的 CSS 关键帧在 index.css：hero-char / hero-rule / hero-dot。
 */

const CHAR_STEP = 34 // 每字符错开毫秒数
const DWELL = 4000 // 每句停留时长

/**
 * Hero 主标题里的一个短句：
 * 逐字符绕底边 3D 翻起 + 下方细下划线 + 句末标点（品牌蓝）。
 * 整句 nowrap，避免中文从句中断行。
 *
 * 句末标点由语言决定：中文全角句号占满 1em 但字形只在左半，
 * 需要负边距吃掉右侧空白；英文的半角句点不需要，故 tight 可关。
 */
export function HeroPhrase({ text, period = '。', tight = true, delay = 0, className = '' }) {
  const chars = Array.from(text)
  const tail = delay + chars.length * CHAR_STEP

  return (
    <span className={`relative inline-block whitespace-nowrap pb-[0.3em] ${className}`}>
      {chars.map((ch, i) => (
        <span key={i} className="hero-char-outer">
          <span className="hero-char" style={{ animationDelay: `${delay + i * CHAR_STEP}ms` }}>
            {/* 逐字符包一层 inline-block，普通空格会被折叠掉；
                英文有词间空格，必须换成不换行空格才不会连成一个词 */}
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        </span>
      ))}

      {/* 句末标点，品牌蓝 */}
      <span
        className={`hero-dot inline-block text-fox ${tight ? '-mr-[0.45em]' : ''}`}
        style={{ animationDelay: `${tail + 60}ms` }}
      >
        {period}
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
export function PhraseRotator({ phrases, period, tight, joiner }) {
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
          <HeroPhrase
            key={p}
            text={p}
            period={period}
            tight={tight}
            className="mr-[0.5em] last:mr-0"
          />
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
            {p}
            {period}
          </span>
        ))}
        {/* justify-self-start：grid 子项默认拉伸，不加的话下划线会跟着最宽一句的宽度走 */}
        <HeroPhrase
          key={active}
          text={phrases[active]}
          period={period}
          tight={tight}
          className="col-start-1 row-start-1 justify-self-start"
        />
      </span>
      <span className="sr-only">
        {phrases.join(joiner)}
        {period}
      </span>
    </span>
  )
}
