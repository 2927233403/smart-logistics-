"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Users, 
  Warehouse, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Shield,
  FileText,
  MessageSquare,
  Home,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface User {
  username: string
  name: string
  role: string
}

const sidebarLinks = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/orders", label: "订单管理", icon: Package },
  { href: "/admin/vehicles", label: "车辆管理", icon: Truck },
  { href: "/admin/drivers", label: "司机管理", icon: Users },
  { href: "/admin/warehouses", label: "仓库管理", icon: Warehouse },
  { href: "/admin/analytics", label: "数据分析", icon: BarChart3 },
  { href: "/admin/messages", label: "消息管理", icon: MessageSquare },
  { href: "/admin/users", label: "用户权限", icon: Shield },
  { href: "/admin/logs", label: "操作日志", icon: FileText },
  { href: "/admin/settings", label: "系统设置", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSmartPanel, setShowSmartPanel] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // 搜索建议数据
  const searchItems = [
    { label: "仪表盘", href: "/admin", icon: LayoutDashboard, desc: "查看系统概览" },
    { label: "订单管理", href: "/admin/orders", icon: Package, desc: "管理所有订单" },
    { label: "车辆管理", href: "/admin/vehicles", icon: Truck, desc: "车辆信息管理" },
    { label: "司机管理", href: "/admin/drivers", icon: Users, desc: "司机信息管理" },
    { label: "仓库管理", href: "/admin/warehouses", icon: Warehouse, desc: "仓库信息管理" },
    { label: "数据分析", href: "/admin/analytics", icon: BarChart3, desc: "查看数据报表" },
    { label: "消息管理", href: "/admin/messages", icon: MessageSquare, desc: "系统消息管理" },
    { label: "用户权限", href: "/admin/users", icon: Shield, desc: "用户权限设置" },
    { label: "操作日志", href: "/admin/logs", icon: FileText, desc: "查看操作记录" },
    { label: "系统设置", href: "/admin/settings", icon: Settings, desc: "系统配置" },
  ]

  // 过滤搜索结果
  const filteredResults = searchQuery.trim() 
    ? searchItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchItems

  // 不需要登录验证的页面
  const publicPages = ["/admin/login", "/admin/logout"]

  useEffect(() => {
    setMounted(true)
    
    // 检查登录状态
    const isLoggedIn = localStorage.getItem("admin_logged_in")
    const userData = localStorage.getItem("admin_user")
    
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        setUser(null)
      }
    }

    // 如果不是公开页面且未登录，跳转到登录页
    if (!publicPages.includes(pathname) && isLoggedIn !== "true") {
      router.push("/admin/login")
    }

    // 点击外部关闭下拉菜单
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [pathname, router])

  // 登录页面和退出页面不显示侧边栏布局
  if (publicPages.includes(pathname)) {
    return <>{children}</>
  }

  // 等待客户端挂载
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r transition-transform duration-200 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">管理后台</span>
            </Link>
            <button 
              className="lg:hidden p-2"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-1">
            <Link 
              href="/admin/logout"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>退出登录</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden p-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search */}
            <div ref={searchRef} className="hidden md:block relative">
              <div 
                className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => {
                  setShowSearch(true)
                  setTimeout(() => searchInputRef.current?.focus(), 100)
                }}
              >
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="搜索功能..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  className="bg-transparent border-none outline-none text-sm w-48"
                />
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-xs text-gray-400 bg-gray-200 rounded">⌘K</kbd>
              </div>
              
              {/* Search Dropdown */}
              {showSearch && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b">
                    {searchQuery.trim() ? `搜索结果 (${filteredResults.length})` : '快捷导航'}
                  </div>
                  <div className="py-1">
                    {filteredResults.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setShowSearch(false)
                          setSearchQuery("")
                        }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <item.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Smart Panel - 返回主页 */}
            <div className="relative">
              <button 
                onClick={() => setShowSmartPanel(!showSmartPanel)}
                className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 group"
                title="智能面板"
              >
                <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              </button>
              
              {showSmartPanel && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSmartPanel(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span className="font-medium">智能快捷面板</span>
                      </div>
                    </div>
                    
                    <div className="p-3 space-y-2">
                      {/* 返回主页 */}
                      <Link
                        href="/"
                        onClick={() => setShowSmartPanel(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-200"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-200">
                          <Home className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">返回主页</p>
                          <p className="text-xs text-gray-500">前往前台首页</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </Link>
                      
                      {/* 仪表盘 */}
                      <Link
                        href="/admin"
                        onClick={() => setShowSmartPanel(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                          <LayoutDashboard className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">管理仪表盘</p>
                          <p className="text-xs text-gray-500">系统数据概览</p>
                        </div>
                      </Link>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-4 py-2 bg-gray-50 border-t text-center">
                      <p className="text-xs text-gray-400">点击前往目标页面</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "用户"}</p>
                  <p className="text-xs text-gray-500">{user?.role === "admin" ? "管理员" : "操作员"}</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{user?.name?.charAt(0) || "U"}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              
              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50">
                    <Link
                      href="/admin/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>系统设置</span>
                    </Link>
                    <hr className="my-2" />
                    <Link
                      href="/admin/logout"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>退出登录</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
