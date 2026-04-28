import type { CreateNodesContextV2 } from "@nx/devkit";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";

import { createNodesInternal } from "./plugin";

const workspaceRoot = join(process.cwd(), ".tmp-plugin-spec");

function createContext(): CreateNodesContextV2 {
  return {
    workspaceRoot,
    nxJsonConfiguration: {},
  } as CreateNodesContextV2;
}

function writePackageJson(relativePath: string, content: string): void {
  const filePath = join(workspaceRoot, relativePath);
  mkdirSync(join(filePath, ".."), { recursive: true });
  writeFileSync(filePath, content);
}

afterEach(() => {
  rmSync(workspaceRoot, { recursive: true, force: true });
});

describe("createNodesInternal", () => {
  it("creates inferred watch target for studio-manager apps with federation.devPort", () => {
    writePackageJson(
      "apps/applications/studio-manager/buyables/giftcard/package.json",
      JSON.stringify({ federation: { devPort: 4150 } }),
    );

    const result = createNodesInternal(
      "apps/applications/studio-manager/buyables/giftcard/package.json",
      {
        devTargetName: "dev:watch",
        watchDeps: false,
      },
      createContext(),
    );

    expect(result).toEqual({
      projects: {
        "apps/applications/studio-manager/buyables/giftcard": {
          targets: {
            "dev:watch": {
              executor: "@bsport/nx:dev",
              options: { watchDeps: false },
            },
          },
        },
      },
    });
  });

  it("ignores non studio-manager package.json files", () => {
    writePackageJson(
      "packages/utils/fetch/package.json",
      JSON.stringify({ federation: { devPort: 4100 } }),
    );

    const result = createNodesInternal(
      "packages/utils/fetch/package.json",
      {},
      createContext(),
    );

    expect(result).toEqual({});
  });

  it("ignores studio-manager apps without federation.devPort", () => {
    writePackageJson(
      "apps/applications/studio-manager/cdp/referral-program/package.json",
      JSON.stringify({ federation: {} }),
    );

    const result = createNodesInternal(
      "apps/applications/studio-manager/cdp/referral-program/package.json",
      {},
      createContext(),
    );

    expect(result).toEqual({});
  });
});
