"use client"

import { useState } from "react"
import { Search, Download, Filter, Calendar, User, Monitor, Activity, AlertCircle, Info, CheckCircle, XCircle, Clock } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  module: string
  detail: string
  ip: string
  status: "成功" | "失败" | "警告"
  device: string
}

const initialLogs: LogEntry[] = [
  { id: "L-001", timestamp: "2024-01-15 10:30:25", user: "admin", action: "登录系统", module: "用户认证", detail: "管理员登录成功", ip: "192.168.1.100", status: "成功", device: "Chrome / Windows" },
  { id: "L-002", timestamp: "2024-01-15 10:32:15", user: "admin", action: "创建订单", module: "订单管理", detail: "创建订单 ORD-2024-001", ip: "192.168.1.100", status: "成功", device: "Chrome / Windows" },
  { id: "L-003", timestamp: "2024-01-15 10:35:42", user: "operator1", action: "登录系统", module: "用户认证", detail: "操作员登录成功", ip: "192.168.1.101", status: "成功", device: "Firefox / macOS" },
  { id: "L-004", timestamp: "2024-01-15 10:40:18", user: "operator1", action: "更新车辆", module: "车辆管理", detail: "更新车辆 粤A12345 状态为运输中", ip: "192.168.1.101", status: "成功", device: "Firefox / macOS" },
  { id: "L-005", timestamp: "2024-01-15 10:45:33", user: "unknown", action: "登录尝试", module: "用户认证", detail: "用户名或密码错误", ip: "203.0.113.50", status: "失败", device: "Safari / iOS" },
  { id: "L-006", timestamp: "2024-01-15 10:50:00", user: "admin", action: "删除司机", module: "司机管理", detail: "删除司机 D-006", ip: "192.168.1.100", status: "成功", device: "Chrome / Windows" },
  { id: "L-007", timestamp: "2024-01-15 11:00:15", user: "operator2", action: "导出数据", module: "数据分析", detail: "导出1月份订单报表", ip: "192.168.1.102", status: "成功", device: "Edge / Windows" },
  { id: "L-008", timestamp: "2024-01-15 11:15:28", user: "viewer1", action: "查看订单", module: "订单管理", detail: "查看订单详情 ORD-2024-001", ip: "192.168.1.103", status: "成功", device: "Chrome / Android" },
  { id: "L-009", timestamp: "2024-01-15 11:30:45", user: "admin", action: "修改设置", module: "系统设置", detail: "启用双因素认证", ip: "192.168.1.100", status: "成功", device: "Chrome / Windows" },
  { id: "L-010", timestamp: "2024-01-15 11:45:12", user: "operator1", action: "批量导入", module: "订单管理", detail: "导入50条订单记录，其中3条失败", ip: "192.168.1.101", status: "警告", device: "Firefox / macOS" },
  { id: "L-011", timestamp: "2024-01-15 12:00:00", user: "system", action: "自动备份", module: "系统维护", detail: "数据库自动备份完成", ip: "127.0.0.1", status: "成功", device: "System" },
  { id: "L-012", timestamp: "2024-01-15 12:15:33", user: "disabled1", action: "登录尝试", module: "用户认证", detail: "账户已被禁用", ip: "192.168.1.105", status: "失败", device: "Chrome / Windows" },
]

const moduleOptions = ["全部模块", "用户认证", "订单管理", "车辆管理", "司机管理", "仓库管理", "数据分析", "系统设置", "系统维护"]
const statusOptions = ["全部状态", "成功", "失败", "警告"]

export default function LogsPage() {
  const [logs] = useState<LogEntry[]>(initialLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [moduleFilter, setModuleFilter] = useState("全部模块")
  const [statusFilter, setStatusFilter] = useState("全部状态")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.includes(searchQuery) || 
                          log.action.includes(searchQuery) ||
                          log.detail.includes(searchQuery) ||
                          log.ip.includes(searchQuery)
    const matchesModule = moduleFilter === "全部模块" || log.module === moduleFilter
    const matchesStatus = statusFilter === "全部状态" || log.status === statusFilter
    return matchesSearch && matchesModule && matchesStatus
  })

  // 统计数据
  const successCount = logs.filter(l => l.status === "成功").length
  const failCount = logs.filter(l => l.status === "失败").length
  const warningCount = logs.filter(l => l.status === "警告").length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "成功": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "失败": return <XCircle className="h-4 w-4 text-red-500" />
      case "警告": return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const handleExport = () => {
    alert("日志导出功能：将导出当前筛选条件下的所有日志记录")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">操作日志</h1>
          <p className="text-gray-500 mt-1">查看系统操作记录和审计日志</p>
        </div>
        <button 
          onClick={handleExport}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>导出日志</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总日志数</p>
              <p className="text-xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">成功操作</p>
              <p className="text-xl font-bold text-gray-900">{successCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">失败操作</p>
              <p className="text-xl font-bold text-gray-900">{failCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">警告记录</p>
              <p className="text-xl font-bold text-gray-900">{warningCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户、操作、详情、IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
              <span className="text-gray-400">至</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            <select 
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {moduleOptions.map((module) => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">时间</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">用户</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">操作</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">模块</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">详情</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">IP地址</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{log.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{log.action}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 max-w-xs truncate block">{log.detail}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-mono">{log.ip}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status)}
                      <span className={`text-sm ${
                        log.status === "成功" ? "text-green-600" :
                        log.status === "失败" ? "text-red-600" :
                        "text-yellow-600"
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            显示 {filteredLogs.length} 条记录，共 {logs.length} 条
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              上一页
            </button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
