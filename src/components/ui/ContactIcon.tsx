export type ContactKind = 'github' | 'facebook' | 'linkedin' | 'email' | 'phone'

/** Locally hosted upstream SVGs; visible link text supplies the accessible name. */
export function ContactIcon({ kind }: { kind: ContactKind }) {
  return (
    <span
      className="contact-icon"
      aria-hidden="true"
      style={{ maskImage: `url(/contact/${kind}.svg)` }}
    />
  )
}
