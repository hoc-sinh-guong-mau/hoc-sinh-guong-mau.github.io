import type { NavigationItem, Profile } from '../../types/portfolio'

export function Header({
  profile,
  navigation,
}: {
  profile: Profile
  navigation: readonly NavigationItem[]
}) {
  return (
    <header className="site-header container" id="top">
      <a className="wordmark" href="#top" aria-label={`${profile.name}, home`}>
        <span className="monogram" aria-hidden="true">
          q.
        </span>
        <span>
          {profile.shortName}
          <span className="wordmark-detail"> / developer</span>
        </span>
      </a>
      <nav aria-label="Main navigation">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
