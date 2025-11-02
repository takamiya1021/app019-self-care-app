'use client'

import { Progress } from '@/components/ui/progress'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  hasStarted?: boolean
  isCompleted?: boolean
}

export function StepIndicator({ currentStep, totalSteps, hasStarted = false, isCompleted = false }: StepIndicatorProps) {
  const effectiveStep = isCompleted
    ? totalSteps
    : hasStarted
      ? Math.min(currentStep + 1, totalSteps)
      : 0

  const progressValue = totalSteps > 0 ? (effectiveStep / totalSteps) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>ステップ {effectiveStep} / {totalSteps}</span>
        <span>{Math.round(progressValue)}%</span>
      </div>
      <Progress value={progressValue} />
    </div>
  )
}
