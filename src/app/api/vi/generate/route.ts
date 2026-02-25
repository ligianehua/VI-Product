// ============================================================
// VI Brand Designer — AI Generation API
// POST /api/vi/generate
//
// 支持任意 OpenAI 兼容 API（DeepSeek / Groq / OpenAI / Together 等）
// 推荐：DeepSeek V3 — 极低成本，中文质量优秀，完全兼容 OpenAI SDK
//
// 环境变量配置：
//   VI_API_KEY    = 你的 API Key（必填）
//   VI_API_BASE   = API Base URL（可选，默认 DeepSeek）
//   VI_MODEL      = 模型名称（可选，默认 deepseek-chat）
//
// 快速接入指南：
//   DeepSeek  → KEY: platform.deepseek.com  BASE: https://api.deepseek.com  MODEL: deepseek-chat
//   Groq      → KEY: console.groq.com        BASE: https://api.groq.com/openai/v1  MODEL: llama-3.3-70b-versatile
//   OpenAI    → KEY: platform.openai.com     BASE: (留空)  MODEL: gpt-4o-mini
// ============================================================

import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { VIFormData } from '@/lib/vi-types'

export const maxDuration = 120
export const dynamic = 'force-dynamic'

const client = new OpenAI({
  apiKey: process.env.VI_API_KEY || '',
  baseURL: process.env.VI_API_BASE || 'https://api.deepseek.com',
})

// Color palette presets based on mood selection
const COLOR_PALETTES = {
  blue: {
    primary: '#2563EB', primaryLight: '#DBEAFE', primaryDark: '#1E40AF',
    secondary: '#7C3AED', secondary2: '#06B6D4', accent: '#F59E0B',
    neutralDark: '#0F172A', neutralText: '#1E293B',
  },
  orange: {
    primary: '#EA580C', primaryLight: '#FED7AA', primaryDark: '#9A3412',
    secondary: '#EAB308', secondary2: '#EC4899', accent: '#14B8A6',
    neutralDark: '#1C0A00', neutralText: '#292524',
  },
  green: {
    primary: '#059669', primaryLight: '#D1FAE5', primaryDark: '#065F46',
    secondary: '#0EA5E9', secondary2: '#84CC16', accent: '#F59E0B',
    neutralDark: '#022C22', neutralText: '#134E4A',
  },
  purple: {
    primary: '#7C3AED', primaryLight: '#EDE9FE', primaryDark: '#5B21B6',
    secondary: '#DB2777', secondary2: '#6366F1', accent: '#F59E0B',
    neutralDark: '#0F0A1E', neutralText: '#1E1B4B',
  },
  earth: {
    primary: '#92400E', primaryLight: '#FEF3C7', primaryDark: '#78350F',
    secondary: '#65A30D', secondary2: '#BE123C', accent: '#0369A1',
    neutralDark: '#1C1917', neutralText: '#292524',
  },
  minimal: {
    primary: '#18181B', primaryLight: '#F4F4F5', primaryDark: '#09090B',
    secondary: '#3F3F46', secondary2: '#71717A', accent: '#6366F1',
    neutralDark: '#09090B', neutralText: '#27272A',
  },
}

// Font presets
const FONT_PRESETS = {
  modern: {
    display: "'Inter', 'Helvetica Neue', sans-serif",
    body: "'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif",
    displayName: 'Inter', bodyName: 'Noto Sans SC',
    googleFonts: 'Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700',
  },
  classic: {
    display: "'Playfair Display', 'Noto Serif SC', serif",
    body: "'Source Serif 4', 'Noto Serif SC', serif",
    displayName: 'Playfair Display', bodyName: 'Noto Serif SC',
    googleFonts: 'Playfair+Display:wght@700;800&family=Source+Serif+4:wght@400;600&family=Noto+Serif+SC',
  },
  geometric: {
    display: "'DM Sans', 'Helvetica Neue', sans-serif",
    body: "'DM Sans', 'PingFang SC', 'Noto Sans SC', sans-serif",
    displayName: 'DM Sans', bodyName: 'Noto Sans SC',
    googleFonts: 'DM+Sans:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700',
  },
  warm: {
    display: "'Lora', 'Noto Serif SC', serif",
    body: "'Nunito', 'PingFang SC', 'Noto Sans SC', sans-serif",
    displayName: 'Lora', bodyName: 'Nunito',
    googleFonts: 'Lora:wght@600;700&family=Nunito:wght@400;600;700&family=Noto+Sans+SC:wght@400;500',
  },
}

