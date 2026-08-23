import { Link } from 'react-router-dom'
import { useContent, useHref } from '../content/index.jsx'

export default function Footer() {
  const { BRAND, FOOTER_COLUMNS, UI } = useContent()
  const href = useHref()
  return (
    <footer className="wrap pb-14 pt-20 md:pt-24">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
        {/* 品牌区 */}
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src="/36-tech-logo.png"
              alt=""
              width="32"
              height="32"
              className="h-8 w-8 object-contain"
            />
            <span className="font-display text-[16px] font-bold">{BRAND}</span>
          </div>

          <p className="mt-5 max-w-[300px] text-[14px] leading-[1.75] text-ink/55">
            {UI.footer.blurb}
          </p>

          <dl className="mt-7 space-y-2 font-mono text-[12px] text-ink/45">
            {UI.footer.meta.map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-8 shrink-0 text-ink/30">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 链接区 */}
        <div className="grid gap-10 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow mb-4 text-ink/40">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => {
                  const label = typeof l === 'string' ? l : l.label
                  const cls = 'text-[14px] text-ink/65 transition-colors hover:text-fox'
                  return (
                    <li key={label}>
                      {typeof l === 'string' ? (
                        <a href="#top" className={cls}>
                          {label}
                        </a>
                      ) : (
                        <Link to={href(l.to)} className={cls}>
                          {label}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-ink/10 pt-7 text-[12.5px] text-ink/40 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">© 2018 – 2026 {BRAND}</p>
        <div className="flex gap-6">
          <a href="#top" className="transition-colors hover:text-fox">
            {UI.footer.privacy}
          </a>
          <a href="#top" className="transition-colors hover:text-fox">
            {UI.footer.terms}
          </a>
        </div>
      </div>
    </footer>
  )
}
