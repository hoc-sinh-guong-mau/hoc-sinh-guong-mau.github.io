import type { GitHubRepositoryMetadata } from '../types/portfolio'

// Validated at the build boundary, then embedded by Vite; never fetched by visitors.
declare const __GITHUB_REPOSITORIES__: Record<string, GitHubRepositoryMetadata>
export const githubRepositories = __GITHUB_REPOSITORIES__
