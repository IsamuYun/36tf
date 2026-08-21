import { Reveal, SectionHead } from './ui.jsx'
import { PROCESS } from '../content.js'
import Band from './Band.jsx'

export default function Process() {
  return (
    <Band>
      <Reveal>
        <SectionHead num="05" title="四步开始" zh="每一步都有明确产出，你随时知道进展到哪。" />
      </Reveal>

      <div className="relative">
        {/* 贯穿四步的连接线（桌面端） */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[19px] hidden h-px bg-gradient-to-r from-fox/45 via-fox/25 to-transparent lg:block"
        />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PROCESS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="relative">
                <div className="mb-6 flex h-10 items-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-fox/30 bg-cloud font-mono text-[12px] font-semibold text-fox">
                    {s.n}
                  </span>
                </div>
                <h3 className="font-display text-[18px] font-bold">{s.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.75] text-ink/62">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  )
}
