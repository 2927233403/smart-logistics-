import { NextRequest, NextResponse } from "next/server"
import { SYSTEM_PROMPT } from "./SYSTEM_PROMPT"

// AI服务配置类型
type AIProvider = "qwen" | "doubao"

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

// 千问API调用
async function callQwenAPI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.QWEN_API_KEY
  if (!apiKey) {
    throw new Error("QWEN_API_KEY is not configured")
  }

  const response = await fetch(
    "https://dashscope.aliyuncshttps://dashscope.console.aliyun.com.com/api/v1/services/aigc/text-generation/generation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-turbo",
        input: {
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
        },
        parameters: {
          result_format: "message",
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error("Qwen API error:", error)
    throw new Error(`Qwen API error: ${response.status}`)
  }

  const data = await response.json()
  return data.output?.choices?.[0]?.message?.content || "抱歉，我暂时无法回答这个问题。"
}

// 豆包API调用
async function callDoubaoAPI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.DOUBAO_API_KEY
  const endpoint = process.env.DOUBAO_ENDPOINT

  if (!apiKey || !endpoint) {
    throw new Error("DOUBAO_API_KEY or DOUBAO_ENDPOINT is not configured")
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "doubao-pro-32k",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("Doubao API error:", error)
    throw new Error(`Doubao API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || "抱歉，我暂时无法回答这个问题。"
}

// 本地模拟回复（当API未配置时使用）
function getLocalResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("查询") || lowerMessage.includes("物流") || lowerMessage.includes("运单")) {
    return `您可以通过以下方式查询物流信息：

1. 网站查询：在首页输入运单号即可查询
2. 客服热线：拨打 400-888-8888
3. 提供您的运单号，我可以帮您查询

请问您需要查询哪个运单号的物流信息？`
  }

  if (lowerMessage.includes("运费") || lowerMessage.includes("价格") || lowerMessage.includes("费用")) {
    return `运费计算方式：

📦 整车运输：根据车型、距离、货物类型综合计算
📦 零担配送：按重量/体积计算

如需准确报价，请联系：
📞 客服热线：400-888-8888
📧 邮箱：service@smartlogistics.com

请告诉我您的货物信息和起止地点，我可以帮您估算运费。`
  }

  if (lowerMessage.includes("范围") || lowerMessage.includes("城市") || lowerMessage.includes("配送")) {
    return `智运物流服务范围：

🌍 覆盖全国 50+ 城市
🏢 合作企业 10000+ 家
✅ 准时率 99.8%

主要服务区域包括华北、华东、华南、华中、西南等地区。

请问您的发货地和收货地是哪里？`
  }

  if (lowerMessage.includes("投诉") || lowerMessage.includes("建议") || lowerMessage.includes("问题")) {
    return `感谢您的反馈！

如需投诉或建议，您可以通过以下方式联系我们：

📞 客服热线：400-888-8888（24小时）
📧 邮箱：service@smartlogistics.com
📍 地址：北京市朝阳区物流大道1号

我们会认真处理您的每一条反馈。`
  }

  if (lowerMessage.includes("服务") || lowerMessage.includes("业务")) {
    return `智运物流主要服务项目：

🚛 整车运输 - 全程GPS追踪，安全高效
📦 零担配送 - 灵活方案，小批量运输
🏭 仓储服务 - 存储、分拣、包装一站式
❄️ 冷链物流 - 专业温控运输
⏰ 时效保障 - 准时送达，超时赔付
🛡️ 货物保险 - 全程保障

请问您需要哪种服务？`
  }

  if (lowerMessage.includes("联系") || lowerMessage.includes("电话") || lowerMessage.includes("客服")) {
    return `联系方式：

📞 客服热线：400-888-8888（24小时服务）
📧 邮箱：service@smartlogistics.com
📍 地址：北京市朝阳区物流大道1号

如需紧急帮助，建议直接拨打客服热线。`
  }

  return `您好！我是智运物流智能客服。

我可以帮您解答以下问题：
• 物流查询
• 运费估算
• 服务范围
• 投诉建议

请问有什么可以帮助您的？`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history = [] } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // 构建消息历史
    const messages: ChatMessage[] = history.map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }))
    messages.push({ role: "user", content: message })

    // 选择AI提供商
    const provider = (process.env.AI_PROVIDER || "qwen") as AIProvider

    let response: string

    try {
      if (provider === "doubao") {
        response = await callDoubaoAPI(messages)
      } else {
        response = await callQwenAPI(messages)
      }
    } catch (apiError) {
      console.log("API not available, using local response:", apiError)
      // 如果API不可用，使用本地模拟回复
      response = getLocalResponse(message)
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
