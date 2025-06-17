import { defineConfig } from "vite";

import { getConfig } from "@bsport/config-federation";

import packageJson from "./package.json";

export default defineConfig(({ mode }) => {
  const mfeConfig = getConfig({
    mode,
    packageJson,
    appType: "shared",
    rootDir: __dirname,
  });

  if (mode === "compat") {
    return {
      ...mfeConfig,
      build: {
        ...mfeConfig.build,
        /**
         * We have to disable cssCodeSplit to be able to extract CSS to a separate file that can be imported
         * because of webpack as a host have some incompatibilities with cssCodeSplit
         */
        cssCodeSplit: false,
        // Explicitly extract CSS to a separate file that can be imported
        rollupOptions: {
          output: {
            assetFileNames: "assets/[name].[ext]",
            // Ensure the CSS file has a predictable name for easier importing
            chunkFileNames: "[name].[hash].js",
            entryFileNames: "[name].[hash].js",
          },
        },
      },
    };
  }

  return mfeConfig;
});
