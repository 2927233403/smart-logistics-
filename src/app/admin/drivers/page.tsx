"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, User, Phone, X } from "lucide-react"

interface Driver {
  id: string
  name: string
  phone: string
  vehicle: string
  status: string
  orders: number
  rating: number
}

const initialDrivers: Driver[] = [
  { id: "D-001", name: "张师傅", phone: "13800138001", vehicle: "粤A12345", status: "运输中", orders: 156, rating: 4.9 },
  { id: "D-002", name: "李师傅", phone: "13800138002", vehicle: "粤B67890", status: "空闲", orders: 203, rating: 4.8 },
  { id: "D-003", name: "王师傅", phone: "13800138003", vehicle: "京C11111", status: "休息", orders: 89, rating: 4.7 },
  { id: "D-004", name: "赵师傅", phone: "13800138004", vehicle: "沪D22222", status: "运输中", orders: 312, rating: 4.9 },
  { id: "D-005", name: "钱师傅", phone: "13800138005", vehicle: "浙E33333", status: "空闲", orders: 178, rating: 4.6 },
]

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicle: "",
    status: "空闲"
  })

  const generateDriverId = () => {
    const num = drivers.length + 1
    return `D-${String(num).padStart(3, '0')}`
  }

  const handleCreateDriver = () => {
    if (!formData.name || !formData.phone) {
      alert("请填写司机姓名和联系电话")
      return
    }
    const newDriver: Driver = {
      id: generateDriverId(),
      ...formData,
      orders: 0,
      rating: 5.0
    }
    setDrivers([...drivers, newDriver])
    setFormData({ name: "", phone: "", vehicle: "", status: "空闲" })
    setShowModal(false)
  }

  const handleDeleteDriver = (id: string) => {
    if (confirm("确定要删除这位司机吗？")) {
      setDrivers(drivers.filter(d => d.id !== id))
    }
  }

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.includes(searchQuery) || 
                          driver.phone.includes(searchQuery) ||
                          driver.id.includes(searchQuery)
    const matchesStatus = !statusFilter || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">司机管理</h1>
          <p className="text-gray-500 mt-1">管理司机信息和排班</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>添加司机</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索司机姓名、电话..."
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
            <option value="休息">休息</option>
          </select>
        </div>
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{driver.name}</p>
                  <p className="text-sm text-gray-500">{driver.id}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                driver.status === "运输中" ? "bg-blue-100 text-blue-700" :
                driver.status === "空闲" ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {driver.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">绑定车辆</span>
                <span className="text-gray-900">{driver.vehicle || "未绑定"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">完成订单</span>
                <span className="text-gray-900">{driver.orders} 单</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">评分</span>
                <span className="text-yellow-500">⭐ {driver.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleDeleteDriver(driver.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">添加司机</h2>
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
                  司机姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">绑定车辆</label>
                <input
                  type="text"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                  placeholder="例如：粤A12345"
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
                  <option value="休息">休息</option>
                </select>
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
                onClick={handleCreateDriver}
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
