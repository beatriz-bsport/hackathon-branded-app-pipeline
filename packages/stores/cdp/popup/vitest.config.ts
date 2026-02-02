import { createVitestConfig } from "@bsport/config-vitest";

export default createVitestConfig(__dirname, {
  test: {
    setupFiles: ["./src/__tests__/setup.ts"],
  },
});
