export interface Category {
  id: string
  slug: string
  name: string
  image: string
}

export interface SizeOption {
  value: string
  available: boolean
}

export interface ColorOption {
  value: string
  name: string
  hex: string
  available: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  /** Whole EGP. */
  price: number
  images: string[]
  categoryId: string
  collection?: string
  sizes: SizeOption[]
  colors: ColorOption[]
  isAvailable: boolean
  isFeatured: boolean
  isNew: boolean
  createdAt: string
}

export interface Governorate {
  id: string
  name: string
  /** Whole EGP. */
  fee: number
}

export interface CartItem {
  productId: string
  size: string | null
  color: string | null
  quantity: number
}

export const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export interface OrderItem {
  productId: string
  slug: string
  image: string
  nameSnapshot: string
  priceSnapshot: number
  size: string | null
  color: string | null
  quantity: number
}

export interface Order {
  orderNumber: string
  customer: { name: string; phone: string }
  delivery: {
    governorateId: string
    governorate: string
    city: string
    address: string
    building: string
    notes: string
  }
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: 'cod'
  status: OrderStatus
  statusHistory: { status: OrderStatus; at: string }[]
  createdAt: string
}
