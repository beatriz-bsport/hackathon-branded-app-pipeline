import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import type { StorybookConfig } from "@storybook/react-vite";
import { readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import tailwindcss from "tailwindcss";
import { fileURLToPath } from "url";
import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

const currentDir = fileURLToPath(new URL(".", import.meta.url));
const businessComponentsDir = join(currentDir, "../../business-components");
const coreSrcDir = resolve(currentDir, "../../primitive/core/src");

// Auto-discover all business component packages
const businessPackages = readdirSync(businessComponentsDir)
  .filter((name) => {
    const packagePath = join(businessComponentsDir, name);
    try {
      return (
        statSync(packagePath).isDirectory() &&
        name !== "node_modules" &&
        statSync(join(packagePath, "src/components")).isDirectory()
      );
    } catch {
      return false;
    }
  })
  .map((packageName) => ({
    directory: `../../business-components/${packageName}/src/components`,
    files: "**/*.stories.@(js|jsx|ts|tsx|mdx)",
    titlePrefix: `Business Components/${packageName.charAt(0).toUpperCase() + packageName.slice(1)}`,
  }));

const config: StorybookConfig = {
  stories: [
    // Primitive core components
    {
      directory: "../../primitive/core/src",
      files: "**/*.stories.@(js|jsx|ts|tsx|mdx)",
      titlePrefix: "Primitive",
    },
    // Business components - auto-discovered
    ...businessPackages,
  ],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
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

  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [svgr(), nxViteTsPaths()],
      css: {
        postcss: {
          plugins: [tailwindcss()],
        },
      },
      resolve: {
        alias: {
          "#src": coreSrcDir,
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
    }),

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
