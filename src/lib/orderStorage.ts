// 订单数据存储服务 - 使用 localStorage 实现前后台数据互通

export interface OrderData {
  id: string
  customer: string
  phone: string
  destination: string
  status: string
  amount: string
  date: string
  // 详细订单信息
  senderName?: string
  senderPhone?: string
  senderAddress?: string
  senderCompany?: string
  receiverName?: string
  receiverPhone?: string
  receiverAddress?: string
  receiverCompany?: string
  cargoType?: string
  cargoName?: string
  weight?: string
  volume?: string
  quantity?: string
  remark?: string
  pickupDate?: string
  insurance?: boolean
  cod?: boolean
  codAmount?: string
}

const STORAGE_KEY = 'smart_logistics_orders'

// 获取所有订单
export function getOrders(): OrderData[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

// 保存订单列表
export function saveOrders(orders: OrderData[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

// 添加单个订单
export function addOrder(order: OrderData): void {
  const orders = getOrders()
  orders.unshift(order) // 新订单添加到开头
  saveOrders(orders)
}

// 更新订单
export function updateOrder(orderId: string, updates: Partial<OrderData>): void {
  const orders = getOrders()
  const index = orders.findIndex(o => o.id === orderId)
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updates }
    saveOrders(orders)
  }
}

// 删除订单
export function deleteOrder(orderId: string): void {
  const orders = getOrders()
  const filtered = orders.filter(o => o.id !== orderId)
  saveOrders(filtered)
}

// 根据ID获取订单
export function getOrderById(orderId: string): OrderData | null {
  const orders = getOrders()
  return orders.find(o => o.id === orderId) || null
}

// 生成订单号
export function generateOrderId(): string {
  const orders = getOrders()
  const maxNum = orders.reduce((max, order) => {
    const match = order.id.match(/ORD-?(\d+)/)
    if (match) {
      const num = parseInt(match[1])
      return num > max ? num : max
    }
    return max
  }, 0)
  return `ORD-${String(maxNum + 1).padStart(3, '0')}`
}

// 初始化示例数据（仅在空数据时）
export function initSampleOrders(): void {
  if (typeof window === 'undefined') return
  const existing = localStorage.getItem(STORAGE_KEY)
  if (!existing) {
    const sampleOrders: OrderData[] = [
      { 
        id: "ORD-001", 
        customer: "张三", 
        phone: "13800138001", 
        destination: "北京市朝阳区", 
        status: "运输中", 
        amount: "¥1,280", 
        date: "2024-01-15",
        senderName: "张三",
        senderPhone: "13800138001",
        senderAddress: "北京市海淀区中关村",
        receiverName: "李四",
        receiverPhone: "13900139001",
        receiverAddress: "北京市朝阳区建国路",
        cargoName: "电子产品",
        weight: "5",
        quantity: "1"
      },
      { 
        id: "ORD-002", 
        customer: "李四", 
        phone: "13800138002", 
        destination: "上海市浦东新区", 
        status: "待发货", 
        amount: "¥2,350", 
        date: "2024-01-15",
        senderName: "李四",
        senderPhone: "13800138002",
        senderAddress: "上海市黄浦区南京路",
        receiverName: "王五",
        receiverPhone: "13700137001",
        receiverAddress: "上海市浦东新区陆家嘴",
        cargoName: "服装鞋帽",
        weight: "10",
        quantity: "3"
      },
      { 
        id: "ORD-003", 
        customer: "王五", 
        phone: "13800138003", 
        destination: "广州市天河区", 
        status: "已送达", 
        amount: "¥890", 
        date: "2024-01-14",
        senderName: "王五",
        senderPhone: "13800138003",
        senderAddress: "广州市越秀区北京路",
        receiverName: "赵六",
        receiverPhone: "13600136001",
        receiverAddress: "广州市天河区珠江新城",
        cargoName: "图书文具",
        weight: "3",
        quantity: "5"
      },
    ]
    saveOrders(sampleOrders)
  }
}