const ARCHETYPE_MAP: Record<string, string> = {
  '英雄': 'The Hero — 英雄',
  '探索者': 'The Explorer — 探索者',
  '智者': 'The Sage — 智者',
  '照顾者': 'The Caregiver — 照顾者',
  '创造者': 'The Creator — 创造者',
  '魔法师': 'The Magician — 魔法师',
  '革新者': 'The Outlaw — 革新者',
  '领袖': 'The Ruler — 领袖',
  '伙伴': 'The Jester — 伙伴',
  '普通人': 'The Everyman — 普通人',
  '小丑': 'The Jester — 小丑',
  '反叛者': 'The Outlaw — 反叛者',
}

const STORY_TEMPLATE_NAMES: Record<string, string> = {
  'A': '商业叙事型 — Business Narrative',
  'B': '创始人故事型 — Founder\'s Story',
  'C': '用户旅程型 — User Journey',
  'D': '愿景驱动型 — Vision-Driven',
}

// ─── Archetype visual style lookup (from brand-archetypes.md) ──────────────
const ARCHETYPE_VISUAL_STYLES: Record<string, string> = {
  '英雄': '色彩：红色、深蓝、金色；字体：粗体无衬线，有力量感；图形：盾牌、箭头、向上的几何',
  '探索者': '色彩：深绿、棕色、橙色；字体：现代动态字体；图形：地图、指南针、山峰',
  '智者': '色彩：深蓝、黑、灰白；字体：现代无衬线或经典衬线；图形：几何、数据可视化',
  '照顾者': '色彩：柔和蓝、绿、粉色；字体：圆润友好字体；图形：手掌、心形、圆形',
  '创造者': '色彩：多彩、不对称配色；字体：独特个性化字体；图形：画笔、不规则形状',
  '魔法师': '色彩：紫色、深蓝、星空色；字体：优雅衬线体；图形：星星、螺旋、光晕',
  '革新者': '色彩：黑红、高对比；字体：粗体冲击力字体；图形：打破、裂痕、锐角',
  '领袖': '色彩：深紫、黑金、深红；字体：经典衬线、大气庄重；图形：皇冠、盾牌、对称',
}

// ─── Story template structure lookup (from brand-story-templates.md) ────────
const STORY_TEMPLATE_STRUCTURES: Record<string, string> = {
  'A': `【商业叙事型】结构：
1. 问题引入：[目标用户]面临[具体问题]
2. 解决方案：我们通过[创新方式]做到了[价值承诺]
3. 市场验证：已有[数据/案例]证明[效果]
4. 品牌信念：我们相信[核心理念]
写作要点：问题具体化，强调"为什么我们"而非"做什么"，融入数据但不堆砌
禁忌：过度技术术语、虚假数据、模仿竞品`,
  'B': `【创始人故事型】结构：
1. 个人背景：[创始人身份/经历]
2. 痛点时刻：在[具体场景]中，我意识到[问题]
3. 执念转化：这激发了我去[行动]
4. 品牌诞生：从而创立了[品牌]，为了[使命]
写作要点：真实细节>宏大叙述，展示脆弱面不是完美形象，个人信念与品牌理念紧密呼应
禁忌：过度自我美化、忽视团队、故事与调性不符`,
  'C': `【用户旅程型】结构：
1. 用户初心：[用户角色]想要[初始需求]
2. 现实困境：但传统方式存在[具体障碍]
3. 体验转折：我们的产品让他们[新体验]
4. 生活改变：从而实现了[终极收益]
写作要点：用具体人物（虚构可）代替"用户"，描写情感变化不只功能变化，困境到豁然的对比要清晰
禁忌：过度夸大转变、忽视学习期、不以用户为中心`,
  'D': `【愿景驱动型】结构：
1. 现状观察：当前社会/行业的状况是[事实]
2. 理想状态：我们梦想看到[愿景]
3. 信念声明：这基于我们对[价值观]的执念
4. 行动宣言：因此，我们选择[承诺]
写作要点：激发情感共鸣超越商业利益，愿景具体可感不是空泛理想，展现长期承诺
禁忌：虚伪社会责任宣言、脱离商业可持续性的空想`,
}

