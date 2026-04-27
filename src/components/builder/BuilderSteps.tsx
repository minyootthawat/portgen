'use client'

import { Check } from 'lucide-react'
import type { BuilderStep } from '@/types'

const STEP_ORDER: BuilderStep[] = ['info', 'skills', 'projects', 'social', 'theme', 'preview']

const STEP_LABELS: Record<BuilderStep, string> = {
  info: 'ข้อมูล',
  skills: 'ทักษะ',
  projects: 'โปรเจกต์',
  social: 'โซเชียล',
  sections: 'เซคชัน',
  theme: 'ธีม',
  preview: 'ตัวอย่าง',
}

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
                ${isCurrent ? 'bg-teal-500/20 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-2 border-teal-500 dark:border-teal-400' : ''}
                ${!isCompleted && !isCurrent ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500' : ''}
              `}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
            </button>

            {/* Label */}
            <span
              onClick={() => onStepClick(step)}
              className={`
                text-sm cursor-pointer hidden sm:block
                ${isCurrent ? 'text-stone-900 dark:text-white font-medium' : 'text-stone-400 dark:text-stone-500'}
                ${isCompleted ? 'text-stone-500 dark:text-stone-400' : ''}
              `}
            >
              {STEP_LABELS[step]}
            </span>

            {/* Arrow */}
            {index < STEP_ORDER.length - 1 && (
              <div className={`w-6 sm:w-8 h-px hidden sm:block ${index < currentIndex ? 'bg-teal-600' : 'bg-stone-300 dark:bg-stone-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
