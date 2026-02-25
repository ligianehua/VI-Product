'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Sparkles, Download, RotateCcw,
  ChevronRight, Palette, Type, BookOpen, Target, Wand2, Check
} from 'lucide-react'
import { VIFormData } from '@/lib/vi-types'

// ─── Constants ─────────────────────────────────────────────────────────────

const INDUSTRIES = [
  '科技/SaaS', '人工智能', '电商/零售', '餐饮/食品', '教育/培训',
  '健康/医疗', '金融/保险', '时尚/服饰', '文化/创意', '咨询/服务',
  '制造/工业', '房地产', '旅游/出行', '游戏/娱乐', '其他',
]

const ARCHETYPES = [
  { value: '英雄', label: '英雄', desc: '克服困难，激励他人' },
  { value: '探索者', label: '探索者', desc: '自由、冒险、真实' },
  { value: '智者', label: '智者', desc: '知识、真理、专业' },
  { value: '照顾者', label: '照顾者', desc: '关怀、服务、保护' },
  { value: '创造者', label: '创造者', desc: '创新、想象、表达' },
  { value: '魔法师', label: '魔法师', desc: '转变、愿景、梦想' },
  { value: '革新者', label: '革新者', desc: '打破规则、解放思维' },
  { value: '领袖', label: '领袖', desc: '控制、责任、权威' },
]

const PERSONALITIES = [
  '专业', '创新', '温暖', '大胆', '优雅', '活力', '极简', '奢华',
  '亲切', '可靠', '前沿', '纯粹',
]

const COLOR_MOODS = [
  { value: 'blue', label: '专业蓝', desc: '科技感、可信度', primary: '#2563EB', accent: '#7C3AED' },
  { value: 'orange', label: '活力橙', desc: '热情、行动力', primary: '#EA580C', accent: '#EAB308' },
  { value: 'green', label: '自然绿', desc: '健康、可持续', primary: '#059669', accent: '#0EA5E9' },
  { value: 'purple', label: '高端紫', desc: '创意、奢华感', primary: '#7C3AED', accent: '#DB2777' },
  { value: 'earth', label: '大地棕', desc: '温暖、自然感', primary: '#92400E', accent: '#65A30D' },
  { value: 'minimal', label: '极简黑', desc: '高级感、现代', primary: '#18181B', accent: '#6366F1' },
] as const

const FONT_STYLES = [
  { value: 'modern', label: '现代无衬线', desc: '干净、高效、国际化', sample: 'Inter' },
  { value: 'classic', label: '传统衬线', desc: '权威、典雅、历史感', sample: 'Playfair' },
  { value: 'geometric', label: '几何精准', desc: '理性、设计感、未来', sample: 'DM Sans' },
  { value: 'warm', label: '人文温感', desc: '亲近、有温度、故事感', sample: 'Lora' },
] as const

const STORY_TEMPLATES = [
  { value: 'A', label: '商业叙事', icon: '📊', desc: '问题→解决方案→结果，适合B2B和理性决策场景' },
  { value: 'B', label: '创始人故事', icon: '👤', desc: '个人经历驱动，适合需要建立个人信任的品牌' },
  { value: 'C', label: '用户旅程', icon: '🚀', desc: '以用户视角叙述转变，适合消费品和服务品牌' },
  { value: 'D', label: '愿景驱动', icon: '🌟', desc: '描绘理想未来，适合使命感强的品牌' },
] as const

const VISUAL_DENSITY = [
  { value: 'minimal', label: '极简', desc: '留白多，呼吸感强' },
  { value: 'standard', label: '标准', desc: '信息密度适中' },
  { value: 'rich', label: '丰富', desc: '内容充实，信息量大' },
] as const

const STAGES = [
  { value: 'startup', label: '初创期', desc: '需要强辨识度和记忆点' },
  { value: 'growth', label: '成长期', desc: '开始建立品牌规范' },
  { value: 'mature', label: '成熟期', desc: '强化一致性和系统化' },
] as const

const TOTAL_PHASES = 4

// ─── Initial State ──────────────────────────────────────────────────────────

const initialFormData: VIFormData = {
  discovery: {
    brandNameZh: '',
    brandNameEn: '',
    industry: '',
    targetAudience: '',
    stage: 'startup',
    keywords: [],
  },
  positioning: {
    mission: '',
    differentiation: '',
    personalities: [],
    archetype: '',
  },
  visual: {
    colorMood: 'blue',
    fontStyle: 'modern',
    visualDensity: 'standard',
  },
  story: {
    storyTemplate: 'A',
    coreConflict: '',
    vision: '',
    founderStory: '',
  },
}

// ─── Helper Components ──────────────────────────────────────────────────────

