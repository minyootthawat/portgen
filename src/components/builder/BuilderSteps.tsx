'use client'

import { Check } from 'lucide-react'
import type { BuilderStep } from '@/types'

const STEP_LABELS: Record<BuilderStep, string> = {
  info: 'Info',
  skills: 'Skills',
  projects: 'Projects',
  social: 'Social',
  theme: 'Theme',
  preview: 'Preview',
}

const STEP_ORDER: BuilderStep[] = ['info', 'skills', 'projects', 'social', 'theme', 'preview']

interface Props {
  currentStep: BuilderStep
  onStepClick: (step: BuilderStep) => void
}

export function BuilderSteps({ currentStep, onStepClick }: Props) {
  const currentIndex = STEP_ORDER.indexOf(currentStep)

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {STEP_ORDER.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = step === currentStep

        return (
          <div key={step} className="flex items-center gap-2">
            {/* Step circle */}
            <button
              onClick={() => onStepClick(step)}
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition
                ${isCompleted ? 'bg-sky-500 text-white' : ''}
                ${isCurrent ? 'bg-sky-500/20 text-sky-400 border-2 border-sky-500' : ''}
                ${!isCompleted && !isCurrent ? 'bg-slate-800 text-slate-500' : ''}
              `}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
            </button>

            {/* Label */}
            <span
              onClick={() => onStepClick(step)}
              className={`
                text-sm cursor-pointer hidden sm:block
                ${isCurrent ? 'text-white font-medium' : 'text-slate-500'}
                ${isCompleted ? 'text-slate-400' : ''}
              `}
            >
              {STEP_LABELS[step]}
            </span>

            {/* Arrow */}
            {index < STEP_ORDER.length - 1 && (
              <div className={`w-8 h-px ${index < currentIndex ? 'bg-sky-500' : 'bg-slate-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
