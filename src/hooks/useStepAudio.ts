'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseStepAudioOptions {
  getAudioSrc: (stepIndex: number) => string | null
  onEnded?: (stepIndex: number) => void
  playbackRate?: number
}

interface UseStepAudioResult {
  isSupported: boolean
  isPlaying: boolean
  isAudioAvailable: boolean
  lastError: string | null
  play: (stepIndex: number) => Promise<void>
  pause: () => void
  stop: () => void
}

const isAudioSupported = () => typeof window !== 'undefined' && typeof Audio !== 'undefined'

export function useStepAudio({ getAudioSrc, onEnded, playbackRate = 1 }: UseStepAudioOptions): UseStepAudioResult {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAudioAvailable, setIsAudioAvailable] = useState(true)
  const [lastError, setLastError] = useState<string | null>(null)
  const supported = isAudioSupported()

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current.load()
      audioRef.current = null
    }
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    return () => {
      cleanupAudio()
    }
  }, [cleanupAudio])

  const play = useCallback(
    async (stepIndex: number) => {
      if (!supported) {
        setLastError('この環境では音声再生が利用できません。')
        setIsAudioAvailable(false)
        return
      }

      const src = getAudioSrc(stepIndex)
      if (!src) {
        setLastError('音声ファイルが見つかりません。')
        setIsAudioAvailable(false)
        return
      }

      cleanupAudio()

      const audio = new Audio(src)
      audio.playbackRate = playbackRate
      audioRef.current = audio
      audio.onended = () => {
        setIsPlaying(false)
        onEnded?.(stepIndex)
      }
      audio.onerror = () => {
        setIsPlaying(false)
        setIsAudioAvailable(false)
        setLastError('音声ファイルの読み込みに失敗しました。')
      }

      try {
        await audio.play()
        setIsPlaying(true)
        setIsAudioAvailable(true)
        setLastError(null)
      } catch (error) {
        console.error('音声再生が開始できませんでした:', error)
        setIsPlaying(false)
        setIsAudioAvailable(false)
        setLastError('音声再生がブロックされました。画面をタップしてから再生してください。')
      }
    },
    [cleanupAudio, getAudioSrc, onEnded, playbackRate, supported]
  )

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }, [])

  return {
    isSupported: supported,
    isPlaying,
    isAudioAvailable,
    lastError,
    play,
    pause,
    stop
  }
}
