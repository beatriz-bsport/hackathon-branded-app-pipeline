import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { getConfig } from "@bsport/config-federation";

import packageJson from "./package.json";

const peerDependencies = Object.keys(packageJson.peerDependencies ?? {});
const jsxRuntimeExternals = ["react/jsx-runtime", "react/jsx-dev-runtime"];

export default defineConfig(({ mode }) => {
  if (mode === "production") {
    return {
      plugins: [
        dts({
          tsconfigPath: "./tsconfig.app.json",
          outDir: "build",
          entryRoot: "src",
          rollupTypes: true,
        }),
      ],
      resolve: {
        alias: {
          "#src": path.resolve(__dirname, "./src"),
        },
      },
      build: {
        outDir: "build",
        lib: {
          entry: path.resolve(__dirname, "src/App.tsx"),
          fileName: "lib.es",
          formats: ["es"],
        },
        rollupOptions: {
          external: [...peerDependencies, ...jsxRuntimeExternals],
          output: {
            banner: 'import * as React from "react";',
          },
        },
        sourcemap: true,
      },
    };
  }

  return getConfig({
    mode,
    packageJson,
    appType: "customer-data-platform",
    rootDir: __dirname,
  });
});
