import { createContext, useContext } from 'react'
import cn from './cn.js'
import en from './en.js'

/**
 * 内容层的语言切换。
 *
 * 组件一律通过 useContent() 取文案，不直接 import 某个语言文件——
 * 同一套组件因此能渲染两种语言，而两种语言的文案文件彼此独立，
 * 改英文不会碰到中文，反之亦然。
 *
 * 新增语言：写一个同结构的 xx.js，加进 LOCALES，再在 App.jsx 加一条路由。
 */
const LOCALES = { cn, en }

/** 语言 → URL 前缀。中文是默认语言，占根路径。 */
export const PREFIX = { cn: '', en: '/en' }

const ContentContext = createContext(cn)

export function ContentProvider({ locale = 'cn', children }) {
  const value = LOCALES[locale] ?? cn
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}

/** 当前语言代码 */
export function useLocale() {
  return useContext(ContentContext).locale
}

/**
 * 给站内路径加上当前语言前缀：'/about' → '/en/about'（英文）或 '/about'（中文）。
 * 纯 hash（'#services'）原样返回——它指向当前页内的锚点，不该被加前缀。
 */
export function useHref() {
  const locale = useLocale()
  const prefix = PREFIX[locale] ?? ''
  return (path = '/') => {
    if (path.startsWith('#')) return path
    return `${prefix}${path}` || '/'
  }
}
