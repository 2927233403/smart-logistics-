"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, Upload, X, FileText, Check, Download, RefreshCw } from "lucide-react"

// Types
interface Order {
  id: string
  customer: string
  phone: string
  destination: string
  status: string
  amount: string
  date: string
  items?: string
  weight?: string
  notes?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState("")
  const [importPreview, setImportPreview] = useState<Partial<Order>[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Load orders from API
  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.destination.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Generate new order ID
  const generateOrderId = () => {
    const maxId = orders.reduce((max, order) => {
      const num = parseInt(order.id.replace("ORD-", ""))
      return num > max ? num : max
    }, 0)
    return `ORD-${String(maxId + 1).padStart(3, "0")}`
  }

  // Delete order
  const handleDelete = async (id: string) => {
    if (confirm("确定要删除这个订单吗？")) {
      try {
        await fetch(`/api/orders?id=${id}`, { method: 'DELETE' })
        loadOrders()
      } catch (error) {
        console.error('Failed to delete order:', error)
      }
    }
  }

  // Parse import text
  const parseImportText = (text: string) => {
    const lines = text.trim().split("\n").filter(line => line.trim())
    const preview: Partial<Order>[] = []
    
    lines.forEach((line, index) => {
      const parts = line.split(/[,\t，]/).map(p => p.trim())
      if (parts.length >= 3) {
        preview.push({
          id: generateOrderId(),
          customer: parts[0] || `客户${index + 1}`,
          phone: parts[1] || "13800000000",
          destination: parts[2] || "未知地址",
          status: "待发货",
          amount: parts[3] || "¥0",
          date: new Date().toISOString().split("T")[0]
        })
      }
    })
    
    return preview
  }

  // Handle import text change
  const handleImportTextChange = (text: string) => {
    setImportText(text)
    setImportPreview(parseImportText(text))
  }

  // Confirm import
  const confirmImport = async () => {
    if (importPreview.length > 0) {
      try {
        for (const order of importPreview as Order[]) {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
          })
        }
        loadOrders()
        setShowImportModal(false)
        setImportText("")
        setImportPreview([])
        alert(`成功导入 ${importPreview.length} 条订单！`)
      } catch (error) {
        console.error('Failed to import orders:', error)
      }
    }
  }

  // View order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  // New order form
  const [newOrder, setNewOrder] = useState({
    customer: "",
    phone: "",
    destination: "",
    amount: "",
    items: "",
    weight: ""
  })

  const handleAddOrder = async () => {
    if (newOrder.customer && newOrder.phone && newOrder.destination) {
      try {
        const order: Order = {
          id: generateOrderId(),
          customer: newOrder.customer,
          phone: newOrder.phone,
          destination: newOrder.destination,
          status: "待发货",
          amount: newOrder.amount || "¥0",
          date: new Date().toISOString().split("T")[0],
          items: newOrder.items,
          weight: newOrder.weight
        }
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        })
        loadOrders()
        setShowAddModal(false)
        setNewOrder({ customer: "", phone: "", destination: "", amount: "", items: "", weight: "" })
      } catch (error) {
        console.error('Failed to add order:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
          <p className="text-gray-500 mt-1">管理所有物流订单 - 共 {orders.length} 条</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadOrders}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="刷新数据"
          >
            <RefreshCw className="h-4 w-4" />
            <span>刷新</span>
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>批量导入</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>新建订单</span>
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
              placeholder="搜索订单号、客户名称、手机号、目的地..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">全部状态</option>
            <option value="待发货">待发货</option>
            <option value="运输中">运输中</option>
            <option value="已送达">已送达</option>
          </select>
        </div>
        {(searchTerm || statusFilter) && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <span>找到 {filteredOrders.length} 条结果</span>
            <button 
              onClick={() => { setSearchTerm(""); setStatusFilter("") }}
              className="text-blue-600 hover:underline"
            >
              清除筛选
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">加载中...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">暂无订单数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系方式</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">目的地</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{order.destination}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "待发货" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "运输中" ? "bg-blue-100 text-blue-800" :
                        order.status === "已送达" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{order.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="h-4 w-4 inline" />
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">新建订单</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">客户名称 *</label>
                <input
                  type="text"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入客户名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 *</label>
                <input
                  type="text"
                  value={newOrder.phone}
                  onChange={(e) => setNewOrder({...newOrder, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入联系电话"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目的地 *</label>
                <input
                  type="text"
                  value={newOrder.destination}
                  onChange={(e) => setNewOrder({...newOrder, destination: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="请输入目的地"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">金额</label>
                <input
                  type="text"
                  value={newOrder.amount}
                  onChange={(e) => setNewOrder({...newOrder, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="¥0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">物品</label>
                <input
                  type="text"
                  value={newOrder.items}
                  onChange={(e) => setNewOrder({...newOrder, items: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="物品描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">重量</label>
                <input
                  type="text"
                  value={newOrder.weight}
                  onChange={(e) => setNewOrder({...newOrder, weight: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="如：50kg"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddOrder}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">批量导入订单</h2>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">每行一条订单，格式：客户名称, 联系电话, 目的地, 金额（用逗号分隔）</p>
            </div>
            <textarea
              value={importText}
              onChange={(e) => handleImportTextChange(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="张三, 13800138001, 北京市朝阳区, ¥2000
李四, 13800138002, 上海市浦东新区, ¥1500"
            />
            {importPreview.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">预览（{importPreview.length} 条）：</p>
                <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {importPreview.map((order, index) => (
                    <div key={index} className="text-sm text-gray-600 py-1">
                      {order.customer} - {order.phone} - {order.destination} - {order.amount}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setShowImportModal(false); setImportText(""); setImportPreview([]) }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmImport}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={importPreview.length === 0}
              >
                确认导入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">订单详情</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">订单号</p>
                  <p className="font-medium text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">状态</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedOrder.status === "待发货" ? "bg-yellow-100 text-yellow-800" :
                    selectedOrder.status === "运输中" ? "bg-blue-100 text-blue-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">客户名称</p>
                  <p className="font-medium text-gray-900">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">联系电话</p>
                  <p className="font-medium text-gray-900">{selectedOrder.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">目的地</p>
                  <p className="font-medium text-gray-900">{selectedOrder.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">金额</p>
                  <p className="font-medium text-gray-900">{selectedOrder.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">日期</p>
                  <p className="font-medium text-gray-900">{selectedOrder.date}</p>
                </div>
                {selectedOrder.items && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">物品</p>
                    <p className="font-medium text-gray-900">{selectedOrder.items}</p>
                  </div>
                )}
                {selectedOrder.weight && (
                  <div>
                    <p className="text-sm text-gray-500">重量</p>
                    <p className="font-medium text-gray-900">{selectedOrder.weight}</p>
                  </div>
                )}
                {selectedOrder.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">备注</p>
                    <p className="font-medium text-gray-900">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
