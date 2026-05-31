"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  isTyping?: boolean
}

interface AIChatProps {
  defaultOpen?: boolean
}

// 模拟智能回复
const getSmartReply = (userMessage: string): string => {
  const msg = userMessage.toLowerCase()
  
  if (msg.includes('物流') || msg.includes('追踪') || msg.includes('查询')) {
    return '好的！查询物流请按以下步骤：\n\n1. 进入"物流追踪"页面\n2. 输入运单号（如：SL123456789CN）\n3. 点击查询即可查看实时物流信息\n\n需要我帮您跳转到追踪页面吗？'
  }
  
  if (msg.includes('运费') || msg.includes('价格') || msg.includes('费用')) {
    return '运费计算基于以下因素：\n\n• 重量和体积\n• 目的地（国内/国际）\n• 时效要求（标准/特快）\n\n您可以在"运费估算"页面输入详细信息获取精准报价，或告诉我您的需求，我为您预估！'
  }
  
  if (msg.includes('服务') || msg.includes('范围')) {
    return '我们提供以下服务：\n\n📦 标准快递（3-5天）\n🚀 特快专递（1-2天）\n🌍 国际物流\n🏭 仓储服务\n🔒 保价服务\n\n想了解哪项服务的详细信息？'
  }
  
  if (msg.includes('你好') || msg.includes('您好') || msg.includes('hi') || msg.includes('hello')) {
    return '您好！😊 很高兴为您服务！我可以帮您查询物流、估算运费、了解服务范围等。请问有什么可以帮您的？'
  }
  
  if (msg.includes('谢谢') || msg.includes('感谢')) {
    return '不客气！😊 能帮到您很开心。如果还有其他问题，随时找我哦！'
  }
  
  return '感谢您的咨询！我是智能客服助手，可以帮您：\n\n• 查询物流信息\n• 估算运费价格\n• 了解服务范围\n• 解答常见问题\n\n请告诉我您需要什么帮助？'
}

export function AIChat({ defaultOpen = false }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "您好！我是智运物流智能客服，很高兴为您服务。请问有什么可以帮助您的？\n\n您可以咨询以下问题：\n• 物流追踪\n• 运费估算\n• 服务范围\n• 投诉建议",
      timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // 监听打开客服的事件
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true)
    window.addEventListener('openAIChat', handleOpenChat)
    return () => window.removeEventListener('openAIChat', handleOpenChat)
  }, [])

  // 自动调整文本框高度
  const autoResize = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 显示打字动画
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    try {
      // 模拟API延迟，让体验更真实
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

      // 获取智能回复
      const reply = getSmartReply(userMessage.content)

      // 移除打字消息，添加真实回复
      setMessages((prev) => {
        const filtered = prev.filter(m => !m.isTyping)
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: reply,
          timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
        }]
      })
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，网络连接出现问题，请稍后再试。如需紧急帮助，请拨打客服热线：400-888-8888",
        timestamp: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => {
        const filtered = prev.filter(m => !m.isTyping)
        return [...filtered, errorMessage]
      })
    } finally {
      setIsLoading(false)
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickQuestions = [
    "如何查询物流？",
    "运费怎么计算？",
    "配送范围有哪些？",
  ]

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg transition-all duration-300 group",
            isOpen
              ? "bg-slate-600 hover:bg-slate-700"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 animate-pulse shadow-xl shadow-blue-500/30"
          )}
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          )}
        </Button>
        {!isOpen && (
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping" />
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-500/20 flex flex-col overflow-hidden border border-slate-700/50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-blue-600"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">智能客服</h3>
                  <p className="text-xs text-blue-100">在线 · 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 min-h-64 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-2",
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg",
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                      : "bg-gradient-to-br from-purple-500 to-blue-500"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 max-w-[80%] text-sm shadow-sm",
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none"
                      : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50"
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.role === "user" ? "text-blue-200" : "text-slate-400"
                    )}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-slate-700/50">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-800/30">
              <p className="text-xs text-slate-400 mb-2">快捷问题：</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full transition-all hover:scale-105 border border-slate-600/50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
            <div className="flex space-x-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  autoResize()
                }}
                onKeyDown={handleKeyDown}
                placeholder="输入您的问题... (Enter发送)"
                className="flex-1 bg-slate-700/50 text-slate-100 placeholder-slate-400 border border-slate-600/50 rounded-xl px-4 py-2 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                disabled={isLoading}
                rows={1}
                style={{ maxHeight: '120px' }}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Shift + Enter 换行
            </p>
          </div>
        </div>
      )}
    </>
  )
}
