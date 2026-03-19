"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, Truck, MapPin, Search, Filter, Eye } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Order {
  id: string
  status: string
  statusColor: string
  from: string
  to: string
  date: string
  goods: string
  weight: string
}

export default function UserOrdersPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const loggedIn = localStorage.getItem("user_logged_in")
    if (loggedIn !== "true") {
      router.push("/login")
      return
    }
    setIsLoggedIn(true)

    // 模拟订单数据
    setOrders([
      { id: "WL20240318001", status: "运输中", statusColor: "blue", from: "北京市朝阳区", to: "上海市浦东新区", date: "2024-03-18", goods: "电子配件", weight: "500kg" },
      { id: "WL20240317002", status: "待发货", statusColor: "orange", from: "广州市天河区", to: "深圳市南山区", date: "2024-03-17", goods: "服装", weight: "200kg" },
      { id: "WL20240316003", status: "已完成", statusColor: "green", from: "成都市武侯区", to: "重庆市渝北区", date: "2024-03-16", goods: "食品", weight: "300kg" },
      { id: "WL20240315004", status: "已完成", statusColor: "green", from: "杭州市西湖区", to: "南京市鼓楼区", date: "2024-03-15", goods: "家具", weight: "800kg" },
      { id: "WL20240314005", status: "运输中", statusColor: "blue", from: "武汉市洪山区", to: "长沙市岳麓区", date: "2024-03-14", goods: "机械配件", weight: "1200kg" },
    ])
  }, [router])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.from.includes(searchQuery) ||
                         order.to.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* 面包屑 */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/user/profile" className="hover:text-blue-600">用户中心</Link>
            <span>/</span>
            <span className="text-gray-900">我的订单</span>
          </div>

          {/* 页面标题 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">我的订单</h1>
          </div>

          {/* 搜索和筛选 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="搜索订单号、起止地点..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["all", "待发货", "运输中", "已完成"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {status === "all" ? "全部" : status}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* 订单列表 */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">暂无订单记录</p>
                <Link href="/">
                  <Button>去下单</Button>
                </Link>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* 订单头部 */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-900">订单号：{order.id}</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-sm text-gray-500">{order.date}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.statusColor === "green" ? "bg-green-100 text-green-600" :
                      order.statusColor === "blue" ? "bg-blue-100 text-blue-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* 订单内容 */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-8">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2 text-green-500" />
                          <div>
                            <p className="text-xs text-gray-400">发货地</p>
                            <p className="font-medium">{order.from}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Truck className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="w-24 h-0.5 bg-blue-200 mt-2"></div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2 text-red-500" />
                          <div>
                            <p className="text-xs text-gray-400">收货地</p>
                            <p className="font-medium">{order.to}</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">货物：{order.goods}</p>
                        <p className="text-sm text-gray-500">重量：{order.weight}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                      <Link href={`/tracking?q=${order.id}`}>
                        <Button variant="outline" size="sm" className="mr-2">
                          <Eye className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                      </Link>
                      <Link href={`/tracking?q=${order.id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Truck className="h-4 w-4 mr-1" />
                          物流追踪
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 分页 */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-center mt-8 space-x-2">
              <Button variant="outline" size="sm">上一页</Button>
              <Button size="sm" className="bg-blue-600">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">下一页</Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
