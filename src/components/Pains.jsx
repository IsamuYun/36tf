import { Reveal, SectionHead } from './ui.jsx'
import { PAINS } from '../content.js'
import Band from './Band.jsx'

export default function Pains() {
  return (
    <Band>
      <Reveal>
        <SectionHead
          num="01"
          title="这些情况，是不是很熟悉？"
          zh="出海品牌最常见的四类站点问题。"
        />
      </Reveal>

      <div className="grid gap-px overflow-hidden rounded-3xl bg-ink/[0.08] sm:grid-cols-2">
        {PAINS.map((p, i) => (
          <Reveal key={p.n} delay={i * 70}>
            <article className="group h-full bg-cloud p-8 transition-colors duration-300 hover:bg-white md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.18em] text-fox">{p.n}</span>
                <span className="h-px flex-1 bg-ink/10 transition-colors duration-300 group-hover:bg-fox/30" />
              </div>
              <h3 className="font-display text-[19px] font-bold md:text-[21px]">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.75] text-ink/62">{p.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mx-auto mt-14 max-w-[620px] text-center text-[16px] leading-[1.8] text-ink/70 md:text-[17px]">
          这些问题不是孤立的——它们通常出自同一个根因：
          <span className="font-semibold text-ink">
            站点从一开始就没有被当作一项长期资产来建设。
          </span>
        </p>
      </Reveal>
    </Band>
  )
}
