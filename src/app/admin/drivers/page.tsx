"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, User, X, UserCheck, RefreshCw } from "lucide-react"

interface Driver {
  id: string
  name: string
  phone: string
  license: string
  status: string
  vehicle?: string
  joinDate: string
  experience?: string
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    license: "B2",
    status: "空闲",
    vehicle: "",
    joinDate: new Date().toISOString().split("T")[0],
    experience: ""
  })

  useEffect(() => {
    loadDrivers()
  }, [])

  const loadDrivers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/drivers')
      const data = await response.json()
      setDrivers(data)
    } catch (error) {
      console.error('Failed to load drivers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateDriverId = () => {
    const num = drivers.length + 1
    return `D-${String(num).padStart(3, '0')}`
  }

  const handleCreateDriver = async () => {
    if (!formData.name || !formData.phone) {
      alert("请填写司机姓名和联系电话")
      return
    }
    try {
      const newDriver: Driver = {
        id: generateDriverId(),
        ...formData
      }
      await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver)
      })
      loadDrivers()
      setFormData({
        name: "",
        phone: "",
        license: "B2",
        status: "空闲",
        vehicle: "",
        joinDate: new Date().toISOString().split("T")[0],
        experience: ""
      })
      setShowModal(false)
    } catch (error) {
      console.error('Failed to create driver:', error)
    }
  }

  const handleDeleteDriver = async (id: string) => {
    if (confirm("确定要删除这个司机吗？")) {
      try {
        await fetch(`/api/drivers?id=${id}`, { method: 'DELETE' })
        loadDrivers()
      } catch (error) {
        console.error('Failed to delete driver:', error)
      }
    }
  }

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.includes(searchQuery) || 
                          driver.id.includes(searchQuery) ||
                          driver.phone.includes(searchQuery)
    const matchesStatus = !statusFilter || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">司机管理</h1>
          <p className="text-gray-500 mt-1">管理司机信息 - 共 {drivers.length} 人</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadDrivers}
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
            <span>添加司机</span>
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
              placeholder="搜索司机姓名、编号..."
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
            <option value="在线">在线</option>
            <option value="空闲">空闲</option>
            <option value="离线">离线</option>
          </select>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">加载中...</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="p-12 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">暂无司机数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredDrivers.map((driver) => (
              <div 
                key={driver.id} 
                className="group bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      driver.status === "在线" ? "bg-green-100" :
                      driver.status === "空闲" ? "bg-blue-100" :
                      "bg-gray-100"
                    }`}>
                      <UserCheck className={`h-6 w-6 ${
                        driver.status === "在线" ? "text-green-600" :
                        driver.status === "空闲" ? "text-blue-600" :
                        "text-gray-600"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{driver.name}</h3>
                      <p className="text-sm text-gray-500">{driver.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    driver.status === "在线" ? "bg-green-100 text-green-700" :
                    driver.status === "空闲" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {driver.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">电话：</span>
                    <span className="text-gray-900">{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">驾照：</span>
                    <span className="text-gray-900">{driver.license}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">驾龄：</span>
                    <span className="text-gray-900">{driver.experience || "未知"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">入职：</span>
                    <span className="text-gray-900">{driver.joinDate}</span>
                  </div>
                  {driver.vehicle && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">车辆：</span>
                      <span className="text-gray-900">{driver.vehicle}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteDriver(driver.id)}
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

      {/* Add Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">添加司机</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">驾照类型</label>
                <select
                  value={formData.license}
                  onChange={(e) => setFormData({...formData, license: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">驾龄</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="如：3年"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">入职日期</label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  <option value="在线">在线</option>
                  <option value="离线">离线</option>
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
                onClick={handleCreateDriver}
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
