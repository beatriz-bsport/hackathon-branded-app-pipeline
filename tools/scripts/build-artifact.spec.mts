import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(".");
const buildScript = path.join(repoRoot, "tools/scripts/build-artifact.sh");

type BuildRunOptions = {
  failSourcemapRemoval?: boolean;
  sentryReleaseExists?: boolean;
};

type BuildRun = {
  awsCalls: string[];
  pnpmCalls: string[];
  stderr: string;
  stdout: string;
  status: number | null;
};

function writeExecutable(filePath: string, contents: string) {
  writeFileSync(filePath, contents, { mode: 0o755 });
}

function readLines(filePath: string) {
  if (!existsSync(filePath)) {
    return [];
  }

  return readFileSync(filePath, "utf-8").trim().split("\n").filter(Boolean);
}

function writeFileWithParents(filePath: string, contents: string) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, contents);
}

function writeFakeBuildOutputs(fakeRepoRoot: string) {
  writeFileWithParents(
    path.join(fakeRepoRoot, "apps/applications/saas-legacy/VERSION"),
    "9.9.9",
  );
  writeFileWithParents(
    path.join(fakeRepoRoot, "apps/applications/saas-legacy/build/index.html"),
    "<html></html>",
  );
  writeFileWithParents(
    path.join(fakeRepoRoot, "apps/applications/saas-legacy/build/env.js"),
    "window.env = {};",
  );
  writeFileWithParents(
    path.join(fakeRepoRoot, "apps/applications/saas-legacy/build/static/js/main.js"),
    "console.log('main');",
  );
  writeFileWithParents(
    path.join(
      fakeRepoRoot,
      "apps/applications/saas-legacy/build/static/js/main.js.map",
    ),
    "{}",
  );
  writeFileWithParents(
    path.join(fakeRepoRoot, "apps/widgets/widget-proxy-bridge/dist/proxy.js"),
    "console.log('proxy');",
  );
  writeFileWithParents(
    path.join(
      fakeRepoRoot,
      "apps/applications/studio-manager/host/dist/index.html",
    ),
    "<html>__RELEASE_SHA_PLACEHOLDER__</html>",
  );
  writeFileWithParents(
    path.join(
      fakeRepoRoot,
      "apps/applications/studio-manager/navigation-sidebar/dist/remoteEntry.js",
    ),
    "console.log('navigation');",
  );
  writeFileWithParents(
    path.join(fakeRepoRoot, "apps/widgets/widget-debugger/src/html/index.html"),
    "<html>widget debugger</html>",
  );
  writeFileWithParents(
    path.join(fakeRepoRoot, "apps/widgets/widget-legacy/dist/widget.js"),
    "console.log('widget');",
  );
  writeFileWithParents(
    path.join(fakeRepoRoot, "apps/widgets/widget-legacy/dist/widget.js.map"),
    "{}",
  );
  writeFileWithParents(
    path.join(fakeRepoRoot, "apps/docs/dist/index.html"),
    "<html>docs</html>",
  );
  writeFileWithParents(
    path.join(fakeRepoRoot, "apps/docs/dist/static-routes.json"),
    '{"routes":[]}',
  );
  writeFileWithParents(
    path.join(
      fakeRepoRoot,
      "packages/design-system/kaizen/storybook/storybook-static/index.html",
    ),
    "<html>storybook</html>",
  );
}

