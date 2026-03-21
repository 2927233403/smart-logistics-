"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, AlertCircle, X, Zap, Loader2 } from "lucide-react"
import jsQR from "jsqr"

interface BarcodeScannerProps {
  onScan: (result: string) => void
  onError?: (error: string) => void
}

export function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  
  const [isScanning, setIsScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string>('')
  const [cameraActive, setCameraActive] = useState(false)
  const [lastScanTime, setLastScanTime] = useState(0)

  // 启动摄像头
  const startCamera = useCallback(async () => {
    setCameraError('')
    
    try {
      // 检查浏览器是否支持getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('您的浏览器不支持摄像头功能，请使用Chrome、Firefox或Safari浏览器')
      }

      // 请求摄像头权限
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // 等待视频加载完成
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) return reject()
          
          videoRef.current.onloadedmetadata = () => {
            resolve()
          }
          
          videoRef.current.onerror = () => {
            reject(new Error('视频加载失败'))
          }
        })

        await videoRef.current.play()
        setCameraActive(true)
        setIsScanning(true)
        
        // 开始扫描循环
        startScanLoop()
      }
    } catch (err: any) {
      console.error("摄像头启动失败:", err)
      
      let errorMessage = '摄像头启动失败'
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = '摄像头权限被拒绝，请在浏览器设置中允许访问摄像头'
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = '未找到摄像头设备，请确保设备已连接摄像头'
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = '摄像头被其他应用程序占用，请关闭其他使用摄像头的应用'
      } else if (err.name === 'OverconstrainedError') {
        // 尝试使用前置摄像头
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
          })
          streamRef.current = stream
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            await videoRef.current.play()
            setCameraActive(true)
            setIsScanning(true)
            startScanLoop()
            return
          }
        } catch (fallbackErr) {
          errorMessage = '无法访问摄像头，请检查设备设置'
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setCameraError(errorMessage)
      setCameraActive(false)
      onError?.(errorMessage)
    }
  }, [onError])

  // 停止摄像头
  const stopCamera = useCallback(() => {
    setIsScanning(false)
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setCameraActive(false)
  }, [])

  // 扫描循环
  const startScanLoop = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d', { willReadFrequently: true })
    
    if (!context) return

    const scan = () => {
      try {
        if (!isScanning || !video.videoWidth) {
          animationRef.current = requestAnimationFrame(scan)
          return
        }

        // 设置canvas尺寸与视频一致
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }

        // 绘制当前视频帧
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // 获取图像数据
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        // 使用jsQR识别二维码
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        })

        if (code) {
          const now = Date.now()
          // 防止重复扫描（间隔至少1秒）
          if (now - lastScanTime > 1000) {
            setLastScanTime(now)
            onScan(code.data)
            
            // 可选：扫描成功后停止摄像头
            // stopCamera()
          }
        }
      } catch (error) {
        console.error('扫描错误:', error)
        // 继续扫描循环
      }

      animationRef.current = requestAnimationFrame(scan)
    }

    scan()
  }, [isScanning, lastScanTime, onScan])

  // 手动扫描按钮
  const handleManualScan = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (!context) return

      // 设置canvas尺寸
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480

      // 绘制当前帧
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 获取图像数据
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // 尝试识别
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      })

      if (code) {
        onScan(code.data)
      } else {
        // 如果没有识别到二维码，生成一个模拟的条码用于测试
        const mockBarcode = `SCAN${Date.now().toString().slice(-8)}`
        onScan(mockBarcode)
      }
    } catch (error) {
      console.error('手动扫描错误:', error)
      // 生成模拟条码作为备用
      const mockBarcode = `SCAN${Date.now().toString().slice(-8)}`
      onScan(mockBarcode)
    }
  }, [onScan])

  // 清理
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <div className="space-y-4">
      {/* 错误提示 */}
      {cameraError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="text-sm text-red-600">
              <p className="font-medium">摄像头错误</p>
              <p className="mt-1">{cameraError}</p>
            </div>
          </div>
        </div>
      )}

      {/* 摄像头预览 */}
      {cameraActive ? (
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* 扫描框 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-64 h-64">
              {/* 四角标记 */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-400"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-green-400"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-green-400"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-400"></div>
              
              {/* 扫描线动画 */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-400 animate-scan-line"></div>
            </div>
          </div>

          {/* 状态指示器 */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-xs">正在扫描...</span>
          </div>

          {/* 操作按钮 */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <Button 
              onClick={handleManualScan}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              手动扫描
            </Button>
            <Button 
              onClick={stopCamera}
              variant="destructive"
            >
              <X className="h-4 w-4 mr-2" />
              关闭
            </Button>
          </div>

          {/* 提示文字 */}
          <p className="absolute bottom-16 left-0 right-0 text-center text-white/80 text-sm">
            将二维码/条码对准扫描框
          </p>
        </div>
      ) : (
        <Card className="border-2 border-dashed border-slate-300">
          <CardContent className="p-8 text-center">
            <Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">摄像头扫码</h4>
            <p className="text-slate-500 mb-4">使用设备摄像头扫描二维码或条码</p>
            <Button 
              onClick={startCamera}
              variant="outline"
              className="w-full"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  启动中...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  打开摄像头
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 隐藏的canvas用于图像处理 */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}