import { Reveal } from './ui.jsx'
import Band from './Band.jsx'
import { useContent } from '../content/index.jsx'

/**
 * 技术栈条 —— 结构与 TrustBar 的格子网格一致：上图标、下名称。
 * 纯展示，不可点击，也没有展开面板。
 *
 * 用白色 Band 与上方的 TrustBar（云灰）区分开，两条不至于糊成一片。
 *
 * 一律 6 列一行（手机端也是），列数必须能整除 WORK_IN 的个数，
 * 否则末行会漏出容器底色——格子之间的分隔线是靠 gap-px 露出容器背景做的，
 * 空位也会一起露出来。
 *
 * 窄屏一格只有约 60px：格子改成高度自适应（不再锁正方形），
 * 名字缩到 9px 并允许换行，否则「WooCommerce」会撑破格子。
 */
export default function WorkInBar() {
  const { WORK_IN, UI } = useContent()

  return (
    <Band flush tone="white">
      <Reveal>
        <p className="px-6 pb-2 pt-2 font-display text-[32px] font-semibold text-ink/70 md:px-10">
          {UI.workIn.title}
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid grid-cols-6 gap-px border-t border-ink/[0.1] bg-ink/[0.1]">
          {WORK_IN.map((w) => (
            <div
              key={w.name}
              className="flex flex-col items-center justify-center gap-1.5 bg-white px-1 py-3 sm:aspect-square sm:gap-2.5 sm:px-2"
            >
              {/* 图标按格子宽度的 64% 缩放，上限锁在 128px 原生尺寸避免放大发虚 */}
              <img
                src={w.logo}
                alt=""
                width="128"
                height="128"
                loading="lazy"
                className="aspect-square w-[70%] max-w-32 object-contain sm:w-[64%]"
              />
              <span className="text-center text-[9px] font-medium leading-tight text-ink/70 sm:text-[13px] sm:leading-snug xl:text-[17px]">
                {w.name}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </Band>
  )
}
