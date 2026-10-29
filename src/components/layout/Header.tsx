import type { NavigationItem, Profile } from '../../types/portfolio'
export function Header({
  profile,
  navigation,
}: {
  profile: Profile
  navigation: readonly NavigationItem[]
}) {
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
      <nav aria-label="Main navigation">
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={item.href === '#top' ? 'nav-current' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-connect glass-button" href="#contact">
        Let’s Connect <span aria-hidden="true">➜</span>
      </a>
    </header>
  )
}
