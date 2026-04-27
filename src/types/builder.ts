export type SectionType = 'info' | 'skills' | 'projects' | 'social' | 'services' | 'experience' | 'education' | 'testimonials' | 'certifications'

export interface Section {
  id: string
  type: SectionType
  title: string
  collapsed: boolean
  data: InfoData | SkillsData | ProjectsData | SocialData | ServicesData | ExperienceData | EducationData | TestimonialsData | CertificationsData
}

export interface InfoData { name: string; tagline: string; about: string; avatar_url: string }
export interface SkillsData { items: { id: string; name: string }[] }
export interface ProjectsData { items: { id: string; title: string; description: string; tags: string[]; live_url: string; repo_url: string }[] }
export interface SocialData { items: { id: string; platform: string; url: string }[] }
export interface ServicesData { items: { id: string; title: string; description: string; icon: string }[] }
export interface ExperienceData { items: { id: string; company: string; role: string; period: string; description: string; current: boolean }[] }
export interface EducationData { items: { id: string; school: string; degree: string; period: string; description: string }[] }
export interface TestimonialsData { items: { id: string; quote: string; author: string; authorRole: string; authorCompany: string }[] }
export interface CertificationsData { items: { id: string; name: string; issuer: string; year: string; url: string }[] }

export const SECTION_TYPE_META: Record<SectionType, { label: string; icon: string; description: string }> = {
  info: { label: 'ข้อมูล', icon: '👤', description: 'ชื่อ แท็กไลน์ และรูปโปรไฟล์' },
  skills: { label: 'ทักษะ', icon: '⚡', description: 'เทคโนโลยีและทักษะ' },
  projects: { label: 'โปรเจกต์', icon: '🚀', description: 'ผลงานและโปรเจกต์' },
  social: { label: 'โซเชียล', icon: '🔗', description: 'ลิงก์โซเชียลมีเดีย' },
  services: { label: 'บริการ', icon: '💼', description: 'บริการที่คุณเสนอ' },
  experience: { label: 'ประสบการณ์', icon: '💻', description: 'ประสบการณ์ทำงาน' },
  education: { label: 'การศึกษา', icon: '🎓', description: 'การศึกษาและประกาศนียบัตร' },
  testimonials: { label: 'รีวิว', icon: '💬', description: 'คำรีวิวจากลูกค้า' },
  certifications: { label: 'ใบรับรอง', icon: '🏆', description: 'ใบรับรองและรางวัล' },
}

export function createDefaultSection(type: SectionType): Section {
  const meta = SECTION_TYPE_META[type]
  let data: Section['data']

  switch (type) {
    case 'info':
      data = { name: '', tagline: '', about: '', avatar_url: '' } as InfoData
      break
    case 'skills':
      data = { items: [] } as SkillsData
      break
    case 'projects':
      data = { items: [] } as ProjectsData
      break
    case 'social':
      data = { items: [] } as SocialData
      break
    case 'services':
      data = { items: [] } as ServicesData
      break
    case 'experience':
      data = { items: [] } as ExperienceData
      break
    case 'education':
      data = { items: [] } as EducationData
      break
    case 'testimonials':
      data = { items: [] } as TestimonialsData
      break
    case 'certifications':
      data = { items: [] } as CertificationsData
      break
  }

  return {
    id: `section_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    title: meta.label,
    collapsed: type !== 'info',
    data,
  }
}
