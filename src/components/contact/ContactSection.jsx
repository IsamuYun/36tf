import React, { useState } from 'react'
import { Send, LampDesk, Phone, Mail } from 'lucide-react'
import HeroSection from './HeroSection.jsx'
import Band from '../Band.jsx'

/* 内容取自 docs/design/36-tech-info/src/sections/cn/contact/ContactSection.jsx
   按要求去掉小红书与微信二维码，只保留联系信息与办公时间两张卡片。 */
const contactCards = [
  {
    Icon: Send,
    title: '联系信息',
    rows: [
      { Icon: Phone, label: '电话', value: '(626) 366-7032', href: 'tel:+16263667032' },
      { Icon: Mail, label: '邮箱', value: 'yun@36tech.info', href: 'mailto:yun@36tech.info' },
    ],
  },
  {
    Icon: LampDesk,
    title: '办公时间',
    rows: [
      { label: '周一至周五', value: '太平洋时间 9:00 – 17:00' },
      { label: '周六', value: '太平洋时间 10:00 – 14:00' },
    ],
  },
]

function ContactCards() {
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
      setMessage({ state: 'error', text: '请填写姓名、邮箱和留言。' })
      return
    }

    setIsSending(true)
    setMessage({ state: '', text: '发送中…' })

    try {
      // 走本项目自己的 Express，而非参考文件里的 Cloudflare Worker
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: messageText, company: form.company }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || `请求失败，状态码：${response.status}`)
      }

      setMessage({ state: 'success', text: `${name}，感谢留言。我们已收到你的信息。` })
      setForm(EMPTY)
    } catch (error) {
      setMessage({ state: 'error', text: error.message || '发送时出现问题，请稍后再试。' })
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
            姓名 <span className="text-amber">*</span>
          </label>
          <input
            className={field}
            id="contact-name"
            name="name"
            type="text"
            placeholder="请输入姓名"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-2 block text-[13px] font-medium text-ink/70">
            邮箱 <span className="text-amber">*</span>
          </label>
          <input
            className={field}
            id="contact-email"
            name="email"
            type="email"
            placeholder="请输入邮箱地址"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-[13px] font-medium text-ink/70">
          留言 <span className="text-amber">*</span>
        </label>
        <textarea
          className={`${field} resize-none leading-relaxed`}
          id="contact-message"
          name="message"
          rows={6}
          placeholder="请告诉我们需要什么帮助"
          value={form.message}
          onChange={handleChange}
        />
      </div>

      {/* 蜜罐字段：真实用户不可见；机器人填写后会由服务端静默丢弃。 */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">公司</label>
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
          {isSending ? '发送中…' : '发送'}
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
        信息仅用于本次沟通，不会用于其他用途，也不会提供给第三方。
      </p>
    </form>
  )
}

export default function ContactSection() {
  return (
    <div id="contact-top" aria-label="联系我们" className="border-b border-ink/[0.1]">
      {/* 通栏 canvas 海洋 Hero，高 480px。全宽元素，不套框架。 */}
      <HeroSection />

      <Band>
        <div className="max-w-[820px]">
          <h2 className="font-display text-[30px] font-extrabold tracking-tight md:text-[40px]">
            欢迎联系
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
            <span className="eyebrow text-ink/40">写点什么</span>
            <h3 className="mt-5 font-display text-[24px] font-extrabold leading-snug md:text-[28px]">
              发送消息
            </h3>
            <p className="mt-4 max-w-[360px] text-[15px] leading-[1.8] text-ink/60">
              不用准备材料。把站点地址和你最头疼的问题写下来就行，我们看完再回你。
            </p>
          </div>

          <ContactForm />
        </div>
      </Band>
    </div>
  )
}
