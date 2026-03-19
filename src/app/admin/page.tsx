"use client"

import { Package, Truck, Users, Warehouse, TrendingUp, AlertCircle } from "lucide-react"

const stats = [
  { label: "今日订单", value: "128", change: "+12%", icon: Package, color: "bg-blue-500" },
  { label: "运输中", value: "45", change: "+5%", icon: Truck, color: "bg-green-500" },
  { label: "司机数量", value: "32", change: "+2", icon: Users, color: "bg-purple-500" },
  { label: "仓库数量", value: "8", change: "0", icon: Warehouse, color: "bg-orange-500" },
]

const recentOrders = [
  { id: "ORD-001", customer: "张三", destination: "北京市朝阳区", status: "运输中", time: "10分钟前" },
  { id: "ORD-002", customer: "李四", destination: "上海市浦东新区", status: "待发货", time: "25分钟前" },
  { id: "ORD-003", customer: "王五", destination: "广州市天河区", status: "已送达", time: "1小时前" },
  { id: "ORD-004", customer: "赵六", destination: "深圳市南山区", status: "运输中", time: "2小时前" },
]

const alerts = [
  { type: "warning", message: "车辆 粤A12345 已超时未到达目的地", time: "5分钟前" },
  { type: "error", message: "仓库 北京仓 库存预警：SKU-001 库存不足", time: "15分钟前" },
  { type: "info", message: "新增大客户订单，需要优先处理", time: "30分钟前" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-500 mt-1">欢迎回来，管理员</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer} · {order.destination}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === "运输中" ? "bg-blue-100 text-blue-700" :
                      order.status === "待发货" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{order.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">系统提醒</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {alerts.map((alert, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    alert.type === "error" ? "text-red-500" :
                    alert.type === "warning" ? "text-yellow-500" :
                    "text-blue-500"
                  }`} />
                  <div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            <Package className="h-5 w-5" />
            <span className="font-medium">新建订单</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
            <Truck className="h-5 w-5" />
            <span className="font-medium">调度车辆</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
            <Users className="h-5 w-5" />
            <span className="font-medium">添加司机</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">查看报表</span>
          </button>
        </div>
      </div>
    </div>
  )
}
