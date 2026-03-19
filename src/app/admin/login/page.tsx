"use client"

import { useState, useEffect } from "react"
import { 
  User, Lock, Eye, EyeOff, Shield, Loader2, CheckCircle, 
  ArrowRight, Terminal, Activity, Database,
  Globe, Zap
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import SmartChineseLogo from "@/components/SmartChineseLogo"

// 模拟用户数据 - 与前台互通
const users = [
  { username: "admin", password: "admin123", name: "超级管理员", role: "admin", avatar: "👨‍💼" },
  { username: "operator", password: "123456", name: "操作员", role: "operator", avatar: "👩‍💻" },
  { username: "viewer", password: "123456", name: "查看员", role: "viewer", avatar: "👁️" },
]

// 系统状态模拟
const systemStats = [
  { label: "系统状态", value: "正常运行", color: "text-green-400", icon: Activity },
  { label: "在线用户", value: "128", color: "text-blue-400", icon: Globe },
  { label: "处理订单", value: "1,234", color: "text-purple-400", icon: Database },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [typingEffect, setTypingEffect] = useState("")
  const [showTerminal, setShowTerminal] = useState(false)

  // 更新时钟
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 打字机效果
  useEffect(() => {
    const text = "Smart Logistics Management System v3.0"
    let index = 0
    const timer = setInterval(() => {
      if (index <= text.length) {
        setTypingEffect(text.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  // 检查是否已登录
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in")
    if (isLoggedIn === "true") {
      router.push("/admin")
    }
  }, [router])

  // 自动填充记住的用户名
  useEffect(() => {
    const savedUsername = localStorage.getItem("admin_remembered_username")
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername, rememberMe: true }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // 模拟登录验证
    setTimeout(() => {
      const user = users.find(
        u => u.username === formData.username && u.password === formData.password
      )

      if (user) {
        // 保存后台登录状态
        localStorage.setItem("admin_logged_in", "true")
        localStorage.setItem("admin_user", JSON.stringify(user))
        
        // 同时设置前台登录状态 - 实现互通
        localStorage.setItem("user_logged_in", "true")
        localStorage.setItem("user_info", JSON.stringify({
          id: "admin_" + Date.now(),
          name: user.name,
          company: "智运物流管理系统",
          phone: "138****8888",
          email: `${user.username}@smartlogistics.com`,
          role: user.role,
          isAdmin: true,
          avatar: user.avatar
        }))
        
        // 记住用户名
        if (formData.rememberMe) {
          localStorage.setItem("admin_remembered_username", formData.username)
        } else {
          localStorage.removeItem("admin_remembered_username")
        }

        setLoginSuccess(true)
        setTimeout(() => {
          router.push("/admin")
        }, 1500)
      } else {
        setError("身份验证失败：用户名或密码错误")
      }
      setIsLoading(false)
    }, 1500)
  }

  // 快速填充演示账号
  const fillDemoAccount = (username: string, password: string) => {
    setFormData({ username, password, rememberMe: false })
    setError("")
  }

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      {/* 左侧科技装饰面板 */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        {/* 动态网格背景 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        {/* 浮动元素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* 内容 */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo区域 */}
          <div className="mb-12">
            <div className="mb-6">
              <SmartChineseLogo variant="admin" className="w-80 h-24" animated={true} />
            </div>
            
            {/* 打字机效果标题 */}
            <div className="h-8 mb-4">
              <p className="text-cyan-400 font-mono text-lg">
                <span className="text-green-400">➜</span> {typingEffect}
                <span className="animate-pulse">_</span>
              </p>
            </div>
            
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              智能化物流管理平台，提供全方位的订单管理、车辆调度、数据分析服务
            </p>
          </div>

          {/* 系统状态卡片 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {systemStats.map((stat, index) => (
              <div 
                key={stat.label}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/50 transition-colors group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className={`h-6 w-6 ${stat.color} mb-2 group-hover:scale-110 transition-transform`} />
                <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* 终端风格信息 */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 font-mono text-sm">
            <div className="flex items-center gap-2 mb-3 text-slate-500 border-b border-slate-700 pb-2">
              <Terminal className="h-4 w-4" />
              <span>system_log.txt</span>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-green-400">[INFO] 系统初始化完成...</p>
              <p className="text-blue-400">[INFO] 数据库连接正常</p>
              <p className="text-purple-400">[INFO] 缓存服务运行中</p>
              <p className="text-cyan-400">[READY] 等待用户认证</p>
            </div>
          </div>

          {/* 时间显示 */}
          <div className="mt-8 flex items-center gap-4 text-slate-500">
            <ClockIcon />
            <span className="font-mono text-lg">
              {currentTime.toLocaleString('zh-CN', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* 装饰线条 */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      {/* 右侧登录表单 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* 移动端Logo */}
          <div className="lg:hidden text-center mb-8">
            <SmartChineseLogo variant="mini" className="w-20 h-20 mx-auto" animated={true} />
          </div>

          {/* 登录卡片 */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            {loginSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">认证成功</h2>
                <p className="text-slate-400">正在进入管理后台...</p>
                <div className="mt-6 flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4">
                    <Shield className="h-7 w-7 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">管理员登录</h2>
                  <p className="text-slate-400 text-sm">请输入您的管理员账号和密码</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      用户名
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-slate-500"
                        placeholder="请输入用户名"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      密码
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-slate-500"
                        placeholder="请输入密码"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                      />
                      <span className="ml-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">记住我</span>
                    </label>
                    <Link href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      忘记密码？
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-500 hover:to-purple-500 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>验证中...</span>
                      </>
                    ) : (
                      <>
                        <span>安全登录</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Accounts */}
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-xs text-slate-500 text-center mb-3">快速登录演示账号</p>
                  <div className="grid grid-cols-3 gap-2">
                    {users.map((user) => (
                      <button
                        key={user.username}
                        type="button"
                        onClick={() => fillDemoAccount(user.username, user.password)}
                        className="flex flex-col items-center gap-1 px-3 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl transition-all group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{user.avatar}</span>
                        <span className="text-xs text-slate-400 group-hover:text-slate-200">{user.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-300 transition-colors flex items-center gap-1">
              <Globe className="h-4 w-4" />
              返回首页
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/login" className="hover:text-slate-300 transition-colors flex items-center gap-1">
              <User className="h-4 w-4" />
              用户登录
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/tracking" className="hover:text-slate-300 transition-colors flex items-center gap-1">
              <Zap className="h-4 w-4" />
              物流查询
            </Link>
          </div>

          <div className="text-center mt-6 text-xs text-slate-600">
            © 2024-2026 智运物流管理系统 · 版本 v3.0.1
          </div>
        </div>
      </div>
    </div>
  )
}

// 时钟图标组件
function ClockIcon() {
  return (
    <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  )
}
