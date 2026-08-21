import { useEffect, useRef, useState } from 'react'

/* ---------------- 滚动入场 ---------------- */
export function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${seen ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ---------------- 装饰圆环（品牌母题） ----------------
   纯装饰，对读屏软件隐藏。size 为直径 px。 */
export function RingMotif({ size = 480, className = '', opacity = 0.9, blur = 0 }) {
  return (
    <div
      aria-hidden="true"
      className={`ring-motif pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    />
  )
}

/* ---------------- 章节标题 ---------------- */
export function SectionHead({ num, title, zh, invert = false, align = 'left' }) {
  return (
    <div className={`mb-10 md:mb-14 ${align === 'center' ? 'text-center' : ''}`}>
      <div
        className={`flex items-baseline gap-4 ${align === 'center' ? 'justify-center' : ''}`}
      >
        {num && <span className={`eyebrow ${invert ? 'text-glint' : 'text-fox'}`}>{num}</span>}
        <h2
          className={`font-display text-[26px] leading-tight font-bold md:text-[34px] ${
            invert ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h2>
      </div>
      {zh && (
        <p
          className={`mt-3 max-w-2xl text-[15px] md:text-base ${
            align === 'center' ? 'mx-auto' : ''
          } ${invert ? 'text-white/60' : 'text-ink/55'}`}
        >
          {zh}
        </p>
      )}
    </div>
  )
}

/* ---------------- 按钮 ----------------
   variant: amber(主 CTA) / solid(品牌蓝) / ghost(描边) */
export function Button({ variant = 'solid', as = 'button', className = '', children, ...rest }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display ' +
    'text-[15px] font-semibold transition-all duration-200 ease-[var(--ease-brand)] ' +
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45'

  const variants = {
    // Signal Amber 全站仅用于主 CTA，控制在 5% 以内
    amber:
      'bg-amber text-ink hover:bg-[#ffb45c] hover:shadow-[0_14px_38px_-10px_rgba(255,165,61,0.75)] hover:-translate-y-0.5',
    solid:
      'bg-fox text-white hover:bg-[#2a8ce8] hover:shadow-[0_14px_38px_-10px_rgba(30,127,219,0.8)] hover:-translate-y-0.5',
    ghost:
      'border border-current/25 text-ink hover:border-fox hover:text-fox hover:bg-fox/[0.04]',
    ghostLight:
      'border border-white/25 text-white hover:border-white/60 hover:bg-white/10',
  }

  const Tag = as
  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/* ---------------- 箭头 ---------------- */
export function Arrow({ className = '' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-200 ease-[var(--ease-brand)] ${className}`}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ---------------- 占位符 ----------------
   品牌板未提供的素材一律用它标注，不画假图、不编数据。 */
export function Placeholder({ label, className = '', ratio }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed border-ink/20 bg-ink/[0.03] ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <span className="font-mono text-[10px] tracking-[0.16em] text-ink/40 uppercase">
        {label}
      </span>
    </div>
  )
}
