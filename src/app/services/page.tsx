import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Truck, 
  Package, 
  Warehouse, 
  Snowflake, 
  Globe, 
  Clock,
  Shield,
  Headphones,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Truck,
    title: "整车运输",
    description: "提供全国范围内的整车运输服务，适合大批量货物运输。我们拥有各类车型，满足不同货物的运输需求。",
    features: ["门到门服务", "GPS实时追踪", "专业司机团队", "货物保险保障"],
    price: "¥2.5-5.0/公里",
  },
  {
    icon: Package,
    title: "零担配送",
    description: "灵活的零担配送方案，适合小批量、多批次货物运输。整合优质运力资源，降低您的物流成本。",
    features: ["灵活配载", "多点配送", "时效保障", "价格透明"],
    price: "¥0.8-2.0/公斤",
  },
  {
    icon: Warehouse,
    title: "仓储服务",
    description: "现代化仓储设施，提供货物存储、分拣、包装、配送等一站式服务，助力您的供应链管理。",
    features: ["智能仓储", "库存管理", "订单处理", "全国分仓"],
    price: "¥15-30/立方米/天",
  },
  {
    icon: Snowflake,
    title: "冷链物流",
    description: "专业的冷链运输服务，全程温控监测，确保生鲜、医药等 temperature-sensitive 货物的品质安全。",
    features: ["全程温控", "实时监测", "专业设备", "合规运输"],
    price: "¥3.0-8.0/公里",
  },
  {
    icon: Globe,
    title: "跨境物流",
    description: "提供国际货运代理、报关清关、海外仓储等服务，助力您的业务拓展至全球市场。",
    features: ["国际运输", "报关清关", "海外仓储", "门到门服务"],
    price: "按目的地报价",
  },
  {
    icon: Headphones,
    title: "供应链解决方案",
    description: "为企业客户提供定制化的供应链解决方案，优化物流流程，提升运营效率，降低综合成本。",
    features: ["方案定制", "系统集成", "数据分析", "持续优化"],
    price: "定制化报价",
  },
]

const advantages = [
  {
    icon: Clock,
    title: "时效保障",
    description: "承诺准时送达，超时赔付",
  },
  {
    icon: Shield,
    title: "安全可靠",
    description: "全程货物保险，安全无忧",
  },
  {
    icon: Headphones,
    title: "24小时服务",
    description: "全天候客服支持",
  },
  {
    icon: CheckCircle,
    title: "品质保证",
    description: "ISO认证，标准化服务",
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-800 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              我们的服务
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              提供全方位的物流解决方案，满足您不同的运输需求，助力您的业务发展
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                      <service.icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-lg font-semibold text-blue-600">
                        {service.price}
                      </span>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        了解详情
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                为什么选择我们
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                专业的服务团队，完善的物流网络，为您提供优质的物流体验
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((advantage, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                需要定制化物流方案？
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                我们的专业团队将为您提供个性化的物流解决方案，满足您的特殊需求
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  免费咨询
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  联系我们
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
