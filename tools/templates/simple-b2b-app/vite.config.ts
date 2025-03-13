import type { UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import dts from "vite-plugin-dts";
import federation from "@originjs/vite-plugin-federation";
import { resolve } from "path";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import {
  getAppPort,
  getLocalFederationRemotes,
  type APPLICATION,
} from "@bsport/config-federation";

/**
 * Application name used for federation. Must also be present in @bsport/config-federation to work.
 */
const APP_NAME: APPLICATION = "simple-b2b-app";

// https://vite.dev/config/
const config: UserConfig = {
  server: {
    port: getAppPort(APP_NAME),
  },
  preview: {
    port: getAppPort(APP_NAME),
  },
  plugins: [
    nxViteTsPaths(),
    svgr(),
    react(),
    dts({ insertTypesEntry: true }),
    federation({
      name: APP_NAME,
      filename: "module.js",
      shared: ["react", "react-dom"],
      remotes: getLocalFederationRemotes(),
      exposes: {
        "./App": "./src/App",
        "./languageSwitcher": "./src/utils/languageSwitcher",
      },
    }),
  ],
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  build: {
    rollupOptions: {
      external: ["react", "react-dom", "tailwindcss"],
    },
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

export default config;
