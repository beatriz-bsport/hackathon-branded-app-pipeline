import { federation } from "@module-federation/vite";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";
import restart from "vite-plugin-restart";
import svgr from "vite-plugin-svgr";
import topLevelAwait from "vite-plugin-top-level-await";

import { getConfig } from "@bsport/config-federation";

import packageJson from "./package.json";

export default defineConfig(({ mode }) => {
  const config = getConfig({
    mode,
    packageJson,
    appType: "hosts",
  });

  return {
    base: config.base,
    define: config.define,
    server: config.server,
    preview: config.preview,
    plugins: [
      nxViteTsPaths(),
      svgr(),
      react(),
      federation(config.federation),
      topLevelAwait(),
      restart({
        restart: config.pathsToWatch,
      }),
    ],
    build: {
      cssCodeSplit: false,
      sourcemap: true,
      emptyOutDir: true,
      target: "esnext",
    },
    resolve: {
      alias: {
        "#src": resolve(__dirname, "src"),
      },
    },
  };
});
