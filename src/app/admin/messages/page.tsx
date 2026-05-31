"use client"

import { useState, useEffect } from "react"
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle, 
  X,
  RefreshCw,
  User,
  Mail,
  Phone,
  Clock,
  Filter
} from "lucide-react"

interface Message {
  id: string
  name: string
  phone: string
  email: string
  content: string
  status: "unread" | "read" | "replied"
  createTime: string
  reply?: string
  replyTime?: string
}

// 模拟消息数据
const mockMessages: Message[] = [
  {
    id: "MSG-001",
    name: "张三",
    phone: "13800138001",
    email: "zhangsan@example.com",
    content: "请问从北京到上海的物流需要多长时间？有大件货物需要运输。",
    status: "unread",
    createTime: "2024-01-15 14:30:00"
  },
  {
    id: "MSG-002",
    name: "李四",
    phone: "13800138002",
    email: "lisi@example.com",
    content: "我想查询订单 ORD-001 的物流状态，已经发货3天了。",
    status: "read",
    createTime: "2024-01-15 10:20:00"
  },
  {
    id: "MSG-003",
    name: "王五",
    phone: "13800138003",
    email: "wangwu@example.com",
    content: "冷链运输服务怎么收费？需要运输一批生鲜食品。",
    status: "replied",
    createTime: "2024-01-14 16:45:00",
    reply: "您好，冷链运输根据距离和重量收费，具体请咨询客服 400-888-9999",
    replyTime: "2024-01-14 17:00:00"
  },
]

