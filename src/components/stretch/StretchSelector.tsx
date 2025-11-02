'use client'

import { StretchTarget } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { stretchGuides } from '@/lib/data/stretch-data'

interface StretchSelectorProps {
  selectedTarget?: StretchTarget
  onSelectTarget: (target: StretchTarget) => void
  disabled?: boolean
}

const targetIcons: Record<StretchTarget, string> = {
  'shoulder-pain': '🧘‍♀️',
  'back-pain': '🏋️‍♂️',
  'eye-strain': '👀',
  'full-body': '🤸'
}

const targetColors: Record<StretchTarget, string> = {
  'shoulder-pain': 'bg-amber-50 border-amber-200 hover:bg-amber-100',
  'back-pain': 'bg-orange-50 border-orange-200 hover:bg-orange-100',
  'eye-strain': 'bg-sky-50 border-sky-200 hover:bg-sky-100',
  'full-body': 'bg-lime-50 border-lime-200 hover:bg-lime-100'
}

const locationLabels: Record<'office' | 'home' | 'anywhere', string> = {
  office: 'オフィスで',
  home: '自宅で',
  anywhere: 'どこでも'
}

export function StretchSelector({ selectedTarget, onSelectTarget, disabled = false }: StretchSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">ストレッチの目的を選択</h2>
        <p className="text-gray-600">
          気になる症状や目的に合わせて、短時間でできるストレッチを選びましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stretchGuides.map((guide) => {
          const isSelected = selectedTarget === guide.target
          const colorClass = targetColors[guide.target]

          return (
            <Card
              key={guide.target}
              className={`cursor-pointer transition-all duration-200 ${colorClass} ${
                isSelected ? 'ring-2 ring-offset-2 ring-amber-500' : ''
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && onSelectTarget(guide.target)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{targetIcons[guide.target]}</span>
                    <div>
                      <CardTitle className="text-lg">{guide.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {guide.description.slice(0, 50)}...
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/70 text-amber-700">
                    {locationLabels[guide.location]}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {guide.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-amber-700">
                  <span>⏱ 約{Math.round(guide.totalDuration / 60)}分</span>
                  <span>・</span>
                  <span>{guide.exercises.length}ステップ</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-amber-600 text-lg">💡</span>
          <div className="space-y-1">
            <h4 className="font-medium text-amber-900">ストレッチのコツ</h4>
            <p className="text-sm text-amber-800">
              反動をつけず、ゆっくりと筋肉が伸びるのを感じるのがポイント。「痛気持ちいい」範囲で、深い呼吸を意識しましょう。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
