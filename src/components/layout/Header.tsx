import { useRef } from 'react'
import type { NavigationItem, Profile } from '../../types/portfolio'
export function Header({
  profile,
  navigation,
}: {
  profile: Profile
  navigation: readonly NavigationItem[]
}) {
  const menu = useRef<HTMLDetailsElement>(null)
  const links = navigation.map((item) => (
    <a
      key={item.href}
      href={item.href}
      className={item.href === '#top' ? 'nav-current' : undefined}
    >
      {item.label}
    </a>
  ))
  return (
    <header className="cinematic-header" id="top">
      <a
        className="reference-wordmark"
        href="#top"
        aria-label={`${profile.name}, home`}
      >
        <svg viewBox="0 0 44 44" aria-hidden="true" fill="none">
          <path d="M3 8h24M15 8v24M16 20c0-8 6-13 13-13s13 5 13 13-6 13-13 13-13-5-13-13Z" />
          <path d="m28 25 12 12M7 20 19 8" />
        </svg>
      </a>
      <nav className="portfolio-navigation" aria-label="Main navigation">
        {links}
      </nav>
      <a className="header-connect glass-button" href="#contact">
        Let’s Connect <span aria-hidden="true">➜</span>
      </a>
      <details
        className="navigation-disclosure"
        ref={menu}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menu.current) {
            menu.current.open = false
            menu.current.querySelector('summary')?.focus()
          }
        }}
      >
        <summary>
          Sections{' '}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </summary>
        <nav
          aria-label="Mobile navigation"
          onClick={(event) => {
            if (event.target instanceof HTMLAnchorElement && menu.current)
              menu.current.open = false
          }}
        >
          {links}
        </nav>
      </details>
    </header>
  )
}
