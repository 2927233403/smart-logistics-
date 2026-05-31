"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageSquare } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  name: string
  phone: string
  email: string
  content: string
  status: "unread" | "read" | "replied"
  createTime: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    content: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 创建消息对象
    const newMessage: Message = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      content: formData.content,
      status: "unread",
      createTime: new Date().toISOString()
    }

    // 保存到 localStorage（与后台消息管理共享数据）
    const STORAGE_KEY = 'smart_logistics_messages'
    const existingMessages = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newMessage, ...existingMessages]))

    // 模拟提交延迟
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      setFormData({ name: "", phone: "", email: "", content: "" })
      
      // 3秒后隐藏成功提示
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "客服热线",
      content: "400-888-9999",
      description: "7x24小时服务",
      href: "tel:400-888-9999"
    },
    {
      icon: Mail,
      title: "电子邮箱",
      content: "service@smartlogistics.com",
      description: "工作日24小时内回复",
      href: "mailto:service@smartlogistics.com"
    },
    {
      icon: MapPin,
      title: "公司地址",
      content: "北京市朝阳区科技园区88号",
      description: "智能物流大厦18层",
      href: "#"
    },
    {
      icon: Clock,
      title: "工作时间",
      content: "周一至周日 8:00-22:00",
      description: "节假日正常服务",
      href: "#"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">联系我们</h1>
            <p className="text-lg text-blue-100">
              有任何问题或建议？我们随时为您服务
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <Link key={index} href={item.href}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-blue-600 font-medium mb-1">{item.content}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">在线留言</CardTitle>
                <p className="text-gray-500 mt-2">填写以下表单，我们将尽快与您联系</p>
              </CardHeader>
              
              <CardContent>
                {showSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">提交成功！</h3>
                    <p className="text-gray-500">感谢您的留言，我们会在24小时内回复您</p>
                    <Button 
                      className="mt-6" 
                      onClick={() => setShowSuccess(false)}
                    >
                      继续留言
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          您的姓名 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          required
                          placeholder="请输入姓名"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          联系电话 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          required
                          type="tel"
                          placeholder="请输入手机号"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-12"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        电子邮箱
                      </label>
                      <Input
                        type="email"
                        placeholder="请输入邮箱（选填）"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        留言内容 <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        required
                        placeholder="请输入您的问题或建议..."
                        value={formData.content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, content: e.target.value })}
                        className="min-h-[150px] resize-none"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          提交中...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-5 w-5" />
                          提交留言
                        </span>
                      )}
                    </Button>
                    
                    <p className="text-xs text-gray-400 text-center">
                      提交即表示您同意我们的服务条款和隐私政策
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
