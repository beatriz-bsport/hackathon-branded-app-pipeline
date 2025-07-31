import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import tailwindcss from "tailwindcss";
import type { UserConfig } from "vite";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

import pkg from "./package.json";

// https://vitejs.dev/config/
const config: UserConfig = {
  build: {
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: pkg.name,
      formats: ["es"], // Specify the output formats
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "tailwindcss", "@bsport/i18n"],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  /*plugins: [svgr(), react(), dts({ rollupTypes: true })],*/
  plugins: [tsconfigPaths(), svgr(), react(), dts({ insertTypesEntry: true })],
  resolve: {
    alias: {
      "#src": resolve(__dirname, "src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
};

export default config;
