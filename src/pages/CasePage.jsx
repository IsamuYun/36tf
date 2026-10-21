import { Link } from 'react-router-dom'
import { Reveal, Placeholder, Button, Arrow } from '../components/ui.jsx'
import Band from '../components/Band.jsx'
import { useContent, useHref } from '../content/index.jsx'

/**
 * 通用案例页。文案来自内容层，按 contentKey 取（CASE_CLINIC / CASE_PMS），中英各一份。
 * 未到位的素材（logo、截图、评语）一律用 Placeholder 标出，不画假图。
 */

const H2 = 'mt-5 font-display text-[26px] font-extrabold tracking-tight md:text-[32px]'

/* 页头：左文右 logo 占位，下方一行标签 */
function Masthead({ c }) {
  return (
    <Band>
      <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-16">
        <Reveal>
          <div className="max-w-[820px]">
            <span className="eyebrow text-fox">{c.eyebrow}</span>
            <h1 className="mt-6 font-display text-[clamp(30px,4.4vw,50px)] font-extrabold leading-[1.18] tracking-tight">
              {c.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-7 max-w-[600px] text-[16px] leading-[1.85] text-ink/60 md:text-[17px]">
              {c.lead}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-ink/[0.12] bg-white px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] text-ink/70"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <aside className="flex flex-col items-center border border-ink/[0.12] bg-white p-6 text-center">
            {c.client.logo ? (
              <img
                src={c.client.logo}
                alt={c.client.name}
                width="256"
                height="256"
                className="h-[256px] w-[256px] object-contain"
              />
            ) : (
              <Placeholder label={c.client.logoLabel} className="h-[256px] w-[256px]" />
            )}
            <p className="mt-5 font-display text-[16px] font-bold">{c.client.name}</p>
            <p className="mt-1 text-[13.5px] text-ink/50">{c.client.location}</p>
          </aside>
        </Reveal>
      </div>
    </Band>
  )
}

/* 三个数字：深色带，琥珀色只给数字本身 */
function Stats({ c }) {
  return (
    <Band tone="ink" flush>
      <div className="grid gap-px bg-white/[0.14] md:grid-cols-3">
        {c.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 70}>
            <div className="h-full bg-ink px-8 py-10 md:px-10 md:py-14">
              <p className="font-display text-[40px] font-extrabold leading-none tracking-tight text-amber md:text-[52px]">
                {s.value}
                {s.unit && (
                  <span className="ml-2 text-[18px] font-semibold text-white/70 md:text-[20px]">
                    {s.unit}
                  </span>
                )}
              </p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-white/60">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Band>
  )
}

