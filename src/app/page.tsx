"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  MessageSquare,
  UploadCloud,
  Download,
  Database,
  FileText,
  CheckCircle,
  Activity,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

interface UpdateLog {
  version: string
  date: string
  title: string
  changes: string[]
  type: string
}

interface DynamicUpdate {
  message: string
  hash: string
  author: string
  category: string
}

interface DynamicChangelog {
  version: string
  date: string
  title: string
  changes: DynamicUpdate[]
  type: string
}

// 主题配置
type Theme = "blue" | "purple" | "dark" | "green"

// 定义上传文件的类型，包含name, size, type, url
interface UploadedFile {
  name: string
  size: number
  type: string
  url: string
  uploadDate: Date
}

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
  const [showContactModal, setShowContactModal] = useState(false)

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploadSection, setShowUploadSection] = useState(false)

  const [updateLogs, setUpdateLogs] = useState<UpdateLog[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const staticLogs: UpdateLog[] = [
    {
      version: "v2.0.1",
      date: "2026年6月1日",
      title: "AI智能助手与文件管理",
      changes: [
        "新增AI智能助手页面，支持文本和语音输入",
        "优化文件上传下载功能，支持多种格式",
        "添加智能搜索建议功能",
        "优化导航栏UI和交互体验",
        "修复多个已知问题"
      ],
      type: "feature"
    },
    {
      version: "v2.0.0",
      date: "2026年5月30日",
      title: "全新升级版本",
      changes: [
        "全新的主题系统，支持多种主题切换",
        "优化定位和天气功能",
        "改进购物车功能",
        "添加更新公告自动展示",
        "优化整体UI美观度"
      ],
      type: "major"
    },
    {
      version: "v1.5.0",
      date: "2026年5月28日",
      title: "功能增强",
      changes: [
        "添加物流追踪查询历史",
        "优化仓储管理页面",
        "改进响应式设计",
        "添加企业科技感图片"
      ],
      type: "enhancement"
    }
  ]

  const fetchChangelog = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/changelog')
      const data: DynamicChangelog[] = await response.json()
      
      if (data.length > 0 && data[0].changes.length > 0) {
        const latestLog: UpdateLog = {
          version: data[0].version,
          date: formatDate(data[0].date),
          title: data[0].title,
          changes: data[0].changes.map(c => c.message),
          type: data[0].type
        }
        setUpdateLogs([latestLog, ...staticLogs])
      } else {
        setUpdateLogs(staticLogs)
      }
    } catch (error) {
      console.error('获取更新日志失败:', error)
      setUpdateLogs(staticLogs)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatDate = (dateStr: string): string => {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`
    }
    return dateStr
  }

  useEffect(() => {
    // 从localStorage读取保存的主题
    const savedTheme = localStorage.getItem("home_theme") as Theme
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
    
    // 从localStorage读取上传的文件
    const savedFiles = localStorage.getItem("uploaded_files")
    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles)
        setUploadedFiles(parsed)
      } catch (e) {
        console.error("读取上传文件失败", e)
      }
    }

    fetchChangelog()
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // 处理每个文件并创建可下载的URL
    const newFiles: UploadedFile[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // 创建可下载的URL
      const url = URL.createObjectURL(file)
      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        url: url,
        uploadDate: new Date()
      })
      
      // 更新进度
      setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      // 添加一点延迟让动画更自然
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // 更新状态和localStorage
    const updatedFiles = [...uploadedFiles, ...newFiles]
    setUploadedFiles(updatedFiles)
    
    // 保存到localStorage（注意：URL.createObjectURL创建的URL不能直接保存到localStorage，因为刷新页面后会失效）
    // 我们只保存文件元数据，下次刷新后可以重新上传
    const filesToSave = updatedFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      uploadDate: f.uploadDate
    }))
    localStorage.setItem("uploaded_files", JSON.stringify(filesToSave))
    
    setIsUploading(false)
    setUploadProgress(100)
    
    // 重置input以便可以重复上传相同文件
    if (event.target) {
      event.target.value = ''
    }
  }

  // 下载文件
  const downloadFile = (file: UploadedFile) => {
    // 如果有URL（当前会话中上传的），直接下载
    if (file.url) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // 如果没有URL（从localStorage读取的旧文件），提示用户重新上传
      alert('该文件是之前上传的，需要重新上传才能下载')
    }
  }

  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index]
    // 释放URL对象
    if (fileToRemove.url) {
      URL.revokeObjectURL(fileToRemove.url)
    }
    
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(updatedFiles)
    
    // 更新localStorage
    const filesToSave = updatedFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      uploadDate: f.uploadDate
    }))
    localStorage.setItem("uploaded_files", JSON.stringify(filesToSave))
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

  const softwarePackages = [
    {
      name: "智能物流管理系统 v2.0",
      version: "2.0.1",
      size: "156 MB",
      type: "系统软件",
      description: "包含完整的订单管理、车辆调度、仓储管理功能",
      fileName: "smart-logistics-v2.0.1.zip"
    },
    {
      name: "物流追踪APP",
      version: "1.5.0",
      size: "45 MB",
      type: "移动应用",
      description: "iOS和Android客户端，支持实时追踪、在线下单",
      fileName: "logistics-tracker-v1.5.0.apk"
    },
    {
      name: "仓储管理系统",
      version: "3.2.0",
      size: "89 MB",
      type: "专业软件",
      description: "入库、出库、盘点、货架管理一体化系统",
      fileName: "warehouse-system-v3.2.0.exe"
    }
  ]

  // 修复：添加额外的注释确保Git检测到修改

  // 下载示例软件包
  const downloadSoftwarePackage = (pkg: any) => {
    // 创建一个模拟的下载
    const content = `# ${pkg.name}\n\n版本: ${pkg.version}\n\n${pkg.description}\n\n这是一个示例下载文件。`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = pkg.fileName || `${pkg.name.replace(/\s+/g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
      
      {/* Hero Section - 科技感增强 */}
      <section className={`relative bg-gradient-to-br ${theme.heroGradient} text-white py-20 lg:py-32 transition-all duration-700 overflow-hidden`}>
        {/* 科技感背景 - 动态网格 */}
        <div className="absolute inset-0">
          {/* 渐变底层 */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-blue-600/30 to-purple-600/20"></div>
          
          {/* 网格背景 */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          
          {/* 扫描线动画 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(6,182,212,0.03)_50%)] bg-[size:100%_4px] animate-[scan_10s_linear_infinite]"></div>
          
          {/* 浮动光效 */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
          
          {/* 企业科技感图片 - 右侧 */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full hidden lg:block">
            <div className="relative w-full h-full">
              {/* 科技感物流图片 */}
              <div className="absolute inset-0 bg-[url('https://aka.doubaocdn.com/s/5VdT1wXKhq')] bg-cover bg-center opacity-30"></div>
              {/* 图片遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-900/80"></div>
              {/* 发光边框 */}
              <div className="absolute inset-0 border-l border-cyan-400/30"></div>
              
              {/* 浮动数据卡片 */}
              <div className="absolute top-1/4 right-20 bg-slate-900/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-4 shadow-2xl shadow-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-cyan-400">实时数据</div>
                    <div className="text-xl font-bold text-white">同步中...</div>
                  </div>
                </div>
              </div>
              
              {/* 物流节点指示器 */}
              <div className="absolute bottom-1/4 right-32">
                {[
                  { x: 0, y: 0, label: "上海", delay: 0 },
                  { x: -20, y: -30, label: "北京", delay: 0.2 },
                  { x: 30, y: -20, label: "广州", delay: 0.4 },
                  { x: -10, y: 25, label: "成都", delay: 0.6 }
                ].map((point, i) => (
                  <div 
                    key={i}
                    className="absolute"
                    style={{ 
                      left: `${point.x}px`, 
                      top: `${point.y}px`,
                      animationDelay: `${point.delay}s`
                    }}
                  >
                    <div className="relative">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-cyan-300 font-medium bg-slate-900/80 px-2 py-1 rounded-full border border-cyan-400/30">
                        {point.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center lg:text-left lg:mx-0">
            {/* 科技感标签 */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-500/30 px-6 py-3 rounded-full mb-8 group">
              <div className="relative">
                <Zap className="h-5 w-5 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full animate-ping"></div>
              </div>
              <span className="text-cyan-300 font-medium tracking-wider">智能物流管理平台</span>
              <div className="h-4 w-px bg-cyan-500/30"></div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">企业版</Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              <span className="block">科技驱动，</span>
              <span className={`bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent`}>智慧物流</span>
            </h1>
            <p className={`text-lg md:text-xl mb-10 max-w-xl ${isDark ? 'text-slate-300' : 'text-blue-100'} leading-relaxed`}>
              采用AI智能调度、实时追踪、大数据分析技术，为企业提供全方位智能化物流解决方案
            </p>
            
            {/* Tracking Search - 科技感设计 */}
            <Card className={`${theme.cardBg} backdrop-blur-xl border-white/20 shadow-2xl shadow-blue-500/20 transition-all animate-in fade-in slide-in-from-bottom duration-700 delay-300 rounded-3xl overflow-hidden`}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <div className="relative">
                        <Search className="h-6 w-6 text-cyan-400" />
                        <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full"></div>
                      </div>
                    </div>
                    <Input 
                      placeholder="请输入运单号查询物流信息"
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-14 pr-4 bg-slate-900/50 border-2 border-slate-700/50 hover:border-cyan-500/50 focus:border-cyan-500 h-14 text-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 rounded-2xl"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleSearch}
                    className="h-14 px-10 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white font-bold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 relative overflow-hidden group rounded-2xl"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <span className="relative flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      查询
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-10 animate-in fade-in slide-in-from-bottom duration-700 delay-450">
              <Link href="/order">
                <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 shadow-lg shadow-cyan-500/30 border-0 transition-all duration-300 hover:shadow-cyan-500/50 hover:-translate-y-0.5 rounded-2xl h-12">
                  <Sparkles className="mr-2 h-5 w-5" />
                  智能下单
                </Button>
              </Link>
              <Link href="/tracking">
                <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 rounded-2xl h-12">
                  物流追踪
                </Button>
              </Link>
              <Button 
                size="lg" 
                onClick={() => setShowUploadSection(!showUploadSection)}
                className="bg-slate-900/50 hover:bg-slate-800/70 text-white backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-500/50 rounded-2xl h-12 group"
              >
                <UploadCloud className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                软件下载
              </Button>
              <Link href="/admin">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-2xl h-12">
                  管理后台
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 软件包上传/下载区域 */}
      {showUploadSection && (
        <section className={`py-16 border-b transition-all duration-700 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 py-2 rounded-full mb-4 border border-cyan-500/30">
                <Database className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-600">软件资源中心</span>
              </div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                下载与上传
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                获取最新版本的物流管理软件，或上传您的软件包
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* 文件上传区域 */}
              <Card className={`backdrop-blur-xl border-0 shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900/60' : 'bg-white'}`}>
                <CardHeader className="pb-4 border-b border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                      <UploadCloud className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>上传软件包</CardTitle>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>支持 .zip, .exe, .apk, .ipa 格式</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* 上传拖拽区域 */}
                  <label className="block">
                    <div className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-500/5 ${isDark ? 'border-slate-700 hover:bg-slate-800/50' : 'border-gray-300'}`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <UploadCloud className="h-8 w-8 text-cyan-500" />
                      </div>
                      <p className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>点击或拖拽文件到此处</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>最大支持 500 MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple
                      accept=".zip,.exe,.apk,.ipa,.dmg,.deb,.rpm"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {/* 上传进度 */}
                  {isUploading && (
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>上传中...</span>
                        <span className="font-bold text-cyan-500">{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* 已上传文件列表 */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>已上传 ({uploadedFiles.length})</h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setUploadedFiles([])}
                          className={isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : ''}
                        >
                          清空
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div 
                            key={index}
                            className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{file.name}</p>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => downloadFile(file)}
                                className={isDark ? 'text-cyan-400 hover:bg-cyan-500/10' : 'text-cyan-600 hover:bg-cyan-50'}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                下载
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeFile(index)}
                                className={isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 软件包下载区域 */}
              <Card className={`backdrop-blur-xl border-0 shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900/60' : 'bg-white'}`}>
                <CardHeader className="pb-4 border-b border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <Download className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>下载软件</CardTitle>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>官方最新版本</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {softwarePackages.map((pkg, index) => (
                    <div 
                      key={index}
                      className={`group p-5 rounded-2xl transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50' : 'bg-gray-50 border border-gray-200 hover:border-cyan-500/50'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="h-6 w-6 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{pkg.name}</h4>
                              <Badge variant="outline" className={isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : ''}>{pkg.type}</Badge>
                            </div>
                            <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{pkg.description}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>版本: {pkg.version}</span>
                              <span className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>大小: {pkg.size}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => downloadSoftwarePackage(pkg)}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/20 whitespace-nowrap"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          下载
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className={`py-12 border-b transition-all duration-700 ${theme.statsBg} ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className={`${isDark ? 'text-slate-400' : 'text-gray-600'} font-medium`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 更新日志 Section - 折叠式 */}
      <section className={`py-8 transition-all duration-700 ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <details className="group">
              <summary className={`flex items-center justify-between p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30' : 'bg-white border border-gray-200 hover:border-cyan-500/30'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      系统更新记录
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      查看最新的功能更新和改进
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 transition-transform duration-300 group-open:rotate-180 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </summary>
              
              <div className="mt-4 space-y-4">
                {/* 刷新按钮 */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchChangelog}
                    disabled={isRefreshing}
                    className={`${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? '刷新中...' : '刷新更新日志'}
                  </Button>
                </div>
                
                {/* 更新日志条目 */}
                {updateLogs.length > 0 ? updateLogs.map((update, index) => (
                  <Card key={index} className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/30' : 'bg-white border-gray-200 hover:border-cyan-500/30'}`}>
                    <div className="flex flex-col md:flex-row">
                      {/* 左侧版本信息 */}
                      <div className={`p-6 md:w-48 flex md:flex-col items-center md:items-start gap-4 md:gap-2 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                          update.type === 'major' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                            : update.type === 'feature'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        }`}>
                          {update.version}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                          {update.date}
                        </div>
                      </div>
                      
                      {/* 右侧更新内容 */}
                      <CardContent className="flex-1 p-6">
                        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {update.title}
                        </h3>
                        <ul className="space-y-2">
                          {update.changes.map((change, i) => (
                            <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                              <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </div>
                  </Card>
                )) : (
                  <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    暂无更新日志
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 transition-all duration-700 ${theme.featuresBg}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-4 py-2 rounded-full mb-4 border border-cyan-500/20">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-medium text-cyan-600">核心服务</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              我们的服务
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              提供全方位的物流解决方案，满足您不同的运输需求
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${isDark ? 'bg-slate-900/50 border-slate-700/50' : ''}`}>
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 bg-gradient-to-br ${theme.gradient} shadow-xl group-hover:shadow-2xl group-hover:scale-110`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} leading-relaxed`}>
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
            <Link href="/login?tab=register">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl rounded-2xl h-12 px-8 font-semibold">
                免费注册
              </Button>
            </Link>
            <Button 
              size="lg" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm rounded-2xl h-12 px-8 font-semibold shadow-lg transition-all duration-300"
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
          <div className={`relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
            {/* 头部 */}
            <div className={`relative px-8 py-10 text-center ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
              <button 
                onClick={() => setShowContactModal(false)}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Phone className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">联系我们</h3>
              <p className="text-white/80 mt-3">7x24小时客服热线</p>
            </div>
            
            {/* 内容 */}
            <div className="p-8 space-y-6">
              {/* 客服电话 */}
              <div className={`p-5 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                    <Phone className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>全国统一客服热线</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>400-888-9999</p>
                  </div>
                </div>
                <a 
                  href="tel:400-888-9999"
                  className={`block w-full py-4 text-center rounded-xl font-bold transition-all duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
                  }`}
                >
                  立即拨打
                </a>
              </div>
              
              {/* 在线留言 */}
              <div className={`p-5 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                    <MessageSquare className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>在线留言</p>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>我们将在24小时内回复</p>
                  </div>
                </div>
                <Link 
                  href="/contact"
                  onClick={() => setShowContactModal(false)}
                  className={`block w-full py-4 text-center rounded-xl font-bold transition-all duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white'
                  }`}
                >
                  去留言
                </Link>
              </div>
              
              {/* 工作时间 */}
              <div className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                <p>工作时间：周一至周日 8:00-22:00</p>
                <p className="mt-2">节假日正常服务</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      
      {/* 自定义动画 */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  )
}
