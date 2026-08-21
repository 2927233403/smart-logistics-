"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Warehouse, X, Building, RefreshCw } from "lucide-react"

interface Warehouse {
  id: string
  name: string
  location: string
  capacity: string
  status: string
  manager: string
  phone: string
  type: string
  area: string
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    status: "正常",
    manager: "",
    phone: "",
    type: "中心仓",
    area: ""
  })

  useEffect(() => {
    loadWarehouses()
  }, [])

  const loadWarehouses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/warehouses')
      const data = await response.json()
      setWarehouses(data)
    } catch (error) {
      console.error('Failed to load warehouses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateWarehouseId = () => {
    const num = warehouses.length + 1
    return `W-${String(num).padStart(3, '0')}`
  }

  const handleCreateWarehouse = async () => {
    if (!formData.name || !formData.location || !formData.manager) {
      alert("请填写仓库名称、位置和管理员")
      return
    }
    try {
      const newWarehouse: Warehouse = {
        id: generateWarehouseId(),
        ...formData
      }
      await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWarehouse)
      })
      loadWarehouses()
      setFormData({
        name: "",
        location: "",
        capacity: "",
        status: "正常",
        manager: "",
        phone: "",
        type: "中心仓",
        area: ""
      })
      setShowModal(false)
    } catch (error) {
      console.error('Failed to create warehouse:', error)
    }
  }

  const handleDeleteWarehouse = async (id: string) => {
    if (confirm("确定要删除这个仓库吗？")) {
      try {
        await fetch(`/api/warehouses?id=${id}`, { method: 'DELETE' })
        loadWarehouses()
      } catch (error) {
        console.error('Failed to delete warehouse:', error)
      }
    }
  }

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.includes(searchQuery) || 
                          warehouse.id.includes(searchQuery) ||
                          warehouse.location.includes(searchQuery) ||
                          warehouse.manager.includes(searchQuery)
    const matchesStatus = !statusFilter || warehouse.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仓库管理</h1>
          <p className="text-gray-500 mt-1">管理仓库信息 - 共 {warehouses.length} 个</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadWarehouses}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>刷新</span>
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>添加仓库</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索仓库名称、位置、管理员..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">全部状态</option>
            <option value="正常">正常</option>
            <option value="满仓">满仓</option>
            <option value="维护中">维护中</option>
          </select>
        </div>
      </div>

      {/* Warehouses Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">加载中...</p>
          </div>
        ) : filteredWarehouses.length === 0 ? (
          <div className="p-12 text-center">
            <Warehouse className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">暂无仓库数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredWarehouses.map((warehouse) => (
              <div 
                key={warehouse.id} 
                className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      warehouse.status === "正常" ? "bg-green-100" :
                      warehouse.status === "满仓" ? "bg-red-100" :
                      "bg-yellow-100"
                    }`}>
                      <Building className={`h-6 w-6 ${
                        warehouse.status === "正常" ? "text-green-600" :
                        warehouse.status === "满仓" ? "text-red-600" :
                        "text-yellow-600"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{warehouse.name}</h3>
                      <p className="text-sm text-gray-500">{warehouse.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    warehouse.status === "正常" ? "bg-green-100 text-green-700" :
                    warehouse.status === "满仓" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {warehouse.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">位置：</span>
                    <span className="text-gray-900">{warehouse.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">容量：</span>
                    <span className="text-gray-900">{warehouse.capacity} 件</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">面积：</span>
                    <span className="text-gray-900">{warehouse.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">类型：</span>
                    <span className="text-gray-900">{warehouse.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">管理员：</span>
                    <span className="text-gray-900">{warehouse.manager}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">电话：</span>
                    <span className="text-gray-900">{warehouse.phone}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteWarehouse(warehouse.id)}
                    className="flex-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Warehouse Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">添加仓库</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">仓库名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="如：北京仓"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">位置 *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="如：北京市大兴区"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">容量</label>
                <input
                  type="text"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="如：10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">面积</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="如：5000㎡"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="中心仓">中心仓</option>
                  <option value="区域仓">区域仓</option>
                  <option value="前置仓">前置仓</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">管理员 *</label>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => setFormData({...formData, manager: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入管理员姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入联系电话"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="正常">正常</option>
                  <option value="满仓">满仓</option>
                  <option value="维护中">维护中</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateWarehouse}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
