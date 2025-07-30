import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Global configuration that applies to all projects
    globals: true,

    // Projects configuration (replaces deprecated workspace)
    projects: [
      // Use glob patterns to discover all vitest configs in packages
      "packages/**/vitest.config.ts",
      // Use glob patterns to discover all vitest configs in tools
      "tools/**/vitest.config.ts",
    ],

    // Configuration for coverage
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [...defaultExclude, "build/**", "dist/**"],
    },
  },
});
