import path from "path";
import { defineConfig, loadEnv } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": JSON.stringify({
        VITE_MIXPANEL_TOKEN_DEV: env.VITE_MIXPANEL_TOKEN_DEV,
        VITE_MIXPANEL_TOKEN_PRODUCTION: env.VITE_MIXPANEL_TOKEN_PRODUCTION,
      }),
    },
    plugins: [
      dts({
        rollupTypes: true, // Don't emit extra .d.ts files
        insertTypesEntry: true, // Generates a types entry file
      }),
    ],
    build: {
      outDir: "build",
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"), // Entry point of your library
        formats: ["es"], // Specify the output formats
        fileName: (format) => `lib.${format}.js`, // Customize the output file name
      },
    },
    resolve: {
      alias: {
        "#src": path.resolve(__dirname, "src"),
      },
    },
  };
});
