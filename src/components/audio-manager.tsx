"use client"

import { useEffect, useRef } from "react"

type SoundType = 'success' | 'error' | 'scan' | 'upload' | 'notification'

const soundSources: Record<SoundType, string> = {
  success: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA',
  error: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA',
  scan: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA',
  upload: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA',
  notification: 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA'
}

export function useAudioManager() {
  const audioElements = useRef<Record<SoundType, HTMLAudioElement>>({} as Record<SoundType, HTMLAudioElement>)

  useEffect(() => {
    // 初始化音频元素
    Object.keys(soundSources).forEach((key) => {
      const soundType = key as SoundType
      const audio = new Audio(soundSources[soundType])
      audioElements.current[soundType] = audio
    })

    return () => {
      // 清理
      Object.values(audioElements.current).forEach(audio => {
        audio.pause()
      })
    }
  }, [])

  const playSound = (type: SoundType) => {
    const audio = audioElements.current[type]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(err => console.log('Audio play error:', err))
    }
  }

  return {
    playSound
  }
}