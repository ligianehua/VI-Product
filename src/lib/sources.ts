// ============================================================
// RSS 源配置 - 涵盖中英文科技/创业/营销/品牌资讯
// ============================================================

import { FeedSource } from './types'

export const FEED_SOURCES: FeedSource[] = [
  // ==================== 中文源 ====================
  {
    name: '36氪',
    url: 'https://36kr.com/feed',
    language: 'zh',
    categories: ['innovation', 'technology'],
    weight: 5,
  },
  {
    name: '虎嗅',
    url: 'https://www.huxiu.com/rss/0.xml',
    language: 'zh',
    categories: ['innovation', 'technology', 'marketing'],
    weight: 5,
  },
  {
    name: '少数派',
    url: 'https://sspai.com/feed',
    language: 'zh',
    categories: ['technology', 'new-tech'],
    weight: 4,
  },
  {
    name: '爱范儿',
    url: 'https://www.ifanr.com/feed',
    language: 'zh',
    categories: ['technology', 'new-tech', 'brand-story'],
    weight: 4,
  },
  {
    name: '品玩',
    url: 'https://www.pingwest.com/feed/',
    language: 'zh',
    categories: ['technology', 'innovation'],
    weight: 4,
  },
  {
    name: '钛媒体',
    url: 'https://www.tmtpost.com/feed',
    language: 'zh',
    categories: ['technology', 'innovation', 'marketing'],
    weight: 4,
  },
  {
    name: '极客公园',
    url: 'https://www.geekpark.net/rss',
    language: 'zh',
    categories: ['technology', 'innovation', 'new-tech'],
    weight: 4,
  },
  {
    name: 'InfoQ 中文',
    url: 'https://www.infoq.cn/feed',
    language: 'zh',
    categories: ['new-tech', 'technology'],
    weight: 3,
  },

  // ==================== 英文源 ====================
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    language: 'en',
    categories: ['innovation', 'technology', 'new-tech'],
    weight: 5,
  },
  {
    name: 'Hacker News (Best)',
    url: 'https://hnrss.org/best',
    language: 'en',
    categories: ['technology', 'new-tech', 'innovation'],
    weight: 5,
  },
  {
    name: 'Product Hunt',
    url: 'https://www.producthunt.com/feed',
    language: 'en',
    categories: ['innovation', 'new-tech'],
    weight: 4,
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    language: 'en',
    categories: ['technology', 'new-tech'],
    weight: 4,
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    language: 'en',
    categories: ['technology', 'innovation'],
    weight: 4,
  },
  {
    name: 'Arstechnica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    language: 'en',
    categories: ['technology', 'new-tech'],
    weight: 3,
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    language: 'en',
    categories: ['new-tech', 'technology', 'innovation'],
    weight: 5,
  },
  {
    name: 'First Round Review',
    url: 'https://review.firstround.com/feed.xml',
    language: 'en',
    categories: ['innovation', 'marketing', 'brand-marketing'],
    weight: 4,
  },
  {
    name: 'Seth Godin',
    url: 'https://feeds.feedblitz.com/sethsblog',
    language: 'en',
    categories: ['marketing', 'brand-marketing'],
    weight: 4,
  },
  {
    name: 'HBR - Marketing',
    url: 'https://hbr.org/topic/marketing/feed',
    language: 'en',
    categories: ['marketing', 'brand-marketing', 'brand-story'],
    weight: 5,
  },
  {
    name: 'Adweek',
    url: 'https://www.adweek.com/feed/',
    language: 'en',
    categories: ['brand-marketing', 'marketing', 'brand-story'],
    weight: 4,
  },
  {
    name: 'Marketing Brew',
    url: 'https://www.marketingbrew.com/feed/',
    language: 'en',
    categories: ['marketing', 'brand-marketing'],
    weight: 4,
  },
]
