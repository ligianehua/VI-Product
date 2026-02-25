// ============================================================
// Manual Fetch API - 手动触发抓取（开发/调试用）
// GET /api/fetch → 只抓取 RSS 不评分，查看原始结果
// ============================================================

import { NextResponse } from 'next/server'
import { fetchAllFeeds } from '@/lib/fetcher'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const articles = await fetchAllFeeds()

    return NextResponse.json({
      count: articles.length,
      articles: articles.slice(0, 30).map(a => ({
        title: a.title,
        source: a.source,
        language: a.language,
        link: a.link,
        summary: a.summary.slice(0, 200),
        pubDate: a.pubDate,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Fetch failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
