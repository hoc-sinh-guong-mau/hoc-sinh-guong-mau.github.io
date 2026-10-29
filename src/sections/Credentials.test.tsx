import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Credentials } from './Credentials'
import { Contact } from './Contact'
import { Education } from './Education'
import { education, profile } from '../data/portfolio'

describe('Verified portfolio details', () => {
  it('does not invent credentials or verification links for an empty collection', () => {
    render(<Credentials entries={[]} />)
    expect(
      screen.getByText('No certificates or awards published here yet.'),
    ).toBeDefined()
    expect(screen.queryByRole('link')).toBeNull()
  })
  it('renders owner-provided credential details and optional verification', () => {
    render(
      <Credentials
        entries={[
          {
            id: 'test',
            kind: 'Certificate',
            title: 'Test-only credential',
            issuer: 'Test issuer',
            date: '2025-06',
            dateLabel: 'Jun 2025',
            verificationUrl: 'https://example.com/credential',
          },
        ]}
      />,
    )
    expect(
      screen.getByRole('heading', { name: 'Test-only credential' }),
    ).toBeDefined()
    expect(screen.getByText('Test issuer')).toBeDefined()
    expect(screen.getByText('Jun 2025').getAttribute('dateTime')).toBe(
      '2025-06',
    )
    expect(screen.getByRole('link').getAttribute('href')).toBe(
      'https://example.com/credential',
    )
  })
  it('omits contact channels that have not been supplied', () => {
    render(<Contact profile={profile} />)
    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.queryByText('LinkedIn')).toBeNull()
    expect(screen.queryByText('Facebook')).toBeNull()
  })
  it('renders supplied social and telephone actions with the matching SVGs', () => {
    const { container } = render(
      <Contact
        profile={{
          ...profile,
          linkedin: 'https://www.linkedin.com/in/test-only',
          facebook: 'https://www.facebook.com/test-only',
          phone: '+84 123 456 789',
        }}
      />,
    )
    expect(
      screen
        .getByRole('link', { name: '+84 123 456 789' })
        .getAttribute('href'),
    ).toBe('tel:+84123456789')
    expect(
      screen.getByRole('link', { name: /LinkedIn/ }).getAttribute('href'),
    ).toBe('https://www.linkedin.com/in/test-only')
    expect(
      screen.getByRole('link', { name: /Facebook/ }).getAttribute('href'),
    ).toBe('https://www.facebook.com/test-only')
    expect(container.querySelectorAll('.contact-icon')).toHaveLength(5)
  })
  it('preserves the supplied logo asset and avoids inventing a study start year', () => {
    render(<Education entries={education} />)
    expect(
      screen.getByRole('img', { name: 'HCMUT logo' }).getAttribute('src'),
    ).toBe('/images/education/HCMCUT.svg')
    expect(screen.getByText('2027').getAttribute('dateTime')).toBe('2027')
    expect(screen.queryByText(/2023/)).toBeNull()
  })
})
