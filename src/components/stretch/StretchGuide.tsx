'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StretchTarget, SessionFeedback } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { getStretchGuide } from '@/lib/data/stretch-data'
import { StepIndicator } from '../massage/StepIndicator'
import { Play, Pause } from 'lucide-react'
import { useStepAudio } from '@/hooks/useStepAudio'
import { getStretchAudioPath } from '@/lib/audio/audio-paths'

interface StretchGuideProps {
  target: StretchTarget
  onComplete: (feedback: SessionFeedback) => void
  onBackToSelection: () => void
}

const moodOptions = [
  { value: 'energized' as const, emoji: '⚡', label: '元気' },
  { value: 'relaxed' as const, emoji: '😌', label: 'リラックス' },
  { value: 'calm' as const, emoji: '🧘', label: '穏やか' },
  { value: 'refreshed' as const, emoji: '✨', label: 'すっきり' }
]

export function StretchGuide({ target, onComplete, onBackToSelection }: StretchGuideProps) {
  const guide = useMemo(() => getStretchGuide(target), [target])
  const totalSteps = guide.exercises.length

  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [rating, setRating] = useState<number>(3)
  const [mood, setMood] = useState<SessionFeedback['mood'] | null>(null)
  const [startedAt, setStartedAt] = useState<Date | null>(null)
  const [autoPlay, setAutoPlay] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current)
      stepTimeoutRef.current = null
    }
  }, [])

  const advanceStep = useCallback(() => {
    clearTimers()
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsCompleted(true)
      setAutoPlay(false)
      setHasStarted(false)
    }
  }, [clearTimers, currentStep, totalSteps])

  const { isSupported: isAudioSupported, play, pause, stop } = useStepAudio({
    getAudioSrc: useCallback(
      (stepIndex: number) => getStretchAudioPath(target, stepIndex),
      [target]
    ),
    onEnded: useCallback((stepIndex: number) => {
      // 音声が終了したら、タイマーを開始する
      if (!autoPlay) return // autoPlayがfalseなら、一時停止中なのでタイマーは開始しない

      const stepDuration = guide.exercises[stepIndex].duration
      setTimeLeft(stepDuration)

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1))
      }, 1000)

      stepTimeoutRef.current = setTimeout(() => {
        advanceStep()
      }, stepDuration * 1000)
    }, [autoPlay, guide.exercises, advanceStep])
  })

  useEffect(() => {
    // autoPlayがtrueで、セッションが完了していなければ、音声を再生
    // currentStepが変更されたときも、このuseEffectがトリガーされ、次のステップの音声が再生される
    if (autoPlay && !isCompleted) {
      play(currentStep)
    } else {
      // autoPlayがfalseになったら、音声とタイマーを停止
      pause()
      clearTimers()
    }
    // クリーンアップ関数: コンポーネントアンマウント時や依存配列変更時に呼ばれる
    return () => {
      pause()
      clearTimers()
    }
  }, [autoPlay, currentStep, isCompleted, play, pause, clearTimers])

  const resetSession = useCallback(() => {
    clearTimers()
    stop()
    setIsCompleted(false)
    setCurrentStep(0)
    setStartedAt(null)
    setMood(null)
    setRating(3)
    setAutoPlay(false)
    setHasStarted(false)
    setTimeLeft(0)
  }, [clearTimers, stop])

  const restartSession = useCallback(() => {
    resetSession()
    setStartedAt(new Date())
    setHasStarted(true)
    setAutoPlay(true)
  }, [resetSession])

  useEffect(() => {
    resetSession()
  }, [target, resetSession])

  const handleTogglePlay = useCallback(() => {
    if (autoPlay) {
      // 再生中なら一時停止
      setAutoPlay(false) // useEffectがpause()とclearTimers()を呼ぶ
    } else {
      // 停止中なら開始・再開
      if (!startedAt) {
        setStartedAt(new Date())
      }
      setHasStarted(true)
      setAutoPlay(true) // useEffectがplay(currentStep)を呼ぶ
    }
  }, [autoPlay, startedAt])

  const handleExitToSelection = useCallback(() => {
    resetSession()
    onBackToSelection()
  }, [resetSession, onBackToSelection])

  const submitFeedback = useCallback(() => {
    if (!mood) return

    const endTime = new Date()
    const durationSeconds = startedAt
      ? Math.max(1, Math.floor((endTime.getTime() - startedAt.getTime()) / 1000))
      : guide.totalDuration

    onComplete({
      rating,
      mood,
      durationSeconds,
      completedAt: endTime.toISOString()
    })

    setIsCompleted(true)
    resetSession()
  }, [guide.totalDuration, mood, onComplete, rating, startedAt, resetSession])

  if (!isCompleted) {
    const step = guide.exercises[currentStep]

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-amber-800">{guide.name}</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              呼吸を止めずに、ゆっくりと体を伸ばしましょう。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              hasStarted={hasStarted}
              isCompleted={isCompleted}
            />

            <div className="rounded-2xl border-2 border-amber-200 bg-white/95 p-6 shadow-sm text-center">
              <p className="text-xl font-semibold leading-relaxed text-gray-900 md:text-2xl">
                {step.instruction}
              </p>
              <div className="mt-4 text-6xl font-bold text-amber-600">
                {timeLeft > 0 ? timeLeft : step.duration}
                <span className="text-2xl ml-2">秒</span>
              </div>
            </div>

            {isAudioSupported ? (
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 w-28"
                  onClick={handleTogglePlay}
                >
                  {autoPlay ? (
                    <>
                      <Pause className="size-4 mr-2" />
                      一時停止
                    </>
                  ) : (
                    <>
                      <Play className="size-4 mr-2" />
                      {hasStarted ? '再開' : 'スタート'}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500">
                音声ガイドは利用できませんが、タイマーは動作します。
              </div>
            )}

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
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="text-center space-y-3">
          <div className="text-6xl">🎉</div>
          <CardTitle className="text-2xl text-amber-800">
            {guide.name} お疲れさまでした！
          </CardTitle>
          <CardDescription className="text-amber-700">
            体がすっきりしましたね！この調子で続けましょう。
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
                <span className="text-lg font-semibold text-amber-700">{rating}</span>
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
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-600'
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
              className="bg-amber-600 hover:bg-amber-700"
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