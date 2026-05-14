import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import type { StorybookConfig } from "@storybook/react-vite";
import { existsSync } from "fs";
import { dirname, join, resolve } from "path";
import tailwindcss from "tailwindcss";
import { fileURLToPath } from "url";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

import { getMonorepoBasePathSync } from "@bsport/typescript-monorepo-utils";

const currentDir = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = getMonorepoBasePathSync();
const coreSrcDir = resolve(currentDir, "../../primitive/core/src");
const businessSrcDir = resolve(currentDir, "../../business/src");
const smSessionSrcDir = resolve(
  repoRoot,
  "apps/applications/studio-manager/booking/session/src",
);

const config: StorybookConfig = {
  stories: [
    // Primitive core components
    {
      directory: "../../primitive/core/src",
      files: "**/*.stories.@(js|jsx|ts|tsx|mdx)",
      titlePrefix: "Primitive",
    },
    // Business components package
    {
      directory: "../../business/src",
      files: "**/*.stories.@(js|jsx|ts|tsx|mdx)",
      titlePrefix: "Business",
    },
    // Studio Manager — booking/session app components
    {
      directory: smSessionSrcDir,
      files: "**/*.stories.@(js|jsx|ts|tsx|mdx)",
      titlePrefix: "Booking",
    },
  ],

  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@chromatic-com/storybook",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  core: {
    disableTelemetry: true,
  },

  features: {
    actions: true,
    controls: true,
  },

  viteFinal: async (config) => {
    // Set environment variable for business package i18n
    config.define = {
      ...config.define,
      "import.meta.env.VITE_I18N_NAMESPACE_PREFIX": JSON.stringify(
        "kaizen-business-components",
      ),
      // sm-session reads its i18n namespace prefix from a Vite-injected global
      // defined by getLibConfig in the app build. Storybook needs the same
      // shape so `__SESSION__.__I18N_NAMESPACE_PREFIX__` resolves at runtime.
      __SESSION__: JSON.stringify({
        __I18N_NAMESPACE_PREFIX__: "sm-session",
      }),
    };

    // Each package re-roots `#src/` at its own src directory; the importer
    // path tells us which root to use.
    const resolveKaizenSrc = () => ({
      name: "resolve-kaizen-src",
      enforce: "pre",
      resolveId(id: string, importer?: string) {
        if (!id.startsWith("#src/") || !importer) return null;

        const normalizedImporter = importer.replace(/\\/g, "/");

        const tryResolve = (rootDir: string): string => {
          const resolved = join(rootDir, id.replace("#src/", ""));
          for (const ext of [".ts", ".tsx"]) {
            const withExt = resolved + ext;
            if (existsSync(withExt)) {
              return withExt;
            }
          }
          if (existsSync(resolved)) {
            for (const index of ["index.ts", "index.tsx"]) {
              const indexPath = join(resolved, index);
              if (existsSync(indexPath)) {
                return indexPath;
              }
            }
          }
          return resolved;
        };

        if (normalizedImporter.includes("primitive/core")) {
          return tryResolve(coreSrcDir);
        }
        if (normalizedImporter.includes("studio-manager/booking/session/src")) {
          return tryResolve(smSessionSrcDir);
        }
        if (normalizedImporter.includes("business")) {
          return tryResolve(businessSrcDir);
        }
        return null;
      },
    });

    return mergeConfig(config, {
      plugins: [svgr(), nxViteTsPaths(), resolveKaizenSrc()],
      css: {
        postcss: {
          plugins: [tailwindcss()],
        },
      },
      optimizeDeps: {
        include: [
          ...(config.optimizeDeps?.include || []),
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
        ],
        esbuildOptions: {
          jsx: "automatic",
        },
      },
      build: {
        commonjsOptions: {
          include: [/node_modules/],
        },
      },
      esbuild: {
        jsx: "automatic",
      },
    });
  },

  docs: {},

  typescript: {
    // Disable docgen addon as it is not installed and does not support
    // usage of internal @bsport/i18n
    reactDocgen: false,
  },
};

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
