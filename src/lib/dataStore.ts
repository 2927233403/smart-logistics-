// 数据存储接口
export interface Order {
  id: string
  customer: string
  phone: string
  destination: string
  status: string
  amount: string
  date: string
  items?: string
  weight?: string
  notes?: string
}

export interface Vehicle {
  id: string
  plate: string
  driver: string
  phone: string
  status: string
  capacity: string
  location: string
  type?: string
  brand?: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  license: string
  status: string
  vehicle?: string
  joinDate: string
  experience?: string
}

export interface Warehouse {
  id: string
  name: string
  location: string
  capacity: string
  status: string
  manager: string
  phone: string
  type: string
  area: string
}

export interface User {
  id: string
  name: string
  role: string
  email: string
  phone: string
  status: string
  lastLogin: string
  department?: string
}

export interface Message {
  id: string
  title: string
  content: string
  type: string
  time: string
  read: boolean
  reply?: string
  replyTime?: string
}

export interface Log {
  id: string
  action: string
  user: string
  time: string
  type: string
  details?: string
}

// 内存数据存储
let orders: Order[] = [
  { id: "ORD-001", customer: "张三", phone: "13800138001", destination: "北京市朝阳区", status: "运输中", amount: "¥2,580", date: "2024-01-15", items: "电子产品", weight: "50kg", notes: "需小心轻放" },
  { id: "ORD-002", customer: "李四", phone: "13800138002", destination: "上海市浦东新区", status: "待发货", amount: "¥1,890", date: "2024-01-15", items: "服装", weight: "30kg" },
  { id: "ORD-003", customer: "王五", phone: "13800138003", destination: "广州市天河区", status: "已送达", amount: "¥3,200", date: "2024-01-14", items: "家具", weight: "200kg" },
  { id: "ORD-004", customer: "赵六", phone: "13800138004", destination: "深圳市南山区", status: "运输中", amount: "¥980", date: "2024-01-15", items: "日用品", weight: "25kg" },
  { id: "ORD-005", customer: "钱七", phone: "13800138005", destination: "杭州市西湖区", status: "已取消", amount: "¥1,500", date: "2024-01-13", items: "食品", weight: "40kg" },
]

let vehicles: Vehicle[] = [
  { id: "V-001", plate: "粤A12345", driver: "张师傅", phone: "13800138001", status: "运输中", capacity: "5吨", location: "广州市天河区", type: "货车", brand: "东风" },
  { id: "V-002", plate: "粤B67890", driver: "李师傅", phone: "13800138002", status: "空闲", capacity: "3吨", location: "深圳市南山区", type: "货车", brand: "解放" },
  { id: "V-003", plate: "京C11111", driver: "王师傅", phone: "13800138003", status: "维修中", capacity: "8吨", location: "北京市朝阳区", type: "货车", brand: "重汽" },
  { id: "V-004", plate: "沪D22222", driver: "赵师傅", phone: "13800138004", status: "运输中", capacity: "5吨", location: "上海市浦东新区", type: "货车", brand: "东风" },
  { id: "V-005", plate: "浙E33333", driver: "钱师傅", phone: "13800138005", status: "空闲", capacity: "10吨", location: "杭州市西湖区", type: "货车", brand: "重汽" },
]

let drivers: Driver[] = [
  { id: "D-001", name: "张师傅", phone: "13800138001", license: "A2", status: "在线", vehicle: "V-001", joinDate: "2020-05-01", experience: "5年" },
  { id: "D-002", name: "李师傅", phone: "13800138002", license: "B2", status: "空闲", vehicle: "V-002", joinDate: "2021-03-15", experience: "3年" },
  { id: "D-003", name: "王师傅", phone: "13800138003", license: "A2", status: "离线", vehicle: "", joinDate: "2019-08-20", experience: "6年" },
  { id: "D-004", name: "赵师傅", phone: "13800138004", license: "B2", status: "在线", vehicle: "V-004", joinDate: "2022-01-10", experience: "2年" },
  { id: "D-005", name: "钱师傅", phone: "13800138005", license: "A2", status: "空闲", vehicle: "V-005", joinDate: "2020-11-05", experience: "4年" },
]

let warehouses: Warehouse[] = [
  { id: "W-001", name: "北京仓", location: "北京市大兴区", capacity: "10000", status: "正常", manager: "陈经理", phone: "13900139001", type: "中心仓", area: "5000㎡" },
  { id: "W-002", name: "上海仓", location: "上海市嘉定区", capacity: "8000", status: "正常", manager: "林经理", phone: "13900139002", type: "中心仓", area: "4000㎡" },
  { id: "W-003", name: "广州仓", location: "广州市白云区", capacity: "6000", status: "正常", manager: "周经理", phone: "13900139003", type: "区域仓", area: "3000㎡" },
  { id: "W-004", name: "深圳仓", location: "深圳市宝安区", capacity: "5000", status: "满仓", manager: "吴经理", phone: "13900139004", type: "区域仓", area: "2500㎡" },
  { id: "W-005", name: "成都仓", location: "成都市双流区", capacity: "7000", status: "正常", manager: "郑经理", phone: "13900139005", type: "区域仓", area: "3500㎡" },
]