/* 之前的状况：左标题右正文，与 about 页 TheGap 同构 */
function Challenge({ c }) {
  const s = c.challenge
  return (
    <Band>
      <div className="grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:gap-16">
        <Reveal>
          <div>
            <span className="eyebrow text-ink/40">{s.eyebrow}</span>
            <h2 className={H2}>{s.title}</h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="space-y-5">
            {s.paragraphs.map((p) => (
              <p key={p} className="text-[16px] leading-[1.9] text-ink/70">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </Band>
  )
}

/* 我们做了什么：三条 + 一张截图占位 */
function Solution({ c }) {
  const s = c.solution
  return (
    <>
      <Band>
        <Reveal>
          <div className="max-w-[720px]">
            <span className="eyebrow text-ink/40">{s.eyebrow}</span>
            <h2 className={H2}>{s.title}</h2>
          </div>
        </Reveal>
      </Band>
      <Band flush>
        <div className="grid gap-px bg-ink/[0.1] md:grid-cols-3">
          {s.items.map((it, i) => (
            <Reveal key={it.n} delay={i * 60}>
              <article className="flex h-full flex-col bg-cloud p-8 transition-colors duration-300 hover:bg-white md:p-9">
                <span className="font-mono text-[11px] tracking-[0.18em] text-fox">{it.n}</span>
                <h3 className="mt-5 font-display text-[18px] font-bold md:text-[19px]">{it.title}</h3>
                <p className="mt-3.5 text-[14.5px] leading-[1.8] text-ink/62">{it.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Band>
      <Band>
        <Reveal>
          {s.shot ? (
            <img
              src={s.shot}
              alt={s.shotLabel}
              loading="lazy"
              className="w-full border border-ink/[0.12]"
            />
          ) : (
            <Placeholder label={s.shotLabel} ratio="16 / 9" className="w-full" />
          )}
        </Reveal>
      </Band>
    </>
  )
}

/* 流程：六步，桌面三列两行，用序号与短竖线串联 */
function Flow({ c }) {
  const s = c.flow
  return (
    <>
      <Band tone="white">
        <Reveal>
          <div className="max-w-[720px]">
            <span className="eyebrow text-ink/40">{s.eyebrow}</span>
            <h2 className={H2}>{s.title}</h2>
          </div>
        </Reveal>
      </Band>
      <Band tone="white" flush>
        <ol className="grid gap-px bg-ink/[0.1] sm:grid-cols-2 lg:grid-cols-3">
          {s.steps.map((st, i) => (
            <Reveal key={st.n} delay={i * 50}>
              <li className="flex h-full gap-5 bg-white p-7 md:p-8">
                <span className="font-mono text-[11px] tracking-[0.18em] text-fox">{st.n}</span>
                <div>
                  <h3 className="font-display text-[16.5px] font-bold">{st.title}</h3>
                  <p className="mt-2.5 text-[14px] leading-[1.8] text-ink/62">{st.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </Band>
    </>
  )
}

/* 红线：四条 */
function Guardrails({ c }) {
  const s = c.guardrails
  return (
    <Band>
      <div className="grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:gap-16">
        <Reveal>
          <div>
            <span className="eyebrow text-ink/40">{s.eyebrow}</span>
            <h2 className={H2}>{s.title}</h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {s.items.map((g) => (
              <div key={g.title} className="border-t border-ink/[0.12] pt-5">
                <dt className="font-display text-[16.5px] font-bold">{g.title}</dt>
                <dd className="mt-2.5 text-[14.5px] leading-[1.8] text-ink/62">{g.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Band>
  )
}

/* 客户评语 + 技术栈 */
function QuoteAndStack({ c }) {
  return (
    <Band tone="white">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
        <Reveal>
          <figure className="border-l-2 border-fox pl-7">
            <blockquote className="font-display text-[19px] font-bold leading-[1.6] text-ink/85 md:text-[22px]">
              {c.quote.text}
            </blockquote>
            <figcaption className="mt-6 text-[14px] text-ink/55">
              <span className="font-semibold text-ink/80">{c.quote.name}</span>
              <span className="mx-2">·</span>
              {c.quote.role}
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={80}>
          <div>
            <span className="eyebrow text-ink/40">{c.stack.eyebrow}</span>
            <ul className="mt-5 divide-y divide-ink/[0.12] border-y border-ink/[0.12]">
              {c.stack.items.map((it) => (
                <li key={it.name} className="flex flex-wrap items-baseline gap-x-5 gap-y-1 py-4">
                  <span className="w-44 font-mono text-[12.5px] font-semibold tracking-[0.04em]">
                    {it.name}
                  </span>
                  <span className="text-[14px] text-ink/60">{it.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Band>
  )
}

/* 结尾 CTA */
function Cta({ c }) {
  const href = useHref()
  return (
    <Band tone="ink">
      <Reveal>
        <div className="max-w-[720px]">
          <h2 className="font-display text-[26px] font-extrabold tracking-tight text-white md:text-[34px]">
            {c.cta.title}
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-white/65">{c.cta.body}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button as={Link} to={href('/contact')} variant="amber" className="group">
              {c.cta.primary}
              <Arrow className="group-hover:translate-x-0.5" />
            </Button>
            <Button as={Link} to={href('/#cases')} variant="ghostLight">
              {c.cta.secondary}
            </Button>
          </div>
        </div>
      </Reveal>
    </Band>
  )
}

export default function CasePage({ contentKey }) {
  const content = useContent()
  const c = content[contentKey]
  return (
    <div className="border-b border-ink/[0.1]">
      <Masthead c={c} />
      <Stats c={c} />
      <Challenge c={c} />
      <Solution c={c} />
      <Flow c={c} />
      <Guardrails c={c} />
      <QuoteAndStack c={c} />
      <Cta c={c} />
    </div>
  )
}
