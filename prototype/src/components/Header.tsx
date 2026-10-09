import { Link } from 'react-router'
import { useCart } from '../store/cart'
import { categories } from '../data/categories'

const navItems = [
  { to: '/shop', label: 'Shop all' },
  { to: '/shop?new=1', label: 'New drop' },
  ...categories.map((c) => ({ to: `/shop?category=${c.slug}`, label: c.name })),
]

export function Header() {
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="MANGASTORE home">
          <img src="/images/brand/wolf.png" alt="" className="h-8 w-8 object-contain" />
          <span className="wordmark text-base font-semibold text-bone md:text-lg">MANGASTORE</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-sm uppercase tracking-widest text-silver transition hover:text-bone"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/cart"
          className="flex items-center gap-2 text-sm uppercase tracking-widest text-silver transition hover:text-bone"
          aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
        >
          Cart
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-bone px-1.5 text-xs font-bold text-ink tabular-nums">
            {count}
          </span>
        </Link>
      </div>

      <nav aria-label="Main mobile" className="flex gap-6 overflow-x-auto border-t border-line px-4 py-2 no-scrollbar md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="shrink-0 text-xs uppercase tracking-widest text-silver"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
