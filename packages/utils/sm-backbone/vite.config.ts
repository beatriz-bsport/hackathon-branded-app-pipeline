import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  define: {
    "process.env": "import.meta.env",
  },
  plugins: [
    dts({
      rollupTypes: true, // Don't emit extra .d.ts files
      insertTypesEntry: true, // Generates a types entry file
    }),
  ],
  build: {
    // Enable source maps so breakpoints bind when this lib is consumed by apps
    sourcemap: true,
    outDir: "build",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // Entry point of your library
      formats: ["es"], // Specify the output formats
      fileName: (format) => `lib.${format}.js`, // Customize the output file name
    },
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: [
        "react",
        "react/jsx-dev-runtime",
        "react/jsx-runtime",
        "react-router",
        "react-router-dom",
        "@bsport/fetch",
        "@bsport/i18n",
        "@bsport/kaizen-primitive-core",
        "@bsport/use-async",
        "@unleash/proxy-client-react",
      ],
    },
  },
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "src"),
    },
  },
});
