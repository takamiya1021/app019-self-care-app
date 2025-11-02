# Self-Care 習慣トラッカー

短時間セルフケアを日常に取り入れるための Next.js 製 Web アプリケーションです。ストレッチ・セルフマッサージ・内臓ケアを音声ガイド付きで提供し、実施記録をローカルに保存して習慣化をサポートします。PWA 対応済みのため、ホーム画面インストールやオフライン閲覧にも対応しています。

---

## 📦 主な機能

- **ストレッチ / マッサージ / 内臓ケアのガイド**
  - 目的別にステップを表示し、音声ガイドを再生
  - ステップごとのカウントダウン・自動進行に対応

## 📸 スクリーンショット

![アプリホーム画面のスクリーンショット](<png/スクリーンショット 2025-11-02 165627.png>)
- **音声ガイド**
  - `public/audio/` 以下に配置した VOICEVOX 生成の音声ファイルを再生
  - `src/hooks/useStepAudio.ts` で再生制御を共通化
- **フィードバック記録**
  - 満足度 / 気分 / 実施時間をローカルストレージに保存
  - 連続実施日数や直近 7 日の実施状況を集計（`src/lib/storage/session-storage.ts`）
- **PWA 対応**
  - Web App Manifest / Service Worker（`next-pwa`）を設定
  - マスク対応アイコン（Android）と Apple Touch Icon（iOS）を同梱
  - `src/app/offline/page.tsx` をオフラインフォールバックとして提供

---

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router + Turbopack)
- **言語 / ビルド**: TypeScript, pnpm/npm
- **UI ライブラリ**: Tailwind CSS, shadcn/ui
- **アイコン**: lucide-react
- **PWA**: next-pwa

---

## 🚀 セットアップ

```bash
# 依存ライブラリをインストール
npm install

# 開発サーバーを起動 (http://localhost:3000)
npm run dev

# 型チェック & Lint
npm run lint

# 本番ビルド
npm run build
```

> 開発サーバー起動時、ポート競合が起きた場合は `PORT=3005 npm run dev` のように環境変数でポートを変更してください。

---

## 📱 PWA 設定

- Manifest: `public/manifest.json`
- Service Worker / キャッシュ戦略: `next.config.ts`（`next-pwa` 経由）
- アイコン:
  - `public/icons/app-icon-maskable.png`（Android マスク対応）
  - `public/icons/icon-192.png`, `public/icons/icon-512.png`（fallback）
  - `public/icons/apple-touch-icon.png`（iOS）
- オフラインページ: `src/app/offline/page.tsx`

Chrome DevTools の **Application > Manifest** でインストール可否、**Network** でオフライン表示を確認できます。

---

## 🔉 音声ガイド

- 音声ファイルは `public/audio/` 配下に配置しています（stretch / massage / organ-care）。
- VOICEVOX によるバッチ生成スクリプト例を `generate_voicevox_audio.py` に同梱。
- ステップ音声のパスは `src/lib/audio/audio-paths.ts` で管理しています。

---

## 🗂️ 主なディレクトリ

```
src/
├─ app/            # App Router エントリ
├─ components/     # UI コンポーネント
├─ hooks/          # 共通フック (useStepAudio 等)
├─ lib/            # データ／ストレージ／ユーティリティ
└─ types/          # TypeScript 型定義
public/
├─ audio/          # 音声ファイル
└─ icons/          # PWA 用アイコン
```

---

## ☁️ デプロイ（Vercel）

プロジェクトは Vercel にデプロイすることを前提としています。

```bash
# Vercel への初回ログイン
npx vercel login

# プロジェクト紐付け（初回のみ）
npx vercel link

# 本番デプロイ
npx vercel --prod
```

現在の本番 URL（2025-11-02 時点）:  
https://app019-syukan-tracker-7vjkhft1s.vercel.app

---

## 📝 ライセンス

このリポジトリのコードおよびドキュメントの取り扱いについては、プロジェクト関係者の合意に従ってください。

---

## 📮 フィードバック

バグ報告や改善要望があれば Issue または Pull Request でお知らせください。セルフケア習慣を続けやすくするためのアイデアも大歓迎です！