function buildSystemPrompt(): string {
  return `你是一位掌握品牌第一性原理的VI设计师和品牌战略家。你不谈"美学"，你谈"资产"——一套好VI是可迭代、持续累积品牌溢价的数字资产。

═══════════════════════════════════════════════
PART 1: VI设计的六维审视框架
═══════════════════════════════════════════════

生成VI每一个组件时，用这六个维度审视：

【维度1：演化生物学 — 超常刺激(Supernormal Stimulus)】
VI是品牌的"生物特征码"。好的设计不是让用户"想"，而是让用户直接"反应"。
- 颜色能否在0.1秒内被大脑识别并关联到品牌？
- 图形模式是否利用了人类的模式识别本能？
- 品牌符号是否触发原始情感反应（安全感/食欲/好奇心/归属感）？

【维度2：信息论 — 香农定理/抗噪协议】
公式：C = B × log₂(1 + S/N)。VI的本质是提高信噪比(SNR)。
- 色彩数量控制在3-5个（信号简洁→传输可靠）
- Logo应在5px favicon和50m远招牌上都能正确"解码"
- 每增加一个视觉元素都在增加系统熵——如无必要，勿增实体
- 扁平化=低数据量=高传输速度=极低解码错误

【维度3：经济学 — 信号传递理论(Signaling Theory)】
一套统一的VI系统是在向市场发信号："我有长期经营的打算，我有沉没成本。"
- VI是品牌资产的"抵押品"
- 混乱的视觉=告诉客户"我随时可能跑路"
- 应用系统的完整度直接影响用户的信任溢价

【维度4：系统论 — 视觉操作系统(V-OS)】
VI不是一张死图，是参数化的API。CSS变量就是现代VI的参数化表达。
- 输出的HTML本身就是VI系统的"运行时"
- CSS变量即品牌参数，改一处全局生效
- 像分形几何一样，从摩天大楼到App图标，核心逻辑必须一致

【维度5：情绪品牌化(Emotional Branding)】
人因为情绪购买，用理性合理化。
- 每个品牌触点都应触发特定情绪反应
- 多感官一致性：颜色、字体、空间、语气→同一情绪坐标
- 品牌宣言(Manifesto)是情绪的高浓度表达

【维度6：哲学 — 容器不是内容】
VI是容器，不是内容。好的VI不是让你欣赏品牌，而是让你通过品牌欣赏自己。
- 如果品牌没有灵魂(Core Values)，VI就是华丽的寿衣
- 最好的VI像"空气"——消失或变异时你会生理性不适
- 每个视觉决策都要能用一句话解释其商业逻辑

═══════════════════════════════════════════════
PART 2: 品牌叙事哲学
═══════════════════════════════════════════════

【叙事资产公式】
Narrative_Value = (Conflict × Resolution) / Predictability
- 无冲突 = 无故事。必须诊断出品牌解决的深层矛盾
- "既出人意料又必然"的结局 = 最高品质
- 数据不动人心；具体场景会

【英雄之旅 — 角色分配（99%品牌演错了）】
| 角色 | ❌错误 | ✅正确 |
| 主角Hero | 品牌本身 | 用户（面临什么困境？）|
| 向导Guide | 竞品 | 品牌自己（提供武器/路径）|
| 反派Villain | 缺席 | 用户正在对抗的系统/心理/旧范式 |
| 胜利Success | 品牌赚钱 | 用户进化成"更好版本的自己" |

核心：你不是超人，你是给超人缝红色斗篷的裁缝。

【找到真正的反派】
反派不是竞争对手，而是：
- 系统性问题：都市孤独感、信息过载、时间碎片化
- 心理状态：平庸感、停滞感、自我怀疑、失控感
- 过时范式："大众生产"思维、通用方案文化、工业时代制服化生活

【故事-VI共振原则】
| VI色温 | 故事语调 |
| 暖色系(橙红黄) | 亲密的、充满能量的、激情的 |
| 冷色系(蓝紫绿) | 专业的、平静的、前瞻性的 |
| 高饱和度 | 大胆、自信、挑衅 |
| 低饱和度/中性 | 低调、精致、微妙 |

字体对齐：衬线→传统权威；无衬线→创新清晰；装饰性→个性不羁

═══════════════════════════════════════════════
PART 3: 品牌社交操作系统(Social OS)
═══════════════════════════════════════════════

【品牌力量公式】
Brand_Power = (Perceived_Status × Belonging) / Access_Difficulty
- 地位感：拥有这个会让我看起来更聪明/更有品味？
- 归属感：我会进入一个理解我的社群吗？
- 准入门槛：每个人都能轻易得到→信号贬值

【病毒系数】K = i × c
增加c（转化率）不靠折扣，靠：VI一致性、故事传染性、身份清晰度。
如果视觉看起来像微信营销，K→0。

【三个致命真相】
1. 如果产品很垃圾，VI和故事会加速死亡。更高期望=更大失望动量。
2. 大多数会员系统死于复杂性。3秒内无法理解分级逻辑→感到被欺骗。
3. 创始人最常见错误是自我感动。用户只关心："用你的东西之后，我看起来/感觉更酷吗？"

═══════════════════════════════════════════════
PART 4: HTML品牌手册输出规范
═══════════════════════════════════════════════

生成完整的、可直接在浏览器打开的HTML文件（DOCTYPE到</html>），要求：

【结构（8个章节）】
1. 封面 — 品牌名(中英文)、Tagline、渐变背景
2. 品牌故事 — 电梯演讲(100字) + 完整故事(300-500字) + 品牌宣言(诗歌体)
3. 品牌定位 — 使命、愿景、品牌原型(含图标)、3个核心价值观
4. 色彩系统 — 色板卡片(主色/辅色/强调色/中性色)，每色显示名称+HEX+RGB
5. 字体系统 — Display字体展示(大标题) + Body字体展示(正文) + 字体层级规范表
6. Logo规范 — 文字Logo在白底/主色底/深色底3种背景的展示 + 安全区域说明
7. 应用示例 — 名片(正面)、社交媒体头像、海报头部
8. 品牌宣言收尾 — 5-8行诗意宣言，作为最后的情感高潮

【技术规范】
- CSS变量作为品牌参数（:root中定义所有品牌色、字体、间距）
- Google Fonts加载（用<link>标签）
- 暗色模式：data-theme="dark"属性切换，顶部导航包含切换按钮
- 颜色点击复制（onclick → navigator.clipboard.writeText）
- 滚动入场动画（Intersection Observer，fade-in-up效果）
- 固定顶部导航（各章节锚点链接）
- 响应式布局（单列手机 / 多列桌面）
- @media print样式（打印友好）
- 所有文字用中文（英文品牌名除外）
- HTML控制在1500-2000行

【品牌故事质量要求】
- 必须有明确的"反派"（用户对抗的系统性障碍）
- 用户是主角，品牌是向导
- 故事的情感温度必须与色彩系统的色温匹配
- 品牌宣言要用排比、对比、隐喻，短句营造节奏感
- Tagline不超过8个字，独特、可记忆、有情感触达

直接输出完整HTML，不要任何解释、注释或markdown包装。`
}

