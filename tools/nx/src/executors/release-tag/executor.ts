import { type ExecutorContext, output, workspaceRoot } from "@nx/devkit";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { ReleaseClient } from "nx/release";

import type { ReleaseTagExecutorSchema } from "./schema";

const execFileAsync = promisify(execFile);
const releaseTagPattern = "v{version}";

type ReleaseVersionResult = Awaited<
  ReturnType<ReleaseClient["releaseVersion"]>
>;
type ReleaseClientMethods = Pick<
  ReleaseClient,
  "releaseVersion" | "releaseChangelog"
>;

type GitRunner = (args: string[]) => Promise<string>;

type ExecutorDependencies = {
  createReleaseClient: (allowDiskFallback: boolean) => ReleaseClientMethods;
  runGit: GitRunner;
};

function buildReleaseConfig(
  allowDiskFallback: boolean,
): ConstructorParameters<typeof ReleaseClient>[0] {
  return {
    projects: ["*"],
    projectsRelationship: "fixed",
    releaseTagPattern,
    releaseTagPatternCheckAllBranchesWhen: true,
    releaseTagPatternRequireSemver: true,
    changelog: {
      workspaceChangelog: {
        file: false,
        createRelease: "gitlab",
      },
      projectChangelogs: false,
    },
    version: {
      conventionalCommits: true,
      versionActions: "./tools/nx/src/release/tag-version-actions.ts",
      fallbackCurrentVersionResolver: allowDiskFallback ? "disk" : undefined,
    },
    git: {
      commit: false,
      stageChanges: false,
      tag: false,
      push: true,
    },
  };
}

async function runGit(args: string[]) {
  const result = await execFileAsync("git", args, {
    cwd: workspaceRoot,
    encoding: "utf8",
  });

  return result.stdout.trim();
}

async function fetchTags(runGitCommand: GitRunner, remote: string) {
  await runGitCommand(["fetch", remote, "--tags", "--force"]);
}

async function hasExistingReleaseTags(runGitCommand: GitRunner) {
  const tags = await runGitCommand(["tag", "--list", "v*"]);

  return tags
    .split("\n")
    .map((tag) => tag.trim())
    .some((tag) => /^v\d+\.\d+\.\d+$/.test(tag));
}

async function resolveHeadCommit(runGitCommand: GitRunner) {
  return await runGitCommand(["rev-parse", "HEAD"]);
}

async function resolveTagCommit(runGitCommand: GitRunner, tagName: string) {
  try {
    return await runGitCommand(["rev-list", "-n", "1", tagName]);
  } catch {
    return null;
  }
}

async function createAnnotatedTag(runGitCommand: GitRunner, tagName: string) {
  await runGitCommand(["tag", "--annotate", tagName, "--message", tagName]);
}

async function pushTag(
  runGitCommand: GitRunner,
  remote: string,
  tagName: string,
) {
  await runGitCommand(["push", remote, `refs/tags/${tagName}`]);
}

async function deleteLocalTag(runGitCommand: GitRunner, tagName: string) {
  await runGitCommand(["tag", "--delete", tagName]);
}

function parseRemoteTagCommit(output: string) {
  if (!output) {
    return null;
  }

  const refs = output
    .split("\n")
    .map((line) => {
      const [commit, ref] = line.trim().split(/\s+/);

      if (!commit || !ref) {
        return null;
      }

      return { commit, ref };
    })
    .filter((entry) => entry !== null);

  return (
    refs.find(({ ref }) => ref.endsWith("^{}"))?.commit ??
    refs.at(0)?.commit ??
    null
  );
}

async function resolveRemoteTagCommit(
  runGitCommand: GitRunner,
  remote: string,
  tagName: string,
) {
  const output = await runGitCommand([
    "ls-remote",
    "--tags",
    remote,
    `refs/tags/${tagName}`,
    `refs/tags/${tagName}^{}`,
  ]);

  return parseRemoteTagCommit(output);
}

async function cleanupLocalTagAfterPushFailure(
  runGitCommand: GitRunner,
  tagName: string,
) {
  try {
    await deleteLocalTag(runGitCommand, tagName);
  } catch (cleanupError) {
    output.warn({
      title: `Failed to delete local release tag ${tagName}`,
      bodyLines: [
        cleanupError instanceof Error
          ? cleanupError.message
          : "Unknown git tag cleanup error.",
      ],
    });
  }
}

function resolveWorkspaceVersion(versionResult: ReleaseVersionResult) {
  if (versionResult.workspaceVersion === undefined) {
    throw new Error(
      "Expected a unified workspace version from Nx release, but none was returned.",
    );
  }

  return versionResult.workspaceVersion;
}

