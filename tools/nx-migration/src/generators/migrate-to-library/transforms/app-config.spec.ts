import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { describe, expect, it } from "vitest";

import { transformAppPackageJson, transformViteConfig } from "./app-config";

const appRoot = "apps/applications/studio-manager/buyables/giftcard";

const packageJsonBefore = `{
  "name": "@bsport/sm-giftcard",
  "type": "module",
  "scripts": {
    "build": "tsc -b && vite build --logLevel warn",
    "build:preview": "vite build --mode preview",
    "ci:compile": "tsc -b",
    "dev": "concurrently \\\"pnpm run --silent -w federate:navigation\\\" \\\"vite\\\"",
    "dev:single": "vite"
  },
  "dependencies": {
    "@bsport/currency": "workspace:*",
    "@bsport/fetch": "workspace:*"
  },
  "devDependencies": {
    "@bsport/config-federation": "workspace:*",
    "@bsport/config-eslint-react": "workspace:*",
    "vite": "^5.4.11"
  },
  "peerDependencies": {
    "@bsport/i18n": "workspace:*",
    "react": "^19.2.0"
  },
  "federation": {
    "devPort": 4150,
    "exposes": {
      "./App": "./src/App"
    },
    "remotes": {
      "sm-navigation-sidebar": {
        "devPort": 4050,
        "watchPath": "../../navigation-sidebar/src/**/*"
      }
    }
  }
}
`;

const packageJsonAlreadyMigrated = `{
  "name": "@bsport/sm-giftcard",
  "type": "module",
  "exports": {
    ".": {
      "types": "./build/lib.es.d.ts",
      "import": "./build/lib.es.js"
    }
  },
  "main": "build/lib.es.js",
  "module": "build/lib.es.js",
  "types": "build/lib.es.d.ts",
  "scripts": {
    "build": "tsc -b && vite build --mode production --logLevel warn"
  },
  "devDependencies": {
    "@bsport/config-library": "workspace:*",
    "vite": "^5.4.11"
  },
  "dependencies": {
    "@bsport/currency": "workspace:*",
    "@bsport/fetch": "workspace:*"
  },
  "peerDependencies": {
    "@bsport/i18n": "workspace:*",
    "react": "^19.2.0"
  },
  "federation": {
    "devPort": 4150,
    "exposes": {
      "./App": "./src/App"
    },
    "remotes": {
      "sm-navigation-sidebar": {
        "devPort": 4050,
        "watchPath": "../../navigation-sidebar/src/**/*"
      }
    }
  }
}
`;

const viteConfigBefore = `import { defineConfig } from "vite";
import { getConfig } from "@bsport/config-federation";
import packageJson from "./package.json";

export default defineConfig(({ mode }) => {
  return getConfig({
    mode,
    packageJson,
    appType: "buyables",
    rootDir: __dirname,
  });
});
`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(
  tree: ReturnType<typeof createTreeWithEmptyWorkspace>,
  path: string,
): string {
  const content = tree.read(path, "utf-8");
  if (content === null) {
    throw new Error(`Expected file at ${path}`);
  }
  return content;
}

function readJsonObject(
  tree: ReturnType<typeof createTreeWithEmptyWorkspace>,
  path: string,
): Record<string, unknown> {
  const parsed: unknown = JSON.parse(readText(tree, path));
  if (!isRecord(parsed)) {
    throw new Error(`Expected JSON object at ${path}`);
  }
  return parsed;
}

function setupTreeWithPackageJson(content: string) {
  const tree = createTreeWithEmptyWorkspace();
  tree.write(`${appRoot}/package.json`, content);
  return tree;
}

function setupTreeWithViteConfig(content: string) {
  const tree = createTreeWithEmptyWorkspace();
  tree.write(`${appRoot}/vite.config.ts`, content);
  return tree;
}

