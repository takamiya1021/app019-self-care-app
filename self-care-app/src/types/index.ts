// セルフケアの種類
export type SelfCareType = 'stretch' | 'massage' | 'organ-care'

// 内臓の種類
export type OrganType = 'kidney' | 'liver' | 'stomach' | 'pancreas' | 'intestine'

// マッサージ部位
export type MassagePart = 'neck' | 'shoulder' | 'back' | 'foot' | 'full-body'

// ストレッチ目的
export type StretchTarget = 'shoulder-pain' | 'back-pain' | 'eye-strain' | 'full-body'

// 利用シーン
export type UsageScene = 'morning' | 'lunch' | 'evening' | 'work-break' | 'custom'

// セッションレコード
export interface SessionRecord {
  id: string
  type: SelfCareType
  subtype?: string // 具体的な部位や臓器
  duration: number // 秒
  completedAt: Date
  rating: number // 1-5の満足度
  mood: 'energized' | 'relaxed' | 'calm' | 'refreshed'
  scene: UsageScene
}

// 進捗データ
export interface ProgressData {
  currentStreak: number // 現在の連続日数
  longestStreak: number // 最長連続記録
  totalSessions: number // 総セッション数
  level: number // レベル
  points: number // ポイント
  achievements: Achievement[] // 達成済みバッジ
  weeklyStats: WeeklyStats[] // 週間統計
}

// 週間統計
export interface WeeklyStats {
  weekStart: Date
  sessionsCount: number
  averageRating: number
  topTypes: { type: SelfCareType; count: number }[]
}

// 達成項目（バッジ）
export interface Achievement {
  id: string
  name: string
  description: string
  iconUrl: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
}

// ユーザー設定
export interface UserSettings {
  preferredScenes: UsageScene[] // 好みの利用シーン
  audioEnabled: boolean // 音声ガイド有効
  voiceSpeed: number // 音声速度 (0.5-2.0)
  bgmVolume: number // BGM音量 (0-1)
  targetDays: number[] // 目標実施曜日 (0-6, 0=日曜)
  language: 'ja' | 'en' // 言語設定
}

// 内臓ケアガイド
export interface OrganCareGuide {
  organ: OrganType
  name: string
  description: string
  position: string // 手の位置説明
  audioScript: string[] // 音声ガイドテキスト
  benefits: string[] // 期待効果
  illustration?: string // イラストURL
}

// マッサージガイド
export interface MassageGuide {
  part: MassagePart
  name: string
  description: string
  steps: MassageStep[]
  duration: number // 推奨時間（秒）
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface MassageStep {
  id: number
  instruction: string
  duration: number // このステップの時間（秒）
  illustration?: string
}

// ストレッチガイド
export interface StretchGuide {
  target: StretchTarget
  name: string
  description: string
  exercises: StretchExercise[]
  totalDuration: number
  location: 'office' | 'home' | 'anywhere'
}

export interface StretchExercise {
  id: number
  name: string
  instruction: string
  duration: number // 秒
  repetitions?: number
  illustration?: string
}

// セッション状態
export interface SessionState {
  isActive: boolean
  type?: SelfCareType
  subtype?: string
  startedAt?: Date
  currentStep?: number
  totalSteps?: number
  progress: number // 0-100
}

// 音声設定
export interface VoiceSettings {
  lang: 'ja-JP' | 'en-US'
  rate: number // 0.5-2.0
  pitch: number // 0.5-2.0
  volume: number // 0-1
}

// フィードバック
export interface SessionFeedback {
  rating: number // 1-5
  mood: 'energized' | 'relaxed' | 'calm' | 'refreshed'
  comment?: string
}