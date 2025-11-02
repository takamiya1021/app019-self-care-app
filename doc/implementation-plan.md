# Self-Care アプリ 実装計画書

## 🎯 実装スケジュール概要
**総開発期間**: 約12時間（4つのフェーズに分割）

### フェーズ分割
- **フェーズ1**: 環境構築・基本UI（2時間）
- **フェーズ2**: 内臓ケア機能実装（4時間）
- **フェーズ3**: セルフマッサージ・ストレッチ機能（3時間）
- **フェーズ4**: 継続サポート・PWA対応（3時間）

---

## 📋 フェーズ1: 環境構築・基本UI（予定工数: 2時間）

### 🎯 目標
基本的なNext.jsアプリケーションの構築と基本UI実装

### ✅ タスクリスト

#### 環境構築（30分）
- [x] Next.js 15プロジェクト初期化
- [x] TypeScript設定
- [x] Tailwind CSS設定
- [x] shadcn/ui設定
- [x] ESLint・Prettier設定

#### プロジェクト構造作成（30分）
- [x] フォルダ構造作成（app/、components/、lib/、types/）
- [x] 基本型定義（types/index.ts）
- [x] ユーティリティ関数（lib/utils.ts）

#### 基本レイアウト（30分）
- [x] app/layout.tsx（メタデータ・PWA設定）
- [x] app/page.tsx（ホーム画面）
- [ ] components/ui/layout/Header.tsx
- [ ] components/ui/layout/Navigation.tsx

#### ルーティング設定（30分）
- [x] app/session/page.tsx（セッション実行画面）※app/page.tsx内で実装
- [ ] app/progress/page.tsx（進捗画面）
- [ ] app/settings/page.tsx（設定画面）

---

## 📋 フェーズ2: 内臓ケア機能実装（予定工数: 4時間）

### 🎯 目標
アプリの核心機能である内臓ケア・音声ガイド機能の完全実装

### ✅ タスクリスト

#### データモデル実装（45分）
- [x] types/selfcare.ts（内臓ケア型定義）※types/index.ts内で実装
- [x] lib/organ-care-data.ts（内臓別ガイドデータ）※lib/data/organ-care-data.tsで実装
- [x] lib/audio-scripts.ts（音声ガイドスクリプト）※organ-care-data.ts内で実装

#### 音声ガイド実装（90分）
- [x] hooks/useSpeechSynthesis.ts（Text-to-Speech）※VOICEVOXで事前生成方式に変更
- [x] components/audio/VoiceGuide.tsx ※MeditationSession.tsx内で実装
- [x] 音声ガイドテスト・調整

#### 内臓ケアUI実装（90分）
- [x] components/organ-care/OrganSelector.tsx（臓器選択）
- [x] components/organ-care/OrganMap.tsx（人体マップ表示） ※省略
- [x] components/organ-care/PositionGuide.tsx（手の位置ガイド）※MeditationSession.tsx内で実装
- [x] components/organ-care/MeditationSession.tsx（瞑想セッション）
- [x] components/ui/slider.tsx（満足度スライダーUI）

#### セッション管理（45分）
- [x] hooks/useSession.ts（セッション状態管理）※コンポーネント内でuseState実装
- [x] lib/session-storage.ts（LocalStorage管理）
- [x] セッション完了機能・フィードバック画面

---

## 📋 フェーズ3: セルフマッサージ・ストレッチ機能（予定工数: 3時間）

### 🎯 目標
マッサージ・ストレッチ機能とコンテンツライブラリの実装

### ✅ タスクリスト

#### コンテンツデータ作成（60分）
- [x] lib/massage-data.ts（マッサージ手順データ）
- [x] lib/stretch-data.ts（ストレッチ手順データ）
- [x] イラスト・画像素材の準備（SVG/PNG） ※省略

#### マッサージ機能（60分）
- [x] components/massage/MassageSelector.tsx（部位選択）
- [x] components/massage/MassageGuide.tsx（手順ガイド表示）
- [x] components/massage/StepIndicator.tsx（進捗インジケーター）