function buildUserPrompt(formData: VIFormData): string {
  const palette = COLOR_PALETTES[formData.visual.colorMood]
  const fonts = FONT_PRESETS[formData.visual.fontStyle]
  const stageMap = {
    startup: '初创期 — 辨识度优先策略：色彩可以大胆跳脱，Logo要有强烈记忆锚点，故事侧重"我为什么不一样"，VI可适度灵活留成长空间',
    growth: '成长期 — 过渡策略：开始建立规范，平衡辨识度与一致性',
    mature: '成熟期 — 一致性优先策略：色彩使用严格规范，Logo零偏差，故事侧重"我们一直在这里"，VI是铁律不可随意修改',
  }
  const archetype = formData.positioning.archetype
  const archetypeVisual = ARCHETYPE_VISUAL_STYLES[archetype] || ''
  const storyStructure = STORY_TEMPLATE_STRUCTURES[formData.story.storyTemplate] || ''

  return `请为以下品牌生成完整的HTML品牌手册：

═══ 品牌基因 ═══
- 中文名：${formData.discovery.brandNameZh}
- 英文名：${formData.discovery.brandNameEn}
- 行业：${formData.discovery.industry}
- 目标用户：${formData.discovery.targetAudience}
- 发展阶段与VI策略：${stageMap[formData.discovery.stage]}
- 品牌关键词：${formData.discovery.keywords.join('、') || '（未指定）'}

═══ 品牌定位 ═══
- 使命：${formData.positioning.mission}
- 核心差异化（为什么不是竞品）：${formData.positioning.differentiation}
- 品牌人格标签：${formData.positioning.personalities.join('、') || '（未指定）'}
- 品牌原型：${archetype}（${ARCHETYPE_MAP[archetype] || archetype}）
  原型视觉风格参考：${archetypeVisual}

═══ 视觉系统参数 ═══
色彩方案（60-30-10法则：主色60%，辅色30%，强调色10%）：
- 主色 Primary: ${palette.primary}（品牌核心色，占比最大）
- 主色浅版: ${palette.primaryLight}（背景/hover态）
- 主色深版: ${palette.primaryDark}（强调/active态）
- 辅色1 Secondary: ${palette.secondary}（对比/互补）
- 辅色2: ${palette.secondary2}（辅助区分）
- 强调色 Accent: ${palette.accent}（CTA/高亮/警告）
- 深中性色: ${palette.neutralDark}（标题/重要文字）
- 文字中性色: ${palette.neutralText}（正文）

字体方案（${formData.visual.fontStyle}风格）:
- Display/标题字体: ${fonts.display}（${fonts.displayName}）
- Body/正文字体: ${fonts.body}（${fonts.bodyName}）
- Google Fonts加载: ${fonts.googleFonts}

视觉密度：${formData.visual.visualDensity}

═══ 品牌故事创作指令 ═══

故事模板：${STORY_TEMPLATE_NAMES[formData.story.storyTemplate]}

${storyStructure}

【用户提供的核心素材】
- 核心冲突/品牌反派（用户正在对抗什么）：${formData.story.coreConflict}
- 品牌愿景/用户进化后的状态：${formData.story.vision}
${formData.story.founderStory ? `- 创始人故事素材：${formData.story.founderStory}` : ''}

【故事写作的硬性规则（来自叙事哲学框架）】
1. 必须有明确的"反派"——不是竞争对手，而是用户面临的系统性障碍/心理状态/旧范式
2. 用户=主角（Hero），品牌=向导（Guide）。品牌永远不是超人，是给超人缝斗篷的裁缝
3. 叙事价值 = (冲突 × 解决) / 可预测性。结局要"既出人意料又完全合理"
4. 故事的情感温度必须与色彩系统色温匹配（暖色→激情亲密语言，冷色→专业前瞻语言）
5. 不要自我感动——每句话都要过"所以呢？跟用户有什么关系？"的审查
6. 不完美>完美，脆弱>强硬（后AI时代的叙事策略）

【需要生成的叙事资产（5件套）】
1. 品牌故事正文（300-500字，完整叙事弧）
2. Tagline/标语（≤8个字，独特、可记忆、有情感触达）
3. 电梯演讲（100字以内，30秒让陌生人记住你）
4. 品牌宣言/Manifesto（5-8行诗歌体，排比+对比+隐喻，短句营造节奏感）
5. 3个核心价值观（每个含名称+emoji图标+一句话描述）

═══ HTML输出 ═══

使用上述所有参数，生成完整HTML品牌手册。色彩用CSS变量，加载Google Fonts，含暗色模式切换、颜色点击复制、滚动动画、固定导航、响应式布局。

直接输出完整HTML代码，不要任何解释或markdown包装。`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const formData: VIFormData = body.formData

    if (!formData) {
      return NextResponse.json({ error: '缺少品牌数据' }, { status: 400 })
    }

    if (!process.env.VI_API_KEY) {
      return NextResponse.json(
        {
          error: '未配置 VI_API_KEY。请在 Vercel 环境变量中添加：\nVI_API_KEY = 你的 DeepSeek/Groq/OpenAI API Key\nVI_API_BASE = API地址（DeepSeek: https://api.deepseek.com）\nVI_MODEL = 模型名称（DeepSeek: deepseek-chat）',
        },
        { status: 500 }
      )
    }

    const response = await client.chat.completions.create({
      model: process.env.VI_MODEL || 'deepseek-chat',
      max_tokens: 8192,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(formData) },
      ],
    })

    const html = response.choices[0]?.message?.content || ''

    if (!html || !html.includes('<!DOCTYPE') && !html.includes('<html')) {
      return NextResponse.json({ error: '生成失败：AI返回了无效内容' }, { status: 500 })
    }

    return NextResponse.json({ html })
  } catch (error) {
    console.error('VI generation failed:', error)
    return NextResponse.json(
      {
        error: '生成失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}
