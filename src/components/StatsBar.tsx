'use client'

import { CuratedArticle, CATEGORY_CONFIG, Category } from '@/lib/types'
import { BarChart3, Newspaper, Globe, Zap } from 'lucide-react'

interface StatsBarProps {
  articles: CuratedArticle[]
  totalSourced: number
}

export default function StatsBar({ articles, totalSourced }: StatsBarProps) {
  // 统计分类分布
  const catCounts: Record<string, number> = {}
  articles.forEach(a => {
    catCounts[a.category] = (catCounts[a.category] || 0) + 1
  })

  const avgScore = articles.length > 0
    ? (articles.reduce((sum, a) => sum + a.scores.total, 0) / articles.length).toFixed(0)
    : 0

  const enCount = articles.filter(a => a.language === 'en').length
  const zhCount = articles.filter(a => a.language === 'zh').length

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {/* 今日精选 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100/50 dark:border-blue-800/30">
        <div className="flex items-center gap-2 mb-2">
          <Newspaper className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">今日精选</span>
        </div>
        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{articles.length}</div>
        <div className="text-xs text-blue-500/70">从 {totalSourced} 篇中筛选</div>
      </div>

      {/* 平均评分 */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-100/50 dark:border-emerald-800/30">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">均分</span>
        </div>
        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{avgScore}</div>
        <div className="text-xs text-emerald-500/70">满分 100</div>
      </div>

      {/* 语言分布 */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100/50 dark:border-purple-800/30">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-purple-500" />
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">语言</span>
        </div>
        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{zhCount}/{enCount}</div>
        <div className="text-xs text-purple-500/70">中文/英文</div>
      </div>

      {/* 分类覆盖 */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-100/50 dark:border-amber-800/30">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">分类</span>
        </div>
        <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{Object.keys(catCounts).length}</div>
        <div className="text-xs text-amber-500/70">个领域覆盖</div>
      </div>

      {/* 分类分布条 */}
      <div className="col-span-2 sm:col-span-4 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 flex-wrap">
          {(Object.entries(catCounts) as [Category, number][])
            .sort((a, b) => b[1] - a[1])
            .map(([cat, count]) => {
              const config = CATEGORY_CONFIG[cat]
              return (
                <div key={cat} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {config.emoji} {config.label}
                  </span>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{count}</span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