function runBuild(options: BuildRunOptions = {}): BuildRun {
  const tmpDir = mkdtempSync(path.join(tmpdir(), "build-artifact-"));
  const fakeRepoRoot = path.join(tmpDir, "repo");
  const binDir = path.join(tmpDir, "bin");
  const logDir = path.join(tmpDir, "logs");
  mkdirSync(binDir, { recursive: true });
  mkdirSync(logDir, { recursive: true });
  mkdirSync(fakeRepoRoot, { recursive: true });
  writeFakeBuildOutputs(fakeRepoRoot);

  writeExecutable(
    path.join(binDir, "pnpm"),
    `#!/bin/sh
printf '%s\n' "pnpm $*" >> "$LOG_DIR/pnpm.log"

if [ "$1" = "exec" ] && [ "$2" = "nx" ] && [ "$3" = "show" ]; then
  printf '%s\n' '@bsport/saas-legacy'
  exit 0
fi

case "$*" in
  *"sentry-cli releases info"*)
    if [ "$SENTRY_RELEASE_EXISTS" = "true" ]; then
      exit 0
    fi
    exit 1
    ;;
esac

exit 0
`,
  );

  writeExecutable(
    path.join(binDir, "aws"),
    `#!/bin/sh
printf '%s\n' "aws $*" >> "$LOG_DIR/aws.log"

if [ "$1" = "s3" ] && [ "$2" = "rm" ] && [ "$FAIL_SOURCEMAP_REMOVAL" = "true" ]; then
  exit 64
fi

exit 0
`,
  );

  const result = spawnSync("bash", [buildScript], {
    cwd: fakeRepoRoot,
    encoding: "utf-8",
    env: {
      ...process.env,
      ARTIFACT_MODE: "release",
      ARTIFACT_VERSION: "v1.2.3",
      CI_COMMIT_BRANCH: "feature/test",
      CI_COMMIT_SHA: "abcdef1234567890",
      CI_COMMIT_SHORT_SHA: "abc1234",
      CI_PROJECT_PATH: "bsport/ichizen",
      FAIL_SOURCEMAP_REMOVAL: options.failSourcemapRemoval ? "true" : "false",
      LOG_DIR: logDir,
      PATH: `${binDir}:${process.env.PATH ?? ""}`,
      SENTRY_RELEASE_EXISTS: options.sentryReleaseExists ? "true" : "false",
    },
  });

  const buildRun = {
    awsCalls: readLines(path.join(logDir, "aws.log")),
    pnpmCalls: readLines(path.join(logDir, "pnpm.log")),
    stderr: result.stderr,
    stdout: result.stdout,
    status: result.status,
  };

  rmSync(tmpDir, { force: true, recursive: true });

  return buildRun;
}

describe("build artifact release publication", () => {
  it("uploads dedicated artifacts with build-time cache metadata and without sourcemaps", () => {
    const result = runBuild();

    expect(result.status).toBe(0);

    expect(result.awsCalls).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          "aws s3 sync build/backoffice/ s3://bsport-frontends-artifacts-euw3/backoffice/v1.2.3",
        ),
        expect.stringContaining(
          "aws s3 sync build/widget/ s3://bsport-frontends-artifacts-euw3/widget/v1.2.3",
        ),
        expect.stringContaining(
          "aws s3 sync build/kaizen-docs/ s3://bsport-frontends-artifacts-euw3/kaizen-docs/v1.2.3",
        ),
        expect.stringContaining(
          "aws s3 sync build/kaizen-storybook/ s3://bsport-frontends-artifacts-euw3/kaizen-storybook/v1.2.3",
        ),
      ]),
    );

    const syncCalls = result.awsCalls.filter((call) =>
      call.startsWith("aws s3 sync build/"),
    );
    expect(syncCalls).toHaveLength(4);
    for (const syncCall of syncCalls) {
      expect(syncCall).toContain("--cache-control max-age=31536000,public");
      expect(syncCall).toContain("--exclude *.map");
      expect(syncCall).toContain("--exclude *.map.*");
    }

    const widgetEntrypointUpload = result.awsCalls.find((call) =>
      call.includes("s3://bsport-frontends-artifacts-euw3/widget/v1.2.3/scripts/widget.js"),
    );
    expect(widgetEntrypointUpload).toContain(
      "--cache-control max-age=0,no-cache,no-store,must-revalidate",
    );
    expect(widgetEntrypointUpload).toContain("--content-type application/javascript");
    expect(result.awsCalls.some((call) => call.includes("metadata/backoffice"))).toBe(
      false,
    );
  });

  it("uploads sourcemaps even when the Sentry release already exists", () => {
    const result = runBuild({ sentryReleaseExists: true });

    expect(result.status).toBe(0);
    expect(
      result.pnpmCalls.some((call) => call.includes("sentry-cli releases new")),
    ).toBe(false);
    expect(
      result.pnpmCalls.some((call) => call.includes("upload-sourcemaps")),
    ).toBe(true);
    expect(result.stdout).toContain(
      "already exists; uploading sourcemaps again to make retries safe",
    );
  });

  it("fails when sourcemap removal from artifact storage fails", () => {
    const result = runBuild({ failSourcemapRemoval: true });

    expect(result.status).toBe(64);
  });
});
