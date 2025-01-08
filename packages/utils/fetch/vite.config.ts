import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  define: {
    "process.env": "import.meta.env",
  },
  build: {
    outDir: "build",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // Entry point of your library
      formats: ["es", "umd"], // Specify the output formats
      name: "lib", // Required for UMD formats
    },
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: ["react"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "src"),
    },
  },
});
