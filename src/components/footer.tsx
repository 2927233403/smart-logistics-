"use client"

import Link from "next/link"
import { Truck, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Github, ChevronRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-300 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  智运物流
                </span>
                <span className="inline-block text-xs font-medium text-cyan-400 ml-2 px-2 py-0.5 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                  AI智能版
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
              专业的智能物流管理平台，致力于为客户提供高效、安全、便捷的物流服务，让物流更智能。
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm group">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Phone className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">客服热线</p>
                  <p className="text-white font-medium">400-888-9999</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm group">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Mail className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">邮箱</p>
                  <p className="text-white font-medium">service@zhiyun.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm group">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">地址</p>
                  <p className="text-white font-medium">中国上海市浦东新区</p>
                </div>
              </div>
            </div>
            {/* 社交媒体 */}
            <div className="flex items-center space-x-3 mt-6">
              {[Facebook, Twitter, Linkedin, Github].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-slate-800 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                >
                  <Icon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-cyan-500" />
              快速链接
            </h3>
            <ul className="space-y-3">
              {[
                { name: "首页", href: "/" },
                { name: "物流追踪", href: "/tracking" },
                { name: "服务介绍", href: "/services" },
                { name: "仓储管理", href: "/warehouse" },
                { name: "AI助手", href: "/ai-chat" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-slate-600 group-hover:bg-cyan-500 rounded-full transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-cyan-500" />
              服务项目
            </h3>
            <ul className="space-y-3">
              {["整车运输", "零担配送", "仓储服务", "冷链物流", "国际物流"].map((service) => (
                <li key={service}>
                  <span className="text-sm text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-slate-600 group-hover:bg-cyan-500 rounded-full transition-colors"></span>
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-cyan-500" />
              帮助支持
            </h3>
            <ul className="space-y-3">
              {[
                { name: "常见问题", action: null },
                { name: "在线客服", action: "chat" },
                { name: "投诉建议", action: null },
                { name: "隐私政策", action: null },
                { name: "服务条款", action: null },
              ].map((item) => (
                <li key={item.name}>
                  <span
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-2 group"
                    onClick={() => {
                      if (item.action === "chat") {
                        window.dispatchEvent(new CustomEvent('openAIChat'))
                      }
                    }}
                  >
                    <span className="w-1 h-1 bg-slate-600 group-hover:bg-cyan-500 rounded-full transition-colors"></span>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span>&copy; 2024-2026 智运物流. 保留所有权利.</span>
              <span>沪ICP备XXXXXXXX号</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">系统运行正常</span>
              </div>
              <span className="text-xs text-gray-500">版本 v2.0.1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
