'use client'

import { MassagePart } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAllMassageGuides } from '@/lib/data/massage-data'

interface MassageSelectorProps {
  selectedPart?: MassagePart
  onSelectPart: (part: MassagePart) => void
  disabled?: boolean
}

const partIcons: Record<MassagePart, string> = {
  neck: '🧠',
  shoulder: '💪',
  back: '🌀',
  foot: '🦶',
  'full-body': '🌿'
}

const partColors: Record<MassagePart, string> = {
  neck: 'bg-sky-50 border-sky-200 hover:bg-sky-100',
  shoulder: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
  back: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
  foot: 'bg-rose-50 border-rose-200 hover:bg-rose-100',
  'full-body': 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
}

const difficultyLabels: Record<'easy' | 'medium' | 'hard', string> = {
  easy: 'やさしい',
  medium: 'しっかり',
  hard: 'チャレンジ'
}

export function MassageSelector({ selectedPart, onSelectPart, disabled = false }: MassageSelectorProps) {
  const guides = getAllMassageGuides()

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">ケアしたい部位を選択</h2>
        <p className="text-gray-600">
          いま気になる部位を選ぶだけ。ガイドに沿って、5分でリセットしましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((guide) => {
          const isSelected = selectedPart === guide.part
          const colorClass = partColors[guide.part]

          return (
            <Card
              key={guide.part}
              className={`cursor-pointer transition-all duration-200 ${colorClass} ${
                isSelected ? 'ring-2 ring-offset-2 ring-emerald-500' : ''
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && onSelectPart(guide.part)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{partIcons[guide.part]}</span>
                    <div>
                      <CardTitle className="text-lg">{guide.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {guide.description.slice(0, 50)}...
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/70 text-emerald-700">
                    {difficultyLabels[guide.difficulty]}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {guide.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-emerald-700">
                  <span>⏱ 約{Math.round(guide.duration / 60)}分</span>
                  <span>・</span>
                  <span>{guide.steps.length}ステップ</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-emerald-600 text-lg">💡</span>
          <div className="space-y-1">
            <h4 className="font-medium text-emerald-900">セルフマッサージのコツ</h4>
            <p className="text-sm text-emerald-800">
              痛みを感じるほど強く揉むのはNG。深い呼吸とやさしい圧で、筋肉と会話する気持ちで進めましょう。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
