import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  define: {
    "process.env": "import.meta.env",
  },
  plugins: [
    dts({
      rollupTypes: false, // Don't emit extra .d.ts files
      insertTypesEntry: true, // Generates a types entry file
    }),
  ],
  build: {
    outDir: "build",
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        "test-utils": path.resolve(__dirname, "src/test-utils.ts"),
      },
      formats: ["es"], // Specify the output formats
      fileName: (_format, entryName) => `${entryName}.js`, // Customize the output file name
    },
  },
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "src"),
    },
  },
});
