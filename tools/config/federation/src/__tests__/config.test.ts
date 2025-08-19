import { beforeEach, describe, expect, it, vi } from "vitest";

import { getConfig } from "../config.js";

vi.mock("@module-federation/vite", () => ({
  federation: vi.fn().mockReturnValue([{ name: "module-federation" }]),
}));
vi.mock("@nx/vite/plugins/nx-tsconfig-paths.plugin", () => ({
  nxViteTsPaths: vi.fn().mockReturnValue({ name: "nx-tsconfig-paths" }),
}));
vi.mock("@vitejs/plugin-react-swc", () => ({
  default: vi.fn().mockReturnValue({ name: "vite:react-swc" }),
}));
vi.mock("vite-plugin-restart", () => ({
  default: vi.fn().mockReturnValue({ name: "vite-plugin-restart" }),
}));
vi.mock("vite-plugin-svgr", () => ({
  default: vi.fn().mockReturnValue({ name: "vite-plugin-svgr" }),
}));
vi.mock("vite-plugin-top-level-await", () => ({
  default: vi.fn().mockReturnValue({ name: "vite-plugin-top-level-await" }),
}));
vi.mock("../translationsWatcherPlugin", () => ({
  translationsWatcher: vi
    .fn()
    .mockReturnValue({ name: "translations-watcher" }),
}));

type ConfigInput = Parameters<typeof getConfig>[0];