#### ストレッチ機能（60分）
- [x] components/stretch/StretchSelector.tsx（目的別選択）
- [x] components/stretch/StretchGuide.tsx（動作ガイド）
- [ ] components/stretch/Timer.tsx（時間管理）

---

## 📋 フェーズ4: 継続サポート・PWA対応（予定工数: 3時間）

### 🎯 目標
習慣化サポート機能とPWA対応の完全実装

### ✅ タスクリスト

#### 継続サポート機能（90分）
- [ ] lib/progress-tracker.ts（進捗トラッキング）
- [ ] components/progress/StreakCounter.tsx（連続達成カウンター）
- [ ] components/progress/AchievementSystem.tsx（バッジ・ポイント）
- [ ] components/gamification/RewardAnimation.tsx（達成アニメーション）

#### データ永続化（45分）
- [ ] lib/indexeddb.ts（IndexedDB設定）
- [ ] hooks/useProgressData.ts（進捗データ管理）
- [ ] データエクスポート・インポート機能

#### PWA対応（45分）
- [ ] next.config.js PWA設定
- [ ] public/manifest.json作成
- [ ] Service Worker設定
- [ ] オフライン対応・キャッシュ戦略

---

## 🧪 テスト・品質保証

### 機能テスト
- [ ] 各セルフケア機能の動作確認
- [ ] 音声ガイドの品質チェック
- [ ] データ保存・読み込み機能テスト
- [ ] PWAインストール・オフライン動作テスト

### ユーザビリティテスト
- [ ] ナビゲーションの直感性
- [ ] 音声ガイドの聞き取りやすさ
- [ ] セッション完了までの流れ
- [ ] 継続モチベーションの効果測定

### パフォーマンステスト
- [ ] Core Web Vitals測定
- [ ] モバイル端末での動作確認
- [ ] 音声ファイル読み込み時間最適化
- [ ] IndexedDBパフォーマンス確認

---

## 🚀 デプロイ・運用

### デプロイ準備
- [ ] Vercelプロジェクト設定
- [ ] 環境変数設定（必要に応じて）
- [ ] ドメイン設定（カスタムドメイン使用時）

### 運用監視
- [ ] Vercel Analytics設定
- [ ] エラー監視（Sentry等）
- [ ] ユーザーフィードバック収集仕組み

---

## 📊 成功指標・KPI

### 開発完了指標
- [x] 全ての主要機能が動作
- [ ] PWAとしてインストール可能
- [ ] Core Web Vitals がGreen
- [x] 音声ガイドが5臓器すべてで利用可能

### ユーザー体験指標
- [ ] セッション完了率 80%以上
- [ ] 3日間継続率 60%以上
- [ ] 平均セッション時間 3-5分
- [ ] ユーザー満足度 4.0以上（5点満点）

---

## ⚠️ リスク・課題と対策

### 技術的リスク
| リスク | 影響度 | 対策 |
|--------|--------|------|
| Text-to-Speech ブラウザ対応 | 中 | フォールバック音声ファイル準備 |
| PWA iOS対応制限 | 低 | Web版でも十分に機能提供 |
| IndexedDB容量制限 | 低 | データ圧縮・古いデータ削除 |

### UX リスク
| リスク | 影響度 | 対策 |
|--------|--------|------|
| 継続モチベーション維持 | 高 | ゲーミフィケーション強化 |
| 音声ガイドの品質 | 中 | 複数パターン・調整機能 |
| 操作の複雑さ | 中 | シンプルなUI・チュートリアル |

---

## 🎯 最終チェックリスト

### 機能完成度
- [x] 内臓ケア5種類すべて実装済み
- [x] マッサージ・ストレッチ機能動作確認
- [ ] 継続サポート機能完全動作
- [ ] PWAインストール・オフライン動作

### 品質基準
- [ ] TypeScript型エラーゼロ
- [ ] ESLint警告ゼロ
- [ ] Lighthouse スコア90以上
- [ ] モバイル・デスクトップ両対応

### ユーザー準備
- [ ] README.mdドキュメント完成
- [ ] 使い方ガイド作成
- [ ] フィードバック収集準備

---
*最終更新: 2025-11-01*
