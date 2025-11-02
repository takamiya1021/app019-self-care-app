'use client'

import { useMemo } from 'react'
import { OrganType, SessionFeedback } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAllOrganCareGuides } from '@/lib/data/organ-care-data'
import { MeditationSession } from './MeditationSession'

interface OrganSelectorProps {
  selectedOrgan?: OrganType
  onSelectOrgan: (organ: OrganType) => void
  onClearSelection: () => void
  onSessionComplete: (feedback: SessionFeedback) => void
  disabled?: boolean
}

const organIcons: Record<OrganType, string> = {
  kidney: '🫘',
  liver: '🫁',
  stomach: '🫄',
  pancreas: '🔸',
  intestine: '🌀'
}

const organColors: Record<OrganType, string> = {
  kidney: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  liver: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
  stomach: 'bg-green-50 border-green-200 hover:bg-green-100',
  pancreas: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  intestine: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
}

export function OrganSelector({
  selectedOrgan,
  onSelectOrgan,
  onClearSelection,
  onSessionComplete,
  disabled = false
}: OrganSelectorProps) {
  const organGuides = useMemo(() => getAllOrganCareGuides(), [])

  if (selectedOrgan) {
    const guide = organGuides.find((item) => item.organ === selectedOrgan)
    if (!guide) {
      return null
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{organIcons[guide.organ]}</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{guide.name}</h2>
              <p className="text-sm text-gray-600">{guide.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500" onClick={onClearSelection}>
            臓器一覧に戻る
          </Button>
        </div>

        <div className="rounded-lg border border-indigo-200 bg-indigo-50/80 p-4 text-sm text-indigo-800 leading-relaxed">
          <p className="font-semibold text-indigo-900 mb-1">{guide.name}の手の位置</p>
          <p>{guide.position}</p>
        </div>

        <MeditationSession
          key={guide.organ}
          organ={guide.organ}
          onComplete={onSessionComplete}
          onExit={onClearSelection}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">内臓ケアを選択</h2>
        <p className="text-sm text-gray-600">
          気になる臓器を選んで、すぐにセルフケアを始めましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {organGuides.map((guide) => {
          const baseStyles = organColors[guide.organ]

          return (
            <Card
              key={guide.organ}
              className={`transition-all duration-200 ${baseStyles} ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg hover:scale-[1.01]'
              }`}
              onClick={() => !disabled && onSelectOrgan(guide.organ)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{organIcons[guide.organ]}</span>
                  <div>
                    <CardTitle className="text-lg">{guide.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {guide.description.substring(0, 60)}...
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {guide.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {guide.benefits.slice(0, 3).map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={disabled}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (disabled) return
                      onSelectOrgan(guide.organ)
                    }}
                  >
                    セッションを始める
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
