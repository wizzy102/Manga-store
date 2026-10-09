import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm uppercase tracking-widest text-mute">Page not found</p>
      <Link to="/" className="text-bone underline underline-offset-4">
        Back to home
      </Link>
    </section>
  )
}
