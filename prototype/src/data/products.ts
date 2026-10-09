import type { Product } from '../types'

/**
 * PLACEHOLDER catalogue: names, prices, sizes and descriptions are samples.
 * Photos are from the store's Instagram and can be swapped in public/images/products/.
 */
export const products: Product[] = [
  {
    id: 'p01',
    slug: 'jacquard-zip-shirt',
    name: 'Jacquard Zip Shirt',
    description:
      'Short-sleeve shirt in black jacquard with a tonal pattern. Full silver zip, spread collar and a metal V detail on the chest pocket.',
    price: 1450,
    images: ['/images/products/jacquard-zip-shirt-1.jpg', '/images/products/jacquard-zip-shirt-2.jpg'],
    categoryId: 'cat-shirts',
    collection: 'New Drop',
    sizes: [
      { value: 'S', available: true },
      { value: 'M', available: true },
      { value: 'L', available: true },
      { value: 'XL', available: false },
    ],
    colors: [{ value: 'black', name: 'Black', hex: '#111111', available: true }],
    isAvailable: true,
    isFeatured: true,
    isNew: true,
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'p02',
    slug: 'script-logo-tee',
    name: 'Script Logo Tee',
    description:
      'Heavy cotton tee with a raised script logo on the back and a small one on the chest. Regular fit.',
    price: 950,
    images: ['/images/products/script-logo-tee-1.jpg', '/images/products/script-logo-tee-2.jpg'],
    categoryId: 'cat-tshirts',
    collection: 'New Drop',
    sizes: [
      { value: 'S', available: true },
      { value: 'M', available: true },
      { value: 'L', available: true },
      { value: 'XL', available: true },
      { value: 'XXL', available: true },
    ],
    colors: [{ value: 'black', name: 'Black', hex: '#111111', available: true }],
    isAvailable: true,
    isFeatured: true,
    isNew: true,
    createdAt: '2026-09-28T10:00:00.000Z',
  },
  {
    id: 'p03',
    slug: 'utility-overshirt',
    name: 'Utility Overshirt',
    description:
      'Washed cotton overshirt with two chest pockets and button cuffs. Wear it open over a tee or closed as a shirt.',
    price: 1650,
    images: [
      '/images/products/utility-overshirt-1.jpg',
      '/images/products/utility-overshirt-2.jpg',
      '/images/products/utility-overshirt-3.jpg',
    ],
    categoryId: 'cat-shirts',
    sizes: [
      { value: 'S', available: false },
      { value: 'M', available: true },
      { value: 'L', available: true },
      { value: 'XL', available: true },
    ],
    colors: [
      { value: 'black', name: 'Washed Black', hex: '#2b2b2b', available: true },
      { value: 'olive', name: 'Olive', hex: '#6b7350', available: true },
    ],
    isAvailable: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2026-09-15T10:00:00.000Z',
  },
]