let users: User[] = [
  { id: "U-001", name: "管理员", role: "admin", email: "admin@test.com", phone: "13800000001", status: "active", lastLogin: "2024-01-15 10:30", department: "管理部" },
  { id: "U-002", name: "操作员1", role: "operator", email: "op1@test.com", phone: "13800000002", status: "active", lastLogin: "2024-01-15 09:20", department: "运营部" },
  { id: "U-003", name: "财务小李", role: "finance", email: "finance@test.com", phone: "13800000003", status: "active", lastLogin: "2024-01-14 16:45", department: "财务部" },
  { id: "U-004", name: "仓管王五", role: "warehouse", email: "warehouse@test.com", phone: "13800000004", status: "active", lastLogin: "2024-01-15 08:00", department: "仓储部" },
  { id: "U-005", name: "客服小赵", role: "service", email: "service@test.com", phone: "13800000005", status: "inactive", lastLogin: "2024-01-10 17:30", department: "客服部" },
]

let messages: Message[] = [
  { id: "M-001", title: "新订单通知", content: "收到新订单 ORD-006，客户：张先生", type: "order", time: "10分钟前", read: false },
  { id: "M-002", title: "车辆到达提醒", content: "车辆粤A12345已到达目的地", type: "vehicle", time: "30分钟前", read: false },
  { id: "M-003", title: "库存预警", content: "仓库北京仓 SKU-001 库存不足", type: "warehouse", time: "1小时前", read: true },
  { id: "M-004", title: "系统更新", content: "系统将于今晚22:00进行维护更新", type: "system", time: "2小时前", read: true },
  { id: "M-005", title: "财务对账", content: "本月账单已生成，请及时核对", type: "finance", time: "3小时前", read: true },
]

let logs: Log[] = [
  { id: "L-001", action: "创建订单", user: "管理员", time: "10分钟前", type: "order", details: "创建订单 ORD-006" },
  { id: "L-002", action: "更新车辆状态", user: "操作员1", time: "30分钟前", type: "vehicle", details: "更新车辆 V-001 状态为运输中" },
  { id: "L-003", action: "登录系统", user: "管理员", time: "1小时前", type: "system", details: "从 192.168.1.100 登录" },
  { id: "L-004", action: "添加司机", user: "管理员", time: "2小时前", type: "driver", details: "添加司机 赵师傅" },
  { id: "L-005", action: "修改仓库信息", user: "仓管王五", time: "3小时前", type: "warehouse", details: "修改仓库深圳仓容量" },
]

// Orders API
export function getOrders() {
  return orders
}

export function addOrder(order: Order) {
  orders.push(order)
  addLog('创建订单', '管理员', 'order', `创建订单 ${order.id}`)
  return order
}

export function updateOrder(id: string, updates: Partial<Order>) {
  const index = orders.findIndex(o => o.id === id)
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updates }
    addLog('更新订单', '管理员', 'order', `更新订单 ${id}`)
    return orders[index]
  }
  return null
}

export function deleteOrderApi(id: string) {
  const index = orders.findIndex(o => o.id === id)
  if (index !== -1) {
    orders.splice(index, 1)
    addLog('删除订单', '管理员', 'order', `删除订单 ${id}`)
    return true
  }
  return false
}

// Vehicles API
export function getVehicles() {
  return vehicles
}

export function addVehicle(vehicle: Vehicle) {
  vehicles.push(vehicle)
  addLog('添加车辆', '管理员', 'vehicle', `添加车辆 ${vehicle.plate}`)
  return vehicle
}

export function updateVehicle(id: string, updates: Partial<Vehicle>) {
  const index = vehicles.findIndex(v => v.id === id)
  if (index !== -1) {
    vehicles[index] = { ...vehicles[index], ...updates }
    addLog('更新车辆', '管理员', 'vehicle', `更新车辆 ${id}`)
    return vehicles[index]
  }
  return null
}

export function deleteVehicle(id: string) {
  const index = vehicles.findIndex(v => v.id === id)
  if (index !== -1) {
    vehicles.splice(index, 1)
    addLog('删除车辆', '管理员', 'vehicle', `删除车辆 ${id}`)
    return true
  }
  return false
}

// Drivers API
export function getDrivers() {
  return drivers
}

