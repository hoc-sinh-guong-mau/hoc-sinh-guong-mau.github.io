import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroCharacter } from './HeroCharacter'
import { heroContent } from '../../data/portfolio'

describe('Character artwork layers', () => {
  it('renders a static character without pretending an arm rig exists', () => {
    const { container } = render(
      <HeroCharacter artwork={heroContent.character} />,
    )
    expect(container.querySelectorAll('img')).toHaveLength(1)
    expect(container.querySelector('[data-character-part="arm"]')).toBeNull()
    expect(screen.queryByRole('img')).toBeNull()
  })
  it('accepts registered arm and hand replacements with independent pivots', () => {
    const layer = {
      src: '/registered-part.png',
      width: 1312,
      height: 1199,
      pivot: '31% 59%',
    }
    const { container } = render(
      <HeroCharacter
        artwork={{
          ...heroContent.character,
          arm: layer,
          hand: { ...layer, pivot: '30% 42%' },
        }}
      />,
    )
    expect(container.querySelectorAll('img')).toHaveLength(3)
    expect(
      container.querySelector<HTMLElement>('[data-character-part="arm"]')?.style
        .transformOrigin,
    ).toBe('31% 59%')
    expect(
      container.querySelector<HTMLElement>('[data-character-part="hand"]')
        ?.style.transformOrigin,
    ).toBe('30% 42%')
  })
})
