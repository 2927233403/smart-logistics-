"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Scan,
  Package,
  Truck,
  BarChart2,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"

export default function ScanPage() {
  const [scanMode, setScanMode] = useState<'inbound' | 'outbound'>('inbound')
  const [scanInput, setScanInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanHistory, setScanHistory] = useState<{
    sku: string
    type: 'inbound' | 'outbound'
    status: 'success' | 'error'
    message: string
    time: string
  }[]>([])
  const [cameraActive, setCameraActive] = useState(false)

  useEffect(() => {
    // 模拟扫码自动聚焦
    const inputElement = document.getElementById('scan-input') as HTMLInputElement
    if (inputElement) {
      inputElement.focus()
    }
  }, [])

  const handleScan = () => {
    if (!scanInput.trim()) return
    
    setIsScanning(true)
    
    // 模拟扫码处理
    setTimeout(() => {
      const success = Math.random() > 0.1 // 90% 成功率
      const historyItem = {
        sku: scanInput.trim(),
        type: scanMode,
        status: (success ? 'success' : 'error') as 'success' | 'error',
        message: success ? '扫码成功' : '商品不存在',
        time: new Date().toLocaleTimeString()
      }
      
      setScanHistory(prev => [historyItem, ...prev])
      setScanInput("")
      setIsScanning(false)
      
      // 重新聚焦
      const inputElement = document.getElementById('scan-input') as HTMLInputElement
      if (inputElement) {
        inputElement.focus()
      }
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan()
    }
  }

  const toggleCamera = () => {
    setCameraActive(!cameraActive)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <div className="lg:w-64">
            <Card className="h-full">
              <CardContent className="p-0">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <Scan className="mr-2 h-6 w-6 text-purple-600" />
                    过机端口
                  </h2>
                </div>
                <div className="p-4">
                  <Link href="/warehouse">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <BarChart2 className="h-5 w-5" />
                      <span>仓库概览</span>
                    </button>
                  </Link>
                  <Link href="/warehouse/inbound">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Package className="h-5 w-5" />
                      <span>入库管理</span>
                    </button>
                  </Link>
                  <Link href="/warehouse/outbound">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Truck className="h-5 w-5" />
                      <span>出库管理</span>
                    </button>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 bg-purple-50 text-purple-600 font-medium">
                    <Scan className="h-5 w-5" />
                    <span>过机端口</span>
                  </button>
                </div>
              </CardContent>
            </Card>
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
                
                {/* 扫码区域 */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-6">
                  {cameraActive ? (
                    <div className="relative aspect-video bg-slate-900 rounded-lg mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-12 w-12 text-white animate-spin" />
                      </div>
                      <p className="absolute bottom-4 left-0 right-0 text-white text-sm">摄像头扫码模式</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Scan className="h-16 w-16 text-slate-400 mx-auto" />
                      <h3 className="text-lg font-semibold text-slate-900">{scanMode === 'inbound' ? '入库扫码' : '出库扫码'}</h3>
                      <p className="text-slate-500">请扫描商品条码或手动输入SKU</p>
                    </div>
                  )}
                  
                  <div className="mt-6 flex gap-3">
                    <Input 
                      id="scan-input"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="请输入SKU或扫描条码"
                      className="flex-1"
                      disabled={isScanning}
                    />
                    <Button 
                      onClick={handleScan}
                      disabled={isScanning || !scanInput.trim()}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          扫码中...
                        </>
                      ) : (
                        '扫码'
                      )}
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={toggleCamera}
                    variant="outline"
                    className="mt-4 border-slate-300 text-slate-700"
                  >
                    {cameraActive ? '关闭摄像头' : '打开摄像头'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* 扫码记录 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">扫码记录</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {scanHistory.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Scan className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                      <p>暂无扫码记录</p>
                    </div>
                  ) : (
                    scanHistory.map((item, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${item.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex items-center gap-3">
                          {item.status === 'success' ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium text-slate-900">{item.sku}</p>
                            <p className="text-sm text-slate-500">{item.type === 'inbound' ? '入库' : '出库'} · {item.time}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${item.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}