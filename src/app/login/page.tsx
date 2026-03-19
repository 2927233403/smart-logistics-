"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  User, Lock, Eye, EyeOff, Mail, Phone, 
  Shield, Loader2, CheckCircle, ArrowRight, 
  Building2, Sparkles, Zap, Globe, Moon, Sun,
  ScanFace, Fingerprint, QrCode, ChevronRight
} from "lucide-react"
import SmartChineseLogo from "@/components/SmartChineseLogo"

// 主题配置
type Theme = "blue" | "purple" | "dark" | "green"

const themes: Record<Theme, {
  name: string
  gradient: string
  primary: string
  secondary: string
  accent: string
  cardBg: string
  icon: any
}> = {
  blue: {
    name: "科技蓝",
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    primary: "blue",
    secondary: "indigo",
    accent: "cyan",
    cardBg: "bg-white/95",
    icon: Zap
  },
  purple: {
    name: "霓虹紫",
    gradient: "from-purple-600 via-violet-700 to-fuchsia-800",
    primary: "purple",
    secondary: "violet",
    accent: "fuchsia",
    cardBg: "bg-slate-900/95",
    icon: Sparkles
  },
  dark: {
    name: "暗夜黑",
    gradient: "from-slate-800 via-gray-900 to-black",
    primary: "slate",
    secondary: "gray",
    accent: "blue",
    cardBg: "bg-gray-900/95",
    icon: Moon
  },
  green: {
    name: "生态绿",
    gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    primary: "emerald",
    secondary: "teal",
    accent: "cyan",
    cardBg: "bg-white/95",
    icon: Globe
  }
}

