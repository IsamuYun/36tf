import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { config } from './config.js'

/**
 * ATTOM 测试页的本地存储。用 Node 内置的 node:sqlite，不引入原生依赖。
 *
 * - attom_requests：每次调用一行，原样保存请求参数与完整响应，便于回看。
 * - attom_properties：按 attomId 汇总房产，保存最近一次的地址与坐标。
 * - attom_property_data：同一套房产在不同端点返回的字段不同，按 (attomId, endpoint) 各存一份最新数据。
 */
let db = null

export function getDb() {
  if (db) return db
  const file = path.resolve(config.attom.dbPath)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  db = new DatabaseSync(file)
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS attom_requests (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint     TEXT    NOT NULL,
      params       TEXT    NOT NULL,
      http_status  INTEGER,
      status_code  INTEGER,
      status_msg   TEXT,
      total        INTEGER,
      duration_ms  INTEGER,
      response     TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS attom_properties (
      attom_id     INTEGER PRIMARY KEY,
      address      TEXT,
      postal_code  TEXT,
      latitude     REAL,
      longitude    REAL,
      last_request INTEGER REFERENCES attom_requests(id),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS attom_property_data (
      attom_id     INTEGER NOT NULL REFERENCES attom_properties(attom_id),
      endpoint     TEXT    NOT NULL,
      request_id   INTEGER NOT NULL REFERENCES attom_requests(id),
      data         TEXT    NOT NULL,
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (attom_id, endpoint)
    );
  `)
  return db
}

/**
 * 保存一次调用及其中的房产。整体放在一个事务里，失败则全部回滚。
 * @returns {{ requestId: number, saved: number }}
 */
export function saveResult({ endpoint, params, httpStatus, body, durationMs }) {
  const d = getDb()
  const status = body?.status ?? {}
  const list = Array.isArray(body?.property) ? body.property : []

  d.exec('BEGIN')
  try {
    const { lastInsertRowid } = d
      .prepare(
        `INSERT INTO attom_requests
           (endpoint, params, http_status, status_code, status_msg, total, duration_ms, response)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        endpoint,
        JSON.stringify(params),
        httpStatus,
        status.code ?? null,
        status.msg ?? null,
        status.total ?? list.length,
        durationMs,
        body == null ? null : JSON.stringify(body),
      )
    const requestId = Number(lastInsertRowid)

    const upsertProp = d.prepare(`
      INSERT INTO attom_properties (attom_id, address, postal_code, latitude, longitude, last_request)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(attom_id) DO UPDATE SET
        address      = COALESCE(excluded.address, address),
        postal_code  = COALESCE(excluded.postal_code, postal_code),
        latitude     = COALESCE(excluded.latitude, latitude),
        longitude    = COALESCE(excluded.longitude, longitude),
        last_request = excluded.last_request,
        updated_at   = datetime('now')
    `)
    const upsertData = d.prepare(`
      INSERT INTO attom_property_data (attom_id, endpoint, request_id, data)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(attom_id, endpoint) DO UPDATE SET
        request_id = excluded.request_id,
        data       = excluded.data,
        updated_at = datetime('now')
    `)

    let saved = 0
    for (const p of list) {
      const attomId = p?.identifier?.attomId ?? p?.identifier?.Id
      if (attomId == null) continue
      const lat = Number(p?.location?.latitude)
      const lng = Number(p?.location?.longitude)
      upsertProp.run(
        attomId,
        p?.address?.oneLine ?? null,
        p?.address?.postal1 ?? null,
        Number.isFinite(lat) ? lat : null,
        Number.isFinite(lng) ? lng : null,
        requestId,
      )
      upsertData.run(attomId, endpoint, requestId, JSON.stringify(p))
      saved++
    }

    d.exec('COMMIT')
    return { requestId, saved }
  } catch (err) {
    d.exec('ROLLBACK')
    throw err
  }
}

export function listRequests(limit = 50) {
  return getDb()
    .prepare(
      `SELECT id, endpoint, params, http_status, status_code, status_msg, total, duration_ms, created_at
       FROM attom_requests ORDER BY id DESC LIMIT ?`,
    )
    .all(limit)
    .map((r) => ({ ...r, params: JSON.parse(r.params) }))
}

export function getRequest(id) {
  const r = getDb().prepare('SELECT * FROM attom_requests WHERE id = ?').get(id)
  if (!r) return null
  return {
    ...r,
    params: JSON.parse(r.params),
    response: r.response == null ? null : JSON.parse(r.response),
  }
}

export function listProperties(limit = 100) {
  return getDb()
    .prepare(
      `SELECT p.*, GROUP_CONCAT(d.endpoint) AS endpoints
       FROM attom_properties p
       LEFT JOIN attom_property_data d USING (attom_id)
       GROUP BY p.attom_id
       ORDER BY p.updated_at DESC LIMIT ?`,
    )
    .all(limit)
    .map((r) => ({ ...r, endpoints: r.endpoints ? r.endpoints.split(',') : [] }))
}
