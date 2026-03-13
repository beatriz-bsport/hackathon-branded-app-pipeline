import { defineConfig } from "vite";

import { getLibConfig } from "@bsport/config-library";

import packageJson from "./package.json";

export default defineConfig(({ mode }) => {
  return getLibConfig({
    mode,
    packageJson,
    appType: "financial-services",
    rootDir: __dirname,
  });
});
