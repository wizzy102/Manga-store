import { useEffect } from 'react'

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | MANGASTORE` : 'MANGASTORE | Luxury Menswear'
  }, [title])
}