async function generateGitLabReleaseChangelog(
  releaseClient: ReleaseClientMethods,
  versionResult: ReleaseVersionResult,
  workspaceVersion: string,
  options: ReleaseTagExecutorSchema,
  remote: string,
) {
  const changelogResult = await releaseClient.releaseChangelog({
    dryRun: options.dryRun,
    version: workspaceVersion,
    versionData: versionResult.projectsVersionData,
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    gitPush: false,
    gitRemote: remote,
    deleteVersionPlans: false,
  });

  const workspaceChangelog = changelogResult.workspaceChangelog;

  if (!workspaceChangelog) {
    throw new Error(
      `Expected Nx to generate a workspace changelog for v${workspaceVersion}, but none was returned.`,
    );
  }

  return workspaceChangelog;
}

export function createReleaseTagExecutor({
  createReleaseClient,
  runGit,
}: ExecutorDependencies) {
  return async function runReleaseTag(
    options: ReleaseTagExecutorSchema,
  ): Promise<{ success: boolean }> {
    const remote = options.remote ?? "origin";

    await fetchTags(runGit, remote);

    const allowDiskFallback = !(await hasExistingReleaseTags(runGit));

    const releaseClient = createReleaseClient(allowDiskFallback);
    const versionResult = await releaseClient.releaseVersion({
      dryRun: false,
      stageChanges: false,
      gitCommit: false,
      gitTag: false,
      gitPush: false,
    });

    const workspaceVersion = resolveWorkspaceVersion(versionResult);

    if (workspaceVersion === null) {
      output.note({
        title: "No release tag created",
        bodyLines: [
          "Nx found no conventional-commit bump since the latest matching tag.",
        ],
      });

      return { success: true };
    }

    const tagName = `v${workspaceVersion}`;
    const headCommit = await resolveHeadCommit(runGit);
    const existingTagCommit = await resolveTagCommit(runGit, tagName);

    if (existingTagCommit) {
      if (existingTagCommit !== headCommit) {
        throw new Error(
          `Tag ${tagName} already exists on ${existingTagCommit}, not on HEAD ${headCommit}.`,
        );
      }

      output.note({
        title: `Release tag ${tagName} already exists`,
        bodyLines: [
          "Skipping tag creation because this commit is already tagged.",
          "Ensuring the GitLab Release is created or updated.",
        ],
      });

      await generateGitLabReleaseChangelog(
        releaseClient,
        versionResult,
        workspaceVersion,
        options,
        remote,
      );

      return { success: true };
    }

    await generateGitLabReleaseChangelog(
      releaseClient,
      versionResult,
      workspaceVersion,
      options,
      remote,
    );

    if (options.dryRun) {
      output.note({
        title: "Dry run",
        bodyLines: [
          `Nx resolved the next unified release tag as ${tagName}.`,
          `No tag was created, pushed to ${remote}, or published as a GitLab Release.`,
        ],
      });

      return { success: true };
    }

    await createAnnotatedTag(runGit, tagName);

    try {
      await pushTag(runGit, remote, tagName);
    } catch (error) {
      await fetchTags(runGit, remote);

      let tagCommitAfterRetry = null;

      try {
        tagCommitAfterRetry = await resolveRemoteTagCommit(
          runGit,
          remote,
          tagName,
        );
      } catch (remoteTagError) {
        output.warn({
          title: `Failed to verify remote release tag ${tagName}`,
          bodyLines: [
            remoteTagError instanceof Error
              ? remoteTagError.message
              : "Unknown git ls-remote error.",
          ],
        });
      }

      if (tagCommitAfterRetry === headCommit) {
        output.note({
          title: `Release tag ${tagName} was pushed concurrently`,
          bodyLines: [
            "Another runner pushed the same tag to the current commit first. Treating this run as successful.",
            "Ensuring the GitLab Release is created or updated.",
          ],
        });

        return { success: true };
      }

      await cleanupLocalTagAfterPushFailure(runGit, tagName);

      throw error;
    }

    output.success({
      title: `Created release tag ${tagName}`,
      bodyLines: [`Pushed annotated tag ${tagName} to ${remote}.`],
    });

    return { success: true };
  };
}

export default async function runExecutor(
  options: ReleaseTagExecutorSchema,
  _context: ExecutorContext,
): Promise<{ success: boolean }> {
  const executor = createReleaseTagExecutor({
    createReleaseClient: (allowDiskFallback) =>
      new ReleaseClient(buildReleaseConfig(allowDiskFallback)),
    runGit,
  });

  return await executor(options);
}
