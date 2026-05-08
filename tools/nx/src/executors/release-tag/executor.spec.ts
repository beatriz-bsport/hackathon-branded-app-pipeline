import { beforeEach, describe, expect, it, vi } from "vitest";

import { createReleaseTagExecutor } from "./executor";

const releaseVersionMock = vi.fn();

function createGitRunner(commandOutputs: Record<string, string | Error>) {
  return vi.fn(async (args: string[]) => {
    const key = args.join(" ");
    const result = commandOutputs[key];

    if (result instanceof Error) {
      throw result;
    }

    return result ?? "";
  });
}

function createExecutor(commandOutputs: Record<string, string | Error>) {
  const runGit = createGitRunner(commandOutputs);
  const executor = createReleaseTagExecutor({
    createReleaseClient: (_allowDiskFallback) => {
      return {
        releaseVersion: releaseVersionMock,
      } as never;
    },
    runGit,
  });

  return {
    executor,
    runGit,
  };
}

describe("release-tag executor", () => {
  beforeEach(() => {
    releaseVersionMock.mockReset();
  });

  it("creates and pushes the next unified semver tag", async () => {
    releaseVersionMock.mockResolvedValue({
      workspaceVersion: "1.2.3",
      projectsVersionData: {},
    });

    const { executor, runGit } = createExecutor({
      "fetch origin --tags --force": "",
      "rev-parse HEAD": "abc123",
      "rev-list -n 1 v1.2.3": new Error("missing tag"),
      "tag --annotate v1.2.3 --message v1.2.3": "",
      "push origin refs/tags/v1.2.3": "",
    });

    await expect(executor({})).resolves.toEqual({
      success: true,
    });

    expect(releaseVersionMock).toHaveBeenCalledWith({
      dryRun: false,
      stageChanges: false,
      gitCommit: false,
      gitTag: false,
      gitPush: false,
    });
    expect(releaseVersionMock).toHaveBeenCalledTimes(1);
    expect(runGit).toHaveBeenCalledWith([
      "tag",
      "--annotate",
      "v1.2.3",
      "--message",
      "v1.2.3",
    ]);
    expect(runGit).toHaveBeenCalledWith([
      "push",
      "origin",
      "refs/tags/v1.2.3",
    ]);
  });

  it("errors when the next tag already exists on a different commit", async () => {
    releaseVersionMock.mockResolvedValue({
      workspaceVersion: "1.2.3",
      projectsVersionData: {},
    });

    const { executor } = createExecutor({
      "fetch origin --tags --force": "",
      "rev-parse HEAD": "abc123",
      "rev-list -n 1 v1.2.3": "def456",
    });

    await expect(executor({})).rejects.toThrow(
      "Tag v1.2.3 already exists on def456, not on HEAD abc123.",
    );
  });

  it("skips tag creation when no conventional-commit bump is found", async () => {
    releaseVersionMock.mockResolvedValue({
      workspaceVersion: null,
      projectsVersionData: {},
    });

    const { executor, runGit } = createExecutor({
      "fetch origin --tags --force": "",
    });

    await expect(executor({})).resolves.toEqual({
      success: true,
    });

    expect(runGit).toHaveBeenCalledTimes(2);
  });

  it("keeps reruns idempotent when the current commit already has the tag", async () => {
    releaseVersionMock.mockResolvedValue({
      workspaceVersion: "1.2.3",
      projectsVersionData: {},
    });

    const { executor, runGit } = createExecutor({
      "fetch origin --tags --force": "",
      "rev-parse HEAD": "abc123",
      "rev-list -n 1 v1.2.3": "abc123",
    });

    await expect(executor({})).resolves.toEqual({
      success: true,
    });

    expect(runGit).not.toHaveBeenCalledWith([
      "tag",
      "--annotate",
      "v1.2.3",
      "--message",
      "v1.2.3",
    ]);
  });

  it("supports a dry run without creating or pushing the tag", async () => {
    releaseVersionMock.mockResolvedValue({
      workspaceVersion: "1.2.3",
      projectsVersionData: {},
    });

    const { executor, runGit } = createExecutor({
      "fetch origin --tags --force": "",
      "rev-parse HEAD": "abc123",
      "rev-list -n 1 v1.2.3": new Error("missing tag"),
    });

    await expect(executor({ dryRun: true })).resolves.toEqual({
      success: true,
    });

    expect(runGit).not.toHaveBeenCalledWith([
      "tag",
      "--annotate",
      "v1.2.3",
      "--message",
      "v1.2.3",
    ]);
  });

  it("accepts a failed push only when the remote tag points to HEAD", async () => {
    releaseVersionMock.mockResolvedValue({
      workspaceVersion: "1.2.3",
      projectsVersionData: {},
    });

    const { executor, runGit } = createExecutor({
      "fetch origin --tags --force": "",
      "rev-parse HEAD": "abc123",
      "rev-list -n 1 v1.2.3": new Error("missing tag"),
      "tag --annotate v1.2.3 --message v1.2.3": "",
      "push origin refs/tags/v1.2.3": new Error("already exists"),
      "ls-remote --tags origin refs/tags/v1.2.3 refs/tags/v1.2.3^{}":
        "tag-object\trefs/tags/v1.2.3\nabc123\trefs/tags/v1.2.3^{}",
    });

    await expect(executor({})).resolves.toEqual({
      success: true,
    });

    expect(runGit).not.toHaveBeenCalledWith(["tag", "--delete", "v1.2.3"]);
  });

  it("removes the local tag when push fails without matching remote tag", async () => {
    releaseVersionMock.mockResolvedValue({
      workspaceVersion: "1.2.3",
      projectsVersionData: {},
    });

    const { executor, runGit } = createExecutor({
      "fetch origin --tags --force": "",
      "rev-parse HEAD": "abc123",
      "rev-list -n 1 v1.2.3": new Error("missing tag"),
      "tag --annotate v1.2.3 --message v1.2.3": "",
      "push origin refs/tags/v1.2.3": new Error("network error"),
      "ls-remote --tags origin refs/tags/v1.2.3 refs/tags/v1.2.3^{}": "",
      "tag --delete v1.2.3": "",
    });

    await expect(executor({})).rejects.toThrow("network error");

    expect(runGit).toHaveBeenCalledWith(["tag", "--delete", "v1.2.3"]);
  });

  it("keeps the push failure when remote tag verification also fails", async () => {
    releaseVersionMock.mockResolvedValue({
      workspaceVersion: "1.2.3",
      projectsVersionData: {},
    });

    const { executor, runGit } = createExecutor({
      "fetch origin --tags --force": "",
      "rev-parse HEAD": "abc123",
      "rev-list -n 1 v1.2.3": new Error("missing tag"),
      "tag --annotate v1.2.3 --message v1.2.3": "",
      "push origin refs/tags/v1.2.3": new Error("network error"),
      "ls-remote --tags origin refs/tags/v1.2.3 refs/tags/v1.2.3^{}":
        new Error("ls-remote failed"),
      "tag --delete v1.2.3": "",
    });

    await expect(executor({})).rejects.toThrow("network error");

    expect(runGit).toHaveBeenCalledWith(["tag", "--delete", "v1.2.3"]);
  });

  it("uses disk fallback only when no prior release tag exists", async () => {
    releaseVersionMock.mockResolvedValue({
      workspaceVersion: null,
      projectsVersionData: {},
    });

    const runGit = createGitRunner({
      "fetch origin --tags --force": "",
      "tag --list v*": "",
    });
    const createReleaseClient = vi.fn((_allowDiskFallback: boolean) => {
      return {
        releaseVersion: releaseVersionMock,
      } as never;
    });
    const executor = createReleaseTagExecutor({
      createReleaseClient,
      runGit,
    });

    await expect(executor({})).resolves.toEqual({ success: true });

    expect(createReleaseClient).toHaveBeenCalledWith(true);
  });

  it("disables disk fallback once release tags already exist", async () => {
    releaseVersionMock.mockResolvedValue({
      workspaceVersion: null,
      projectsVersionData: {},
    });

    const runGit = createGitRunner({
      "fetch origin --tags --force": "",
      "tag --list v*": "v1.2.3",
    });
    const createReleaseClient = vi.fn((_allowDiskFallback: boolean) => {
      return {
        releaseVersion: releaseVersionMock,
      } as never;
    });
    const executor = createReleaseTagExecutor({
      createReleaseClient,
      runGit,
    });

    await expect(executor({})).resolves.toEqual({ success: true });

    expect(createReleaseClient).toHaveBeenCalledWith(false);
  });
});