describe("getConfig", () => {
  const mockRemotes = { "sm-remote-app": { devPort: 4001 } };

  const mockPackageJson: ConfigInput["packageJson"] = {
    name: "@bsport/sm-navigation-sidebar",
    dependencies: {
      react: "^18.0.0",
      "react-dom": "^18.0.0",
    },
    federation: {
      devPort: 4000,
      name: "sm-navigation-sidebar",
    },
  };

  const createConfig = ({
    federationConfig,
    ...overrides
  }: Partial<ConfigInput> & {
    federationConfig?: Partial<typeof mockPackageJson.federation>;
  } = {}): ConfigInput => ({
    appType: "hosts",
    mode: "development",
    rootDir: "/test/root",
    packageJson: {
      ...mockPackageJson,
      federation: federationConfig
        ? { ...mockPackageJson.federation, ...federationConfig }
        : mockPackageJson.federation,
    },
    ...overrides,
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("validates port ranges correctly", () => {
    // Valid port for hosts
    const regularValidConfig = createConfig();
    expect(() => getConfig(regularValidConfig)).not.toThrow();

    // Invalid port for hosts
    const invalidPortConfig = createConfig({
      federationConfig: { devPort: 5000 },
    });
    expect(() => getConfig(invalidPortConfig)).toThrow(
      /Port 5000 is outside the valid range/,
    );
  });

  it("generates correct base URLs", () => {
    // Development mode, host app
    const devHostConfig = getConfig(
      createConfig({
        federationConfig: { remotes: mockRemotes },
      }),
    );
    expect(devHostConfig.base).toBe("/");

    // Production mode, host app
    const prodHostConfig = getConfig(
      createConfig({
        mode: "production",
        federationConfig: { remotes: mockRemotes },
      }),
    );
    expect(prodHostConfig.base).toBe("/studio/");

    // Production mode, remote app
    const prodRemoteConfig = getConfig(
      createConfig({
        mode: "production",
        appType: "shared", // Something different than hosts
        federationConfig: { devPort: 4050 },
      }),
    );
    expect(prodRemoteConfig.base).toBe("/studio/apps/navigation-sidebar/");
  });

  it("generates correct federation config", async () => {
    getConfig(createConfig());

    const { federation } = await import("@module-federation/vite");

    expect(federation).toHaveBeenCalledTimes(1);
    expect(federation).toHaveBeenCalledWith({
      name: "sm-navigation-sidebar",
      filename: "remoteEntry.js",
      manifest: {
        fileName: "mf-manifest.json",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "react-router": {
          singleton: true,
          requiredVersion: "7.2.0",
        },
        zod: {
          singleton: true,
          requiredVersion: "^3.0.0",
        },
        "@bsport/analytics": {
          singleton: true,
        },
        "@bsport/i18n": {
          singleton: true,
        },
        "@bsport/kaizen-primitive-core": {
          singleton: true,
        },
        "@bsport/sm-backbone": {
          singleton: true,
        },
        "@bsport/form": {
          singleton: true,
        },
        "@bsport/envs": {
          singleton: true,
        },
        "@bsport/sentry": {
          singleton: true,
        },
      },
    });
  });

  it("correctly handles pathsToWatch from remotes", async () => {
    // Test with no watchPath in remotes
    getConfig(
      createConfig({
        federationConfig: {
          remotes: mockRemotes,
        },
      }),
    );
    const { default: restart } = await import("vite-plugin-restart");
    expect(restart).toHaveBeenCalledWith({
      restart: [],
    });

    // Test with watchPath in remotes
    getConfig(
      createConfig({
        federationConfig: {
          remotes: {
            "sm-remote-app": {
              devPort: 4001,
              watchPath: "../remote-app",
            },
            "sm-another-app": {
              devPort: 4002,
              watchPath: "../another-app",
            },
          },
        },
      }),
    );
    expect(restart).toHaveBeenCalledWith({
      restart: ["../remote-app", "../another-app"],
    });

    // Test with mixed remotes (some with watchPath, some without)
    getConfig(
      createConfig({
        federationConfig: {
          remotes: {
            "sm-remote-app": {
              devPort: 4001,
              watchPath: "../remote-app",
            },
            "sm-no-watch": { devPort: 4002 },
          },
        },
      }),
    );
    expect(restart).toHaveBeenCalledWith({
      restart: ["../remote-app"],
    });
  });

  it("handles exposes configuration correctly", () => {
    const configWithExposes = getConfig(
      createConfig({
        federationConfig: {
          exposes: {
            "./App": "./src/App.tsx",
            "./Button": "./src/components/Button.tsx",
          },
        },
      }),
    );

    expect(configWithExposes.federation?.exposes).toEqual({
      "./App": "./src/App.tsx",
      "./Button": "./src/components/Button.tsx",
    });

    // Test without exposes configuration
    const configWithoutExposes = getConfig(createConfig());
    expect(configWithoutExposes.federation?.exposes).toBe(undefined);
  });

  it("generates define variables", () => {
    // Development mode
    const devConfig = getConfig(createConfig());
    const variables = JSON.parse(devConfig.define["__NAVIGATION_SIDEBAR__"]);

    expect(variables["__APPLICATION_BASE_URL__"]).toBe("http://localhost:4000");
    expect(variables["__I18N_NAMESPACE_PREFIX__"]).toBe(
      "sm-navigation-sidebar",
    );
    expect(variables["__SENTRY_SCOPE_TAG__"]).toBe("sm-navigation-sidebar");
    expect(variables["__BASENAME__"]).toBe("");

    // Preview mode
    const previewConfig = getConfig(
      createConfig({
        mode: "preview",
      }),
    );
    const previewVariables = JSON.parse(
      previewConfig.define["__NAVIGATION_SIDEBAR__"],
    );

    expect(previewVariables["__APPLICATION_BASE_URL__"]).toBe(
      "http://localhost:4000",
    );
    expect(previewVariables["__I18N_NAMESPACE_PREFIX__"]).toBe(
      "sm-navigation-sidebar",
    );
    expect(previewVariables["__SENTRY_SCOPE_TAG__"]).toBe(
      "sm-navigation-sidebar",
    );
    expect(previewVariables["__BASENAME__"]).toBe("");

    // Production mode
    const prodConfig = getConfig(
      createConfig({
        mode: "production",
        federationConfig: { remotes: mockRemotes },
      }),
    );
    const prodVariables = JSON.parse(
      prodConfig.define["__NAVIGATION_SIDEBAR__"],
    );

    expect(prodVariables["__APPLICATION_BASE_URL__"]).toBe("/studio");
    expect(prodVariables["__I18N_NAMESPACE_PREFIX__"]).toBe(
      "sm-navigation-sidebar",
    );
    expect(prodVariables["__SENTRY_SCOPE_TAG__"]).toBe("sm-navigation-sidebar");
    expect(prodVariables["__BASENAME__"]).toBe("/studio/");
  });

  it("generates correct remotes configuration", () => {
    const mockPackageJsonWithRemotes = {
      ...mockPackageJson,
      federation: {
        ...mockPackageJson.federation,
        remotes: mockRemotes,
      },
    };

    // Development mode
    const devConfig = getConfig(
      createConfig({
        packageJson: mockPackageJsonWithRemotes,
      }),
    );
    expect(devConfig.federation?.remotes).toEqual({
      "sm-remote-app": {
        name: "sm-remote-app",
        type: "module",
        entry: "http://localhost:4001/remoteEntry.js",
      },
    });

    // Production mode
    const prodConfig = getConfig(
      createConfig({
        mode: "production",
        packageJson: mockPackageJsonWithRemotes,
      }),
    );
    expect(prodConfig.federation?.remotes).toEqual({
      "sm-remote-app": {
        name: "sm-remote-app",
        type: "module",
        entry: "/studio/apps/remote-app/remoteEntry.js",
      },
    });
  });

  it("generates correct build configuration", () => {
    const config = getConfig(createConfig());

    expect(config.build).toEqual({
      emptyOutDir: true,
      cssCodeSplit: true,
    });
  });

  it("generates correct resolve alias configuration", () => {
    const config = getConfig(createConfig());

    expect(config.resolve).toEqual({
      alias: {
        "#src": "/test/root/src",
      },
    });
  });

  it("configures server options correctly", () => {
    const config = getConfig(createConfig());

    // Verify server configuration has the correct port and strictPort settings
    expect(config.server).toEqual({
      port: 4000, // From mockPackageJson.federation.devPort
      strictPort: true,
    });

    // Test with a different port (within valid range for hosts)
    const configWithCustomPort = getConfig(
      createConfig({
        federationConfig: { devPort: 4049 },
      }),
    );
    expect(configWithCustomPort.server).toEqual({
      port: 4049,
      strictPort: true,
    });
  });

  it("configures all required plugins correctly", async () => {
    const config = getConfig(createConfig());

    // Import all mocked plugins
    const { nxViteTsPaths } = await import(
      "@nx/vite/plugins/nx-tsconfig-paths.plugin"
    );
    const { default: svgr } = await import("vite-plugin-svgr");
    const { default: react } = await import("@vitejs/plugin-react-swc");
    const { federation } = await import("@module-federation/vite");
    const { default: topLevelAwait } = await import(
      "vite-plugin-top-level-await"
    );
    const { default: restart } = await import("vite-plugin-restart");
    const { translationsWatcher } = await import(
      "../translationsWatcherPlugin"
    );

    // Verify all plugins are present
    expect(config.plugins).toHaveLength(7);

    // Verify each plugin is called once
    expect(nxViteTsPaths).toHaveBeenCalledOnce();
    expect(svgr).toHaveBeenCalledOnce();
    expect(react).toHaveBeenCalledOnce();
    expect(federation).toHaveBeenCalledOnce();
    expect(topLevelAwait).toHaveBeenCalledOnce();
    expect(restart).toHaveBeenCalledOnce();
    expect(translationsWatcher).toHaveBeenCalledOnce();
  });
});
