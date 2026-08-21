import { useState } from 'react'
import { Reveal, Placeholder } from '../components/ui.jsx'
import Band from '../components/Band.jsx'
import { ABOUT_HERO, ABOUT_GAP, ABOUT_PRINCIPLES, ABOUT_CONCERNS } from '../content.js'

/* 页头：纯文字，不做深色 Hero。about 页保持克制。 */
function Masthead() {
  return (
    <Band>
      <Reveal>
        <div className="max-w-[820px]">
          <span className="eyebrow text-fox">{ABOUT_HERO.eyebrow}</span>
          <h1 className="mt-6 font-display text-[clamp(30px,4.4vw,50px)] font-extrabold leading-[1.18] tracking-tight">
            {ABOUT_HERO.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-7 max-w-[560px] text-[16px] leading-[1.85] text-ink/60 md:text-[17px]">
            {ABOUT_HERO.lead}
          </p>
        </div>
      </Reveal>
    </Band>
  )
}

/* 我们为什么做这件事 */
function TheGap() {
  return (
    <Band>
      <div className="grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:gap-16">
        <Reveal>
          <div>
            <span className="eyebrow text-ink/40">{ABOUT_GAP.eyebrow}</span>
            <h2 className="mt-5 font-display text-[26px] font-extrabold tracking-tight md:text-[32px]">
              {ABOUT_GAP.title}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div>
            <div className="space-y-5">
              {ABOUT_GAP.paragraphs.map((p) => (
                <p key={p} className="text-[16px] leading-[1.9] text-ink/70">
                  {p}
                </p>
              ))}
            </div>
            <p className="mt-8 border-t border-ink/[0.12] pt-8 font-display text-[19px] font-bold leading-relaxed md:text-[21px]">
              {ABOUT_GAP.closing}
            </p>
          </div>
        </Reveal>
      </div>
    </Band>
  )
}

/* 四条准则：四宫格，靠分隔线切分 */
function Principles() {
  return (
    <>
      <Band>
        <Reveal>
          <div className="max-w-[720px]">
            <span className="eyebrow text-ink/40">我们怎么做事</span>
            <h2 className="mt-5 font-display text-[26px] font-extrabold tracking-tight md:text-[32px]">
              四条准则
            </h2>
            <p className="mt-5 text-[16px] leading-[1.85] text-ink/60">
              写下来是为了让你可以拿它要求我们。
            </p>
          </div>
        </Reveal>
      </Band>

      {/* flush：网格直接贴到左右竖线上，格与格之间用 1px 缝隙露出底色成线 */}
      <Band flush>
        <div className="grid gap-px bg-ink/[0.1] sm:grid-cols-2 xl:grid-cols-4">
          {ABOUT_PRINCIPLES.map((p, i) => (
            <Reveal key={p.n} delay={i * 60}>
              <article className="flex h-full flex-col bg-cloud p-8 transition-colors duration-300 hover:bg-white md:p-9">
                <span className="font-mono text-[11px] tracking-[0.18em] text-fox">{p.n}</span>
                <h3 className="mt-5 font-display text-[18px] font-bold md:text-[19px]">
                  {p.title}
                </h3>
                <p className="mt-3.5 text-[14.5px] leading-[1.8] text-ink/62">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Band>
    </>
  )
}

/* 团队：真实信息填充前不上线 */
function Team() {
  return (
    <Band>
      <Reveal>
        <div className="max-w-[720px]">
          <span className="eyebrow text-ink/40">团队</span>
          <h2 className="mt-5 font-display text-[26px] font-extrabold tracking-tight md:text-[32px]">
            做这些事的人
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-ink/60">
            真实信息填充后上线。在此之前本模块不对外展示——虚构的团队介绍经不起核实。
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-12 border border-dashed border-ink/15 p-7 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-[14.5px] font-semibold text-ink/70">
              【待填：团队规模】·【待填：成立年份】·【待填：所在城市】
            </p>
            <span className="font-mono text-[10px] tracking-[0.16em] text-amber uppercase">
              待补内容
            </span>
          </div>

          <div className="grid gap-px bg-ink/[0.1] sm:grid-cols-2">
            {[1, 2].map((n) => (
              <div key={n} className="flex gap-5 bg-cloud p-6">
                <Placeholder label="avatar" className="h-20 w-20 shrink-0" />
                <div className="min-w-0 flex-1 space-y-2.5">
                  <Placeholder label="姓名" className="h-6 w-1/2" />
                  <Placeholder label="职责" className="h-6 w-2/3" />
                  <Placeholder label="一句话背景" className="h-6 w-full" />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[13px] leading-relaxed text-ink/45">
            团队人数少不必回避——写「一支 X 人的小团队」，并说明为什么小是优势：同时只接有限项目、
            每个项目由资深成员直接负责、没有层层转包。
          </p>
        </div>
      </Reveal>
    </Band>
  )
}

/* 常见顾虑：每条之间本身就是分隔线 */
function Concerns() {
  const [open, setOpen] = useState(0)

  return (
    <Band>
      <div className="grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:gap-16">
        <Reveal>
          <div>
            <span className="eyebrow text-ink/40">你可能想问</span>
            <h2 className="mt-5 font-display text-[26px] font-extrabold tracking-tight md:text-[32px]">
              常见顾虑
            </h2>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="border-t border-ink/[0.12]">
            {ABOUT_CONCERNS.map((f, i) => {
              const isOpen = open === i
              return (
                <div key={f.q} className="border-b border-ink/[0.12]">
                  <h3>
                    <button
                      className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <span
                        className={`font-display text-[16px] font-bold transition-colors md:text-[17.5px] ${
                          isOpen ? 'text-fox' : 'group-hover:text-fox'
                        }`}
                      >
                        {f.q}
                      </span>
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
              )
            })}
          </div>
        </Reveal>
      </div>
    </Band>
  )
}

export default function AboutPage() {
  return (
    <div className="border-b border-ink/[0.1]">
      <Masthead />
      <TheGap />
      <Principles />
      <Team />
      <Concerns />
    </div>
  )
}
