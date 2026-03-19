"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Truck, Package, MapPin, User, Phone, Mail, Weight, 
  Calendar, CreditCard, CheckCircle, ChevronRight, ChevronLeft,
  Box, Ruler, Clock, Shield, Sparkles, Loader2, FileText,
  Zap, Scan, Brain, Cpu, Wifi, Radio, Satellite
} from "lucide-react"
import { addOrder, generateOrderId, initSampleOrders, OrderData } from "@/lib/orderStorage"

// 步骤配置
const steps = [
  { id: 1, title: "寄件信息", icon: User },
  { id: 2, title: "收件信息", icon: MapPin },
  { id: 3, title: "货物信息", icon: Package },
  { id: 4, title: "智能确认", icon: Brain },
]

// 货物类型选项
const cargoTypes = [
  { value: "general", label: "普通货物", price: 10, icon: Box },
  { value: "fragile", label: "易碎品", price: 15, icon: Shield },
  { value: "refrigerated", label: "冷链货物", price: 25, icon: Package },
  { value: "dangerous", label: "危险品", price: 30, icon: Zap },
  { value: "oversized", label: "大件货物", price: 20, icon: Truck },
]

// 科技感背景组件
const TechBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* 网格背景 */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
    {/* 动态光效 */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    {/* 扫描线 */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-32 w-full animate-[scan_4s_linear_infinite]" />
  </div>
)

// 智能输入框组件
const SmartInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  icon: Icon,
  required = false
}: any) => {
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <div className="relative group">
      <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-cyan-400" />}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl outline-none transition-all duration-300 text-white placeholder:text-slate-500
            ${isFocused 
              ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' 
              : 'border-slate-600 hover:border-slate-500'
            }`}
          placeholder={placeholder}
        />
        {/* 聚焦时的光效 */}
        {isFocused && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl -z-10 animate-pulse" />
        )}
      </div>
    </div>
  )
}

// 智能文本域组件
const SmartTextarea = ({ label, value, onChange, placeholder, required = false }: any) => {
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <div className="relative group">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={3}
          className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl outline-none transition-all duration-300 text-white placeholder:text-slate-500 resize-none
            ${isFocused 
              ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' 
              : 'border-slate-600 hover:border-slate-500'
            }`}
          placeholder={placeholder}
        />
        {isFocused && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl -z-10 animate-pulse" />
        )}
      </div>
    </div>
  )
}

