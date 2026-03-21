"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Users,
  Package,
  BarChart2,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield
} from "lucide-react"
import Link from "next/link"

export default function Roles() {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "管理员",
      permissions: ["入库", "出库", "过机", "上架", "查询", "用户管理", "系统设置"],
      userCount: 1
    },
    {
      id: 2,
      name: "操作员",
      permissions: ["入库", "出库", "过机", "上架", "查询"],
      userCount: 2
    },
    {
      id: 3,
      name: "查看员",
      permissions: ["查询"],
      userCount: 1
    }
  ])
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    // 这里可以实现搜索逻辑
    console.log('搜索:', searchTerm)
  }

  const handleAddRole = () => {
    // 这里可以实现添加角色逻辑
    console.log('添加角色')
  }

  const handleEditRole = (id: number) => {
    // 这里可以实现编辑角色逻辑
    console.log('编辑角色:', id)
  }

  const handleDeleteRole = (id: number) => {
    // 这里可以实现删除角色逻辑
    setRoles(prev => prev.filter(role => role.id !== id))
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
                    <Shield className="mr-2 h-6 w-6 text-purple-600" />
                    角色管理
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
                  <Link href="/warehouse/users">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 text-slate-700 hover:bg-slate-100">
                      <Users className="h-5 w-5" />
                      <span>用户管理</span>
                    </button>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 bg-purple-50 text-purple-600 font-medium">
                    <Shield className="h-5 w-5" />
                    <span>角色管理</span>
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
                        placeholder="搜索角色名称"
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      搜索
                    </Button>
                    <Button onClick={handleAddRole} className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      添加角色
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {roles.map((role) => (
                    <Card key={role.id} className="hover:shadow-md transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 mb-1">{role.name}</h4>
                            <p className="text-sm text-slate-500">{role.userCount} 个用户</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleEditRole(role.id)}
                              variant="outline" 
                              size="sm" 
                              className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              编辑
                            </Button>
                            <Button 
                              onClick={() => handleDeleteRole(role.id)}
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              删除
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((permission, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* 权限说明 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">权限说明</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">入库</p>
                      <p className="text-sm text-slate-500">允许创建和管理入库单</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">出库</p>
                      <p className="text-sm text-slate-500">允许创建和管理出库单</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">过机</p>
                      <p className="text-sm text-slate-500">允许使用扫码功能</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">上架</p>
                      <p className="text-sm text-slate-500">允许管理商品上架</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">查询</p>
                      <p className="text-sm text-slate-500">允许查询库存信息</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">用户管理</p>
                      <p className="text-sm text-slate-500">允许管理用户账号</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-900">系统设置</p>
                      <p className="text-sm text-slate-500">允许修改系统设置</p>
                    </div>
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