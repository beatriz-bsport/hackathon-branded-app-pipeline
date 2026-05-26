import { describe, expect, it } from "vitest";

import {
  type FetchMergeRequestsForCommit,
  type GitRunner,
  createDotenvValues,
  createGitLabMergeRequestFetcher,
  createSyntheticIssueRefName,
  createSyntheticIssueRefs,
  extractIssueIdFromBranchName,
  extractIssueIdsFromText,
  resolveLinearReleaseIssueRefs,
  resolveLinearReleaseIssues,
  serializeDotenv,
} from "./linear-release-issues.mts";

function createGitRunner(
  commitMessages: Record<string, string>,
  commits = Object.keys(commitMessages),
): GitRunner {
  return (args) => {
    if (args[0] === "describe") {
      return "v1.0.0";
    }

    if (args[0] === "rev-list") {
      return commits.join("\n");
    }

    if (args[0] === "show" && typeof args[3] === "string") {
      return commitMessages[args[3]] ?? "";
    }

    throw new Error(`Unexpected git command: ${args.join(" ")}`);
  };
}

describe("linear release issue detection", () => {
  it("extracts issue ids from conventional commits, prose, and footers", () => {
    expect(
      extractIssueIdsFromText(`fix(sm-segment): [ce-3456] bad thing

feat(insights): embed frontend context for bookings AI summary BI-760
Refs BOO-2630`),
    ).toEqual(["CE-3456", "BI-760", "BOO-2630"]);
  });

  it("requires source branch names to start with the issue id", () => {
    expect(extractIssueIdFromBranchName("ce-3456-bad-thing")).toBe("CE-3456");
    expect(extractIssueIdFromBranchName("CE-3456")).toBe("CE-3456");
    expect(extractIssueIdFromBranchName("ce-3456_bad-thing")).toBe("CE-3456");
    expect(extractIssueIdFromBranchName("user/ce-3456-bad-thing")).toBeNull();
    expect(extractIssueIdFromBranchName("fix-ce-3456-bad-thing")).toBeNull();
  });

  it("falls back to merge request source branches only when the commit message has no issue id", async () => {
    const fetchedCommits: string[] = [];
    const fetchMergeRequestsForCommit: FetchMergeRequestsForCommit = async (
      commitSha,
    ) => {
      fetchedCommits.push(commitSha);

      return [{ source_branch: "boo-2630-branch-only" }];
    };

    await expect(
      resolveLinearReleaseIssues({
        tag: "v1.1.0",
        runGit: createGitRunner({
          "commit-with-message": "fix(sm-segment): [ce-3456] bad thing",
          "commit-with-branch": "chore: branch carries the issue id",
        }),
        fetchMergeRequestsForCommit,
      }),
    ).resolves.toEqual(["BOO-2630", "CE-3456"]);

    expect(fetchedCommits).toEqual(["commit-with-branch"]);
  });

  it("returns the base ref and issue refs used for synthetic branches", async () => {
    await expect(
      resolveLinearReleaseIssueRefs({
        tag: "v1.1.0",
        runGit: createGitRunner({
          abc1234: "fix: [ce-3456] first",
          def5678: "chore: branch carries the issue id",
        }),
        fetchMergeRequestsForCommit: async () => [
          { source_branch: "boo-2630-branch-only" },
        ],
      }),
    ).resolves.toMatchObject({
      issueIds: ["BOO-2630", "CE-3456"],
      previousReleaseTag: "v1.0.0",
      baseRef: "v1.0.0",
      commits: ["abc1234", "def5678"],
      issueRefs: [
        { issueId: "CE-3456", commitSha: "abc1234", source: "commit_message" },
        {
          issueId: "BOO-2630",
          commitSha: "def5678",
          source: "source_branch",
          sourceBranch: "boo-2630-branch-only",
        },
      ],
    });
  });

  it("deduplicates and sorts resolved issue ids", async () => {
    await expect(
      resolveLinearReleaseIssues({
        tag: "v1.1.0",
        runGit: createGitRunner({
          one: "fix: [ce-3456] first",
          two: "fix: CE-3456 duplicate and BOO-2630",
        }),
      }),
    ).resolves.toEqual(["BOO-2630", "CE-3456"]);
  });

  it("continues without branch ids when the GitLab API request fails", async () => {
    const warnings: string[] = [];
    const fetchMergeRequestsForCommit = createGitLabMergeRequestFetcher({
      env: {
        CI_API_V4_URL: "https://gitlab.example/api/v4",
        CI_PROJECT_ID: "123",
        CI_JOB_TOKEN: "job-token",
      },
      fetch: async () => {
        throw new Error("network unavailable");
      },
      logger: {
        warn: (message) => warnings.push(message),
      },
    });

    await expect(fetchMergeRequestsForCommit("abc123")).resolves.toEqual([]);
    expect(warnings[0]).toContain("network unavailable");
  });

  it("creates stable synthetic git refs for Linear issue ids", () => {
    expect(createSyntheticIssueRefName("boo-2630", "abcdef1234567890")).toBe(
      "refs/heads/linear-release-issues/BOO-2630/abcdef123456",
    );
  });

  it("creates each synthetic ref once", () => {
    const commands: string[][] = [];
    const logs: string[] = [];

    expect(
      createSyntheticIssueRefs(
        [
          {
            issueId: "BOO-2630",
            commitSha: "abcdef1234567890",
            source: "source_branch",
          },
          {
            issueId: "BOO-2630",
            commitSha: "abcdef1234567890",
            source: "source_branch",
          },
        ],
        (args) => {
          commands.push(args);
          return "";
        },
        {
          log: (message) => logs.push(message),
          warn: () => undefined,
        },
      ),
    ).toEqual(["refs/heads/linear-release-issues/BOO-2630/abcdef123456"]);
    expect(commands).toEqual([
      [
        "update-ref",
        "refs/heads/linear-release-issues/BOO-2630/abcdef123456",
        "abcdef1234567890",
      ],
    ]);
    expect(logs[0]).toContain("BOO-2630");
  });

  it("serializes dotenv output for GitLab artifacts", () => {
    expect(
      serializeDotenv(
        createDotenvValues(["BOO-2630"], {
          baseRef: "v1.0.0",
          syntheticRefs: ["refs/heads/linear-release-issues/BOO-2630/abcdef1"],
        }),
      ),
    ).toBe(
      "LINEAR_RELEASE_ISSUES_AVAILABLE=true\nLINEAR_RELEASE_ISSUES=BOO-2630\nLINEAR_RELEASE_BASE_REF_AVAILABLE=true\nLINEAR_RELEASE_BASE_REF=v1.0.0\nLINEAR_RELEASE_PREVIOUS_TAG=v1.0.0\nLINEAR_RELEASE_SYNTHETIC_REFS=refs/heads/linear-release-issues/BOO-2630/abcdef1\n",
    );
  });
});
