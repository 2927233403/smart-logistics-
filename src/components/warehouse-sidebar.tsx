"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import {
  Package,
  Truck,
  Search,
  BarChart2,
  Upload,
  Boxes,
  Scan,
  Layers,
  Activity,
  Settings,
  Users,
  Shield
} from "lucide-react"

const menuItems = [
  {
    id: "dashboard",
    label: "仓库概览",
    icon: BarChart2,
    href: "/warehouse"
  },
  {
    id: "inbound",
    label: "入库管理",
    icon: Package,
    href: "/warehouse/inbound"
  },
  {
    id: "outbound",
    label: "出库管理",
    icon: Truck,
    href: "/warehouse/outbound"
  },
  {
    id: "scan",
    label: "过机端口",
    icon: Scan,
    href: "/warehouse/scan"
  },
  {
    id: "shelf",
    label: "上架管理",
    icon: Layers,
    href: "/warehouse/shelf"
  },
  {
    id: "search",
    label: "库存查询",
    icon: Search,
    href: "/warehouse/search"
  },
  {
    id: "upload",
    label: "照片上传",
    icon: Upload,
    href: "/warehouse/upload"
  },
  {
    id: "logs",
    label: "操作日志",
    icon: Activity,
    href: "/warehouse/logs"
  },
  {
    id: "users",
    label: "用户管理",
    icon: Users,
    href: "/warehouse/users"
  },
  {
    id: "settings",
    label: "系统设置",
    icon: Settings,
    href: "/warehouse/settings"
  },
  {
    id: "roles",
    label: "角色管理",
    icon: Shield,
    href: "/warehouse/roles"
  }
]

interface WarehouseSidebarProps {
  title?: string
  icon?: React.ElementType
}

export function WarehouseSidebar({ title = "仓储管理", icon: IconComponent = Boxes }: WarehouseSidebarProps) {
  const pathname = usePathname()

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <IconComponent className="mr-2 h-6 w-6 text-blue-600" />
            {title}
          </h2>
        </div>
        <div className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.id} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}