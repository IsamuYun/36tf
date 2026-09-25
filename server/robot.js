import { callWithRetry } from './attom.js'

/**
 * Robot 的数据层：按地址查单套房产的档案 / 估值 / 成交记录，按邮编列房产。
 *
 * ATTOM 各端点同一个字段的大小写不统一：expandedprofile 给 saleAmt、yearBuilt，
 * avm/detail 与 saleshistory/detail 给 saleamt、yearbuilt。所以取值一律走 get()，忽略大小写。
 */

/** 按路径取值，每一段都忽略大小写。get(p, 'sale.amount.saleAmt') */
function get(obj, path) {
  let cur = obj
  for (const key of path.split('.')) {
    if (cur == null || typeof cur !== 'object') return null
    if (key in cur) {
      cur = cur[key]
      continue
    }
    const lower = key.toLowerCase()
    const hit = Object.keys(cur).find((k) => k.toLowerCase() === lower)
    cur = hit === undefined ? null : cur[hit]
  }
  return cur ?? null
}

/** 依次尝试多个路径，取第一个有意义的值（0、空串、UNKNOWN 视为没有） */
function first(obj, ...paths) {
  for (const p of paths) {
    const v = get(obj, p)
    if (v !== null && v !== '' && v !== 0 && v !== 'UNKNOWN') return v
  }
  return null
}

const toNum = (v) => (v == null || v === '' || !Number.isFinite(Number(v)) ? null : Number(v))

/** 地址、坐标、类型——所有端点都带的公共部分 */
function base(p) {
  const lat = toNum(get(p, 'location.latitude'))
  const lon = toNum(get(p, 'location.longitude'))
  const line1 = get(p, 'address.line1')
  return {
    attomId: first(p, 'identifier.attomId', 'identifier.Id'),
    apn: get(p, 'identifier.apn'),
    // 地址缺失的记录 ATTOM 会填 "0000"，当作没有
    oneLine: line1 && !/^0+$/.test(String(line1).trim()) ? get(p, 'address.oneLine') : null,
    zip: get(p, 'address.postal1'),
    lat,
    lon,
    propType: first(p, 'summary.propertyType', 'summary.propType', 'summary.propLandUse'),
    propClass: first(p, 'summary.propClass'),
    yearBuilt: toNum(first(p, 'summary.yearBuilt')),
  }
}

/** expandedprofile → 档案卡片 */
function profileOf(p) {
  const owner = get(p, 'assessment.owner') ?? get(p, 'owner') ?? {}
  const owners = ['owner1', 'owner2']
    .map((k) => get(owner, `${k}.fullName`))
    .filter(Boolean)
  return {
    ...base(p),
    subdivision: first(p, 'area.subdName'),
    county: first(p, 'area.countrySecSubd'),
    occupancy: first(p, 'summary.absenteeInd'),
    building: {
      livingSize: toNum(first(p, 'building.size.livingSize', 'building.size.universalSize')),
      beds: toNum(first(p, 'building.rooms.beds')),
      baths: toNum(first(p, 'building.rooms.bathsTotal')),
      levels: toNum(first(p, 'building.summary.levels')),
      condition: first(p, 'building.construction.condition'),
      wall: first(p, 'building.construction.wallType'),
      parking: first(p, 'building.parking.prkgType', 'building.parking.garageType'),
      cooling: first(p, 'utilities.coolingType'),
      heating: first(p, 'utilities.heatingType'),
    },
    lot: {
      acres: toNum(first(p, 'lot.lotSize1')),
      sqft: toNum(first(p, 'lot.lotSize2')),
      zoning: first(p, 'lot.zoningType', 'lot.siteZoningIdent'),
    },
    assessment: {
      marketTotal: toNum(first(p, 'assessment.market.mktTtlValue')),
      marketLand: toNum(first(p, 'assessment.market.mktLandValue')),
      assessedTotal: toNum(first(p, 'assessment.assessed.assdTtlValue')),
      tax: toNum(first(p, 'assessment.tax.taxAmt')),
      taxYear: toNum(first(p, 'assessment.tax.taxYear')),
    },
    lastSale: {
      amount: toNum(first(p, 'sale.amount.saleAmt')),
      date: first(p, 'sale.saleTransDate', 'sale.amount.saleRecDate'),
      type: first(p, 'sale.amount.saleTransType'),
      pricePerSqft: toNum(first(p, 'sale.calculation.pricePerSizeUnit')),
    },
    owner: {
      names: owners,
      type: first(owner, 'description', 'type'),
    },
  }
}

