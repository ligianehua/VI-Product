// ============================================================
// Articles API - 获取每日精选文章
// GET /api/articles          → 最新一天
// GET /api/articles?date=xxx → 指定日期
// ============================================================

import { NextResponse } from 'next/server'
import { loadDailyDigest, loadLatestDigest, listAvailableDates } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  try {
    let digest

    if (date) {
      digest = await loadDailyDigest(date)
      if (!digest) {
        return NextResponse.json(
          { error: `No digest found for date: ${date}` },
          { status: 404 }
        )
      }
    } else {
      digest = await loadLatestDigest()
      if (!digest) {
        return NextResponse.json(
          { error: 'No digest available yet. Trigger /api/cron first.' },
          { status: 404 }
        )
      }
    }

    // 获取可用日期列表
    const availableDates = await listAvailableDates()

    return NextResponse.json({
      ...digest,
      availableDates,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to load articles' },
      { status: 500 }
    )
  }
}
