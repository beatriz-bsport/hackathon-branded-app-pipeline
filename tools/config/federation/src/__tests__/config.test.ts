import { describe, it } from "node:test";

import { getConfig } from "../config.js";
import { expect } from "./test-utils.js";

type ConfigInput = Parameters<typeof getConfig>[0];

describe("getConfig", async () => {
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
    packageJson: {
      ...mockPackageJson,
      federation: federationConfig
        ? { ...mockPackageJson.federation, ...federationConfig }
        : mockPackageJson.federation,
    },
    ...overrides,
  });

  await it("validates port ranges correctly", () => {
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

  await it("generates correct base URLs", () => {
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
    expect(prodHostConfig.base).toBe("/v2/");

    // Production mode, remote app
    const prodRemoteConfig = getConfig(
      createConfig({
        mode: "production",
      }),
    );
    expect(prodRemoteConfig.base).toBe("/v2/apps/navigation-sidebar/");
  });

  await it("generates correct federation config", () => {
    const config = getConfig(createConfig());

    expect(config.federation).toEqual({
      name: "sm-navigation-sidebar",
      filename: "remoteEntry.js",
      manifest: {
        fileName: "mf-manifest.json",
      },
      exposes: undefined,
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "@bsport/i18n": {
          singleton: true,
        },
        "@bsport/kaizen-primitive-core": {
          singleton: true,
        },
      },
    });
  });

  await it("correctly handles pathsToWatch from remotes", () => {
    // Test with no watchPath in remotes
    const configNoWatch = getConfig(
      createConfig({
        federationConfig: {
          remotes: mockRemotes,
        },
      }),
    );
    expect(configNoWatch.pathsToWatch).toEqual([]);

    // Test with watchPath in remotes
    const configWithWatch = getConfig(
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
    expect(configWithWatch.pathsToWatch).toEqual([
      "../remote-app",
      "../another-app",
    ]);

    // Test with mixed remotes (some with watchPath, some without)
    const configMixed = getConfig(
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
    expect(configMixed.pathsToWatch).toEqual(["../remote-app"]);
  });

  await it("handles exposes configuration correctly", () => {
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

    expect(configWithExposes.federation.exposes).toEqual({
      "./App": "./src/App.tsx",
      "./Button": "./src/components/Button.tsx",
    });

    // Test without exposes configuration
    const configWithoutExposes = getConfig(createConfig());
    expect(configWithoutExposes.federation.exposes).toBe(undefined);
  });

  await it("generates correct i18n URL and namespace prefix", () => {
    // Development mode
    const devConfig = getConfig(createConfig());
    expect(devConfig.define["import.meta.env.VITE_APPLICATION_BASE_URL"]).toBe(
      JSON.stringify("http://localhost:4000"),
    );
    expect(devConfig.define["import.meta.env.VITE_I18N_NAMESPACE_PREFIX"]).toBe(
      JSON.stringify("sm-navigation-sidebar"),
    );

    // Preview mode
    const previewConfig = getConfig(
      createConfig({
        mode: "preview",
      }),
    );
    expect(
      previewConfig.define["import.meta.env.VITE_APPLICATION_BASE_URL"],
    ).toBe(JSON.stringify("http://localhost:4000"));
    expect(
      previewConfig.define["import.meta.env.VITE_I18N_NAMESPACE_PREFIX"],
    ).toBe(JSON.stringify("sm-navigation-sidebar"));

    // Production mode
    const prodConfig = getConfig(
      createConfig({
        mode: "production",
        federationConfig: { remotes: mockRemotes },
      }),
    );
    expect(prodConfig.define["import.meta.env.VITE_APPLICATION_BASE_URL"]).toBe(
      JSON.stringify("/v2"),
    );
    expect(
      prodConfig.define["import.meta.env.VITE_I18N_NAMESPACE_PREFIX"],
    ).toBe(JSON.stringify("sm-navigation-sidebar"));
  });

  await it("generates correct remotes configuration", () => {
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
    expect(devConfig.federation.remotes).toEqual({
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
    expect(prodConfig.federation.remotes).toEqual({
      "sm-remote-app": {
        name: "sm-remote-app",
        type: "module",
        entry: "/v2/apps/remote-app/remoteEntry.js",
      },
    });
  });
});
