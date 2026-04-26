'use client'

import type { Portfolio } from '@/types'

interface Props {
  portfolio: Partial<Portfolio>
}

export function PortfolioPreview({ portfolio }: Props) {
  return (
    <div className="h-full flex flex-col bg-stone-100 dark:bg-slate-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-sm text-stone-500 dark:text-slate-400">Live Preview</span>
        <span className="text-xs text-stone-400 dark:text-slate-500">{portfolio.subdomain || 'yourname'}.portgen.com</span>
      </div>

      {/* Preview iframe */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-xl mx-auto">
          {/* Simulated portfolio preview */}
          <div className="rounded-xl overflow-hidden border border-slate-700 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950">
            {/* Browser bar */}
            <div className="px-4 py-2 bg-slate-800/50 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-slate-700/50 rounded px-3 py-0.5 text-xs text-slate-400 text-center">
                  {portfolio.subdomain || 'yourname'}.portgen.com
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 min-h-[400px]">
              {/* Avatar */}
              <div className="text-center mb-6">
                {portfolio.avatar_url ? (
                  <img
                    src={portfolio.avatar_url}
                    alt={portfolio.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-sky-400 to-indigo-500" />
                )}
                <h1 className="text-2xl font-bold text-white mb-1">
                  {portfolio.name || 'Your Name'}
                </h1>
                <p className="text-slate-400 text-sm">
                  {portfolio.tagline || 'Your tagline here'}
                </p>
              </div>

              {/* About */}
              {portfolio.about && (
                <div className="text-center mb-6 px-4">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {portfolio.about.length > 100
                      ? portfolio.about.slice(0, 100) + '...'
                      : portfolio.about}
                  </p>
                </div>
              )}

              {/* Skills */}
              {(portfolio.skills?.length ?? 0) > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap justify-center gap-2">
                    {(portfolio.skills || []).slice(0, 6).map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {(portfolio.skills?.length ?? 0) > 6 && (
                      <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-400 text-xs">
                        +{(portfolio.skills?.length ?? 0) - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Projects */}
              {(portfolio.projects?.length ?? 0) > 0 && (
                <div className="space-y-3 mb-6">
                  {(portfolio.projects || []).slice(0, 2).map((project) => (
                    <div
                      key={project.id}
                      className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
                    >
                      <h3 className="text-sm font-medium text-white mb-1">
                        {project.title || 'Project Title'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {project.description?.slice(0, 60) || 'Project description'}
                        {(project.description?.length ?? 0) > 60 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Social links */}
              {(portfolio.social_links?.length ?? 0) > 0 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {(portfolio.social_links || []).slice(0, 4).map((link) => (
                    <span
                      key={link.id}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs capitalize"
                    >
                      {link.platform}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-slate-800/30 text-center">
              <span className="text-xs text-slate-600">Built with PortGen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
