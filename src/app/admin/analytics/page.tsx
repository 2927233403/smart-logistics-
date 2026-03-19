"use client"

import { BarChart3, TrendingUp, TrendingDown, Package, Truck, Users } from "lucide-react"

const monthlyData = [
  { month: "1月", orders: 1200, revenue: 156000 },
  { month: "2月", orders: 980, revenue: 128000 },
  { month: "3月", orders: 1450, revenue: 189000 },
  { month: "4月", orders: 1320, revenue: 172000 },
  { month: "5月", orders: 1580, revenue: 205000 },
  { month: "6月", orders: 1720, revenue: 224000 },
]

const topRoutes = [
  { route: "北京 → 上海", orders: 456, growth: 12 },
  { route: "广州 → 深圳", orders: 389, growth: 8 },
  { route: "上海 → 杭州", orders: 312, growth: -3 },
  { route: "北京 → 广州", orders: 278, growth: 15 },
  { route: "深圳 → 武汉", orders: 234, growth: 6 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
        <p className="text-gray-500 mt-1">查看运营数据和趋势分析</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">本月订单</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,720</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +12.5%
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">本月营收</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">¥224,000</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +8.3%
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">活跃车辆</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">28</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +3
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">在线司机</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">32</p>
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" /> -2
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Orders Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">月度订单趋势</h2>
          <div className="space-y-4">
            {monthlyData.map((data) => {
              const maxOrders = Math.max(...monthlyData.map(d => d.orders))
              const width = (data.orders / maxOrders) * 100
              return (
                <div key={data.month} className="flex items-center space-x-4">
                  <span className="w-8 text-sm text-gray-500">{data.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                    <div 
                      className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${width}%` }}
                    >
                      <span className="text-xs text-white font-medium">{data.orders}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">热门路线</h2>
          <div className="space-y-4">
            {topRoutes.map((route, index) => (
              <div key={route.route} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-900">{route.route}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{route.orders} 单</span>
                  <span className={`flex items-center text-sm ${route.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {route.growth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(route.growth)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
