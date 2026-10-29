import type { EducationEntry } from '../types/portfolio'

export function Education({ entries }: { entries: readonly EducationEntry[] }) {
  return (
    <section
      className="section container"
      id="education"
      aria-labelledby="education-heading"
    >
      <div className="section-heading" data-reveal>
        <div>
          <h2 id="education-heading">Education</h2>
        </div>
      </div>
      <div className="education-list">
        {entries.map((entry) => (
          <div
            className="education-card glass-surface"
            key={entry.id}
            data-reveal
          >
            {entry.logo && (
              <div className="education-logo">
                <img
                  src={entry.logo.src}
                  width={entry.logo.width}
                  height={entry.logo.height}
                  alt={`${entry.abbreviation} logo`}
                  loading="lazy"
                />
              </div>
            )}
            <div className="education-copy">
              <p className="education-abbreviation">{entry.abbreviation}</p>
              <h3>{entry.institution}</h3>
              <p className="education-program">{entry.program}</p>
            </div>
            <div className="education-period">
              <p>{entry.status}</p>
              <span>
                {entry.startYear ? `${entry.startYear}–` : ''}
                <time dateTime={entry.graduation}>{entry.graduation}</time>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