/** avm/detail → 估值 */
function valueOf(p) {
  const value = toNum(get(p, 'avm.amount.value'))
  if (value == null) return null
  return {
    value,
    low: toNum(get(p, 'avm.amount.low')),
    high: toNum(get(p, 'avm.amount.high')),
    confidence: toNum(get(p, 'avm.amount.scr')),
    perSqft: toNum(get(p, 'avm.calculations.perSizeUnit')),
    date: get(p, 'avm.eventDate'),
    monthChangePct: toNum(get(p, 'avm.AVMChange.avmpercentchange')),
  }
}

/** saleshistory/detail → 成交记录，新的在前 */
function salesOf(p) {
  const list = get(p, 'salehistory')
  if (!Array.isArray(list)) return []
  return list
    .map((s) => ({
      date: first(s, 'saleTransDate', 'amount.saleRecDate', 'saleSearchDate'),
      amount: toNum(first(s, 'amount.saleAmt')),
      type: first(s, 'amount.saleTransType'),
      pricePerSqft: toNum(first(s, 'calculation.pricePerSizeUnit')),
    }))
    .filter((s) => s.date || s.amount)
    .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')))
}

/**
 * 按地址查一套房产。档案必查；估值、成交记录按需并行，单项失败不影响整体。
 * @param {{ address1: string, address2: string, aspects: string[] }} q
 */
export async function lookupAddress({ address1, address2, aspects }) {
  const params = { address1, address2 }
  const wantValue = aspects.includes('value')
  const wantSales = aspects.includes('sales')

  const [profileRes, avmRes, salesRes] = await Promise.allSettled([
    callWithRetry('property/expandedprofile', params),
    wantValue ? callWithRetry('avm/detail', params) : Promise.resolve(null),
    wantSales ? callWithRetry('saleshistory/detail', params) : Promise.resolve(null),
  ])

  if (profileRes.status === 'rejected') throw profileRes.reason
  const raw = profileRes.value?.property?.[0]
  if (!raw) {
    const err = new Error(`ATTOM 里找不到「${address1}, ${address2}」，请核对门牌号和城市/邮编`)
    err.notFound = true
    throw err
  }

  const missing = []
  const pickFrom = (res, fn, label) => {
    if (res.status === 'rejected') {
      missing.push(label)
      return null
    }
    const p = res.value?.property?.[0]
    return p ? fn(p) : null
  }

  return {
    kind: 'lookup',
    query: { address1, address2 },
    profile: profileOf(raw),
    value: wantValue ? pickFrom(avmRes, valueOf, 'value') : null,
    sales: wantSales ? (pickFrom(salesRes, salesOf, 'sales') ?? []) : null,
    missing,
  }
}

/** 按邮编列房产（snapshot），给列表卡片用 */
export async function listByZip({ zip, limit }) {
  const body = await callWithRetry('property/snapshot', {
    postalcode: zip,
    page: '1',
    // 多取一些，把没有街道地址的记录挤到后面
    pagesize: String(Math.min(limit * 2, 100)),
  })
  const items = (body?.property ?? [])
    .map((p) => ({
      ...base(p),
      buildingSize: toNum(first(p, 'building.size.universalSize')),
      lotAcres: toNum(first(p, 'lot.lotSize1')),
    }))
    .sort((a, b) => Number(!a.oneLine) - Number(!b.oneLine))
    .slice(0, limit)

  return {
    kind: 'list',
    zip,
    total: toNum(body?.status?.total),
    items,
  }
}
