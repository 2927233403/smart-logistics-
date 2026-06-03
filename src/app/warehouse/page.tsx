"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WarehouseSidebar } from "@/components/warehouse-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Package,
  Truck,
  Boxes,
  Scan,
  Search,
  Layers,
  Activity
} from "lucide-react"
import Link from "next/link"

export default function Warehouse() {
  const stats = [
    { label: "总库存", value: "12,458", icon: Boxes, color: "bg-blue-500" },
    { label: "今日入库", value: "156", icon: Package, color: "bg-green-500" },
    { label: "今日出库", value: "123", icon: Truck, color: "bg-orange-500" },
    { label: "占用仓位", value: "78%", icon: Layers, color: "bg-purple-500" }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <div className="lg:w-64">
            <WarehouseSidebar />
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">仓库管理系统</h1>
              <p className="text-slate-400">智能仓储物流管理平台</p>
            </div>
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-slate-400">{stat.label}</h3>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            
            {/* 快速操作 */}
            <Card className="mb-6 bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">快速操作</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/warehouse/inbound">
                    <Button className="flex flex-col items-center justify-center py-6 h-32 gap-2 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20">
                      <Package className="h-8 w-8" />
                      <span>入库</span>
                    </Button>
                  </Link>
                  <Link href="/warehouse/outbound">
                    <Button className="flex flex-col items-center justify-center py-6 h-32 gap-2 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-lg shadow-orange-500/20">
                      <Truck className="h-8 w-8" />
                      <span>出库</span>
                    </Button>
                  </Link>
                  <Link href="/warehouse/scan">
                    <Button className="flex flex-col items-center justify-center py-6 h-32 gap-2 bg-gradient-to-br from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/20">
                      <Scan className="h-8 w-8" />
                      <span>过机</span>
                    </Button>
                  </Link>
                  <Link href="/warehouse/search">
                    <Button className="flex flex-col items-center justify-center py-6 h-32 gap-2 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                      <Search className="h-8 w-8" />
                      <span>查询</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* 最近操作 */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-cyan-400" />
                  最近操作
                </h3>
                <div className="space-y-4">
                  {[
                    { action: "入库", item: "商品A", quantity: 100, time: "2026-03-21 10:30" },
                    { action: "出库", item: "商品B", quantity: 50, time: "2026-03-21 09:15" },
                    { action: "上架", item: "商品C", quantity: 200, time: "2026-03-20 16:45" },
                    { action: "过机", item: "商品D", quantity: 150, time: "2026-03-20 14:20" }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          log.action === "入库" ? 'bg-emerald-500/20 text-emerald-400' :
                          log.action === "出库" ? 'bg-orange-500/20 text-orange-400' :
                          log.action === "上架" ? 'bg-cyan-500/20 text-cyan-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {log.action === "入库" && <Package className="h-5 w-5" />}
                          {log.action === "出库" && <Truck className="h-5 w-5" />}
                          {log.action === "上架" && <Layers className="h-5 w-5" />}
                          {log.action === "过机" && <Scan className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-white">{log.action}: {log.item}</p>
                          <p className="text-sm text-slate-400">数量: {log.quantity} | {log.time}</p>
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