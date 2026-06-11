import { resolve } from "path";
import { type ViteUserConfig, defineConfig, mergeConfig } from "vitest/config";

const DEFAULT_SOURCE_DIRECTORY = "./src";
const FILES_TO_INCLUDE = [
  "src/__tests__/**/*.test.ts",
  "src/__tests__/**/*.test.tsx",
  "src/**/__tests__/**/*.test.ts",
  "src/**/__tests__/**/*.test.tsx",
];
const FILES_TO_EXCLUDE_FROM_COVERAGE = [
  "src/__tests__/**",
  "src/**/__tests__/**",
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
        exclude: FILES_TO_EXCLUDE_FROM_COVERAGE,
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
        exclude: FILES_TO_EXCLUDE_FROM_COVERAGE,
      },
    },
  });

  if (config) {
    return mergeConfig(base, defineConfig(config));
  }

  return base;
};
