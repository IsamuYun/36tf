import { useState } from 'react'
import { Reveal, SectionHead } from './ui.jsx'
import { useContent } from '../content/index.jsx'
import Band from './Band.jsx'

export default function Faq() {
  const { FAQS, UI } = useContent()
  const [open, setOpen] = useState(0)

  return (
    <Band>
      <div className="mx-auto max-w-[820px]">
        <Reveal>
          <SectionHead num={UI.faq.num} title={UI.faq.title} />
        </Reveal>

        {FAQS.map((f, i) => {
          const isOpen = open === i
          return (
            <Reveal key={f.q} delay={i * 55}>
              <div className="border-b border-ink/10">
                <h3>
                  <button
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span
                      className={`font-display text-[16.5px] font-bold transition-colors md:text-[18px] ${
                        isOpen ? 'text-fox' : 'group-hover:text-fox'
                      }`}
                    >
                      {f.q}
                    </span>

                    {/* 加号 → 减号 */}
                    <span className="relative mt-1.5 h-3.5 w-3.5 shrink-0">
                      <span
                        className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 transition-colors ${
                          isOpen ? 'bg-fox' : 'bg-ink/45 group-hover:bg-fox'
                        }`}
                      />
                      <span
                        className={`absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 transition-all duration-300 ease-[var(--ease-brand)] ${
                          isOpen ? 'rotate-90 bg-fox opacity-0' : 'bg-ink/45 group-hover:bg-fox'
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  className="grid transition-all duration-400 ease-[var(--ease-brand)]"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-7 pr-10 text-[15px] leading-[1.85] text-ink/65">{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Band>
  )
}
