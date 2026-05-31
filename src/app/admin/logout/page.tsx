"use client"

import { useEffect, useState } from "react"
import { Truck, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminLogoutPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(true)

  useEffect(() => {
    // 清除登录状态
    const logout = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      localStorage.removeItem("admin_logged_in")
      localStorage.removeItem("admin_user")
      
      setIsLoggingOut(false)
    }

    logout()
  }, [])

  const handleRedirect = () => {
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-white block">智能物流</span>
              <span className="text-sm text-blue-200">Smart Logistics System</span>
            </div>
          </Link>
        </div>

        {/* Logout Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center">
          {isLoggingOut ? (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">正在退出</h2>
              <p className="text-gray-500">正在安全退出系统，请稍候...</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">已安全退出</h2>
              <p className="text-gray-500 mb-6">您已成功退出登录，感谢使用智能物流管理系统</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleRedirect}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
                >
                  重新登录
                </button>
                <Link
                  href="/"
                  className="block w-full py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  返回首页
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-xs text-blue-300/60">
          © 2024 智能物流管理系统 · 版权所有
        </div>
      </div>
    </div>
  )
}
