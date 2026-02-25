// ============================================================
// Cron Job API - 每天自动触发内容抓取 + AI 评分
// Vercel Cron: 每天早上 8:00 (UTC+8) 执行
// ============================================================

import { NextResponse } from 'next/server'
import { fetchAllFeeds } from '@/lib/fetcher'
import { scoreAndFilter } from '@/lib/scorer'
import { saveDailyDigest, loadLatestDigest } from '@/lib/storage'
import { format } from 'date-fns'

export const maxDuration = 60 // Vercel Pro: max 60s, Free: 10s
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // 验证 Cron 密钥（防止未授权调用）
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = format(new Date(), 'yyyy-MM-dd')

  try {
    // 检查今天是否已经生成过
    const existing = await loadLatestDigest()
    if (existing && existing.date === today) {
      return NextResponse.json({
        message: 'Already generated for today',
        date: today,
        articleCount: existing.articles.length,
      })
    }

    // Step 1: 抓取 RSS
    console.log('🚀 Step 1: Fetching RSS feeds...')
    const rawArticles = await fetchAllFeeds()

    if (rawArticles.length === 0) {
      return NextResponse.json({
        error: 'No articles fetched',
        message: 'All RSS feeds failed',
      }, { status: 500 })
    }

    // Step 2: AI 评分和筛选
    console.log('🚀 Step 2: AI scoring and filtering...')
    const digest = await scoreAndFilter(rawArticles, 5)

    // Step 3: 保存结果
    console.log('🚀 Step 3: Saving results...')
    await saveDailyDigest(digest)

    return NextResponse.json({
      message: 'Daily digest generated successfully',
      date: digest.date,
      articleCount: digest.articles.length,
      totalSourced: digest.totalSourced,
      generatedAt: digest.generatedAt,
    })
  } catch (error) {
    console.error('Cron job failed:', error)
    return NextResponse.json({
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
