import { ExternalLink } from '../components/ui/ExternalLink'
import { ContactIcon, type ContactKind } from '../components/ui/ContactIcon'
import type { Profile } from '../types/portfolio'

export function Contact({ profile }: { profile: Profile }) {
  const socials: { kind: ContactKind; label: string; href: string }[] = [
    { kind: 'github', label: 'Find me on GitHub', href: profile.github },
    ...(profile.linkedin
      ? [
          {
            kind: 'linkedin' as const,
            label: 'LinkedIn',
            href: profile.linkedin,
          },
        ]
      : []),
    ...(profile.facebook
      ? [
          {
            kind: 'facebook' as const,
            label: 'Facebook',
            href: profile.facebook,
          },
        ]
      : []),
  ]
  return (
    <section
      className="section container contact-section"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="contact-scene glass-surface">
        <div className="contact-copy" data-reveal>
          <h2 id="contact-heading">Let’s connect.</h2>
          <p>
            For a project conversation or an engineering opportunity, email is
            the best place to start.
          </p>
          <p className="contact-location">{profile.location}</p>
        </div>
        <div className="contact-links" data-reveal>
          <a
            className="contact-email contact-channel"
            aria-label={profile.email}
            href={`mailto:${profile.email}`}
          >
            <ContactIcon kind="email" />
            <span>
              <span className="contact-label">Email</span>
              <span>{profile.email}</span>
            </span>
            <span className="contact-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          {socials.map((social) => (
            <ExternalLink
              className="contact-channel"
              key={social.kind}
              href={social.href}
            >
              <ContactIcon kind={social.kind} />
              <span>{social.label}</span>
            </ExternalLink>
          ))}
          {profile.phone && (
            <a
              className="contact-channel"
              href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}
            >
              <ContactIcon kind="phone" />
              <span>{profile.phone}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
