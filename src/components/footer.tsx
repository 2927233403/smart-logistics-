"use client"

import Link from "next/link"
import { Truck, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                测试网站-吴
              </span>
              <span className="text-xs font-medium text-gray-400 ml-2 px-2 py-0.5 bg-gray-800 rounded-full border border-gray-700">
                AI智能版
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              专业的智能物流管理平台，致力于为客户提供高效、安全、便捷的物流服务。
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>15024544589</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>service@testwu.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>中国</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-blue-400 transition-colors">
                  物流追踪
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-400 transition-colors">
                  服务介绍
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">服务项目</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  整车运输
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  零担配送
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  仓储服务
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  冷链物流
                </span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">帮助支持</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  常见问题
                </span>
              </li>
              <li>
                <span 
                  className="hover:text-blue-400 transition-colors cursor-pointer"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('openAIChat'))
                  }}
                >
                  在线客服
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  投诉建议
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  隐私政策
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2024-2026 智运物流. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}
