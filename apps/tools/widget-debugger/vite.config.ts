import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// SPA configuration
export default defineConfig({
  plugins: [react()],
  root: "src/spa",
  build: {
    outDir: "../../dist/spa",
    emptyOutDir: true,
  },
  server: {
    port: 3210,
  },
});
