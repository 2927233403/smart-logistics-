"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WarehouseSidebar } from "@/components/warehouse-sidebar"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { useAudioManager } from "@/components/audio-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Scan,
  Check,
  AlertCircle,
  Loader2,
  Smartphone,
  Settings,
  Scissors,
  Info,
  Keyboard
} from "lucide-react"

export default function ScanPage() {
  const { playSound, isSupported: audioSupported } = useAudioManager()
  const [scanMode, setScanMode] = useState<'inbound' | 'outbound'>('inbound')
  const [scanInput, setScanInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanHistory, setScanHistory] = useState<{
    original: string
    extracted: string
    type: 'inbound' | 'outbound'
    status: 'success' | 'error'
    message: string
    time: string
  }[]>([])
  
  const [isWechat, setIsWechat] = useState(false)
  const [wechatReady, setWechatReady] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  // 字段截取设置
  const [extractSettings, setExtractSettings] = useState({
    enabled: false,
    startPos: 0,
    length: 10,
    prefix: "",
    suffix: ""
  })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // 检测是否在微信环境中
    const ua = navigator.userAgent.toLowerCase()
    const isWechatBrowser = ua.includes('micromessenger')
    setIsWechat(isWechatBrowser)

    // 自动聚焦输入框
    const inputElement = document.getElementById('scan-input') as HTMLInputElement
    if (inputElement) {
      inputElement.focus()
    }

    // 如果在微信中，初始化微信JS-SDK
    if (isWechatBrowser) {
      initWechatSDK()
    }
  }, [])

  // 初始化微信JS-SDK
  const initWechatSDK = () => {
    if (typeof (window as any).wx !== 'undefined') {
      (window as any).wx.ready(() => {
        setWechatReady(true)
        console.log('WeChat JS-SDK ready')
      })
      
      ;(window as any).wx.error((res: any) => {
        console.error('WeChat JS-SDK error:', res)
        setWechatReady(false)
      })
    }
  }

  // 截取字段功能
  const extractField = (input: string): string => {
    if (!extractSettings.enabled) return input

    let result = input

    // 截取指定位置和长度的字段
    if (extractSettings.length > 0) {
      result = input.substring(extractSettings.startPos, extractSettings.startPos + extractSettings.length)
    }

    // 添加前缀和后缀
    if (extractSettings.prefix) {
      result = extractSettings.prefix + result
    }
    if (extractSettings.suffix) {
      result = result + extractSettings.suffix
    }

    return result
  }

  // 处理扫码结果
  const handleScanResult = (result: string) => {
    setScanInput(result)
    
    // 自动执行扫码处理
    setTimeout(() => {
      processScan(result)
    }, 100)
  }

  // 处理扫码
  const processScan = (code: string) => {
    if (!code.trim()) return

    setIsScanning(true)
    if (audioSupported) playSound('scan')

    // 模拟扫码处理
    setTimeout(() => {
      const original = code.trim()
      const extracted = extractField(original)
      const success = Math.random() > 0.1 // 90% 成功率

      const historyItem = {
        original: original,
        extracted: extracted,
        type: scanMode,
        status: (success ? 'success' : 'error') as 'success' | 'error',
        message: success ? `识别成功: ${extracted}` : '商品不存在',
        time: new Date().toLocaleTimeString()
      }

      setScanHistory(prev => [historyItem, ...prev])
      setScanInput("")
      setIsScanning(false)
      
      // 播放结果音效
      if (audioSupported) playSound(success ? 'success' : 'error')

      // 重新聚焦
      const inputElement = document.getElementById('scan-input') as HTMLInputElement
      if (inputElement) {
        inputElement.focus()
      }
    }, 500)
  }

  // 手动扫码按钮
  const handleManualScan = () => {
    processScan(scanInput)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualScan()
    }
  }

  // 微信扫码调用
  const handleWechatScan = () => {
    if (!isWechat) {
      alert('请在微信浏览器中打开此页面以使用微信扫码功能')
      return
    }

    if (typeof (window as any).wx === 'undefined') {
      alert('微信JS-SDK未加载，请刷新页面重试')
      return
    }

    try {
      ;(window as any).wx.scanQRCode({
        needResult: 1,
        scanType: ['qrCode', 'barCode'],
        success: (res: any) => {
          const result = res.resultStr
          if (result) {
            handleScanResult(result)
          }
        },
        fail: (err: any) => {
          console.error('微信扫码失败:', err)
          alert('扫码失败，请重试')
        }
      })
    } catch (error) {
      console.error('调用微信扫码失败:', error)
      alert('调用微信扫码失败，请确保在微信环境中打开')
    }
  }

  // 摄像头错误处理
  const handleCameraError = (error: string) => {
    console.error('Camera error:', error)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <div className="lg:w-64">
            <WarehouseSidebar title="过机端口" icon={Scan} />
          </div>

          {/* 主内容区 */}
          <div className="flex-1">
            {/* 扫码模式选择 */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex gap-4 mb-6">
                  <Button
                    className={`flex-1 py-4 ${scanMode === 'inbound' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                    onClick={() => setScanMode('inbound')}
                  >
                    入库扫码
                  </Button>
                  <Button
                    className={`flex-1 py-4 ${scanMode === 'outbound' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                    onClick={() => setScanMode('outbound')}
                  >
                    出库扫码
                  </Button>
                </div>

                {/* 字段截取设置 */}
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-slate-900 flex items-center">
                      <Scissors className="h-4 w-4 mr-2" />
                      字段截取设置
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      {showSettings ? '收起' : '展开'}
                    </Button>
                  </div>

                  {showSettings && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="extract-enabled"
                          checked={extractSettings.enabled}
                          onChange={(e) => setExtractSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                          className="w-4 h-4"
                        />
                        <label htmlFor="extract-enabled" className="text-sm text-slate-700">启用字段截取</label>
                      </div>

                      {extractSettings.enabled && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">起始位置</label>
                            <Input
                              type="number"
                              value={extractSettings.startPos}
                              onChange={(e) => setExtractSettings(prev => ({ ...prev, startPos: parseInt(e.target.value) || 0 }))}
                              min={0}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">截取长度</label>
                            <Input
                              type="number"
                              value={extractSettings.length}
                              onChange={(e) => setExtractSettings(prev => ({ ...prev, length: parseInt(e.target.value) || 0 }))}
                              min={1}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">前缀</label>
                            <Input
                              value={extractSettings.prefix}
                              onChange={(e) => setExtractSettings(prev => ({ ...prev, prefix: e.target.value }))}
                              placeholder="可选"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">后缀</label>
                            <Input
                              value={extractSettings.suffix}
                              onChange={(e) => setExtractSettings(prev => ({ ...prev, suffix: e.target.value }))}
                              placeholder="可选"
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}

                      {extractSettings.enabled && (
                        <div className="text-xs text-slate-500 bg-white p-2 rounded">
                          示例: 输入 "ABC123456XYZ" → 输出 "{extractField('ABC123456XYZ')}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 扫码输入区 */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      id="scan-input"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="请扫描或输入条码..."
                      className="w-full text-lg"
                      autoFocus
                    />
                  </div>
                  <Button
                    onClick={handleManualScan}
                    disabled={isScanning || !scanInput.trim()}
                    className={`${scanMode === 'inbound' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'} text-white px-8`}
                  >
                    {isScanning ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Scan className="h-5 w-5" />
                    )}
                    <span className="ml-2">扫码</span>
                  </Button>
                </div>

                {/* 扫码方式选择 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 摄像头扫码 */}
                  <Card className={`border-2 ${showScanner ? 'border-green-400 bg-green-50' : 'border-dashed border-slate-300'}`}>
                    <CardContent className="p-6">
                      {!showScanner ? (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Scan className="h-8 w-8 text-slate-400" />
                          </div>
                          <h4 className="font-medium text-slate-900 mb-2">摄像头扫码</h4>
                          <p className="text-sm text-slate-500 mb-4">使用设备摄像头扫描二维码或条码</p>
                          <Button 
                            onClick={() => setShowScanner(true)}
                            variant="outline"
                            className="w-full"
                          >
                            <Scan className="h-4 w-4 mr-2" />
                            打开扫描器
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-slate-900 flex items-center">
                              <Scan className="h-4 w-4 mr-2" />
                              摄像头扫码
                            </h4>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setShowScanner(false)}
                            >
                              收起
                            </Button>
                          </div>
                          <BarcodeScanner 
                            onScan={handleScanResult}
                            onError={handleCameraError}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* 微信扫码 */}
                  <Card className={`border-2 ${isWechat ? 'border-green-400 bg-green-50' : 'border-dashed border-green-300'}`}>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="h-8 w-8 text-green-500" />
                      </div>
                      <h4 className="font-medium text-slate-900 mb-2">微信扫码</h4>
                      <p className="text-sm text-slate-500 mb-4">
                        {isWechat ? '点击按钮调用微信扫一扫' : '请在微信浏览器中打开'}
                      </p>
                      
                      {/* 微信环境提示 */}
                      {isWechat && !wechatReady && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-yellow-500 mt-0.5" />
                            <p className="text-xs text-yellow-600">微信JS-SDK加载中...</p>
                          </div>
                        </div>
                      )}
                      
                      <Button
                        onClick={handleWechatScan}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={!isWechat}
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        微信扫码
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* 手动输入提示 */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Keyboard className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">提示</p>
                      <p className="mt-1">如果没有摄像头，可以直接在上方输入框中手动输入条码，然后点击"扫码"按钮。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 扫码历史 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">扫码历史</h3>
                {scanHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Scan className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                    <p>暂无扫码记录</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scanHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {item.status === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {item.type === 'inbound' ? '入库' : '出库'}: {item.extracted}
                            </p>
                            <p className="text-sm text-slate-500">
                              原始: {item.original} | {item.time}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          item.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'success' ? '成功' : '失败'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}