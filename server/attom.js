import { config } from './config.js'
import { saveResult } from './db.js'

/**
 * CRESpan 的数据层：邮编 → 坐标 → ATTOM 半径检索 → 归一化的房产列表。
 *
 * 两个实测结论决定了这里的写法：
 * 1. ATTOM 的 propertytype 只认它自己那套枚举值，传了不认识的值不会报参数错，
 *    而是让后端查询挂住、网关回 504。所以业态只能从下面这张白名单里挑。
 * 2. 即使是合法值，网关也会间歇性 504。所以每次调用都带重试。
 */

/** 业态 → ATTOM propertytype 枚举值。均为实测可用的值。 */
export const CATEGORIES = {
  warehouse: {
    label: { zh: '仓库', en: 'Warehouse' },
    // 各县评估局的叫法不一致，两个都查再去重
    types: ['WAREHOUSE', 'WAREHOUSE, STORAGE'],
  },
  restaurant: {
    label: { zh: '餐馆', en: 'Restaurant' },
    types: ['RESTAURANT', 'RESTAURANT BUILDING'],
  },
  commercial: {
    label: { zh: '商业地产', en: 'Commercial property' },
    // 商业地产是个笼统说法，分三类取并集后按距离排序
    types: ['COMMERCIAL (NEC)', 'OFFICE BUILDING', 'STORE BUILDING'],
  },
}

export const CATEGORY_KEYS = Object.keys(CATEGORIES)

const SNAPSHOT = 'property/snapshot'
const ATTEMPTS = 2
const MAX_RADIUS = 20 // ATTOM 半径检索上限
/**
 * 由小到大的试探半径。
 * ATTOM 的网关在 15 秒上限处掐断，而它的后端在密集城区（曼哈顿、洛杉矶）
 * 查 10 英里经常算不完，于是必 504。结果本身按距离升序返回，
 * 所以「1 英里内的最近 10 家」就是「10 英里内的最近 10 家」——
 * 先小半径试，凑够条数就收手；凑不够才放大。密集区一步就够，
 * 稀疏区虽要放大，但那里的查询本来就快。
 */
const RADIUS_STEPS = [1, 3, 5, 10]
const geoCache = new Map()

/** 单次 ATTOM 调用，成功返回解析后的 body；失败抛错。结果一律入库，便于回看。 */
async function callAttom(endpoint, params) {
  const url = `${config.attom.baseUrl}/${endpoint}?${new URLSearchParams(params)}`
  const started = Date.now()
  const upstream = await fetch(url, {
    headers: { apikey: config.attom.apiKey, accept: 'application/json' },
    signal: AbortSignal.timeout(config.attom.timeoutMs),
  })
  const text = await upstream.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = { raw: text.slice(0, 2000) }
  }

  try {
    saveResult({ endpoint, params, httpStatus: upstream.status, body, durationMs: Date.now() - started })
  } catch (err) {
    // 落库失败不该影响查询本身
    console.error('[crespan] 写入数据库失败:', err.message)
  }

  // ATTOM 出错时会换一种报文结构：{ Response: { status: { code: "504", ... } } }
  const code = body?.status?.code
  if (body?.Response || code === undefined) {
    const msg = body?.Response?.status?.msg || `上游返回异常（HTTP ${upstream.status}）`
    const err = new Error(msg)
    err.retryable = true
    throw err
  }
  if (Number(code) !== 0 && body?.status?.msg !== 'SuccessWithoutResult') {
    const err = new Error(body?.status?.msg || `ATTOM 返回 code ${code}`)
    // 「查无结果」不重试，其余当作可重试
    err.retryable = true
    throw err
  }
  return body
}

export async function callWithRetry(endpoint, params) {
  let last
  for (let i = 0; i < ATTEMPTS; i++) {
    try {
      return await callAttom(endpoint, params)
    } catch (err) {
      last = err
      if (!err.retryable && err.name !== 'TimeoutError') throw err
      if (i < ATTEMPTS - 1) await new Promise((r) => setTimeout(r, 400 * (i + 1)))
    }
  }
  throw last
}

/**
 * 邮编 → 坐标。先用 Zippopotam（免费、无需密钥、取的是邮编质心），
 * 不可用时退回 ATTOM：按邮编取一条房产，用它的坐标近似质心。
 */
