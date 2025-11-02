'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  SelfCareType,
  OrganType,
  MassagePart,
  StretchTarget,
  SessionFeedback,
  SessionSummary
} from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrganSelector } from '@/components/organ-care/OrganSelector'
import { MassageSelector } from '@/components/massage/MassageSelector'
import { MassageGuide } from '@/components/massage/MassageGuide'
import { StretchSelector } from '@/components/stretch/StretchSelector'
import { StretchGuide } from '@/components/stretch/StretchGuide'
import { addSessionRecord, getSessionSummary } from '@/lib/storage/session-storage'

type AppState = 'home' | 'organ-selection' | 'massage-selection' | 'stretch'

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('home')
  const [selectedOrgan, setSelectedOrgan] = useState<OrganType | null>(null)
  const [selectedMassagePart, setSelectedMassagePart] = useState<MassagePart | null>(null)
  const [selectedStretchTarget, setSelectedStretchTarget] = useState<StretchTarget | null>(null)
  const [summary, setSummary] = useState<SessionSummary | null>(null)

  const refreshSummary = useCallback(() => {
    if (typeof window === 'undefined') return
    setSummary(getSessionSummary())
  }, [])

  useEffect(() => {
    refreshSummary()
  }, [refreshSummary])

  const formatWeekday = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map((value) => Number.parseInt(value, 10))
    const date = new Date(year, (month ?? 1) - 1, day ?? 1)
    return date.toLocaleDateString('ja-JP', { weekday: 'short' })
  }

  const formatShortDate = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map((value) => Number.parseInt(value, 10))
    const date = new Date(year, (month ?? 1) - 1, day ?? 1)
    return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
  }

  const formatLastSession = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSelectSelfCareType = (type: SelfCareType) => {
    switch (type) {
      case 'organ-care':
        setSelectedOrgan(null)
        setCurrentState('organ-selection')
        break
      case 'massage':
        setSelectedMassagePart(null)
        setCurrentState('massage-selection')
        break
      case 'stretch':
        setSelectedStretchTarget(null)
        setCurrentState('stretch')
        break
    }
  }

  const handleSelectOrgan = (organ: OrganType) => {
    setSelectedOrgan(organ)
    setCurrentState('organ-selection')
  }

  const handleClearOrganSelection = () => {
    setSelectedOrgan(null)
  }

  const handleSelectMassagePart = (part: MassagePart) => {
    setSelectedMassagePart(part)
    setCurrentState('massage-selection')
  }

  const handleSelectStretchTarget = (target: StretchTarget) => {
    setSelectedStretchTarget(target)
    setCurrentState('stretch')
  }

  const handleOrganCareSessionComplete = (feedback: SessionFeedback) => {
    const targetOrgan = selectedOrgan

    if (targetOrgan) {
      addSessionRecord({
        type: 'organ-care',
        subtype: targetOrgan,
        duration: Math.max(1, feedback.durationSeconds ?? 300),
        completedAt: feedback.completedAt ?? new Date().toISOString(),
        rating: feedback.rating,
        mood: feedback.mood,
        comment: feedback.comment,
        scene: 'custom'
      })
    }

    setCurrentState('home')
    setSelectedOrgan(null)
    refreshSummary()
  }

  const handleMassageSessionComplete = (feedback: SessionFeedback) => {
    const targetPart = selectedMassagePart

    if (targetPart) {
      addSessionRecord({
        type: 'massage',
        subtype: targetPart,
        duration: Math.max(1, feedback.durationSeconds ?? 300),
        completedAt: feedback.completedAt ?? new Date().toISOString(),
        rating: feedback.rating,
        mood: feedback.mood,
        comment: feedback.comment,
        scene: 'custom'
      })
    }

    setCurrentState('home')
    setSelectedMassagePart(null)
    refreshSummary()
  }

  const handleStretchSessionComplete = (feedback: SessionFeedback) => {
    const target = selectedStretchTarget

    if (target) {
      addSessionRecord({
        type: 'stretch',
        subtype: target,
        duration: Math.max(1, feedback.durationSeconds ?? 180),
        completedAt: feedback.completedAt ?? new Date().toISOString(),
        rating: feedback.rating,
        mood: feedback.mood,
        comment: feedback.comment,
        scene: 'custom'
      })
    }

    setCurrentState('home')
    setSelectedStretchTarget(null)
    refreshSummary()
  }

  const handleExit = () => {
    setCurrentState('home')
    setSelectedOrgan(null)
    setSelectedMassagePart(null)
    setSelectedStretchTarget(null)
  }

  const handleMassageBackToSelection = () => {
    setCurrentState('massage-selection')
    setSelectedMassagePart(null)
  }

  const handleStretchBackToSelection = () => {
    setCurrentState('stretch')
    setSelectedStretchTarget(null)
  }

  if (currentState === 'stretch') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleExit}>
              ← ホームに戻る
            </Button>
            {selectedStretchTarget && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500"
                onClick={handleStretchBackToSelection}
              >
                目的一覧に戻る
              </Button>
            )}
          </div>

          {selectedStretchTarget ? (
            <StretchGuide
              target={selectedStretchTarget}
              onComplete={handleStretchSessionComplete}
              onBackToSelection={handleStretchBackToSelection}
            />
          ) : (
            <StretchSelector
              selectedTarget={selectedStretchTarget ?? undefined}
              onSelectTarget={handleSelectStretchTarget}
            />
          )}
        </div>
      </div>
    )
  }

  if (currentState === 'massage-selection') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleExit}>
              ← ホームに戻る
            </Button>
            {selectedMassagePart && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500"
                onClick={handleMassageBackToSelection}
              >
                部位一覧に戻る
              </Button>
            )}
          </div>

          {selectedMassagePart ? (
            <MassageGuide
              part={selectedMassagePart}
              onComplete={handleMassageSessionComplete}
              onBackToSelection={handleMassageBackToSelection}
            />
          ) : (
            <MassageSelector
              selectedPart={selectedMassagePart ?? undefined}
              onSelectPart={handleSelectMassagePart}
            />
          )}
        </div>
      </div>
    )
  }

  if (currentState === 'organ-selection') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleExit}>
              ← ホームに戻る
            </Button>
          </div>
          <OrganSelector
            selectedOrgan={selectedOrgan ?? undefined}
            onSelectOrgan={handleSelectOrgan}
            onClearSelection={handleClearOrganSelection}
            onSessionComplete={handleOrganCareSessionComplete}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Self-Care
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            5分で始める、毎日のセルフケア
          </p>
          <p className="text-gray-500">
            身体への感謝を込めて、自分を大切にする時間を作りましょう
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200">
            <CardHeader>
              <div className="text-center">
                <div className="text-4xl mb-3">🫀</div>
                <CardTitle className="text-xl text-indigo-900">内臓ケア</CardTitle>
                <CardDescription className="text-indigo-700">
                  手当て瞑想で身体に感謝
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-indigo-800 text-center">
                  腎臓・肝臓・胃・膵臓・腸への感謝を込めた瞑想的アプローチ
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge variant="secondary" className="text-xs">音声ガイド</Badge>
                  <Badge variant="secondary" className="text-xs">リラックス</Badge>
                  <Badge variant="secondary" className="text-xs">感謝瞑想</Badge>
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleSelectSelfCareType('organ-care')}
                >
                  開始する
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-100 border-emerald-200">
            <CardHeader>
              <div className="text-center">
                <div className="text-4xl mb-3">🤲</div>
                <CardTitle className="text-xl text-emerald-900">セルフマッサージ</CardTitle>
                <CardDescription className="text-emerald-700">
                  5分で疲れをリセット
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-emerald-800 text-center">
                  肩・首・腰・足の疲れを簡単なマッサージで解消
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge variant="secondary" className="text-xs">手順ガイド</Badge>
                  <Badge variant="secondary" className="text-xs">疲労回復</Badge>
                  <Badge variant="secondary" className="text-xs">血行促進</Badge>
                </div>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleSelectSelfCareType('massage')}
                >
                  開始する
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-orange-50 to-amber-100 border-amber-200">
            <CardHeader>
              <div className="text-center">
                <div className="text-4xl mb-3">🧘‍♀️</div>
                <CardTitle className="text-xl text-amber-900">ストレッチ</CardTitle>
                <CardDescription className="text-amber-700">
                  座りながら簡単ストレッチ
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-amber-800 text-center">
                  オフィスでもできる肩こり・腰痛・眼精疲労対策
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge variant="secondary" className="text-xs">タイマー付き</Badge>
                  <Badge variant="secondary" className="text-xs">姿勢改善</Badge>
                  <Badge variant="secondary" className="text-xs">柔軟性向上</Badge>
                </div>
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={() => handleSelectSelfCareType('stretch')}
                >
                  開始する
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">今日の目標</CardTitle>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="text-center space-y-4">
                  <div className="text-4xl">
                    {summary.todayCompleted ? '🌟' : '🎯'}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-800">
                      {summary.todayCompleted
                        ? '今日のセルフケアは達成済み！'
                        : 'あと1回のセルフケアで達成できるよ'}
                    </p>
                    <p className="text-sm text-gray-500">
                      毎日5分、自分をいたわる時間を確保しよう。
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Badge variant={summary.todayCompleted ? 'secondary' : 'outline'}>
                      通算 {summary.totalSessions} 回
                    </Badge>
                    {summary.lastSession && (
                      <Badge variant="outline">
                        最新 {formatLastSession(summary.lastSession.completedAt)}
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-3xl">🎯</div>
                  <p className="text-gray-600">記録を読み込み中...</p>
                  <Badge variant="outline">しばらくお待ちください</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">継続状況</CardTitle>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">🔥</span>
                    <div className="text-left">
                      <p className="text-lg font-semibold text-gray-800">
                        {summary.currentStreak} 日継続中
                      </p>
                      <p className="text-sm text-gray-500">
                        最長 {summary.longestStreak} 日
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    {summary.recentDays.map((day) => (
                      <div
                        key={day.date}
                        className={`w-10 h-10 rounded-full flex flex-col items-center justify-center text-xs font-semibold transition-all ${
                          day.completed
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                        title={`${formatShortDate(day.date)} (${formatWeekday(day.date)})`}
                      >
                        <span>{formatWeekday(day.date)}</span>
                        <span className="text-[10px] opacity-80">{formatShortDate(day.date)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">色付きの丸がセルフケア達成日やで。</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-3xl">📊</div>
                  <p className="text-gray-600">統計を準備中...</p>
                  <Badge variant="outline">データ待ち</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            身体への感謝を込めて、毎日少しずつセルフケアを続けましょう 🌱
          </p>
        </div>
      </div>
    </div>
  )
}