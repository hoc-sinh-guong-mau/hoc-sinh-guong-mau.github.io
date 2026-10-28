import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Architecture } from './Architecture'
import { architectureStages, projects } from '../data/portfolio'

describe('Architecture sequence', () => {
  it('keeps every verified stage reachable by keyboard without scrolling', async () => {
    const user = userEvent.setup()
    render(
      <Architecture
        stages={architectureStages}
        repository={projects[1]!.repository}
      />,
    )
    const answer = screen.getByRole('button', { name: '05 Answer' })
    answer.focus()
    await user.keyboard('{Enter}')
    expect(answer.getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByLabelText('Answer trace').textContent).toContain(
      '3 tín chỉ',
    )
    await user.click(screen.getByRole('button', { name: '03 Meaning' }))
    expect(screen.getByLabelText('Meaning trace').textContent).toContain(
      'GET_COURSE_INFO',
    )
    expect(answer.getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('region').getAttribute('data-pinned')).toBe('false')
  })
  it('omits an empty sequence', () => {
    const { container } = render(
      <Architecture stages={[]} repository={projects[1]!.repository} />,
    )
    expect(container.textContent).toBe('')
  })
})
