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
      entry: path.resolve(__dirname, "src/index.ts"), // Entry point of your library
      formats: ["es"], // Specify the output formats
      fileName: (format) => `lib.${format}.js`, // Customize the output file name
    },
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: ["react", "react/jsx-dev-runtime", "react/jsx-runtime"],
    },
  },
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "src"),
    },
  },
});
