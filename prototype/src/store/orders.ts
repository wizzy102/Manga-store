import type { Order, OrderStatus } from '../types'
import { products } from '../data/products'
import { governorates } from '../data/governorates'
import { hasKey, readJSON, writeJSON } from '../lib/storage'

/**
 * Prototype order storage in localStorage. In the real build this is the backend's job.
 * On first load it seeds a few DEMO orders so the admin has something to show.
 */
const ORDERS_KEY = 'manga.orders.v1'
const COUNTER_KEY = 'manga.orderCounter.v1'
const CHANGE_EVENT = 'manga:orders-changed'

export function loadOrders(): Order[] {
  if (!hasKey(ORDERS_KEY)) {
    const seeded = buildDemoOrders()
    writeJSON(ORDERS_KEY, seeded)
    writeJSON(COUNTER_KEY, 1000 + seeded.length)
  }
  return readJSON<Order[]>(ORDERS_KEY, [])
}

export function saveOrders(orders: Order[]): void {
  writeJSON(ORDERS_KEY, orders)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function nextOrderNumber(): string {
  loadOrders()
  const next = readJSON<number>(COUNTER_KEY, 1000) + 1
  writeJSON(COUNTER_KEY, next)
  return `MNG-${next}`
}

/** Calls `onChange` when orders change in this tab or another tab. */
export function subscribeToOrders(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === ORDERS_KEY) onChange()
  }
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onStorage)
  }
}

export function resetDemoOrders(): void {
  try {
    localStorage.removeItem(ORDERS_KEY)
    localStorage.removeItem(COUNTER_KEY)
  } catch {
    // ignore
  }
  loadOrders()
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

// ---------------------------------------------------------------------------
// DEMO seed data: fictional customers, not real orders.

interface DemoSpec {
  name: string
  phone: string
  governorateId: string
  city: string
  address: string
  items: { productId: string; size: string; color: string; quantity: number }[]
  status: OrderStatus
  hoursAgo: number
}

const demoSpecs: DemoSpec[] = [
  {
    name: 'Omar Khaled',
    phone: '01012345678',
    governorateId: 'giza',
    city: '6th of October',
    address: '12 Central Axis, District 7',
    items: [{ productId: 'p01', size: 'L', color: 'black', quantity: 1 }],
    status: 'pending',
    hoursAgo: 1,
  },
  {
    name: 'Youssef Adel',
    phone: '01123456789',
    governorateId: 'cairo',
    city: 'Nasr City',
    address: '45 Abbas El Akkad St.',
    items: [
      { productId: 'p02', size: 'M', color: 'black', quantity: 2 },
      { productId: 'p03', size: 'L', color: 'olive', quantity: 1 },
    ],
    status: 'pending',
    hoursAgo: 3,
  },
  {
    name: 'Mahmoud Samir',
    phone: '01234567890',
    governorateId: 'alexandria',
    city: 'Smouha',
    address: '8 Victor Emmanuel Sq.',
    items: [{ productId: 'p03', size: 'XL', color: 'black', quantity: 1 }],
    status: 'confirmed',
    hoursAgo: 5,
  },
  {
    name: 'Karim Hassan',
    phone: '01556789012',
    governorateId: 'cairo',
    city: 'New Cairo',
    address: '90th Street, Fifth Settlement',
    items: [{ productId: 'p02', size: 'XL', color: 'black', quantity: 1 }],
    status: 'preparing',
    hoursAgo: 26,
  },
  {
    name: 'Ahmed Mostafa',
    phone: '01098765432',
    governorateId: 'giza',
    city: 'Sheikh Zayed',
    address: 'Beverly Hills, Building 14',
    items: [
      { productId: 'p01', size: 'M', color: 'black', quantity: 1 },
      { productId: 'p02', size: 'M', color: 'black', quantity: 1 },
    ],
    status: 'shipped',
    hoursAgo: 30,
  },
  {
    name: 'Mostafa Ibrahim',
    phone: '01187654321',
    governorateId: 'dakahlia',
    city: 'Mansoura',
    address: 'El Gomhoreya St.',
    items: [{ productId: 'p03', size: 'M', color: 'olive', quantity: 1 }],
    status: 'delivered',
    hoursAgo: 72,
  },
]

function buildDemoOrders(): Order[] {
  const now = Date.now()
  return demoSpecs.map((spec, i) => {
    const gov = governorates.find((g) => g.id === spec.governorateId)!
    const items = spec.items.map((it) => {
      const p = products.find((x) => x.id === it.productId)!
      return {
        productId: p.id,
        slug: p.slug,
        image: p.images[0],
        nameSnapshot: p.name,
        priceSnapshot: p.price,
        size: it.size,
        color: p.colors.find((c) => c.value === it.color)?.name ?? it.color,
        quantity: it.quantity,
      }
    })
    const subtotal = items.reduce((sum, it) => sum + it.priceSnapshot * it.quantity, 0)
    const createdAt = new Date(now - spec.hoursAgo * 3600_000).toISOString()
    const flow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered']
    const history =
      spec.status === 'cancelled'
        ? [{ status: 'pending' as OrderStatus, at: createdAt }, { status: 'cancelled' as OrderStatus, at: createdAt }]
        : flow.slice(0, flow.indexOf(spec.status) + 1).map((status, step) => ({
            status,
            at: new Date(now - spec.hoursAgo * 3600_000 + step * 40 * 60_000).toISOString(),
          }))
    return {
      // Specs are listed newest first; the oldest order gets the lowest number.
      orderNumber: `MNG-${1000 + demoSpecs.length - i}`,
      customer: { name: spec.name, phone: spec.phone },
      delivery: {
        governorateId: gov.id,
        governorate: gov.name,
        city: spec.city,
        address: spec.address,
        building: '',
        notes: '',
      },
      items,
      subtotal,
      deliveryFee: gov.fee,
      total: subtotal + gov.fee,
      paymentMethod: 'cod',
      status: spec.status,
      statusHistory: history,
      createdAt,
    }
  })
}