const STORAGE_KEY = 'smart_logistics_messages'

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [timeRangeFilter, setTimeRangeFilter] = useState<string>("")
  const [isReplying, setIsReplying] = useState(false)

  // 加载消息
  const loadMessages = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setMessages(JSON.parse(stored))
      } else {
        // 初始化模拟数据
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockMessages))
        setMessages(mockMessages)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadMessages()
  }, [])

  // 保存消息
  const saveMessages = (newMessages: Message[]) => {
    setMessages(newMessages)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages))
    }
  }

  // 智能搜索高亮
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>')
  }

  // 智能过滤消息
  const filteredMessages = messages.filter(msg => {
    const searchLower = searchTerm.toLowerCase().trim()
    
    // 智能搜索：支持姓名、手机号、邮箱、内容、ID
    const matchesSearch = !searchLower || 
      msg.name.toLowerCase().includes(searchLower) ||
      msg.phone.includes(searchTerm) ||
      msg.email.toLowerCase().includes(searchLower) ||
      msg.content.toLowerCase().includes(searchLower) ||
      msg.id.toLowerCase().includes(searchLower)
    
    // 状态筛选
    const matchesStatus = statusFilter === "" || msg.status === statusFilter
    
    // 时间范围筛选（最近7天、30天等）
    let matchesTimeRange = true
    if (timeRangeFilter) {
      const msgDate = new Date(msg.createTime)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (timeRangeFilter) {
        case "today":
          matchesTimeRange = diffDays === 0
          break
        case "week":
          matchesTimeRange = diffDays <= 7
          break
        case "month":
          matchesTimeRange = diffDays <= 30
          break
        case "quarter":
          matchesTimeRange = diffDays <= 90
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesTimeRange
  })
  
  // 排序：未读优先，然后按时间倒序
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    // 未读消息排在最前面
    if (a.status === "unread" && b.status !== "unread") return -1
    if (b.status === "unread" && a.status !== "unread") return -1
    // 然后按时间倒序
    return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
  })

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-700 border-red-200"
      case "read":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "replied":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "unread": return "未读"
      case "read": return "已读"
      case "replied": return "已回复"
      default: return status
    }
  }

  // 查看消息详情
  const handleViewMessage = (msg: Message) => {
    setSelectedMessage(msg)
    setReplyText(msg.reply || "")
    setShowDetailModal(true)
    
    // 标记为已读
    if (msg.status === "unread") {
      const updated = messages.map(m => 
        m.id === msg.id ? { ...m, status: "read" as const } : m
      )
      saveMessages(updated)
    }
  }

  // 删除消息
  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条消息吗？")) {
      const updated = messages.filter(m => m.id !== id)
      saveMessages(updated)
    }
  }

  // 提交回复
  const handleReply = async () => {
    if (selectedMessage && replyText.trim() && !isReplying) {
      setIsReplying(true)
      
      try {
        const replyTime = new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
        
        const updatedMessage = { 
          ...selectedMessage, 
          status: "replied" as const, 
          reply: replyText.trim(), 
          replyTime 
        }
        
        const updated = messages.map(m => 
          m.id === selectedMessage.id ? updatedMessage : m
        )
        
        // 先更新本地状态
        setMessages(updated)
        setSelectedMessage(updatedMessage)
        
        // 保存到 localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        }
        
        // 清空回复文本
        setReplyText("")
        
        // 显示成功提示
        alert("回复成功！")
      } catch (error) {
        console.error('回复失败:', error)
        alert("回复失败，请重试！")
      } finally {
        setIsReplying(false)
      }
    }
  }

  // 统计
  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === "unread").length,
    read: messages.filter(m => m.status === "read").length,
    replied: messages.filter(m => m.status === "replied").length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">消息管理</h1>
          <p className="text-gray-500 mt-1">管理客户留言与咨询 · 共 {stats.total} 条</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadMessages}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="刷新数据"
          >
            <RefreshCw className="h-4 w-4" />
            <span>刷新</span>
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">全部消息</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">未读消息</p>
              <p className="text-xl font-bold text-red-600">{stats.unread}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已读</p>
              <p className="text-xl font-bold text-yellow-600">{stats.read}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已回复</p>
              <p className="text-xl font-bold text-green-600">{stats.replied}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 智能筛选器 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 智能搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 智能搜索：姓名、手机号、邮箱、内容、消息ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* 筛选器组 */}
          <div className="flex flex-wrap gap-2">
            {/* 状态筛选 */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white cursor-pointer appearance-none"
              >
                <option value="">📋 全部状态</option>
                <option value="unread">🔴 未读</option>
                <option value="read">🟡 已读</option>
                <option value="replied">🟢 已回复</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* 时间范围筛选 */}
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select 
                value={timeRangeFilter}
                onChange={(e) => setTimeRangeFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white cursor-pointer appearance-none"
              >
                <option value="">📅 全部时间</option>
                <option value="today">📆 今天</option>
                <option value="week">📆 最近7天</option>
                <option value="month">📆 最近30天</option>
                <option value="quarter">📆 最近90天</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* 清除筛选按钮 */}
            {(searchTerm || statusFilter || timeRangeFilter) && (
              <button 
                onClick={() => { setSearchTerm(""); setStatusFilter(""); setTimeRangeFilter("") }}
                className="px-4 py-2.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-300 hover:border-red-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                清除筛选
              </button>
            )}
          </div>
        </div>
        
        {/* 搜索结果统计 */}
        {(searchTerm || statusFilter || timeRangeFilter) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500">搜索结果：</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              共 {sortedMessages.length} 条
            </span>
            {searchTerm && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                关键词: "{searchTerm}"
              </span>
            )}
            {statusFilter && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                状态: {getStatusText(statusFilter)}
              </span>
            )}
            {timeRangeFilter && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                时间: {timeRangeFilter === 'today' ? '今天' : timeRangeFilter === 'week' ? '最近7天' : timeRangeFilter === 'month' ? '最近30天' : '最近90天'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">客户信息</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">留言内容</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      加载中...
                    </div>
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || statusFilter ? "没有找到匹配的消息" : "暂无消息数据"}
                  </td>
                </tr>
              ) : (
                sortedMessages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-gray-50 transition-colors ${msg.status === 'unread' ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{msg.name}</p>
                          <p className="text-sm text-gray-500">{msg.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p 
                        className="text-gray-600 max-w-md truncate"
                        dangerouslySetInnerHTML={{ 
                          __html: searchTerm 
                            ? highlightText(msg.content, searchTerm) 
                            : msg.content 
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(msg.status)}`}>
                        {getStatusText(msg.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {msg.createTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewMessage(msg)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="查看详情"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(msg.id)}
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

      {/* 消息详情弹窗 */}
      {showDetailModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">消息详情</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 客户信息 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  客户信息
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">姓名：</span>
                    <span className="text-gray-900">{selectedMessage.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">电话：</span>
                    <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">邮箱：</span>
                    <span className="text-gray-900">{selectedMessage.email || "未填写"}</span>
                  </div>
                </div>
              </div>

              {/* 留言内容 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  留言内容
                </h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedMessage.content}</p>
                  <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedMessage.createTime}
                  </p>
                </div>
              </div>

              {/* 回复区域 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  回复
                </h4>
                {selectedMessage.reply ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">{selectedMessage.reply}</p>
                    <p className="text-xs text-green-600 mt-3">
                      回复时间：{selectedMessage.replyTime}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="请输入回复内容..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowDetailModal(false)}
                        disabled={isReplying}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim() || isReplying}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isReplying ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            提交中...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            提交回复
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
