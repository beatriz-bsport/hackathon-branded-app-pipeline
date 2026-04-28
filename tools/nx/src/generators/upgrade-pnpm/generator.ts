import { Tree, formatFiles, logger, readJson, updateJson } from "@nx/devkit";

type UpgradePnpmSchema = {
  version: string;
  allowMajor?: boolean;
};

type RootPackageJson = {
  engines?: Record<string, string | undefined>;
  packageManager?: string;
  [key: string]: unknown;
};

type ParsedVersion = {
  raw: string;
  major: number;
  minor: number;
  patch: number;
};

const STABLE_SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;

function parseStableVersion(version: string): ParsedVersion {
  const trimmed = version.trim();
  const match = STABLE_SEMVER.exec(trimmed);

  if (match === null) {
    throw new Error(
      `Invalid pnpm version \"${version}\". Use a stable x.y.z version (for example 10.33.0).`,
    );
  }

  return {
    raw: trimmed,
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function readRequiredTextFile(tree: Tree, path: string): string {
  const content = tree.read(path, "utf-8");

  if (content === null) {
    throw new Error(`Expected ${path} to exist.`);
  }

  return content;
}

function replaceRequired(
  tree: Tree,
  path: string,
  matcher: RegExp,
  replacement: string,
): void {
  const content = readRequiredTextFile(tree, path);

  if (!matcher.test(content)) {
    throw new Error(
      `Could not find the expected pnpm version marker in ${path}.`,
    );
  }

  tree.write(path, content.replace(matcher, replacement));
}

function readCurrentPinnedVersion(tree: Tree): ParsedVersion {
  const packageJson = readJson<RootPackageJson>(tree, "package.json");
  const currentVersion = packageJson.engines?.pnpm;

  if (typeof currentVersion !== "string") {
    throw new Error(
      "Expected package.json to define engines.pnpm before running upgrade-pnpm.",
    );
  }

  return parseStableVersion(currentVersion);
}

export async function upgradePnpmGenerator(
  tree: Tree,
  schema: UpgradePnpmSchema,
): Promise<void> {
  const nextVersion = parseStableVersion(schema.version);
  const currentVersion = readCurrentPinnedVersion(tree);

  if (!schema.allowMajor && nextVersion.major !== currentVersion.major) {
    throw new Error(
      `Refusing to change pnpm major version from ${currentVersion.raw} to ${nextVersion.raw}. ` +
        "Major upgrades may require additional repo changes. Re-run with --allowMajor if you have reviewed compatibility.",
    );
  }

  replaceRequired(
    tree,
    ".npmrc",
    /^pnpm_version=.*$/m,
    `pnpm_version=${nextVersion.raw}`,
  );
  replaceRequired(
    tree,
    ".mise.toml",
    /^pnpm\s*=\s*"[^"]+"$/m,
    `pnpm = "${nextVersion.raw}"`,
  );

  updateJson(tree, "package.json", (json: RootPackageJson) => {
    json.engines ??= {};
    json.engines.pnpm = nextVersion.raw;

    if (json.packageManager !== undefined) {
      if (
        typeof json.packageManager !== "string" ||
        !json.packageManager.startsWith("pnpm@")
      ) {
        throw new Error(
          `Expected packageManager to start with \"pnpm@\", got \"${String(json.packageManager)}\".`,
        );
      }

      json.packageManager = `pnpm@${nextVersion.raw}`;
    }

    return json;
  });

  await formatFiles(tree);

  if (currentVersion.raw === nextVersion.raw) {
    logger.info(
      `pnpm is already pinned to ${nextVersion.raw}. Verified version markers.`,
    );
  } else {
    logger.info(
      `Pinned pnpm from ${currentVersion.raw} to ${nextVersion.raw} in .npmrc, .mise.toml, and package.json.`,
    );
  }

  logger.warn(
    "This generator does not rewrite pnpm-lock.yaml automatically. After review, run `mise install`, then `pnpm install --frozen-lockfile --prefer-offline` and `pnpm dedupe --check`. If dedupe check fails, run `pnpm dedupe` and commit the lockfile changes.",
  );
}

export default upgradePnpmGenerator;
