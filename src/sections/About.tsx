import type { AboutContent, EducationEntry } from '../types/portfolio'

export function About({
  content,
  education,
}: {
  content: AboutContent
  education: readonly EducationEntry[]
}) {
  return (
    <section
      className="section container about-section"
      id="about"
      aria-labelledby="about-heading"
    >
      <div className="about-copy">
        <h2 id="about-heading">{content.heading}</h2>
        <p className="about-introduction">{content.introduction}</p>
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {education.length > 0 ? (
        <section
          className="education"
          id="education"
          aria-labelledby="education-heading"
        >
          <h2 id="education-heading">Education</h2>
          {education.map((entry) => (
            <div className="education-entry" key={entry.id}>
              <span className="education-year">{entry.graduation}</span>
              <h3 className="education-program">{entry.program}</h3>
              <p>
                {entry.institution}
                <br />({entry.abbreviation})
              </p>
              <p className="education-note">{entry.status}</p>
            </div>
          ))}
        </section>
      ) : null}
    </section>
  )
}
