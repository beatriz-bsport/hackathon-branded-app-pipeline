import { defineConfig } from "vite";

import { getConfig } from "@bsport/config-federation";

import packageJson from "./package.json";

export default defineConfig(({ mode }) => {
  return getConfig({
    mode,
    packageJson,
    appType: "hosts",
    rootDir: __dirname,
    deploymentRelativeUrl: "/studio/",
  });
});
