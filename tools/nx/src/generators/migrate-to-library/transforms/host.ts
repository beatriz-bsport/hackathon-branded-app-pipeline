import { Tree, updateJson } from "@nx/devkit";

type HostPackageJson = {
  dependencies?: Record<string, string | undefined>;
  federation?: {
    remotes?: Record<string, unknown>;
  };
  [key: string]: unknown;
};

export function transformHostPackageJson(
  tree: Tree,
  hostRoot: string,
  appName: string,
  packageName: string,
): void {
  updateJson(tree, `${hostRoot}/package.json`, (json: HostPackageJson) => {
    if (json.dependencies === undefined) {
      json.dependencies = {};
    }

    json.dependencies[packageName] = "workspace:*";

    if (json.federation?.remotes !== undefined) {
      delete json.federation.remotes[appName];
    }

    return json;
  });
}

export function transformHostRootTsx(
  tree: Tree,
  hostRoot: string,
  appName: string,
  packageName: string,
): void {
  const rootPath = `${hostRoot}/src/Root.tsx`;
  const content = tree.read(rootPath, "utf-8");

  if (content === null) {
    return;
  }

  const transformed = content.replace(
    `import("${appName}/App")`,
    `import("${packageName}")`,
  );

  tree.write(rootPath, transformed);
}

export function transformHostModulesDts(
  tree: Tree,
  hostRoot: string,
  appName: string,
): void {
  const modulesPath = `${hostRoot}/src/modules.d.ts`;
  const content = tree.read(modulesPath, "utf-8");

  if (content === null) {
    return;
  }

  const moduleDeclarationPattern = new RegExp(
    `\\ndeclare module "${appName}\\/App" \\{[^}]+\\}`,
    "g",
  );
  const transformed = content.replace(moduleDeclarationPattern, "");

  tree.write(modulesPath, transformed);
}
