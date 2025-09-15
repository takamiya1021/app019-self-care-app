'use client'

import { useState } from 'react'
import { SelfCareType, OrganType, SessionFeedback } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrganSelector } from '@/components/organ-care/OrganSelector'
import { MeditationSession } from '@/components/organ-care/MeditationSession'

type AppState = 'home' | 'organ-selection' | 'organ-session' | 'massage' | 'stretch'

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('home')
  const [selectedOrgan, setSelectedOrgan] = useState<OrganType | null>(null)

  const handleSelectSelfCareType = (type: SelfCareType) => {
    switch (type) {
      case 'organ-care':
        setCurrentState('organ-selection')
        break
      case 'massage':
        setCurrentState('massage')
        break
      case 'stretch':
        setCurrentState('stretch')
        break
    }
  }

  const handleSelectOrgan = (organ: OrganType) => {
    setSelectedOrgan(organ)
    setCurrentState('organ-session')
  }

  const handleSessionComplete = (feedback: SessionFeedback) => {
    console.log('セッション完了:', feedback)
    // TODO: データを保存
    setCurrentState('home')
    setSelectedOrgan(null)
  }

  const handleExit = () => {
    setCurrentState('home')
    setSelectedOrgan(null)
  }

  // セッション実行画面
  if (currentState === 'organ-session' && selectedOrgan) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <MeditationSession
            organ={selectedOrgan}
            onComplete={handleSessionComplete}
            onExit={handleExit}
          />
        </div>
      </div>
    )
  }

  // 内臓選択画面
  if (currentState === 'organ-selection') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={handleExit}>
              ← ホームに戻る
            </Button>
          </div>
          <OrganSelector
            selectedOrgan={selectedOrgan || undefined}
            onSelectOrgan={handleSelectOrgan}
          />
        </div>
      </div>
    )
  }

  // ホーム画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* ヘッダー */}
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

        {/* セルフケアメニュー */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 内臓ケア */}
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

          {/* セルフマッサージ */}
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
                  disabled
                >
                  開始する（準備中）
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ストレッチ */}
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
                  <Badge variant="secondary" className="text-xs">動画ガイド</Badge>
                  <Badge variant="secondary" className="text-xs">姿勢改善</Badge>
                  <Badge variant="secondary" className="text-xs">柔軟性向上</Badge>
                </div>
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={() => handleSelectSelfCareType('stretch')}
                  disabled
                >
                  開始する（準備中）
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 今日の目標・統計（将来実装） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">今日の目標</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl">🎯</div>
                <p className="text-gray-600">1日1回のセルフケア</p>
                <Badge variant="outline">準備中</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">継続状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl">📊</div>
                <p className="text-gray-600">進捗と統計</p>
                <Badge variant="outline">準備中</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* フッター */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            身体への感謝を込めて、毎日少しずつセルフケアを続けましょう 🌱
          </p>
        </div>
      </div>
    </div>
  )
}