import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type DotenvValues = Record<string, string>;

export type GitRunner = (args: string[]) => string;

export type GitLabMergeRequest = {
  source_branch?: unknown;
};

export type FetchMergeRequestsForCommit = (
  commitSha: string,
) => Promise<GitLabMergeRequest[]>;

type Logger = Pick<Console, "warn">;

type GitLabFetchOptions = {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  logger?: Logger;
};

type ResolveLinearReleaseIssuesOptions = {
  tag: string;
  runGit?: GitRunner;
  fetchMergeRequestsForCommit?: FetchMergeRequestsForCommit;
};

const releaseTagPattern = /^v[0-9]+\.[0-9]+\.[0-9]+$/;
const issueTokenPattern = /(?:^|[^a-z0-9-])([a-z]+-[0-9]+)(?=$|[^a-z0-9-])/gi;
const branchIssuePattern = /^([a-z]+-[0-9]+)(?=$|[-_])/i;

export function runGit(args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

export function validateReleaseTag(tag: string): void {
  if (!releaseTagPattern.test(tag)) {
    throw new Error(`Invalid release tag: ${tag}`);
  }
}

export function getPreviousReleaseTag(
  tagName: string,
  runGitCommand: GitRunner = runGit,
): string | null {
  try {
    return runGitCommand([
      "describe",
      "--tags",
      "--match",
      "v[0-9]*.[0-9]*.[0-9]*",
      "--abbrev=0",
      `${tagName}^`,
    ]);
  } catch {
    return null;
  }
}

export function getReleaseCommits(
  tagName: string,
  runGitCommand: GitRunner = runGit,
): string[] {
  const previousReleaseTag = getPreviousReleaseTag(tagName, runGitCommand);
  const range = previousReleaseTag
    ? `${previousReleaseTag}..${tagName}`
    : tagName;
  const output = runGitCommand(["rev-list", "--reverse", range]);

  return output ? output.split("\n") : [];
}

export function getCommitMessage(
  commitSha: string,
  runGitCommand: GitRunner = runGit,
): string {
  return runGitCommand(["show", "-s", "--format=%B", commitSha]);
}

export function extractIssueIdsFromText(text: string): string[] {
  return [...text.matchAll(issueTokenPattern)].map(([, issueId]) =>
    issueId.toUpperCase(),
  );
}

export function extractIssueIdFromBranchName(
  branchName: string,
): string | null {
  return branchIssuePattern.exec(branchName)?.[1]?.toUpperCase() ?? null;
}

export function resolveGitLabAuthHeaders(
  env: Record<string, string | undefined> = process.env,
): Record<string, string> | null {
  if (env.GITLAB_PRIVATE_TOKEN) {
    return { "PRIVATE-TOKEN": env.GITLAB_PRIVATE_TOKEN };
  }

  if (env.CI_JOB_TOKEN) {
    return { "JOB-TOKEN": env.CI_JOB_TOKEN };
  }

  return null;
}

export function createGitLabMergeRequestFetcher({
  env = process.env,
  fetch: fetchImplementation = fetch,
  logger = console,
}: GitLabFetchOptions = {}): FetchMergeRequestsForCommit {
  return async (commitSha) => {
    const apiUrl = env.CI_API_V4_URL;
    const projectId = env.CI_PROJECT_ID;
    const authHeaders = resolveGitLabAuthHeaders(env);

    if (!apiUrl || !projectId || !authHeaders) {
      return [];
    }

    const url = new URL(
      `${apiUrl}/projects/${encodeURIComponent(projectId)}/repository/commits/${commitSha}/merge_requests`,
    );
    url.searchParams.set("state", "merged");

    try {
      const response = await fetchImplementation(url, { headers: authHeaders });

      if (!response.ok) {
        logger.warn(
          `Could not fetch GitLab merge requests for ${commitSha}: ${response.status} ${response.statusText}`,
        );
        return [];
      }

      const mergeRequests = await response.json();

      return Array.isArray(mergeRequests) ? mergeRequests : [];
    } catch (error) {
      logger.warn(
        `Could not fetch GitLab merge requests for ${commitSha}: ${getErrorMessage(error)}`,
      );
      return [];
    }
  };
}

export async function extractIssueIdFromSourceBranch(
  commitSha: string,
  fetchMergeRequestsForCommit: FetchMergeRequestsForCommit = createGitLabMergeRequestFetcher(),
): Promise<string | null> {
  const mergeRequests = await fetchMergeRequestsForCommit(commitSha);

  for (const mergeRequest of mergeRequests) {
    if (typeof mergeRequest.source_branch !== "string") {
      continue;
    }

    const issueId = extractIssueIdFromBranchName(mergeRequest.source_branch);

    if (issueId) {
      return issueId;
    }
  }

  return null;
}

export async function resolveLinearReleaseIssues({
  tag,
  runGit: runGitCommand = runGit,
  fetchMergeRequestsForCommit = createGitLabMergeRequestFetcher(),
}: ResolveLinearReleaseIssuesOptions): Promise<string[]> {
  validateReleaseTag(tag);

  const issueIds = new Set<string>();
  const commits = getReleaseCommits(tag, runGitCommand);

  for (const commitSha of commits) {
    const message = getCommitMessage(commitSha, runGitCommand);
    const issueIdsFromMessage = extractIssueIdsFromText(message);

    for (const issueId of issueIdsFromMessage) {
      issueIds.add(issueId);
    }

    if (issueIdsFromMessage.length > 0) {
      continue;
    }

    const issueIdFromSourceBranch = await extractIssueIdFromSourceBranch(
      commitSha,
      fetchMergeRequestsForCommit,
    );

    if (issueIdFromSourceBranch) {
      issueIds.add(issueIdFromSourceBranch);
    }
  }

  return [...issueIds].sort();
}

export function createDotenvValues(issueIds: string[]): DotenvValues {
  return {
    LINEAR_RELEASE_ISSUES_AVAILABLE: issueIds.length > 0 ? "true" : "false",
    LINEAR_RELEASE_ISSUES: issueIds.join(","),
  };
}

export function serializeDotenv(values: DotenvValues): string {
  return `${Object.entries(values)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")}\n`;
}

export function writeDotenvFile(
  outputFile: string,
  values: DotenvValues,
): void {
  const resolvedOutputFile = resolve(outputFile);

  mkdirSync(dirname(resolvedOutputFile), { recursive: true });
  writeFileSync(resolvedOutputFile, serializeDotenv(values), "utf8");
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
