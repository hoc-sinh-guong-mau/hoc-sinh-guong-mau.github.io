import type { ReactNode } from 'react'

interface ExternalLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}{' '}
      <svg
        className="external-icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 18 18 6M6 6h12v12"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>{' '}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
