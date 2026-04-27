// User & Auth
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  provider?: 'google' | 'github' | 'email'
  stripe_customer_id?: string
  plan: 'free' | 'pro'
  created_at: string
  updated_at: string
}

// Profile is the same as User (used in Supabase queries)
export type Profile = User

// Portfolio
export interface Portfolio {
  id: string
  user_id: string
  slug: string
  subdomain: string
  custom_domain?: string

  // Content
  name: string
  tagline: string
  about: string
  avatar_url?: string

  // JSON fields for flexible content
  skills: Skill[]
  projects: Project[]
  social_links: SocialLink[]

  // Settings
  theme: ThemeId
  theme_config: ThemeConfig

  // Custom Sections
  custom_sections: CustomSection[]

  // Meta
  is_published: boolean
  is_deleted: boolean
  view_count: number
  created_at: string
  updated_at: string
  published_at?: string
}

// Custom Sections
export type CustomSectionType = 'services' | 'experience' | 'education' | 'testimonials' | 'certifications'

export interface CustomSection {
  id: string
  type: CustomSectionType
  title: string
  order: number
  icon?: string
  items: CustomSectionItem[]
}

export interface CustomSectionItem {
  id: string
  // Common fields
  title?: string
  description?: string
  // Services
  service_title?: string
  service_desc?: string
  // Experience/Education
  company?: string
  school?: string
  role?: string
  degree?: string
  period?: string
  current?: boolean
  // Testimonials
  quote?: string
  author?: string
  authorRole?: string
  authorCompany?: string
  // Certifications
  name?: string
  issuer?: string
  year?: string
  url?: string
}

export interface Skill {
  id: string
  name: string
  level?: 'beginner' | 'intermediate' | 'expert' // optional
}

export interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  tags: string[]
  live_url?: string
  repo_url?: string
  order: number
}

export interface SocialLink {
  id: string
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'website' | 'facebook' | 'instagram' | 'youtube' | 'tiktok'
  url: string
  label?: string
}

// Theme System
export type ThemeId = 'gradient-dark' | 'minimal-light' | 'brutalist' | 'cyberpunk' | 'nordic' | 'sunset'

export interface ThemeConfig {
  primary_color?: string
  secondary_color?: string
  font_family?: string
  custom_css?: string
  custom_jsx?: string
}

export interface Theme {
  id: ThemeId
  name: string
  description: string
  preview: string // URL or gradient
  component: string // component name
}

// Builder State
export interface BuilderState {
  step: BuilderStep
  portfolio: Partial<Portfolio>
  isSaving: boolean
  isGenerating: boolean
  previewUrl?: string
}

export type BuilderStep = 'info' | 'skills' | 'projects' | 'social' | 'sections' | 'theme' | 'preview'

// Stripe
export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
}
