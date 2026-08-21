import { Reveal, SectionHead, Button, Arrow, RingMotif } from './ui.jsx'
import { PATHS } from '../content.js'
import Band from './Band.jsx'

export default function Paths() {
  return (
    <Band>
      <Reveal>
        <SectionHead num="03" title="你现在处在哪个阶段？" align="center" />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2">
        {PATHS.map((p, i) => (
          <Reveal key={p.tag} delay={i * 90}>
            <article
              className={`group relative h-full overflow-hidden rounded-3xl p-8 transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 md:p-11 ${
                i === 0
                  ? 'border border-ink/[0.09] bg-white hover:shadow-[0_30px_70px_-30px_rgba(13,27,46,0.3)]'
                  : 'bg-ink text-white hover:shadow-[0_30px_70px_-28px_rgba(11,78,162,0.7)]'
              }`}
            >
              {i === 1 && (
                <RingMotif
                  size={300}
                  className="-right-24 -top-28 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-110"
                  opacity={0.5}
                />
              )}

              <div className="relative z-10 flex h-full flex-col">
                <span
                  className={`eyebrow ${i === 0 ? 'text-fox' : 'text-glint'}`}
                >
                  {p.tag}
                </span>

                <h3
                  className={`mt-5 font-display text-[24px] font-extrabold leading-snug md:text-[30px] ${
                    i === 0 ? 'text-ink' : 'text-white'
                  }`}
                >
                  {p.title}
                </h3>

                <p
                  className={`mt-4 flex-1 text-[15px] leading-[1.8] ${
                    i === 0 ? 'text-ink/62' : 'text-white/70'
                  }`}
                >
                  {p.body}
                </p>

                <div className="mt-9">
                  <Button
                    as="a"
                    href="#diagnose"
                    variant={i === 0 ? 'ghost' : 'ghostLight'}
                    className="group/btn"
                  >
                    {p.cta}
                    <Arrow className="group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Band>
  )
}
