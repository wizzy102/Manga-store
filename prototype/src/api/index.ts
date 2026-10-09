/**
 * Data access for the prototype. Every function is async and works on mock data + localStorage,
 * so the pages can later switch to a real REST backend without changing.
 * Prices, delivery fees and totals are always recalculated here and never taken from the caller.
 */
import type { CartItem, Category, Governorate, Order, OrderItem, OrderStatus, Product } from '../types'
import { products } from '../data/products'
import { categories } from '../data/categories'
import { governorates } from '../data/governorates'
import { loadOrders, nextOrderNumber, saveOrders } from '../store/orders'
import { canMoveTo } from '../lib/orderStatus'
import { isEgyptianMobile } from '../lib/format'

const MAX_QTY_PER_LINE = 10

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

// --- Catalogue --------------------------------------------------------------

export async function getProducts(filter: { category?: string; newOnly?: boolean } = {}): Promise<Product[]> {
  await delay()
  const cat = filter.category ? categories.find((c) => c.slug === filter.category) : undefined
  return products
    .filter((p) => (cat ? p.categoryId === cat.id : true))
    .filter((p) => (filter.newOnly ? p.isNew : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await delay()
  return products.filter((p) => p.isFeatured)
}

export async function getProduct(slug: string): Promise<Product | null> {
  await delay()
  return products.find((p) => p.slug === slug) ?? null
}

export async function getCategories(): Promise<Category[]> {
  await delay()
  return categories
}

export async function getGovernorates(): Promise<Governorate[]> {
  await delay(0)
  return governorates
}

// --- Cart quote -------------------------------------------------------------

export interface QuoteLine {
  item: CartItem
  product: Product | null
  unitPrice: number
  lineTotal: number
  /** Why this line can't be ordered, if it can't. */
  problem: string | null
}

export interface Quote {
  lines: QuoteLine[]
  subtotal: number
  deliveryFee: number | null
  total: number
  hasProblems: boolean
}

function checkLine(item: CartItem): QuoteLine {
  const product = products.find((p) => p.id === item.productId) ?? null
  const base = { item, product, unitPrice: product?.price ?? 0 }
  const fail = (problem: string): QuoteLine => ({ ...base, lineTotal: 0, problem })

  if (!product) return fail('This item is no longer available.')
  if (!product.isAvailable) return fail('Sold out.')
  if (product.sizes.length) {
    const size = product.sizes.find((s) => s.value === item.size)
    if (!size) return fail('Please choose a size.')
    if (!size.available) return fail(`Size ${item.size} is sold out.`)
  }
  if (product.colors.length) {
    const color = product.colors.find((c) => c.value === item.color)
    if (!color) return fail('Please choose a color.')
    if (!color.available) return fail('This color is sold out.')
  }
  if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QTY_PER_LINE) {
    return fail(`Quantity must be 1 to ${MAX_QTY_PER_LINE}.`)
  }
  return { ...base, lineTotal: product.price * item.quantity, problem: null }
}

export async function quoteCart(items: CartItem[], governorateId?: string): Promise<Quote> {
  await delay(0)
  const lines = items.map(checkLine)
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)
  const gov = governorateId ? governorates.find((g) => g.id === governorateId) : undefined
  const deliveryFee = gov ? gov.fee : null
  return {
    lines,
    subtotal,
    deliveryFee,
    total: subtotal + (deliveryFee ?? 0),
    hasProblems: lines.some((l) => l.problem),
  }
}

// --- Checkout ---------------------------------------------------------------

export interface CheckoutInput {
  name: string
  phone: string
  governorateId: string
  city: string
  address: string
  building: string
  notes: string
  items: CartItem[]
}

export type CheckoutErrors = Partial<Record<keyof CheckoutInput | 'form', string>>

export type PlaceOrderResult = { ok: true; order: Order } | { ok: false; errors: CheckoutErrors }

export async function placeOrder(input: CheckoutInput): Promise<PlaceOrderResult> {
  await delay(400)
  const errors: CheckoutErrors = {}
  const name = input.name.trim()
  const phone = input.phone.replace(/[\s-]/g, '')
  const city = input.city.trim()
  const address = input.address.trim()

  if (name.length < 2) errors.name = 'Please write your full name.'
  if (!isEgyptianMobile(phone)) errors.phone = 'Write a mobile number like 01012345678.'
  const gov = governorates.find((g) => g.id === input.governorateId)
  if (!gov) errors.governorateId = 'Choose your governorate.'
  if (city.length < 2) errors.city = 'Write your city or area.'
  if (address.length < 5) errors.address = 'Write your full address.'
  if (!input.items.length) errors.form = 'Your cart is empty.'

  const lines = input.items.map(checkLine)
  if (lines.some((l) => l.problem)) errors.form = 'Some items in your cart need attention.'

  if (Object.keys(errors).length || !gov) return { ok: false, errors }

  const items: OrderItem[] = lines.map(({ item, product }) => ({
    productId: product!.id,
    slug: product!.slug,
    image: product!.images[0],
    nameSnapshot: product!.name,
    priceSnapshot: product!.price,
    size: item.size,
    color: product!.colors.find((c) => c.value === item.color)?.name ?? item.color,
    quantity: item.quantity,
  }))
  const subtotal = items.reduce((sum, it) => sum + it.priceSnapshot * it.quantity, 0)
  const now = new Date().toISOString()
  const order: Order = {
    orderNumber: nextOrderNumber(),
    customer: { name, phone },
    delivery: {
      governorateId: gov.id,
      governorate: gov.name,
      city,
      address,
      building: input.building.trim(),
      notes: input.notes.trim(),
    },
    items,
    subtotal,
    deliveryFee: gov.fee,
    total: subtotal + gov.fee,
    paymentMethod: 'cod',
    status: 'pending',
    statusHistory: [{ status: 'pending', at: now }],
    createdAt: now,
  }
  saveOrders([order, ...loadOrders()])
  return { ok: true, order }
}

export async function getOrder(orderNumber: string): Promise<Order | null> {
  await delay(0)
  return loadOrders().find((o) => o.orderNumber === orderNumber) ?? null
}

// --- Admin ------------------------------------------------------------------

export async function listOrders(status?: OrderStatus): Promise<Order[]> {
  await delay(0)
  return loadOrders()
    .filter((o) => (status ? o.status === status : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function updateOrderStatus(orderNumber: string, status: OrderStatus): Promise<Order> {
  await delay(150)
  const orders = loadOrders()
  const order = orders.find((o) => o.orderNumber === orderNumber)
  if (!order) throw new Error('Order not found.')
  if (!canMoveTo(order.status, status)) throw new Error(`Can't move from ${order.status} to ${status}.`)
  order.status = status
  order.statusHistory.push({ status, at: new Date().toISOString() })
  saveOrders(orders)
  return order
}

export interface DashboardStats {
  byStatus: Record<OrderStatus, number>
  todayOrders: number
  todayRevenue: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(0)
  const orders = loadOrders()
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const byStatus = { pending: 0, confirmed: 0, preparing: 0, shipped: 0, delivered: 0, cancelled: 0 }
  let todayOrders = 0
  let todayRevenue = 0
  for (const o of orders) {
    byStatus[o.status]++
    if (new Date(o.createdAt) >= startOfToday && o.status !== 'cancelled') {
      todayOrders++
      todayRevenue += o.total
    }
  }
  return { byStatus, todayOrders, todayRevenue }
}
