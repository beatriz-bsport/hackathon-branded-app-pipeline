import { createVitestBrowserConfig } from "@bsport/config-vitest";

export default createVitestBrowserConfig(__dirname, {
  test: {
    setupFiles: ["./src/__tests__/setup.ts", "./src/__tests__/test-setup.ts"],
  },
});
