"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Layers,
  Package,
  BarChart2,
  Search,
  Check,
  X,
  Plus
} from "lucide-react"
import Link from "next/link"

export default function Shelf() {
  const [formData, setFormData] = useState({
    batchId: "",
    items: [
      {
        name: "",
        sku: "",
        quantity: "",
        fromLocation: "",
        toLocation: ""
      }
    ]
  })

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: "", sku: "", quantity: "", fromLocation: "", toLocation: "" }]
    }))
  }

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number, field?: string) => {
    const { value, name } = e.target
    if (index !== undefined && field) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里可以实现上架提交逻辑
    console.log('上架数据:', formData)
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
                    <Layers className="mr-2 h-6 w-6 text-blue-600" />
                    上架管理
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
                  <Link href="/warehouse/scan">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Search className="h-5 w-5" />
                      <span>过机端口</span>
                    </button>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 bg-blue-50 text-blue-600 font-medium">
                    <Layers className="h-5 w-5" />
                    <span>上架管理</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">新上架单</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 批次编号 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">批次编号</label>
                    <Input 
                      name="batchId" 
                      value={formData.batchId}
                      onChange={handleInputChange}
                      placeholder="请输入批次编号"
                      className="w-full"
                    />
                  </div>
                  
                  {/* 商品列表 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">商品信息</label>
                    {formData.items.map((item, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-slate-900">商品 {index + 1}</h4>
                          <button 
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">商品名称</label>
                            <Input 
                              value={item.name}
                              onChange={(e) => handleInputChange(e, index, 'name')}
                              placeholder="商品名称"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">SKU</label>
                            <Input 
                              value={item.sku}
                              onChange={(e) => handleInputChange(e, index, 'sku')}
                              placeholder="SKU"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">数量</label>
                            <Input 
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleInputChange(e, index, 'quantity')}
                              placeholder="数量"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">来源库位</label>
                            <Input 
                              value={item.fromLocation}
                              onChange={(e) => handleInputChange(e, index, 'fromLocation')}
                              placeholder="来源库位"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">目标库位</label>
                            <Input 
                              value={item.toLocation}
                              onChange={(e) => handleInputChange(e, index, 'toLocation')}
                              placeholder="目标库位"
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      <Plus className="h-4 w-4" />
                      添加商品
                    </Button>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex gap-4 justify-end">
                    <Button variant="outline" className="border-slate-300 text-slate-700">
                      保存草稿
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      确认上架
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* 库位状态 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">库位状态</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { location: "A-01-01", status: "occupied", items: 10, capacity: 20 },
                    { location: "A-01-02", status: "available", items: 0, capacity: 20 },
                    { location: "A-01-03", status: "occupied", items: 15, capacity: 20 },
                    { location: "A-02-01", status: "occupied", items: 20, capacity: 20 },
                    { location: "A-02-02", status: "available", items: 0, capacity: 20 },
                    { location: "A-02-03", status: "maintenance", items: 0, capacity: 20 }
                  ].map((location, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${location.status === 'occupied' ? 'border-green-200 bg-green-50' : location.status === 'available' ? 'border-blue-200 bg-blue-50' : 'border-yellow-200 bg-yellow-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-900">{location.location}</h4>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${location.status === 'occupied' ? 'bg-green-100 text-green-800' : location.status === 'available' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {location.status === 'occupied' ? '已占用' : location.status === 'available' ? '可用' : '维护中'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>已放: {location.items} 件</span>
                        <span>容量: {location.capacity} 件</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${location.status === 'occupied' ? 'bg-green-500' : location.status === 'available' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                          style={{ width: `${(location.items / location.capacity) * 100}%` }}
                        ></div>
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