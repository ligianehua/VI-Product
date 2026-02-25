// ============================================================
// AI 智能评分引擎 - 使用 Brave AI Grounding API（OpenAI SDK 兼容）
// Brave API 文档: https://api-dashboard.search.brave.com/app/documentation/ai-grounding
// ============================================================

import OpenAI from 'openai'
import { RawArticle, AIScore, CuratedArticle, Category, DailyDigest } from './types'
import { format } from 'date-fns'

/**
 * 创建 AI 客户端
 * Brave AI Grounding API 完全兼容 OpenAI SDK，
 * 只需要把 baseURL 指向 Brave 即可
 */
const client = new OpenAI({
  apiKey: process.env.BRAVE_API_KEY || '',
  baseURL: 'https://api.search.brave.com/res/v1',
})

/** 将文章列表分批（每批 5 篇，Brave 限流更严） */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

/** AI 评分提示词 */
function buildScoringPrompt(articles: RawArticle[]): string {
  const articleList = articles.map((a, i) => (
    `[${i}] 标题: ${a.title}\n来源: ${a.source} (${a.language === 'zh' ? '中文' : '英文'})\n摘要: ${a.summary.slice(0, 250)}`
  )).join('\n\n---\n\n')

  return `你是一位顶级内容策展人。请对以下 ${articles.length} 篇文章进行评估和评分。

每篇文章从4个维度评分（0-10分）：
1. 有用性 (usefulness): 读者能获得实际知识或见解吗？
2. 独特性 (uniqueness): 话题/观点是否与众不同？
3. 意义性 (meaningfulness): 对行业有重要意义吗？
4. 趣味性 (interestingness): 读起来是否引人入胜？

筛选标准：排除软文/广告，排除过于基础的内容，优先深度分析和创新案例。

请严格返回以下格式的 JSON（不要其他文字）：
{"results":[{"index":0,"usefulness":8,"uniqueness":7,"meaningfulness":9,"interestingness":8,"category":"innovation","aiSummary":"中文2-3句话摘要","reason":"中文一句话推荐理由"}]}

category 必须是: innovation(创新创业), technology(科技), new-tech(新技术), marketing(营销模式), brand-story(品牌故事), brand-marketing(品牌营销)

英文文章的 aiSummary 和 reason 也必须用中文写！

文章列表：

${articleList}`
}