export async function geocodeZip(zip) {
  const code = String(zip).trim()
  if (!/^\d{5}$/.test(code)) throw new Error('邮编需为 5 位数字')
  if (geoCache.has(code)) return geoCache.get(code)

  let place = null
  try {
    const resp = await fetch(`https://api.zippopotam.us/us/${code}`, {
      signal: AbortSignal.timeout(8000),
    })
    if (resp.ok) {
      const body = await resp.json()
      const first = body?.places?.[0]
      if (first) {
        place = {
          zip: code,
          lat: Number(first.latitude),
          lon: Number(first.longitude),
          city: first['place name'] ?? null,
          state: first['state abbreviation'] ?? null,
        }
      }
    }
  } catch {
    // 落到下面的 ATTOM 兜底
  }

  if (!place) {
    const body = await callWithRetry(SNAPSHOT, { postalcode: code, page: '1', pagesize: '1' })
    const p = body?.property?.[0]
    const lat = Number(p?.location?.latitude)
    const lon = Number(p?.location?.longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      throw new Error(`找不到邮编 ${code} 的位置`)
    }
    place = { zip: code, lat, lon, city: p?.address?.locality ?? null, state: p?.address?.countrySubd ?? null }
  }

  if (!Number.isFinite(place.lat) || !Number.isFinite(place.lon)) {
    throw new Error(`找不到邮编 ${code} 的位置`)
  }
  geoCache.set(code, place)
  return place
}

/** 两点球面距离（英里）。ATTOM 一般会带 distance，缺失时兜底算一个。 */
function haversineMiles(aLat, aLon, bLat, bLon) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(bLat - aLat)
  const dLon = toRad(bLon - aLon)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2
  return 2 * 3958.8 * Math.asin(Math.min(1, Math.sqrt(h)))
}

/**
 * ATTOM 的一条 property 压成前端要用的扁平结构。
 * recompute：环形兜底检索里 ATTOM 给的 distance 是相对卫星圆心的，得按邮编重算。
 */
function normalize(p, origin, recompute = false) {
  const lat = Number(p?.location?.latitude)
  const lon = Number(p?.location?.longitude)
  const distance = recompute ? NaN : Number(p?.location?.distance)
  const addr = p?.address ?? {}
  // 地址缺失的记录 ATTOM 会填 "0000"，当作没有
  const line1 = addr.line1 && !/^0+$/.test(addr.line1.trim()) ? addr.line1 : null

  return {
    attomId: p?.identifier?.attomId ?? p?.identifier?.Id ?? null,
    apn: p?.identifier?.apn ?? null,
    address: line1,
    cityState: addr.line2 ?? null,
    oneLine: line1 ? addr.oneLine : null,
    zip: addr.postal1 ?? null,
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    distance: Number.isFinite(distance)
      ? distance
      : Number.isFinite(lat) && Number.isFinite(lon)
        ? Number(haversineMiles(origin.lat, origin.lon, lat, lon).toFixed(2))
        : null,
    // proptype 偶尔是 UNKNOWN，依次退到 propertyType、土地用途，都没有才留空
    propType:
      [p?.summary?.proptype, p?.summary?.propertyType, p?.summary?.propLandUse].find(
        (v) => v && v !== 'UNKNOWN',
      ) ?? null,
    propClass: p?.summary?.propclass ?? null,
    landUse: p?.summary?.propLandUse ?? null,
    yearBuilt: p?.summary?.yearbuilt || null,
    buildingSize: p?.building?.size?.universalsize || null,
    lotAcres: p?.lot?.lotSize1 || null,
  }
}

/**
 * 环形兜底：当整圈检索被 ATTOM 网关掐断时，把这个圆拆成 6 个小圆分别查。
 *
 * 触发场景很具体：邮编近处稀疏、外圈却压着一片密集城区（比如 Irvine 查餐馆，
 * 8 英里内空空如也，10 英里一下扫进圣安娜，后端就算不完了）。
 * 六个圆心摆在 0.7R 处、每个半径 0.42R，既能覆到 R，也和内圈、邻圆有重叠；
 * 每个小圆的数据量只有整圈的一小块，后端跑得动。
 */
async function ringSearch(types, origin, R, want) {
  const d = R * 0.7
  const rho = R * 0.42
  const centers = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3
    const dy = d * Math.cos(a)
    const dx = d * Math.sin(a)
    return {
      lat: origin.lat + dy / 69,
      lon: origin.lon + dx / (69 * Math.cos((origin.lat * Math.PI) / 180)),
    }
  })

  const jobs = types.flatMap((t) =>
    centers.map((c) =>
      callWithRetry(SNAPSHOT, {
        latitude: String(c.lat.toFixed(6)),
        longitude: String(c.lon.toFixed(6)),
        radius: String(rho.toFixed(2)),
        propertytype: t,
        page: '1',
        pagesize: String(Math.min(want * 2, 100)),
      }),
    ),
  )

  const settled = await Promise.allSettled(jobs)
  const seen = new Set()
  const items = []
  for (const res of settled) {
    if (res.status === 'rejected') continue
    for (const p of res.value?.property ?? []) {
      const row = normalize(p, origin, true)
      if (row.attomId == null || seen.has(row.attomId)) continue
      // 小圆会探出 R 之外，按邮编重算的距离把多出来的切掉
      if (row.distance == null || row.distance > R) continue
      seen.add(row.attomId)
      items.push(row)
    }
  }
  return items
}