export default function OrderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderNo, setOrderNo] = useState("")
  const [aiAnalyzing, setAiAnalyzing] = useState(false)

  // 表单数据
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    senderCompany: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverCompany: "",
    cargoType: "general",
    cargoName: "",
    weight: "",
    volume: "",
    quantity: "1",
    remark: "",
    pickupDate: "",
    insurance: false,
    cod: false,
    codAmount: "",
  })

  // 计算预估价格
  const calculatePrice = () => {
    const cargoType = cargoTypes.find(c => c.value === formData.cargoType)
    const basePrice = cargoType?.price || 10
    const weight = parseFloat(formData.weight) || 0
    const volume = parseFloat(formData.volume) || 0
    const quantity = parseInt(formData.quantity) || 1
    
    const weightPrice = weight * 2
    const volumePrice = volume * 100
    const insurancePrice = formData.insurance ? 5 : 0
    
    return (basePrice + weightPrice + volumePrice + insurancePrice) * quantity
  }

  // 验证当前步骤
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.senderName && formData.senderPhone && formData.senderAddress
      case 2:
        return formData.receiverName && formData.receiverPhone && formData.receiverAddress
      case 3:
        return formData.cargoName && formData.weight && formData.pickupDate
      default:
        return true
    }
  }

  // 下一步（带AI分析效果）
  const handleNext = async () => {
    if (validateStep() && currentStep < 4) {
      if (currentStep === 3) {
        setAiAnalyzing(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setAiAnalyzing(false)
      }
      setCurrentStep(currentStep + 1)
    }
  }

  // 上一步
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 提交订单
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newOrderNo = generateOrderId()
    setOrderNo(newOrderNo)
    
    const cargoTypeLabel = cargoTypes.find(c => c.value === formData.cargoType)?.label || "普通货物"
    const price = calculatePrice()
    
    const orderData: OrderData = {
      id: newOrderNo,
      customer: formData.senderName,
      phone: formData.senderPhone,
      destination: formData.receiverAddress,
      status: "待发货",
      amount: `¥${price.toFixed(2)}`,
      date: new Date().toISOString().split('T')[0],
      senderName: formData.senderName,
      senderPhone: formData.senderPhone,
      senderAddress: formData.senderAddress,
      senderCompany: formData.senderCompany,
      receiverName: formData.receiverName,
      receiverPhone: formData.receiverPhone,
      receiverAddress: formData.receiverAddress,
      receiverCompany: formData.receiverCompany,
      cargoType: cargoTypeLabel,
      cargoName: formData.cargoName,
      weight: formData.weight,
      volume: formData.volume,
      quantity: formData.quantity,
      remark: formData.remark,
      pickupDate: formData.pickupDate,
      insurance: formData.insurance,
      cod: formData.cod,
      codAmount: formData.codAmount,
    }
    
    addOrder(orderData)
    setOrderSuccess(true)
    setIsSubmitting(false)
  }

  // 初始化示例数据
  useEffect(() => {
    initSampleOrders()
  }, [])

  // 更新表单数据
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 成功页面
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16 relative overflow-hidden">
          <TechBackground />
          <div className="text-center max-w-md mx-auto px-4 relative z-10">
            {/* 成功动画 */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
              <div className="absolute inset-2 bg-green-500/30 rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                下单成功！
              </span>
            </h1>
            <p className="text-slate-400 mb-8">AI智能系统已接收您的订单，正在优化配送路线</p>
            
            <Card className="mb-8 bg-slate-900/80 border-slate-700 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400 mb-2">智能订单编号</div>
                <div className="text-3xl font-bold text-cyan-400 font-mono tracking-wider">{orderNo}</div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-400">
                  <Wifi className="h-4 w-4 animate-pulse" />
                  <span>已同步至智能调度系统</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => router.push("/tracking")}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                追踪物流
              </Button>
              <Button 
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                返回首页
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      
      <main className="flex-1 py-8 relative">
        <TechBackground />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
              <Cpu className="h-5 w-5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-sm font-medium">AI智能下单系统 V2.0</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 text-cyan-400" />
              智能物流下单
            </h1>
            <p className="text-slate-400">AI自动优化路线 · 实时价格计算 · 全程智能追踪</p>
          </div>

          {/* 步骤指示器 - 科技感 */}
          <div className="mb-10">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col items-center transition-all duration-500 ${
                    currentStep >= step.id ? 'text-cyan-400' : 'text-slate-600'
                  }`}>
                    <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-2 transition-all duration-500
                      ${currentStep > step.id 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30' 
                        : currentStep === step.id 
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 animate-pulse' 
                          : 'bg-slate-800 border border-slate-700 text-slate-500'
                      }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="h-7 w-7" />
                      ) : (
                        <step.icon className="h-6 w-6" />
                      )}
                      {/* 当前步骤的光环 */}
                      {currentStep === step.id && (
                        <div className="absolute inset-0 rounded-xl bg-cyan-500/30 blur-xl animate-pulse" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-1 mx-4 rounded-full transition-all duration-500 ${
                      currentStep > step.id 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-slate-800'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI分析中遮罩 */}
          {aiAnalyzing && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin" />
                  <Brain className="absolute inset-0 m-auto h-10 w-10 text-cyan-400" />
                </div>
                <p className="text-cyan-400 text-lg font-medium">AI智能分析中...</p>
                <p className="text-slate-500 text-sm mt-2">正在优化配送路线与价格方案</p>
              </div>
            </div>
          )}

          {/* 表单内容 - 科技感卡片 */}
          <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
            <CardContent className="p-8">
              {/* 步骤1: 寄件信息 */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">寄件人信息</h2>
                      <p className="text-sm text-slate-400">填写寄件人详细信息</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SmartInput
                      label="寄件人姓名"
                      value={formData.senderName}
                      onChange={(e: any) => updateFormData("senderName", e.target.value)}
                      placeholder="请输入寄件人姓名"
                      icon={User}
                      required
                    />
                    <SmartInput
                      label="联系电话"
                      type="tel"
                      value={formData.senderPhone}
                      onChange={(e: any) => updateFormData("senderPhone", e.target.value)}
                      placeholder="请输入联系电话"
                      icon={Phone}
                      required
                    />
                  </div>

                  <SmartTextarea
                    label="详细地址"
                    value={formData.senderAddress}
                    onChange={(e: any) => updateFormData("senderAddress", e.target.value)}
                    placeholder="请输入详细地址（省市区街道门牌号）"
                    required
                  />

                  <SmartInput
                    label="公司名称"
                    value={formData.senderCompany}
                    onChange={(e: any) => updateFormData("senderCompany", e.target.value)}
                    placeholder="请输入公司名称（选填）"
                    icon={Scan}
                  />
                </div>
              )}

              {/* 步骤2: 收件信息 */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">收件人信息</h2>
                      <p className="text-sm text-slate-400">填写收件人详细信息</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SmartInput
                      label="收件人姓名"
                      value={formData.receiverName}
                      onChange={(e: any) => updateFormData("receiverName", e.target.value)}
                      placeholder="请输入收件人姓名"
                      icon={User}
                      required
                    />
                    <SmartInput
                      label="联系电话"
                      type="tel"
                      value={formData.receiverPhone}
                      onChange={(e: any) => updateFormData("receiverPhone", e.target.value)}
                      placeholder="请输入联系电话"
                      icon={Phone}
                      required
                    />
                  </div>

                  <SmartTextarea
                    label="详细地址"
                    value={formData.receiverAddress}
                    onChange={(e: any) => updateFormData("receiverAddress", e.target.value)}
                    placeholder="请输入详细地址（省市区街道门牌号）"
                    required
                  />

                  <SmartInput
                    label="公司名称"
                    value={formData.receiverCompany}
                    onChange={(e: any) => updateFormData("receiverCompany", e.target.value)}
                    placeholder="请输入公司名称（选填）"
                    icon={Scan}
                  />
                </div>
              )}

              {/* 步骤3: 货物信息 */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">货物信息</h2>
                      <p className="text-sm text-slate-400">AI将根据货物类型智能推荐运输方案</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      货物类型 <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {cargoTypes.map((type) => {
                        const TypeIcon = type.icon
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => updateFormData("cargoType", type.value)}
                            className={`p-4 rounded-xl border-2 text-center transition-all duration-300 group
                              ${formData.cargoType === type.value
                                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/20' 
                                : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                              }`}
                          >
                            <TypeIcon className={`h-6 w-6 mx-auto mb-2 transition-colors ${
                              formData.cargoType === type.value ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'
                            }`} />
                            <div className="text-sm font-medium">{type.label}</div>
                            <div className="text-xs text-slate-500">¥{type.price}起</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <SmartInput
                    label="货物名称"
                    value={formData.cargoName}
                    onChange={(e: any) => updateFormData("cargoName", e.target.value)}
                    placeholder="请输入货物名称"
                    icon={Box}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SmartInput
                      label="重量(kg)"
                      type="number"
                      value={formData.weight}
                      onChange={(e: any) => updateFormData("weight", e.target.value)}
                      placeholder="0.00"
                      icon={Weight}
                      required
                    />
                    <SmartInput
                      label="体积(m³)"
                      type="number"
                      value={formData.volume}
                      onChange={(e: any) => updateFormData("volume", e.target.value)}
                      placeholder="0.00"
                      icon={Ruler}
                    />
                    <SmartInput
                      label="件数"
                      type="number"
                      value={formData.quantity}
                      onChange={(e: any) => updateFormData("quantity", e.target.value)}
                      placeholder="1"
                      icon={Package}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1 text-cyan-400" />
                      期望取件时间 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.pickupDate}
                      onChange={(e) => updateFormData("pickupDate", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20 transition-all text-white"
                    />
                  </div>

                  <SmartTextarea
                    label="备注说明"
                    value={formData.remark}
                    onChange={(e: any) => updateFormData("remark", e.target.value)}
                    placeholder="请输入特殊要求或备注信息"
                  />

                  {/* 服务选项 */}
                  <div className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${formData.insurance 
                        ? 'border-green-500/50 bg-green-500/10' 
                        : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                      }`}>
                      <input
                        type="checkbox"
                        checked={formData.insurance}
                        onChange={(e) => updateFormData("insurance", e.target.checked)}
                        className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 bg-slate-700"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-400" />
                          智能保价服务
                        </div>
                        <div className="text-sm text-slate-400">AI评估货物价值，全程智能赔付保障 (+¥5)</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${formData.cod 
                        ? 'border-blue-500/50 bg-blue-500/10' 
                        : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                      }`}>
                      <input
                        type="checkbox"
                        checked={formData.cod}
                        onChange={(e) => updateFormData("cod", e.target.checked)}
                        className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 bg-slate-700"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-400" />
                          智能代收货款
                        </div>
                        <div className="text-sm text-slate-400">AI风控保障，安全快速到账</div>
                      </div>
                    </label>

                    {formData.cod && (
                      <div className="ml-12">
                        <SmartInput
                          label="代收货款金额"
                          type="number"
                          value={formData.codAmount}
                          onChange={(e: any) => updateFormData("codAmount", e.target.value)}
                          placeholder="请输入代收货款金额"
                          icon={CreditCard}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 步骤4: 智能确认 */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">AI智能确认</h2>
                      <p className="text-sm text-slate-400">系统已生成最优配送方案</p>
                    </div>
                  </div>

                  {/* AI分析结果 */}
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Satellite className="h-5 w-5 text-cyan-400 animate-pulse" />
                      <span className="text-cyan-400 font-medium">AI智能分析结果</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-slate-400">预估时效</div>
                        <div className="text-white font-semibold">24-48小时</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400">运输方式</div>
                        <div className="text-white font-semibold">智能陆运</div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400">保险评级</div>
                        <div className="text-green-400 font-semibold">A级保障</div>
                      </div>
                    </div>
                  </div>

                  {/* 信息汇总 */}
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <User className="h-4 w-4 text-cyan-400" />
                        寄件信息
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-slate-400">姓名：</span>
                        <span className="text-white">{formData.senderName}</span>
                        <span className="text-slate-400">电话：</span>
                        <span className="text-white">{formData.senderPhone}</span>
                        <span className="text-slate-400">地址：</span>
                        <span className="text-white">{formData.senderAddress}</span>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        收件信息
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-slate-400">姓名：</span>
                        <span className="text-white">{formData.receiverName}</span>
                        <span className="text-slate-400">电话：</span>
                        <span className="text-white">{formData.receiverPhone}</span>
                        <span className="text-slate-400">地址：</span>
                        <span className="text-white">{formData.receiverAddress}</span>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4 text-green-400" />
                        货物信息
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-slate-400">货物名称：</span>
                        <span className="text-white">{formData.cargoName}</span>
                        <span className="text-slate-400">货物类型：</span>
                        <span className="text-white">{cargoTypes.find(c => c.value === formData.cargoType)?.label}</span>
                        <span className="text-slate-400">重量：</span>
                        <span className="text-white">{formData.weight} kg</span>
                        <span className="text-slate-400">件数：</span>
                        <span className="text-white">{formData.quantity} 件</span>
                      </div>
                    </div>
                  </div>

                  {/* 价格汇总 - 科技感 */}
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-cyan-400" />
                        AI预估运费
                      </span>
                      <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                        ¥{calculatePrice().toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">实际费用以智能称重后为准，多退少补</p>
                  </div>
                </div>
              )}

              {/* 按钮区域 - 科技感 */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一步
                </Button>

                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep()}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50"
                  >
                    下一步
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI处理中...
                      </>
                    ) : (
                      <>
                        <Radio className="h-4 w-4 animate-pulse" />
                        智能下单
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