// 使用动态导入的searchParams
function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>("blue")
  const [loginMethod, setLoginMethod] = useState<"password" | "sms" | "qrcode">("password")

  // 登录表单
  const [loginForm, setLoginForm] = useState({
    account: "",
    password: "",
    phone: "",
    smsCode: "",
    rememberMe: false,
  })

  // 注册表单
  const [registerForm, setRegisterForm] = useState({
    company: "",
    contact: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const theme = themes[currentTheme]

  // 根据URL参数设置初始标签
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
    }
  }, [searchParams])

  // 检查是否已登录
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("user_logged_in")
    if (isLoggedIn === "true") {
      router.push("/user/profile")
    }
  }, [router])

  // 自动填充记住的账号
  useEffect(() => {
    const savedAccount = localStorage.getItem("user_remembered_account")
    if (savedAccount) {
      setLoginForm(prev => ({ ...prev, account: savedAccount, rememberMe: true }))
    }
  }, [])

  // 登录处理 - 同时兼容前台和后台用户
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    setTimeout(() => {
      const account = loginForm.account
      const password = loginMethod === "password" ? loginForm.password : "123456"

      // 检查是否是后台管理员账号
      const adminUsers = [
        { username: "admin", password: "admin123", name: "管理员", role: "admin" },
        { username: "operator", password: "123456", name: "操作员", role: "operator" },
      ]

      const adminUser = adminUsers.find(
        u => u.username === account && u.password === password
      )

      if (adminUser) {
        // 管理员登录 - 同时设置前台和后台登录状态
        localStorage.setItem("admin_logged_in", "true")
        localStorage.setItem("admin_user", JSON.stringify(adminUser))
        localStorage.setItem("user_logged_in", "true")
        localStorage.setItem("user_info", JSON.stringify({
          id: "admin_" + Date.now(),
          name: adminUser.name,
          company: "智运物流",
          phone: "138****8888",
          email: `${adminUser.username}@smartlogistics.com`,
          role: adminUser.role,
          isAdmin: true
        }))

        setSuccess(true)
        setTimeout(() => {
          router.push("/admin")
        }, 1000)
        setIsLoading(false)
        return
      }

      // 普通用户登录
      if (account && password) {
        // 保存登录状态
        localStorage.setItem("user_logged_in", "true")
        localStorage.setItem("user_info", JSON.stringify({
          id: "user_" + Date.now(),
          name: account,
          company: "示例公司",
          phone: "138****8888",
          email: account.includes("@") ? account : `${account}@example.com`,
          role: "user"
        }))
        
        // 记住账号
        if (loginForm.rememberMe) {
          localStorage.setItem("user_remembered_account", account)
        } else {
          localStorage.removeItem("user_remembered_account")
        }

        setSuccess(true)
        setTimeout(() => {
          router.push("/user/profile")
        }, 1000)
      } else {
        setError("请输入账号和密码")
      }
      setIsLoading(false)
    }, 1500)
  }

  // 注册处理
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 验证
    if (!registerForm.company || !registerForm.contact || !registerForm.phone) {
      setError("请填写完整的企业信息")
      return
    }
    if (!registerForm.password || registerForm.password.length < 6) {
      setError("密码长度至少6位")
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }
    if (!agreeTerms) {
      setError("请阅读并同意用户协议")
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      // 模拟注册成功 - 同时创建前台用户
      localStorage.setItem("user_logged_in", "true")
      localStorage.setItem("user_info", JSON.stringify({
        id: "user_" + Date.now(),
        name: registerForm.contact,
        company: registerForm.company,
        phone: registerForm.phone,
        email: registerForm.email,
        role: "user"
      }))

      setSuccess(true)
      setTimeout(() => {
        router.push("/user/profile")
      }, 1000)
      setIsLoading(false)
    }, 2000)
  }

  // 发送验证码
  const sendSmsCode = () => {
    if (!loginForm.phone) {
      setError("请先输入手机号")
      return
    }
    alert("验证码已发送：123456")
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-4 relative overflow-hidden transition-all duration-700`}>
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        {/* 科技感网格背景 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMjAgMjBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMTUpIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        {/* 浮动粒子效果 */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-bounce"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* 主题切换器 */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        {(Object.keys(themes) as Theme[]).map((t) => {
          const ThemeIcon = themes[t].icon
          return (
            <button
              key={t}
              onClick={() => setCurrentTheme(t)}
              className={`p-2 rounded-xl transition-all duration-300 ${
                currentTheme === t 
                  ? 'bg-white text-gray-900 shadow-lg scale-110' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={themes[t].name}
            >
              <ThemeIcon className="h-5 w-5" />
            </button>
          )
        })}
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 group-hover:bg-white/20 transition-all duration-300">
              <SmartChineseLogo variant="default" className="w-72 h-20" animated={true} />
            </div>
          </Link>
        </div>

        {/* Main Card */}
        <div className={`${theme.cardBg} backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20`}>
          {success ? (
            // 成功提示
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {activeTab === "login" ? "登录成功" : "注册成功"}
              </h2>
              <p className="text-gray-500">正在为您跳转...</p>
              <div className="mt-6 w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-[loading_1s_ease-in-out_infinite]"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Tab切换 */}
              <div className="flex border-b border-gray-200/50">
                <button
                  onClick={() => { setActiveTab("login"); setError("") }}
                  className={`flex-1 py-5 text-center font-semibold transition-all relative ${
                    activeTab === "login" 
                      ? `text-${theme.primary}-600` 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <ScanFace className="h-5 w-5" />
                    账号登录
                  </span>
                  {activeTab === "login" && (
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-${theme.primary}-500 rounded-full`}></div>
                  )}
                </button>
                <button
                  onClick={() => { setActiveTab("register"); setError("") }}
                  className={`flex-1 py-5 text-center font-semibold transition-all relative ${
                    activeTab === "register" 
                      ? `text-${theme.primary}-600` 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Fingerprint className="h-5 w-5" />
                    企业注册
                  </span>
                  {activeTab === "register" && (
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-${theme.primary}-500 rounded-full`}></div>
                  )}
                </button>
              </div>

              <div className="p-8">
                {/* 登录表单 */}
                {activeTab === "login" && (
                  <form onSubmit={handleLogin} className="space-y-5">
                    {/* 登录方式切换 */}
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                      {[
                        { key: "password", label: "密码登录", icon: Lock },
                        { key: "sms", label: "短信登录", icon: Phone },
                        { key: "qrcode", label: "扫码登录", icon: QrCode },
                      ].map((method) => (
                        <button
                          key={method.key}
                          type="button"
                          onClick={() => setLoginMethod(method.key as any)}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                            loginMethod === method.key
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <method.icon className="h-4 w-4" />
                          {method.label}
                        </button>
                      ))}
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center space-x-2 animate-shake">
                        <Shield className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    {loginMethod === "password" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            账号 / 手机号 / 邮箱
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                              type="text"
                              value={loginForm.account}
                              onChange={(e) => setLoginForm({ ...loginForm, account: e.target.value })}
                              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white text-lg"
                              placeholder="请输入账号"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            密码
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              value={loginForm.password}
                              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                              className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white text-lg"
                              placeholder="请输入密码"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {loginMethod === "sms" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            手机号
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                              type="tel"
                              value={loginForm.phone}
                              onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white text-lg"
                              placeholder="请输入手机号"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            验证码
                          </label>
                          <div className="flex gap-3">
                            <div className="relative group flex-1">
                              <input
                                type="text"
                                value={loginForm.smsCode}
                                onChange={(e) => setLoginForm({ ...loginForm, smsCode: e.target.value })}
                                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white text-lg"
                                placeholder="请输入验证码"
                                required
                              />
                            </div>
                            <button
                              type="button"
                              onClick={sendSmsCode}
                              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                            >
                              获取验证码
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {loginMethod === "qrcode" && (
                      <div className="text-center py-8">
                        <div className="w-48 h-48 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                          <QrCode className="h-32 w-32 text-gray-400" />
                        </div>
                        <p className="text-gray-500">请使用微信或APP扫描二维码登录</p>
                      </div>
                    )}

                    {loginMethod !== "qrcode" && (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={loginForm.rememberMe}
                              onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">记住账号</span>
                          </label>
                          <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            忘记密码？
                          </Link>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>登录中...</span>
                            </>
                          ) : (
                            <>
                              <span>立即登录</span>
                              <ArrowRight className="h-5 w-5" />
                            </>
                          )}
                        </button>
                      </>
                    )}

                    {/* 快速登录演示 */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400 text-center mb-3">快速登录演示账号</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: "管理员", user: "admin", pass: "admin123", color: "blue" },
                          { name: "操作员", user: "operator", pass: "123456", color: "purple" },
                          { name: "普通用户", user: "user", pass: "123456", color: "green" },
                        ].map((demo) => (
                          <button
                            key={demo.user}
                            type="button"
                            onClick={() => setLoginForm({ ...loginForm, account: demo.user, password: demo.pass })}
                            className={`px-3 py-2 bg-${demo.color}-50 text-${demo.color}-600 rounded-lg hover:bg-${demo.color}-100 transition-colors text-xs font-medium`}
                          >
                            {demo.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>
                )}

                {/* 注册表单 */}
                {activeTab === "register" && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Building2 className="h-4 w-4 inline mr-1" />
                          企业名称
                        </label>
                        <input
                          type="text"
                          value={registerForm.company}
                          onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                          className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                          placeholder="企业名称"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="h-4 w-4 inline mr-1" />
                          联系人
                        </label>
                        <input
                          type="text"
                          value={registerForm.contact}
                          onChange={(e) => setRegisterForm({ ...registerForm, contact: e.target.value })}
                          className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                          placeholder="联系人姓名"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="h-4 w-4 inline mr-1" />
                          手机号
                        </label>
                        <input
                          type="tel"
                          value={registerForm.phone}
                          onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                          placeholder="手机号"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="h-4 w-4 inline mr-1" />
                          邮箱
                        </label>
                        <input
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                          placeholder="邮箱（选填）"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="h-4 w-4 inline mr-1" />
                        设置密码
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          className="w-full px-4 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                          placeholder="密码（至少6位）"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="h-4 w-4 inline mr-1" />
                        确认密码
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          className="w-full px-4 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                          placeholder="再次输入密码"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        我已阅读并同意
                        <Link href="#" className="text-blue-600 hover:underline">《用户服务协议》</Link>
                        和
                        <Link href="#" className="text-blue-600 hover:underline">《隐私政策》</Link>
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>注册中...</span>
                        </>
                      ) : (
                        <>
                          <span>立即注册</span>
                          <ChevronRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <Globe className="h-4 w-4" />
            返回首页
          </Link>
          <span className="text-white/30">|</span>
          <Link href="/tracking" className="hover:text-white transition-colors">
            物流查询
          </Link>
          <span className="text-white/30">|</span>
          <Link href="/order" className="hover:text-white transition-colors">
            在线下单
          </Link>
          <span className="text-white/30">|</span>
          <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1">
            <Shield className="h-4 w-4" />
            后台管理
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 text-xs text-white/40">
          © 2024-2026 智运物流 · 版权所有 · 科技感智能物流平台
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 100%; margin-left: 0%; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      ` }} />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/70">加载中...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
