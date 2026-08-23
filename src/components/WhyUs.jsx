import { Reveal, SectionHead } from './ui.jsx'
import { useContent } from '../content/index.jsx'
import Band from './Band.jsx'

export default function WhyUs() {
  const { WHY_US, UI } = useContent()
  return (
    <Band tone="white">
      <div>
        <Reveal>
          <SectionHead num={UI.whyUs.num} title={UI.whyUs.title} />
        </Reveal>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {WHY_US.map((w, i) => (
            <Reveal key={w.title} delay={i * 80}>
              <div className="h-full">
                {/* 品牌板 05 节的圆点标记，三个色阶依次为 主色 / 深蓝 / 琥珀 */}
                <span
                  className="mb-6 block h-3 w-3 rounded-full"
                  style={{
                    background: ['#1E7FDB', '#0B4EA2', '#FFA53D'][i],
                  }}
                />
                <h3 className="font-display text-[19px] font-bold md:text-[20px]">{w.title}</h3>
                <p className="mt-3.5 text-[15px] leading-[1.8] text-ink/62">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Band>
  )
}
