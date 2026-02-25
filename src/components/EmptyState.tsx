'use client'

import { Inbox, Loader2 } from 'lucide-react'

interface EmptyStateProps {
  isLoading: boolean
  onGenerate?: () => void
  isGenerating?: boolean
}

export default function EmptyState({ isLoading, onGenerate, isGenerating }: EmptyStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">正在加载今日精选...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        今日精选尚未生成
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">
        点击下方按钮手动触发内容抓取和 AI 筛选，
        <br />
        或等待每日定时任务自动执行。
      </p>
      {onGenerate && (
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              AI 正在筛选中...
            </>
          ) : (
            <>
              <span>⚡</span>
              立即生成今日精选
            </>
          )}
        </button>
      )}
    </div>
  )
}
