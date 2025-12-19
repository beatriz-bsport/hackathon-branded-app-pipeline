import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  define: {
    "process.env": "import.meta.env",
  },
  plugins: [
    react(),
    dts({
      rollupTypes: false, // Don't emit extra .d.ts files
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
      external: ["react", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  },
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "src"),
    },
  },
});
