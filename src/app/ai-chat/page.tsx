"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Send, 
  Mic, 
  MicOff, 
  MessageSquare, 
  Bot, 
  User as UserIcon,
  Settings,
  Bell,
  X,
  CheckCircle2,
  Sparkles,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// 用户配置类型
interface UserProfile {
  username: string
  avatar: string
}

// 更新公告类型
interface UpdateAnnouncement {
  id: string
  date: string
  title: string
  content: string
}

// 消息类型
interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isTyping?: boolean
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: "用户",
    avatar: ""
  })
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // 可用的头像选项
  const avatarOptions = [
    "🚀", "🤖", "👨‍💼", "👩‍💼", "🧑‍💻", "🎯", "🌟", "💼"
  ]

  // 更新公告数据
  const updateAnnouncements: UpdateAnnouncement[] = [
    {
      id: "2024-06-01",
      date: "2024年6月1日",
      title: "🎉 智能物流系统 v2.0 正式上线！",
      content: "我们很高兴地宣布，智能物流系统 v2.0 正式发布！\n\n新功能包括：\n• AI智能助手\n• 实时语音输入\n• 可定制个人资料\n• 优化的物流追踪体验\n• 全新的主题系统\n\n感谢您的使用！"
    }
  ]

  // 初始化
  useEffect(() => {
    // 从localStorage读取用户配置
    const savedProfile = localStorage.getItem("user_profile")
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }

    // 检查更新公告
    const lastSeenUpdate = localStorage.getItem("last_seen_update")
    if (!lastSeenUpdate || lastSeenUpdate !== updateAnnouncements[0].id) {
      setShowUpdateDialog(true)
    }

    // 欢迎消息
    const welcomeMessage: Message = {
      id: "welcome",
      type: 'ai',
      content: "您好！我是智能物流助手。有什么可以帮您的吗？\n\n您可以问我：\n• 查询物流信息\n• 了解仓储管理\n• 咨询配送服务\n• 系统使用帮助",
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 初始化语音识别
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'zh-CN'

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setIsRecording(false)
      }

      recognition.onerror = () => {
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current = recognition
    }
  }, [])

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim()) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // 模拟AI回复
    setTimeout(() => {
      const responses = [
        "好的，我来帮您查询相关信息...",
        "这是一个很好的问题！让我为您详细说明。",
        "根据您的需求，我建议您可以这样操作...",
        "感谢您的咨询！以下是相关的信息...",
        "我理解您的需求，请让我为您提供解决方案..."
      ]
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)] + "\n\n如果您还有其他问题，请随时告诉我！",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  // 语音输入功能
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("您的浏览器不支持语音识别功能")
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  // 保存用户配置
  const saveUserProfile = () => {
    localStorage.setItem("user_profile", JSON.stringify(userProfile))
    setShowProfileDialog(false)
  }

  // 标记更新已查看
  const markUpdateAsSeen = () => {
    localStorage.setItem("last_seen_update", updateAnnouncements[0].id)
    setShowUpdateDialog(false)
  }

  // 快速问题
  const quickQuestions = [
    "查询我的物流订单",
    "仓储管理如何操作",
    "配送服务费用",
    "系统使用帮助"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* 侧边栏 */}
        {showSidebar && (
          <div className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 hidden md:block">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  对话历史
                </h3>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800">
                  <CardContent className="p-3">
                    <p className="text-sm text-slate-300 truncate">物流查询对话</p>
                    <p className="text-xs text-slate-500 mt-1">今天 10:30</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800">
                  <CardContent className="p-3">
                    <p className="text-sm text-slate-300 truncate">仓储咨询</p>
                    <p className="text-xs text-slate-500 mt-1">昨天 15:20</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* 主聊天区域 */}
        <div className="flex-1 flex flex-col">
          {/* 聊天头部 */}
          <div className="border-b border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">智能物流助手</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-400">在线</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowProfileDialog(true)}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowUpdateDialog(true)}>
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-2xl ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                  }`}>
                    {message.type === 'user' ? (
                      <span className="text-sm">{userProfile.avatar || '👤'}</span>
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`
                    ${message.type === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700' 
                      : 'bg-slate-800'
                    }
                    rounded-2xl px-4 py-3
                    ${message.type === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}
                  `}>
                    <div className="whitespace-pre-wrap text-sm text-slate-100">
                      {message.content}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 输入中提示 */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-2xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl px-4 py-3 rounded-tl-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 快速问题 */}
          {messages.length <= 1 && (
            <div className="px-4 pb-4">
              <p className="text-sm text-slate-400 mb-3">快速提问：</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button 
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setInputValue(question)
                    }}
                    className="bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 输入区域 */}
          <div className="border-t border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-end gap-3 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="输入您的问题..."
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 pr-12"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoiceInput}
                className={`h-10 w-10 p-0 ${isRecording ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white h-10"
              >
                <Send className="w-4 h-4 mr-2" />
                发送
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 用户设置对话框 */}
      {showProfileDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-900 border-slate-800 max-w-md w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">个人设置</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowProfileDialog(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">用户名</label>
                <Input
                  value={userProfile.username}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm text-slate-400 mb-2 block">选择头像</label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((avatar, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => setUserProfile(prev => ({ ...prev, avatar }))}
                      className={`text-2xl h-12 w-12 p-0 ${userProfile.avatar === avatar ? 'bg-cyan-500/20 ring-2 ring-cyan-500' : 'bg-slate-800 hover:bg-slate-700'}`}
                    >
                      {avatar}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white" onClick={saveUserProfile}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  保存
                </Button>
                <Button variant="ghost" className="flex-1" onClick={() => setShowProfileDialog(false)}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 更新公告对话框 */}
      {showUpdateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-900 border-slate-800 max-w-lg w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <CardTitle className="text-white">{updateAnnouncements[0].title}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowUpdateDialog(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-400">
                {updateAnnouncements[0].date}
              </div>
              <div className="text-slate-300 whitespace-pre-wrap">
                {updateAnnouncements[0].content}
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white" onClick={markUpdateAsSeen}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  我知道了
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
