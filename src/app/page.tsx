'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { DailyDigest, Category, CuratedArticle } from '@/lib/types'
import Header from '@/components/Header'
import StatsBar from '@/components/StatsBar'
import CategoryFilter from '@/components/CategoryFilter'
import ArticleCard from '@/components/ArticleCard'
import EmptyState from '@/components/EmptyState'

interface ApiResponse extends DailyDigest {
  availableDates?: string[]
}

export default function HomePage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [sortBy, setSortBy] = useState<'score' | 'time'>('score')

  const fetchArticles = useCallback(async (date?: string) => {
    setIsLoading(true)
    try {
      const url = date ? `/api/articles?date=${date}` : '/api/articles'
      const res = await fetch(url)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else {
        setData(null)
      }
    } catch (err) {
      console.error('Failed to fetch:', err)
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/cron')
      if (res.ok) {
        // 生成成功，重新加载
        await fetchArticles()
      } else {
        const err = await res.json()
        alert(`生成失败: ${err.error || err.details || '未知错误'}`)
      }
    } catch {
      alert('网络错误，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  // 过滤和排序
  let filteredArticles: CuratedArticle[] = data?.articles || []

  if (selectedCategory !== 'all') {
    filteredArticles = filteredArticles.filter(a => a.category === selectedCategory)
  }

  if (sortBy === 'time') {
    filteredArticles = [...filteredArticles].sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      {/* 顶部渐变装饰 */}
      <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50/80 via-purple-50/40 to-transparent dark:from-blue-950/30 dark:via-purple-950/10 dark:to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Header
          date={data?.date || new Date().toISOString().split('T')[0]}
          onRefresh={() => fetchArticles()}
          isLoading={isLoading}
        />

        {/* 加载中 */}
        {isLoading && (
          <EmptyState isLoading={true} />
        )}

        {/* 无数据状态 */}
        {!isLoading && (!data || data.articles.length === 0) && (
          <EmptyState
            isLoading={false}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        )}

        {/* 有数据状态 */}
        {!isLoading && data && data.articles.length > 0 && (
          <>
            <StatsBar articles={data.articles} totalSourced={data.totalSourced} />

            {/* 筛选 + 排序栏 */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
              <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />

              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => setSortBy('score')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    sortBy === 'score'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  按评分
                </button>
                <button
                  onClick={() => setSortBy('time')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    sortBy === 'time'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  按时间
                </button>
              </div>
            </div>

            {/* 文章列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  rank={index + 1}
                />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                该分类下暂无文章
              </div>
            )}

            {/* 历史日期选择 */}
            {data.availableDates && data.availableDates.length > 1 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  历史精选
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {data.availableDates.map(d => (
                    <button
                      key={d}
                      onClick={() => fetchArticles(d)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        d === data.date
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 pb-8 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent mb-6" />

          {/* VI Designer CTA */}
          <div className="mb-6">
            <Link
              href="/vi"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/50 text-sm font-medium text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
            >
              <span>✦</span>
              VI 品牌设计师 — AI 一键生成品牌手册
              <span className="text-purple-400">→</span>
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            每日精选 · AI 智能策展 · 每天为你精选 5 篇值得阅读的好文章
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
            Powered by Next.js + Brave AI · Deployed on Vercel
          </p>
        </footer>
      </div>
    </div>
  )
}
