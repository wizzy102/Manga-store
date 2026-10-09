import { Link } from 'react-router'
import { getCategories, getFeaturedProducts } from '../api'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { useLoad } from '../hooks/useLoad'
import { useTitle } from '../hooks/useTitle'
import { site } from '../data/site'
import { btnGhost, btnPrimary, eyebrow, sectionTitle } from '../lib/ui'

const heroImages = [
  { src: '/images/products/jacquard-zip-shirt-1.jpg', mobile: false },
  { src: '/images/products/utility-overshirt-1.jpg', mobile: true },
  { src: '/images/products/script-logo-tee-2.jpg', mobile: false },
]

export function HomePage() {
  useTitle()
  const featured = useLoad(getFeaturedProducts, [])
  const cats = useLoad(getCategories, [])

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="grid h-[78svh] min-h-[520px] grid-cols-1 md:h-[640px] md:grid-cols-3">
          {heroImages.map((img) => (
            <div key={img.src} className={`relative overflow-hidden bg-coal ${img.mobile ? '' : 'hidden md:block'}`}>
              <img src={img.src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 md:px-8 md:pb-14">
          <div className="fade-up max-w-xl">
            <p className={eyebrow}>New drops every week</p>
            <h1 className="wordmark mt-3 text-[clamp(2.25rem,10.5vw,4.5rem)] font-semibold leading-none text-bone">
              MANGASTORE
            </h1>
            <p className="mt-3 text-base text-silver md:text-lg">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className={btnPrimary}>
                Shop now
              </Link>
              <Link to="/shop?new=1" className={btnGhost}>
                New drop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New drop */}
      <section className="mx-auto max-w-7xl px-4 pt-16 md:px-8 md:pt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={eyebrow}>This week</p>
            <h2 className={`${sectionTitle} mt-2`}>New drop</h2>
          </div>
          <Link to="/shop" className="text-xs font-semibold uppercase tracking-[0.2em] text-silver hover:text-bone">
            View all →
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {featured.data
            ? featured.data.map((p) => (
                <div key={p.id} className="w-[72%] shrink-0 snap-start md:w-auto">
                  <ProductCard product={p} />
                </div>
              ))
            : [0, 1, 2].map((i) => (
                <div key={i} className="w-[72%] shrink-0 md:w-auto">
                  <ProductCardSkeleton />
                </div>
              ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pt-16 md:px-8 md:pt-24">
        <p className={eyebrow}>Collections</p>
        <h2 className={`${sectionTitle} mt-2`}>Shop by category</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:gap-6">
          {(cats.data ?? []).map((c) => (
            <Link key={c.id} to={`/shop?category=${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-coal md:aspect-[5/4]">
              <img
                src={c.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 md:p-6">
                <span className="text-lg font-bold uppercase tracking-[0.15em] text-bone md:text-2xl">{c.name}</span>
                <span className="text-bone transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How ordering works */}
      <section className="mt-16 border-y border-line bg-coal md:mt-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8 md:py-16">
          {[
            { n: '01', title: site.deliveryBanner.title, body: 'We deliver to all 27 governorates.' },
            { n: '02', title: 'Cash on delivery', body: 'Pay when your order arrives.' },
            { n: '03', title: 'No account needed', body: 'Order in two minutes. We call you to confirm.' },
          ].map((s) => (
            <div key={s.n} className="flex gap-5">
              <span className="wordmark text-2xl text-mute">{s.n}</span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-bone">{s.title}</h3>
                <p className="mt-2 text-sm text-silver">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram */}
      <section className="mx-auto max-w-3xl px-4 pt-16 text-center md:pt-24">
        <img src="/images/brand/wolf.png" alt="" className="mx-auto h-14 w-14" />
        <h2 className={`${sectionTitle} mt-6`}>See it first on Instagram</h2>
        <p className="mt-3 text-silver">New pieces land on {site.instagram.handle} every week.</p>
        <a
          href={site.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnGhost} mt-8`}
        >
          Follow {site.instagram.handle}
        </a>
      </section>
    </>
  )
}
