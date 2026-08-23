import React, { useState } from 'react'
import { Send, LampDesk, Phone, Mail } from 'lucide-react'
import HeroSection from './HeroSection.jsx'
import { useContent } from '../../content/index.jsx'
import Band from '../Band.jsx'

/* 两张卡片：联系信息与办公时间。电话、邮箱、时段来自内容层的 CONTACT_INFO。 */
function useContactCards() {
  const { CONTACT_INFO, UI } = useContent()
  const t = UI.contact
  return [
    {
      Icon: Send,
      title: t.infoTitle,
      rows: [
        {
          Icon: Phone,
          label: t.phoneLabel,
          value: CONTACT_INFO.phone,
          href: `tel:${CONTACT_INFO.phone.replace(/[^\d+]/g, '')}`,
        },
        {
          Icon: Mail,
          label: t.emailLabel,
          value: CONTACT_INFO.email,
          href: `mailto:${CONTACT_INFO.email}`,
        },
      ],
    },
    {
      Icon: LampDesk,
      title: t.hoursTitle,
      rows: CONTACT_INFO.hours,
    },
  ]
}

function ContactCards() {
  const contactCards = useContactCards()
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {contactCards.map((card) => {
        const CardIcon = card.Icon
        return (
          <article
            key={card.title}
            className="rounded-3xl border border-ink/[0.09] bg-white p-8 transition-shadow duration-300 hover:shadow-[0_28px_64px_-32px_rgba(13,27,46,0.28)] md:p-9"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fox/10 text-fox">
              <CardIcon size={20} strokeWidth={1.75} aria-hidden="true" />
            </div>

            <h4 className="mt-5 font-display text-[19px] font-bold">{card.title}</h4>

            <dl className="mt-5 space-y-4">
              {card.rows.map((row) => {
                const RowIcon = row.Icon
                return (
                  <div key={row.label}>
                    <dt className="flex items-center gap-1.5 text-[13px] text-ink/45">
                      {RowIcon && <RowIcon size={13} strokeWidth={1.75} aria-hidden="true" />}
                      {row.label}
                    </dt>
                    <dd className="mt-1 font-display text-[16px] font-semibold">
                      {row.href ? (
                        <a href={row.href} className="transition-colors hover:text-fox">
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </article>
        )
      })}
    </div>
  )
}

const EMPTY = { name: '', email: '', message: '', company: '' }

function ContactForm() {
  const { UI } = useContent()
  const t = UI.contact
  const [form, setForm] = useState(EMPTY)
  const [message, setMessage] = useState({ state: '', text: '' })
  const [isSending, setIsSending] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const name = form.name.trim()
    const email = form.email.trim()
    const messageText = form.message.trim()

    if (!name || !email || !messageText) {
      setMessage({ state: 'error', text: t.errRequired })
      return
    }

    setIsSending(true)
    setMessage({ state: '', text: t.sending })

    try {
      // 走本项目自己的 Express，而非参考文件里的 Cloudflare Worker
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: messageText, company: form.company }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t.errRequest(response.status))
      }

      setMessage({ state: 'success', text: t.success(name) })
      setForm(EMPTY)
    } catch (error) {
      setMessage({ state: 'error', text: error.message || t.errGeneric })
    } finally {
      setIsSending(false)
    }
  }

  const field =
    'w-full rounded-xl border border-ink/12 bg-cloud px-4 py-3.5 text-[15px] text-ink ' +
    'transition-colors placeholder:text-ink/35 focus:border-fox focus:outline-none'

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-[13px] font-medium text-ink/70">
            {t.nameLabel} <span className="text-amber">*</span>
          </label>
          <input
            className={field}
            id="contact-name"
            name="name"
            type="text"
            placeholder={t.namePh}
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-2 block text-[13px] font-medium text-ink/70">
            {t.emailLabel} <span className="text-amber">*</span>
          </label>
          <input
            className={field}
            id="contact-email"
            name="email"
            type="email"
            placeholder={t.emailPh}
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-[13px] font-medium text-ink/70">
          {t.messageLabel} <span className="text-amber">*</span>
        </label>
        <textarea
          className={`${field} resize-none leading-relaxed`}
          id="contact-message"
          name="message"
          rows={6}
          placeholder={t.messagePh}
          value={form.message}
          onChange={handleChange}
        />
      </div>

      {/* 蜜罐字段：真实用户不可见；机器人填写后会由服务端静默丢弃。 */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">{t.companyLabel}</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          className="group inline-flex items-center gap-2 rounded-full bg-fox px-7 py-3.5 font-display text-[15px] font-semibold text-white transition-all hover:bg-[#2a8ce8] hover:shadow-[0_14px_38px_-10px_rgba(30,127,219,0.8)] disabled:pointer-events-none disabled:opacity-45"
          type="submit"
          disabled={isSending}
        >
          {isSending ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-white/40 border-t-white" />
          ) : (
            <Send size={15} strokeWidth={2} aria-hidden="true" />
          )}
          {isSending ? t.sending : t.send}
        </button>

        {message.text && (
          <p
            aria-live="polite"
            className={`text-[13.5px] leading-relaxed ${
              message.state === 'success'
                ? 'text-fox'
                : message.state === 'error'
                  ? 'text-amber'
                  : 'text-ink/50'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      <p className="text-[12px] leading-relaxed text-ink/40">
        {t.privacy}
      </p>
    </form>
  )
}

export default function ContactSection() {
  const { UI } = useContent()
  const t = UI.contact
  return (
    <div id="contact-top" aria-label={t.aria} className="border-b border-ink/[0.1]">
      {/* 通栏 canvas 海洋 Hero，高 480px。全宽元素，不套框架。 */}
      <HeroSection />

      <Band>
        <div className="max-w-[820px]">
          <h2 className="font-display text-[30px] font-extrabold tracking-tight md:text-[40px]">
            {t.title}
          </h2>
          <div className="mt-5 h-1 w-16 rounded-full bg-fox" aria-hidden="true" />
        </div>

        <div className="mt-12 md:mt-14">
          <ContactCards />
        </div>
      </Band>

      <Band>
        <div className="grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:gap-16">
          <div>
            <span className="eyebrow text-ink/40">{t.formEyebrow}</span>
            <h3 className="mt-5 font-display text-[24px] font-extrabold leading-snug md:text-[28px]">
              {t.formTitle}
            </h3>
            <p className="mt-4 max-w-[360px] text-[15px] leading-[1.8] text-ink/60">{t.formLead}</p>
          </div>

          <ContactForm />
        </div>
      </Band>
    </div>
  )
}
