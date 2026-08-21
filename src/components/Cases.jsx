import { Reveal, SectionHead, Placeholder } from './ui.jsx'
import Band from './Band.jsx'

/**
 * 首页 S8 · 案例
 * 文案总纲：没有真实案例前本模块不上线，严禁虚构客户与数字。
 * 原型保留版位，卡片结构 = 行业标签 + 一句话问题 + 一句话做法 + 一个可验证结果。
 */
export default function Cases() {
  return (
    <Band tone="white">
      <div>
        <Reveal>
          <SectionHead num="06" title="做过的事" zh="真实案例填充后上线；在此之前本模块不对外展示。" />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((n, i) => (
            <Reveal key={n} delay={i * 80}>
              <article className="flex h-full flex-col rounded-3xl border border-dashed border-ink/15 bg-cloud p-7">
                <span className="font-mono text-[10px] tracking-[0.16em] text-amber uppercase">
                  待填 · 案例 {n}
                </span>

                <Placeholder label="16:9 image" ratio="16/9" className="mt-5 w-full" />

                <div className="mt-6 space-y-3">
                  <Placeholder label="行业 / 市场" className="h-7 w-2/3" />
                  <Placeholder label="一句话问题" className="h-7 w-full" />
                  <Placeholder label="一句话做法" className="h-7 w-5/6" />
                </div>

                <div className="mt-6 border-t border-ink/10 pt-5">
                  <Placeholder label="可核查的结果数字" className="h-12 w-full" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <p className="mx-auto mt-10 max-w-[560px] text-center text-[13.5px] leading-relaxed text-ink/45">
            客户不便具名时可匿名化处理（如「一家做户外装备的品牌，主攻北美市场」），
            前提是内容真实。出海客户会核实。
          </p>
        </Reveal>
      </div>
    </Band>
  )
}
