import { readFileSync } from 'node:fs'
import type {
  GitHubRepositoryMetadata,
  GitHubSnapshot,
  Project,
} from '../../src/types/portfolio.ts'

export const CACHE_TTL_MS = 60 * 60 * 1000
export const emptySnapshot = (): GitHubSnapshot => ({
  version: 1,
  repositories: {},
})

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validDate(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T/.test(value) &&
    Number.isFinite(Date.parse(value))
  )
}

function nullableText(value: unknown, max: number): value is string | null {
  return value === null || (typeof value === 'string' && value.length <= max)
}

export function repositoryName(url: string): string {
  const match =
    /^https:\/\/github\.com\/([a-zA-Z0-9][a-zA-Z0-9-]{0,38})\/([a-zA-Z0-9_.-]{1,100})$/.exec(
      url,
    )
  if (!match)
    throw new Error(
      'Repository URLs must be public github.com owner/repository URLs',
    )
  return `${match[1]}/${match[2]}`
}

export function validateProjects(projects: readonly Project[]): void {
  const ids = new Set<string>()
  const repositories = new Set<string>()
  for (const project of projects) {
    repositoryName(project.repository)
    if (!/^[a-z][a-z0-9-]*$/.test(project.id) || ids.has(project.id))
      throw new Error('Project IDs must be unique anchor-safe strings')
    if (repositories.has(project.repository))
      throw new Error('Project repositories must be unique')
    if (
      !project.name.trim() ||
      !project.description.trim() ||
      typeof project.featured !== 'boolean'
    )
      throw new Error(
        'Projects need a name, description, and explicit featured flag',
      )
    ids.add(project.id)
    repositories.add(project.repository)
  }
}

function nonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

export function validateMetadata(
  value: unknown,
  repository: string,
): GitHubRepositoryMetadata {
  if (
    !record(value) ||
    value.repository !== repository ||
    !nullableText(value.description, 4096) ||
    !nullableText(value.language, 100) ||
    !nonNegativeInteger(value.stars) ||
    !nonNegativeInteger(value.forks) ||
    !validDate(value.updatedAt) ||
    !validDate(value.fetchedAt)
  ) {
    throw new Error('Invalid GitHub repository metadata')
  }
  return {
    repository,
    description: value.description,
    language: value.language,
    stars: value.stars,
    forks: value.forks,
    updatedAt: value.updatedAt,
    fetchedAt: value.fetchedAt,
  }
}

export function parseGitHubResponse(
  value: unknown,
  repository: string,
  fetchedAt: string,
): GitHubRepositoryMetadata {
  if (
    !record(value) ||
    value.private !== false ||
    value.full_name !== repositoryName(repository) ||
    value.html_url !== repository
  )
    throw new Error(
      'GitHub response does not match the configured public repository',
    )
  return validateMetadata(
    {
      repository,
      description: value.description,
      language: value.language,
      stars: value.stargazers_count,
      forks: value.forks_count,
      updatedAt: value.updated_at,
      fetchedAt,
    },
    repository,
  )
}

export function parseSnapshot(
  value: unknown,
  repositories: readonly string[],
): GitHubSnapshot {
  if (!record(value) || value.version !== 1 || !record(value.repositories))
    throw new Error('Invalid GitHub snapshot')
  const parsed = emptySnapshot()
  for (const repository of repositories) {
    const entry = value.repositories[repository]
    if (entry !== undefined)
      parsed.repositories[repository] = validateMetadata(entry, repository)
  }
  return parsed
}

export function mergeSnapshots(
  fallback: GitHubSnapshot,
  cache: GitHubSnapshot,
): GitHubSnapshot {
  const repositories = { ...fallback.repositories }
  for (const [url, metadata] of Object.entries(cache.repositories)) {
    const previous = repositories[url]
    if (
      !previous ||
      Date.parse(metadata.fetchedAt) >= Date.parse(previous.fetchedAt)
    )
      repositories[url] = metadata
  }
  return { version: 1, repositories }
}

export function readSnapshot(
  path: string,
  repositories: readonly string[],
  warn: (message: string) => void,
): GitHubSnapshot {
  try {
    const data: unknown = JSON.parse(readFileSync(path, 'utf8'))
    return parseSnapshot(data, repositories)
  } catch (error) {
    if (!(record(error) && error.code === 'ENOENT'))
      warn(`GitHub snapshot unavailable or invalid: ${path}`)
    return emptySnapshot()
  }
}

interface SyncOptions {
  repositories: readonly string[]
  cache: GitHubSnapshot
  fallback: GitHubSnapshot
  fetcher?: typeof fetch
  now?: number
  timeoutMs?: number
  refresh?: boolean
  warn: (message: string) => void
}

export async function syncRepositories({
  repositories,
  cache,
  fallback,
  fetcher = fetch,
  now = Date.now(),
  timeoutMs = 5000,
  refresh = false,
  warn,
}: SyncOptions): Promise<GitHubSnapshot> {
  const result = emptySnapshot()
  const previousMetadata = mergeSnapshots(fallback, cache).repositories
  const uniqueRepositories = [...new Set(repositories)]
  for (const url of uniqueRepositories) repositoryName(url)
  // Keep public API traffic bounded even as the curated collection grows.
  for (let offset = 0; offset < uniqueRepositories.length; offset += 3) {
    await Promise.all(
      uniqueRepositories.slice(offset, offset + 3).map(async (repository) => {
        const previous = previousMetadata[repository]
        const age = previous ? now - Date.parse(previous.fetchedAt) : Infinity
        if (!refresh && previous && age >= 0 && age < CACHE_TTL_MS) {
          result.repositories[repository] = previous
          return
        }
        try {
          const response = await fetcher(
            `https://api.github.com/repos/${repositoryName(repository)}`,
            {
              headers: {
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
              },
              signal: AbortSignal.timeout(timeoutMs),
            },
          )
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          const body: unknown = await response.json()
          result.repositories[repository] = parseGitHubResponse(
            body,
            repository,
            new Date(now).toISOString(),
          )
        } catch (error) {
          const reason =
            error instanceof Error ? error.message : 'Request failed'
          warn(
            `GitHub metadata for ${repositoryName(repository)}: ${reason}. Using ${previous ? 'the last valid snapshot' : 'editorial content only'}.`,
          )
          if (previous) result.repositories[repository] = previous
        }
      }),
    )
  }
  const ordered = emptySnapshot()
  for (const repository of uniqueRepositories) {
    const entry = result.repositories[repository]
    if (entry) ordered.repositories[repository] = entry
  }
  return ordered
}
