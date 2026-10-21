/**
 * 分隔线框架 —— 结构参考 https://goabacus.co/company/about
 *
 * 每个区块 = 全宽的 border-t 横线 + 内层定宽列的左右竖线。只用 1px 的线分隔，不加圆点。
 * 竖线只在 xl 以上出现：窄屏时定宽列已经贴满视口，画竖线毫无意义。
 *
 * 全站所有 Band 必须用同一个 max-w，竖线才能连成一条贯穿整页的中央栏。
 * 改宽度请改这里的 FRAME_W，不要在单个区块上覆盖——宽度一旦不同，
 * 该区块的竖线就接不上上下相邻区块的竖线。
 * index.css 的 .wrap（Nav / Footer 用）必须跟这个值保持一致。
 */

const FRAME_W = 'max-w-[1200px]'

const TONES = {
  cloud: {
    section: 'bg-cloud',
    line: 'border-ink/[0.1]',
  },
  white: {
    section: 'bg-white',
    line: 'border-ink/[0.1]',
  },
  ink: {
    section: 'bg-ink',
    line: 'border-white/[0.14]',
  },
}

export default function Band({
  children,
  tone = 'cloud',
  flush = false,
  className = '',
  id,
}) {
  const t = TONES[tone] ?? TONES.cloud

  return (
    <section id={id} className={`border-t ${t.line} ${t.section}`}>
      <div
        className={`relative mx-auto w-full ${FRAME_W} xl:border-x ${t.line} ${
          flush ? '' : 'px-6 py-16 md:px-10 md:py-24'
        } ${className}`}
      >
        {children}
      </div>
    </section>
  )
}
