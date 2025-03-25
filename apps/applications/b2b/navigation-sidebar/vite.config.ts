import type { UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import federation from "@originjs/vite-plugin-federation";
import { getAppPort, type APPLICATION } from "@bsport/config-federation";

/**
 * Application name used for federation. Must also be present in @bsport/config-federation to work.
 */
const APP_NAME: APPLICATION = "navigation-sidebar";

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
      exposes: {
        "./App": "./src/components/NavigationSidebar",
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
