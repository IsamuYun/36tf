import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button, Arrow } from './ui.jsx'
import { PhraseRotator } from './HeroPhrase.jsx'
import { useContent } from '../content/index.jsx'

const THUMB_W = 96
const THUMB_H = 72
const FLIGHT_MS = 640 // 海报从缩略图飞到舞台的时长

/**
 * 首页 Hero —— 1920×600 的左文右图版式，中英两版共用。
 *
 * 文案与海报全部来自内容层（UI.heroShowcase / HERO_POSTERS），
 * 两种语言各写各的，改一边不影响另一边。
 *
 * 版式是一张 24×10 的网格（lg 起），格线用点线画出：
 * 1920 下每格 80×60，与缩略图的 96×72 同为 4:3。
 * 通栏深色底（ink），左右各 12 格、左右对称：文案与海报各自在自己那半居中。
 * 左：第 1–12 格，白字 + 一个琥珀色 CTA（2px 圆角）。
 * 标题里的数组项会变成逐字翻起的短句轮播，见 PhraseRotator。
 * 右：第 13–24 格，四张网站海报轮播，每张停留 dwellMs（默认 8 秒）。
 * 海报本身就是版面，不能裁：容器按 4:3 锁比例（与原图一致），
 * 高度吃满可用空间、宽度自适应，圆角与投影才会贴着图片边缘而不是空框。
 * 缩略图按钮 96×72 浮在整个 section 的中下方（lg 以上），绝对定位、脱离文档流——
 * 左右两栏都不必为它让出高度，海报因此能吃满 600px。
 *
 * 换图不是淡入淡出，而是 FLIP：新海报先被摆到自己那个缩略图的位置和大小上，
 * 再动画回到舞台的原位，看上去就是从缩略图里平移放大出来。
 * 动画期间上一张仍留在舞台上垫底，新的一张落定后正好把它盖住。
 * 系统开启「减少动效」时不自动轮播，也不做飞入，只留缩略图手动切换。
 */
