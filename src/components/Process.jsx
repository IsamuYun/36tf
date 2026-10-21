import { Reveal, SectionHead } from './ui.jsx'
import { useContent } from '../content/index.jsx'
import Band from './Band.jsx'

export default function Process() {
  const { PROCESS, UI } = useContent()
  return (
    <Band>
      <Reveal>
        <SectionHead title={UI.process.title} zh={UI.process.sub} />
      </Reveal>

      <div className="relative">
        {/* 贯穿四步的连接线（桌面端）：压在标题下方 8px 处。
            标题行高定死 27px，27 + 8 = 35；标题必须单行，否则线会穿过第二行。 */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[35px] hidden h-px bg-gradient-to-r from-fox/45 via-fox/25 to-transparent lg:block"
        />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PROCESS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="relative">
                <h3 className="font-display text-[18px] font-bold leading-[27px]">{s.title}</h3>
                <p className="mt-5 text-[14.5px] leading-[1.75] text-ink/62">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  )
}
