import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import path from "node:path";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";

import { generatedAssetsPlugin } from "./lib/vite-generated-assets-plugin";
import { rehypeHeadingAnchorPlugins } from "./lib/rehype-heading-anchor.js";

const GENERATED_DIR = path.resolve(__dirname, ".generated");

export default defineConfig({
  root: __dirname,
  base: process.env.VITE_BASE ?? "/",
  plugins: [
    generatedAssetsPlugin(GENERATED_DIR),
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        rehypePlugins: rehypeHeadingAnchorPlugins,
      }),
    },
    react({ include: /\.(jsx|tsx|js|ts)$/ }),
  ],
  resolve: {
    alias: {
      "#src": path.resolve(__dirname),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  css: {
    postcss: path.resolve(__dirname, "postcss.config.mjs"),
  },
  server: {
    port: 4070,
  },
  preview: {
    port: 4070,
  },
});
