'use client'

import { Category, CATEGORY_CONFIG } from '@/lib/types'

interface CategoryFilterProps {
  selected: Category | 'all'
  onChange: (cat: Category | 'all') => void
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const categories = Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]

  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      <button
        onClick={() => onChange('all')}
        className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          selected === 'all'
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg shadow-gray-300/30'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        全部
      </button>
      {categories.map(([key, config]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            selected === key
              ? 'text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:opacity-80'
          }`}
          style={{
            backgroundColor: selected === key ? config.color : `${config.color}12`,
            ...(selected === key ? { boxShadow: `0 4px 14px ${config.color}40` } : {}),
          }}
        >
          {config.emoji} {config.label}
        </button>
      ))}
    </div>
  )
}
