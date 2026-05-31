"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Activity,
  Package,
  Truck,
  BarChart2,
  Search,
  Download,
  Filter
} from "lucide-react"
import Link from "next/link"

export default function Logs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [logs, setLogs] = useState([
    { id: 1, action: "入库", user: "管理员", item: "商品A", quantity: 100, time: "2026-03-21 10:30:00", ip: "192.168.1.100" },
    { id: 2, action: "出库", user: "操作员", item: "商品B", quantity: 50, time: "2026-03-21 09:15:00", ip: "192.168.1.101" },
    { id: 3, action: "上架", user: "操作员", item: "商品C", quantity: 200, time: "2026-03-20 16:45:00", ip: "192.168.1.102" },
    { id: 4, action: "过机", user: "管理员", item: "商品D", quantity: 150, time: "2026-03-20 14:20:00", ip: "192.168.1.100" },
    { id: 5, action: "入库", user: "操作员", item: "商品E", quantity: 80, time: "2026-03-20 11:10:00", ip: "192.168.1.101" }
  ])

  const handleSearch = () => {
    // 这里可以实现搜索逻辑
    console.log('搜索:', searchTerm)
  }

  const handleExport = () => {
    // 这里可以实现导出Excel逻辑
    console.log('导出Excel')
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
                    <Activity className="mr-2 h-6 w-6 text-amber-600" />
                    操作日志
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
                  <Link href="/warehouse/search">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Search className="h-5 w-5" />
                      <span>库存查询</span>
                    </button>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 bg-amber-50 text-amber-600 font-medium">
                    <Activity className="h-5 w-5" />
                    <span>操作日志</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="搜索操作、用户或商品"
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">全部操作</option>
                      <option value="入库">入库</option>
                      <option value="出库">出库</option>
                      <option value="上架">上架</option>
                      <option value="过机">过机</option>
                    </select>
                    <Button onClick={handleSearch} className="bg-amber-600 hover:bg-amber-700 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      搜索
                    </Button>
                    <Button onClick={handleExport} className="bg-amber-600 hover:bg-amber-700 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      导出Excel
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">操作类型</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">操作用户</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">操作对象</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">数量</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">操作时间</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">IP地址</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 border-b">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${log.action === '入库' ? 'bg-green-100 text-green-800' : log.action === '出库' ? 'bg-orange-100 text-orange-800' : log.action === '上架' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b">{log.user}</td>
                          <td className="px-4 py-3 border-b">{log.item}</td>
                          <td className="px-4 py-3 border-b">{log.quantity}</td>
                          <td className="px-4 py-3 border-b font-mono text-sm">{log.time}</td>
                          <td className="px-4 py-3 border-b font-mono text-sm">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            {/* 操作统计 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">操作统计</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-sm font-medium text-green-800 mb-2">入库操作</h4>
                    <p className="text-2xl font-bold text-green-900">2</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="text-sm font-medium text-orange-800 mb-2">出库操作</h4>
                    <p className="text-2xl font-bold text-orange-900">1</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">上架操作</h4>
                    <p className="text-2xl font-bold text-blue-900">1</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">过机操作</h4>
                    <p className="text-2xl font-bold text-purple-900">1</p>
                  </div>
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