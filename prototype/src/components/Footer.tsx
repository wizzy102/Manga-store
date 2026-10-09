import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-mute md:flex-row md:items-center md:justify-between md:px-8">
        <p className="wordmark text-bone">{site.brand}</p>
        <div className="flex flex-wrap gap-6">
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
            Instagram {site.instagram.handle}
          </a>
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
            WhatsApp
          </a>
          <a href={site.location.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
            {site.location.label}
          </a>
        </div>
      </div>
    </footer>
  )
}
