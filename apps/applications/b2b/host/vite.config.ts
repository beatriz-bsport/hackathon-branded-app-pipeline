import { federation } from "@module-federation/vite";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";
import restart from "vite-plugin-restart";
import svgr from "vite-plugin-svgr";
import topLevelAwait from "vite-plugin-top-level-await";

import { dependencies } from "./package.json";

const APP_NAME = "sm-host";

export default defineConfig(({ mode }) => {
  /**
   * TODO: the main purpose is to test the deployment so for this we
   * want a hardcoded feature branch URL
   */
  const remoteEntryUrl =
    mode === "development"
      ? "http://localhost:5000/remoteEntry.js"
      : "/v2/apps/navigation-sidebar/remoteEntry.js";

  const base = mode === "development" ? "/" : "/v2/";
  const i18nUrl =
    mode === "development" ? "http://localhost:3000" : base.slice(0, -1); // remove trailing slash

  return {
    base,
    define: {
      "import.meta.env.VITE_I18N_NAMESPACE_PREFIX": JSON.stringify(APP_NAME),
      "import.meta.env.VITE_APPLICATION_BASE_URL": JSON.stringify(i18nUrl),
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
    plugins: [
      nxViteTsPaths(),
      svgr(),
      react(),
      federation({
        name: APP_NAME,
        filename: "remoteEntry.js",
        manifest: {
          fileName: "mf-manifest.json",
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: dependencies["react"],
          },
          "react-dom": {
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
          "@bsport/i18n": {
            singleton: true,
          },
          "@bsport/kaizen-primitive-core": {
            singleton: true,
          },
        },
        remotes: {
          "sm-navigation-sidebar": {
            name: "sm-navigation-sidebar",
            entry: remoteEntryUrl,
            type: "module",
          },
        },
      }),
      topLevelAwait(),
      restart({
        restart: ["../navigation-sidebar/src/**/*"],
      }),
    ],
    build: {
      cssCodeSplit: false,
      sourcemap: true,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        "#src": resolve(__dirname, "src"),
      },
    },
  };
});
