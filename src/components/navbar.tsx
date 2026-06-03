"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import { Menu, X, User, LogOut, Settings, ChevronDown, Zap, Activity, Globe, Terminal, Search, Sun, Cloud, CloudRain, Snowflake, MapPin, Bell, ShoppingCart, BarChart2, Warehouse, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SmartChineseLogo from "@/components/SmartChineseLogo"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userName, setUserName] = useState("")
  const [currentTime, setCurrentTime] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [weather, setWeather] = useState({ temp: "--", condition: "sunny", city: "定位中..." })
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [notifications] = useState([
    { id: 1, message: "您的订单已发货", time: "10分钟前" },
    { id: 2, message: "新的物流信息更新", time: "30分钟前" },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState(0)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // 智能搜索建议
  const allSuggestions = [
    "物流追踪", "订单查询", "国际快递", "仓储服务", 
    "配送服务", "货物保险", "智能调度", "运费计算",
    "上门取件", "电子面单", "批量下单", "对账单"
  ]

  // 将天气代码转换为我们需要的状态
  const getConditionFromCode = (code: number): string => {
    if (code === 0) return 'sunny'
    if (code >= 1 && code <= 3) return 'cloudy'
    if (code >= 51 && code <= 67) return 'rainy'
    if (code >= 71 && code <= 86) return 'snowy'
    if (code >= 95) return 'rainy'
    return 'sunny'
  }

  // 根据坐标获取天气
  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number, defaultCity?: string) => {
    try {
      let cityName = defaultCity || "未知"
      
      // 尝试获取城市名
      try {
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
          signal: AbortSignal.timeout(3000)
        })
        if (geoResponse.ok) {
          const geoData = await geoResponse.json()
          cityName = geoData.address?.city || geoData.address?.town || geoData.address?.county || geoData.address?.state || geoData.address?.country || "未知"
        }
      } catch (e) {
        // 如果地理编码失败，使用默认城市名
      }
      
      // 获取天气
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`)
      const weatherData = await weatherResponse.json()
      
      const temp = `${Math.round(weatherData.current.temperature_2m)}°C`
      const condition = getConditionFromCode(weatherData.current.weather_code)
      
      // 保存位置供下次使用
      localStorage.setItem("last_location", JSON.stringify({ lat, lon, city: cityName }))
      
      setWeather({ temp, condition, city: cityName })
    } catch (error) {
      console.log("获取天气失败", error)
      if (!defaultCity) {
        setWeather({ temp: "25°C", condition: "sunny", city: "上海" })
      }
    } finally {
      setWeatherLoading(false)
    }
  }, [])

  // 尝试更新位置但不阻塞显示
  const tryUpdateLocation = useCallback(async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            await fetchWeatherByCoords(latitude, longitude)
          },
          undefined,
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
        )
      }
    } catch (error) {
      // 静默失败，不打印错误
    }
  }, [fetchWeatherByCoords])

  // 获取用户位置和天气 - 优化版
  const getLocationAndWeather = useCallback(async (forceRefresh = false) => {
    setWeatherLoading(true)
    
    // 如果不是强制刷新，先尝试从localStorage获取上次位置作为快速显示
    if (!forceRefresh) {
      const savedLocation = localStorage.getItem("last_location")
      if (savedLocation) {
        try {
          const loc = JSON.parse(savedLocation)
          await fetchWeatherByCoords(loc.lat, loc.lon, loc.city)
          // 同时继续尝试更新位置
          tryUpdateLocation()
          return
        } catch (e) {
          // 继续其他方案
        }
      }
    } else {
      // 强制刷新时清除缓存
      localStorage.removeItem("last_location")
    }

    // 多级降级方案
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          const timeoutId = setTimeout(() => reject(new Error("定位超时")), 8000)
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              clearTimeout(timeoutId)
              resolve(pos)
            },
            (err) => {
              clearTimeout(timeoutId)
              reject(err)
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
          )
        })
        
        const { latitude, longitude } = position.coords
        await fetchWeatherByCoords(latitude, longitude)
        return
      }
    } catch (error) {
      // 静默失败，不打印错误
    }
    
    // 最终使用默认数据（跳过所有IP定位，避免网络错误）
    setWeather({ temp: "25°C", condition: "sunny", city: "义乌" })
    setWeatherLoading(false)
  }, [fetchWeatherByCoords, tryUpdateLocation])

  // 购物车初始化
  const initCart = useCallback(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart)
        setCartItems(cart.length || 0)
      } catch (e) {
        setCartItems(0)
      }
    }
  }, [])

  // 监听购物车变化
  const handleCartChange = useCallback(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart)
        setCartItems(cart.length || 0)
      } catch (e) {
        setCartItems(0)
      }
    }
  }, [])

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
    
    setMounted(true)
    
    // 时钟更新
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('zh-CN')), 1000)
    setCurrentTime(new Date().toLocaleTimeString('zh-CN'))
    
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
    
    getLocationAndWeather()
    initCart()
    
    // 监听购物车变化
    window.addEventListener("storage", handleCartChange)
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus)
      window.removeEventListener("storage", handleCartChange)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("popstate", checkActiveLink)
      document.removeEventListener('mousedown', handleClickOutside)
      clearInterval(timer)
    }
  }, [getLocationAndWeather, initCart, handleCartChange])

  const handleLogout = () => {
    localStorage.removeItem("user_logged_in")
    localStorage.removeItem("user_info")
    setIsLoggedIn(false)
    setShowUserMenu(false)
    window.location.href = "/"
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // 这里可以实现搜索功能
      console.log('搜索:', searchQuery)
      // 根据搜索内容跳转到相应页面
      if (searchQuery.includes('追踪') || searchQuery.includes('订单')) {
        window.location.href = '/tracking'
      } else if (searchQuery.includes('仓储')) {
        window.location.href = '/warehouse'
      } else if (searchQuery.includes('AI') || searchQuery.includes('助手')) {
        window.location.href = '/ai-chat'
      }
    }
  }

  // 智能搜索建议更新
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allSuggestions.filter(s => 
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchSuggestions(filtered.slice(0, 5))
    } else {
      setSearchSuggestions(allSuggestions.slice(0, 6))
    }
  }, [searchQuery])

  const navLinks = [
    { href: "/", label: "首页", icon: Zap },
    { href: "/tracking", label: "物流追踪", icon: Activity },
    { href: "/ai-chat", label: "AI助手", icon: Sparkles },
    { href: "/services", label: "服务介绍", icon: Globe },
    { href: "/warehouse", label: "仓储管理", icon: Warehouse },
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
                <div className="absolute right-0 top-full mt-2 w-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-500/20 border border-slate-700/50 p-4 z-50 animate-slide-in-from-right">
                  <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-3">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder="搜索订单、服务或路线..."
                        className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    </div>
                    <Button type="submit" size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/30 border-0">
                      搜索
                    </Button>
                  </form>
                  
                  {/* 智能搜索建议 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-cyan-400" />
                        智能建议
                      </span>
                      {searchQuery && (
                        <span className="text-xs text-cyan-400">找到 {searchSuggestions.length} 个结果</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(suggestion)
                            handleSearch({ preventDefault: () => {} } as any)
                          }}
                          className="px-3 py-1.5 text-xs rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 border border-slate-700/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-700/30 text-xs text-slate-500 flex items-center gap-2">
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">Enter</kbd>
                    <span>快速搜索</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 ml-2">Esc</kbd>
                    <span>关闭</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* 天气信息 - 可点击刷新 */}
            <button
              onClick={() => getLocationAndWeather(true)}
              className={`flex items-center space-x-2 text-sm transition-all duration-300 hover:bg-slate-800/50 px-3 py-1.5 rounded-xl ${
                weatherLoading ? 'opacity-70 cursor-wait' : 'text-slate-300 hover:text-white cursor-pointer'
              }`}
              title="点击刷新天气（强制刷新会清除缓存并重新定位"
            >
              <MapPin className={`h-4 w-4 ${weatherLoading ? 'text-slate-500 animate-pulse' : 'text-blue-400'}`} />
              <span className={weatherLoading ? 'animate-pulse' : ''}>{weather.city}</span>
              {weatherLoading ? (
                <div className="w-4 h-4 border-2 border-slate-500 border-t-blue-400 rounded-full animate-spin"></div>
              ) : (
                getWeatherIcon(weather.condition)
              )}
              <span>{weather.temp}</span>
            </button>
            
            {/* 购物车 */}
            <div className="relative cart-container">
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 rounded-full hover:bg-slate-800/50 transition-all duration-300 group"
              >
                <ShoppingCart className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white text-xs flex items-center justify-center animate-bounce shadow-lg shadow-red-500/30">
                    {cartItems}
                  </span>
                )}
              </button>
              {showCart && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-blue-500/20 border border-slate-700/50 p-4 z-50 animate-slide-in-from-right">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-white">购物车</h3>
                    <button
                      onClick={() => {
                        localStorage.setItem("cart", JSON.stringify([]))
                        setCartItems(0)
                        window.dispatchEvent(new Event('storage'))
                      }}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      清空
                    </button>
                  </div>
                  {cartItems === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">购物车为空</p>
                      <p className="text-slate-500 text-xs mt-1">去逛逛添加商品吧</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {(() => {
                        try {
                          const savedCart = localStorage.getItem("cart")
                          const cart = savedCart ? JSON.parse(savedCart) : []
                          if (cart.length === 0) return null
                          return cart.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between pb-2 border-b border-slate-700/50 group">
                              <div className="flex-1">
                                <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.name}</p>
                                <p className="text-xs text-slate-500">{item.desc || ''}</p>
                              </div>
                              <div className="text-right ml-3">
                                <p className="text-sm text-white font-medium">{item.price}</p>
                                <p className="text-xs text-slate-500">x{item.quantity || 1}</p>
                              </div>
                            </div>
                          ))
                        } catch {
                          return null
                        }
                      })()}
                    </div>
                  )}
                  {cartItems > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <div className="flex justify-between mb-3">
                        <span className="text-slate-400 text-sm">合计</span>
                        <span className="text-white font-semibold text-lg">
                          {(() => {
                            try {
                              const savedCart = localStorage.getItem("cart")
                              const cart = savedCart ? JSON.parse(savedCart) : []
                              let total = 0
                              cart.forEach((item: any) => {
                                const price = parseFloat((item.price || '0').replace(/[^0-9.]/g, ''))
                                total += price * (item.quantity || 1)
                              })
                              return `¥${total.toFixed(2)}`
                            } catch {
                              return '¥0.00'
                            }
                          })()}
                        </span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/30 border-0">
                        去结算
                      </Button>
                    </div>
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
              <span>{mounted ? (currentTime || '--:--:--') : '--:--:--'}</span>
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
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    activeLink === link.href 
                      ? 'text-white bg-slate-800/70 border border-slate-700/50' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className={`h-5 w-5 transition-colors ${
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
