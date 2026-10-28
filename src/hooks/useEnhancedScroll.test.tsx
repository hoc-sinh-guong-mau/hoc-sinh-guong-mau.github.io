import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useEnhancedScroll } from './useEnhancedScroll'
function ScrollPreference() {
  return <output>{useEnhancedScroll() ? 'Enhanced' : 'Normal flow'}</output>
}
describe('Scroll accessibility preference', () => {
  it('responds to preference and viewport changes and removes its listener', () => {
    const events = new EventTarget()
    const remove = vi.fn(
      (type: string, callback: EventListenerOrEventListenerObject) =>
        events.removeEventListener(type, callback),
    )
    const media = {
      matches: true,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: events.addEventListener.bind(events),
      removeEventListener: remove,
      dispatchEvent: events.dispatchEvent.bind(events),
    }
    const mock = vi.spyOn(window, 'matchMedia').mockReturnValue(media)
    try {
      const { unmount } = render(<ScrollPreference />)
      expect(screen.getByText('Enhanced')).toBeDefined()
      expect(mock).toHaveBeenCalledWith(
        expect.stringContaining('(prefers-reduced-motion: no-preference)'),
      )
      act(() => {
        media.matches = false
        events.dispatchEvent(new Event('change'))
      })
      expect(screen.getByText('Normal flow')).toBeDefined()
      unmount()
      expect(remove).toHaveBeenCalledWith('change', expect.any(Function))
    } finally {
      mock.mockRestore()
    }
  })
})
