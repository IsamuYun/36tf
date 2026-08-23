import { useState } from 'react'
import { Reveal, Button, Arrow } from './ui.jsx'
import Band from './Band.jsx'
import { useContent } from '../content/index.jsx'

const PANEL_ID = 'trust-detail'

/**
 * 首页 S2 · 信任背书条
 * 每个客户上图标、下品牌名；点一下在下方展开该客户的站点信息。
 *
 * 用 flush Band：网格贴满整个框宽，格子是正方形，
 * 左右两端刚好落在框架竖线上。标题自带内边距，不走 Band 的统一 padding。
 *
 * 一律 6 列一行（手机端也是），列数必须能整除 CLIENTS 的个数，
 * 否则末行会漏出容器底色——格子之间的分隔线是靠 gap-px 露出容器背景做的，
 * 空位也会一起露出来。现在是 6 个客户；增减客户时同步改这里的列数。
 *
 * 窄屏一格只有约 60px：格子改成高度自适应（不再锁正方形），
 * 名字缩到 9px 并允许换行，否则「Raiden Antiques」这类长名会撑破格子。
 */
export default function TrustBar() {
  const { CLIENTS, UI } = useContent()

  // open = 当前展开的下标，-1 为全部收起
  const [open, setOpen] = useState(-1)
  // 收起动画进行中面板仍要有内容可渲染，否则会先闪一下空白再收拢
  const [shown, setShown] = useState(0)

  const toggle = (i) => {
    if (i === open) {
      setOpen(-1)
      return
    }
    setShown(i)
    setOpen(i)
  }

  const client = CLIENTS[shown]

  return (
    <Band flush>
      <Reveal>
        <p className="px-6 pb-2 pt-2 font-display text-[24px] font-semibold text-ink/70 md:px-10">
          {UI.trust.before} <span className="text-fox">{CLIENTS.length}</span> {UI.trust.after}
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid grid-cols-6 gap-px border-t border-ink/[0.1] bg-ink/[0.1]">
          {CLIENTS.map((c, i) => {
            const on = i === open
            return (
              <button
                key={c.name}
                type="button"
                aria-expanded={on}
                aria-controls={PANEL_ID}
                aria-label={UI.trust.toggle(c.name)}
                onClick={() => toggle(i)}
                className={`group relative flex flex-col items-center justify-center gap-1.5 px-1 py-3 transition-colors duration-300 sm:aspect-square sm:gap-2.5 sm:px-2 ${
                  on ? 'bg-white' : 'bg-cloud hover:bg-white'
                }`}
              >
                {/* 图标按格子宽度的 64% 缩放，上限锁在 128px 原生尺寸避免放大发虚 */}
                <img
                  src={c.logo}
                  alt=""
                  width="128"
                  height="128"
                  loading="lazy"
                  className="aspect-square w-[70%] max-w-32 object-contain transition-transform duration-300 ease-[var(--ease-brand)] group-hover:scale-105 sm:w-[64%]"
                />
                <span className="text-center text-[9px] font-medium leading-tight text-ink/70 sm:text-[13px] sm:leading-snug xl:text-[17px]">
                  {c.name}
                </span>

                {/* 展开态的底部标记，指向下方面板 */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-[3px] bg-fox transition-transform duration-300 ease-[var(--ease-brand)] ${
                    on ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </Reveal>

      {/* 折叠面板。0fr → 1fr 的行高过渡比 max-height 准确：
          不用猜一个够大的高度，也就不会在内容变长时被截断。 */}
      <div
        id={PANEL_ID}
        className="grid border-t border-ink/[0.1] transition-all duration-400 ease-[var(--ease-brand)]"
        style={{ gridTemplateRows: open >= 0 ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          {/* xl 下 6/1 的比例 = 整整一格的高度（框宽 ÷ 6），
              面板因此和上方一行格子等宽等高。窄屏改回内容自适应。 */}
          <div className="flex flex-col items-start gap-6 bg-white px-6 py-8 md:px-10 xl:aspect-[6/1] xl:flex-row xl:items-center xl:gap-10 xl:py-0">
            <img
              src={client.logo}
              alt=""
              width="128"
              height="128"
              loading="lazy"
              className="aspect-square w-20 shrink-0 object-contain"
            />

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-[20px] font-bold text-ink">{client.name}</h3>

              <p className="mt-1.5 break-all font-mono text-[12.5px] text-ink/45">
                {client.url ? client.url.replace(/^https?:\/\//, '') : UI.trust.noUrl}
              </p>

              <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-ink/62">
                {client.blurb}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              {/* 没有网址时按钮渲染成禁用的 span，不做成指向空地址的链接 */}
              {client.url ? (
                <Button
                  as="a"
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="solid"
                  className="group !rounded-[2px]"
                >
                  {UI.trust.visit}
                  <Arrow className="group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button as="span" variant="solid" className="pointer-events-none opacity-40 !rounded-[2px]">
                  {UI.trust.visit}
                </Button>
              )}

              <button
                type="button"
                onClick={() => setOpen(-1)}
                className="font-mono text-[12px] text-ink/45 underline underline-offset-4 transition-colors hover:text-fox"
              >
                {UI.trust.close}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Band>
  )
}
