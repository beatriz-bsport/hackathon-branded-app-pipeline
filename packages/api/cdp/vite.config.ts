import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

function discoverEntries(): Record<string, string> {
  const srcDir = path.resolve(__dirname, "src");
  const entries: Record<string, string> = {};

  // The package has no root barrel (ADR-0001 Rule 3); only include a root
  // `index` entry if one exists. Resource subpaths are discovered below.
  const rootIndex = path.resolve(srcDir, "index.ts");
  if (fs.existsSync(rootIndex)) {
    entries.index = rootIndex;
  }

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (
      entry.isDirectory() &&
      fs.existsSync(path.resolve(srcDir, entry.name, "index.ts"))
    ) {
      entries[entry.name] = path.resolve(srcDir, entry.name, "index.ts");
    }

    // Pick up an optional `mocks` subfolder (e.g. inbox/mocks) so it can be
    // exposed as a dedicated, dev-only subpath without leaking into the
    // module's main barrel.
    const mocksIndex = path.resolve(srcDir, entry.name, "mocks", "index.ts");
    if (entry.isDirectory() && fs.existsSync(mocksIndex)) {
      entries[`${entry.name}/mocks`] = mocksIndex;
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
      exclude: ["src/**/__tests__/**"],
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
      external: ["react", "react/jsx-dev-runtime", "react/jsx-runtime", "msw"],
    },
  },
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "src"),
    },
  },
});
