import type { AboutContent } from '../types/portfolio'

export function About({ content }: { content: AboutContent }) {
  return (
    <section
      className="section container about-section"
      id="about"
      aria-labelledby="about-heading"
    >
      <div className="about-copy" data-reveal>
        <h2 id="about-heading">{content.heading}</h2>
        <p className="about-introduction">{content.introduction}</p>
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="focus-list" aria-label="Engineering focus areas">
        {content.focusAreas.map((focus) => (
          <div className="focus-item" key={focus.title} data-reveal>
            <span className="focus-marker" aria-hidden="true" />
            <div>
              <h3>{focus.title}</h3>
              <p>{focus.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