export default function HeroShowcase() {
  const { HERO_POSTERS, UI } = useContent()
  const t = UI.heroShowcase
  /* active 与 prev 必须是同一个 state：分成两个 setState 时，
     prev 的更新会晚一次渲染落地，飞行的那一帧底下就是空白而不是上一张。
     prev = 上一张，动画期间垫在底下，新的一张落定后正好把它盖住。 */
  const [{ active, prev }, setShown] = useState({ active: 0, prev: 0 })
  const [reduced, setReduced] = useState(false)

  const stageRef = useRef(null)
  const posterRefs = useRef([])
  const thumbRefs = useRef([])

  const show = useCallback((i) => {
    setShown((s) => (i === s.active ? s : { active: i, prev: s.active }))
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // 依赖里带上 active：点缩略图后计时重新开始，而不是接着上一轮的余额
  useEffect(() => {
    if (reduced) return
    const timer = setTimeout(() => show((active + 1) % HERO_POSTERS.length), t.dwellMs)
    return () => clearTimeout(timer)
  }, [active, reduced, t.dwellMs, HERO_POSTERS.length, show])

  /* FLIP：先量出缩略图（First）与舞台（Last）的位置差，把新海报反向变换回缩略图上，
     强制重排后再解除变换，让浏览器补出中间帧。
     用 useLayoutEffect 而非 useEffect——必须在浏览器绘制这一帧之前把起始变换写进去，
     否则会先闪一下满尺寸的新海报。 */
  useLayoutEffect(() => {
    if (reduced) return
    const poster = posterRefs.current[active]
    const thumb = thumbRefs.current[active]
    const stage = stageRef.current
    if (!poster || !thumb || !stage) return

    const t0 = thumb.getBoundingClientRect()
    const t1 = stage.getBoundingClientRect()
    if (!t1.width || !t1.height) return

    const scale = t0.width / t1.width
    const dx = t0.left + t0.width / 2 - (t1.left + t1.width / 2)
    const dy = t0.top + t0.height / 2 - (t1.top + t1.height / 2)

    poster.style.transition = 'none'
    poster.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    poster.getBoundingClientRect() // 强制重排，否则两次赋值会被合并，动画不发生
    poster.style.transition = `transform ${FLIGHT_MS}ms var(--ease-brand)`
    poster.style.transform = 'none'
  }, [active, reduced])

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden bg-ink lg:min-h-[600px] lg:[aspect-ratio:1920/600]"
    >
      {/* 24×10 点线网格，画在内容之下（lg 起；窄屏是上下堆叠，不画格）。
          只画线：竖线 23 条 + 横线 9 条 + 外框，比真铺 240 个格子便宜得多。 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute inset-0 border border-dotted border-white/15" />
        {Array.from({ length: 23 }, (_, i) => (
          <div
            key={`v${i}`}
            className="absolute inset-y-0 border-l border-dotted border-white/15"
            style={{ left: `${((i + 1) * 100) / 24}%` }}
          />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={`h${i}`}
            className="absolute inset-x-0 border-t border-dotted border-white/15"
            style={{ top: `${(i + 1) * 10}%` }}
          />
        ))}
      </div>

      <div className="relative grid h-full lg:grid-cols-[repeat(24,minmax(0,1fr))] lg:grid-rows-[repeat(10,minmax(0,1fr))]">
        {/* 左：文案，占第 1–12 列、全部 10 行。
            lg 起在自己这半里居中，宽度取 704px——与海报同宽（600 高的舞台去掉
            上下 36px 内边距，按 4:3 推出来就是 704×528），两半的内缩才一致。
            文字本身仍左对齐，居中排文案会难读。 */}
        <div className="flex items-center px-6 py-16 md:px-10 lg:[grid-area:1/1/11/13] lg:justify-center lg:px-10 lg:py-0">
          <div className="w-full max-w-[620px] lg:max-w-[704px]">
            <span className="eyebrow text-glint">{t.eyebrow}</span>

            {/* title 的每一项可以是字符串，也可以是字符串数组。
                数组 = 「短句组」，交给 PhraseRotator 做逐字翻起的轮播；
                与内容层 HERO_VARIANTS.lines 是同一套约定。 */}
            <h1 className="mt-6 font-display text-[clamp(30px,2.7vw,44px)] font-extrabold leading-[1.15] tracking-tight text-white">
              {t.title.map((line, i) =>
                Array.isArray(line) ? (
                  <PhraseRotator
                    key={i}
                    phrases={line}
                    period={t.period}
                    tight={t.tightPeriod}
                    joiner={t.joiner}
                  />
                ) : (
                  <span key={i} className="block">
                    {line}
                  </span>
                ),
              )}
            </h1>

            {/* 块宽 704 是为了和海报对齐，正文行长另外收窄——一行 90 字符读不下去 */}
            <p className="mt-6 max-w-[560px] text-[16px] leading-[1.75] text-white/72 md:text-[17px]">
              {t.lead}
            </p>

            {/* !rounded 覆盖 Button 基础样式里的 rounded-full：
                两者都是 border-radius，胜负取决于 Tailwind 的生成顺序而非
                class 字符串顺序，只能靠 important 拿下 */}
            <div className="mt-9">
              <Button as="a" href="#diagnose" variant="amber" className="group !rounded-[2px]">
                {t.cta}
                <Arrow className="group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* 右：海报舞台。里层的 absolute inset-0 不能省——
            它给海报框一个确定的高度，h-full 才解析得出来，
            4:3 的宽度也才由高度推出来，而不是反过来把版面撑破。 */}
        <div className="relative min-h-[420px] lg:[grid-area:1/13/11/25] lg:min-h-0">
          <div className="absolute inset-0 flex justify-center px-6 py-8 md:px-10 lg:py-9">
            <div ref={stageRef} className="relative h-full max-w-full [aspect-ratio:4/3]">
              {HERO_POSTERS.map((p, i) => {
                // 只留当前和上一张可见：上一张在动画期间垫底，落定后被完全盖住
                const visible = i === active || i === prev
                return (
                  <img
                    key={p.src}
                    ref={(el) => {
                      posterRefs.current[i] = el
                    }}
                    src={p.src}
                    alt={p.alt}
                    width="1024"
                    height="768"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    aria-hidden={i !== active}
                    className={`absolute inset-0 h-full w-full rounded-2xl object-cover ring-1 ring-white/10 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.75)] ${
                      visible ? 'opacity-100' : 'opacity-0'
                    } ${i === active ? 'z-20' : i === prev ? 'z-10' : 'z-0'}`}
                    style={reduced ? undefined : { willChange: 'transform' }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 缩略图按钮：lg 以上浮在整个 section 的中下方——绝对定位、脱离文档流，
          左右两栏都不必为它让出高度，海报因此能吃满 600px。
          它一半压在深色底上、一半压在浅色的海报上，所以按钮自带半透明白描边和投影，
          两种底色上都分得清；选中态换成品牌蓝描边。

          lg 以下回到正常流：窄屏一行放不下四个 96px（尺寸是定死的，不缩小），
          换行成两排再浮起来会盖掉大半张海报。

          z-30 要高于飞行中的海报（z-20）：静止时缩略图压在海报下沿上不能被盖住，
          起飞的那一瞬海报正好贴在缩略图上，从它背后长出来才对。 */}
      <div
        role="tablist"
        aria-label={t.posterHint}
        className="flex max-w-full flex-wrap items-center justify-center gap-3 px-6 pb-8 lg:absolute lg:bottom-7 lg:left-1/2 lg:z-30 lg:max-w-[calc(100%-2rem)] lg:-translate-x-1/2 lg:bg-transparent lg:px-0 lg:pb-0"
      >
        {HERO_POSTERS.map((p, i) => {
          const on = i === active
          return (
            <button
              key={p.src}
              ref={(el) => {
                thumbRefs.current[i] = el
              }}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={p.label}
              onClick={() => show(i)}
              className={`overflow-hidden rounded-lg border-2 bg-ink shadow-[0_10px_28px_-12px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[var(--ease-brand)] ${
                on
                  ? 'border-fox'
                  : 'border-white/30 opacity-60 hover:border-white/60 hover:opacity-100'
              }`}
            >
              <img
                src={p.src}
                alt=""
                width={THUMB_W}
                height={THUMB_H}
                loading="lazy"
                className="block h-[72px] w-[96px] object-cover"
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}
