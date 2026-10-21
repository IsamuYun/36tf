import { Reveal, SectionHead } from './ui.jsx'
import { useContent } from '../content/index.jsx'
import Band from './Band.jsx'

/**
 * 首页 S3 · 痛点
 *
 * 外观参考 docs/design/proto/index.html 里 ON-PREMISE AI OPERATING SYSTEM 那组卡片：
 * 卡片外留一圈浅色沟槽，里面是白底圆角卡；卡内 mono 小标签 + 大标题 + 灰正文；
 * 悬停时整块翻成品牌蓝、文字转白。
 *
 * 四张卡 2×2，格与格之间只靠 1px 的 border 分隔。
 */

export default function Pains() {
  const { PAINS, UI } = useContent()
  const t = UI.pains

  return (
    <>
      <Band className="!py-4">
        <div className="flex items-baseline gap-4">
          <h2 className="font-display text-[26px] font-bold leading-tight text-ink md:text-[34px]">
            {t.title}
          </h2>
        </div>
      </Band>

      {/* flush：卡片网格贴满整个框宽，分隔线正好落在框架竖线上 */}
      <Band flush>
        <div className="relative grid sm:grid-cols-2">
          {PAINS.map((p, i) => (
            <Reveal
              key={p.n}
              delay={i * 70}
              className={`border-ink/[0.1] ${i < PAINS.length - 1 ? 'border-b' : ''} sm:border-b-0 ${
                i < 2 ? 'sm:border-b' : ''
              } ${i % 2 === 0 ? 'sm:border-r' : ''}`}
            >
              {/* p-2 的沟槽露出底色，白卡浮在其中；group 挂在白卡上，
                  悬停整块翻色而不是只翻文字 */}
              <div className="h-full bg-cloud p-2">
                <article className="group flex h-full flex-col gap-6 rounded-lg bg-white px-6 py-12 transition-colors duration-300 ease-[var(--ease-brand)] hover:bg-fox md:px-10 md:py-14 xl:p-16">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-[24px] font-bold leading-[1.25] tracking-tight transition-colors duration-300 group-hover:text-white md:text-[30px]">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-[15px] leading-[1.75] text-ink/62 transition-colors duration-300 group-hover:text-white/75">
                    {p.body}
                  </p>
                </article>
              </div>
            </Reveal>
          ))}

        </div>
      </Band>

      <Band className="!py-4">
        <Reveal delay={120}>
          <p className="pt-4 pb-4 mx-auto max-w-[800px] text-center text-[20px] leading-[1.8] text-ink/70 md:text-[17px]">
            {t.closingLead}
            <span className="font-semibold text-ink">{t.closingStrong}</span>
          </p>
        </Reveal>
      </Band>
    </>
  )
}
