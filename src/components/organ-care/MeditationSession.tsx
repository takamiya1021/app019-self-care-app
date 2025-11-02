'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { OrganType, SessionFeedback } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { getOrganCareGuide } from '@/lib/data/organ-care-data'
import { getOrganAudioPath } from '@/lib/audio/audio-paths'
import { useStepAudio } from '@/hooks/useStepAudio'
import { Play, Pause, Square } from 'lucide-react'
import { StepIndicator } from '../massage/StepIndicator'

interface MeditationSessionProps {
  organ: OrganType
  onComplete: (feedback: SessionFeedback) => void
  onExit: () => void
}

export function MeditationSession({ organ, onComplete, onExit }: MeditationSessionProps) {
  const guide = useMemo(() => getOrganCareGuide(organ), [organ])
  const totalSteps = guide.audioScript.length
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [rating, setRating] = useState<number>(3)
  const [mood, setMood] = useState<SessionFeedback['mood'] | null>(null)
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
    (stepIndex: number) => getOrganAudioPath(organ, stepIndex),
    [organ]
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
          setHasStarted(false) // セッション完了時にリセット
        }
      }

      clearAutoAdvance()

      if (autoPlayAudio && stepIndex < totalSteps - 1) {
        autoAdvanceTimer.current = setTimeout(advance, 2000)
      } else {
        advance()
      }
    }
  }, [autoPlayAudio, clearAutoAdvance, playStep, totalSteps])

  const startSession = useCallback(() => {
    clearAutoAdvance()
    stop()
    setIsCompleted(false)
    setCurrentStep(0)
    setStartTime(new Date())
    setMood(null)
    setRating(3)
    lastRequestedStepRef.current = null
    setAutoPlayAudio(true)
    setHasStarted(true) // 開始
    playStep(0, true) // ステップも更新
  }, [clearAutoAdvance, playStep, stop])

  useEffect(() => {
    return () => {
      clearAutoAdvance()
      stop()
    }
  }, [clearAutoAdvance, stop])

  const handleStopSession = useCallback(() => {
    clearAutoAdvance()
    stop()
    setCurrentStep(0)
    setStartTime(null)
    setAutoPlayAudio(false)
    setIsCompleted(false)
    setHasStarted(false) // 停止
    lastRequestedStepRef.current = null
  }, [clearAutoAdvance, stop])

  const handleExitToList = useCallback(() => {
    handleStopSession()
    onExit()
  }, [handleStopSession, onExit])

  const handleTogglePlay = useCallback(() => {
    if (autoPlayAudio) {
      clearAutoAdvance()
      pause()
      setAutoPlayAudio(false)
      lastRequestedStepRef.current = null
      return
    }

    if (!startTime) {
      setStartTime(new Date())
    }
    setIsCompleted(false)
    lastRequestedStepRef.current = null
    setAutoPlayAudio(true)
    setHasStarted(true) // 開始
    playStep(currentStep, true) // ステップも更新
  }, [autoPlayAudio, clearAutoAdvance, currentStep, hasStarted, pause, playStep, startTime])

  const handleStopAudio = useCallback(() => {
    clearAutoAdvance()
    stop()
    setAutoPlayAudio(false)
    setHasStarted(false) // 停止
    lastRequestedStepRef.current = null
  }, [clearAutoAdvance, stop])

  const submitFeedback = useCallback(() => {
    if (!mood || !startTime) return

    const endTime = new Date()
    const durationSeconds = Math.max(
      1,
      Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    )

    onComplete({
      rating,
      mood,
      comment: undefined,
      durationSeconds,
      completedAt: endTime.toISOString()
    })

    clearAutoAdvance()
    stop()
    setStartTime(null)
    setIsCompleted(false)
    setCurrentStep(0)
    setMood(null)
    setRating(3)
    setHasStarted(false) // 送信後リセット
  }, [clearAutoAdvance, mood, onComplete, rating, startTime, stop])

  useEffect(() => {
    if (!autoPlayAudio) {
      clearAutoAdvance()
    }
  }, [autoPlayAudio, clearAutoAdvance])

  const organEmojis: Record<OrganType, string> = {
    kidney: '🫘',
    liver: '🫁',
    stomach: '🫄',
    pancreas: '🔸',
    intestine: '🌀'
  }

  const moodOptions = [
    { value: 'energized' as const, emoji: '⚡', label: '元気' },
    { value: 'relaxed' as const, emoji: '😌', label: 'リラックス' },
    { value: 'calm' as const, emoji: '🧘', label: '穏やか' },
    { value: 'refreshed' as const, emoji: '✨', label: 'すっきり' }
  ]

  if (isCompleted) {
    return (
      <div className="space-y-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="text-6xl mb-3">🎉</div>
            <CardTitle className="text-2xl text-green-800">
              {guide.name}完了！
            </CardTitle>
            <p className="text-green-700">
              素晴らしい！自分を大切にする時間を作れましたね。
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>セッションのフィードバック</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">満足度（1-5）</label>
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
                  <span className="text-lg font-semibold text-green-700">{rating}</span>
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
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-600'
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
              <Button variant="outline" onClick={startSession}>
                もう一度行う
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={submitFeedback}
                disabled={!mood}
              >
                記録する
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-right">
          <Button variant="ghost" className="text-sm text-gray-500" onClick={handleExitToList}>
            臓器一覧に戻る
          </Button>
        </div>
      </div>
    )
  }

  const currentScript = guide.audioScript[currentStep]

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex-grow">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                hasStarted={hasStarted}
                isCompleted={isCompleted}
              />
            </div>
            <Badge variant="outline" className="ml-4 text-xs text-indigo-700 border-indigo-200 bg-indigo-50/70">
              {organEmojis[organ]}
            </Badge>
          </div>

          <div className="rounded-2xl border-2 border-indigo-200 bg-white/95 p-6 shadow-sm">
            <p className="text-xl font-semibold leading-relaxed text-gray-900 md:text-2xl">
              {currentScript}
            </p>
          </div>

          {isAudioSupported ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="default"
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700"
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

          <div className="flex justify-end">
            <Button variant="ghost" className="text-sm text-gray-500" onClick={handleStopSession}>
              中断して最初からやり直す
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-right">
        <Button variant="ghost" className="text-sm text-gray-500" onClick={handleExitToList}>
          臓器一覧に戻る
        </Button>
      </div>
    </div>
  )
}
