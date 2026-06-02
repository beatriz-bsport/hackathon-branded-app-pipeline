import mdx from "@mdx-js/rollup";
import type { Options as MdxOptions } from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import path from "node:path";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";

import { rehypeHeadingAnchorPlugins } from "./lib/rehype-heading-anchor.js";
import { generatedAssetsPlugin } from "./lib/vite-generated-assets-plugin";

const GENERATED_DIR = path.resolve(__dirname, ".generated");
const mdxOptions: MdxOptions = {
  remarkPlugins: [remarkFrontmatter, remarkGfm],
  rehypePlugins: rehypeHeadingAnchorPlugins as MdxOptions["rehypePlugins"],
};

export default defineConfig({
  root: __dirname,
  base: process.env.VITE_BASE ?? "/",
  plugins: [
    generatedAssetsPlugin(GENERATED_DIR),
    {
      enforce: "pre",
      ...mdx(mdxOptions),
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
