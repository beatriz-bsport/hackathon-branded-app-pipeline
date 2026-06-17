import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  define: {
    "process.env": "import.meta.env",
  },
  plugins: [
    dts({
      rollupTypes: false, // Generate individual .d.ts files with source maps
      insertTypesEntry: true, // Generates a types entry file
    }),
  ],
  build: {
    outDir: "build",
    lib: {
      entry: {
        // -> build/lib.es.js (unchanged: keeps `.`, `./*`, `./constants`, `./types` valid)
        "lib.es": path.resolve(__dirname, "src/index.ts"),
        // -> build/invoice/mocks.js (dev-only mocks, kept out of the shared lib bundle)
        "invoice/mocks": path.resolve(__dirname, "src/invoice/mocks/index.ts"),
      },
      formats: ["es"], // Specify the output formats
      fileName: (_format, entryName) => `${entryName}.js`, // Customize the output file name
    },
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: ["react", "react/jsx-dev-runtime", "react/jsx-runtime", "msw"],
    },
  },
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "src"),
    },
  },
});
