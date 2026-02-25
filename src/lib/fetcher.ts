// ============================================================
// RSS 抓取引擎 - 从多个源并行获取内容
// ============================================================

import Parser from 'rss-parser'
import { FEED_SOURCES } from './sources'
import { RawArticle, FeedSource } from './types'

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'DailyDigestBot/1.0 (RSS Reader)',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
  customFields: {
    item: [['content:encoded', 'contentEncoded']],
  },
})

/** 清理 HTML 标签，保留纯文本 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** 截断文本到指定长度 */
function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '...'
}

/** 从单个 RSS 源获取文章 */
async function fetchSingleFeed(source: FeedSource): Promise<RawArticle[]> {
  try {
    const feed = await parser.parseURL(source.url)
    const articles: RawArticle[] = []

    const items = feed.items.slice(0, 15) // 每个源最多取 15 篇

    for (const item of items) {
      if (!item.title || !item.link) continue

      // 获取摘要：优先 content:encoded > content > contentSnippet
      const rawContent = (item as unknown as Record<string, string>).contentEncoded || item.content || item.contentSnippet || ''
      const summary = truncate(stripHtml(rawContent), 500)

      articles.push({
        title: stripHtml(item.title),
        link: item.link,
        summary: summary || item.title,
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        source: source.name,
        language: source.language,
        sourceCategories: source.categories,
      })
    }

    console.log(`✅ ${source.name}: ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error(`❌ ${source.name} failed:`, error instanceof Error ? error.message : error)
    return []
  }
}

/** 并行抓取所有 RSS 源 */
export async function fetchAllFeeds(): Promise<RawArticle[]> {
  console.log(`🔄 Starting fetch from ${FEED_SOURCES.length} sources...`)

  const results = await Promise.allSettled(
    FEED_SOURCES.map(source => fetchSingleFeed(source))
  )

  const allArticles: RawArticle[] = []
  let successCount = 0

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value)
      if (result.value.length > 0) successCount++
    }
  }

  // 去重（根据链接）
  const seen = new Set<string>()
  const unique = allArticles.filter(a => {
    const key = a.link.replace(/\/$/, '').toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // 按发布时间排序（最新的在前）
  unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  console.log(`📊 Fetched ${unique.length} unique articles from ${successCount}/${FEED_SOURCES.length} sources`)
  return unique
}
