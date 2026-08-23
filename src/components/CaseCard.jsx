/**
 * 案例卡：960×400 直角卡片。
 * 静止为白底、图标隐藏、主图退在后面；鼠标进入后渐变自下而上揭开，
 * 四个图标由外向内飞入，主图上浮并前推。动效定义在 index.css 的 .case-* 里。
 *
 * icons 的尺寸只定宽、高自适应 + object-contain：
 * 各素材原始比例不一（横版 logo、方版、竖版期刊封面），
 * 统一套固定宽高会变形或裁切。
 */
export default function CaseCard({ data }) {
  const { title, subtitle, tags, mainShot, gradient, icons } = data

  /* 卡片带 1px 直角边框。渐变层用 inset-0 贴的是 padding box（边框以内），
     所以悬停揭开渐变时边框不会被盖掉。 */
  return (
    <article className="case-card relative mx-auto h-[400px] w-full max-w-[960px] overflow-hidden border border-ink/12 bg-white">
      {/* 渐变层：静止时被 clip-path 完全裁掉，悬停时自下而上揭开 */}
      <div className="case-bg absolute inset-0" style={{ background: gradient }} />

      {/* 文案区：悬停时整体上移，给主图让位 */}
      <div className="case-copy relative z-20 px-6 pt-9 text-center md:px-12 md:pt-11">
        <h3 className="font-display text-[24px] font-extrabold leading-snug tracking-tight text-ink md:text-[30px]">
          {title}
        </h3>
        <p className="mt-2.5 text-[14px] text-ink/60 md:text-[15.5px]">{subtitle}</p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="border border-ink/12 bg-white/70 px-3.5 py-1.5 text-[12px] font-medium text-ink/70 backdrop-blur-sm md:text-[12.5px]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 散落图标。drop-shadow 而非 box-shadow：部分素材带透明区，
          box-shadow 会沿方框画影子，drop-shadow 才贴合图形轮廓。 */}
      {icons.map((ic) => (
        <img
          key={ic.alt}
          src={ic.src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`case-icon absolute z-30 h-auto object-contain [filter:drop-shadow(0_14px_22px_rgba(13,27,46,0.28))] ${ic.pos} ${ic.width} ${
            ic.hideOnSm ? 'hidden sm:block' : ''
          }`}
          style={{
            '--fly-x': ic.flyX,
            '--fly-y': ic.flyY,
            '--rot-from': ic.rotFrom,
            '--rot-to': ic.rotTo,
            transitionDelay: `${ic.delay}ms`,
          }}
        />
      ))}

      {/* 主图：容器向下超出卡片底边 64px。刻意不加 overflow-hidden——
          放大到 1.06 时整幅才不会被左右切掉，底部由卡片自身的裁切收口。 */}
      <div className="absolute inset-x-0 -bottom-16 z-10 mx-auto h-[260px] w-full max-w-[660px]">
        <img
          src={mainShot}
          alt={`${title} 项目界面`}
          loading="lazy"
          className="case-shot h-full w-full object-cover object-top"
        />
      </div>
    </article>
  )
}
