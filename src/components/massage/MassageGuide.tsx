'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MassagePart, SessionFeedback } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { getMassageGuide } from '@/lib/data/massage-data'
import { StepIndicator } from './StepIndicator'
import { getMassageAudioPath } from '@/lib/audio/audio-paths'
import { useStepAudio } from '@/hooks/useStepAudio'
import { Play, Pause } from 'lucide-react'

interface MassageGuideProps {
  part: MassagePart
  onComplete: (feedback: SessionFeedback) => void
  onBackToSelection: () => void
}

const AUTO_ADVANCE_DELAY_MS = 2000

const moodOptions = [
  { value: 'energized' as const, emoji: '⚡', label: '元気' },
  { value: 'relaxed' as const, emoji: '😌', label: 'リラックス' },
  { value: 'calm' as const, emoji: '🧘', label: '穏やか' },
  { value: 'refreshed' as const, emoji: '✨', label: 'すっきり' }
]

export function MassageGuide({ part, onComplete, onBackToSelection }: MassageGuideProps) {
  const guide = useMemo(() => getMassageGuide(part), [part])
  const totalSteps = guide.steps.length
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [rating, setRating] = useState<number>(3)
  const [mood, setMood] = useState<SessionFeedback['mood'] | null>(null)
  const [startedAt, setStartedAt] = useState<Date | null>(null)
  const [autoPlayAudio, setAutoPlayAudio] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastRequestedStepRef = useRef<number | null>(null)
  const handleAudioEndedRef = useRef<(stepIndex: number) => void>(() => {})

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current)
      autoAdvanceTimer.current = null
    }
  }, [])

  const getAudioSrc = useCallback(
    (stepIndex: number) => getMassageAudioPath(part, stepIndex),
    [part]
  )

  const { isSupported: isAudioSupported, play, pause, stop } = useStepAudio({
    getAudioSrc,
    onEnded: (stepIndex) => {
      handleAudioEndedRef.current(stepIndex)
    }
  })

  const playStep = useCallback(
    (stepIndex: number, updateStep = false) => {
      clearAutoAdvance()
      lastRequestedStepRef.current = stepIndex
      if (updateStep) {
        setCurrentStep(stepIndex)
      }
      void play(stepIndex)
    },
    [clearAutoAdvance, play]
  )

  const resetSession = useCallback(() => {
    clearAutoAdvance()
    stop()
    setIsCompleted(false)
    setCurrentStep(0)
    setStartedAt(null)
    setMood(null)
    setRating(3)
    setAutoPlayAudio(false)
    lastRequestedStepRef.current = null
    setHasStarted(false)
  }, [clearAutoAdvance, stop])

  const restartSession = useCallback(() => {
    const now = new Date()
    setStartedAt(now)
    setIsCompleted(false)
    setMood(null)
    setRating(3)
    setAutoPlayAudio(true)
    setHasStarted(true)
    playStep(0, true)
  }, [playStep])

  useEffect(() => {
    handleAudioEndedRef.current = (stepIndex: number) => {
      const advance = () => {
        lastRequestedStepRef.current = null

        if (stepIndex < totalSteps - 1) {
          const nextStep = stepIndex + 1
          if (autoPlayAudio) {
            playStep(nextStep, true)
          } else {
            setCurrentStep(nextStep)
          }
        } else {
          setIsCompleted(true)
          setAutoPlayAudio(false)
          setHasStarted(false)
        }
      }

      clearAutoAdvance()

      if (autoPlayAudio && stepIndex < totalSteps - 1) {
        autoAdvanceTimer.current = setTimeout(advance, AUTO_ADVANCE_DELAY_MS)
      } else {
        advance()
      }
    }
    return () => {
      handleAudioEndedRef.current = () => {}
    }
  }, [autoPlayAudio, clearAutoAdvance, playStep, totalSteps])

  useEffect(() => {
    resetSession()
  }, [part, resetSession])

  useEffect(() => {
    return () => {
      clearAutoAdvance()
      stop()
    }
  }, [clearAutoAdvance, stop])

  const handleTogglePlay = useCallback(() => {
    if (autoPlayAudio) {
      clearAutoAdvance()
      pause()
      setAutoPlayAudio(false)
      lastRequestedStepRef.current = null
      return
    }

    if (!startedAt) {
      setStartedAt(new Date())
    }

    setIsCompleted(false)
    lastRequestedStepRef.current = null
    setAutoPlayAudio(true)
    setHasStarted(true)
    playStep(currentStep, true)
  }, [autoPlayAudio, clearAutoAdvance, currentStep, pause, playStep, startedAt])

  const handleStopAudio = useCallback(() => {
    clearAutoAdvance()
    stop()
    setAutoPlayAudio(false)
    lastRequestedStepRef.current = null
  }, [clearAutoAdvance, stop])

  const handleExitToSelection = useCallback(() => {
    handleStopAudio()
    onBackToSelection()
  }, [handleStopAudio, onBackToSelection])

  const submitFeedback = useCallback(() => {
    if (!mood) return

    const endTime = new Date()
    const durationSeconds = startedAt
      ? Math.max(1, Math.floor((endTime.getTime() - startedAt.getTime()) / 1000))
      : guide.duration

    onComplete({
      rating,
      mood,
      durationSeconds,
      completedAt: endTime.toISOString()
    })

    setIsCompleted(true)
    handleStopAudio()
  }, [guide.duration, handleStopAudio, mood, onComplete, rating, startedAt])

  if (!isCompleted) {
    const step = guide.steps[currentStep]

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-emerald-800">{guide.name}</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              呼吸を整えながら、痛みがない範囲で進めましょう。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              hasStarted={hasStarted}
              isCompleted={isCompleted}
            />

            <div className="rounded-2xl border-2 border-emerald-200 bg-white/95 p-6 shadow-sm">
              <p className="text-xl font-semibold leading-relaxed text-gray-900 md:text-2xl">
                {step.instruction}
              </p>
            </div>

            {isAudioSupported ? (
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleTogglePlay}
                >
                  {autoPlayAudio ? (
                    <>
                      <Pause className="size-4" />
                      一時停止
                    </>
                  ) : (
                    <>
                      <Play className="size-4" />
                      スタート
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <span className="text-xs text-gray-500">
                このブラウザでは音声ガイドが利用できません。
              </span>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
              <span>痛みが出たら動きを止め、深呼吸でリセット。</span>
              <span>めまいやしびれを感じたら休憩してください。</span>
            </div>

            <div className="flex justify-end">
              <Button variant="ghost" className="text-sm text-gray-500" onClick={handleExitToSelection}>
                中断して一覧に戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200 bg-emerald-50">
        <CardHeader className="text-center space-y-3">
          <div className="text-6xl">👏</div>
          <CardTitle className="text-2xl text-emerald-800">
            {guide.name}お疲れさまでした！
          </CardTitle>
          <CardDescription className="text-emerald-700">
            やさしく身体をいたわる時間、しっかり取れましたか？
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>セッションのフィードバック</CardTitle>
          <CardDescription>
            次のセルフケアの質を高めるために、感じたことを教えてください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">満足度（1〜5）</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <Slider
                  aria-label="満足度"
                  min={1}
                  max={5}
                  step={1}
                  value={[rating]}
                  onValueChange={(value) => {
                    const nextValue = value[0]
                    if (typeof nextValue === 'number') {
                      setRating(nextValue)
                    }
                  }}
                />
                <span className="text-lg font-semibold text-emerald-700">{rating}</span>
              </div>
              <p className="text-sm text-gray-500">1 いまいち 〜 5 最高</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">いまの気分</label>
            <div className="grid grid-cols-2 gap-3">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition ${
                    mood === option.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-600'
                  }`}
                  onClick={() => setMood(option.value)}
                >
                  <span className="text-lg">{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={restartSession}>
              もう一度やる
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={submitFeedback}
              disabled={!mood}
            >
              記録する
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="ghost" className="text-sm text-gray-500" onClick={onBackToSelection}>
          部位一覧に戻る
        </Button>
      </div>
    </div>
  )
}
