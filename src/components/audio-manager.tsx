"use client"

import { useEffect, useRef, useState } from "react"

type SoundType = 'success' | 'error' | 'scan' | 'upload' | 'notification'

export function useAudioManager() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // 初始化音频上下文，添加错误处理
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported in this browser')
        setIsSupported(false)
        return
      }

      audioContextRef.current = new AudioContextClass()
      console.log('AudioContext initialized successfully')
    } catch (error) {
      console.warn('Failed to initialize AudioContext:', error)
      setIsSupported(false)
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => {
          console.warn('Error closing AudioContext:', err)
        })
      }
    }
  }, [])

  const playSound = (type: SoundType) => {
    // 检查是否支持
    if (!isSupported) {
      console.log('Audio not supported, skipping sound:', type)
      return
    }

    const audioContext = audioContextRef.current
    if (!audioContext) {
      console.log('AudioContext not available, skipping sound:', type)
      return
    }

    try {
      // 恢复音频上下文（如果被挂起）
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(err => {
          console.warn('Failed to resume AudioContext:', err)
        })
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      switch (type) {
        case 'success':
          // 成功音效：高音调上升（C5 → G5 → C6）
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.1)
          oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
          break

        case 'error':
          // 错误音效：低音调下降
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
          break

        case 'scan':
          // 扫码音效：短促的哔声
          oscillator.type = 'square'
          oscillator.frequency.setValueAtTime(1200, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.1)
          break

        case 'upload':
          // 上传音效：连续的上升音
          oscillator.type = 'triangle'
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
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.15)
          gainNode.gain.setValueAtTime(0.25, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
          break
      }
    } catch (error) {
      console.warn('Error playing sound:', error)
    }
  }

  return {
    playSound,
    isSupported
  }
}