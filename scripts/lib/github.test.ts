// @vitest-environment node
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import {
  CACHE_TTL_MS,
  mergeSnapshots,
  readSnapshot,
  emptySnapshot,
  parseGitHubResponse,
  parseSnapshot,
  repositoryName,
  syncRepositories,
  validateProjects,
} from './github.ts'
import { projects } from '../../src/data/portfolio.ts'
import type {
  GitHubRepositoryMetadata,
  GitHubSnapshot,
} from '../../src/types/portfolio.ts'

const repository = 'https://github.com/example/project'
const now = Date.parse('2026-10-28T08:00:00Z')
const apiResponse = {
  full_name: 'example/project',
  html_url: repository,
  private: false,
  description: 'A public project',
  language: 'TypeScript',
  stargazers_count: 3,
  forks_count: 1,
  updated_at: '2026-10-27T00:00:00Z',
}
const metadata = (fetchedAt: number): GitHubRepositoryMetadata =>
  parseGitHubResponse(
    apiResponse,
    repository,
    new Date(fetchedAt).toISOString(),
  )
const snapshot = (entry: GitHubRepositoryMetadata): GitHubSnapshot => ({
  version: 1,
  repositories: { [repository]: entry },
})
const baseOptions = () => ({
  repositories: [repository],
  cache: emptySnapshot(),
  fallback: emptySnapshot(),
  now,
  warn: vi.fn(),
})

function mockFetch(body: unknown, status = 200) {
  return vi
    .fn<typeof fetch>()
    .mockResolvedValue(new Response(JSON.stringify(body), { status }))
}

describe('GitHub metadata boundary', () => {
  it('accepts only configured public GitHub repository identities', () => {
    expect(repositoryName(repository)).toBe('example/project')
    expect(() =>
      repositoryName('https://github.com/example/project?token=secret'),
    ).toThrow()
    expect(() =>
      repositoryName('https://example.com/example/project'),
    ).toThrow()
    expect(() =>
      parseGitHubResponse(
        { ...apiResponse, private: true },
        repository,
        new Date(now).toISOString(),
      ),
    ).toThrow()
    expect(() =>
      parseGitHubResponse(
        { ...apiResponse, full_name: 'other/project' },
        repository,
        new Date(now).toISOString(),
      ),
    ).toThrow()
  })

  it.each([
    { stargazers_count: -1 },
    { forks_count: 1.5 },
    { updated_at: 'not-a-date' },
    { language: {} },
  ])('rejects malformed external metadata: %j', (invalid) => {
    expect(() =>
      parseGitHubResponse(
        { ...apiResponse, ...invalid },
        repository,
        new Date(now).toISOString(),
      ),
    ).toThrow()
  })

  it('drops unconfigured repositories when loading snapshots', () => {
    const entry = metadata(now)
    const result = parseSnapshot(
      {
        version: 1,
        repositories: {
          [repository]: entry,
          'https://github.com/other/repo': {},
        },
      },
      [repository],
    )
    expect(Object.keys(result.repositories)).toEqual([repository])
    expect(() =>
      parseSnapshot({ version: 2, repositories: {} }, [repository]),
    ).toThrow()
  })

  it('uses the newest valid metadata across cache and fallback', () => {
    const latest = metadata(now)
    const older = metadata(now - CACHE_TTL_MS)
    expect(
      mergeSnapshots(snapshot(latest), snapshot(older)).repositories[
        repository
      ],
    ).toEqual(latest)
    expect(
      mergeSnapshots(snapshot(older), snapshot(latest)).repositories[
        repository
      ],
    ).toEqual(latest)
  })

  it('handles missing and corrupt local snapshots without blocking editorial content', () => {
    const directory = mkdtempSync(join(tmpdir(), 'portfolio-github-test-'))
    const path = join(directory, 'snapshot.json')
    const warn = vi.fn()
    try {
      expect(readSnapshot(path, [repository], warn)).toEqual(emptySnapshot())
      expect(warn).not.toHaveBeenCalled()
      writeFileSync(path, '{invalid json')
      expect(readSnapshot(path, [repository], warn)).toEqual(emptySnapshot())
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('unavailable or invalid'),
      )
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('requires explicit curation and unique stable IDs', () => {
    expect(() => validateProjects(projects)).not.toThrow()
    const project = projects[0]!
    expect(() =>
      validateProjects([
        project,
        { ...project, repository: 'https://github.com/example/other' },
      ]),
    ).toThrow(/unique/)
    expect(() =>
      validateProjects([
        { ...project, featured: undefined } as unknown as typeof project,
      ]),
    ).toThrow(/featured/)
  })
})

describe('GitHub sync', () => {
  it('fetches and normalizes only the configured repository', async () => {
    const fetcher = mockFetch(apiResponse)
    const result = await syncRepositories({ ...baseOptions(), fetcher })
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(fetcher.mock.calls[0]?.[0]).toBe(
      'https://api.github.com/repos/example/project',
    )
    expect(result.repositories[repository]).toEqual(metadata(now))
  })

  it('reuses a fresh cache without making network requests', async () => {
    const fetcher = mockFetch(apiResponse)
    const cached = metadata(now - 1000)
    const result = await syncRepositories({
      ...baseOptions(),
      cache: snapshot(cached),
      fetcher,
    })
    expect(fetcher).not.toHaveBeenCalled()
    expect(result.repositories[repository]).toEqual(cached)
  })

  it('refreshes an expired cache and explicitly requested refreshes', async () => {
    const fetcher = mockFetch(apiResponse)
    await syncRepositories({
      ...baseOptions(),
      cache: snapshot(metadata(now - CACHE_TTL_MS)),
      fetcher,
    })
    await syncRepositories({
      ...baseOptions(),
      cache: snapshot(metadata(now)),
      fetcher,
      refresh: true,
    })
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('keeps stale metadata and warns on API rate limits', async () => {
    const options = baseOptions()
    const cached = metadata(now - 2 * CACHE_TTL_MS)
    const result = await syncRepositories({
      ...options,
      cache: snapshot(cached),
      fetcher: mockFetch({}, 403),
    })
    expect(result.repositories[repository]).toEqual(cached)
    expect(options.warn).toHaveBeenCalledWith(
      expect.stringContaining('HTTP 403'),
    )
  })

  it('uses the committed snapshot when offline', async () => {
    const previous = metadata(now - 2 * CACHE_TTL_MS)
    const result = await syncRepositories({
      ...baseOptions(),
      fallback: snapshot(previous),
      fetcher: vi
        .fn<typeof fetch>()
        .mockRejectedValue(new TypeError('Network unavailable')),
    })
    expect(result.repositories[repository]).toEqual(previous)
  })

  it('falls back to editorial-only rendering when no valid metadata exists', async () => {
    const options = baseOptions()
    const result = await syncRepositories({
      ...options,
      fetcher: mockFetch({ unexpected: true }),
    })
    expect(result).toEqual(emptySnapshot())
    expect(options.warn).toHaveBeenCalledWith(
      expect.stringContaining('editorial content only'),
    )
  })

  it('bounds a stalled request with an abort signal', async () => {
    const options = baseOptions()
    const fetcher = vi.fn<typeof fetch>(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => reject(new Error('Request timed out')),
            { once: true },
          )
        }),
    )
    const result = await syncRepositories({ ...options, fetcher, timeoutMs: 5 })
    expect(result).toEqual(emptySnapshot())
    expect(options.warn).toHaveBeenCalledWith(
      expect.stringContaining('timed out'),
    )
  })
})
