import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

function discoverEntries(): Record<string, string> {
  const srcDir = path.resolve(__dirname, "src");
  const entries: Record<string, string> = {
    index: path.resolve(srcDir, "index.ts"),
  };

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (
      entry.isDirectory() &&
      fs.existsSync(path.resolve(srcDir, entry.name, "index.ts"))
    ) {
      entries[entry.name] = path.resolve(srcDir, entry.name, "index.ts");
    }
  }

  return entries;
}

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
      entry: discoverEntries(),
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
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
