"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Warehouse, MapPin, X, User, Phone, Building2, Ruler } from "lucide-react"

interface Warehouse {
  id: string
  name: string
  address: string
  capacity: number
  used: number
  manager: string
  phone: string
}

const initialWarehouses: Warehouse[] = [
  { id: "W-001", name: "北京仓", address: "北京市朝阳区物流园A区", capacity: 10000, used: 7500, manager: "张经理", phone: "010-12345678" },
  { id: "W-002", name: "上海仓", address: "上海市浦东新区物流港B区", capacity: 15000, used: 12000, manager: "李经理", phone: "021-87654321" },
  { id: "W-003", name: "广州仓", address: "广州市天河区物流中心C区", capacity: 8000, used: 6000, manager: "王经理", phone: "020-11112222" },
  { id: "W-004", name: "深圳仓", address: "深圳市南山区物流基地D区", capacity: 12000, used: 9000, manager: "赵经理", phone: "0755-33334444" },
  { id: "W-005", name: "杭州仓", address: "杭州市西湖区物流园E区", capacity: 6000, used: 4500, manager: "钱经理", phone: "0571-55556666" },
]

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: "",
    manager: "",
    phone: ""
  })

  const generateWarehouseId = () => {
    const num = warehouses.length + 1
    return `W-${String(num).padStart(3, '0')}`
  }

  const handleCreateWarehouse = () => {
    if (!formData.name || !formData.address || !formData.manager) {
      alert("请填写仓库名称、地址和负责人")
      return
    }
    const newWarehouse: Warehouse = {
      id: generateWarehouseId(),
      name: formData.name,
      address: formData.address,
      capacity: parseInt(formData.capacity) || 5000,
      used: 0,
      manager: formData.manager,
      phone: formData.phone || "待填写"
    }
    setWarehouses([...warehouses, newWarehouse])
    setFormData({ name: "", address: "", capacity: "", manager: "", phone: "" })
    setShowModal(false)
  }

  const handleDeleteWarehouse = (id: string) => {
    if (confirm("确定要删除这个仓库吗？")) {
      setWarehouses(warehouses.filter(w => w.id !== id))
    }
  }

  const filteredWarehouses = warehouses.filter(warehouse => {
    return warehouse.name.includes(searchQuery) || 
           warehouse.address.includes(searchQuery) ||
           warehouse.manager.includes(searchQuery) ||
           warehouse.id.includes(searchQuery)
  })

  // 统计数据
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0)
  const totalUsed = warehouses.reduce((sum, w) => sum + w.used, 0)
  const avgUsage = totalCapacity > 0 ? ((totalUsed / totalCapacity) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仓库管理</h1>
          <p className="text-gray-500 mt-1">管理仓库信息和库存</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>添加仓库</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Warehouse className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">仓库总数</p>
              <p className="text-xl font-bold text-gray-900">{warehouses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Ruler className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总库容</p>
              <p className="text-xl font-bold text-gray-900">{totalCapacity.toLocaleString()} m²</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">平均使用率</p>
              <p className="text-xl font-bold text-gray-900">{avgUsage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索仓库名称、地址、负责人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Warehouse Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWarehouses.map((warehouse) => {
          const usagePercent = (warehouse.used / warehouse.capacity) * 100
          return (
            <div key={warehouse.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Warehouse className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{warehouse.name}</p>
                    <p className="text-sm text-gray-500">{warehouse.id}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  usagePercent > 80 ? "bg-red-100 text-red-700" :
                  usagePercent > 60 ? "bg-yellow-100 text-yellow-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {usagePercent.toFixed(0)}% 使用
                </span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{warehouse.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">负责人</span>
                  <span className="text-gray-900">{warehouse.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">联系电话</span>
                  <span className="text-gray-900">{warehouse.phone}</span>
                </div>
                
                {/* Capacity Progress */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">库容使用</span>
                    <span className="text-gray-700">{warehouse.used.toLocaleString()} / {warehouse.capacity.toLocaleString()} m²</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteWarehouse(warehouse.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Warehouse Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Warehouse className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">添加仓库</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center space-x-1">
                      <Warehouse className="h-3 w-3" />
                      <span>仓库名称 <span className="text-red-500">*</span></span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="例如：北京仓"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center space-x-1">
                      <Ruler className="h-3 w-3" />
                      <span>库容面积 (m²)</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="例如：10000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>仓库地址 <span className="text-red-500">*</span></span>
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="请输入详细地址"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>负责人 <span className="text-red-500">*</span></span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    placeholder="请输入负责人姓名"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>联系电话</span>
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="例如：010-12345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Quick Fill Buttons */}
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2">快速填充示例：</p>
                <div className="flex flex-wrap gap-2">
                  {["北京仓", "上海仓", "广州仓", "深圳仓", "成都仓"].map((name) => (
                    <button
                      key={name}
                      onClick={() => setFormData({...formData, name})}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateWarehouse}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>确认添加</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
