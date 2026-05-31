"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ExcelExportButton } from "@/components/excel-export"
import {
  Search as SearchIcon,
  Package,
  BarChart2,
  Layers,
  Filter,
  RefreshCw,
  Eye,
  X
} from "lucide-react"
import Link from "next/link"

// 定义库存数据类型
interface InventoryItem {
  id: number
  name: string
  sku: string
  quantity: number
  location: string
  status: 'normal' | 'low' | 'critical'
  category: string
  lastUpdated: string
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "商品A", sku: "SKU001", quantity: 100, location: "A-01-01", status: "normal", category: "电子产品", lastUpdated: "2024-01-15" },
    { id: 2, name: "商品B", sku: "SKU002", quantity: 50, location: "A-01-02", status: "low", category: "服装", lastUpdated: "2024-01-14" },
    { id: 3, name: "商品C", sku: "SKU003", quantity: 200, location: "A-02-01", status: "normal", category: "食品", lastUpdated: "2024-01-13" },
    { id: 4, name: "商品D", sku: "SKU004", quantity: 5, location: "A-02-02", status: "critical", category: "电子产品", lastUpdated: "2024-01-12" },
    { id: 5, name: "商品E", sku: "SKU005", quantity: 150, location: "A-03-01", status: "normal", category: "家居", lastUpdated: "2024-01-11" }
  ])

  // 过滤和排序后的数据
  const filteredInventory = inventory
    .filter(item => {
      // 搜索过滤
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      // 状态过滤
      const matchesFilter = filter === 'all' || item.status === filter
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      // 排序
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'quantity':
          return b.quantity - a.quantity
        case 'location':
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })

  const handleSearch = () => {
    console.log('搜索:', searchTerm)
  }

  const handleRefresh = () => {
    // 模拟刷新数据
    setInventory(prev => [...prev])
    console.log('刷新数据')
  }

  const handleViewDetail = (item: InventoryItem) => {
    setSelectedItem(item)
    setShowDetail(true)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常'
      case 'low': return '库存不足'
      case 'critical': return '库存危急'
      default: return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800'
      case 'low': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 导出列配置
  const exportColumns = [
    { key: 'name', title: '商品名称' },
    { key: 'sku', title: 'SKU' },
    { key: 'quantity', title: '库存数量' },
    { key: 'location', title: '库位' },
    { key: 'status', title: '状态' },
    { key: 'category', title: '分类' },
    { key: 'lastUpdated', title: '最后更新' }
  ]

  // 准备导出数据（转换状态为中文）
  const exportData = filteredInventory.map(item => ({
    ...item,
    status: getStatusText(item.status)
  }))

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
                  <h3 className="text-lg font-semibold text-slate-900">
                    库存列表 
                    <span className="text-sm font-normal text-slate-500 ml-2">
                      (共 {filteredInventory.length} 条)
                    </span>
                  </h3>
                  <div className="flex gap-2">
                    <Button onClick={handleRefresh} variant="outline" className="border-slate-300 text-slate-700">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      刷新
                    </Button>
                    <ExcelExportButton 
                      data={exportData}
                      filename={`库存数据_${new Date().toISOString().split('T')[0]}.xlsx`}
                      sheetName="库存列表"
                      columns={exportColumns}
                      buttonText="导出Excel"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    />
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
                      {filteredInventory.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                            没有找到匹配的数据
                          </td>
                        </tr>
                      ) : (
                        filteredInventory.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 border-b">{item.name}</td>
                            <td className="px-4 py-3 border-b font-mono">{item.sku}</td>
                            <td className="px-4 py-3 border-b">{item.quantity}</td>
                            <td className="px-4 py-3 border-b">{item.location}</td>
                            <td className="px-4 py-3 border-b">
                              <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusClass(item.status)}`}>
                                {getStatusText(item.status)}
                              </span>
                            </td>
                            <td className="px-4 py-3 border-b">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => handleViewDetail(item)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                详情
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
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
                    <p className="text-2xl font-bold text-green-900">
                      {inventory.filter(i => i.status === 'normal').length}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      占比 {Math.round(inventory.filter(i => i.status === 'normal').length / inventory.length * 100)}%
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">库存不足</h4>
                    <p className="text-2xl font-bold text-yellow-900">
                      {inventory.filter(i => i.status === 'low').length}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      占比 {Math.round(inventory.filter(i => i.status === 'low').length / inventory.length * 100)}%
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="text-sm font-medium text-red-800 mb-2">库存危急</h4>
                    <p className="text-2xl font-bold text-red-900">
                      {inventory.filter(i => i.status === 'critical').length}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      占比 {Math.round(inventory.filter(i => i.status === 'critical').length / inventory.length * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 详情弹窗 */}
      {showDetail && selectedItem && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetail(false)}
        >
          <Card 
            className="w-full max-w-md bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">商品详情</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDetail(false)}
                  className="hover:bg-slate-100 rounded-full w-8 h-8 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">商品名称</span>
                  <span className="font-semibold text-slate-900 text-lg">{selectedItem.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">SKU</span>
                  <span className="font-mono text-slate-900 bg-slate-100 px-3 py-1 rounded">{selectedItem.sku}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">库存数量</span>
                  <span className="font-bold text-slate-900 text-lg">{selectedItem.quantity}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">库位</span>
                  <span className="font-semibold text-slate-900">{selectedItem.location}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">状态</span>
                  <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${getStatusClass(selectedItem.status)}`}>
                    {getStatusText(selectedItem.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">分类</span>
                  <span className="font-semibold text-slate-900">{selectedItem.category}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 font-medium">最后更新</span>
                  <span className="font-semibold text-slate-900">{selectedItem.lastUpdated}</span>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => setShowDetail(false)}
                >
                  关闭
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setShowDetail(false)}
                >
                  确定
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Footer />
    </div>
  )
}