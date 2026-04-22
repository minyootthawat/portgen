import { create } from 'zustand'
import type { BuilderState, Portfolio, BuilderStep } from '@/types'

interface BuilderStore extends BuilderState {
  // Actions
  setStep: (step: BuilderStep) => void
  updatePortfolio: (updates: Partial<Portfolio>) => void
  setSaving: (isSaving: boolean) => void
  setGenerating: (isGenerating: boolean) => void
  setPreviewUrl: (url: string | undefined) => void
  reset: () => void

  // Portfolio data helpers
  addSkill: (skill: Portfolio['skills'][0]) => void
  removeSkill: (id: string) => void
  addProject: (project: Portfolio['projects'][0]) => void
  updateProject: (id: string, updates: Partial<Portfolio['projects'][0]>) => void
  removeProject: (id: string) => void
  addSocialLink: (link: Portfolio['social_links'][0]) => void
  removeSocialLink: (id: string) => void
}

const initialState: BuilderState = {
  step: 'info',
  portfolio: {
    name: '',
    tagline: '',
    about: '',
    avatar_url: '',
    skills: [],
    projects: [],
    social_links: [],
    theme: 'gradient-dark',
    theme_config: {},
    is_published: false,
  },
  isSaving: false,
  isGenerating: false,
  previewUrl: undefined,
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  updatePortfolio: (updates) =>
    set((state) => ({
      portfolio: { ...state.portfolio, ...updates },
    })),

  setSaving: (isSaving) => set({ isSaving }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setPreviewUrl: (previewUrl) => set({ previewUrl }),

  reset: () => set(initialState),

  addSkill: (skill) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        skills: [...(state.portfolio.skills || []), skill],
      },
    })),

  removeSkill: (id) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        skills: (state.portfolio.skills || []).filter((s) => s.id !== id),
      },
    })),

  addProject: (project) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        projects: [...(state.portfolio.projects || []), project],
      },
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        projects: (state.portfolio.projects || []).map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        projects: (state.portfolio.projects || []).filter((p) => p.id !== id),
      },
    })),

  addSocialLink: (link) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        social_links: [...(state.portfolio.social_links || []), link],
      },
    })),

  removeSocialLink: (id) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        social_links: (state.portfolio.social_links || []).filter((l) => l.id !== id),
      },
    })),
}))
