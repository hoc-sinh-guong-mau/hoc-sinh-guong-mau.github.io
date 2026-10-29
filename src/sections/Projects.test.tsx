import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Projects } from './Projects'
import { projects } from '../data/portfolio'
import type { Project } from '../types/portfolio'

const project: Project = {
  id: 'new-project',
  featured: true,
  name: 'Another public project',
  category: 'Backend',
  description: 'Editorial description stays authoritative.',
  approach: 'A documented technical approach.',
  technologies: ['TypeScript'],
  repository: 'https://github.com/example/project',
}

describe('Data-driven projects', () => {
  it('shows a role and demo only when explicitly supplied', () => {
    render(
      <Projects
        repositoryIndexUrl="https://github.com/example"
        items={[
          {
            ...project,
            role: 'Test-only contributor role',
            demo: 'https://example.com/demo',
          },
        ]}
        metadata={{}}
      />,
    )
    expect(screen.getByText('Role: Test-only contributor role')).toBeDefined()
    expect(
      screen.getByRole('link', { name: /Live demo/ }).getAttribute('href'),
    ).toBe('https://example.com/demo')
  })
  it('renders a new entry without changing the UI and works without metadata', () => {
    render(
      <Projects
        repositoryIndexUrl="https://github.com/example"
        items={[...projects, project]}
        metadata={{}}
      />,
    )
    expect(screen.getAllByRole('article')).toHaveLength(projects.length + 1)
    expect(screen.getByRole('heading', { name: project.name })).toBeDefined()
    const article = screen.getByRole('article', { name: project.name })
    expect(within(article).getByRole('link').getAttribute('href')).toBe(
      project.repository,
    )
    expect(article.textContent).toContain(project.description)
    expect(article.textContent).not.toContain('Source updated')
  })

  it('enriches approved content without replacing it with external descriptions', () => {
    render(
      <Projects
        repositoryIndexUrl="https://github.com/example"
        items={[project]}
        metadata={{
          [project.repository]: {
            repository: project.repository,
            description: 'External description',
            language: 'TypeScript',
            stars: 0,
            forks: 0,
            updatedAt: '2026-10-01T00:00:00Z',
            fetchedAt: '2026-10-28T00:00:00Z',
          },
        }}
      />,
    )
    const article = screen.getByRole('article', { name: project.name })
    expect(article.textContent).toContain(project.description)
    expect(article.textContent).not.toContain('External description')
    expect(article.textContent).toContain('Source updated Oct 2026')
  })

  it('keeps unfeatured projects hidden even when metadata is available', () => {
    render(
      <Projects
        repositoryIndexUrl="https://github.com/example"
        items={[{ ...project, featured: false }]}
        metadata={{}}
      />,
    )
    expect(screen.queryByRole('article')).toBeNull()
  })

  it('does not invent an empty featured section', () => {
    render(
      <Projects
        repositoryIndexUrl="https://github.com/example"
        items={[]}
        metadata={{}}
      />,
    )
    expect(screen.queryByRole('region', { name: 'Selected work' })).toBeNull()
  })
})
