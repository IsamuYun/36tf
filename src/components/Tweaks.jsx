import { useState } from 'react'
import { HERO_VARIANTS } from '../content.js'

/**
 * 设计参数面板。收起时完全隐藏，演示时页面看起来就是成品。
 * 「隐藏待填模块」可一键预览删掉占位模块后的真实上线形态。
 */
export default function Tweaks({ state, setState }) {
  const [open, setOpen] = useState(false)

  const Row = ({ label, children }) => (
    <div className="mb-4 last:mb-0">
      <span className="mb-2 block font-mono text-[10px] tracking-[0.14em] text-ink/40 uppercase">
        {label}
      </span>
      {children}
    </div>
  )

  const Toggle = ({ on, onClick, children }) => (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-[12.5px] transition-colors ${
        on ? 'border-fox bg-fox/8 text-fox' : 'border-ink/12 text-ink/55 hover:border-ink/25'
      }`}
    >
      {children}
      <span
        className={`ml-3 h-4 w-7 shrink-0 rounded-full p-[2px] transition-colors ${
          on ? 'bg-fox' : 'bg-ink/18'
        }`}
      >
        <span
          className={`block h-3 w-3 rounded-full bg-white transition-transform ${
            on ? 'translate-x-3' : ''
          }`}
        />
      </span>
    </button>
  )

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white shadow-[0_12px_32px_-8px_rgba(13,27,46,0.55)] transition-transform hover:scale-105"
        aria-label="打开设计参数面板"
      >
        <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
          <path
            d="M2 4.5h12M2 11.5h12"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="6" cy="4.5" r="2" fill="#0D1B2E" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10.5" cy="11.5" r="2" fill="#0D1B2E" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] w-[268px] rounded-2xl border border-ink/10 bg-white p-4 shadow-[0_28px_70px_-20px_rgba(13,27,46,0.35)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-[13px] font-bold">Tweaks</span>
        <button
          onClick={() => setOpen(false)}
          className="text-ink/35 transition-colors hover:text-ink"
          aria-label="关闭面板"
        >
          <svg viewBox="0 0 14 14" width="13" height="13" fill="none" aria-hidden="true">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <Row label="主标题方案">
        <div className="space-y-1.5">
          {HERO_VARIANTS.map((v) => (
            <button
              key={v.id}
              onClick={() => setState((s) => ({ ...s, hero: v.id }))}
              className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                state.hero === v.id
                  ? 'border-fox bg-fox/8'
                  : 'border-ink/12 hover:border-ink/25'
              }`}
            >
              <span
                className={`block font-mono text-[9.5px] tracking-[0.14em] uppercase ${
                  state.hero === v.id ? 'text-fox' : 'text-ink/35'
                }`}
              >
                {v.label}
              </span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-ink/70">
                {v.lines.join('')}
              </span>
            </button>
          ))}
        </div>
      </Row>

      <Row label="视觉">
        <div className="space-y-2">
          <Toggle
            on={state.rings}
            onClick={() => setState((s) => ({ ...s, rings: !s.rings }))}
          >
            圆环母题
          </Toggle>
          <Toggle
            on={state.hidePending}
            onClick={() => setState((s) => ({ ...s, hidePending: !s.hidePending }))}
          >
            隐藏待填模块
          </Toggle>
        </div>
      </Row>
    </div>
  )
}
