"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Package, Truck, MapPin, Clock, CheckCircle, 
  User, Phone, CreditCard, Calendar, Box, Weight, 
  ArrowRight, History, Sparkles, FileText, QrCode,
  Zap, Database, Activity, Shield, Globe, ChevronDown
} from "lucide-react"
import { mockOrders } from "@/data/mockData"
import { Order } from "@/types"

const statusMap: Record<string, { 
  label: string; 
  variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  color: string;
  bgColor: string;
  icon: any;
}> = {
  pending: { 
    label: "待处理", 
    variant: "warning",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    icon: Clock
  },
  assigned: { 
    label: "已分配", 
    variant: "secondary",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    icon: User
  },
  picked_up: { 
    label: "已提货", 
    variant: "default",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    icon: Package
  },
  in_transit: { 
    label: "运输中", 
    variant: "default",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    icon: Truck
  },
  delivered: { 
    label: "已送达", 
    variant: "success",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    icon: CheckCircle
  },
  cancelled: { 
    label: "已取消", 
    variant: "destructive",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    icon: Box
  },
}

// 模拟历史查询记录
const getSearchHistory = () => {
  if (typeof window !== 'undefined') {
    const history = localStorage.getItem('trackingSearchHistory')
    return history ? JSON.parse(history) : []
  }
  return []
}

