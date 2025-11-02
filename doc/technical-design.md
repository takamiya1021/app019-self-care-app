# Self-Care アプリ 技術設計書

## 🎯 アーキテクチャ概要
- **アプリケーション種別**: SPA（Single Page Application）
- **デプロイ方式**: PWA（Progressive Web App）対応
- **データ管理**: ローカルストレージ（LocalStorage + IndexedDB）
- **音声機能**: Web Speech API + 音声ファイル

## 🛠️ 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript 5.x
- **スタイリング**: Tailwind CSS 3.x
- **UI コンポーネント**: shadcn/ui（Radix UIベース） + `@radix-ui/react-slider`
- **状態管理**: Zustand (軽量・シンプル)

### PWA 対応
- **Service Worker**: Next.js built-in PWA support
- **Manifest**: Web App Manifest for install prompts
- **オフライン対応**: 基本機能はオフライン動作

### 音声・メディア
- **音声ガイド**: 事前生成音声ファイル（VOICEVOX）を再生
- **BGM**: 音声ファイル（MP3/OGG）
- **イラスト**: SVG + PNG (最適化済み)

### データ・ストレージ
- **設定データ**: LocalStorage
- **履歴データ**: IndexedDB (Dexie.js)
- **音声ファイル**: Service Worker キャッシュ

## 📱 コンポーネント設計

### 画面構成
```
App
├── HomePage (メニュー選択)
├── SelfCareSession (実行画面)
│   ├── StretchGuide (ストレッチ)
│   ├── MassageGuide (マッサージ)
│   └── OrganCareGuide (内臓ケア)
├── ProgressDashboard (継続状況)
└── Settings (設定)
```

### 主要コンポーネント

#### 1. SelfCareSession
```typescript
interface SelfCareSession {
  type: 'stretch' | 'massage' | 'organ-care'
  content: CareContent
  onComplete: (rating: number) => void
}
```

#### 2. OrganCareGuide（核心機能）
```typescript
interface OrganCareGuide {
  organ: 'kidney' | 'liver' | 'stomach' | 'pancreas' | 'intestine'
  position: BodyPosition
  audioGuide: AudioScript
  visualization: OrganMap
}
```

#### 3. ProgressTracker
```typescript
interface ProgressTracker {
  streak: number
  totalSessions: number
  weeklyGoal: number
  achievements: Achievement[]
  mood: MoodRating[]
}
```

## 🗃️ データモデル

### 1. User Settings
```typescript
interface UserSettings {
  preferredTime: 'morning' | 'noon' | 'evening' | 'night'
  audioEnabled: boolean
  voiceSpeed: number
  bgmVolume: number
  targetDays: number[]
}
```

### 2. Session Record
```typescript
interface SessionRecord {
  id: string
  type: SelfCareType
  subtype?: string
  duration: number
  completedAt: Date
  rating: number (1-5)
  mood: 'energized' | 'relaxed' | 'calm' | 'refreshed'
}
```

### 3. Progress Data
```typescript
interface ProgressData {
  currentStreak: number
  longestStreak: number
  totalSessions: number
  weeklyStats: WeeklyStats[]
  achievements: Achievement[]
  level: number
  points: number
}
```

## 🎨 UI/UX 設計原則

### カラーパレット
- **Primary**: Soft Green (#10B981) - 自然・リラックス
- **Secondary**: Warm Orange (#F59E0B) - エネルギー・活力
- **Accent**: Calm Blue (#3B82F6) - 信頼・安心
- **Background**: Neutral Beige (#F9FAFB) - 温かみ
- **Text**: Dark Gray (#374151) - 読みやすさ

### フォント
- **メイン**: Inter (可読性重視)
- **アクセント**: Noto Sans JP (日本語最適化)

### アニメーション
- **完了アニメ**: Confetti + Gentle Bounce
- **進捗表示**: Smooth Progress Bar
- **画面遷移**: Fade + Slide

### フィードバックフォーム UI
- **満足度コントロール**: `@radix-ui/react-slider` を用いた離散スライダー（min:1 / max:5 / step:1）
- **初期値**: 3（ニュートラルな評価をデフォルト提示し、未選択状態を防止）
- **ラベル表示**: スライダー下部に「1 いまいち〜5 最高」のテキストラベルを配置し意味付けを明確化
- **送信条件**: 満足度（1〜5）と気分選択の両方がセットされている場合のみ「完了」ボタンを活性化
- **アクセシビリティ**: `aria-label="満足度"` を指定し、キーボード操作で値を変更可能

## 🔊 音声ガイド実装

- **再生方式**: VOICEVOXで生成した音声ファイル（`public/audio/organ-care/*.wav`）をステップごとに再生
- **再生制御**: `MeditationSession` 内で各ステップのオーディオをロードし、完了時に次ステップへ自動遷移
- **ユーザー設定**: 音量・速度のUI調整は提供せず、デバイス側コントロールに委ねる

### 音声スクリプト例（内臓ケア）
```typescript
const organCareScripts = {
  liver: [
    "右の肋骨の下に、優しく手を置いてください。",
    "肝臓の位置を意識しながら、深くゆっくりと息を吸います。",
    "肝臓は身体の化学工場です。いつも働いてくれてありがとう。",
    "温かいエネルギーが肝臓に届くのをイメージしてみましょう。"
  ]
}
```

## 🎮 ゲーミフィケーション設計

### ポイント系統
- **基本セッション**: 10ポイント
- **連続達成**: +5ポイント/日
- **週間達成**: +50ポイント
- **新記録**: +100ポイント

### バッジシステム
```typescript
interface Achievement {
  id: string
  name: string
  description: string
  iconUrl: string
  condition: AchievementCondition
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}
```

### レベルシステム
- **レベル 1**: 0-100ポイント (初心者)
- **レベル 2**: 101-300ポイント (継続者)
- **レベル 3**: 301-600ポイント (習慣化)
- **レベル 4**: 601-1000ポイント (マスター)

## 📊 データ分析・最適化

### トラッキング項目
- セッション完了率
- 機能別利用率
- 継続日数分布
- 満足度評価
- 離脱ポイント分析

### A/Bテスト対象
- 褒める言葉のバリエーション
- 完了アニメーションの種類
- 目標設定の初期値
- 音声ガイドの話し方

## 🚀 パフォーマンス最適化

### Core Web Vitals 対応
- **LCP**: 2.5秒以下 (画像最適化・Code Splitting)
- **FID**: 100ms以下 (Event Handler最適化)
- **CLS**: 0.1以下 (Layout Stability)

### PWA 最適化
- **キャッシュ戦略**: Stale-While-Revalidate
- **オフライン対応**: 基本機能はオフライン動作
- **インストール促進**: Install Banner + Manual Prompt

## 🔒 セキュリティ・プライバシー

### データ保護
- **ローカルストレージ**: 機密データなし
- **暗号化**: 不要（個人特定データなし）
- **GDPR対応**: データエクスポート機能

### アクセシビリティ
- **WCAG 2.1 AA準拠**
- **キーボードナビゲーション**
- **スクリーンリーダー対応**
- **色覚バリアフリー**

## 📦 ビルド・デプロイ

### ビルド設定
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true, // Static export対応
  },
})
```

### デプロイ先
- **プライマリ**: Vercel (Next.js最適化)
- **バックアップ**: Netlify (Static hosting)
- **CDN**: 自動最適化（Vercel Edge Network）

---
*最終更新: 2025-09-15*
