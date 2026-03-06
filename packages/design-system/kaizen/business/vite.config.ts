import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react-swc";
import { globSync } from "glob";
import { resolve } from "path";
import tailwindcss from "tailwindcss";
import type { UserConfig } from "vite";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";

import pkg from "./package.json";

// https://vitejs.dev/config/
const config: UserConfig = {
  build: {
    outDir: "dist",
    lib: {
      /**
       * To maintain the main entry point to the package.
       */
      entry: resolve(__dirname, "./src/index.ts"),
      name: pkg.name,
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      /**
       * This glob pattern will detect index files to make sure
       * an index.js file is created, that consumers can import from.
       */
      input: Object.fromEntries(
        globSync("src/**/index.{ts,tsx}", {
          cwd: __dirname,
          ignore: ["src/**/*.spec.ts", "src/**/*.test.ts"],
        }).map((file) => {
          return [
            // Remove `src/` prefix and `.ts`/`.tsx` extensions
            file
              .replace(/^src\//, "")
              .replace(/\.tsx$/, "")
              .replace(/\.ts$/, ""),
            resolve(__dirname, file),
          ];
        }),
      ),
      /**
       * Ref: https://vite-workshop.vercel.app/preserve-modules
       * Preserve the modularity of the src folder.
       */
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js", // → Preserve filenames instead of using lib.fileName fct
      },
      external: [
        "react",
        "react-dom",
        "react/jsx-dev-runtime",
        "react/jsx-runtime",
        "tailwindcss",
        "@bsport/form",
        "@bsport/i18n",
        "@bsport/kaizen-primitive-core",
        "@tanstack/react-query",
      ],
    },
    sourcemap: true,
    emptyOutDir: true, // → Rebuild from a clean directory
    copyPublicDir: false, // → Don't copy public files that are used by storybook only
  },
  plugins: [
    nxViteTsPaths(),
    svgr(),
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
      tsconfigPath: resolve(__dirname, "./tsconfig.dts.json"),
      exclude: [
        "**/*.stories.tsx",
        "**/*.stories.ts",
        "**/*.test.tsx",
        "**/*.test.ts",
      ],
    }),
  ],
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
