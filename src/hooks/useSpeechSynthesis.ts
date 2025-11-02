'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { VoiceSettings } from '@/types'

interface UseSpeechSynthesisProps {
  autoStart?: boolean
  voiceSettings?: Partial<VoiceSettings>
}

export function useSpeechSynthesis(props: UseSpeechSynthesisProps = {}) {
  const [isSupported, setIsSupported] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  // デフォルト設定
  const defaultSettings = useMemo<VoiceSettings>(() => ({
    lang: 'ja-JP',
    rate: 0.8,
    pitch: 1.0,
    volume: 0.9,
    ...props.voiceSettings
  }), [props.voiceSettings])

  // 音声合成サポート確認
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)

      // 利用可能な音声を取得
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      loadVoices()
      speechSynthesis.addEventListener('voiceschanged', loadVoices)

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      }
    }
  }, [])

  // 日本語音声を取得
  const getJapaneseVoice = useCallback(() => {
    return voices.find(voice =>
      voice.lang.includes('ja') ||
      voice.name.includes('Japanese') ||
      voice.name.includes('Japan')
    ) || voices[0] || null
  }, [voices])

  // 音声再生
  const speak = useCallback((text: string, settings?: Partial<VoiceSettings>) => {
    if (!isSupported || !text.trim()) return Promise.resolve()

    return new Promise<void>((resolve, reject) => {
      // 既存の音声を停止
      if (currentUtterance) {
        speechSynthesis.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)
      const finalSettings = { ...defaultSettings, ...settings }

      // 音声設定を適用
      utterance.lang = finalSettings.lang
      utterance.rate = finalSettings.rate
      utterance.pitch = finalSettings.pitch
      utterance.volume = finalSettings.volume

      // 日本語音声を設定
      const japaneseVoice = getJapaneseVoice()
      if (japaneseVoice) {
        utterance.voice = japaneseVoice
      }

      // イベントハンドラー
      utterance.onstart = () => {
        setIsPlaying(true)
        setCurrentUtterance(utterance)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentUtterance(null)
        resolve()
      }

      utterance.onerror = (event) => {
        setIsPlaying(false)
        setCurrentUtterance(null)
        reject(event.error)
      }

      utterance.onpause = () => {
        setIsPlaying(false)
      }

      utterance.onresume = () => {
        setIsPlaying(true)
      }

      try {
        speechSynthesis.speak(utterance)
      } catch (error) {
        reject(error)
      }
    })
  }, [isSupported, currentUtterance, defaultSettings, getJapaneseVoice])

  // 音声停止
  const stop = useCallback(() => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentUtterance(null)
    }
  }, [])

  // 一時停止
  const pause = useCallback(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setIsPlaying(false)
    }
  }, [])

  // 再開
  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
      setIsPlaying(true)
    }
  }, [])

  // 複数テキストの連続再生
  const speakSequence = useCallback(async (
    texts: string[],
    settings?: Partial<VoiceSettings>,
    onProgress?: (index: number, total: number) => void
  ) => {
    for (let i = 0; i < texts.length; i++) {
      if (onProgress) {
        onProgress(i, texts.length)
      }

      try {
        await speak(texts[i], settings)

        // 各テキスト間に短い間隔
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error('音声再生エラー:', error)
        break
      }
    }

    if (onProgress) {
      onProgress(texts.length, texts.length)
    }
  }, [speak])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (currentUtterance) {
        speechSynthesis.cancel()
      }
    }
  }, [currentUtterance])

  return {
    isSupported,
    isPlaying,
    voices,
    japaneseVoice: getJapaneseVoice(),
    speak,
    speakSequence,
    stop,
    pause,
    resume,
    currentUtterance
  }
}
