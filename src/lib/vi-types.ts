// ============================================================
// VI Brand Designer — TypeScript Types
// ============================================================

/** Phase 1: Brand Discovery */
export interface BrandDiscovery {
  brandNameZh: string        // 中文品牌名
  brandNameEn: string        // English brand name
  industry: string           // 行业
  targetAudience: string     // 目标用户描述
  stage: 'startup' | 'growth' | 'mature'  // 发展阶段
  keywords: string[]         // 3 brand keywords
}

/** Phase 2: Brand Positioning */
export interface BrandPositioning {
  mission: string            // 品牌使命
  differentiation: string    // 与竞品的核心差异
  personalities: string[]    // 品牌人格标签 (up to 4)
  archetype: string          // 品牌原型
}

/** Phase 3: Visual Preferences */
export interface VisualPreferences {
  colorMood: 'blue' | 'orange' | 'green' | 'purple' | 'earth' | 'minimal'
  fontStyle: 'modern' | 'classic' | 'geometric' | 'warm'
  visualDensity: 'minimal' | 'standard' | 'rich'
}

/** Phase 4: Brand Story */
export interface BrandStory {
  storyTemplate: 'A' | 'B' | 'C' | 'D'  // A商业叙事/B创始人/C用户旅程/D愿景驱动
  coreConflict: string       // 品牌要解决的核心冲突/痛点
  founderStory?: string      // 创始人缘起 (for template B)
  vision: string             // 品牌愿景/用户使用后的状态
}

/** Complete wizard form data */
export interface VIFormData {
  discovery: BrandDiscovery
  positioning: BrandPositioning
  visual: VisualPreferences
  story: BrandStory
}

/** API request body */
export interface VIGenerateRequest {
  formData: VIFormData
}

/** API response */
export interface VIGenerateResponse {
  html: string
  error?: string
}
