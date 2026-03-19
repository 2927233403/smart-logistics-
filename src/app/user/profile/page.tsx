"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  User, Package, MapPin, FileText, Settings, 
  Truck, Bell, CreditCard, HelpCircle, LogOut,
  Edit2, ChevronRight, Phone, Mail, Building2
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface UserInfo {
  id: string
  name: string
  company: string
  phone: string
  email: string
}

export default function UserProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [activeMenu, setActiveMenu] = useState("profile")

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("user_logged_in")
    const userInfo = localStorage.getItem("user_info")
    
    if (isLoggedIn !== "true" || !userInfo) {
      router.push("/login")
      return
    }
    
    setUser(JSON.parse(userInfo))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user_logged_in")
    localStorage.removeItem("user_info")
    router.push("/")
  }

  const menuItems = [
    { id: "profile", label: "个人资料", icon: User },
    { id: "orders", label: "我的订单", icon: Package },
    { id: "addresses", label: "地址管理", icon: MapPin },
    { id: "invoices", label: "发票管理", icon: FileText },
    { id: "notifications", label: "消息通知", icon: Bell },
    { id: "security", label: "账号安全", icon: Settings },
  ]

  const quickStats = [
    { label: "待发货", value: 3, color: "bg-blue-500" },
    { label: "运输中", value: 12, color: "bg-orange-500" },
    { label: "已完成", value: 86, color: "bg-green-500" },
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">用户中心</h1>
            <p className="text-gray-500 mt-1">管理您的账户和订单</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 左侧菜单 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* 用户信息卡片 */}
                <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-blue-100 text-sm">{user.company}</p>
                    </div>
                  </div>
                </div>

                {/* 菜单列表 */}
                <nav className="p-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                        activeMenu === item.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ))}
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>退出登录</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* 右侧内容 */}
            <div className="lg:col-span-3 space-y-6">
              {/* 统计卡片 */}
              <div className="grid grid-cols-3 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <Package className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 个人资料 */}
              {activeMenu === "profile" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">个人资料</h2>
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                      <Edit2 className="h-4 w-4" />
                      <span className="text-sm">编辑</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">企业名称</p>
                        <p className="font-medium text-gray-900">{user.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">联系人</p>
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">手机号</p>
                        <p className="font-medium text-gray-900">{user.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">邮箱</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 我的订单 */}
              {activeMenu === "orders" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">我的订单</h2>
                  
                  {/* 订单列表 */}
                  <div className="space-y-4">
                    {[
                      { id: "WL20240315001", status: "运输中", from: "北京市", to: "上海市", date: "2024-03-15" },
                      { id: "WL20240314002", status: "待发货", from: "广州市", to: "深圳市", date: "2024-03-14" },
                      { id: "WL20240313003", status: "已完成", from: "成都市", to: "重庆市", date: "2024-03-13" },
                    ].map((order, index) => (
                      <div key={index} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-gray-900">订单号：{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "已完成" ? "bg-green-100 text-green-600" :
                            order.status === "运输中" ? "bg-blue-100 text-blue-600" :
                            "bg-orange-100 text-orange-600"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{order.from}</span>
                          <Truck className="h-4 w-4 mx-2" />
                          <span>{order.to}</span>
                          <span className="ml-auto">{order.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link href="/tracking">
                    <button className="w-full mt-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                      查看全部订单
                    </button>
                  </Link>
                </div>
              )}

              {/* 其他菜单占位 */}
              {["addresses", "invoices", "notifications", "security"].includes(activeMenu) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    {menuItems.find(m => m.id === activeMenu)?.label}
                  </h2>
                  <div className="text-center py-12 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>功能开发中，敬请期待...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
