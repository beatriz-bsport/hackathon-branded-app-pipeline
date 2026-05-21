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

export type ReleaseIssueSource = "commit_message" | "source_branch";

export type ResolvedReleaseIssueRef = {
  issueId: string;
  commitSha: string;
  source: ReleaseIssueSource;
  sourceBranch?: string;
};

export type ResolveLinearReleaseIssueRefsResult = {
  issueIds: string[];
  issueRefs: ResolvedReleaseIssueRef[];
  previousReleaseTag: string | null;
  baseRef: string | null;
  commits: string[];
};

type Logger = Pick<Console, "log" | "warn">;

type GitLabFetchOptions = {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
  logger?: Pick<Console, "warn">;
};

type ResolveLinearReleaseIssuesOptions = {
  tag: string;
  runGit?: GitRunner;
  fetchMergeRequestsForCommit?: FetchMergeRequestsForCommit;
};

type CreateDotenvValuesOptions = {
  baseRef?: string | null;
  syntheticRefs?: string[];
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

export async function resolveLinearReleaseIssueRefs({
  tag,
  runGit: runGitCommand = runGit,
  fetchMergeRequestsForCommit = createGitLabMergeRequestFetcher(),
}: ResolveLinearReleaseIssuesOptions): Promise<ResolveLinearReleaseIssueRefsResult> {
  validateReleaseTag(tag);

  const previousReleaseTag = getPreviousReleaseTag(tag, runGitCommand);
  const baseRef = previousReleaseTag;
  const commits = getReleaseCommits(tag, runGitCommand);
  const issueRefs: ResolvedReleaseIssueRef[] = [];
  const seenIssueRefs = new Set<string>();

  function addIssueRef(issueRef: ResolvedReleaseIssueRef): void {
    const key = `${issueRef.issueId}\0${issueRef.commitSha}\0${issueRef.source}`;

    if (seenIssueRefs.has(key)) {
      return;
    }

    seenIssueRefs.add(key);
    issueRefs.push(issueRef);
  }

  for (const commitSha of commits) {
    const message = getCommitMessage(commitSha, runGitCommand);
    const issueIdsFromMessage = extractIssueIdsFromText(message);

    for (const issueId of issueIdsFromMessage) {
      addIssueRef({ issueId, commitSha, source: "commit_message" });
    }

    if (issueIdsFromMessage.length > 0) {
      continue;
    }

    const mergeRequests = await fetchMergeRequestsForCommit(commitSha);

    for (const mergeRequest of mergeRequests) {
      if (typeof mergeRequest.source_branch !== "string") {
        continue;
      }

      const issueId = extractIssueIdFromBranchName(mergeRequest.source_branch);

      if (issueId) {
        addIssueRef({
          issueId,
          commitSha,
          source: "source_branch",
          sourceBranch: mergeRequest.source_branch,
        });
      }
    }
  }

  const issueIds = [...new Set(issueRefs.map(({ issueId }) => issueId))].sort();

  return {
    issueIds,
    issueRefs,
    previousReleaseTag,
    baseRef,
    commits,
  };
}

export async function resolveLinearReleaseIssues({
  tag,
  runGit: runGitCommand = runGit,
  fetchMergeRequestsForCommit = createGitLabMergeRequestFetcher(),
}: ResolveLinearReleaseIssuesOptions): Promise<string[]> {
  const { issueIds } = await resolveLinearReleaseIssueRefs({
    tag,
    runGit: runGitCommand,
    fetchMergeRequestsForCommit,
  });

  return issueIds;
}

export function createSyntheticIssueRefName(
  issueId: string,
  commitSha: string,
): string {
  const normalizedIssueId = issueId.toUpperCase();
  const shortSha = commitSha.slice(0, 12);

  return `refs/heads/linear-release-issues/${normalizedIssueId}/${shortSha}`;
}

export function createSyntheticIssueRefs(
  issueRefs: ResolvedReleaseIssueRef[],
  runGitCommand: GitRunner = runGit,
  logger: Logger = console,
): string[] {
  const createdRefs: string[] = [];
  const seenRefNames = new Set<string>();

  for (const issueRef of issueRefs) {
    const refName = createSyntheticIssueRefName(
      issueRef.issueId,
      issueRef.commitSha,
    );

    if (seenRefNames.has(refName)) {
      continue;
    }

    seenRefNames.add(refName);
    runGitCommand(["update-ref", refName, issueRef.commitSha]);
    createdRefs.push(refName);
    logger.log(
      `Created synthetic Linear issue ref ${refName} at ${issueRef.commitSha}`,
    );
  }

  return createdRefs;
}

export function createDotenvValues(
  issueIds: string[],
  { baseRef = null, syntheticRefs = [] }: CreateDotenvValuesOptions = {},
): DotenvValues {
  return {
    LINEAR_RELEASE_ISSUES_AVAILABLE: issueIds.length > 0 ? "true" : "false",
    LINEAR_RELEASE_ISSUES: issueIds.join(","),
    LINEAR_RELEASE_BASE_REF_AVAILABLE: baseRef ? "true" : "false",
    LINEAR_RELEASE_BASE_REF: baseRef ?? "",
    LINEAR_RELEASE_PREVIOUS_TAG: baseRef ?? "",
    LINEAR_RELEASE_SYNTHETIC_REFS: syntheticRefs.join(","),
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
