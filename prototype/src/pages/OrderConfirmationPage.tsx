import { Link, useParams } from 'react-router'
import { getOrder } from '../api'
import { useLoad } from '../hooks/useLoad'
import { useTitle } from '../hooks/useTitle'
import { site } from '../data/site'
import { formatEGP, whatsappLink } from '../lib/format'
import { btnGhost, btnPrimary, eyebrow } from '../lib/ui'

export function OrderConfirmationPage() {
  const { orderNumber = '' } = useParams()
  useTitle('Order received')
  const { data: order, loading } = useLoad(() => getOrder(orderNumber), [orderNumber])

  if (loading && !order) return <div className="min-h-[60dvh]" />
  if (!order) {
    return (
      <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-silver">We couldn't find this order.</p>
        <Link to="/" className="text-bone underline underline-offset-4">
          Back to home
        </Link>
      </section>
    )
  }

  const waMessage = `Hi MANGASTORE, about my order ${order.orderNumber}.`

  return (
    <div className="mx-auto max-w-2xl px-4 pt-12 md:pt-20">
      <div className="fade-up text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-ok/50 text-2xl text-ok">✓</div>
        <p className={`${eyebrow} mt-6`}>Order {order.orderNumber}</p>
        <h1 className="mt-3 text-3xl font-bold uppercase tracking-[0.12em] text-bone md:text-4xl">Order received</h1>
        <p className="mx-auto mt-4 max-w-md text-silver">
          Thank you, {order.customer.name.split(' ')[0]}. We will call you on{' '}
          <span className="font-semibold text-bone">{order.customer.phone}</span> to confirm your order.
        </p>
      </div>

      <div className="mt-10 border border-line bg-coal p-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-bone">Order summary</h2>
        <ul className="mt-5 divide-y divide-line">
          {order.items.map((it) => (
            <li key={`${it.productId}${it.size}${it.color}`} className="flex gap-4 py-4 first:pt-0">
              <div className="w-16 shrink-0">
                <div className="aspect-[4/5] overflow-hidden bg-char">
                  <img src={it.image} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold text-bone">{it.nameSnapshot}</p>
                <p className="mt-1 text-xs text-silver">
                  {[it.size && `Size ${it.size}`, it.color, `Qty ${it.quantity}`].filter(Boolean).join(' · ')}
                </p>
              </div>
              <p className="text-sm tabular-nums text-bone">{formatEGP(it.priceSnapshot * it.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-3 border-t border-line pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-silver">Subtotal</dt>
            <dd className="tabular-nums">{formatEGP(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-silver">Delivery ({order.delivery.governorate})</dt>
            <dd className="tabular-nums">{formatEGP(order.deliveryFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatEGP(order.total)}</dd>
          </div>
        </dl>

        <div className="mt-6 grid gap-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
          <div>
            <p className={eyebrow}>Deliver to</p>
            <p className="mt-2 text-bone">
              {order.delivery.address}
              {order.delivery.building && `, ${order.delivery.building}`}
              <br />
              {order.delivery.city}, {order.delivery.governorate}
            </p>
          </div>
          <div>
            <p className={eyebrow}>Payment</p>
            <p className="mt-2 text-bone">Cash on delivery</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappLink(site.whatsapp, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnPrimary} sm:flex-1`}
        >
          Contact us on WhatsApp
        </a>
        <Link to="/shop" className={`${btnGhost} sm:flex-1`}>
          Keep shopping
        </Link>
      </div>
    </div>
  )
}
