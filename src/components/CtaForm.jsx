import { useState } from 'react'
import { Button, Arrow, RingMotif } from './ui.jsx'
import { useContent } from '../content/index.jsx'
import Band from './Band.jsx'

const EMPTY = { site: '', name: '', contact: '', markets: [], problem: '', stage: '' }

/* 校验提示语来自内容层，两种语言各写各的 */
function validate(v, t) {
  const e = {}
  const noSite = t.noSite.toLowerCase()
  if (!v.site.trim()) e.site = t.errors.required
  else if (
    !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(v.site.trim()) &&
    v.site.trim().toLowerCase() !== noSite
  )
    e.site = t.errors.url

  if (!v.name.trim()) e.name = t.errors.required

  if (!v.contact.trim()) e.contact = t.errors.required
  else if (!/@/.test(v.contact) && v.contact.trim().length < 4) e.contact = t.errors.contact

  return e
}

export default function CtaForm() {
  const { MARKETS, STAGES, UI } = useContent()
  const t = UI.form
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | done

  const set = (k) => (ev) => {
    const val = ev.target.value
    setValues((s) => ({ ...s, [k]: val }))
    if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined }))
  }

  const toggleMarket = (m) =>
    setValues((s) => ({
      ...s,
      markets: s.markets.includes(m) ? s.markets.filter((x) => x !== m) : [...s.markets, m],
    }))

  const onSubmit = (ev) => {
    ev.preventDefault()
    const e = validate(values, t)
    setErrors(e)
    if (Object.keys(e).length) {
      // 焦点移到第一个出错的字段
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus()
      return
    }
    setStatus('loading')
    // 原型：不接后端，仅演示状态流转
    setTimeout(() => setStatus('done'), 1100)
  }

  const fieldCls = (k) =>
    `w-full rounded-xl border bg-white/5 px-4 py-3.5 text-[15px] text-white placeholder:text-white/28 ` +
    `transition-colors duration-200 focus:outline-none ` +
    (errors[k]
      ? 'border-amber focus:border-amber'
      : 'border-white/15 hover:border-white/25 focus:border-glint')

  return (
    <Band id="diagnose" tone="ink">
      {/* 圆环单独套一层裁切：若把 overflow-hidden 放到框上，框外 1px 的角点会被一起裁掉 */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <RingMotif size={520} className="-right-48 -top-56 hidden md:block" opacity={0.5} blur={1} />
        <RingMotif size={340} className="-bottom-44 -left-28" opacity={0.3} />
      </div>

      <div className="relative z-10 grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
          {/* 左：说明 */}
          <div className="lg:self-center">
            <span className="eyebrow text-glint">{t.eyebrow}</span>
            <h2 className="mt-5 font-display text-[30px] font-extrabold leading-[1.2] text-white md:text-[40px]">
              {t.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-[420px] text-[15.5px] leading-[1.8] text-white/70">
              {t.leadBefore}
              <span className="font-semibold text-white">{t.leadStrong}</span>
            </p>

            <ul className="mt-9 space-y-3.5">
              {t.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-[14.5px] text-white/72">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-glint" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* 右：表单 / 成功态 */}
          <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-7 backdrop-blur-sm md:p-9">
            {status === 'done' ? (
              <div className="flex min-h-[420px] flex-col items-start justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber">
                  <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
                    <path
                      d="M4 10.5l4 4 8-8.5"
                      stroke="#0D1B2E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="mt-6 font-display text-[26px] font-extrabold text-white">
                  {t.doneTitle}
                </h3>
                <p className="mt-4 max-w-[380px] text-[15px] leading-[1.8] text-white/70">
                  {t.doneBefore}
                  <span className="mx-1 font-mono text-glint">{t.doneEmail}</span>
                  {t.doneAfter}
                </p>
                <button
                  className="mt-8 font-mono text-[12px] text-white/45 underline underline-offset-4 transition-colors hover:text-white"
                  onClick={() => {
                    setValues(EMPTY)
                    setStatus('idle')
                  }}
                >
                  {t.resubmit}
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="space-y-5">
                {t.fields.map((f) => (
                  <div key={f.k}>
                    <label
                      htmlFor={`f-${f.k}`}
                      className="mb-2 flex items-baseline gap-1.5 text-[13px] font-medium text-white/80"
                    >
                      {f.label}
                      <span className="text-amber">*</span>
                      {f.hint && (
                        <span className="ml-auto text-[11px] font-normal text-white/35">
                          {f.hint}
                        </span>
                      )}
                    </label>
                    <input
                      id={`f-${f.k}`}
                      type="text"
                      value={values[f.k]}
                      onChange={set(f.k)}
                      placeholder={f.ph}
                      aria-invalid={!!errors[f.k]}
                      aria-describedby={errors[f.k] ? `e-${f.k}` : undefined}
                      className={fieldCls(f.k)}
                    />
                    {errors[f.k] && (
                      <p id={`e-${f.k}`} className="mt-1.5 font-mono text-[11.5px] text-amber">
                        {errors[f.k]}
                      </p>
                    )}
                  </div>
                ))}

                {/* 目标市场（多选） */}
                <div>
                  <span className="mb-2.5 block text-[13px] font-medium text-white/80">
                    {t.marketsLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {MARKETS.map((m) => {
                      const on = values.markets.includes(m)
                      return (
                        <button
                          key={m}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleMarket(m)}
                          className={`rounded-full border px-4 py-2 text-[13px] transition-all duration-200 ${
                            on
                              ? 'border-glint bg-glint/15 text-white'
                              : 'border-white/15 text-white/55 hover:border-white/35 hover:text-white/80'
                          }`}
                        >
                          {m}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 阶段（单选） */}
                <div>
                  <span className="mb-2.5 block text-[13px] font-medium text-white/80">
                    {t.stageLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {STAGES.map((s) => {
                      const on = values.stage === s
                      return (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setValues((v) => ({ ...v, stage: on ? '' : s }))}
                          className={`rounded-full border px-4 py-2 text-[13px] transition-all duration-200 ${
                            on
                              ? 'border-glint bg-glint/15 text-white'
                              : 'border-white/15 text-white/55 hover:border-white/35 hover:text-white/80'
                          }`}
                        >
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 问题描述 */}
                <div>
                  <label
                    htmlFor="f-problem"
                    className="mb-2 flex items-baseline text-[13px] font-medium text-white/80"
                  >
                    {t.problemLabel}
                    <span className="ml-auto text-[11px] font-normal text-white/35">
                      {t.optional}
                    </span>
                  </label>
                  <textarea
                    id="f-problem"
                    rows={3}
                    value={values.problem}
                    onChange={set('problem')}
                    placeholder={t.problemPh}
                    className={`${fieldCls('problem')} resize-none leading-relaxed`}
                  />
                </div>

                <Button
                  type="submit"
                  variant="amber"
                  disabled={status === 'loading'}
                  className="group !w-full"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-ink/30 border-t-ink" />
                      {t.submitting}
                    </>
                  ) : (
                    <>
                      {t.submit}
                      <Arrow className="group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                <p className="text-[12px] leading-relaxed text-white/40">
                  {t.privacy}
                </p>
              </form>
            )}
          </div>
      </div>
    </Band>
  )
}
