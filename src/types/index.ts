export interface Order {
  id: string
  orderNo: string
  customerName: string
  customerPhone: string
  origin: string
  destination: string
  weight: number
  volume: number
  status: OrderStatus
  createdAt: string
  estimatedDelivery: string
  actualDelivery?: string
  driverId?: string
  vehicleId?: string
  trackingEvents: TrackingEvent[]
  cargoType: string
  freight: number
}

export type OrderStatus = 
  | 'pending' 
  | 'assigned' 
  | 'picked_up' 
  | 'in_transit' 
  | 'delivered' 
  | 'cancelled'

export interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  status: string
  description: string
}

export interface Vehicle {
  id: string
  plateNumber: string
  type: string
  capacity: number
  status: VehicleStatus
  driverId?: string
  currentLocation?: string
  lastMaintenance: string
  nextMaintenance: string
  fuelLevel: number
  mileage: number
}

export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'offline'

export interface Driver {
  id: string
  name: string
  phone: string
  licenseNumber: string
  licenseType: string
  status: DriverStatus
  rating: number
  totalDeliveries: number
  currentVehicleId?: string
  joinDate: string
}

export type DriverStatus = 'available' | 'on_duty' | 'off_duty' | 'rest'

export interface Warehouse {
  id: string
  name: string
  address: string
  capacity: number
  usedSpace: number
  managerName: string
  phone: string
  status: 'active' | 'inactive'
}

export interface Route {
  id: string
  origin: string
  destination: string
  distance: number
  estimatedTime: number
  tollFee: number
  fuelConsumption: number
}

export interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  inTransitOrders: number
  deliveredOrders: number
  totalRevenue: number
  activeVehicles: number
  availableDrivers: number
  onTimeDeliveryRate: number
}

export interface MonthlyData {
  month: string
  orders: number
  revenue: number
  deliveries: number
}
