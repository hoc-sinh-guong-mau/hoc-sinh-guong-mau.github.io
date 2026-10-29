import type { HeroContent } from '../../types/portfolio'

function TechnologyIcon({ kind }: { kind: string }) {
  if (kind === 'brain')
    return (
      <svg viewBox="0 0 80 80" fill="none">
        <path d="M39 15c-8-13-21-5-20 5-12-1-17 12-10 20-8 8-2 21 9 20-1 13 13 18 21 9V15Zm3 0c8-13 21-5 20 5 12-1 17 12 10 20 8 8 2 21-9 20 1 13-13 18-21 9V15Z" />
        <path d="m21 23 8 7-5 12 8 8-5 13M59 23l-8 7 5 12-8 8 5 13M10 39l14 3m48-3-16 3" />
        {[
          [21, 23],
          [29, 30],
          [24, 42],
          [32, 50],
          [27, 63],
          [59, 23],
          [51, 30],
          [56, 42],
          [48, 50],
          [53, 63],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" />
        ))}
      </svg>
    )
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <path d="m16 3 12 7v12l-12 7-12-7V10L16 3Z" />
      {kind === 'AI' ? (
        <path d="m10 12 6-4 6 4v8l-6 4-6-4v-8Zm0 0 12 8m0-8-12 8" />
      ) : kind === 'Product' ? (
        <path d="m6 11 10 6 10-6M16 17v10M9 7l14 8" />
      ) : kind === 'Open Source' ? (
        <>
          <circle cx="16" cy="16" r="6" />
          <circle cx="16" cy="16" r="2" />
        </>
      ) : (
        <path d="m10 12 6-3 6 3v8l-6 3-6-3v-8Zm0 0 6 4 6-4m-6 4v7" />
      )}
    </svg>
  )
}

export function TechnologyPanels({ content }: { content: HeroContent }) {
  return (
    <div className="technology-panels" data-hero-panels aria-hidden="true">
      <div className="technology-main">
        <div className="glass-code glass-panel">
          <div className="code-tabs">
            <span className="code-tab-active">〈/〉 Code</span>
            <span>♧ AI</span>
            <span>◌ Deploy</span>
          </div>
          <div className="code-body">
            <ol>
              <li>
                <span className="code-purple">def</span>{' '}
                create_better_tomorrow():
              </li>
              <li>
                {' '}
                <span className="code-purple">return</span> {'{'}
              </li>
              <li>
                {' '}
                <span className="code-cyan">"ideas": "bigger",</span>
              </li>
              <li>
                {' '}
                <span className="code-cyan">"people": "happier",</span>
              </li>
              <li>
                {' '}
                <span className="code-cyan">"impact": "real"</span>
              </li>
              <li> {'}'}</li>
            </ol>
          </div>
        </div>
        <div className="glass-impact glass-panel">
          <TechnologyIcon kind="brain" />
          <p>
            {content.panelMessage.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>
      </div>
      <ul className="technology-stack">
        {content.technologies.map((item) => (
          <li className="glass-panel" key={item}>
            <TechnologyIcon kind={item} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