export function addDriver(driver: Driver) {
  drivers.push(driver)
  addLog('添加司机', '管理员', 'driver', `添加司机 ${driver.name}`)
  return driver
}

export function updateDriver(id: string, updates: Partial<Driver>) {
  const index = drivers.findIndex(d => d.id === id)
  if (index !== -1) {
    drivers[index] = { ...drivers[index], ...updates }
    addLog('更新司机', '管理员', 'driver', `更新司机 ${id}`)
    return drivers[index]
  }
  return null
}

export function deleteDriver(id: string) {
  const index = drivers.findIndex(d => d.id === id)
  if (index !== -1) {
    drivers.splice(index, 1)
    addLog('删除司机', '管理员', 'driver', `删除司机 ${id}`)
    return true
  }
  return false
}

// Warehouses API
export function getWarehouses() {
  return warehouses
}

export function addWarehouse(warehouse: Warehouse) {
  warehouses.push(warehouse)
  addLog('添加仓库', '管理员', 'warehouse', `添加仓库 ${warehouse.name}`)
  return warehouse
}

export function updateWarehouse(id: string, updates: Partial<Warehouse>) {
  const index = warehouses.findIndex(w => w.id === id)
  if (index !== -1) {
    warehouses[index] = { ...warehouses[index], ...updates }
    addLog('更新仓库', '管理员', 'warehouse', `更新仓库 ${id}`)
    return warehouses[index]
  }
  return null
}

export function deleteWarehouse(id: string) {
  const index = warehouses.findIndex(w => w.id === id)
  if (index !== -1) {
    warehouses.splice(index, 1)
    addLog('删除仓库', '管理员', 'warehouse', `删除仓库 ${id}`)
    return true
  }
  return false
}

// Users API
export function getUsers() {
  return users
}

export function addUser(user: User) {
  users.push(user)
  addLog('添加用户', '管理员', 'user', `添加用户 ${user.name}`)
  return user
}

export function updateUser(id: string, updates: Partial<User>) {
  const index = users.findIndex(u => u.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], ...updates }
    addLog('更新用户', '管理员', 'user', `更新用户 ${id}`)
    return users[index]
  }
  return null
}

export function deleteUser(id: string) {
  const index = users.findIndex(u => u.id === id)
  if (index !== -1) {
    users.splice(index, 1)
    addLog('删除用户', '管理员', 'user', `删除用户 ${id}`)
    return true
  }
  return false
}

// Messages API
export function getMessages() {
  return messages
}

export function addMessage(message: Message) {
  messages.unshift(message)
  return message
}

export function markMessageRead(id: string) {
  const index = messages.findIndex(m => m.id === id)
  if (index !== -1) {
    messages[index].read = true
    return messages[index]
  }
  return null
}

export function markAllMessagesRead() {
  messages.forEach(m => m.read = true)
  return messages
}

export function deleteMessage(id: string) {
  const index = messages.findIndex(m => m.id === id)
  if (index !== -1) {
    messages.splice(index, 1)
    return true
  }
  return false
}

// Logs API
export function getLogs() {
  return logs
}

export function addLog(action: string, user: string, type: string, details?: string) {
  const log: Log = {
    id: `L-${Date.now()}`,
    action,
    user,
    time: new Date().toLocaleString('zh-CN'),
    type,
    details
  }
  logs.unshift(log)
  return log
}

// Statistics API
export function getStatistics() {
  return {
    orders: {
      total: orders.length,
      pending: orders.filter(o => o.status === "待发货").length,
      shipping: orders.filter(o => o.status === "运输中").length,
      delivered: orders.filter(o => o.status === "已送达").length,
      cancelled: orders.filter(o => o.status === "已取消").length
    },
    vehicles: {
      total: vehicles.length,
      shipping: vehicles.filter(v => v.status === "运输中").length,
      idle: vehicles.filter(v => v.status === "空闲").length,
      maintenance: vehicles.filter(v => v.status === "维修中").length
    },
    drivers: {
      total: drivers.length,
      online: drivers.filter(d => d.status === "在线").length,
      offline: drivers.filter(d => d.status === "离线").length,
      idle: drivers.filter(d => d.status === "空闲").length
    },
    warehouses: {
      total: warehouses.length,
      normal: warehouses.filter(w => w.status === "正常").length,
      full: warehouses.filter(w => w.status === "满仓").length,
      maintenance: warehouses.filter(w => w.status === "维护中").length
    },
    users: {
      total: users.length,
      active: users.filter(u => u.status === "active").length,
      inactive: users.filter(u => u.status === "inactive").length
    },
    messages: {
      total: messages.length,
      unread: messages.filter(m => !m.read).length
    }
  }
}
