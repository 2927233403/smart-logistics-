"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Package,
  Truck,
  Search,
  BarChart2,
  Upload,
  Boxes,
  Scan,
  Layers,
  Activity,
  Settings,
  Users,
  FileText
} from "lucide-react"
import Link from "next/link"

export default function Warehouse() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const menuItems = [
    {
      id: "dashboard",
      label: "仓库概览",
      icon: BarChart2,
      href: "/warehouse"
    },
    {
      id: "inbound",
      label: "入库管理",
      icon: Package,
      href: "/warehouse/inbound"
    },
    {
      id: "outbound",
      label: "出库管理",
      icon: Truck,
      href: "/warehouse/outbound"
    },
    {
      id: "scan",
      label: "过机端口",
      icon: Scan,
      href: "/warehouse/scan"
    },
    {
      id: "shelf",
      label: "上架管理",
      icon: Layers,
      href: "/warehouse/shelf"
    },
    {
      id: "search",
      label: "库存查询",
      icon: Search,
      href: "/warehouse/search"
    },
    {
      id: "upload",
      label: "照片上传",
      icon: Upload,
      href: "/warehouse/upload"
    },
    {
      id: "logs",
      label: "操作日志",
      icon: Activity,
      href: "/warehouse/logs"
    },
    {
      id: "users",
      label: "用户管理",
      icon: Users,
      href: "/warehouse/users"
    },
    {
      id: "settings",
      label: "系统设置",
      icon: Settings,
      href: "/warehouse/settings"
    }
  ]

  const stats = [
    { label: "总库存", value: "12,458", icon: Boxes, color: "bg-blue-500" },
    { label: "今日入库", value: "156", icon: Package, color: "bg-green-500" },
    { label: "今日出库", value: "123", icon: Truck, color: "bg-orange-500" },
    { label: "占用仓位", value: "78%", icon: Layers, color: "bg-purple-500" }
  ]

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
                    <Boxes className="mr-2 h-6 w-6 text-blue-600" />
                    仓储管理
                  </h2>
                </div>
                <div className="p-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.id} href={item.href}>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            setActiveTab(item.id)
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 ${
                              activeTab === item.id
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </button>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">仓库管理系统</h1>
              <p className="text-slate-600">智能仓储物流管理平台</p>
            </div>
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            
            {/* 快速操作 */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">快速操作</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/warehouse/inbound">
                    <Button className="flex flex-col items-center justify-center py-6 h-32 gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
                      <Package className="h-8 w-8" />
                      <span>入库</span>
                    </Button>
                  </Link>
                  <Link href="/warehouse/outbound">
                    <Button className="flex flex-col items-center justify-center py-6 h-32 gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg">
                      <Truck className="h-8 w-8" />
                      <span>出库</span>
                    </Button>
                  </Link>
                  <Link href="/warehouse/scan">
                    <Button className="flex flex-col items-center justify-center py-6 h-32 gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg">
                      <Scan className="h-8 w-8" />
                      <span>过机</span>
                    </Button>
                  </Link>
                  <Link href="/warehouse/search">
                    <Button className="flex flex-col items-center justify-center py-6 h-32 gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                      <Search className="h-8 w-8" />
                      <span>查询</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* 最近操作 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-slate-500" />
                  最近操作
                </h3>
                <div className="space-y-4">
                  {[
                    { action: "入库", item: "商品A", quantity: 100, time: "2026-03-21 10:30" },
                    { action: "出库", item: "商品B", quantity: 50, time: "2026-03-21 09:15" },
                    { action: "上架", item: "商品C", quantity: 200, time: "2026-03-20 16:45" },
                    { action: "过机", item: "商品D", quantity: 150, time: "2026-03-20 14:20" }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          log.action === "入库" ? 'bg-green-100 text-green-600' :
                          log.action === "出库" ? 'bg-orange-100 text-orange-600' :
                          log.action === "上架" ? 'bg-blue-100 text-blue-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {log.action === "入库" && <Package className="h-5 w-5" />}
                          {log.action === "出库" && <Truck className="h-5 w-5" />}
                          {log.action === "上架" && <Layers className="h-5 w-5" />}
                          {log.action === "过机" && <Scan className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{log.action}: {log.item}</p>
                          <p className="text-sm text-slate-500">数量: {log.quantity} | {log.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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