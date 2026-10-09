import { useEffect, useState, type DependencyList } from 'react'

/** Runs an async loader and tracks its result. Ignores results from stale runs. */
export function useLoad<T>(load: () => Promise<T>, deps: DependencyList): { data: T | undefined; loading: boolean } {
  const [state, setState] = useState<{ data: T | undefined; loading: boolean }>({ data: undefined, loading: true })

  useEffect(() => {
    let active = true
    setState((s) => ({ data: s.data, loading: true }))
    load().then((data) => {
      if (active) setState({ data, loading: false })
    })
    return () => {
      active = false
    }
  }, deps)

  return state
}
