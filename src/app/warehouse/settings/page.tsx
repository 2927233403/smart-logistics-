"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Package,
  BarChart2,
  Search,
  Save,
  RefreshCw,
  Server
} from "lucide-react"
import Link from "next/link"

export default function Settings() {
  const [settings, setSettings] = useState({
    warehouseName: "智能仓储中心",
    warehouseAddress: "上海市浦东新区张江高科技园区",
    contactPerson: "张经理",
    contactPhone: "13800138000",
    email: "warehouse@example.com",
    workingHours: "周一至周日 8:00-22:00",
    maxItemsPerLocation: 20,
    autoBackup: true,
    backupInterval: "每天",
    notificationEnabled: true,
    notificationEmail: "admin@example.com"
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    // 这里可以实现保存设置逻辑
    console.log('保存设置:', settings)
  }

  const handleReset = () => {
    // 这里可以实现重置设置逻辑
    console.log('重置设置')
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
                    <Settings className="mr-2 h-6 w-6 text-gray-600" />
                    系统设置
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
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 bg-gray-50 text-gray-600 font-medium">
                    <Settings className="h-5 w-5" />
                    <span>系统设置</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">系统设置</h3>
                
                <form className="space-y-6">
                  {/* 仓库信息 */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-4 flex items-center">
                      <Server className="h-5 w-5 mr-2 text-gray-600" />
                      仓库信息
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">仓库名称</label>
                        <Input 
                          name="warehouseName" 
                          value={settings.warehouseName}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">仓库地址</label>
                        <Input 
                          name="warehouseAddress" 
                          value={settings.warehouseAddress}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">联系人</label>
                        <Input 
                          name="contactPerson" 
                          value={settings.contactPerson}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">联系电话</label>
                        <Input 
                          name="contactPhone" 
                          value={settings.contactPhone}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">邮箱</label>
                        <Input 
                          name="email" 
                          value={settings.email}
                          onChange={handleInputChange}
                          type="email"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">工作时间</label>
                        <Input 
                          name="workingHours" 
                          value={settings.workingHours}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 库存设置 */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-4">库存设置</h4>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">每个库位最大容量</label>
                      <Input 
                        name="maxItemsPerLocation" 
                        value={settings.maxItemsPerLocation}
                        onChange={handleInputChange}
                        type="number"
                        className="w-full max-w-xs"
                      />
                    </div>
                  </div>
                  
                  {/* 系统设置 */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-4">系统设置</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          id="autoBackup" 
                          name="autoBackup"
                          checked={settings.autoBackup}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <label htmlFor="autoBackup" className="text-sm font-medium text-slate-700">自动备份</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-700 min-w-[100px]">备份频率</label>
                        <select 
                          name="backupInterval"
                          value={settings.backupInterval}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          <option value="每天">每天</option>
                          <option value="每周">每周</option>
                          <option value="每月">每月</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          id="notificationEnabled" 
                          name="notificationEnabled"
                          checked={settings.notificationEnabled}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <label htmlFor="notificationEnabled" className="text-sm font-medium text-slate-700">启用通知</label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">通知邮箱</label>
                        <Input 
                          name="notificationEmail" 
                          value={settings.notificationEmail}
                          onChange={handleInputChange}
                          type="email"
                          className="w-full max-w-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex gap-4 justify-end">
                    <Button onClick={handleReset} variant="outline" className="border-slate-300 text-slate-700">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      重置
                    </Button>
                    <Button onClick={handleSave} className="bg-gray-600 hover:bg-gray-700 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      保存设置
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}