const saveSearchHistory = (query: string) => {
  if (typeof window !== 'undefined' && query.trim()) {
    const history = getSearchHistory()
    const newHistory = [query, ...history.filter((h: string) => h !== query)].slice(0, 5)
    localStorage.setItem('trackingSearchHistory', JSON.stringify(newHistory))
  }
}

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [searched, setSearched] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [particleEffects, setParticleEffects] = useState(true)
  
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSearchHistory(getSearchHistory())
  }, [])

  // 点击外部关闭历史记录
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return

    setLoading(true)
    setProgress(0)
    setSearched(true)
    setShowHistory(false)

    // 模拟进度动画
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval)
          return 90
        }
        return p + 10
      })
    }, 50)

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    const found = mockOrders.find(o => 
      o.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm)
    )

    clearInterval(interval)
    setProgress(100)
    setOrder(found || null)
    setLoading(false)

    if (found) {
      saveSearchHistory(searchTerm)
      setSearchHistory(getSearchHistory())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearHistory = () => {
    localStorage.removeItem('trackingSearchHistory')
    setSearchHistory([])
  }

  // 获取当前状态信息
  const getCurrentStatus = (status: string) => {
    return statusMap[status] || statusMap.pending
  }

  // 计算运输进度百分比
  const getProgressPercent = (status: string) => {
    const progressMap: Record<string, number> = {
      pending: 10,
      assigned: 25,
      picked_up: 40,
      in_transit: 70,
      delivered: 100,
      cancelled: 0
    }
    return progressMap[status] || 0
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* 背景粒子效果 */}
      {particleEffects && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl" />
        </div>
      )}

      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section - 科技感设计 */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* 网格背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
          
          {/* 扫描线效果 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(34,211,238,0.03)_50%)] bg-[size:100%_4px] animate-[scan_10s_linear_infinite]" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* 科技感标签 */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-cyan-500/30 mb-8 group">
                <div className="relative">
                  <Zap className="h-5 w-5 text-cyan-400 animate-pulse" />
                  <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full animate-ping" />
                </div>
                <span className="text-cyan-300 font-medium tracking-wider">智能物流追踪系统 v2.0</span>
                <div className="h-4 w-px bg-cyan-500/30" />
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">在线</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent leading-tight">
                实时追踪
                <br />
                <span className="relative">
                  您的货物
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
                </span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                输入运单号或手机号，随时掌握货物运输状态
                <br />
                <span className="text-cyan-400">• 全程可视化 • 智能预测 • 实时同步</span>
              </p>
              
              {/* 搜索卡片 - 科技感设计 */}
              <div ref={searchContainerRef} className="relative">
                {/* 发光边框 */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                
                <Card className="relative bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl shadow-cyan-500/20 rounded-3xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        {/* 搜索图标带效果 */}
                        <div className="absolute left-5 top-1/2 -translate-y-1/2">
                          <div className="relative">
                            <Search className="h-6 w-6 text-cyan-400" />
                            <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full" />
                          </div>
                        </div>
                        
                        <Input 
                          ref={inputRef}
                          placeholder="请输入运单号或手机号查询"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onFocus={() => {
                            if (searchHistory.length > 0) {
                              setShowHistory(true)
                            }
                          }}
                          onClick={() => {
                            if (searchHistory.length > 0) {
                              setShowHistory(true)
                            }
                          }}
                          className="pl-14 pr-4 py-8 h-16 bg-slate-800/50 border-2 border-slate-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-2xl text-lg text-white placeholder:text-slate-500 transition-all duration-300 shadow-inner"
                        />
                        
                        {/* 历史记录下拉 - 科技感设计 */}
                        {showHistory && searchHistory.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-4 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-cyan-500/20 overflow-hidden z-50">
                            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/10 rounded-lg">
                                  <History className="h-4 w-4 text-cyan-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-300">最近查询记录</span>
                                <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-600">
                                  {searchHistory.length}条
                                </Badge>
                              </div>
                              <button 
                                onClick={clearHistory}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                              >
                                清除全部
                              </button>
                            </div>
                            <div className="py-2">
                              {searchHistory.map((item, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSearchQuery(item)
                                    handleSearch(item)
                                  }}
                                  className="w-full text-left px-6 py-4 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 flex items-center gap-4 group border-l-4 border-transparent hover:border-cyan-500"
                                >
                                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                    <Database className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-slate-300 font-medium group-hover:text-white transition-colors">{item}</span>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-all group-hover:translate-x-1" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button 
                        size="lg" 
                        onClick={() => handleSearch()}
                        disabled={loading}
                        className="h-16 px-10 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative flex items-center gap-3">
                          {loading ? (
                            <>
                              <span className="animate-spin">
                                <Activity className="h-6 w-6" />
                              </span>
                              <span>查询中...</span>
                            </>
                          ) : (
                            <>
                              <Search className="h-6 w-6" />
                              <span>立即查询</span>
                            </>
                          )}
                        </span>
                      </Button>
                    </div>

                    {/* 快速测试按钮 - 科技感设计 */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <span className="text-sm text-slate-500 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        快速测试：
                      </span>
                      {['ORD20240318001', 'ORD20240318002', 'ORD20240318003'].map((no) => (
                        <button
                          key={no}
                          onClick={() => {
                            setSearchQuery(no)
                            handleSearch(no)
                          }}
                          className="text-sm text-slate-400 hover:text-cyan-400 bg-slate-800/50 hover:bg-cyan-500/20 border border-slate-700/50 hover:border-cyan-500/50 px-4 py-2 rounded-xl transition-all duration-300 font-mono"
                        >
                          {no}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Loading Progress - 科技感设计 */}
        {loading && (
          <div className="fixed top-0 left-0 right-0 h-2 bg-slate-800 z-50">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
            </div>
          </div>
        )}

        {/* Results Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            {searched && !order && !loading && (
              <div className="text-center py-20">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-xl" />
                  <div className="relative w-full h-full bg-slate-800/50 rounded-full flex items-center justify-center border-2 border-slate-700/50">
                    <Package className="h-14 w-14 text-slate-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  未找到相关订单
                </h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  请检查运单号或手机号是否正确，或尝试以下方式
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" onClick={() => setSearchQuery('')} className="border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10">
                    重新输入
                  </Button>
                  <Button onClick={() => window.location.href = '/contact'} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
                    联系客服
                  </Button>
                </div>
              </div>
            )}

            {order && (
              <div className="max-w-6xl mx-auto space-y-8">
                {/* 状态概览卡片 - 科技感设计 */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-3xl blur-xl" />
                  <Card className="relative bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl shadow-cyan-500/20 rounded-3xl overflow-hidden">
                    {/* 顶部状态栏 */}
                    <div className={`h-2 bg-gradient-to-r ${
                      getCurrentStatus(order.status).color.includes('green') ? 'from-green-500 via-emerald-500 to-teal-500' :
                      getCurrentStatus(order.status).color.includes('yellow') ? 'from-yellow-500 via-orange-500 to-red-500' :
                      getCurrentStatus(order.status).color.includes('red') ? 'from-red-500 via-rose-500 to-pink-500' :
                      getCurrentStatus(order.status).color.includes('purple') ? 'from-purple-500 via-violet-500 to-fuchsia-500' :
                      'from-cyan-500 via-blue-500 to-indigo-500'
                    }`} />
                    
                    <CardHeader className="pb-6 pt-8">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex items-start gap-6">
                          <div className={`w-20 h-20 rounded-3xl ${getCurrentStatus(order.status).bgColor} flex items-center justify-center relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                            {(() => {
                              const StatusIcon = getCurrentStatus(order.status).icon
                              return <StatusIcon className={`h-10 w-10 ${getCurrentStatus(order.status).color} relative z-10`} />
                            })()}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-4 mb-2">
                              <CardTitle className="text-2xl md:text-3xl font-black text-white">
                                {order.orderNo}
                              </CardTitle>
                              <Badge 
                                variant={getCurrentStatus(order.status).variant}
                                className={`text-sm px-4 py-1.5 rounded-full font-medium ${getCurrentStatus(order.status).bgColor} ${getCurrentStatus(order.status).color} border-0`}
                              >
                                {getCurrentStatus(order.status).label}
                              </Badge>
                            </div>
                            <p className="text-slate-400 text-lg flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              下单时间：{new Date(order.createdAt).toLocaleString('zh-CN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" className="gap-2 border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10 bg-slate-800/50">
                            <QrCode className="h-4 w-4" />
                            分享
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10 bg-slate-800/50">
                            <FileText className="h-4 w-4" />
                            打印
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* 运输进度条 - 科技感设计 */}
                    <CardContent className="pt-0 pb-8">
                      <div className="mb-8">
                        <div className="flex justify-between text-sm text-slate-400 mb-4">
                          <span className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            运输进度
                          </span>
                          <span className="text-cyan-400 font-bold text-xl">{getProgressPercent(order.status)}%</span>
                        </div>
                        <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative">
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:20px_100%] animate-shine" />
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 relative"
                            style={{ width: `${getProgressPercent(order.status)}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          </div>
                        </div>
                        <div className="flex justify-between mt-6">
                          {['待处理', '已提货', '运输中', '已送达'].map((step, index) => {
                            const stepPercent = (index + 1) * 25
                            const currentPercent = getProgressPercent(order.status)
                            const isActive = currentPercent >= stepPercent
                            const isCurrent = currentPercent >= (index * 25) && currentPercent < stepPercent
                            
                            return (
                              <div key={step} className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full mb-3 transition-all duration-500 ${
                                  isActive ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50' : 
                                  isCurrent ? 'bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg shadow-blue-500/50 animate-pulse scale-125' : 
                                  'bg-slate-700'
                                }`} />
                                <span className={`text-xs ${isActive ? 'text-cyan-400 font-bold' : isCurrent ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                                  {step}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* 订单信息网格 - 科技感设计 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 发货地址 */}
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-5 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group">
                          <div className="flex items-center gap-3 text-slate-400 mb-3">
                            <div className="p-2 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-colors">
                              <MapPin className="h-5 w-5 text-orange-400" />
                            </div>
                            <span className="text-sm font-medium">发货地址</span>
                          </div>
                          <p className="font-bold text-white">{order.origin}</p>
                        </div>

                        {/* 收货地址 */}
                        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-5 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group">
                          <div className="flex items-center gap-3 text-cyan-400 mb-3">
                            <div className="p-2 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                              <MapPin className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium">收货地址</span>
                          </div>
                          <p className="font-bold text-white">{order.destination}</p>
                        </div>

                        {/* 货物信息 */}
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-5 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group">
                          <div className="flex items-center gap-3 text-slate-400 mb-3">
                            <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                              <Package className="h-5 w-5 text-purple-400" />
                            </div>
                            <span className="text-sm font-medium">货物信息</span>
                          </div>
                          <p className="font-bold text-white mb-1">{order.cargoType}</p>
                          <p className="text-sm text-slate-400 flex items-center gap-1">
                            <Weight className="h-4 w-4" />
                            {order.weight}kg · {order.volume}m³
                          </p>
                        </div>

                        {/* 预计送达 */}
                        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-5 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 group">
                          <div className="flex items-center gap-3 text-green-400 mb-3">
                            <div className="p-2 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                              <Clock className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium">预计送达</span>
                          </div>
                          <p className="font-bold text-white">
                            {new Date(order.estimatedDelivery).toLocaleDateString('zh-CN')}
                          </p>
                          <p className="text-sm text-green-400 flex items-center gap-1 mt-1">
                            <div className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </div>
                            {new Date(order.estimatedDelivery).toLocaleTimeString('zh-CN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* 客户信息 - 科技感设计 */}
                      <div className="mt-8 pt-8 border-t border-slate-700/50">
                        <h4 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-3 uppercase tracking-wider">
                          <div className="p-1.5 bg-slate-700/50 rounded-lg">
                            <User className="h-4 w-4 text-cyan-400" />
                          </div>
                          客户信息
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
                              <User className="h-6 w-6 text-cyan-400" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">客户姓名</p>
                              <p className="font-bold text-white">{order.customerName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:border-green-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-colors">
                              <Phone className="h-6 w-6 text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">联系电话</p>
                              <p className="font-bold text-white">{order.customerPhone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:border-purple-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-violet-500/30 transition-colors">
                              <CreditCard className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">运费金额</p>
                              <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                ¥{order.freight?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 物流轨迹时间线 - 科技感设计 */}
                <Card className="bg-slate-900/80 backdrop-blur-xl border-0 shadow-2xl shadow-cyan-500/20 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-6 pt-8">
                    <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                      <div className="p-2 bg-blue-500/10 rounded-xl">
                        <Truck className="h-6 w-6 text-blue-400" />
                      </div>
                      物流轨迹
                      <Badge variant="outline" className="ml-auto bg-slate-800 text-slate-400 border-slate-700">
                        {order.trackingEvents.length} 个节点
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <div className="relative">
                      {/* 时间线 */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-slate-700" />
                      <div className="space-y-0">
                        {order.trackingEvents.map((event, index) => {
                          const isLatest = index === 0
                          const StatusIcon = isLatest ? Truck : CheckCircle
                          
                          return (
                            <div key={event.id} className="relative flex gap-8 pb-10 last:pb-0 group">
                              <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                                isLatest 
                                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 group-hover:shadow-cyan-500/60 group-hover:scale-110' 
                                  : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                              }`}>
                                <StatusIcon className="h-7 w-7" />
                                {isLatest && (
                                  <div className="absolute -inset-1 bg-cyan-500/20 rounded-2xl blur animate-pulse" />
                                )}
                              </div>
                              <div className="flex-1 pt-2">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                  <h4 className={`font-bold text-lg ${isLatest ? 'text-white' : 'text-slate-300'}`}>
                                    {event.status}
                                  </h4>
                                  <span className={`text-sm ${isLatest ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                                    {new Date(event.timestamp).toLocaleString('zh-CN', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className={`${isLatest ? 'text-slate-300' : 'text-slate-500'} text-lg mb-3`}>
                                  {event.description}
                                </p>
                                <div className="flex items-center gap-2 text-slate-500">
                                  <MapPin className="h-4 w-4" />
                                  <span className="text-sm">{event.location}</span>
                                </div>
                                {isLatest && (
                                  <div className="mt-4 inline-flex items-center gap-2 text-cyan-400 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2 rounded-full border border-cyan-500/30">
                                    <div className="relative flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                                    </div>
                                    <span className="font-bold">最新状态</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 智能推荐 - 科技感设计 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-xl border-0 shadow-lg shadow-blue-500/20 rounded-3xl overflow-hidden group hover:shadow-blue-500/40 transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Shield className="h-6 w-6 text-blue-400" />
                            <h4 className="font-bold text-xl text-white">需要修改订单？</h4>
                          </div>
                          <p className="text-blue-200 mb-6 leading-relaxed">如需修改收货地址或联系信息，请联系客服处理</p>
                          <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-lg shadow-blue-500/20">
                            联系客服
                          </Button>
                        </div>
                        <div className="relative">
                          <Phone className="h-12 w-12 text-blue-300/50 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-xl border-0 shadow-lg shadow-green-500/20 rounded-3xl overflow-hidden group hover:shadow-green-500/40 transition-all duration-500">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Calendar className="h-6 w-6 text-green-400" />
                            <h4 className="font-bold text-xl text-white">预约取件</h4>
                          </div>
                          <p className="text-green-200 mb-6 leading-relaxed">需要寄送新包裹？立即预约上门取件服务</p>
                          <Button variant="secondary" size="sm" className="bg-white text-green-600 hover:bg-green-50 font-bold shadow-lg shadow-green-500/20">
                            立即预约
                          </Button>
                        </div>
                        <div className="relative">
                          <Truck className="h-12 w-12 text-green-300/50 group-hover:scale-110 group-hover:text-green-300 transition-all duration-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 初始状态提示 - 科技感设计 */}
            {!searched && !loading && (
              <div className="max-w-6xl mx-auto">
                <div className="text-center py-20">
                  <div className="relative w-40 h-40 mx-auto mb-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-full h-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-full flex items-center justify-center border-2 border-slate-700/50">
                      <Truck className="h-20 w-20 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    输入运单号开始查询
                  </h3>
                  <p className="text-slate-400 text-xl mb-12">
                    支持通过运单号或手机号查询物流信息
                  </p>
                </div>

                {/* 功能特色 - 科技感设计 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Zap,
                      title: "智能查询",
                      desc: "支持运单号、手机号多种方式查询，快速定位订单",
                      color: "cyan",
                      gradient: "from-cyan-500/20 to-blue-500/20"
                    },
                    {
                      icon: Activity,
                      title: "实时更新",
                      desc: "物流状态实时同步，毫秒级更新，掌握最新动态",
                      color: "green",
                      gradient: "from-green-500/20 to-emerald-500/20"
                    },
                    {
                      icon: Globe,
                      title: "全程追踪",
                      desc: "从发货到签收，全程可视化追踪，路线清晰可见",
                      color: "purple",
                      gradient: "from-purple-500/20 to-violet-500/20"
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="bg-slate-900/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 rounded-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${feature.color === 'cyan' ? 'rgba(6,182,212,0.1)' : feature.color === 'green' ? 'rgba(34,197,94,0.1)' : 'rgba(168,85,247,0.1)'}, transparent)` }} />
                      <CardContent className="p-8 text-center relative">
                        <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                          <feature.icon className={`h-10 w-10 text-${feature.color}-400`} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* 自定义动画 */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
