import { Button, Arrow, RingMotif } from './ui.jsx'
import { PhraseRotator } from './HeroPhrase.jsx'
import { useContent } from '../content/index.jsx'

export default function Hero({ variantId = 'main', showRings = true }) {
  const { HERO_VARIANTS, UI } = useContent()
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
              <span className="eyebrow text-glint">{UI.hero.eyebrow}</span>
            </div>

            <h1 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.28] tracking-tight text-white">
              {variant.lines.map((line, i) =>
                Array.isArray(line) ? (
                  <PhraseRotator
                    key={i}
                    phrases={line}
                    period={UI.hero.period}
                    tight={UI.hero.tightPeriod}
                    joiner={UI.hero.joiner}
                  />
                ) : (
                  <span key={i} className="block">
                    {line}
                  </span>
                ),
              )}
            </h1>

            <p className="mt-7 max-w-[600px] text-[16px] leading-[1.75] text-white/72 md:text-[17px]">
              {UI.hero.leadBefore}
              <span className="font-semibold text-white">{UI.hero.leadStrong}</span>
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button as="a" href="#diagnose" variant="amber" className="group">
                {UI.hero.ctaPrimary}
                <Arrow className="group-hover:translate-x-1" />
              </Button>
              <Button as="a" href="#services" variant="ghostLight" className="group">
                {UI.hero.ctaSecondary}
              </Button>
            </div>

            <p className="mt-6 font-mono text-[11.5px] tracking-wide text-white/45">
              {UI.hero.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
