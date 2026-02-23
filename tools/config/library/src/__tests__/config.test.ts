import { beforeEach, describe, expect, it, vi } from "vitest";

import { getLibConfig } from "../config.js";

vi.mock("@bsport/config-federation", () => ({
  getConfig: vi.fn().mockReturnValue({ name: "federation-config" }),
}));
vi.mock("vite-plugin-dts", () => ({
  default: vi.fn().mockReturnValue({ name: "vite-plugin-dts" }),
}));

type ConfigInput = Parameters<typeof getLibConfig>[0];

const mockPackageJson: ConfigInput["packageJson"] = {
  name: "@bsport/sm-marketing-notification",
  dependencies: {},
  peerDependencies: {
    react: "^19.2.0",
    "react-dom": "^19.2.0",
  },
  federation: {
    devPort: 4306,
    exposes: {
      "./App": "./src/App",
    },
  },
};

const createConfig = (overrides: Partial<ConfigInput> = {}): ConfigInput => ({
  mode: "development",
  appType: "customer-data-platform",
  rootDir: "/test/root",
  packageJson: mockPackageJson,
  ...overrides,
});

describe("getLibConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates development mode to federation", async () => {
    const config = createConfig({ mode: "development" });
    const result = getLibConfig(config);
    const { getConfig } = await import("@bsport/config-federation");

    expect(getConfig).toHaveBeenCalledWith({
      mode: "development",
      packageJson: {
        name: config.packageJson.name,
        dependencies: config.packageJson.dependencies,
        federation: config.packageJson.federation,
      },
      appType: config.appType,
      rootDir: config.rootDir,
    });
    expect(result).toEqual({ name: "federation-config" });
  });

  it("delegates preview mode to federation", async () => {
    const config = createConfig({ mode: "preview" });
    const result = getLibConfig(config);
    const { getConfig } = await import("@bsport/config-federation");

    expect(getConfig).toHaveBeenCalledWith({
      mode: "preview",
      packageJson: {
        name: config.packageJson.name,
        dependencies: config.packageJson.dependencies,
        federation: config.packageJson.federation,
      },
      appType: config.appType,
      rootDir: config.rootDir,
    });
    expect(result).toEqual({ name: "federation-config" });
  });

  it("returns production library build config", () => {
    const config = getLibConfig(createConfig({ mode: "production" }));

    expect(config.build?.lib).toEqual({
      entry: "/test/root/src/App.tsx",
      fileName: "lib.es",
      formats: ["es"],
    });
  });

  it("externalizes peer dependencies and jsx runtimes in production", () => {
    const config = getLibConfig(createConfig({ mode: "production" }));

    expect(config.build?.rollupOptions?.external).toEqual(
      expect.arrayContaining([
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ]),
    );
  });

  it("adds react banner in production output", () => {
    const config = getLibConfig(createConfig({ mode: "production" }));

    expect(config.build?.rollupOptions?.output).toEqual({
      banner: 'import * as React from "react";',
    });
  });

  it("enables sourcemap in production", () => {
    const config = getLibConfig(createConfig({ mode: "production" }));

    expect(config.build?.sourcemap).toBe(true);
  });

  it("defines namespace key from package name", () => {
    const config = getLibConfig(createConfig({ mode: "production" }));

    expect(config.define).toHaveProperty("__MARKETING_NOTIFICATION__");
  });

  it("rejects invalid input when required fields are missing", () => {
    const invalidConfig = createConfig();
    Reflect.deleteProperty(invalidConfig, "mode");

    expect(() => getLibConfig(invalidConfig)).toThrow();
  });

  it("sets #src resolve alias", () => {
    const config = getLibConfig(createConfig({ mode: "production" }));

    expect(config.resolve).toEqual({
      alias: {
        "#src": "/test/root/src",
      },
    });
  });
});
