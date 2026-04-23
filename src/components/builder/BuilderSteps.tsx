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
    <div className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory">
      {STEP_ORDER.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = step === currentStep

        return (
          <div key={step} className="flex items-center gap-2 snap-start">
            {/* Step circle */}
            <button
              onClick={() => onStepClick(step)}
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition
                ${isCompleted ? 'bg-teal-600 text-white' : ''}
                ${isCurrent ? 'bg-teal-500/20 text-teal-400 border-2 border-teal-500' : ''}
                ${!isCompleted && !isCurrent ? 'bg-stone-800 text-stone-500' : ''}
              `}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
            </button>

            {/* Label */}
            <span
              onClick={() => onStepClick(step)}
              className={`
                text-sm cursor-pointer hidden sm:block
                ${isCurrent ? 'text-white font-medium' : 'text-stone-500'}
                ${isCompleted ? 'text-stone-400' : ''}
              `}
            >
              {STEP_LABELS[step]}
            </span>

            {/* Arrow */}
            {index < STEP_ORDER.length - 1 && (
              <div className={`w-8 h-px ${index < currentIndex ? 'bg-teal-600' : 'bg-stone-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
