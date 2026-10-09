import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { getGovernorates, placeOrder, quoteCart, type CheckoutErrors, type CheckoutInput } from '../api'
import { useLoad } from '../hooks/useLoad'
import { useTitle } from '../hooks/useTitle'
import { useCart } from '../store/cart'
import { formatEGP } from '../lib/format'
import { btnPrimary, eyebrow, input, sectionTitle } from '../lib/ui'

type Form = Omit<CheckoutInput, 'items'>

const emptyForm: Form = { name: '', phone: '', governorateId: '', city: '', address: '', building: '', notes: '' }

export function CheckoutPage() {
  useTitle('Checkout')
  const cart = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>(emptyForm)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const { data: govs } = useLoad(getGovernorates, [])
  const { data: quote } = useLoad(() => quoteCart(cart.items, form.governorateId || undefined), [cart.items, form.governorateId])

  if (cart.items.length === 0 && !submitting) {
    return (
      <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-silver">Your cart is empty.</p>
        <Link to="/shop" className={btnPrimary}>
          Start shopping
        </Link>
      </section>
    )
  }

  const set = (field: keyof Form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const result = await placeOrder({ ...form, items: cart.items })
    if (result.ok) {
      cart.clear()
      navigate(`/order/${result.order.orderNumber}`, { replace: true })
      return
    }
    setErrors(result.errors)
    setSubmitting(false)
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8 md:pt-16">
      <p className={eyebrow}>Almost done</p>
      <h1 className={`${sectionTitle} mt-2`}>Checkout</h1>

      <form noValidate onSubmit={submit} className="mt-8 md:grid md:grid-cols-[1fr_400px] md:gap-12">
        <div className="space-y-10">
          {errors.form && (
            <p role="alert" className="border border-bad/50 bg-bad/10 px-4 py-3 text-sm text-bone">
              {errors.form} <Link to="/cart" className="underline underline-offset-4">Go to cart</Link>
            </p>
          )}

          <fieldset className="space-y-4">
            <legend className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-bone">1. Your details</legend>
            <Field label="Full name" error={errors.name} id="name">
              <input id="name" className={input} autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} />
            </Field>
            <Field label="Mobile number" hint="We call this number to confirm your order." error={errors.phone} id="phone">
              <input
                id="phone"
                className={input}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
                value={form.phone}
                onChange={set('phone')}
                aria-invalid={!!errors.phone}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-bone">2. Delivery address</legend>
            <Field label="Governorate" error={errors.governorateId} id="gov">
              <div className="relative">
                <select
                  id="gov"
                  className={`${input} appearance-none pe-10`}
                  value={form.governorateId}
                  onChange={set('governorateId')}
                  aria-invalid={!!errors.governorateId}
                >
                  <option value="">Choose governorate</option>
                  {govs?.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-xs text-silver">▼</span>
              </div>
            </Field>
            <Field label="City / Area" error={errors.city} id="city">
              <input id="city" className={input} placeholder="e.g. Nasr City" value={form.city} onChange={set('city')} aria-invalid={!!errors.city} />
            </Field>
            <Field label="Street address" error={errors.address} id="address">
              <input
                id="address"
                className={input}
                autoComplete="street-address"
                placeholder="Street name and number"
                value={form.address}
                onChange={set('address')}
                aria-invalid={!!errors.address}
              />
            </Field>
            <Field label="Building, floor, apartment" optional id="building">
              <input id="building" className={input} placeholder="e.g. Building 5, floor 3, apt 12" value={form.building} onChange={set('building')} />
            </Field>
            <Field label="Notes for delivery" optional id="notes">
              <textarea
                id="notes"
                rows={2}
                className={`${input} h-auto py-3`}
                placeholder="e.g. Call before you arrive"
                value={form.notes}
                onChange={set('notes')}
              />
            </Field>
          </fieldset>

          <fieldset>
            <legend className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-bone">3. Payment</legend>
            <div className="flex items-center gap-4 border border-bone px-4 py-4">
              <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-bone">
                <span className="h-2 w-2 rounded-full bg-bone" />
              </span>
              <div>
                <p className="text-sm font-semibold text-bone">Cash on delivery</p>
                <p className="text-xs text-silver">Pay when your order arrives.</p>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Summary */}
        <aside className="mt-10 md:sticky md:top-24 md:mt-0 md:self-start">
          <div className="border border-line bg-coal p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-bone">Your order</h2>
            <ul className="mt-5 space-y-4">
              {quote?.lines.map(({ item, product, lineTotal }) => (
                <li key={`${item.productId}${item.size}${item.color}`} className="flex gap-3">
                  <div className="relative w-14 shrink-0">
                    <div className="aspect-[4/5] overflow-hidden bg-char">
                      {product && <img src={product.images[0]} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="absolute -end-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-bone px-1 text-[10px] font-bold text-ink">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate font-semibold text-bone">{product?.name}</p>
                    <p className="text-xs text-silver">
                      {[item.size && `Size ${item.size}`, product?.colors.find((c) => c.value === item.color)?.name]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                  <p className="text-sm tabular-nums text-bone">{formatEGP(lineTotal)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-silver">Subtotal</dt>
                <dd className="tabular-nums">{formatEGP(quote?.subtotal ?? 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-silver">Delivery</dt>
                <dd className="tabular-nums">
                  {quote?.deliveryFee != null ? formatEGP(quote.deliveryFee) : <span className="text-mute">Choose governorate</span>}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatEGP(quote?.total ?? 0)}</dd>
              </div>
            </dl>
            <button type="submit" disabled={submitting} className={`${btnPrimary} mt-6 w-full`}>
              {submitting ? 'Placing order…' : 'Place order'}
            </button>
            <p className="mt-4 text-center text-xs text-mute">You pay cash when it arrives.</p>
          </div>
        </aside>
      </form>
    </div>
  )
}

function Field({
  label,
  id,
  error,
  hint,
  optional,
  children,
}: {
  label: string
  id: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-silver">
        {label}
        {optional && <span className="ms-2 normal-case tracking-normal text-mute">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-xs font-semibold text-bad">{error}</p>
      ) : (
        hint && <p className="mt-2 text-xs text-mute">{hint}</p>
      )}
    </div>
  )
}