/** 从 Brave AI 响应中提取 JSON */
function extractJsonFromResponse(text: string): Record<string, unknown>[] {
  // 尝试直接解析
  try {
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) return parsed
    if (parsed.results) return parsed.results
    if (parsed.articles) return parsed.articles
    return []
  } catch {
    // Brave 可能返回带有 markdown 的文本，尝试提取 JSON 部分
  }

  // 尝试从文本中提取 JSON 块
  const jsonMatch = text.match(/\[[\s\S]*?\](?=\s*$|\s*```)/m)
    || text.match(/\{[\s\S]*"results"[\s\S]*\}/)
    || text.match(/\[[\s\S]*\]/)

  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) return parsed
      return []
    } catch {
      // 继续尝试
    }
  }

  // 尝试提取 {"results": [...]}
  const resultsMatch = text.match(/"results"\s*:\s*(\[[\s\S]*?\])/m)
  if (resultsMatch) {
    try {
      return JSON.parse(resultsMatch[1])
    } catch {
      // 放弃
    }
  }

  console.warn('⚠️ Failed to extract JSON from AI response')
  return []
}

/** 对一批文章进行 AI 评分 */
async function scoreBatch(articles: RawArticle[]): Promise<(AIScore & { index: number })[]> {
  try {
    const response = await client.chat.completions.create({
      model: 'brave',  // Brave AI Grounding 使用 "brave" 模型
      messages: [
        {
          role: 'user',
          content: buildScoringPrompt(articles)
        }
      ],
      stream: false,
    })

    const text = response.choices[0]?.message?.content || '{"results":[]}'
    console.log(`🔍 Brave AI response length: ${text.length} chars`)

    const results = extractJsonFromResponse(text)

    if (results.length === 0) {
      console.warn('⚠️ No valid results extracted from AI response')
      console.warn('📝 Raw response preview:', text.slice(0, 300))
    }

    return results.map((r: Record<string, unknown>) => ({
      index: (r.index as number) ?? 0,
      usefulness: (r.usefulness as number) || 5,
      uniqueness: (r.uniqueness as number) || 5,
      meaningfulness: (r.meaningfulness as number) || 5,
      interestingness: (r.interestingness as number) || 5,
      totalScore: (((r.usefulness as number) || 5) + ((r.uniqueness as number) || 5) + ((r.meaningfulness as number) || 5) + ((r.interestingness as number) || 5)) * 2.5,
      category: (r.category as Category) || 'technology',
      aiSummary: (r.aiSummary as string) || '',
      reason: (r.reason as string) || '',
    }))
  } catch (error) {
    console.error('❌ Brave AI scoring failed:', error instanceof Error ? error.message : error)
    return []
  }
}

/** 生成唯一 ID */
function generateId(link: string, date: string): string {
  const hash = link.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  return `${date}-${Math.abs(hash).toString(36)}`
}

/** 完整的评分 + 筛选流程 */
export async function scoreAndFilter(
  rawArticles: RawArticle[],
  topN: number = 5
): Promise<DailyDigest> {
  const today = format(new Date(), 'yyyy-MM-dd')
  console.log(`🤖 Starting Brave AI scoring for ${rawArticles.length} articles...`)

  // 如果文章太多，先做粗筛（取最新的25篇，省 API 用量）
  const candidates = rawArticles.slice(0, 25)

  // 分批评分（每批 5 篇，Brave API 限流 2 QPS）
  const batches = chunkArray(candidates, 5)
  const allScores: (AIScore & { index: number })[] = []

  for (let i = 0; i < batches.length; i++) {
    console.log(`📝 Scoring batch ${i + 1}/${batches.length}...`)
    const scores = await scoreBatch(batches[i])

    // 修正 index（因为分批后 index 需要偏移）
    const offset = i * 5
    scores.forEach(s => s.index += offset)

    allScores.push(...scores)

    // Brave 限流 2 QPS，添加 1 秒延迟
    if (i < batches.length - 1) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  // 合并评分到文章
  const scoredArticles: CuratedArticle[] = []
  for (const score of allScores) {
    const article = candidates[score.index]
    if (!article) continue

    scoredArticles.push({
      id: generateId(article.link, today),
      title: article.title,
      link: article.link,
      originalSummary: article.summary,
      aiSummary: score.aiSummary || article.summary.slice(0, 200),
      reason: score.reason || '',
      source: article.source,
      language: article.language,
      category: score.category,
      scores: {
        usefulness: score.usefulness,
        uniqueness: score.uniqueness,
        meaningfulness: score.meaningfulness,
        interestingness: score.interestingness,
        total: score.totalScore,
      },
      pubDate: article.pubDate,
      curatedAt: new Date().toISOString(),
    })
  }

  // 按总分排序，取 top N
  scoredArticles.sort((a, b) => b.scores.total - a.scores.total)

  // 确保分类多样性：尽量不同分类各选 1 篇，再按总分补齐
  const selected: CuratedArticle[] = []
  const categoryCount: Record<string, number> = {}
  const categories = ['innovation', 'technology', 'new-tech', 'marketing', 'brand-story', 'brand-marketing']

  // 第一轮：每个分类先选最佳的 1 篇（最多选 topN-1 个分类）
  for (const cat of categories) {
    if (selected.length >= topN - 1) break
    const catArticles = scoredArticles.filter(a => a.category === cat && !selected.includes(a))
    if (catArticles.length > 0) {
      selected.push(catArticles[0])
      categoryCount[cat] = 1
    }
  }

  // 第二轮：按总分填满剩余名额
  const remaining = scoredArticles.filter(a => !selected.includes(a))
  const needed = topN - selected.length
  selected.push(...remaining.slice(0, Math.max(0, needed)))

  // 最终按总分排序
  selected.sort((a, b) => b.scores.total - a.scores.total)
  const final = selected.slice(0, topN)

  console.log(`✅ Selected ${final.length} articles from ${rawArticles.length} candidates`)
  console.log(`📊 Category distribution:`, Object.entries(categoryCount).map(([k, v]) => `${k}: ${v}`).join(', '))

  return {
    date: today,
    articles: final,
    totalSourced: rawArticles.length,
    generatedAt: new Date().toISOString(),
  }
}
