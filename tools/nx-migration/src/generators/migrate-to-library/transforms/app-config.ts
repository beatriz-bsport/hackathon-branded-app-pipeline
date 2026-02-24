import { Tree, logger, updateJson } from "@nx/devkit";

const BUILD_SCRIPT = "tsc -b && vite build --logLevel warn";
const BUILD_SCRIPT_WITH_PROD_MODE =
  "tsc -b && vite build --mode production --logLevel warn";

const FEDERATION_IMPORT =
  'import { getConfig } from "@bsport/config-federation"';
const LIBRARY_IMPORT = 'import { getLibConfig } from "@bsport/config-library"';

type PackageJsonLike = {
  exports?: {
    "."?: {
      types?: string;
      import?: string;
    };
  };
  main?: string;
  module?: string;
  types?: string;
  scripts?: {
    build?: string;
    [key: string]: string | undefined;
  };
  devDependencies?: {
    [key: string]: string | undefined;
  };
  nx?: {
    tags?: string[];
  };
  [key: string]: unknown;
};

export function transformAppPackageJson(tree: Tree, appRoot: string): void {
  updateJson(tree, `${appRoot}/package.json`, (json: PackageJsonLike) => {
    json.exports = {
      ".": {
        types: "./build/lib.es.d.ts",
        import: "./build/lib.es.js",
      },
    };
    json.main = "build/lib.es.js";
    json.module = "build/lib.es.js";
    json.types = "build/lib.es.d.ts";

    if (json.scripts?.build !== undefined) {
      if (!json.scripts.build.includes("--mode production")) {
        json.scripts.build = json.scripts.build.replace(
          BUILD_SCRIPT,
          BUILD_SCRIPT_WITH_PROD_MODE,
        );
      }
    }

    if (json.devDependencies === undefined) {
      json.devDependencies = { "@bsport/config-library": "workspace:*" };
    } else {
      delete json.devDependencies["@bsport/config-federation"];
      json.devDependencies["@bsport/config-library"] = "workspace:*";
    }

    if (json.nx?.tags !== undefined) {
      json.nx.tags = json.nx.tags.filter((tag) => tag !== "application:revamp");
    }

    return json;
  });

  logger.warn(
    `Review dependencies/peerDependencies for ${appRoot} — deps may need to be moved to peerDeps`,
  );
}

export function transformViteConfig(tree: Tree, appRoot: string): void {
  const viteConfigPath = `${appRoot}/vite.config.ts`;
  const content = tree.read(viteConfigPath, "utf-8");

  if (content === null) {
    return;
  }

  const transformed = content
    .replace(FEDERATION_IMPORT, LIBRARY_IMPORT)
    .replace("getConfig({", "getLibConfig({");

  tree.write(viteConfigPath, transformed);
}
