import { Link } from 'react-router'
import { quoteCart } from '../api'
import { QtyStepper } from '../components/QtyStepper'
import { useLoad } from '../hooks/useLoad'
import { useTitle } from '../hooks/useTitle'
import { lineKey, useCart } from '../store/cart'
import { governorates } from '../data/governorates'
import { formatEGP } from '../lib/format'
import { btnGhost, btnPrimary, eyebrow, sectionTitle } from '../lib/ui'

const lowestFee = Math.min(...governorates.map((g) => g.fee))

export function CartPage() {
  useTitle('Cart')
  const cart = useCart()
  const { data: quote } = useLoad(() => quoteCart(cart.items), [cart.items])

  if (cart.items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center px-4 text-center">
        <img src="/images/brand/wolf.png" alt="" className="h-12 w-12 opacity-60" />
        <h1 className={`${sectionTitle} mt-6`}>Your cart is empty</h1>
        <p className="mt-3 text-silver">Pick something you like and it will show up here.</p>
        <Link to="/shop" className={`${btnPrimary} mt-8`}>
          Start shopping
        </Link>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8 md:pt-16">
      <p className={eyebrow}>Your bag</p>
      <h1 className={`${sectionTitle} mt-2`}>
        Cart <span className="text-mute">({cart.count})</span>
      </h1>

      <div className="mt-8 md:grid md:grid-cols-[1fr_380px] md:gap-12">
        <ul className="divide-y divide-line border-y border-line">
          {(quote?.lines ?? []).map(({ item, product, unitPrice, lineTotal, problem }) => {
            const key = lineKey(item)
            const colorName = product?.colors.find((c) => c.value === item.color)?.name
            return (
              <li key={key} className="flex gap-4 py-5">
                <Link to={product ? `/products/${product.slug}` : '/shop'} className="w-24 shrink-0 md:w-28">
                  <div className="aspect-[4/5] overflow-hidden bg-coal">
                    {product && <img src={product.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-bone">{product?.name ?? 'Unavailable item'}</p>
                      <p className="mt-1 text-xs text-silver">
                        {[item.size && `Size ${item.size}`, colorName].filter(Boolean).join(' · ')}
                      </p>
                      <p className="mt-1 text-xs text-mute tabular-nums">{formatEGP(unitPrice)} each</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-bone tabular-nums">{formatEGP(lineTotal)}</p>
                  </div>
                  {problem && <p className="mt-2 text-xs font-semibold text-bad">{problem}</p>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QtyStepper size="sm" value={item.quantity} onChange={(q) => cart.setQty(key, q)} />
                    <button
                      type="button"
                      onClick={() => cart.remove(key)}
                      className="text-xs uppercase tracking-[0.15em] text-mute underline-offset-4 hover:text-bone hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <aside className="mt-8 md:sticky md:top-24 md:mt-0 md:self-start">
          <div className="border border-line bg-coal p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-bone">Summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-silver">Subtotal</dt>
                <dd className="tabular-nums text-bone">{formatEGP(quote?.subtotal ?? 0)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-silver">Delivery</dt>
                <dd className="text-end text-mute">From {formatEGP(lowestFee)}, by governorate</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatEGP(quote?.subtotal ?? 0)} + delivery</dd>
              </div>
            </dl>
            {quote?.hasProblems && (
              <p className="mt-4 text-xs font-semibold text-bad">Fix or remove the items marked in red to continue.</p>
            )}
            {quote?.hasProblems ? (
              <button type="button" disabled className={`${btnPrimary} mt-6 w-full`}>
                Checkout
              </button>
            ) : (
              <Link to="/checkout" className={`${btnPrimary} mt-6 w-full`}>
                Checkout
              </Link>
            )}
            <p className="mt-4 text-center text-xs text-mute">Pay cash on delivery. No account needed.</p>
          </div>
          <Link to="/shop" className={`${btnGhost} mt-3 w-full`}>
            Keep shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
