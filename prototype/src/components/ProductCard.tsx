import { Link } from 'react-router'
import type { Product } from '../types'
import { formatEGP } from '../lib/format'

export function ProductCard({ product }: { product: Product }) {
  const [first, second] = product.images
  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-coal">
        <img
          src={first}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        {second && (
          <img
            src={second}
            alt=""
            loading="lazy"
            className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100 md:block"
          />
        )}
        <div className="absolute start-3 top-3 flex gap-2">
          {product.isNew && (
            <span className="bg-bone px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink">New</span>
          )}
          {!product.isAvailable && (
            <span className="bg-ink/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-bone">
              Sold out
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-semibold text-bone">{product.name}</h3>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-silver tabular-nums">{formatEGP(product.price)}</p>
          {product.colors.length > 1 && (
            <div className="flex gap-1.5" aria-label={`${product.colors.length} colors`}>
              {product.colors.map((c) => (
                <span key={c.value} className="h-3 w-3 rounded-full border border-white/20" style={{ background: c.hex }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="aspect-[4/5] animate-pulse bg-coal" />
      <div className="mt-3 h-4 w-2/3 animate-pulse bg-coal" />
      <div className="mt-2 h-4 w-1/3 animate-pulse bg-coal" />
    </div>
  )
}
