"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Truck, 
  MapPin, 
  Clock, 
  Shield, 
  Package, 
  TrendingUp,
  Search,
  ArrowRight,
  Zap,
  Sparkles,
  Globe,
  Moon,
  Sun,
  Palette,
  Phone,
  X,
  MessageSquare
} from "lucide-react"
import Link from "next/link"

// 主题配置
type Theme = "blue" | "purple" | "dark" | "green"

const themes: Record<Theme, {
  name: string
  gradient: string
  heroGradient: string
  primary: string
  secondary: string
  accent: string
  cardBg: string
  icon: any
  statsBg: string
  featuresBg: string
  ctaBg: string
}> = {
  blue: {
    name: "科技蓝",
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    heroGradient: "from-blue-600 via-blue-700 to-indigo-800",
    primary: "blue",
    secondary: "indigo",
    accent: "cyan",
    cardBg: "bg-white/10",
    icon: Zap,
    statsBg: "bg-white",
    featuresBg: "bg-gray-50",
    ctaBg: "bg-blue-600"
  },
  purple: {
    name: "霓虹紫",
    gradient: "from-purple-600 via-violet-700 to-fuchsia-800",
    heroGradient: "from-purple-600 via-violet-700 to-fuchsia-800",
    primary: "purple",
    secondary: "violet",
    accent: "fuchsia",
    cardBg: "bg-slate-900/30",
    icon: Sparkles,
    statsBg: "bg-slate-900",
    featuresBg: "bg-slate-950",
    ctaBg: "bg-purple-600"
  },
  dark: {
    name: "暗夜黑",
    gradient: "from-slate-800 via-gray-900 to-black",
    heroGradient: "from-slate-800 via-gray-900 to-black",
    primary: "slate",
    secondary: "gray",
    accent: "blue",
    cardBg: "bg-gray-800/30",
    icon: Moon,
    statsBg: "bg-gray-900",
    featuresBg: "bg-black",
    ctaBg: "bg-slate-800"
  },
  green: {
    name: "生态绿",
    gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    heroGradient: "from-emerald-600 via-teal-700 to-cyan-800",
    primary: "emerald",
    secondary: "teal",
    accent: "cyan",
    cardBg: "bg-white/10",
    icon: Globe,
    statsBg: "bg-white",
    featuresBg: "bg-emerald-50",
    ctaBg: "bg-emerald-600"
  }
}

export default function Home() {
  const router = useRouter()
  const [trackingNo, setTrackingNo] = useState("")
  const [currentTheme, setCurrentTheme] = useState<Theme>("blue")
  const [mounted, setMounted] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 从localStorage读取保存的主题
    const savedTheme = localStorage.getItem("home_theme") as Theme
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    localStorage.setItem("home_theme", theme)
  }

  const theme = themes[currentTheme]
  const isDark = currentTheme === "purple" || currentTheme === "dark"

  const handleSearch = () => {
    if (trackingNo.trim()) {
      router.push(`/tracking?q=${encodeURIComponent(trackingNo.trim())}`)
    }
  }

  const features = [
    {
      icon: Truck,
      title: "整车运输",
      description: "提供全国范围内的整车运输服务，安全高效，全程GPS追踪",
    },
    {
      icon: Package,
      title: "零担配送",
      description: "灵活的零担配送方案，满足小批量货物运输需求",
    },
    {
      icon: MapPin,
      title: "仓储服务",
      description: "现代化仓储设施，提供货物存储、分拣、包装等一站式服务",
    },
    {
      icon: Clock,
      title: "时效保障",
      description: "承诺准时送达，超时赔付，让您的货物准时到达目的地",
    },
    {
      icon: Shield,
      title: "货物保险",
      description: "全程货物保险保障，让您的货物运输更加安心",
    },
    {
      icon: TrendingUp,
      title: "智能调度",
      description: "AI智能调度系统，优化运输路线，降低物流成本",
    },
  ]

  const stats = [
    { value: "50+", label: "覆盖城市" },
    { value: "10000+", label: "合作企业" },
    { value: "99.8%", label: "准时率" },
    { value: "24/7", label: "客服支持" },
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <Navbar />
      
      {/* 主题切换器 */}
      <div className="fixed top-20 right-6 z-40 flex flex-col gap-2">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl shadow-blue-500/20">
          <div className="text-xs text-slate-400 text-center mb-2 px-2">主题切换</div>
          {(Object.keys(themes) as Theme[]).map((t) => {
            const ThemeIcon = themes[t].icon
            return (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  currentTheme === t 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                title={themes[t].name}
              >
                <ThemeIcon className="h-4 w-4" />
                <span className="text-xs font-medium">{themes[t].name}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br ${theme.heroGradient} text-white py-20 lg:py-32 transition-all duration-700`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80')] bg-cover bg-center opacity-10"></div>
          {/* 动态网格背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
          {/* 浮动光效 */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              智能物流，<span className={`${isDark ? 'text-cyan-400' : 'text-blue-200'}`}>畅达天下</span>
            </h1>
            <p className={`text-lg md:text-xl mb-8 ${isDark ? 'text-slate-300' : 'text-blue-100'}`}>
              专业的智能物流管理平台，为您提供高效、安全、便捷的物流解决方案
            </p>
            
            {/* Tracking Search */}
            <Card className={`${theme.cardBg} backdrop-blur-xl border-white/20 transition-all duration-500`}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="请输入运单号查询物流信息"
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 bg-white border-0 h-12 text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleSearch}
                    className="h-12 px-8 bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                  >
                    查询
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/order">
                <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 shadow-lg shadow-cyan-500/30 border-0">
                  <Sparkles className="mr-2 h-5 w-5" />
                  智能下单
                </Button>
              </Link>
              <Link href="/tracking">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 backdrop-blur-sm">
                  物流追踪
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg">
                  管理后台
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-12 border-b transition-all duration-700 ${theme.statsBg} ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 transition-all duration-700 ${theme.featuresBg}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              我们的服务
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              提供全方位的物流解决方案，满足您不同的运输需求
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`group hover:shadow-2xl transition-all duration-500 ${isDark ? 'bg-slate-900/50 border-slate-700/50' : ''}`}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 bg-gradient-to-br ${theme.gradient} shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 transition-all duration-700 ${theme.ctaBg}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备好开始了吗？
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-blue-100'}`}>
            立即注册，体验智能物流带来的便捷与高效
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl">
              免费注册
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => setShowContactModal(true)}
            >
              联系我们
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 联系我们弹窗 */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
            {/* 头部 */}
            <div className={`relative px-6 py-8 text-center ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
              <button 
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">联系我们</h3>
              <p className="text-white/80 mt-2">7x24小时客服热线</p>
            </div>
            
            {/* 内容 */}
            <div className="p-6 space-y-6">
              {/* 客服电话 */}
              <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                    <Phone className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>全国统一客服热线</p>
                    <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>400-888-9999</p>
                  </div>
                </div>
                <a 
                  href="tel:400-888-9999"
                  className={`block w-full py-3 text-center rounded-lg font-medium transition-colors ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  立即拨打
                </a>
              </div>
              
              {/* 在线留言 */}
              <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                    <MessageSquare className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>在线留言</p>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>我们将在24小时内回复</p>
                  </div>
                </div>
                <Link 
                  href="/contact"
                  onClick={() => setShowContactModal(false)}
                  className={`block w-full py-3 text-center rounded-lg font-medium transition-colors ${
                    isDark 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  去留言
                </Link>
              </div>
              
              {/* 工作时间 */}
              <div className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                <p>工作时间：周一至周日 8:00-22:00</p>
                <p className="mt-1">节假日正常服务</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
