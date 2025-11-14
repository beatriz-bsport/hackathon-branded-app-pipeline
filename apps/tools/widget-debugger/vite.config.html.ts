import { defineConfig } from "vite";

// Static HTML configuration
export default defineConfig({
  root: "src/html",
  build: {
    outDir: "../../dist/html",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: "index.html",
        memberArea: "member-area.html",
        classes: "classes.html",
        membership: "membership.html",
        products: "products.html",
      },
    },
  },
  server: {
    port: 5500,
    cors: true,
    strictPort: false,
    hmr: false,
  },
});
