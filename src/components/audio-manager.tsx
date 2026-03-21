"use client"

import { useEffect, useRef } from "react"

type SoundType = 'success' | 'error' | 'scan' | 'upload' | 'notification'

export function useAudioManager() {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // 初始化音频上下文
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const playSound = (type: SoundType) => {
    const audioContext = audioContextRef.current
    if (!audioContext) return

    // 恢复音频上下文（如果被挂起）
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    switch (type) {
      case 'success':
        // 成功音效：高音调上升
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
        oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.1) // G5
        oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.2) // C6
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break

      case 'error':
        // 错误音效：低音调下降
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break

      case 'scan':
        // 扫码音效：短促的哔声
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
        break

      case 'upload':
        // 上传音效：连续的上升音
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.15)
        oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.4)
        break

      case 'notification':
        // 通知音效：双音调
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.15) // A5
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break
    }
  }

  return {
    playSound
  }
}