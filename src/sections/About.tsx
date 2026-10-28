import { education, profile } from '../data/portfolio'

export function About() {
  return (
    <section
      className="section container about-section"
      id="about"
      aria-labelledby="about-heading"
    >
      <div className="about-copy">
        <h2 id="about-heading">A little about me</h2>
        <p className="about-introduction">
          I’m Quyen, a developer based in {profile.location}.
        </p>
        <p>
          My work connects full-stack JavaScript, backend engineering, and AI
          integration. I’m interested in how applications handle data, expose
          clear APIs, and stay understandable through testing and debugging.
        </p>
        <p>
          Alongside my development work, I’m studying Computer Science at HCMUT,
          with graduation expected in 2027.
        </p>
      </div>
      <section
        className="education"
        id="education"
        aria-labelledby="education-heading"
      >
        <h2 id="education-heading">Education</h2>
        <span className="education-year">{education.graduation}</span>
        <p className="education-program">{education.program}</p>
        <p>
          {education.institution}
          <br />({education.abbreviation})
        </p>
        <p className="education-note">Expected graduation</p>
      </section>
    </section>
  )
}
