'use client'

import { useState, useEffect, useCallback } from 'react'
import { OrganType, SessionFeedback } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'
import { getOrganCareGuide } from '@/lib/data/organ-care-data'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react'

interface MeditationSessionProps {
  organ: OrganType
  onComplete: (feedback: SessionFeedback) => void
  onExit: () => void
}

export function MeditationSession({ organ, onComplete, onExit }: MeditationSessionProps) {
  const guide = getOrganCareGuide(organ)
  const [currentStep, setCurrentStep] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [mood, setMood] = useState<SessionFeedback['mood'] | null>(null)

  const { speak, speakSequence, stop, pause, resume, isPlaying, isSupported } = useSpeechSynthesis({
    voiceSettings: {
      rate: 0.8,
      pitch: 1.0,
      volume: 0.9
    }
  })

  const progress = (currentStep / guide.audioScript.length) * 100

  // セッション開始
  const startSession = useCallback(async () => {
    setIsStarted(true)
    setStartTime(new Date())
    setCurrentStep(0)

    try {
      await speakSequence(
        guide.audioScript,
        { rate: 0.8, pitch: 1.0, volume: 0.9 },
        (index, total) => {
          setCurrentStep(index + 1)
          if (index >= total) {
            setIsCompleted(true)
            setIsStarted(false)
          }
        }
      )
    } catch (error) {
      console.error('音声ガイドエラー:', error)
    }
  }, [guide.audioScript, speakSequence])

  // 音声コントロール
  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else if (isStarted) {
      resume()
    } else {
      startSession()
    }
  }

  const handleStop = () => {
    stop()
    setIsStarted(false)
    setCurrentStep(0)
  }

  const handleSkipForward = async () => {
    if (currentStep < guide.audioScript.length) {
      stop()
      const nextStep = Math.min(currentStep + 1, guide.audioScript.length - 1)
      setCurrentStep(nextStep)
      try {
        await speak(guide.audioScript[nextStep])
      } catch (error) {
        console.error('音声再生エラー:', error)
      }
    }
  }

  const handleSkipBack = async () => {
    if (currentStep > 0) {
      stop()
      const prevStep = Math.max(currentStep - 1, 0)
      setCurrentStep(prevStep)
      try {
        await speak(guide.audioScript[prevStep])
      } catch (error) {
        console.error('音声再生エラー:', error)
      }
    }
  }

  // フィードバック送信
  const submitFeedback = () => {
    if (rating > 0 && mood && startTime) {
      const duration = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      onComplete({
        rating,
        mood,
        comment: undefined
      })
    }
  }

  // クリーンアップ
  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

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
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎉</div>
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
            <CardTitle>セッションの感想をお聞かせください</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 満足度評価 */}
            <div>
              <label className="block text-sm font-medium mb-3">満足度（1-5）</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    variant={rating === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRating(value)}
                    className="w-12 h-12"
                  >
                    {'⭐'.repeat(value)}
                  </Button>
                ))}
              </div>
            </div>

            {/* 気分選択 */}
            <div>
              <label className="block text-sm font-medium mb-3">今の気分は？</label>
              <div className="grid grid-cols-2 gap-3">
                {moodOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={mood === option.value ? 'default' : 'outline'}
                    onClick={() => setMood(option.value)}
                    className="h-16 flex flex-col space-y-1"
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-sm">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex space-x-3">
              <Button
                onClick={submitFeedback}
                disabled={rating === 0 || !mood}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                完了
              </Button>
              <Button variant="outline" onClick={onExit}>
                スキップ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{organEmojis[organ]}</span>
              <div>
                <CardTitle className="text-xl">{guide.name}</CardTitle>
                <p className="text-gray-600">{guide.description}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onExit}>
              終了
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 進捗表示 */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">進捗</span>
              <span className="text-sm text-gray-600">
                {currentStep} / {guide.audioScript.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* 手の位置ガイド */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>👋</span>
            <span>手の位置</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800">{guide.position}</p>
        </CardContent>
      </Card>

      {/* 音声コントロール */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkipBack}
              disabled={currentStep === 0 || !isStarted}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              size="lg"
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700"
              disabled={!isSupported}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSkipForward}
              disabled={currentStep >= guide.audioScript.length - 1 || !isStarted}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {!isSupported && (
            <div className="text-center mt-4">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <VolumeX className="w-4 h-4 mr-1" />
                音声ガイドが利用できません
              </Badge>
            </div>
          )}

          {isStarted && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={handleStop}>
                停止
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 現在のガイドテキスト */}
      {isStarted && currentStep > 0 && (
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="pt-6">
            <p className="text-indigo-800 text-center font-medium">
              {guide.audioScript[currentStep - 1]}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 期待効果 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">期待できる効果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {guide.benefits.map((benefit, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {benefit}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}