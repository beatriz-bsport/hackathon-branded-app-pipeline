import type { UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tailwindcss from "tailwindcss";
import svgr from "vite-plugin-svgr";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import pkg from "./package.json";

// https://vitejs.dev/config/
const config: UserConfig = {
  build: {
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: pkg.name,
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "tailwindcss", "@bsport/i18n"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          tailwindcss: "tailwindcss",
          "@bsport/i18n": "BsportI18n",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  /*plugins: [svgr(), react(), dts({ rollupTypes: true })],*/
  plugins: [nxViteTsPaths(), svgr(), react(), dts({ insertTypesEntry: true })],
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
