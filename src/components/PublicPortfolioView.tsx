'use client'

import type { Portfolio } from '@/types'
import Link from 'next/link'

interface Props {
  portfolio: Partial<Portfolio>
}

const THEME_STYLES: Record<string, { wrapper: string; heading: string; subheading: string; card: string; tag: string }> = {
  'gradient-dark': {
    wrapper: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
    heading: 'text-white',
    subheading: 'text-slate-400',
    card: 'bg-slate-800/50 border-slate-700',
    tag: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  },
  'minimal-light': {
    wrapper: 'bg-white',
    heading: 'text-slate-900',
    subheading: 'text-slate-500',
    card: 'bg-slate-50 border-slate-200',
    tag: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  'brutalist': {
    wrapper: 'bg-yellow-50',
    heading: 'text-black',
    subheading: 'text-yellow-700',
    card: 'bg-white border-2 border-black',
    tag: 'bg-black text-white',
  },
}

export function PublicPortfolioView({ portfolio }: Props) {
  const theme = portfolio.theme || 'gradient-dark'
  const styles = THEME_STYLES[theme] || THEME_STYLES['gradient-dark']

  return (
    <div className={`min-h-screen ${styles.wrapper}`}>
      {/* Header */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition">
            ← PortGen
          </Link>
          <span className="text-xs text-stone-400">สร้าง Portfolio ของคุณ</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Profile */}
        <div className="text-center mb-10">
          {portfolio.avatar_url ? (
            <img
              src={portfolio.avatar_url}
              alt={portfolio.name || 'portfolio'}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white/20 shadow-lg"
            />
          ) : (
            <div className={`w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-3xl font-bold ${styles.heading}`}>
              {(portfolio.name || 'P').charAt(0)}
            </div>
          )}
          <h1 className={`text-3xl font-bold mb-2 ${styles.heading}`}>
            {portfolio.name || 'ไม่ระบุชื่อ'}
          </h1>
          <p className={`text-base ${styles.subheading}`}>
            {portfolio.tagline || ''}
          </p>
        </div>

        {/* About */}
        {portfolio.about && (
          <div className={`text-center mb-10 px-4 ${styles.subheading}`}>
            <p className="leading-relaxed">{portfolio.about}</p>
          </div>
        )}

        {/* Skills */}
        {(portfolio.skills?.length ?? 0) > 0 && (
          <div className="mb-10">
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 text-center ${styles.subheading}`}>
              ทักษะ
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {(portfolio.skills || []).map((skill) => (
                <span
                  key={skill.id}
                  className={`px-4 py-1.5 rounded-full text-sm border ${styles.tag}`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {(portfolio.projects?.length ?? 0) > 0 && (
          <div className="mb-10">
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 text-center ${styles.subheading}`}>
              โปรเจกต์
            </h2>
            <div className="space-y-4">
              {(portfolio.projects || []).map((project) => (
                <div
                  key={project.id}
                  className={`p-5 rounded-xl border ${styles.card}`}
                >
                  <h3 className={`font-semibold mb-1 ${styles.heading}`}>
                    {project.title || 'ไม่ระะบุชื่อ'}
                  </h3>
                  <p className={`text-sm mb-3 ${styles.subheading}`}>
                    {project.description || ''}
                  </p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(project.tags as string[]).map((tag, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded text-xs ${styles.tag}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {(project.live_url || project.repo_url) && (
                    <div className="flex gap-4">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                          → ดูเว็บไซต์
                        </a>
                      )}
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm ${styles.subheading} hover:text-stone-700`}
                        >
                          ⌘ Source
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {(portfolio.social_links?.length ?? 0) > 0 && (
          <div className="mb-10">
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 text-center ${styles.subheading}`}>
              ติดตาม
            </h2>
            <div className="flex justify-center gap-3 flex-wrap">
              {(portfolio.social_links || []).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 rounded-lg text-sm font-medium border capitalize ${styles.card} ${styles.heading} hover:border-teal-400 transition`}
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {(portfolio as any).custom_sections?.length > 0 && (
          <div className="mb-10 space-y-6">
            {(portfolio as any).custom_sections?.map((section: any) => (
              <div key={section.id}>
                <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 text-center ${styles.subheading}`}>
                  {section.title || section.type}
                </h2>
                <div className="space-y-3">
                  {section.items?.map((item: any) => (
                    <div key={item.id} className={`p-4 rounded-xl border ${styles.card}`}>
                      {item.title && (
                        <h3 className={`font-medium mb-1 ${styles.heading}`}>{item.title}</h3>
                      )}
                      {item.description && (
                        <p className={`text-sm ${styles.subheading}`}>{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`text-center py-8 border-t ${styles.card}`}>
        <p className={`text-sm ${styles.subheading}`}>
          สร้างด้วย <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium">PortGen</Link>
        </p>
      </footer>
    </div>
  )
}
