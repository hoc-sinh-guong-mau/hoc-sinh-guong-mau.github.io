import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Education } from './Education'
import { Experience } from './Experience'
import { Skills } from './Skills'
import { education, experience, skillGroups } from '../data/portfolio'

describe('Extensible portfolio content', () => {
  it('renders an additional experience entry from data', () => {
    render(
      <Experience
        entries={[
          ...experience,
          {
            id: 'example',
            company: 'Example company',
            role: 'Developer',
            start: '2024-01',
            end: '2024-05',
            startLabel: 'Jan 2024',
            endLabel: 'May 2024',
            description: 'A test-only experience entry.',
            technologies: ['TypeScript'],
          },
        ]}
      />,
    )
    expect(
      screen.getByRole('heading', { name: 'Example company' }),
    ).toBeDefined()
    expect(screen.getByText('A test-only experience entry.')).toBeDefined()
  })

  it('renders multiple education entries without component changes', () => {
    render(
      <Education
        entries={[
          ...education,
          {
            id: 'example',
            institution: 'Example university',
            abbreviation: 'EU',
            program: 'A test-only program',
            graduation: '2024',
            status: 'Completed',
          },
        ]}
      />,
    )
    expect(screen.getByText('Computer Science')).toBeDefined()
    expect(screen.getByText('A test-only program')).toBeDefined()
  })

  it('renders a newly configured skills group', () => {
    render(
      <Skills
        groups={[
          ...skillGroups,
          { title: 'Another focus', skills: ['A test-only skill'] },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Another focus' })).toBeDefined()
    expect(screen.getByText('A test-only skill')).toBeDefined()
  })
})
