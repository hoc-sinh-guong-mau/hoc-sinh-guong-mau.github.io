import { useRef } from 'react'
import { useHeroAnimation } from '../hooks/useHeroAnimation'
import { HeroCharacter } from '../components/hero/HeroCharacter'
import { TechnologyPanels } from '../components/hero/TechnologyPanels'
import type { HeroContent, Profile } from '../types/portfolio'
import '../styles/Hero.css'

export function Hero({
  profile,
  content,
}: {
  profile: Profile
  content: HeroContent
}) {
  const ref = useRef<HTMLElement>(null)
  useHeroAnimation(ref)
  const [firstName, ...remainingNames] = profile.name.split(' ')
  const workspaceStyle = { backgroundImage: `url(${content.background})` }
  return (
    <section
      ref={ref}
      className="cinematic-hero"
      aria-labelledby="hero-heading"
    >
      <div
        className="hero-environment"
        data-hero-background
        aria-hidden="true"
        style={workspaceStyle}
      />
      <div className="hero-lighting" aria-hidden="true" />
      <HeroCharacter artwork={content.character} />
      <div
        className="hero-workspace-foreground"
        data-hero-background
        aria-hidden="true"
        style={workspaceStyle}
      />
      <div className="cinematic-copy" data-hero-copy>
        <p className="hero-greeting">
          <span aria-hidden="true" />
          {content.greeting}
        </p>
        <h1 id="hero-heading">
          {firstName}
          <br />
          {remainingNames.join(' ')}
        </h1>
        <p className="cinematic-role">{content.role}</p>
        <p className="cinematic-introduction">
          {content.introduction.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <div className="cinematic-actions">
          <a className="glass-button" href="#work">
            View My Work <span aria-hidden="true">⟶</span>
          </a>
          <a className="scroll-invitation" href="#work">
            Scroll to explore <span aria-hidden="true">↓</span>
          </a>
        </div>
        <dl className="cinematic-context">
          {content.context.map((item) => (
            <div key={item.label}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <TechnologyPanels content={content} />
      <div className="hero-bottom-edge" aria-hidden="true" />
    </section>
  )
}
