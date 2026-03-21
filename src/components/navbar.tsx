"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, User, LogOut, Settings, ChevronDown, Zap, Activity, Globe, Terminal, Search, Sun, Cloud, CloudRain, Snowflake, MapPin, Bell, ShoppingCart, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SmartChineseLogo from "@/components/SmartChineseLogo"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userName, setUserName] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [weather, setWeather] = useState({ temp: "--", condition: "sunny", city: "未知" })
  const [notifications] = useState([
    { id: 1, message: "您的订单已发货", time: "10分钟前" },
    { id: 2, message: "新的物流信息更新", time: "30分钟前" },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [cartItems] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)

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
    
    // 检测当前活动链接
    const checkActiveLink = () => {
      const path = window.location.pathname
      setActiveLink(path)
    }
    checkActiveLink()
    window.addEventListener("popstate", checkActiveLink)
    
    // 点击外部关闭下拉菜单
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
      if (!event.target || !(event.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
      if (!event.target || !(event.target as Element).closest('.notification-container')) {
        setShowNotifications(false)
      }
      if (!event.target || !(event.target as Element).closest('.cart-container')) {
        setShowCart(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    
    // 模拟天气数据
    const fetchWeather = () => {
      // 这里可以替换为真实的天气API调用
      setWeather({ temp: "25°C", condition: "sunny", city: "上海" })
    }
    fetchWeather()
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("popstate", checkActiveLink)
      document.removeEventListener('mousedown', handleClickOutside)
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

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // 这里可以实现搜索功能
      console.log('搜索:', searchQuery)
    }
  }

  const navLinks = [
    { href: "/", label: "首页", icon: Zap },
    { href: "/tracking", label: "物流追踪", icon: Activity },
    { href: "/services", label: "服务介绍", icon: Globe },
    { href: "/admin", label: "管理后台", icon: Terminal },
  ]

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-4 w-4 text-yellow-400" />
      case 'cloudy':
        return <Cloud className="h-4 w-4 text-slate-400" />
      case 'rainy':
        return <CloudRain className="h-4 w-4 text-blue-400" />
      case 'snowy':
        return <Snowflake className="h-4 w-4 text-blue-200" />
      default:
        return <Sun className="h-4 w-4 text-yellow-400" />
    }
  }

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-blue-500/10' 
        : 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-700/30'
    }`}>
      {/* 顶部装饰线 */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 animate-float">
                <SmartChineseLogo variant="mini" className="w-8 h-8" animated={true} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors duration-300">测试网站-吴</span>
              <span className="text-xs text-blue-400 block tracking-wider group-hover:text-cyan-400 transition-colors duration-300">SMART LOGISTICS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 group ${
                  activeLink === link.href 
                    ? 'text-white bg-slate-800/70 border border-slate-700/50 shadow-lg shadow-blue-500/20 transform translate-y-[-2px]' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:translate-y-[-1px]'
                }`}
              >
                <link.icon className={`h-4 w-4 transition-colors duration-300 ${
                  activeLink === link.href ? 'text-cyan-400' : 'text-blue-400 group-hover:text-cyan-400' 
                }`} />
                <span>{link.label}</span>
                {activeLink === link.href && (
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>
          
          {/* 智能功能区 */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* 搜索按钮 */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-slate-800/50 transition-colors duration-300"
              >
                <Search className="h-5 w-5 text-slate-400 hover:text-white" />
              </button>
              {showSearch && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-blue-500/20 border border-slate-700/50 p-3 z-50 animate-slide-in-from-right">
                  <form onSubmit={handleSearch} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="搜索订单、服务或路线..."
                      className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/30 border-0">
                      搜索
                    </Button>
                  </form>
                  <div className="mt-2 text-xs text-slate-500">
                    热门搜索: 物流追踪, 国际快递, 仓储服务
                  </div>
                </div>
              )}
            </div>
            
            {/* 天气信息 */}
            <div className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white transition-colors duration-300">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>{weather.city}</span>
              {getWeatherIcon(weather.condition)}
              <span>{weather.temp}</span>
            </div>
            
            {/* 购物车 */}
            <div className="relative cart-container">
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 rounded-full hover:bg-slate-800/50 transition-colors duration-300"
              >
                <ShoppingCart className="h-5 w-5 text-slate-400 hover:text-white" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                    {cartItems}
                  </span>
                )}
              </button>
              {showCart && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-blue-500/20 border border-slate-700/50 p-4 z-50 animate-slide-in-from-right">
                  <h3 className="text-sm font-medium text-white mb-3">购物车</h3>
                  {cartItems === 0 ? (
                    <p className="text-slate-400 text-sm">购物车为空</p>
                  ) : (
                    <div className="space-y-3">
                      {/* 购物车项目 */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                        <span className="text-sm text-slate-300">标准物流服务</span>
                        <span className="text-sm text-white">¥100.00</span>
                      </div>
                    </div>
                  )}
                  {cartItems > 0 && (
                    <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/30 border-0">
                      结算
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {/* 通知 */}
            <div className="relative notification-container">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-slate-800/50 transition-colors duration-300"
              >
                <Bell className="h-5 w-5 text-slate-400 hover:text-white" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-blue-500/20 border border-slate-700/50 p-4 z-50 animate-slide-in-from-right">
                  <h3 className="text-sm font-medium text-white mb-3">通知</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-300">
                        <p className="text-sm text-slate-300">{notification.message}</p>
                        <p className="text-xs text-slate-500">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                    查看全部
                  </Button>
                </div>
              )}
            </div>
            
            {/* 时间显示 */}
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 hover:text-slate-400 transition-colors duration-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{currentTime.toLocaleTimeString('zh-CN')}</span>
            </div>
          </div>

          {/* 用户菜单 */}
          <div className="hidden md:flex items-center space-x-3 user-menu-container">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-all transform hover:translate-y-[-1px]"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse-slow">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">{userName}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-blue-500/20 border border-slate-700/50 py-2 z-50 animate-slide-in-from-right">
                    <Link href="/user/profile" className="flex items-center space-x-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
                      <User className="h-4 w-4 text-blue-400" />
                      <span>个人中心</span>
                    </Link>
                    <Link href="/user/orders" className="flex items-center space-x-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
                      <BarChart2 className="h-4 w-4 text-cyan-400" />
                      <span>我的订单</span>
                    </Link>
                    <Link href="/user/profile" className="flex items-center space-x-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
                      <Settings className="h-4 w-4 text-purple-400" />
                      <span>账户设置</span>
                    </Link>
                    <hr className="my-2 border-slate-700/50" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-colors"
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
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800/50 transform hover:translate-y-[-1px]">
                    登录
                  </Button>
                </Link>
                <Link href="/login?tab=register">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/30 border-0 transform hover:translate-y-[-1px]">
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
          <div className="md:hidden py-4 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl animate-fade-in">
            <div className="flex flex-col space-y-2">
              {/* 移动搜索 */}
              <div className="px-4 py-2">
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="搜索订单、服务或路线..."
                    className="flex-1 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/30 border-0">
                    搜索
                  </Button>
                </form>
              </div>
              
              {/* 导航链接 */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeLink === link.href 
                      ? 'text-white bg-slate-800/70 border border-slate-700/50' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className={`h-5 w-5 ${
                    activeLink === link.href ? 'text-cyan-400' : 'text-blue-400'
                  }`} />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {/* 天气信息（移动端） */}
              <div className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-slate-300">{weather.city}</span>
                {getWeatherIcon(weather.condition)}
                <span className="text-sm text-slate-300">{weather.temp}</span>
              </div>
              
              {/* 用户区域 */}
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
                    <Link href="/user/orders">
                      <Button variant="outline" size="sm" className="w-full justify-start border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/50">
                        <BarChart2 className="h-4 w-4 mr-2 text-cyan-400" />
                        我的订单
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
