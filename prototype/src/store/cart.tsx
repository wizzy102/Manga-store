import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { CartItem } from '../types'
import { readJSON, writeJSON } from '../lib/storage'

/** Cart lives in localStorage so it survives navigation and reloads; no account needed. */
const CART_KEY = 'manga.cart.v1'
const MAX_QTY = 10

type Action =
  | { type: 'add'; item: CartItem }
  | { type: 'setQty'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }

export const lineKey = (i: Pick<CartItem, 'productId' | 'size' | 'color'>) =>
  `${i.productId}|${i.size ?? ''}|${i.color ?? ''}`

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.item)
      const existing = state.find((i) => lineKey(i) === key)
      if (existing) {
        return state.map((i) =>
          lineKey(i) === key ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + action.item.quantity) } : i,
        )
      }
      return [...state, { ...action.item, quantity: Math.min(MAX_QTY, action.item.quantity) }]
    }
    case 'setQty':
      return state.map((i) =>
        lineKey(i) === action.key ? { ...i, quantity: Math.max(1, Math.min(MAX_QTY, action.quantity)) } : i,
      )
    case 'remove':
      return state.filter((i) => lineKey(i) !== action.key)
    case 'clear':
      return []
  }
}

interface CartContextValue {
  items: CartItem[]
  count: number
  add: (item: CartItem) => void
  setQty: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, () => readJSON<CartItem[]>(CART_KEY, []))

  useEffect(() => writeJSON(CART_KEY, items), [items])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      add: (item) => dispatch({ type: 'add', item }),
      setQty: (key, quantity) => dispatch({ type: 'setQty', key, quantity }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
