"use client"

import { Package, Truck, Users, Warehouse, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Activity, Clock, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

interface Stats {
  orders: { total: number; pending: number; shipping: number; delivered: number; cancelled: number }
  vehicles: { total: number; shipping: number; idle: number; maintenance: number }
  drivers: { total: number; online: number; offline: number; idle: number }
  warehouses: { total: number; normal: number; full: number }
  users: { total: number; active: number; inactive: number }
}

interface RecentOrder {
  id: string
  customer: string
  destination: string
  status: string
  time: string
  statusColor: string
}

const alerts = [
  { type: "warning", message: "车辆 粤A12345 已超时未到达目的地", time: "5分钟前" },
  { type: "error", message: "仓库 北京仓 库存预警：SKU-001 库存不足", time: "15分钟前" },
  { type: "info", message: "新增大客户订单，需要优先处理", time: "30分钟前" },
]

const quickActions = [
  { name: "新建订单", icon: Package, color: "from-blue-500 to-cyan-500", href: "/admin/orders" },
  { name: "添加司机", icon: Users, color: "from-green-500 to-emerald-500", href: "/admin/drivers" },
  { name: "添加车辆", icon: Truck, color: "from-purple-500 to-violet-500", href: "/admin/vehicles" },
  { name: "查看报表", icon: TrendingUp, color: "from-orange-500 to-amber-500", href: "/admin/analytics" },
]

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 加载统计数据
  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/statistics'),
        fetch('/api/orders')
      ])
      
      const statsData = await statsRes.json()
      const ordersData = await ordersRes.json()
      
      setStats(statsData)
      
      // 转换订单数据
      const orders: RecentOrder[] = ordersData.slice(0, 5).map((o: any) => {
        let statusColor = "green"
        if (o.status === "运输中") statusColor = "blue"
        else if (o.status === "待发货") statusColor = "yellow"
        return {
          id: o.id,
          customer: o.customer,
          destination: o.destination,
          status: o.status,
          time: o.date,
          statusColor
        }
      })
      setRecentOrders(orders)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    loadDashboardData()
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const getStatusClass = (status: string) => {
    if (status === "运输中") return "bg-blue-100 text-blue-700"
    if (status === "待发货") return "bg-yellow-100 text-yellow-700"
    return "bg-green-100 text-green-700"
  }

  const getStatusIcon = (status: string) => {
    if (status === "运输中") return Truck
    if (status === "待发货") return Clock
    return CheckCircle2
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <p className="text-gray-500 mt-1">欢迎回来，管理员</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>刷新</span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <Activity className="h-5 w-5 text-cyan-500" />
            <span className="font-mono text-sm text-gray-700">{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">总订单数</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.orders.total || 0}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span>+{stats?.orders.shipping || 0} 运输中</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
              <Package className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">车辆总数</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.vehicles.total || 0}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                <span>{stats?.vehicles.idle || 0} 空闲</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/10 group-hover:scale-110 transition-transform">
              <Truck className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-violet-500 rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">司机总数</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.drivers.total || 0}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <span>{stats?.drivers.online || 0} 在线</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/10 group-hover:scale-110 transition-transform">
              <Users className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500 to-amber-500 rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">仓库总数</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.warehouses.total || 0}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                <span>{stats?.warehouses.normal || 0} 正常</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/10 group-hover:scale-110 transition-transform">
              <Warehouse className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.name}
            onClick={() => window.location.href = action.href}
            className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
              {action.name}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                查看全部
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status)
              return (
                <div 
                  key={order.id} 
                  className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                        order.statusColor === "blue" ? "from-blue-500 to-cyan-500" :
                        order.statusColor === "yellow" ? "from-yellow-500 to-amber-500" :
                        "from-green-500 to-emerald-500"
                      } flex items-center justify-center`}>
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customer} - {order.destination}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{order.time}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">系统提醒</h2>
              <span className="text-xs text-gray-400">3 条待处理</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {alerts.map((alert, index) => (
              <div key={index} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.type === "error" ? "bg-red-100" :
                    alert.type === "warning" ? "bg-yellow-100" :
                    "bg-blue-100"
                  }`}>
                    {alert.type === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                    {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    {alert.type === "info" && <AlertCircle className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
