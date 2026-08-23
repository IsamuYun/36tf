import { useState } from 'react'
import { Reveal, SectionHead, Arrow } from '../ui.jsx'
import { useContent } from '../../content/index.jsx'

/* 四张卡片：联系信息 / 办公时间 / 小红书码 / 微信码
   结构对应参考文件里的 contactCards */
function ContactCards() {
  const { CONTACT_INFO, CONTACT_CODES } = useContent()
  return (
    <div className="grid gap-px overflow-hidden rounded-3xl border border-ink/[0.09] bg-ink/[0.09] sm:grid-cols-2 lg:grid-cols-4">
      <article className="flex flex-col bg-white p-7">
        <span className="eyebrow text-fox">联系信息</span>
        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-[13px] text-ink/45">电话</dt>
            <dd className="mt-1">
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/[^\d+]/g, '')}`}
                className="font-display text-[17px] font-semibold transition-colors hover:text-fox"
              >
                {CONTACT_INFO.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-ink/45">邮箱</dt>
            <dd className="mt-1">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="break-all font-display text-[17px] font-semibold transition-colors hover:text-fox"
              >
                {CONTACT_INFO.email}
              </a>
            </dd>
          </div>
        </dl>
      </article>

      <article className="flex flex-col bg-white p-7">
        <span className="eyebrow text-fox">办公时间</span>
        <dl className="mt-6 space-y-4">
          {CONTACT_INFO.hours.map((h) => (
            <div key={h.label}>
              <dt className="text-[13px] text-ink/45">{h.label}</dt>
              <dd className="mt-1 font-display text-[15px] font-semibold">{h.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-auto pt-6 text-[12.5px] leading-relaxed text-ink/45">
          中国时区的消息我们照常接收，通常在 1 个工作日内回复。
        </p>
      </article>

      {CONTACT_CODES.map((c) => (
        <article key={c.key} className="flex flex-col items-center bg-white p-7">
          <span className="eyebrow self-start text-fox">{c.caption}</span>
          <img
            src={c.image}
            alt={c.alt}
            loading="lazy"
            className="mt-5 w-full max-w-[190px] rounded-xl border border-ink/[0.08] object-contain"
          />
        </article>
      ))}
    </div>
  )
}

const EMPTY = { name: '', email: '', message: '', company: '' }

function ContactForm() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [feedback, setFeedback] = useState('')

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim()
    const message = form.message.trim()

    if (!name || !email || !message) {
      setStatus('error')
      setFeedback('请填写姓名、邮箱和留言。')
      return
    }

    setStatus('sending')
    setFeedback('')

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, company: form.company }),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok || data.ok === false) {
        throw new Error(data.message || `发送失败（${resp.status}）`)
      }
      setStatus('success')
      setFeedback(`${name}，感谢留言。我们已收到你的信息，通常 1 个工作日内回复。`)
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      setFeedback(err.message || '发送时出现问题，请稍后再试。')
    }
  }

  const field =
    'w-full rounded-xl border border-ink/12 bg-cloud px-4 py-3.5 text-[15px] text-ink ' +
    'transition-colors placeholder:text-ink/35 focus:border-fox focus:outline-none'

  return (
    <form noValidate onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-[13px] font-medium text-ink/70">
            姓名 <span className="text-amber">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={form.name}
            onChange={change}
            placeholder="请输入姓名"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-[13px] font-medium text-ink/70">
            邮箱 <span className="text-amber">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            placeholder="请输入邮箱地址"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-[13px] font-medium text-ink/70">
          留言 <span className="text-amber">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={form.message}
          onChange={change}
          placeholder="请告诉我们需要什么帮助"
          className={`${field} resize-none leading-relaxed`}
        />
      </div>

      {/* 蜜罐字段：真实用户看不见也 tab 不到；机器人填了会被服务端静默丢弃 */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">公司</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={change}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex items-center gap-2 rounded-full bg-fox px-7 py-3.5 font-display text-[15px] font-semibold text-white transition-all hover:bg-[#2a8ce8] hover:shadow-[0_14px_38px_-10px_rgba(30,127,219,0.8)] disabled:pointer-events-none disabled:opacity-45"
        >
          {status === 'sending' ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-white/40 border-t-white" />
              发送中…
            </>
          ) : (
            <>
              发送
              <Arrow className="group-hover:translate-x-1" />
            </>
          )}
        </button>

        {feedback && (
          <p
            aria-live="polite"
            className={`text-[13.5px] leading-relaxed ${
              status === 'success' ? 'text-fox' : 'text-amber'
            }`}
          >
            {feedback}
          </p>
        )}
      </div>

      <p className="text-[12px] leading-relaxed text-ink/40">
        信息仅用于本次沟通，不会用于其他用途，也不会提供给第三方。
      </p>
    </form>
  )
}

export default function ContactBlock() {
  return (
    <section id="contact" className="wrap py-24 md:py-32">
      <Reveal>
        <SectionHead num="03" title="欢迎联系" zh="电话、邮件、微信或小红书都行，挑你顺手的。" />
      </Reveal>

      <Reveal delay={70}>
        <ContactCards />
      </Reveal>

      <Reveal delay={140}>
        <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <div>
            <h3 className="font-display text-[24px] font-extrabold leading-snug md:text-[28px]">
              发送消息
            </h3>
            <p className="mt-4 max-w-[360px] text-[15px] leading-[1.8] text-ink/60">
              不用准备材料。把站点地址和你最头疼的问题写下来就行，我们看完再回你。
            </p>
          </div>
          <ContactForm />
        </div>
      </Reveal>
    </section>
  )
}
