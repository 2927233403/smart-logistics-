"use client"

import { useEffect, useState } from "react"

interface SmartChineseLogoProps {
  variant?: "default" | "admin" | "mini"
  animated?: boolean
  className?: string
}

export default function SmartChineseLogo({ 
  variant = "default", 
  animated = true,
  className = "" 
}: SmartChineseLogoProps) {
  const [progress, setProgress] = useState(0)
  const [glowIntensity, setGlowIntensity] = useState(0)

  useEffect(() => {
    if (!animated) return
    
    // 文字绘制动画
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let current = 0
    
    const timer = setInterval(() => {
      current++
      setProgress((current / steps) * 100)
      if (current >= steps) {
        clearInterval(timer)
        // 动画完成后启动发光效果
        let glow = 0
        let increasing = true
        const glowTimer = setInterval(() => {
          if (increasing) {
            glow += 0.05
            if (glow >= 1) increasing = false
          } else {
            glow -= 0.05
            if (glow <= 0.3) increasing = true
          }
          setGlowIntensity(glow)
        }, 100)
        return () => clearInterval(glowTimer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [animated])

  const getGradientColors = () => {
    switch (variant) {
      case "admin":
        return {
          primary: "#3B82F6",
          secondary: "#8B5CF6",
          accent: "#06B6D4"
        }
      case "mini":
        return {
          primary: "#10B981",
          secondary: "#3B82F6",
          accent: "#8B5CF6"
        }
      default:
        return {
          primary: "#06B6D4",
          secondary: "#3B82F6",
          accent: "#8B5CF6"
        }
    }
  }

  const colors = getGradientColors()

  // 计算描边动画的 stroke-dashoffset
  const getStrokeOffset = (pathLength: number) => {
    return pathLength - (pathLength * progress) / 100
  }

  if (variant === "mini") {
    return (
      <svg 
        viewBox="0 0 80 80" 
        className={className}
        style={{ filter: `drop-shadow(0 0 ${glowIntensity * 10}px ${colors.primary})` }}
      >
        <defs>
          <linearGradient id="miniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.accent} />
          </linearGradient>
          <filter id="miniGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 外圈 */}
        <circle 
          cx="40" 
          cy="40" 
          r="36" 
          fill="none" 
          stroke="url(#miniGradient)" 
          strokeWidth="2"
          strokeDasharray="226"
          strokeDashoffset={getStrokeOffset(226)}
          style={{ transition: "stroke-dashoffset 0.1s ease" }}
        />
        
        {/* 智字简化 */}
        <g fill="none" stroke="url(#miniGradient)" strokeWidth="3" strokeLinecap="round">
          {/* 日 */}
          <rect x="22" y="20" width="16" height="18" rx="2" 
            strokeDasharray="68" 
            strokeDashoffset={getStrokeOffset(68)}
          />
          <line x1="30" y1="20" x2="30" y2="38" 
            strokeDasharray="18" 
            strokeDashoffset={getStrokeOffset(18)}
          />
          {/* 运 */}
          <path d="M46 24 L62 24 M54 20 L54 28 M48 32 Q54 32 60 32 Q60 40 54 40 Q48 40 48 32" 
            strokeDasharray="80" 
            strokeDashoffset={getStrokeOffset(80)}
          />
        </g>
        
        {/* 底部装饰线 */}
        <line 
          x1="20" 
          y1="55" 
          x2="60" 
          y2="55" 
          stroke="url(#miniGradient)" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="40"
          strokeDashoffset={getStrokeOffset(40)}
        />
      </svg>
    )
  }

  return (
    <svg 
      viewBox="0 0 400 120" 
      className={className}
      style={{ filter: `drop-shadow(0 0 ${glowIntensity * 15}px ${colors.primary}50)` }}
    >
      <defs>
        {/* 渐变定义 */}
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.primary}>
            {animated && (
              <animate attributeName="stop-color" 
                values={`${colors.primary};${colors.accent};${colors.primary}`} 
                dur="4s" 
                repeatCount="indefinite" 
              />
            )}
          </stop>
          <stop offset="50%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.accent}>
            {animated && (
              <animate attributeName="stop-color" 
                values={`${colors.accent};${colors.primary};${colors.accent}`} 
                dur="4s" 
                repeatCount="indefinite" 
              />
            )}
          </stop>
        </linearGradient>
        
        {/* 发光滤镜 */}
        <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        
        {/* 科技感网格背景 */}
        <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="0.3"/>
        </pattern>
        
        {/* 扫描线效果 */}
        <linearGradient id="scanLine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor={colors.accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      
      {/* 背景网格 */}
      <rect x="0" y="0" width="400" height="120" fill="url(#gridPattern)" opacity="0.3" />
      
      {/* 主文字组 */}
      <g transform="translate(20, 20)">
        {/* 智字 - 科技感设计 */}
        <g transform="translate(0, 0)">
          {/* 日字旁 */}
          <rect 
            x="10" y="10" width="50" height="60" rx="4" 
            fill="none" 
            stroke="url(#textGradient)" 
            strokeWidth="3"
            strokeDasharray="220"
            strokeDashoffset={getStrokeOffset(220)}
            style={{ transition: "stroke-dashoffset 0.1s ease" }}
          />
          <line x1="35" y1="10" x2="35" y2="70" 
            stroke="url(#textGradient)" 
            strokeWidth="2"
            strokeDasharray="60"
            strokeDashoffset={getStrokeOffset(60)}
          />
          <line x1="10" y1="40" x2="60" y2="40" 
            stroke="url(#textGradient)" 
            strokeWidth="2"
            strokeDasharray="50"
            strokeDashoffset={getStrokeOffset(50)}
          />
          
          {/* 知字旁 - 矢 */}
          <path d="M75 15 L95 15 M85 10 L85 35 M75 25 L105 20" 
            stroke="url(#textGradient)" 
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="100"
            strokeDashoffset={getStrokeOffset(100)}
          />
          <path d="M75 45 Q85 42 95 45 Q95 55 85 58 Q75 55 75 45" 
            stroke="url(#textGradient)" 
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="60"
            strokeDashoffset={getStrokeOffset(60)}
          />
          <line x1="85" y1="35" x2="85" y2="70" 
            stroke="url(#textGradient)" 
            strokeWidth="2"
            strokeDasharray="35"
            strokeDashoffset={getStrokeOffset(35)}
          />
          
          {/* 科技感装饰点 */}
          <circle cx="35" cy="25" r="3" fill={colors.accent} opacity={progress / 100}>
            {animated && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />}
          </circle>
          <circle cx="35" cy="55" r="3" fill={colors.accent} opacity={progress / 100}>
            {animated && <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />}
          </circle>
        </g>
        
        {/* 运字 - 科技感设计 */}
        <g transform="translate(120, 0)">
          {/* 云字旁 */}
          <path d="M10 25 Q25 15 40 25 Q55 15 70 25 Q75 35 65 40 Q55 45 40 40 Q25 45 15 40 Q5 35 10 25" 
            stroke="url(#textGradient)" 
            strokeWidth="3"
            fill="none"
            strokeDasharray="200"
            strokeDashoffset={getStrokeOffset(200)}
          />
          
          {/* 辶字旁 */}
          <path d="M85 20 L85 60 M85 30 Q100 25 110 35 Q115 45 105 50 Q95 55 85 50" 
            stroke="url(#textGradient)" 
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="120"
            strokeDashoffset={getStrokeOffset(120)}
          />
          
          {/* 底部横线 */}
          <line x1="75" y1="65" x2="115" y2="65" 
            stroke="url(#textGradient)" 
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="40"
            strokeDashoffset={getStrokeOffset(40)}
          />
          
          {/* 科技感装饰 */}
          <circle cx="40" cy="30" r="2" fill={colors.primary} opacity={progress / 100}>
            {animated && <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />}
          </circle>
        </g>
        
        {/* 物流文字 */}
        <g transform="translate(240, 15)">
          <text 
            x="0" 
            y="45" 
            fill="url(#textGradient)" 
            fontSize="36" 
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="700"
            letterSpacing="8"
            opacity={progress / 100}
          >
            物流
          </text>
          
          {/* 英文副标题 */}
          <text 
            x="0" 
            y="70" 
            fill={colors.secondary} 
            fontSize="12" 
            fontFamily="monospace"
            letterSpacing="4"
            opacity={(progress / 100) * 0.8}
          >
            SMART LOGISTICS
          </text>
        </g>
      </g>
      
      {/* 扫描线动画 */}
      {animated && progress >= 100 && (
        <rect x="0" y="0" width="400" height="10" fill="url(#scanLine)">
          <animate attributeName="y" values="-10;130;-10" dur="3s" repeatCount="indefinite" />
        </rect>
      )}
      
      {/* 边框装饰 */}
      <rect 
        x="5" 
        y="5" 
        width="390" 
        height="110" 
        rx="8" 
        fill="none" 
        stroke="url(#textGradient)" 
        strokeWidth="1"
        strokeDasharray="20 10"
        opacity={progress / 200}
      >
        {animated && (
          <animate attributeName="stroke-dashoffset" values="0;30" dur="2s" repeatCount="indefinite" />
        )}
      </rect>
      
      {/* 角落装饰 */}
      <g opacity={progress / 100}>
        <path d="M10 30 L10 10 L30 10" fill="none" stroke={colors.accent} strokeWidth="2" />
        <path d="M370 10 L390 10 L390 30" fill="none" stroke={colors.accent} strokeWidth="2" />
        <path d="M10 90 L10 110 L30 110" fill="none" stroke={colors.accent} strokeWidth="2" />
        <path d="M370 110 L390 110 L390 90" fill="none" stroke={colors.accent} strokeWidth="2" />
      </g>
    </svg>
  )
}
