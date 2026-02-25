'use client'

import { CuratedArticle, CATEGORY_CONFIG } from '@/lib/types'
import { ExternalLink, Star, Sparkles, TrendingUp, Lightbulb } from 'lucide-react'

interface ArticleCardProps {
  article: CuratedArticle
  rank: number
}

function ScoreBar({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  const percentage = value * 10
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-400 w-4">{icon}</span>
      <span className="text-gray-500 w-10 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${percentage > 70 ? '#10B981' : percentage > 50 ? '#F59E0B' : '#EF4444'}, ${percentage > 70 ? '#34D399' : percentage > 50 ? '#FBBF24' : '#F87171'})`,
          }}
        />
      </div>
      <span className="text-gray-400 w-5 text-right font-mono">{value}</span>
    </div>
  )
}

export default function ArticleCard({ article, rank }: ArticleCardProps) {
  const cat = CATEGORY_CONFIG[article.category]
  const totalScore = article.scores.total

  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/20 overflow-hidden">
      {/* 排名角标 */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
          rank <= 3
            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200/50'
            : rank <= 10
            ? 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
        }`}>
          {rank}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* 来源和分类 */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${cat.color}15`,
              color: cat.color,
            }}
          >
            {cat.emoji} {cat.label}
          </span>
          <span className="text-xs text-gray-400">
            {article.source}
          </span>
          {article.language === 'en' && (
            <span className="text-xs px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded">
              EN
            </span>
          )}
        </div>

        {/* 标题 */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 pr-10 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {article.title}
          </a>
        </h3>

        {/* AI 摘要 */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed line-clamp-3">
          {article.aiSummary || article.originalSummary}
        </p>

        {/* 推荐理由 */}
        {article.reason && (
          <div className="flex items-start gap-2 mb-4 px-3 py-2 bg-amber-50/70 dark:bg-amber-900/10 rounded-lg border border-amber-100/50 dark:border-amber-800/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              {article.reason}
            </p>
          </div>
        )}

        {/* 评分详情 */}
        <div className="space-y-1.5 mb-4">
          <ScoreBar label="有用" value={article.scores.usefulness} icon={<Star className="w-3 h-3" />} />
          <ScoreBar label="独特" value={article.scores.uniqueness} icon={<Sparkles className="w-3 h-3" />} />
          <ScoreBar label="意义" value={article.scores.meaningfulness} icon={<TrendingUp className="w-3 h-3" />} />
          <ScoreBar label="趣味" value={article.scores.interestingness} icon={<Lightbulb className="w-3 h-3" />} />
        </div>

        {/* 底栏 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-0.5 rounded-md text-xs font-bold ${
              totalScore >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
              totalScore >= 60 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              {totalScore.toFixed(0)}分
            </div>
            <span className="text-xs text-gray-400">
              {new Date(article.pubDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
          >
            阅读原文
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  )
}
