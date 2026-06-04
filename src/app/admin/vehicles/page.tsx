"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Truck, X, Truck as TruckIcon, RefreshCw } from "lucide-react"

interface Vehicle {
  id: string
  plate: string
  driver: string
  phone: string
  status: string
  capacity: string
  location: string
  type?: string
  brand?: string
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [formData, setFormData] = useState({
    plate: "",
    driver: "",
    phone: "",
    capacity: "",
    status: "空闲",
    location: "",
    type: "货车",
    brand: ""
  })

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      setVehicles(data)
    } catch (error) {
      console.error('Failed to load vehicles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateVehicleId = () => {
    const num = vehicles.length + 1
    return `V-${String(num).padStart(3, '0')}`
  }

  const handleCreateVehicle = async () => {
    if (!formData.plate || !formData.driver || !formData.phone) {
      alert("请填写车牌号、司机姓名和联系电话")
      return
    }
    try {
      const newVehicle: Vehicle = {
        id: generateVehicleId(),
        ...formData
      }
      await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle)
      })
      loadVehicles()
      setFormData({ plate: "", driver: "", phone: "", capacity: "", status: "空闲", location: "", type: "货车", brand: "" })
      setShowModal(false)
    } catch (error) {
      console.error('Failed to create vehicle:', error)
    }
  }

  const handleDeleteVehicle = async (id: string) => {
    if (confirm("确定要删除这辆车吗？")) {
      try {
        await fetch(`/api/vehicles?id=${id}`, { method: 'DELETE' })
        loadVehicles()
      } catch (error) {
        console.error('Failed to delete vehicle:', error)
      }
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.includes(searchQuery) || 
                          vehicle.driver.includes(searchQuery) ||
                          vehicle.id.includes(searchQuery) ||
                          vehicle.location.includes(searchQuery)
    const matchesStatus = !statusFilter || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">车辆管理</h1>
          <p className="text-gray-500 mt-1">管理运输车辆信息 - 共 {vehicles.length} 辆</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadVehicles}
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
            <span>添加车辆</span>
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
              placeholder="搜索车牌号、司机..."
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
            <option value="运输中">运输中</option>
            <option value="空闲">空闲</option>
            <option value="维修中">维修中</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">加载中...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-12 text-center">
            <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">暂无车辆数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      vehicle.status === "运输中" ? "bg-blue-100" :
                      vehicle.status === "空闲" ? "bg-green-100" :
                      "bg-yellow-100"
                    }`}>
                      <TruckIcon className={`h-6 w-6 ${
                        vehicle.status === "运输中" ? "text-blue-600" :
                        vehicle.status === "空闲" ? "text-green-600" :
                        "text-yellow-600"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{vehicle.plate}</h3>
                      <p className="text-sm text-gray-500">{vehicle.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    vehicle.status === "运输中" ? "bg-blue-100 text-blue-700" :
                    vehicle.status === "空闲" ? "bg-green-100 text-green-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">司机：</span>
                    <span className="text-gray-900 font-medium">{vehicle.driver}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">电话：</span>
                    <span className="text-gray-900">{vehicle.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">载重：</span>
                    <span className="text-gray-900">{vehicle.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">位置：</span>
                    <span className="text-gray-900">{vehicle.location}</span>
                  </div>
                  {vehicle.brand && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">品牌：</span>
                      <span className="text-gray-900">{vehicle.brand}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
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

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">添加车辆</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">车牌号 *</label>
                <input
                  type="text"
                  value={formData.plate}
                  onChange={(e) => setFormData({...formData, plate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="如：粤A12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">司机姓名 *</label>
                <input
                  type="text"
                  value={formData.driver}
                  onChange={(e) => setFormData({...formData, driver: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入司机姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入联系电话"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">载重</label>
                <input
                  type="text"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="如：5吨"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">当前位置</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入位置"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">车辆品牌</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="如：东风"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="空闲">空闲</option>
                  <option value="运输中">运输中</option>
                  <option value="维修中">维修中</option>
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
                onClick={handleCreateVehicle}
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
