"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, Settings, ChevronDown, Zap, Activity, Globe, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import SmartChineseLogo from "@/components/SmartChineseLogo"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userName, setUserName] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("user_logged_in")
      const user = localStorage.getItem("user_info")
      if (loggedIn === "true" && user) {
        setIsLoggedIn(true)
        setUserName(JSON.parse(user).name || "用户")
      }
    }
    checkLoginStatus()
    window.addEventListener("storage", checkLoginStatus)
    
    // 时钟更新
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    
    // 滚动监听
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus)
      window.removeEventListener("scroll", handleScroll)
      clearInterval(timer)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user_logged_in")
    localStorage.removeItem("user_info")
    setIsLoggedIn(false)
    setShowUserMenu(false)
    window.location.href = "/"
  }

  const navLinks = [
    { href: "/", label: "首页", icon: Zap },
    { href: "/tracking", label: "物流追踪", icon: Activity },
    { href: "/services", label: "服务介绍", icon: Globe },
    { href: "/admin", label: "管理后台", icon: Terminal },
  ]

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-blue-500/10' 
        : 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-700/30'
    }`}>
      {/* 顶部装饰线 */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <SmartChineseLogo variant="mini" className="w-8 h-8" animated={false} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white tracking-tight">智运物流</span>
              <span className="text-xs text-blue-400 block tracking-wider">SMART LOGISTICS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all group"
              >
                <link.icon className="h-4 w-4 text-blue-400 group-hover:text-cyan-400 transition-colors" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
          
          {/* 时间显示 */}
          <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-slate-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{currentTime.toLocaleTimeString('zh-CN')}</span>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">{userName}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-blue-500/20 border border-slate-700/50 py-2 z-50">
                    <Link href="/user/profile" className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
                      <User className="h-4 w-4 text-blue-400" />
                      <span>个人中心</span>
                    </Link>
                    <Link href="/user/orders" className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
                      <Settings className="h-4 w-4 text-cyan-400" />
                      <span>我的订单</span>
                    </Link>
                    <hr className="my-2 border-slate-700/50" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>退出登录</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800/50">
                    登录
                  </Button>
                </Link>
                <Link href="/login?tab=register">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/30 border-0">
                    免费注册
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="h-5 w-5 text-blue-400" />
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-slate-700/50">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{userName}</p>
                        <p className="text-xs text-slate-400">已登录</p>
                      </div>
                    </div>
                    <Link href="/user/profile">
                      <Button variant="outline" size="sm" className="w-full justify-start border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/50">
                        <User className="h-4 w-4 mr-2 text-blue-400" />
                        个人中心
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      退出登录
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="w-full border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/50">
                        登录
                      </Button>
                    </Link>
                    <Link href="/login?tab=register">
                      <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/30">
                        免费注册
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 底部装饰线 */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
    </nav>
  )
}
