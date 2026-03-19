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
  MessageSquare
} from "lucide-react"
import { useState, useEffect } from "react"
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
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索..."
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
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
