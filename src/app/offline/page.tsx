'use client'

import Link from 'next/link'

export default function Offline() {
  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-6 text-center space-y-6">
      <div className="text-6xl">🌤️</div>
      <h1 className="text-2xl font-semibold text-amber-900">オフラインみたいです</h1>
      <p className="text-amber-800">
        ネットワークに接続できたら、セルフケアの続きを始めましょう。
        一度アクセスしたコンテンツはネット復帰後に自動で更新されます。
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2 text-white shadow-sm transition hover:bg-amber-700"
      >
        ホームに戻る
      </Link>
    </main>
  )
}
