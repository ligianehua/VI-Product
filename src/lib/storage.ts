// ============================================================
// 数据存储层 - 使用文件系统存储每日精选数据
// 在 Vercel 上使用 /tmp 目录 + API 缓存
// ============================================================

import { DailyDigest } from './types'
import { promises as fs } from 'fs'
import path from 'path'

/** 获取数据目录路径 */
function getDataDir(): string {
  // 本地开发用 data/ 目录，Vercel 上用 /tmp/
  if (process.env.VERCEL) {
    return '/tmp/daily-digest'
  }
  return path.join(process.cwd(), 'data')
}

/** 确保数据目录存在 */
async function ensureDataDir(): Promise<void> {
  const dir = getDataDir()
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

/** 保存每日精选数据 */
export async function saveDailyDigest(digest: DailyDigest): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(getDataDir(), `${digest.date}.json`)
  await fs.writeFile(filePath, JSON.stringify(digest, null, 2), 'utf-8')
  console.log(`💾 Saved digest for ${digest.date} to ${filePath}`)

  // 同时保存为 latest.json 方便快速读取
  const latestPath = path.join(getDataDir(), 'latest.json')
  await fs.writeFile(latestPath, JSON.stringify(digest, null, 2), 'utf-8')
}

/** 读取指定日期的精选数据 */
export async function loadDailyDigest(date: string): Promise<DailyDigest | null> {
  try {
    const filePath = path.join(getDataDir(), `${date}.json`)
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data) as DailyDigest
  } catch {
    return null
  }
}

/** 读取最新的精选数据 */
export async function loadLatestDigest(): Promise<DailyDigest | null> {
  try {
    const latestPath = path.join(getDataDir(), 'latest.json')
    const data = await fs.readFile(latestPath, 'utf-8')
    return JSON.parse(data) as DailyDigest
  } catch {
    return null
  }
}

/** 获取所有可用的日期列表 */
export async function listAvailableDates(): Promise<string[]> {
  try {
    await ensureDataDir()
    const files = await fs.readdir(getDataDir())
    return files
      .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.json$/))
      .map(f => f.replace('.json', ''))
      .sort((a, b) => b.localeCompare(a)) // 最新的在前
  } catch {
    return []
  }
}
