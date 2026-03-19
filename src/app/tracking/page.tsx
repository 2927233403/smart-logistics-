"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Package, Truck, MapPin, Clock, CheckCircle, 
  User, Phone, CreditCard, Calendar, Box, Weight, 
  ArrowRight, History, Sparkles, FileText, QrCode
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
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    icon: Clock
  },
  assigned: { 
    label: "已分配", 
    variant: "secondary",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    icon: User
  },
  picked_up: { 
    label: "已提货", 
    variant: "default",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: Package
  },
  in_transit: { 
    label: "运输中", 
    variant: "default",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: Truck
  },
  delivered: { 
    label: "已送达", 
    variant: "success",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: CheckCircle
  },
  cancelled: { 
    label: "已取消", 
    variant: "destructive",
    color: "text-red-600",
    bgColor: "bg-red-50",
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

  useEffect(() => {
    setSearchHistory(getSearchHistory())
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
    await new Promise(resolve => setTimeout(resolve, 600))

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">智能物流追踪系统</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                实时追踪您的货物
              </h1>
              <p className="text-blue-100 mb-8 text-lg">
                输入运单号或手机号，随时掌握货物运输状态
              </p>
              
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        placeholder="请输入运单号或手机号查询"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
                        className="pl-12 pr-4 bg-white border-0 h-14 text-gray-900 placeholder:text-gray-400 text-lg"
                      />
                      {/* 历史记录下拉 */}
                      {showHistory && searchHistory.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-20">
                          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <History className="h-3 w-3" />
                              最近查询
                            </span>
                            <button 
                              onClick={clearHistory}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              清除
                            </button>
                          </div>
                          {searchHistory.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSearchQuery(item)
                                handleSearch(item)
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-2"
                            >
                              <Search className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">{item}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button 
                      size="lg" 
                      onClick={() => handleSearch()}
                      disabled={loading}
                      className="h-14 px-8 bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          查询中...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Search className="h-5 w-5" />
                          查询
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* 快速测试按钮 */}
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="text-sm text-blue-200">快速测试：</span>
                    {['ORD20240318001', 'ORD20240318002', 'ORD20240318003'].map((no) => (
                      <button
                        key={no}
                        onClick={() => {
                          setSearchQuery(no)
                          handleSearch(no)
                        }}
                        className="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                      >
                        {no}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Loading Progress */}
        {loading && (
          <div className="fixed top-0 left-0 right-0 h-1 bg-blue-200 z-50">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Results Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {searched && !order && !loading && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  未找到相关订单
                </h3>
                <p className="text-gray-500 mb-6">
                  请检查运单号或手机号是否正确，或尝试以下方式
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    重新输入
                  </Button>
                  <Button onClick={() => window.location.href = '/contact'}>
                    联系客服
                  </Button>
                </div>
              </div>
            )}

            {order && (
              <div className="max-w-5xl mx-auto space-y-6">
                {/* 状态概览卡片 */}
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className={`h-2 ${getCurrentStatus(order.status).bgColor.replace('bg-', 'bg-').replace('50', '500')}`} />
                  <CardHeader className="pb-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-2xl ${getCurrentStatus(order.status).bgColor} flex items-center justify-center`}>
                          {(() => {
                            const StatusIcon = getCurrentStatus(order.status).icon
                            return <StatusIcon className={`h-8 w-8 ${getCurrentStatus(order.status).color}`} />
                          })()}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <CardTitle className="text-2xl">运单号：{order.orderNo}</CardTitle>
                            <Badge 
                              variant={getCurrentStatus(order.status).variant}
                              className="text-sm px-3 py-1"
                            >
                              {getCurrentStatus(order.status).label}
                            </Badge>
                          </div>
                          <p className="text-gray-500">
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
                        <Button variant="outline" size="sm" className="gap-2">
                          <QrCode className="h-4 w-4" />
                          分享
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          打印
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* 运输进度条 */}
                  <CardContent className="pt-0">
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>运输进度</span>
                        <span>{getProgressPercent(order.status)}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                          style={{ width: `${getProgressPercent(order.status)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-3">
                        {['待处理', '已提货', '运输中', '已送达'].map((step, index) => {
                          const stepPercent = (index + 1) * 25
                          const currentPercent = getProgressPercent(order.status)
                          const isActive = currentPercent >= stepPercent
                          const isCurrent = currentPercent >= (index * 25) && currentPercent < stepPercent
                          
                          return (
                            <div key={step} className="flex flex-col items-center">
                              <div className={`w-4 h-4 rounded-full mb-1 transition-colors ${
                                isActive ? 'bg-blue-600' : isCurrent ? 'bg-blue-400 animate-pulse' : 'bg-gray-200'
                              }`} />
                              <span className={`text-xs ${isActive ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                                {step}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* 订单信息网格 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 发货地址 */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">发货地址</span>
                        </div>
                        <p className="font-medium text-gray-900">{order.origin}</p>
                      </div>

                      {/* 收货地址 */}
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">收货地址</span>
                        </div>
                        <p className="font-medium text-gray-900">{order.destination}</p>
                      </div>

                      {/* 货物信息 */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <Package className="h-4 w-4" />
                          <span className="text-sm">货物信息</span>
                        </div>
                        <p className="font-medium text-gray-900">{order.cargoType}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <Weight className="h-3 w-3 inline mr-1" />
                          {order.weight}kg · {order.volume}m³
                        </p>
                      </div>

                      {/* 预计送达 */}
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">预计送达</span>
                        </div>
                        <p className="font-medium text-gray-900">
                          {new Date(order.estimatedDelivery).toLocaleDateString('zh-CN')}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                          {new Date(order.estimatedDelivery).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* 客户信息 */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        客户信息
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">客户姓名</p>
                            <p className="font-medium">{order.customerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">联系电话</p>
                            <p className="font-medium">{order.customerPhone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">运费金额</p>
                            <p className="font-medium text-blue-600">¥{order.freight?.toFixed(2) || '0.00'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 物流轨迹时间线 */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      物流轨迹
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-gray-200" />
                      <div className="space-y-0">
                        {order.trackingEvents.map((event, index) => {
                          const isLatest = index === 0
                          const StatusIcon = isLatest ? Truck : CheckCircle
                          
                          return (
                            <div key={event.id} className="relative flex gap-6 pb-8 last:pb-0">
                              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isLatest 
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                <StatusIcon className="h-5 w-5" />
                              </div>
                              <div className="flex-1 pt-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <h4 className={`font-semibold ${isLatest ? 'text-blue-900 text-lg' : 'text-gray-700'}`}>
                                    {event.status}
                                  </h4>
                                  <span className={`text-sm ${isLatest ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                                    {new Date(event.timestamp).toLocaleString('zh-CN', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className={`mt-2 ${isLatest ? 'text-gray-700' : 'text-gray-500'}`}>
                                  {event.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <MapPin className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm text-gray-500">{event.location}</span>
                                </div>
                                {isLatest && (
                                  <div className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                                    </span>
                                    最新状态
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

                {/* 智能推荐 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg mb-2">需要修改订单？</h4>
                          <p className="text-blue-100 text-sm mb-4">如需修改收货地址或联系信息，请联系客服处理</p>
                          <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                            联系客服
                          </Button>
                        </div>
                        <Phone className="h-10 w-10 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg mb-2">预约取件</h4>
                          <p className="text-green-100 text-sm mb-4">需要寄送新包裹？立即预约上门取件服务</p>
                          <Button variant="secondary" size="sm" className="bg-white text-green-600 hover:bg-green-50">
                            立即预约
                          </Button>
                        </div>
                        <Calendar className="h-10 w-10 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 初始状态提示 */}
            {!searched && !loading && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center py-16">
                  <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="h-16 w-16 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    输入运单号开始查询
                  </h3>
                  <p className="text-gray-500 text-lg mb-8">
                    支持通过运单号或手机号查询物流信息
                  </p>
                </div>

                {/* 功能特色 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Search,
                      title: "智能查询",
                      desc: "支持运单号、手机号多种方式查询",
                      color: "blue"
                    },
                    {
                      icon: Clock,
                      title: "实时更新",
                      desc: "物流状态实时同步，掌握最新动态",
                      color: "green"
                    },
                    {
                      icon: MapPin,
                      title: "全程追踪",
                      desc: "从发货到签收，全程可视化追踪",
                      color: "purple"
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className={`w-14 h-14 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                          <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-500">{feature.desc}</p>
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
    </div>
  )
}
