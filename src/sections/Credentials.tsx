import { ExternalLink } from '../components/ui/ExternalLink'
import type { Credential } from '../types/portfolio'

export function Credentials({ entries }: { entries: readonly Credential[] }) {
  return (
    <section
      className="section container"
      id="credentials"
      aria-labelledby="credentials-heading"
    >
      <div className="section-heading" data-reveal>
        <div>
          <h2 id="credentials-heading">Certificates & awards</h2>
        </div>
      </div>
      {entries.length ? (
        <div className="credential-grid">
          {entries.map((entry) => (
            <div
              className="credential-card glass-surface"
              key={entry.id}
              data-reveal
            >
              <p className="credential-kind">{entry.kind}</p>
              <h3>{entry.title}</h3>
              <p>{entry.issuer}</p>
              <time dateTime={entry.date}>{entry.dateLabel}</time>
              {entry.verificationUrl && (
                <ExternalLink
                  className="text-link"
                  href={entry.verificationUrl}
                >
                  Verify credential{' '}
                  <span className="sr-only">{entry.title}</span>
                </ExternalLink>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="credential-empty" data-reveal>
          No certificates or awards published here yet.
        </p>
      )}
    </section>
  )
}
