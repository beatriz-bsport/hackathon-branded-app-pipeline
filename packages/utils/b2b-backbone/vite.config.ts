import { defineConfig } from "vite";
import path from "path";
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
    outDir: "build",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // Entry point of your library
      formats: ["es", "umd"], // Specify the output formats
      name: "lib", // Required for UMD formats
      fileName: (format) => `lib.${format}.js`, // Customize the output file name
    },
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: ["react", "@bsport/kaizen-primitive-core", "@bsport/i18n"],
      output: {
        globals: {
          react: "React",
          "@bsport/kaizen-primitive-core": "KaizenPrimitiveCore",
          "@bsport/i18n": "I18n",
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
