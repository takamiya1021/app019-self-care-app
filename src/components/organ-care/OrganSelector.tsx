'use client'

import { OrganType } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAllOrganCareGuides } from '@/lib/data/organ-care-data'

interface OrganSelectorProps {
  selectedOrgan?: OrganType
  onSelectOrgan: (organ: OrganType) => void
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

export function OrganSelector({ selectedOrgan, onSelectOrgan, disabled = false }: OrganSelectorProps) {
  const organGuides = getAllOrganCareGuides()

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">内臓ケアを選択</h2>
        <p className="text-gray-600">
          ケアしたい臓器を選んでください。手当て瞑想で身体への感謝を込めましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {organGuides.map((guide) => {
          const isSelected = selectedOrgan === guide.organ
          const baseStyles = organColors[guide.organ]

          return (
            <Card
              key={guide.organ}
              className={`cursor-pointer transition-all duration-200 ${baseStyles} ${
                isSelected ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && onSelectOrgan(guide.organ)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{organIcons[guide.organ]}</span>
                    <div>
                      <CardTitle className="text-lg">{guide.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {guide.description.substring(0, 50)}...
                      </CardDescription>
                    </div>
                  </div>
                  {isSelected && (
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                      選択中
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {guide.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {guide.benefits.slice(0, 2).map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                    {guide.benefits.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{guide.benefits.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedOrgan && (
        <div className="text-center">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
            disabled={disabled}
          >
            {organGuides.find(g => g.organ === selectedOrgan)?.name}を始める
          </Button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-lg">ℹ️</span>
          <div className="space-y-1">
            <h4 className="font-medium text-blue-900">内臓ケアについて</h4>
            <p className="text-sm text-blue-800">
              内臓ケアは治療ではなく、セルフヒーリング瞑想です。
              手当てによるオキシトシン分泌促進とリラックス効果が期待できます。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}