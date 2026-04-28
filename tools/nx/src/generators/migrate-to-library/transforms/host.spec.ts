import { Tree, readJson } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { describe, expect, it } from "vitest";

import {
  transformHostModulesDts,
  transformHostPackageJson,
  transformHostRootTsx,
} from "./host";

type HostPackageJson = {
  dependencies?: Record<string, string | undefined>;
  federation?: {
    remotes?: Record<string, unknown>;
  };
};

const hostRoot = "apps/applications/studio-manager/host";
const packageJsonPath = `${hostRoot}/package.json`;
const rootTsxPath = `${hostRoot}/src/Root.tsx`;
const modulesPath = `${hostRoot}/src/modules.d.ts`;

function createHostTree(): Tree {
  const tree = createTreeWithEmptyWorkspace();

  tree.write(
    packageJsonPath,
    JSON.stringify(
      {
        name: "@bsport/sm-host",
        dependencies: {
          "@bsport/sm-referral-program": "workspace:*",
          "@bsport/sm-marketing-notification": "workspace:*",
          react: "^19.2.0",
        },
        federation: {
          devPort: 4000,
          remotes: {
            "sm-member-list": {
              devPort: 4100,
              watchPath: "apps/applications/studio-manager/member-list",
            },
            "sm-giftcard": {
              devPort: 4150,
              watchPath: "apps/applications/studio-manager/giftcard",
            },
            "sm-order": {
              devPort: 4151,
              watchPath: "apps/applications/studio-manager/order",
            },
          },
        },
      },
      null,
      2,
    ),
  );

  tree.write(
    rootTsxPath,
    `import { lazy } from "react";

const Giftcard = lazy(() => import("sm-giftcard/App"));
const Order = lazy(() => import("sm-order/App"));
const ReferralProgram = lazy(() => import("@bsport/sm-referral-program"));
`,
  );

  tree.write(
    modulesPath,
    `type BaseApp = {
  App: unknown;
};

declare module "sm-giftcard/App" {
  const App: BaseApp["App"];
  export default App;
}

declare module "sm-order/App" {
  const App: BaseApp["App"];
  export default App;
}
`,
  );

  return tree;
}

describe("host transforms", () => {
  it("transformHostPackageJson adds dependency and removes federation remote", () => {
    const tree = createHostTree();

    transformHostPackageJson(
      tree,
      hostRoot,
      "sm-giftcard",
      "@bsport/sm-giftcard",
    );

    const packageJson = readJson<HostPackageJson>(tree, packageJsonPath);

    expect(packageJson.dependencies?.["@bsport/sm-giftcard"]).toBe(
      "workspace:*",
    );
    expect(packageJson.federation?.remotes?.["sm-giftcard"]).toBeUndefined();
    expect(packageJson.federation?.remotes?.["sm-member-list"]).toBeDefined();
  });

  it("transformHostRootTsx updates the lazy import", () => {
    const tree = createHostTree();

    transformHostRootTsx(tree, hostRoot, "sm-giftcard", "@bsport/sm-giftcard");

    const rootTsx = tree.read(rootTsxPath, "utf-8");

    expect(rootTsx).toContain('import("@bsport/sm-giftcard")');
    expect(rootTsx).not.toContain('import("sm-giftcard/App")');
    expect(rootTsx).toContain('import("@bsport/sm-referral-program")');
  });

  it("transformHostModulesDts removes the declaration block", () => {
    const tree = createHostTree();

    transformHostModulesDts(tree, hostRoot, "sm-giftcard");

    const modulesDts = tree.read(modulesPath, "utf-8");

    expect(modulesDts).not.toContain('"sm-giftcard/App"');
    expect(modulesDts).toContain('"sm-order/App"');
  });

  it("transformHostPackageJson preserves other dependencies", () => {
    const tree = createHostTree();

    transformHostPackageJson(
      tree,
      hostRoot,
      "sm-giftcard",
      "@bsport/sm-giftcard",
    );

    const packageJson = readJson<HostPackageJson>(tree, packageJsonPath);

    expect(packageJson.dependencies?.react).toBe("^19.2.0");
    expect(packageJson.dependencies?.["@bsport/sm-referral-program"]).toBe(
      "workspace:*",
    );
    expect(
      packageJson.dependencies?.["@bsport/sm-marketing-notification"],
    ).toBe("workspace:*");
  });
});
