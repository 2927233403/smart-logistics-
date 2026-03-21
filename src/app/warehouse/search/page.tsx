"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search as SearchIcon,
  Package,
  BarChart2,
  Layers,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [inventory, setInventory] = useState([
    { id: 1, name: "商品A", sku: "SKU001", quantity: 100, location: "A-01-01", status: "normal" },
    { id: 2, name: "商品B", sku: "SKU002", quantity: 50, location: "A-01-02", status: "low" },
    { id: 3, name: "商品C", sku: "SKU003", quantity: 200, location: "A-02-01", status: "normal" },
    { id: 4, name: "商品D", sku: "SKU004", quantity: 5, location: "A-02-02", status: "critical" },
    { id: 5, name: "商品E", sku: "SKU005", quantity: 150, location: "A-03-01", status: "normal" }
  ])

  const handleSearch = () => {
    // 这里可以实现搜索逻辑
    console.log('搜索:', searchTerm)
  }

  const handleExport = () => {
    // 这里可以实现导出Excel逻辑
    console.log('导出Excel')
  }

  const handleRefresh = () => {
    // 这里可以实现刷新数据逻辑
    console.log('刷新数据')
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
                    <SearchIcon className="mr-2 h-6 w-6 text-green-600" />
                    库存查询
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
                  <Link href="/warehouse/shelf">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Layers className="h-5 w-5" />
                      <span>上架管理</span>
                    </button>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 bg-green-50 text-green-600 font-medium">
                    <SearchIcon className="h-5 w-5" />
                    <span>库存查询</span>
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
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="搜索商品名称、SKU或库位"
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">全部状态</option>
                      <option value="normal">正常</option>
                      <option value="low">库存不足</option>
                      <option value="critical">库存危急</option>
                    </select>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="name">按名称</option>
                      <option value="quantity">按数量</option>
                      <option value="location">按库位</option>
                    </select>
                    <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 text-white">
                      <SearchIcon className="h-4 w-4 mr-2" />
                      搜索
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">库存列表</h3>
                  <div className="flex gap-2">
                    <Button onClick={handleRefresh} variant="outline" className="border-slate-300 text-slate-700">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      刷新
                    </Button>
                    <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      导出Excel
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">商品名称</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">SKU</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">库存数量</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">库位</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">状态</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 border-b">{item.name}</td>
                          <td className="px-4 py-3 border-b font-mono">{item.sku}</td>
                          <td className="px-4 py-3 border-b">{item.quantity}</td>
                          <td className="px-4 py-3 border-b">{item.location}</td>
                          <td className="px-4 py-3 border-b">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${item.status === 'normal' ? 'bg-green-100 text-green-800' : item.status === 'low' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {item.status === 'normal' ? '正常' : item.status === 'low' ? '库存不足' : '库存危急'}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                              详情
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            {/* 库存统计 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">库存统计</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-sm font-medium text-green-800 mb-2">正常库存</h4>
                    <p className="text-2xl font-bold text-green-900">3</p>
                    <p className="text-xs text-green-600 mt-1">占比 60%</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">库存不足</h4>
                    <p className="text-2xl font-bold text-yellow-900">1</p>
                    <p className="text-xs text-yellow-600 mt-1">占比 20%</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="text-sm font-medium text-red-800 mb-2">库存危急</h4>
                    <p className="text-2xl font-bold text-red-900">1</p>
                    <p className="text-xs text-red-600 mt-1">占比 20%</p>
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