describe("transformAppPackageJson", () => {
  it("transformAppPackageJson adds exports, main, module, types fields", () => {
    const tree = setupTreeWithPackageJson(packageJsonBefore);

    transformAppPackageJson(tree, appRoot);

    const transformed = readJsonObject(tree, `${appRoot}/package.json`);
    expect(transformed.exports).toEqual({
      ".": {
        types: "./build/lib.es.d.ts",
        import: "./build/lib.es.js",
      },
    });
    expect(transformed.main).toBe("build/lib.es.js");
    expect(transformed.module).toBe("build/lib.es.js");
    expect(transformed.types).toBe("build/lib.es.d.ts");
  });

  it("transformAppPackageJson swaps config-federation → config-library in devDependencies", () => {
    const tree = setupTreeWithPackageJson(packageJsonBefore);

    transformAppPackageJson(tree, appRoot);

    const transformed = readJsonObject(tree, `${appRoot}/package.json`);
    const devDependencies = transformed.devDependencies;
    if (!isRecord(devDependencies)) {
      throw new Error("Expected devDependencies object");
    }

    expect(devDependencies["@bsport/config-federation"]).toBeUndefined();
    expect(devDependencies["@bsport/config-library"]).toBe("workspace:*");
  });

  it("transformAppPackageJson adds --mode production to build script", () => {
    const tree = setupTreeWithPackageJson(packageJsonBefore);

    transformAppPackageJson(tree, appRoot);

    const transformed = readJsonObject(tree, `${appRoot}/package.json`);
    const scripts = transformed.scripts;
    if (!isRecord(scripts)) {
      throw new Error("Expected scripts object");
    }

    expect(scripts.build).toBe(
      "tsc -b && vite build --mode production --logLevel warn",
    );
  });

  it("transformAppPackageJson preserves federation block", () => {
    const tree = setupTreeWithPackageJson(packageJsonBefore);
    const before = readJsonObject(tree, `${appRoot}/package.json`);

    transformAppPackageJson(tree, appRoot);

    const after = readJsonObject(tree, `${appRoot}/package.json`);

    expect(after.federation).toEqual(before.federation);
  });

  it("transformAppPackageJson does NOT touch dependencies or peerDependencies", () => {
    const tree = setupTreeWithPackageJson(packageJsonBefore);
    const before = readJsonObject(tree, `${appRoot}/package.json`);

    transformAppPackageJson(tree, appRoot);

    const after = readJsonObject(tree, `${appRoot}/package.json`);

    expect(after.dependencies).toEqual(before.dependencies);
    expect(after.peerDependencies).toEqual(before.peerDependencies);
  });

  it("transformAppPackageJson is idempotent (already-migrated content unchanged)", () => {
    const tree = setupTreeWithPackageJson(packageJsonAlreadyMigrated);

    transformAppPackageJson(tree, appRoot);
    const once = readJsonObject(tree, `${appRoot}/package.json`);

    transformAppPackageJson(tree, appRoot);
    const twice = readJsonObject(tree, `${appRoot}/package.json`);

    expect(twice).toEqual(once);
  });
});

describe("transformViteConfig", () => {
  it("transformViteConfig swaps getConfig → getLibConfig and import path", () => {
    const tree = setupTreeWithViteConfig(viteConfigBefore);

    transformViteConfig(tree, appRoot);

    const transformed = readText(tree, `${appRoot}/vite.config.ts`);
    expect(transformed).toContain(
      'import { getLibConfig } from "@bsport/config-library"',
    );
    expect(transformed).toContain("return getLibConfig({");
    expect(transformed).not.toContain("@bsport/config-federation");
  });

  it("transformViteConfig preserves appType value", () => {
    const tree = setupTreeWithViteConfig(viteConfigBefore);

    transformViteConfig(tree, appRoot);

    const transformed = readText(tree, `${appRoot}/vite.config.ts`);
    expect(transformed).toContain('appType: "buyables"');
  });
});
