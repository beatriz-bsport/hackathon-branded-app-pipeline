import { resolve } from "path";
import { type ViteUserConfig, defineConfig, mergeConfig } from "vitest/config";

const DEFAULT_SOURCE_DIRECTORY = "./src";
const FILES_TO_INCLUDE = [
  "src/__tests__/**/*.test.ts",
  "src/__tests__/**/*.test.tsx",
];

export const createVitestConfig = (
  dirname: string,
  config?: ViteUserConfig,
) => {
  const base = defineConfig({
    resolve: {
      alias: {
        "#src": resolve(dirname, DEFAULT_SOURCE_DIRECTORY),
      },
    },
    test: {
      globals: true,
      environment: "node",
      include: FILES_TO_INCLUDE,
      coverage: {
        include: ["src/**"],
        exclude: ["src/__tests__/**"],
      },
    },
  });

  if (config) {
    return mergeConfig(base, defineConfig(config));
  }

  return base;
};

export const createVitestBrowserConfig = (
  dirname: string,
  config?: ViteUserConfig,
) => {
  const base = defineConfig({
    resolve: {
      alias: {
        "#src": resolve(dirname, DEFAULT_SOURCE_DIRECTORY),
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      include: FILES_TO_INCLUDE,
      coverage: {
        include: ["src/**"],
        exclude: ["src/__tests__/**"],
      },
    },
  });

  if (config) {
    return mergeConfig(base, defineConfig(config));
  }

  return base;
};
