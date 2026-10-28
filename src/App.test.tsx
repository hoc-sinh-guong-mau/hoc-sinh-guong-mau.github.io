import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { projects, profile } from './data/portfolio'
import App from './App'

describe('Portfolio', () => {
  it('provides keyboard-accessible navigation to real section targets', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.tab()
    const skipLink = screen.getByRole('link', { name: 'Skip to content' })
    expect(document.activeElement).toBe(skipLink)
    expect(skipLink.getAttribute('href')).toBe('#main')
    expect(screen.getByRole('main').id).toBe('main')

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    })
    for (const link of within(navigation).getAllByRole('link')) {
      const href = link.getAttribute('href')
      expect(href).toMatch(/^#[a-z]+$/)
      expect(document.getElementById(href!.slice(1))).not.toBeNull()
    }

    await user.tab()
    expect(document.activeElement).toBe(
      screen.getByRole('link', { name: `${profile.name}, home` }),
    )
  })

  it('shows the confirmed profile, experience, and education', () => {
    render(<App />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Hieu Quyen',
    )
    expect(screen.getByRole('heading', { name: 'Dong Da' })).toBeDefined()
    expect(screen.getByRole('heading', { name: 'Veron' })).toBeDefined()
    const education = screen.getByRole('region', { name: 'Education' })
    expect(education.textContent).toContain('Computer Science')
    expect(education.textContent).toContain('2027')
    expect(education.textContent).toContain('Expected graduation')
  })

  it('links every featured project to its actual source repository', () => {
    render(<App />)

    for (const project of projects) {
      const article = screen.getByRole('article', { name: project.name })
      const link = within(article).getByRole('link', {
        name: `View repository for ${project.name} (opens in a new tab)`,
      })
      expect(link.getAttribute('href')).toBe(project.repository)
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    }
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('offers working email and GitHub contact links without a form backend', () => {
    render(<App />)
    const contact = screen.getByRole('region', { name: 'Let’s connect.' })
    expect(
      within(contact)
        .getByRole('link', { name: profile.email })
        .getAttribute('href'),
    ).toBe(`mailto:${profile.email}`)
    expect(
      within(contact)
        .getByRole('link', { name: 'Find me on GitHub (opens in a new tab)' })
        .getAttribute('href'),
    ).toBe(profile.github)
  })
})
