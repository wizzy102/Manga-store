import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getCategories, getProduct } from '../api'
import { QtyStepper } from '../components/QtyStepper'
import { useLoad } from '../hooks/useLoad'
import { useTitle } from '../hooks/useTitle'
import { useCart } from '../store/cart'
import { site } from '../data/site'
import { formatEGP, whatsappLink } from '../lib/format'
import { btnPrimary } from '../lib/ui'
import type { Product } from '../types'

export function ProductPage() {
  const { slug = '' } = useParams()
  const { data: product, loading } = useLoad(() => getProduct(slug), [slug])

  if (loading && !product) return <ProductSkeleton />
  if (!product) {
    return (
      <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-silver">This product is not available.</p>
        <Link to="/shop" className="text-bone underline underline-offset-4">
          Back to shop
        </Link>
      </section>
    )
  }
  // key resets selections when moving between products
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }: { product: Product }) {
  useTitle(product.name)
  const cart = useCart()
  const { data: cats } = useLoad(getCategories, [])
  const category = cats?.find((c) => c.id === product.categoryId)

  const [active, setActive] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState<string | null>(product.colors.length === 1 ? product.colors[0].value : null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const railRef = useRef<HTMLDivElement>(null)

  const selectedColor = product.colors.find((c) => c.value === color)

  function onRailScroll() {
    const el = railRef.current
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  function addToCart() {
    if (!product.isAvailable) return
    if (product.sizes.length && !size) return setError('Please choose a size.')
    if (product.colors.length && !color) return setError('Please choose a color.')
    cart.add({ productId: product.id, size, color, quantity: qty })
    setError(null)
    setAdded(true)
  }

  const waMessage = `Hi MANGASTORE, I have a question about "${product.name}"${size ? ` (size ${size})` : ''}.`

  return (
    <div className="mx-auto max-w-7xl md:px-8 md:pt-10">
      <nav aria-label="Breadcrumb" className="hidden text-xs uppercase tracking-[0.18em] text-mute md:block">
        <Link to="/shop" className="hover:text-bone">
          Shop
        </Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/shop?category=${category.slug}`} className="hover:text-bone">
              {category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="md:mt-6 md:grid md:grid-cols-[1.15fr_1fr] md:gap-12 lg:gap-16">
        {/* Gallery */}
        <div>
          {/* Mobile: swipe rail */}
          <div className="relative md:hidden">
            <div
              ref={railRef}
              onScroll={onRailScroll}
              className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
            >
              {product.images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={i === 0 ? product.name : ''}
                  className="aspect-[4/5] w-full shrink-0 snap-center object-cover"
                />
              ))}
            </div>
            {product.images.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {product.images.map((src, i) => (
                  <span
                    key={src}
                    className={`h-1 transition-all ${i === active ? 'w-6 bg-bone' : 'w-3 bg-bone/40'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop: main image + thumbnails */}
          <div className="hidden md:block">
            <div className="aspect-[4/5] overflow-hidden bg-coal">
              <img src={product.images[active]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`aspect-[4/5] overflow-hidden border transition ${
                      i === active ? 'border-bone' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="px-4 pt-6 md:sticky md:top-24 md:self-start md:px-0 md:pt-0">
          {product.isNew && (
            <span className="inline-block bg-bone px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
              New
            </span>
          )}
          <h1 className="mt-3 text-2xl font-bold uppercase tracking-[0.08em] text-bone md:text-3xl">{product.name}</h1>
          <p className="mt-3 text-xl text-bone tabular-nums">{formatEGP(product.price)}</p>

          {/* Size */}
          {product.sizes.length > 0 && (
            <fieldset className="mt-8">
              <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-silver">
                Size{size && <span className="ms-2 text-bone">{size}</span>}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const selected = s.value === size
                  return (
                    <button
                      key={s.value}
                      type="button"
                      disabled={!s.available}
                      aria-pressed={selected}
                      onClick={() => {
                        setSize(s.value)
                        setError(null)
                        setAdded(false)
                      }}
                      className={`relative h-12 min-w-14 border px-3 text-sm font-semibold transition ${
                        selected
                          ? 'border-bone bg-bone text-ink'
                          : s.available
                            ? 'border-line text-bone hover:border-silver'
                            : 'cursor-not-allowed border-line/60 text-mute/50 line-through'
                      }`}
                      title={s.available ? undefined : 'Sold out'}
                    >
                      {s.value}
                    </button>
                  )
                })}
              </div>
              {product.sizes.some((s) => !s.available) && (
                <p className="mt-2 text-xs text-mute">Crossed-out sizes are sold out.</p>
              )}
            </fieldset>
          )}

          {/* Color */}
          {product.colors.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-silver">
                Color{selectedColor && <span className="ms-2 text-bone">{selectedColor.name}</span>}
              </legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((c) => {
                  const selected = c.value === color
                  return (
                    <button
                      key={c.value}
                      type="button"
                      disabled={!c.available}
                      aria-pressed={selected}
                      aria-label={c.name}
                      title={c.name}
                      onClick={() => {
                        setColor(c.value)
                        setError(null)
                        setAdded(false)
                      }}
                      className={`h-10 w-10 rounded-full border-2 p-0.5 transition ${
                        selected ? 'border-bone' : 'border-transparent hover:border-line'
                      } disabled:cursor-not-allowed disabled:opacity-30`}
                    >
                      <span className="block h-full w-full rounded-full border border-white/15" style={{ background: c.hex }} />
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Quantity + add */}
          <div className="mt-8 flex gap-3">
            <QtyStepper value={qty} onChange={setQty} />
            <button type="button" onClick={addToCart} disabled={!product.isAvailable} className={`${btnPrimary} flex-1`}>
              {product.isAvailable ? 'Add to cart' : 'Sold out'}
            </button>
          </div>

          <div aria-live="polite" className="min-h-6">
            {error && <p className="mt-3 text-sm font-semibold text-bad">{error}</p>}
            {added && (
              <div className="mt-3 flex items-center justify-between gap-3 border border-ok/40 bg-ok/10 px-4 py-3 text-sm">
                <span className="text-bone">Added to your cart.</span>
                <Link to="/cart" className="font-semibold uppercase tracking-[0.15em] text-bone underline underline-offset-4">
                  View cart
                </Link>
              </div>
            )}
          </div>

          <p className="mt-8 text-sm leading-relaxed text-silver">{product.description}</p>

          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm text-silver">
            <li>✓ Cash on delivery</li>
            <li>✓ Delivery across Egypt</li>
            <li>✓ We call you to confirm your order</li>
          </ul>

          <a
            href={whatsappLink(site.whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-between border border-line px-4 py-4 text-sm transition hover:border-silver"
          >
            <span className="text-silver">
              Questions about this item? <span className="font-semibold text-bone">Chat on WhatsApp</span>
            </span>
            <span className="text-bone">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-7xl md:grid md:grid-cols-[1.15fr_1fr] md:gap-12 md:px-8 md:pt-16" aria-hidden>
      <div className="aspect-[4/5] animate-pulse bg-coal" />
      <div className="space-y-4 px-4 pt-6 md:px-0">
        <div className="h-8 w-2/3 animate-pulse bg-coal" />
        <div className="h-6 w-1/4 animate-pulse bg-coal" />
        <div className="h-12 w-full animate-pulse bg-coal" />
      </div>
    </div>
  )
}
