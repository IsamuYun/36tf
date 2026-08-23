import { Reveal } from './ui.jsx'
import Band from './Band.jsx'
import { useContent } from '../content/index.jsx'

/**
 * 首页 S2 · 信任背书条
 * 每个客户上图标、下品牌名。
 *
 * 用 flush Band：网格贴满整个框宽（1266 = 7×180 + 6 条 1px 分隔线），
 * 格子正好 180×180 正方形，左右两端刚好落在框架竖线上。
 * 标题自带内边距，不走 Band 的统一 padding。
 */
export default function TrustBar() {
  const { CLIENTS, UI } = useContent()
  return (
    <Band flush>
      <Reveal>
        <p className="px-6 pb-6 pt-10 font-display text-[19px] font-semibold text-ink/70 md:px-10">
          {UI.trust.before} <span className="text-fox">{CLIENTS.length}</span> {UI.trust.after}
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid gap-px border-t border-ink/[0.1] bg-ink/[0.1] sm:grid-cols-4 xl:grid-cols-7">
          {CLIENTS.map((c) => (
            <div
              key={c.name}
              className="group flex aspect-square flex-col items-center justify-center gap-2.5 bg-cloud px-2 py-3 transition-colors duration-300 hover:bg-white"
            >
              {/* 图标按格子宽度的 64% 缩放，上限锁在 128px 原生尺寸避免放大发虚 */}
              <img
                src={c.logo}
                alt={`${c.name} logo`}
                width="128"
                height="128"
                loading="lazy"
                className="aspect-square w-[64%] max-w-32 object-contain transition-transform duration-300 ease-[var(--ease-brand)] group-hover:scale-105"
              />
              <span className="text-center text-[17px] font-medium leading-snug text-ink/70">
                {c.name}
              </span>
            </div>
          ))}

          {/* 补位格：7 项在 4 列下恰好缺 1 格，不补的话末行会漏出容器底色。
              7 列时正好排满，隐藏即可。 */}
          <div className="bg-cloud xl:hidden" aria-hidden="true" />
        </div>
      </Reveal>
    </Band>
  )
}
