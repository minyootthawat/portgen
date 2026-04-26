'use client'

import { useState, useEffect } from 'react'
import { X, Code, Save, Loader2 } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import type { Portfolio } from '@/types'

// This is a simplified JSX template editor
// In production, you'd want a proper code editor like Monaco or CodeMirror

const BASE_TEMPLATE = (portfolio: Partial<Portfolio>) => `
import React from 'react'

export default function Portfolio() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#f1f5f9',
      fontFamily: 'system-ui, sans-serif',
      padding: '4rem 2rem'
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        ${portfolio.avatar_url ? `
        <img
          src="${portfolio.avatar_url}"
          alt="${portfolio.name}"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            marginBottom: '1.5rem',
            objectFit: 'cover'
          }}
        />
        ` : `
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          margin: '0 auto 1.5rem'
        }} />
        `}
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          ${portfolio.name || 'Your Name'}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
          ${portfolio.tagline || 'Your tagline here'}
        </p>
      </header>

      {/* About */}
      ${portfolio.about ? `
      <section style={{ maxWidth: '700px', margin: '0 auto 4rem', textAlign: 'center' }}>
        <p style={{ color: '#cbd5e1', lineHeight: '1.75' }}>
          ${portfolio.about}
        </p>
      </section>
      ` : ''}

      {/* Skills */}
      ${(portfolio.skills?.length ?? 0) > 0 ? `
      <section style={{ maxWidth: '700px', margin: '0 auto 4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '1.5rem', textAlign: 'center' }}>
          Skills
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          ${portfolio.skills?.map(skill => `
          <span style={{
            padding: '0.5rem 1rem',
            background: 'rgba(56, 189, 248, 0.1)',
            color: '#38bdf8',
            borderRadius: '9999px',
            fontSize: '0.875rem'
          }}>
            ${skill.name}
          </span>
          `).join('')}
        </div>
      </section>
      ` : ''}

      {/* Projects */}
      ${(portfolio.projects?.length ?? 0) > 0 ? `
      <section style={{ maxWidth: '900px', margin: '0 auto 4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', marginBottom: '2rem', textAlign: 'center' }}>
          Projects
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          ${portfolio.projects?.map(project => `
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(51, 65, 85, 0.5)'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'semibold', marginBottom: '0.5rem' }}>
              ${project.title || 'Project Title'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
              ${project.description || 'Project description'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              ${(project.tags || []).map(tag => `
              <span style={{
                padding: '0.25rem 0.5rem',
                background: 'rgba(51, 65, 85, 0.5)',
                borderRadius: '4px',
                fontSize: '0.75rem'
              }}>
                ${tag}
              </span>
              `).join('')}
            </div>
            ${project.live_url ? `
            <a href="${project.live_url}" target="_blank" rel="noopener noreferrer"
              style={{ color: '#38bdf8', fontSize: '0.875rem' }}>
              Live Demo →
            </a>
            ` : ''}
          </div>
          `).join('')}
        </div>
      </section>
      ` : ''}

      {/* Social Links */}
      ${(portfolio.social_links?.length ?? 0) > 0 ? `
      <footer style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          ${portfolio.social_links?.map(link => `
          <a
            href="${link.url}"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '8px',
              color: '#e2e8f0',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            ${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
          </a>
          `).join('')}
        </div>
        <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2rem' }}>
          Built with PortGen
        </p>
      </footer>
      ` : ''}
    </div>
  )
}
`.trim()

interface Props {
  portfolio: Partial<Portfolio>
  onChange: (updated: Partial<Portfolio>) => void
  onClose: () => void
}

export function JSXEditor({ portfolio, onChange, onClose }: Props) {
  const { t } = useI18n()
  const [code, setCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Initialize with current template
    const template = localStorage.getItem(`portfolio-jsx-${portfolio.id}`) || BASE_TEMPLATE(portfolio)
    setCode(template)
  }, [portfolio.id])

  const handleSave = () => {
    setSaving(true)
    setError('')
    try {
      // Validate JSX by checking basic syntax
      if (!code.includes('export default')) {
        throw new Error('JSX must have an export default function')
      }
      if (!code.includes('Portfolio')) {
        throw new Error('Component name must be "Portfolio"')
      }

      // Store in theme_config for later export
      onChange({
        theme_config: {
          ...portfolio.theme_config,
          custom_jsx: code,
        },
      })
      localStorage.setItem(`portfolio-jsx-${portfolio.id}`, code)
      alert(t.builder.jsxSaved)
    } catch (err: any) {
      setError(err.message)
    }
    setSaving(false)
  }

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-medium">JSX Editor</span>
          <span className="text-xs text-slate-500"> — Edit your portfolio code directly</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 transition text-sm"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-slate-950 text-slate-300 p-4 font-mono text-sm resize-none focus:outline-none"
          spellCheck={false}
          style={{ lineHeight: '1.6' }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Help */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/50">
        <p className="text-xs text-slate-500">
          💡 Edit the JSX to customize your portfolio. Use {'{'}props{'}'} to access portfolio data.
          When you're done, save and use "Export HTML" to generate a static file.
        </p>
      </div>
    </div>
  )
}
