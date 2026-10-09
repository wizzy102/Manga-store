import { Link, useSearchParams } from 'react-router'
import { getCategories, getProducts } from '../api'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { useLoad } from '../hooks/useLoad'
import { useTitle } from '../hooks/useTitle'
import { eyebrow, sectionTitle } from '../lib/ui'

export function ShopPage() {
  const [params] = useSearchParams()
  const category = params.get('category') ?? undefined
  const newOnly = params.get('new') === '1'

  const cats = useLoad(getCategories, [])
  const list = useLoad(() => getProducts({ category, newOnly }), [category, newOnly])

  const activeCat = cats.data?.find((c) => c.slug === category)
  const title = newOnly ? 'New drop' : activeCat ? activeCat.name : 'Shop all'
  useTitle(title)

  const filters = [
    { label: 'All', to: '/shop', active: !category && !newOnly },
    { label: 'New drop', to: '/shop?new=1', active: newOnly },
    ...(cats.data ?? []).map((c) => ({ label: c.name, to: `/shop?category=${c.slug}`, active: c.slug === category })),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8 md:pt-16">
      <p className={eyebrow}>Shop</p>
      <h1 className={`${sectionTitle} mt-2`}>{title}</h1>

      <nav aria-label="Filter products" className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {filters.map((f) => (
          <Link
            key={f.label}
            to={f.to}
            aria-current={f.active ? 'page' : undefined}
            className={`shrink-0 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              f.active ? 'border-bone bg-bone text-ink' : 'border-line text-silver hover:border-silver hover:text-bone'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      <p className="mt-6 text-xs text-mute" aria-live="polite">
        {list.data ? `${list.data.length} item${list.data.length === 1 ? '' : 's'}` : 'Loading…'}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12">
        {list.loading && !list.data
          ? [0, 1, 2].map((i) => <ProductCardSkeleton key={i} />)
          : list.data?.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {list.data && list.data.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-silver">Nothing here yet.</p>
          <Link to="/shop" className="mt-4 inline-block text-sm text-bone underline underline-offset-4">
            See all products
          </Link>
        </div>
      )}
    </div>
  )
}
