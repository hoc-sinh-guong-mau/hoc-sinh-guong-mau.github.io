import { profile } from '../data/portfolio'

export function Hero() {
  const [leadingName, ...remainingNames] = profile.name.split(' ')
  return (
    <section className="hero container" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="location">
          <span className="location-mark" aria-hidden="true" />
          {profile.location}
        </p>
        <h1 id="hero-heading">
          {leadingName}
          <br />
          {remainingNames.join(' ')}
          <span className="name-period">.</span>
        </h1>
        <p className="hero-role">
          {profile.role}
          <br />
          <span>{profile.focus}</span>
        </p>
        <p className="hero-introduction">{profile.introduction}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#work">
            View projects <span aria-hidden="true">↓</span>
          </a>
          <a
            className="button button-secondary"
            href={`mailto:${profile.email}`}
          >
            Email me
          </a>
        </div>
      </div>
      <figure className="system-figure">
        <div className="system-title">
          <span className="system-symbol" aria-hidden="true">
            {'{ }'}
          </span>
          <span>Language into structure</span>
        </div>
        <div className="system-flow">
          <div className="system-node">
            <span>Input</span>
            <strong>A course question</strong>
          </div>
          <div className="flow-connector" aria-hidden="true" />
          <div className="system-node system-node-primary">
            <span>Interpretation</span>
            <strong>Grammar & semantic rules</strong>
            <p>NLTK parsing and intent recognition</p>
          </div>
          <div className="flow-connector" aria-hidden="true" />
          <div className="system-node">
            <span>Retrieval</span>
            <strong>SQLite query</strong>
          </div>
          <div className="flow-connector" aria-hidden="true" />
          <div className="system-output">
            <span aria-hidden="true">↳</span>
            <strong>A template-based answer</strong>
          </div>
        </div>
        <figcaption>
          A simplified view inside{' '}
          <a href="#course-assistant">NLP Course Assistant</a>.
        </figcaption>
      </figure>
      <div className="hero-context">
        <p>
          <span>Currently</span>Freelance development at Dong Da
        </p>
        <p>
          <span>Studying</span>Computer Science at HCMUT
        </p>
      </div>
    </section>
  )
}
