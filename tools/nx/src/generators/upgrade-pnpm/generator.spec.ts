import { readJson } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { describe, expect, it } from "vitest";

import { upgradePnpmGenerator } from "./generator";

type RootPackageJson = {
  engines?: Record<string, string | undefined>;
  packageManager?: string;
};

function createWorkspaceTree() {
  const tree = createTreeWithEmptyWorkspace();

  tree.write(
    ".mise.toml",
    [
      "[tools]",
      'node = "24.13.0"',
      'pnpm = "10.11.0"',
      '"1password-cli" = "latest"',
      "",
    ].join("\n"),
  );

  tree.write(
    "package.json",
    JSON.stringify(
      {
        name: "@bsport/ichizen",
        version: "1.0.0",
        engines: {
          pnpm: "10.11.0",
        },
      },
      null,
      2,
    ),
  );

  return tree;
}

describe("upgradePnpmGenerator", () => {
  it("updates the repo pnpm pins", async () => {
    const tree = createWorkspaceTree();

    await upgradePnpmGenerator(tree, { version: "10.33.0" });

    expect(tree.read(".mise.toml", "utf-8")).toContain('pnpm = "10.33.0"');

    const packageJson = readJson<RootPackageJson>(tree, "package.json");
    expect(packageJson.packageManager).toBe("pnpm@10.33.0");
    expect(packageJson.engines?.pnpm).toBe("10.33.0");
  });

  it("updates packageManager when it already exists", async () => {
    const tree = createWorkspaceTree();

    tree.write(
      "package.json",
      JSON.stringify(
        {
          name: "@bsport/ichizen",
          version: "1.0.0",
          packageManager: "pnpm@10.11.0",
          engines: {
            pnpm: "10.11.0",
          },
        },
        null,
        2,
      ),
    );

    await upgradePnpmGenerator(tree, { version: "10.33.0" });

    const packageJson = readJson<RootPackageJson>(tree, "package.json");
    expect(packageJson.packageManager).toBe("pnpm@10.33.0");
    expect(packageJson.engines?.pnpm).toBe("10.33.0");
  });

  it("rejects prerelease versions", async () => {
    const tree = createWorkspaceTree();

    await expect(
      upgradePnpmGenerator(tree, { version: "11.0.0-rc.4" }),
    ).rejects.toThrow(/stable x\.y\.z version/);
  });

  it("rejects major bumps unless explicitly allowed", async () => {
    const tree = createWorkspaceTree();

    await expect(
      upgradePnpmGenerator(tree, { version: "11.0.0" }),
    ).rejects.toThrow(/Refusing to change pnpm major version/);
  });

  it("allows major bumps when allowMajor is true", async () => {
    const tree = createWorkspaceTree();

    await upgradePnpmGenerator(tree, {
      version: "11.0.0",
      allowMajor: true,
    });

    const packageJson = readJson<RootPackageJson>(tree, "package.json");
    expect(tree.read(".mise.toml", "utf-8")).toContain('pnpm = "11.0.0"');
    expect(packageJson.packageManager).toBe("pnpm@11.0.0");
    expect(packageJson.engines?.pnpm).toBe("11.0.0");
  });
});
