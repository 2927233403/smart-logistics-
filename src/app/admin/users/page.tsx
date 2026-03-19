"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, User, Shield, X, Key, Mail, Phone, Calendar, CheckCircle } from "lucide-react"

interface AdminUser {
  id: string
  username: string
  name: string
  email: string
  phone: string
  role: string
  status: string
  permissions: string[]
  lastLogin: string
  createdAt: string
}

const initialUsers: AdminUser[] = [
  { 
    id: "U-001", 
    username: "admin", 
    name: "系统管理员", 
    email: "admin@logistics.com", 
    phone: "13800138000",
    role: "超级管理员", 
    status: "正常",
    permissions: ["订单管理", "车辆管理", "司机管理", "仓库管理", "数据分析", "系统设置", "用户管理", "日志查看"],
    lastLogin: "2024-01-15 10:30",
    createdAt: "2023-01-01"
  },
  { 
    id: "U-002", 
    username: "operator1", 
    name: "张操作员", 
    email: "zhang@logistics.com", 
    phone: "13800138001",
    role: "操作员", 
    status: "正常",
    permissions: ["订单管理", "车辆管理", "司机管理"],
    lastLogin: "2024-01-15 09:15",
    createdAt: "2023-06-15"
  },
  { 
    id: "U-003", 
    username: "operator2", 
    name: "李操作员", 
    email: "li@logistics.com", 
    phone: "13800138002",
    role: "操作员", 
    status: "正常",
    permissions: ["订单管理", "仓库管理"],
    lastLogin: "2024-01-14 16:45",
    createdAt: "2023-08-20"
  },
  { 
    id: "U-004", 
    username: "viewer1", 
    name: "王查看员", 
    email: "wang@logistics.com", 
    phone: "13800138003",
    role: "查看员", 
    status: "正常",
    permissions: ["订单管理", "数据分析"],
    lastLogin: "2024-01-13 14:20",
    createdAt: "2023-10-10"
  },
  { 
    id: "U-005", 
    username: "disabled1", 
    name: "赵已禁用", 
    email: "zhao@logistics.com", 
    phone: "13800138004",
    role: "操作员", 
    status: "禁用",
    permissions: ["订单管理"],
    lastLogin: "2023-12-01 08:00",
    createdAt: "2023-05-05"
  },
]

const allPermissions = [
  { id: "orders", label: "订单管理" },
  { id: "vehicles", label: "车辆管理" },
  { id: "drivers", label: "司机管理" },
  { id: "warehouses", label: "仓库管理" },
  { id: "analytics", label: "数据分析" },
  { id: "settings", label: "系统设置" },
  { id: "users", label: "用户管理" },
  { id: "logs", label: "日志查看" },
]

const roleOptions = [
  { value: "超级管理员", permissions: allPermissions.map(p => p.label) },
  { value: "操作员", permissions: ["订单管理", "车辆管理", "司机管理", "仓库管理"] },
  { value: "查看员", permissions: ["订单管理", "数据分析"] },
]

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    role: "操作员",
    permissions: ["订单管理", "车辆管理", "司机管理", "仓库管理"]
  })

  const generateUserId = () => {
    const num = users.length + 1
    return `U-${String(num).padStart(3, '0')}`
  }

  const handleRoleChange = (role: string) => {
    const roleConfig = roleOptions.find(r => r.value === role)
    setFormData({
      ...formData,
      role,
      permissions: roleConfig?.permissions || []
    })
  }

  const handlePermissionToggle = (permission: string) => {
    const newPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission]
    setFormData({ ...formData, permissions: newPermissions })
  }

  const handleCreateUser = () => {
    if (!formData.username || !formData.name || !formData.email) {
      alert("请填写用户名、姓名和邮箱")
      return
    }
    const newUser: AdminUser = {
      id: generateUserId(),
      ...formData,
      status: "正常",
      lastLogin: "-",
      createdAt: new Date().toISOString().split('T')[0]
    }
    setUsers([...users, newUser])
    setFormData({
      username: "",
      name: "",
      email: "",
      phone: "",
      role: "操作员",
      permissions: ["订单管理", "车辆管理", "司机管理", "仓库管理"]
    })
    setShowModal(false)
  }

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === "正常" ? "禁用" : "正常" }
        : user
    ))
  }

  const handleDeleteUser = (id: string) => {
    if (confirm("确定要删除这个用户吗？")) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(searchQuery) || 
                          user.username.includes(searchQuery) ||
                          user.email.includes(searchQuery)
    const matchesRole = !roleFilter || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户权限管理</h1>
          <p className="text-gray-500 mt-1">管理后台用户和权限分配</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>添加用户</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总用户数</p>
              <p className="text-xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">超级管理员</p>
              <p className="text-xl font-bold text-gray-900">{users.filter(u => u.role === "超级管理员").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">正常用户</p>
              <p className="text-xl font-bold text-gray-900">{users.filter(u => u.status === "正常").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已禁用</p>
              <p className="text-xl font-bold text-gray-900">{users.filter(u => u.status === "禁用").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户名、姓名、邮箱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">全部角色</option>
            <option value="超级管理员">超级管理员</option>
            <option value="操作员">操作员</option>
            <option value="查看员">查看员</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">用户信息</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">角色</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">权限</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">状态</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">最后登录</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === "超级管理员" ? "bg-purple-100 text-purple-700" :
                      user.role === "操作员" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {user.permissions.slice(0, 3).map((perm) => (
                        <span key={perm} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                          {perm}
                        </span>
                      ))}
                      {user.permissions.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                          +{user.permissions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === "正常" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === "正常" 
                            ? "text-gray-400 hover:text-yellow-600 hover:bg-yellow-50" 
                            : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                        }`}
                        title={user.status === "正常" ? "禁用" : "启用"}
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">添加用户</h2>
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
                      <User className="h-3 w-3" />
                      <span>用户名 <span className="text-red-500">*</span></span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="登录用户名"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>姓名 <span className="text-red-500">*</span></span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="用户姓名"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>邮箱 <span className="text-red-500">*</span></span>
                    </span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="user@example.com"
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
                    placeholder="13800138000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>角色</span>
                  </span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>{role.value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center space-x-1">
                    <Key className="h-3 w-3" />
                    <span>权限分配</span>
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {allPermissions.map((perm) => (
                    <label 
                      key={perm.id}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.permissions.includes(perm.label)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.label)}
                        onChange={() => handlePermissionToggle(perm.label)}
                        className="sr-only"
                      />
                      <span className="text-sm">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateUser}
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
