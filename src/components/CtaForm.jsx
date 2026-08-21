import { useState } from 'react'
import { Button, Arrow, RingMotif } from './ui.jsx'
import { MARKETS, STAGES } from '../content.js'
import Band from './Band.jsx'

const EMPTY = { site: '', name: '', contact: '', markets: [], problem: '', stage: '' }

/* 校验提示语逐字取自 11-全站通用组件.txt */
function validate(v) {
  const e = {}
  if (!v.site.trim()) e.site = '这项是必填的'
  else if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(v.site.trim()) && v.site.trim() !== '暂无')
    e.site = '看起来不像一个网址，检查一下？'

  if (!v.name.trim()) e.name = '这项是必填的'

  if (!v.contact.trim()) e.contact = '这项是必填的'
  else if (!/@/.test(v.contact) && v.contact.trim().length < 4)
    e.contact = '留个能联系上你的邮箱或微信号'

  return e
}

export default function CtaForm() {
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
    const e = validate(values)
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
            <span className="eyebrow text-glint">免费诊断</span>
            <h2 className="mt-5 font-display text-[30px] font-extrabold leading-[1.2] text-white md:text-[40px]">
              先看看你的站点
              <br />
              现在什么状况
            </h2>
            <p className="mt-6 max-w-[420px] text-[15.5px] leading-[1.8] text-white/70">
              提交站点地址，3 个工作日内收到一份书面诊断报告。
              <span className="font-semibold text-white">免费，且不绑定任何后续合作。</span>
            </p>

            <ul className="mt-9 space-y-3.5">
              {['站点性能与技术债现状', 'Google 与 AI 搜索的可见度', '数据口径是否可信'].map(
                (t) => (
                  <li key={t} className="flex items-center gap-3 text-[14.5px] text-white/72">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-glint" />
                    {t}
                  </li>
                ),
              )}
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
                <h3 className="mt-6 font-display text-[26px] font-extrabold text-white">收到了</h3>
                <p className="mt-4 max-w-[380px] text-[15px] leading-[1.8] text-white/70">
                  我们通常在 1 个工作日内回复。如果超过 2 个工作日没收到消息，可以直接发邮件到
                  <span className="mx-1 font-mono text-glint">【待填：联系邮箱】</span>。
                </p>
                <button
                  className="mt-8 font-mono text-[12px] text-white/45 underline underline-offset-4 transition-colors hover:text-white"
                  onClick={() => {
                    setValues(EMPTY)
                    setStatus('idle')
                  }}
                >
                  再提交一次（原型演示）
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="space-y-5">
                {[
                  { k: 'site', label: '站点地址', ph: 'https://your-brand.com', hint: '还没有站点可填「暂无」' },
                  { k: 'name', label: '你的称呼', ph: '怎么称呼您' },
                  { k: 'contact', label: '联系方式', ph: '邮箱或微信号', hint: '我们优先用你填写的方式联系' },
                ].map((f) => (
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
                  <span className="mb-2.5 block text-[13px] font-medium text-white/80">目标市场</span>
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
                    你所处的阶段
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
                    你现在最头疼的问题
                    <span className="ml-auto text-[11px] font-normal text-white/35">选填</span>
                  </label>
                  <textarea
                    id="f-problem"
                    rows={3}
                    value={values.problem}
                    onChange={set('problem')}
                    placeholder="比如：站点很慢、想换平台但怕丢排名、海外客服跟不上、数据对不上……"
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
                      正在提交…
                    </>
                  ) : (
                    <>
                      提交，获取诊断
                      <Arrow className="group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                <p className="text-[12px] leading-relaxed text-white/40">
                  提交即表示同意我们通过你留下的方式与你联系。信息仅用于本次沟通，不会用于其他用途，也不会提供给第三方。
                </p>
              </form>
            )}
          </div>
      </div>
    </Band>
  )
}
