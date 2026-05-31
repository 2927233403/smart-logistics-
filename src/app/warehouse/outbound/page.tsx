"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Truck,
  Package,
  BarChart2,
  Search,
  Plus,
  Check,
  X
} from "lucide-react"
import Link from "next/link"

export default function Outbound() {
  const [formData, setFormData] = useState({
    orderId: "",
    customer: "",
    items: [
      {
        name: "",
        sku: "",
        quantity: "",
        location: ""
      }
    ],
    notes: ""
  })
  const [isScanning, setIsScanning] = useState(false)
  const [scannedItems, setScannedItems] = useState<string[]>([])

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: "", sku: "", quantity: "", location: "" }]
    }))
  }

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number, field?: string) => {
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

  const handleScan = () => {
    setIsScanning(true)
    // 模拟扫码过程
    setTimeout(() => {
      const mockSku = `SKU${Math.floor(Math.random() * 10000)}`
      setScannedItems(prev => [...prev, mockSku])
      setIsScanning(false)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里可以实现出库提交逻辑
    console.log('出库数据:', formData)
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
                    <Truck className="mr-2 h-6 w-6 text-orange-600" />
                    出库管理
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
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 bg-orange-50 text-orange-600 font-medium">
                    <Truck className="h-5 w-5" />
                    <span>出库管理</span>
                  </button>
                  <Link href="/warehouse/scan">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Search className="h-5 w-5" />
                      <span>过机端口</span>
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">新出库单</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 基本信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">订单编号</label>
                      <Input 
                        name="orderId" 
                        value={formData.orderId}
                        onChange={handleInputChange}
                        placeholder="请输入订单编号"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">客户名称</label>
                      <Input 
                        name="customer" 
                        value={formData.customer}
                        onChange={handleInputChange}
                        placeholder="请输入客户名称"
                        className="w-full"
                      />
                    </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <div className="flex gap-2">
                              <Input 
                                value={item.sku}
                                onChange={(e) => handleInputChange(e, index, 'sku')}
                                placeholder="SKU"
                                className="flex-1"
                              />
                              <Button 
                                onClick={handleScan}
                                disabled={isScanning}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                {isScanning ? '扫码中...' : '扫码'}
                              </Button>
                            </div>
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
                            <label className="block text-xs font-medium text-slate-600 mb-1">库位</label>
                            <Input 
                              value={item.location}
                              onChange={(e) => handleInputChange(e, index, 'location')}
                              placeholder="库位"
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
                  
                  {/* 备注 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">备注</label>
                    <Textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="请输入备注信息"
                      className="w-full"
                      rows={3}
                    />
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex gap-4 justify-end">
                    <Button variant="outline" className="border-slate-300 text-slate-700">
                      保存草稿
                    </Button>
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                      确认出库
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* 扫码记录 */}
            {scannedItems.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">扫码记录</h3>
                  <div className="space-y-2">
                    {scannedItems.map((sku, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-orange-600" />
                          <span className="font-medium">{sku}</span>
                        </div>
                        <span className="text-sm text-slate-500">已扫码</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}