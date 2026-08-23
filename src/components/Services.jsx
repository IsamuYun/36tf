import { Reveal, SectionHead, Arrow } from './ui.jsx'
import { useContent } from '../content/index.jsx'
import Band from './Band.jsx'

export default function Services() {
  const { SERVICE_GROUPS, UI } = useContent()
  return (
    <Band id="services" tone="white">
      <div>
        <Reveal>
          <SectionHead num={UI.services.num} title={UI.services.title} zh={UI.services.sub} />
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-2">
          {SERVICE_GROUPS.map((group, gi) => (
            <Reveal key={group.domain} delay={gi * 80}>
              <div className="flex h-full flex-col rounded-3xl border border-ink/[0.09] bg-cloud p-7 md:p-9">
                {/* 能力域标头 */}
                <div className="mb-7 flex items-baseline justify-between gap-4 border-b border-ink/[0.09] pb-5">
                  <h3 className="font-display text-[22px] font-extrabold tracking-tight md:text-[26px]">
                    {group.domain}
                  </h3>
                  <span className="text-right font-mono text-[10.5px] tracking-wide text-ink/40">
                    {group.note}
                  </span>
                </div>

                {/* 服务条目 */}
                <div className="flex flex-1 flex-col">
                  {group.items.map((item, i) => (
                    <a
                      key={item.no}
                      href="#diagnose"
                      className={`group flex items-start gap-4 py-4 transition-colors ${
                        i > 0 ? 'border-t border-ink/[0.07]' : ''
                      }`}
                    >
                      <span className="mt-1 font-mono text-[11px] text-ink/30 transition-colors group-hover:text-fox">
                        {item.no}
                      </span>
                      <span className="flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-display text-[16.5px] font-bold transition-colors group-hover:text-fox md:text-[17.5px]">
                            {item.zh}
                          </span>
                          <Arrow className="text-fox opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </span>
                        <span className="mt-0.5 block font-mono text-[10.5px] tracking-wide text-ink/40">
                          {item.en}
                        </span>
                        <span className="mt-2 block text-[14.5px] leading-[1.7] text-ink/62">
                          {item.body}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  )
}
