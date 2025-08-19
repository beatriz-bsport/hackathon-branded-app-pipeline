import { createVitestBrowserConfig } from "@bsport/config-vitest";

export default createVitestBrowserConfig(__dirname, {
  test: {
    setupFiles: ["./src/__tests__/msw-setup.ts"],
  },
});
