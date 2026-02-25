'use client'

import { Sparkles, Calendar, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface HeaderProps {
  date: string
  onRefresh?: () => void
  isLoading?: boolean
}

export default function Header({ date, onRefresh, isLoading }: HeaderProps) {
  const dateObj = date ? new Date(date + 'T00:00:00') : new Date()
  const formattedDate = format(dateObj, 'yyyy年M月d日 EEEE', { locale: zhCN })

  return (
    <header className="mb-8 sm:mb-10">
      {/* Logo + Title */}
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                每日精选
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-[52px]">
            AI 智能筛选 · 创新创业 · 科技前沿 · 品牌营销
          </p>
        </div>

        <div className="flex items-center gap-3 ml-[52px] sm:ml-0">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50"
              title="刷新"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* 渐变分割线 */}
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
    </header>
  )
}
