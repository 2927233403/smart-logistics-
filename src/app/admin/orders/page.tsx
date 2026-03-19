"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, Upload, X, FileText, Check, Download, RefreshCw } from "lucide-react"
import { getOrders, saveOrders, deleteOrder, generateOrderId, initSampleOrders, OrderData } from "@/lib/orderStorage"

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState("")
  const [importPreview, setImportPreview] = useState<Partial<OrderData>[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // 加载订单数据
  useEffect(() => {
    initSampleOrders()
    loadOrders()
  }, [])

  const loadOrders = () => {
    const data = getOrders()
    setOrders(data)
    setIsLoading(false)
  }

  // 过滤订单
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.destination.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // 生成新订单号
  const generateOrderId = () => {
    const maxId = orders.reduce((max, order) => {
      const num = parseInt(order.id.replace("ORD-", ""))
      return num > max ? num : max
    }, 0)
    return `ORD-${String(maxId + 1).padStart(3, "0")}`
  }

  // 删除订单
  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个订单吗？")) {
      deleteOrder(id)
      loadOrders()
    }
  }

  // 解析导入文本
  const parseImportText = (text: string) => {
    const lines = text.trim().split("\n").filter(line => line.trim())
    const preview: Partial<OrderData>[] = []
    
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

  // 处理导入文本变化
  const handleImportTextChange = (text: string) => {
    setImportText(text)
    setImportPreview(parseImportText(text))
  }

  // 确认导入
  const confirmImport = () => {
    if (importPreview.length > 0) {
      const newOrders = [...orders, ...importPreview as OrderData[]]
      saveOrders(newOrders)
      loadOrders()
      setShowImportModal(false)
      setImportText("")
      setImportPreview([])
      alert(`成功导入 ${importPreview.length} 条订单！`)
    }
  }

  // 查看订单详情
  const handleViewOrder = (order: OrderData) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  // 添加订单
  const [newOrder, setNewOrder] = useState({
    customer: "",
    phone: "",
    destination: "",
    amount: ""
  })

  const handleAddOrder = () => {
    if (newOrder.customer && newOrder.phone && newOrder.destination) {
      const order: OrderData = {
        id: generateOrderId(),
        customer: newOrder.customer,
        phone: newOrder.phone,
        destination: newOrder.destination,
        status: "待发货",
        amount: newOrder.amount || "¥0",
        date: new Date().toISOString().split("T")[0]
      }
      const newOrders = [order, ...orders]
      saveOrders(newOrders)
      loadOrders()
      setShowAddModal(false)
      setNewOrder({ customer: "", phone: "", destination: "", amount: "" })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
          <p className="text-gray-500 mt-1">管理所有物流订单 · 共 {orders.length} 条</p>
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">客户</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">目的地</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      加载中...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || statusFilter ? "没有找到匹配的订单" : "暂无订单数据"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{order.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === "运输中" ? "bg-blue-100 text-blue-700" :
                        order.status === "待发货" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="查看详情"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="编辑">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(order.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新建订单弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">新建订单</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
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
                  placeholder="例如：¥1,000"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 批量导入弹窗 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">批量导入运单号</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 导入说明 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">导入格式说明</h4>
                <p className="text-sm text-blue-700 mb-2">每行一条记录，字段之间用逗号或制表符分隔：</p>
                <code className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-800">
                  客户名称, 联系电话, 目的地, 金额(可选)
                </code>
                <p className="text-sm text-blue-700 mt-2">示例：</p>
                <code className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-800 block mt-1">
                  张三, 13800138001, 北京市朝阳区, ¥1,280<br/>
                  李四, 13800138002, 上海市浦东新区, ¥2,350
                </code>
              </div>

              {/* 导入文本框 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">粘贴数据</label>
                <textarea
                  value={importText}
                  onChange={(e) => handleImportTextChange(e.target.value)}
                  className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                  placeholder="在此粘贴数据..."
                />
              </div>

              {/* 预览 */}
              {importPreview.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      预览 ({importPreview.length} 条记录)
                    </label>
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      格式正确
                    </span>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium text-gray-500">订单号</th>
                          <th className="text-left px-3 py-2 font-medium text-gray-500">客户</th>
                          <th className="text-left px-3 py-2 font-medium text-gray-500">电话</th>
                          <th className="text-left px-3 py-2 font-medium text-gray-500">目的地</th>
                          <th className="text-left px-3 py-2 font-medium text-gray-500">金额</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {importPreview.slice(0, 5).map((order, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 font-medium text-gray-900">{order.id}</td>
                            <td className="px-3 py-2 text-gray-700">{order.customer}</td>
                            <td className="px-3 py-2 text-gray-700">{order.phone}</td>
                            <td className="px-3 py-2 text-gray-700">{order.destination}</td>
                            <td className="px-3 py-2 text-gray-700">{order.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 5 && (
                      <div className="px-3 py-2 bg-gray-50 text-sm text-gray-500 text-center">
                        还有 {importPreview.length - 5} 条记录...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmImport}
                disabled={importPreview.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认导入 ({importPreview.length} 条)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 订单详情弹窗 */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">订单详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">订单号</span>
                <span className="font-medium">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">客户</span>
                <span className="font-medium">{selectedOrder.customer}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">联系电话</span>
                <span className="font-medium">{selectedOrder.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">目的地</span>
                <span className="font-medium">{selectedOrder.destination}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">金额</span>
                <span className="font-medium text-blue-600">{selectedOrder.amount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">状态</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedOrder.status === "运输中" ? "bg-blue-100 text-blue-700" :
                  selectedOrder.status === "待发货" ? "bg-yellow-100 text-yellow-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">创建日期</span>
                <span className="font-medium">{selectedOrder.date}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
