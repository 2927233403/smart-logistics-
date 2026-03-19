"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Truck, X, Truck as TruckIcon } from "lucide-react"

interface Vehicle {
  id: string
  plate: string
  driver: string
  phone: string
  status: string
  capacity: string
  location: string
}

const initialVehicles: Vehicle[] = [
  { id: "V-001", plate: "粤A12345", driver: "张师傅", phone: "13800138001", status: "运输中", capacity: "5吨", location: "广州市天河区" },
  { id: "V-002", plate: "粤B67890", driver: "李师傅", phone: "13800138002", status: "空闲", capacity: "3吨", location: "深圳市南山区" },
  { id: "V-003", plate: "京C11111", driver: "王师傅", phone: "13800138003", status: "维修中", capacity: "8吨", location: "北京市朝阳区" },
  { id: "V-004", plate: "沪D22222", driver: "赵师傅", phone: "13800138004", status: "运输中", capacity: "5吨", location: "上海市浦东新区" },
  { id: "V-005", plate: "浙E33333", driver: "钱师傅", phone: "13800138005", status: "空闲", capacity: "10吨", location: "杭州市西湖区" },
]

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [formData, setFormData] = useState({
    plate: "",
    driver: "",
    phone: "",
    capacity: "",
    status: "空闲",
    location: ""
  })

  const generateVehicleId = () => {
    const num = vehicles.length + 1
    return `V-${String(num).padStart(3, '0')}`
  }

  const handleCreateVehicle = () => {
    if (!formData.plate || !formData.driver || !formData.phone) {
      alert("请填写车牌号、司机姓名和联系电话")
      return
    }
    const newVehicle: Vehicle = {
      id: generateVehicleId(),
      ...formData
    }
    setVehicles([...vehicles, newVehicle])
    setFormData({ plate: "", driver: "", phone: "", capacity: "", status: "空闲", location: "" })
    setShowModal(false)
  }

  const handleDeleteVehicle = (id: string) => {
    if (confirm("确定要删除这辆车吗？")) {
      setVehicles(vehicles.filter(v => v.id !== id))
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.includes(searchQuery) || 
                          vehicle.driver.includes(searchQuery) ||
                          vehicle.id.includes(searchQuery)
    const matchesStatus = !statusFilter || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">车辆管理</h1>
          <p className="text-gray-500 mt-1">管理运输车辆信息</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>添加车辆</span>
        </button>
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
            <option value="空闲">空闲</option>
            <option value="运输中">运输中</option>
            <option value="维修中">维修中</option>
          </select>
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{vehicle.plate}</p>
                  <p className="text-sm text-gray-500">{vehicle.id}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                vehicle.status === "运输中" ? "bg-blue-100 text-blue-700" :
                vehicle.status === "空闲" ? "bg-green-100 text-green-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {vehicle.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">司机</span>
                <span className="text-gray-900">{vehicle.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">电话</span>
                <span className="text-gray-900">{vehicle.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">载重</span>
                <span className="text-gray-900">{vehicle.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">当前位置</span>
                <span className="text-gray-900">{vehicle.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDeleteVehicle(vehicle.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">添加车辆</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  车牌号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.plate}
                  onChange={(e) => setFormData({...formData, plate: e.target.value})}
                  placeholder="例如：粤A12345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  司机姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.driver}
                  onChange={(e) => setFormData({...formData, driver: e.target.value})}
                  placeholder="请输入司机姓名"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  联系电话 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="请输入联系电话"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">载重</label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="例如：5吨"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="空闲">空闲</option>
                    <option value="运输中">运输中</option>
                    <option value="维修中">维修中</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">当前位置</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="请输入当前位置"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateVehicle}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
