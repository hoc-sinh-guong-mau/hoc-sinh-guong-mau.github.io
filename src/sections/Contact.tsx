import { ExternalLink } from '../components/ui/ExternalLink'
import { profile } from '../data/portfolio'

export function Contact() {
  return (
    <section
      className="section container contact-section"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div>
        <h2 id="contact-heading">Let’s connect.</h2>
        <p>
          For a project conversation or an engineering opportunity,
          <br className="desktop-break" /> email is the best place to start.
        </p>
      </div>
      <div className="contact-links">
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <ExternalLink className="text-link" href={profile.github}>
          Find me on GitHub
        </ExternalLink>
      </div>
    </section>
  )
}
