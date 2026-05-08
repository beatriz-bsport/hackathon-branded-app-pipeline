import { VersionActions } from "nx/release";

const rootManifestPath = "package.json";

type SourceManifestTree = Parameters<
  VersionActions["readCurrentVersionFromSourceManifest"]
>[0];
type RegistryMetadata = Parameters<
  VersionActions["readCurrentVersionFromRegistry"]
>[1];
type DependencyProjectGraph = Parameters<
  VersionActions["readCurrentVersionOfDependency"]
>[1];

type RootPackageJson = {
  version?: unknown;
};

export default class TagVersionActions extends VersionActions {
  validManifestFilenames = [rootManifestPath];

  async readCurrentVersionFromRegistry(
    _tree: SourceManifestTree,
    _currentVersionResolverMetadata: RegistryMetadata,
  ) {
    return null;
  }

  async readCurrentVersionFromSourceManifest(tree: SourceManifestTree) {
    if (!tree.exists(rootManifestPath)) {
      return null;
    }

    const packageJsonContents = tree.read(rootManifestPath, "utf-8");

    if (!packageJsonContents) {
      return null;
    }

    const packageJson = JSON.parse(packageJsonContents) as RootPackageJson;

    if (typeof packageJson.version !== "string") {
      return null;
    }

    return {
      currentVersion: packageJson.version,
      manifestPath: rootManifestPath,
    };
  }

  async readCurrentVersionOfDependency(
    _tree: SourceManifestTree,
    _projectGraph: DependencyProjectGraph,
    _dependencyProjectName: string,
  ) {
    return {
      currentVersion: null,
      dependencyCollection: null,
    };
  }

  async updateProjectDependencies(
    _tree: SourceManifestTree,
    _projectGraph: DependencyProjectGraph,
    _dependenciesToUpdate: Record<string, string>,
  ) {
    return [];
  }

  async updateProjectVersion(
    _tree: SourceManifestTree,
    _newVersion: string,
  ) {
    return [];
  }
}
