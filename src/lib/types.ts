// ============================================================
// 数据类型定义 - Daily Digest 每日精选
// ============================================================

/** 内容分类 */
export type Category =
  | 'innovation'      // 创新创意创业
  | 'technology'      // 科技
  | 'new-tech'        // 新技术
  | 'marketing'       // 营销模式
  | 'brand-story'     // 品牌故事
  | 'brand-marketing' // 品牌营销

/** 分类配置 */
export const CATEGORY_CONFIG: Record<Category, { label: string; emoji: string; color: string }> = {
  'innovation':      { label: '创新创业', emoji: '💡', color: '#F59E0B' },
  'technology':      { label: '科技',     emoji: '🔬', color: '#3B82F6' },
  'new-tech':        { label: '新技术',   emoji: '🚀', color: '#8B5CF6' },
  'marketing':       { label: '营销模式', emoji: '📈', color: '#10B981' },
  'brand-story':     { label: '品牌故事', emoji: '📖', color: '#EC4899' },
  'brand-marketing': { label: '品牌营销', emoji: '🎯', color: '#F97316' },
}

/** RSS 源配置 */
export interface FeedSource {
  name: string
  url: string
  language: 'zh' | 'en'
  categories: Category[]
  /** 该源的权重（影响最终评分）1-5 */
  weight: number
}

/** 从 RSS 抓取的原始文章 */
export interface RawArticle {
  title: string
  link: string
  summary: string
  content?: string
  pubDate: string
  source: string
  language: 'zh' | 'en'
  sourceCategories: Category[]
}

/** AI 评分结果 */
export interface AIScore {
  /** 有用性 (0-10) */
  usefulness: number
  /** 独特性 (0-10) */
  uniqueness: number
  /** 意义性 (0-10) */
  meaningfulness: number
  /** 趣味性 (0-10) */
  interestingness: number
  /** 综合评分 (0-100) */
  totalScore: number
  /** AI 判定的分类 */
  category: Category
  /** AI 生成的中文摘要 */
  aiSummary: string
  /** AI 推荐理由 */
  reason: string
}

/** 最终精选文章 */
export interface CuratedArticle {
  id: string
  title: string
  link: string
  originalSummary: string
  aiSummary: string
  reason: string
  source: string
  language: 'zh' | 'en'
  category: Category
  scores: {
    usefulness: number
    uniqueness: number
    meaningfulness: number
    interestingness: number
    total: number
  }
  pubDate: string
  curatedAt: string
}

/** 每日精选数据 */
export interface DailyDigest {
  date: string // YYYY-MM-DD
  articles: CuratedArticle[]
  totalSourced: number
  generatedAt: string
}
