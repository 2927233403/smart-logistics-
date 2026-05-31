"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Users as UsersIcon,
  Package,
  BarChart2,
  Search,
  Plus,
  Edit,
  Trash2,
  User as UserIcon
} from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "管理员", role: "管理员", email: "admin@example.com", status: "active", lastLogin: "2026-03-21 10:00:00" },
    { id: 2, name: "操作员1", role: "操作员", email: "operator1@example.com", status: "active", lastLogin: "2026-03-21 09:30:00" },
    { id: 3, name: "操作员2", role: "操作员", email: "operator2@example.com", status: "inactive", lastLogin: "2026-03-20 16:00:00" },
    { id: 4, name: "查看员", role: "查看员", email: "viewer@example.com", status: "active", lastLogin: "2026-03-19 14:00:00" }
  ])
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    // 这里可以实现搜索逻辑
    console.log('搜索:', searchTerm)
  }

  const handleAddUser = () => {
    // 这里可以实现添加用户逻辑
    console.log('添加用户')
  }

  const handleEditUser = (id: number) => {
    // 这里可以实现编辑用户逻辑
    console.log('编辑用户:', id)
  }

  const handleDeleteUser = (id: number) => {
    // 这里可以实现删除用户逻辑
    setUsers(prev => prev.filter(user => user.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <div className="lg:w-64">
            <Card className="h-full">
              <CardContent className="p-0">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <UsersIcon className="mr-2 h-6 w-6 text-blue-600" />
                    用户管理
                  </h2>
                </div>
                <div className="p-4">
                  <Link href="/warehouse">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <BarChart2 className="h-5 w-5" />
                      <span>仓库概览</span>
                    </button>
                  </Link>
                  <Link href="/warehouse/inbound">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Package className="h-5 w-5" />
                      <span>入库管理</span>
                    </button>
                  </Link>
                  <Link href="/warehouse/search">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Search className="h-5 w-5" />
                      <span>库存查询</span>
                    </button>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 bg-blue-50 text-blue-600 font-medium">
                    <UsersIcon className="h-5 w-5" />
                    <span>用户管理</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="搜索用户名称或邮箱"
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      搜索
                    </Button>
                    <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      添加用户
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">用户ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">用户名称</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">角色</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">邮箱</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">状态</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">最后登录</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 border-b font-mono">{user.id}</td>
                          <td className="px-4 py-3 border-b">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${user.role === '管理员' ? 'bg-purple-100 text-purple-800' : user.role === '操作员' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b">{user.email}</td>
                          <td className="px-4 py-3 border-b">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {user.status === 'active' ? '活跃' : '禁用'}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b font-mono text-sm">{user.lastLogin}</td>
                          <td className="px-4 py-3 border-b">
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleEditUser(user.id)}
                                variant="outline" 
                                size="sm" 
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                编辑
                              </Button>
                              <Button 
                                onClick={() => handleDeleteUser(user.id)}
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                删除
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            {/* 用户统计 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">用户统计</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">总用户数</h4>
                    <p className="text-2xl font-bold text-blue-900">4</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-sm font-medium text-green-800 mb-2">活跃用户</h4>
                    <p className="text-2xl font-bold text-green-900">3</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="text-sm font-medium text-red-800 mb-2">禁用用户</h4>
                    <p className="text-2xl font-bold text-red-900">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}