function StepIndicator({ phase, total }: { phase: number; total: number }) {
  const steps = [
    { label: '品牌发现', icon: Target },
    { label: '品牌定位', icon: BookOpen },
    { label: '视觉偏好', icon: Palette },
    { label: '品牌故事', icon: Type },
  ]
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => {
        const Icon = step.icon
        const isActive = i + 1 === phase
        const isDone = i + 1 < phase
        return (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : isDone
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}>
              {isDone ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
            {i < total - 1 && (
              <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm ${props.className || ''}`}
    />
  )
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm resize-none ${props.className || ''}`}
    />
  )
}

// ─── Phase Components ────────────────────────────────────────────────────────

function Phase1({ data, onChange }: {
  data: VIFormData['discovery']
  onChange: (d: VIFormData['discovery']) => void
}) {
  const [kwInput, setKwInput] = useState('')

  const addKeyword = () => {
    const kw = kwInput.trim()
    if (kw && data.keywords.length < 5 && !data.keywords.includes(kw)) {
      onChange({ ...data, keywords: [...data.keywords, kw] })
      setKwInput('')
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>品牌中文名</Label>
          <Input
            placeholder="如：创新咖啡、知行AI"
            value={data.brandNameZh}
            onChange={e => onChange({ ...data, brandNameZh: e.target.value })}
          />
        </div>
        <div>
          <Label required>品牌英文名</Label>
          <Input
            placeholder="如：InnoBrews, ZhiXing AI"
            value={data.brandNameEn}
            onChange={e => onChange({ ...data, brandNameEn: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label required>所属行业</Label>
        <select
          value={data.industry}
          onChange={e => onChange({ ...data, industry: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
        >
          <option value="">选择行业分类</option>
          {INDUSTRIES.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      <div>
        <Label required>目标用户</Label>
        <Input
          placeholder="如：25-35岁城市白领，追求效率的职场人"
          value={data.targetAudience}
          onChange={e => onChange({ ...data, targetAudience: e.target.value })}
        />
      </div>

      <div>
        <Label required>发展阶段</Label>
        <div className="grid grid-cols-3 gap-3">
          {STAGES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange({ ...data, stage: s.value as VIFormData['discovery']['stage'] })}
              className={`p-3 rounded-xl border text-left transition-all ${
                data.stage === s.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">{s.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>品牌关键词 <span className="text-xs text-gray-400 font-normal">（最多5个，回车添加）</span></Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="输入一个词后按回车，如：简洁、专业"
            value={kwInput}
            onChange={e => setKwInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword() } }}
            className="flex-1"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            添加
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.keywords.map(kw => (
            <span
              key={kw}
              className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm"
            >
              {kw}
              <button
                type="button"
                onClick={() => onChange({ ...data, keywords: data.keywords.filter(k => k !== kw) })}
                className="hover:text-red-500 transition-colors"
              >×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Phase2({ data, onChange }: {
  data: VIFormData['positioning']
  onChange: (d: VIFormData['positioning']) => void
}) {
  const togglePersonality = (p: string) => {
    if (data.personalities.includes(p)) {
      onChange({ ...data, personalities: data.personalities.filter(x => x !== p) })
    } else if (data.personalities.length < 4) {
      onChange({ ...data, personalities: [...data.personalities, p] })
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Label required>品牌使命</Label>
        <Textarea
          rows={2}
          placeholder="我们存在的意义是什么？如：让每个人都能用上专业级的品牌工具"
          value={data.mission}
          onChange={e => onChange({ ...data, mission: e.target.value })}
        />
      </div>

      <div>
        <Label required>核心差异化</Label>
        <Textarea
          rows={2}
          placeholder="你与竞品最本质的区别是什么？如：竞品在卖功能，我们在卖创始人的时间和认知"
          value={data.differentiation}
          onChange={e => onChange({ ...data, differentiation: e.target.value })}
        />
      </div>

      <div>
        <Label>品牌人格 <span className="text-xs text-gray-400 font-normal">（最多选4个）</span></Label>
        <div className="flex flex-wrap gap-2">
          {PERSONALITIES.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => togglePersonality(p)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                data.personalities.includes(p)
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label required>品牌原型</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ARCHETYPES.map(a => (
            <button
              key={a.value}
              type="button"
              onClick={() => onChange({ ...data, archetype: a.value })}
              className={`p-3 rounded-xl border text-left transition-all ${
                data.archetype === a.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">{a.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Phase3({ data, onChange }: {
  data: VIFormData['visual']
  onChange: (d: VIFormData['visual']) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label required>色彩情绪</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COLOR_MOODS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange({ ...data, colorMood: c.value })}
              className={`p-3 rounded-xl border text-left transition-all ${
                data.colorMood === c.value
                  ? 'border-blue-500 ring-1 ring-blue-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ background: c.primary }} />
                  <div className="w-4 h-4 rounded-full" style={{ background: c.accent }} />
                </div>
                {data.colorMood === c.value && (
                  <Check className="w-3.5 h-3.5 text-blue-500 ml-auto" />
                )}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{c.label}</div>
              <div className="text-xs text-gray-400">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label required>字体风格</Label>
        <div className="grid grid-cols-2 gap-3">
          {FONT_STYLES.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange({ ...data, fontStyle: f.value })}
              className={`p-3 rounded-xl border text-left transition-all ${
                data.fontStyle === f.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-base font-bold text-gray-900 dark:text-white mb-0.5" style={{
                fontFamily: f.value === 'classic' ? 'Georgia, serif' : f.value === 'warm' ? 'Georgia, serif' : 'inherit'
              }}>
                {f.sample}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</div>
              <div className="text-xs text-gray-400">{f.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>视觉密度</Label>
        <div className="grid grid-cols-3 gap-3">
          {VISUAL_DENSITY.map(d => (
            <button
              key={d.value}
              type="button"
              onClick={() => onChange({ ...data, visualDensity: d.value })}
              className={`p-3 rounded-xl border text-center transition-all ${
                data.visualDensity === d.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">{d.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Phase4({ data, onChange, stageContext }: {
  data: VIFormData['story']
  onChange: (d: VIFormData['story']) => void
  stageContext: string
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>故事模板</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STORY_TEMPLATES.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ ...data, storyTemplate: t.value })}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                data.storyTemplate === t.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{t.icon}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{t.label}</span>
                {data.storyTemplate === t.value && (
                  <Check className="w-3.5 h-3.5 text-blue-500 ml-auto" />
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label required>核心冲突 / 品牌反派</Label>
        <Textarea
          rows={2}
          placeholder="你的品牌在对抗什么？用户面临的系统性障碍是什么？如：传统VI设计贵且慢，让大多数创业者无法拥有专业品牌形象"
          value={data.coreConflict}
          onChange={e => onChange({ ...data, coreConflict: e.target.value })}
        />
        <p className="text-xs text-gray-400 mt-1">好的故事需要明确的「反派」——可以是行业痛点、旧有观念或系统性问题</p>
      </div>

      <div>
        <Label required>品牌愿景 / 用户进化后的状态</Label>
        <Textarea
          rows={2}
          placeholder="用户使用你的产品/服务后会变成什么样？如：每一位创始人都能拥有和大品牌一样专业的品牌力"
          value={data.vision}
          onChange={e => onChange({ ...data, vision: e.target.value })}
        />
      </div>

      {data.storyTemplate === 'B' && (
        <div>
          <Label>创始人故事 <span className="text-xs text-gray-400 font-normal">（仅创始人故事模板需要）</span></Label>
          <Textarea
            rows={3}
            placeholder="你为什么创建这个品牌？什么亲身经历驱使你走上这条路？"
            value={data.founderStory || ''}
            onChange={e => onChange({ ...data, founderStory: e.target.value })}
          />
        </div>
      )}

      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <strong>即将生成：</strong>品牌故事、标语(Tagline)、电梯演讲、品牌宣言、
            色彩系统、字体规范、Logo规范、应用示例 —— 完整HTML品牌手册，可直接下载使用
            {stageContext && <span className="block mt-1 text-blue-500/80">策略建议：{stageContext}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Loading Animation ───────────────────────────────────────────────────────

function GeneratingState() {
  const steps = [
    '分析品牌基因与定位…',
    '构建色彩系统与信噪比…',
    '生成品牌故事与叙事资产…',
    '渲染应用系统与品牌手册…',
  ]
  const [step, setStep] = useState(0)

  useState(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % steps.length)
    }, 2500)
    return () => clearInterval(interval)
  })

  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 animate-pulse">
          <Wand2 className="w-7 h-7 text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-30 animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          正在构建品牌 VI 系统…
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          {steps[step]}
        </p>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-400"
            style={{ animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">通常需要 30-60 秒，请耐心等待</p>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function VIDesignerPage() {
  const [phase, setPhase] = useState<number | 'landing' | 'generating' | 'result'>('landing')
  const [formData, setFormData] = useState<VIFormData>(initialFormData)
  const [generatedHtml, setGeneratedHtml] = useState<string>('')
  const [error, setError] = useState<string>('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const stageContextMap = {
    startup: '初创期→辨识度优先，大胆创新，留成长空间',
    growth: '成长期→开始建立规范，平衡辨识度与一致性',
    mature: '成熟期→一致性优先，系统化是铁律',
  }

  const canProceed = () => {
    if (phase === 1) {
      return formData.discovery.brandNameZh && formData.discovery.brandNameEn &&
        formData.discovery.industry && formData.discovery.targetAudience &&
        formData.discovery.stage
    }
    if (phase === 2) {
      return formData.positioning.mission && formData.positioning.differentiation &&
        formData.positioning.archetype
    }
    if (phase === 3) return true
    if (phase === 4) {
      return formData.story.coreConflict && formData.story.vision
    }
    return false
  }

  const handleGenerate = async () => {
    setPhase('generating')
    setError('')
    try {
      const res = await fetch('/api/vi/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      })
      const data = await res.json()
      if (res.ok && data.html) {
        setGeneratedHtml(data.html)
        setPhase('result')
      } else {
        setError(data.error || data.details || '生成失败，请重试')
        setPhase(4)
      }
    } catch {
      setError('网络错误，请检查连接后重试')
      setPhase(4)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.discovery.brandNameEn || formData.discovery.brandNameZh}-brand-guideline.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Landing page
  if (phase === 'landing') {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
        <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-purple-50/80 via-blue-50/40 to-transparent dark:from-purple-950/30 dark:via-blue-950/10 dark:to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>

          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-200/50 dark:shadow-purple-900/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent leading-tight">
                VI 品牌设计师
              </h1>
              <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
                10 分钟，AI 为你生成完整的品牌视觉识别系统
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left my-8">
              {[
                { icon: '🧬', title: '品牌基因', desc: '从第一性原理构建你的品牌定位和故事' },
                { icon: '🎨', title: '完整VI系统', desc: '色彩、字体、Logo规范、应用场景全覆盖' },
                { icon: '📄', title: 'HTML品牌手册', desc: '一键下载，可在浏览器直接打开的品牌指南' },
              ].map(item => (
                <div key={item.title} className="p-4 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{item.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPhase(1)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 hover:opacity-90 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              开始设计
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-gray-400">
              需要配置 ANTHROPIC_API_KEY · 生成约需 30-60 秒
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Generating state
  if (phase === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex items-center justify-center">
        <GeneratingState />
        <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }`}</style>
      </div>
    )
  }

  // Result state
  if (phase === 'result') {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
        <div className="fixed top-0 inset-x-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 z-10 flex items-center px-4 gap-3">
          <button
            onClick={() => setPhase(4)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {formData.discovery.brandNameZh} — 品牌视觉识别手册
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPhase(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              重新设计
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Download className="w-3 h-3" />
              下载HTML
            </button>
          </div>
        </div>
        <div className="pt-16">
          <iframe
            ref={iframeRef}
            srcDoc={generatedHtml}
            className="w-full border-0"
            style={{ height: 'calc(100vh - 64px)' }}
            title="Brand Guideline Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    )
  }

  // Wizard phases 1-4
  const currentPhase = phase as number

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50/80 via-purple-50/40 to-transparent dark:from-blue-950/30 dark:via-purple-950/10 dark:to-transparent pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setPhase(currentPhase > 1 ? currentPhase - 1 : 'landing')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">VI 品牌设计师</span>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator phase={currentPhase} total={TOTAL_PHASES} />

        {/* Phase title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {['', '品牌发现', '品牌定位', '视觉偏好', '品牌故事'][currentPhase]}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {[
              '',
              '告诉我们你的品牌是谁，服务谁',
              '你的品牌站在哪里，代表什么',
              '你希望品牌看起来是什么感觉',
              '你的品牌要讲什么故事',
            ][currentPhase]}
          </p>
        </div>

        {/* Phase content */}
        <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 sm:p-6 shadow-sm">
          {currentPhase === 1 && (
            <Phase1
              data={formData.discovery}
              onChange={d => setFormData({ ...formData, discovery: d })}
            />
          )}
          {currentPhase === 2 && (
            <Phase2
              data={formData.positioning}
              onChange={d => setFormData({ ...formData, positioning: d })}
            />
          )}
          {currentPhase === 3 && (
            <Phase3
              data={formData.visual}
              onChange={d => setFormData({ ...formData, visual: d })}
            />
          )}
          {currentPhase === 4 && (
            <Phase4
              data={formData.story}
              onChange={d => setFormData({ ...formData, story: d })}
              stageContext={stageContextMap[formData.discovery.stage]}
            />
          )}
        </div>

        {/* Error message */}
        {error && currentPhase === 4 && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {currentPhase} / {TOTAL_PHASES}
          </span>

          {currentPhase < TOTAL_PHASES ? (
            <button
              onClick={() => setPhase(currentPhase + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-md shadow-blue-200/50 dark:shadow-blue-900/30 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              下一步
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-md shadow-purple-200/50 dark:shadow-purple-900/30 hover:opacity-90 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              <Wand2 className="w-4 h-4" />
              生成品牌手册
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
