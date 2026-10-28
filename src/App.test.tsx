import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('increments the counter through pointer and keyboard interaction', async () => {
    const user = userEvent.setup()
    render(<App />)

    const counter = screen.getByRole('button', { name: 'Count is 0' })
    await user.click(counter)
    expect(counter.textContent).toBe('Count is 1')

    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(counter.textContent).toBe('Count is 3')
  })

  it('provides the existing documentation and community destinations', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Get started',
    )
    const destinations = [
      ['Explore Vite', 'https://vite.dev/'],
      ['Learn more', 'https://react.dev/'],
      ['GitHub', 'https://github.com/vitejs/vite'],
      ['Discord', 'https://chat.vite.dev/'],
      ['X.com', 'https://x.com/vite_js'],
      ['Bluesky', 'https://bsky.app/profile/vite.dev'],
    ] as const

    for (const [name, href] of destinations) {
      const link = screen.getByRole('link', { name })
      expect(link.getAttribute('href')).toBe(href)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    }
  })
})