/**
 * 邮编周边指定业态的房产检索。
 * @param {{ zip: string, category: keyof CATEGORIES, radius?: number, limit?: number }} q
 * @returns {Promise<{ origin: object, category: string, radius: number, items: object[], total: number, partial: string[] }>}
 */
export async function searchNearZip({ zip, category, radius = 10, limit = 10 }) {
  const cat = CATEGORIES[category]
  if (!cat) throw new Error(`不支持的业态：${category}`)

  const miles = Math.min(Math.max(Number(radius) || 10, 0.5), MAX_RADIUS)
  const want = Math.min(Math.max(Number(limit) || 10, 1), 50)
  const origin = await geocodeZip(zip)

  const params = (propertytype, r) => ({
    latitude: String(origin.lat),
    longitude: String(origin.lon),
    radius: String(r),
    propertytype,
    page: '1',
    // 多取一些：一来多业态合并时不让某一类占满名额，
    // 二来 ATTOM 有一批记录地址是空的（line1 填成 "0000"），留出替换的余量
    pagesize: String(Math.min(want * 2, 100)),
  })

  // 由小到大试半径。大半径的结果是小半径的超集，所以每一圈各自成立，
  // 取最好的那一圈即可，不必跨圈合并。
  const steps = [...new Set([...RADIUS_STEPS.filter((r) => r < miles), miles])]
  const byDistance = (a, b) => (a.distance ?? 999) - (b.distance ?? 999)

  let best = null
  let lastErr = null
  let timedOut = false
  let scanned = 0 // 完整跑完的最大半径，一条都没查到时用它说明扫了多大范围

  for (const r of steps) {
    const settled = await Promise.allSettled(
      cat.types.map((t) => callWithRetry(SNAPSHOT, params(t, r))),
    )

    const failed = []
    const seen = new Set()
    const items = []
    let total = 0

    for (const [i, res] of settled.entries()) {
      if (res.status === 'rejected') {
        failed.push(cat.types[i])
        lastErr = res.reason
        continue
      }
      total += Number(res.value?.status?.total) || 0
      for (const p of res.value?.property ?? []) {
        const row = normalize(p, origin)
        if (row.attomId == null || seen.has(row.attomId)) continue
        seen.add(row.attomId)
        items.push(row)
      }
    }

    // 有街道地址的排前面：地址缺失的记录只剩坐标，实际用不上。
    // 不够 want 条时再用它们补齐，而不是直接丢掉。
    const addressed = items.filter((p) => p.oneLine).sort(byDistance)
    const anonymous = items.filter((p) => !p.oneLine).sort(byDistance)
    const round = { items: [...addressed, ...anonymous], addressed: addressed.length, total, radius: r, failed }

    if (!best || round.addressed > best.addressed || (round.addressed === best.addressed && round.items.length > best.items.length)) {
      best = round
    }
    console.log(
      `[crespan] ${zip} ${category} r=${r} → ${round.items.length} 条（含地址 ${round.addressed}），失败 ${failed.length}`,
    )
    if (round.addressed >= want) break
    if (!failed.length) scanned = r
    // 这一圈就已经有类目超时，说明后端算不动了，再放大只会更慢
    if (failed.length) {
      timedOut = true
      break
    }
  }

  let items = best?.items ?? []
  let total = best?.total ?? 0
  let searchedRadius = items.length ? best.radius : Math.max(scanned, best?.radius ?? 0) || miles
  let partial = best?.failed ?? []

  // 整圈被网关掐断、手上又没凑够，就把这个圆拆成 6 个小圆再试一次
  if (timedOut && (best?.addressed ?? 0) < want) {
    try {
      const ring = await ringSearch(cat.types, origin, miles, want)
      if (ring.length) {
        const seen = new Set(items.map((p) => p.attomId))
        items = [...items, ...ring.filter((p) => !seen.has(p.attomId))]
        searchedRadius = miles
        partial = []
        // 分圆查询有重叠，总数没法相加，交给上层显示成「未知」
        total = null
      }
    } catch (err) {
      console.error('[crespan] 分圆兜底失败:', err.message)
    }
  }

  if (!items.length && partial.length === cat.types.length) {
    throw lastErr?.retryable
      ? new Error('ATTOM 接口暂时无法响应，请稍后重试')
      : (lastErr ?? new Error('ATTOM 未返回结果'))
  }

  const addressedAll = items.filter((p) => p.oneLine).sort(byDistance)
  const anonymousAll = items.filter((p) => !p.oneLine).sort(byDistance)
  const picked = [...addressedAll, ...anonymousAll].slice(0, want).sort(byDistance)

  return {
    origin,
    category,
    categoryLabel: cat.label,
    radius: miles,
    // 实际扫到的半径：凑够条数就提前收手，可能小于请求半径
    searchedRadius,
    total,
    items: picked,
    partial,
  }
}
