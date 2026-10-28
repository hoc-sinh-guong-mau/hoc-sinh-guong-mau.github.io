import { useSyncExternalStore } from 'react'

// Small screens, short windows, and reduced motion retain normal document flow.
const query =
  '(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)'
function subscribe(callback: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
export function useEnhancedScroll() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
